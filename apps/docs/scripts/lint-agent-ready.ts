/**
 * Agent-readiness guard.
 *
 * Keeps the Mintlify agent-score setup from silently regressing as docs content
 * is added. It runs the SAME shared builders the route handlers use
 * (`buildLLMsIndexContent`, `buildLLMsSectionContent`, `getLLMsFullPages` in
 * `@/lib/llms`) so it measures exactly what agents fetch in production — no dev
 * server required. Follows the `lint-links.ts` pattern: register the fumadocs
 * loader, then dynamically import `@/lib/*`.
 *
 * See `.claude/skills/docs-agent-ready/SKILL.md` for the invariants and playbooks.
 */
import { register } from "node:module";

register("fumadocs-mdx/node/loader", import.meta.url);

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { source } = await import("@/lib/source");
const llms = await import("@/lib/llms");
const { getLLMText } = await import("@/lib/get-llm-text");
const { protectFencedCodeBlocks, protectInlineCode } = await import("@/lib/llm-markdown");
const { withDocsBasePath } = await import("@/lib/urls");
const { agentSkillMarkdown } = await import("@/lib/agent-skill");
const { mcpDiscoveryDocument } = await import("@/lib/mcp-discovery");

// Hardcode the production base URL. Byte budgets must be stable and match what
// runs in production, so this must NOT read NEXT_PUBLIC_PRISMA_URL — otherwise the
// budgets would vary by environment and the numbers would not match production.
const baseUrl = "https://www.prisma.io";

// Directory of this script (apps/docs/scripts); used for source-level guards.
const scriptDir = dirname(fileURLToPath(import.meta.url));

// Budgets. Agents commonly truncate large text feeds at ~100k chars; we hold a
// 50k safety budget for any single file, with earlier warnings so a section can
// be split before it becomes a hard failure.
const ROOT_FAIL = 50_000;
const ROOT_WARN = 35_000;
const SECTION_FAIL = 50_000;
const SECTION_WARN = 40_000;
const CATCHALL_WARN = 25;

const MCP_URL = "https://mcp.prisma.io/mcp";
const DIRECTIVE_MARKER = "> For the complete Prisma documentation index";
const REQUIRED_SKILL_KEYS = [
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
];

type Status = "pass" | "warn" | "fail";
const results: { status: Status; name: string; message: string }[] = [];
const pass = (name: string, message = "") => results.push({ status: "pass", name, message });
const warn = (name: string, message: string) => results.push({ status: "warn", name, message });
const fail = (name: string, message: string) => results.push({ status: "fail", name, message });

const size = (content: string) => Buffer.byteLength(content, "utf8");
const pageLink = (url: string) => `(${baseUrl}${withDocsBasePath(url)})`;

/**
 * Returns which required frontmatter keys are missing. Works both on a finished
 * skill string (parses the block between the first pair of `---` lines) and, as
 * a fallback, on raw TypeScript source where the frontmatter lives inside a
 * template literal (keys still start at column 0).
 */
function missingFrontmatterKeys(text: string): string[] {
  const fenced = text.match(/^---\n([\s\S]*?)\n---/m);
  const block = fenced ? fenced[1] : text;
  return REQUIRED_SKILL_KEYS.filter((key) => !new RegExp(`^${key}:`, "m").test(block));
}

const allPages = source.getPages();
const indexPages = llms.filterPagesForLLMsIndex(allPages);
const availableSections = llms.filterAvailableLLMsSections(llms.llmsSections, indexPages);

// ── Check 1: root llms.txt size ──────────────────────────────────────────────
const rootContent = llms.buildLLMsIndexContent(allPages, baseUrl);
const rootSize = size(rootContent);
if (rootSize >= ROOT_FAIL) {
  fail("Root llms.txt size", `${rootSize} bytes >= ${ROOT_FAIL} budget`);
} else if (rootSize >= ROOT_WARN) {
  warn("Root llms.txt size", `${rootSize} bytes >= ${ROOT_WARN} warning threshold`);
} else {
  pass("Root llms.txt size", `${rootSize} bytes`);
}

// ── Check 2: per-section sizes ───────────────────────────────────────────────
const sectionContents = new Map<string, string>();
const sizeTable: { name: string; bytes: number; budget: number }[] = [
  { name: "llms.txt (root)", bytes: rootSize, budget: ROOT_FAIL },
];
for (const section of llms.llmsSections) {
  const content = llms.buildLLMsSectionContent(section, indexPages, baseUrl);
  sectionContents.set(section.slug, content);
  const bytes = size(content);
  sizeTable.push({ name: `llms/${section.slug}.txt`, bytes, budget: SECTION_FAIL });
  const splitHint = "split this section in llmsSections (apps/docs/src/lib/llms.ts)";
  if (bytes >= SECTION_FAIL) {
    fail(`Section ${section.slug} size`, `${bytes} bytes >= ${SECTION_FAIL}; ${splitHint}`);
  } else if (bytes >= SECTION_WARN) {
    warn(`Section ${section.slug} size`, `${bytes} bytes >= ${SECTION_WARN}; ${splitHint}`);
  } else {
    pass(`Section ${section.slug} size`, `${bytes} bytes`);
  }
}

// ── Check 3: coverage ────────────────────────────────────────────────────────
// Every index page must be reachable via a section file OR the root "Other
// pages" list. Assert against the actual generated content (not just membership)
// so a builder/route rewrite that drops links is caught.
const haystack = [rootContent, ...sectionContents.values()].join("\n");
const uncovered = indexPages.filter((page) => !haystack.includes(pageLink(page.url)));
if (uncovered.length > 0) {
  fail(
    "Page coverage",
    `${uncovered.length} page(s) not linked from any section or the root index:\n    ${uncovered
      .map((p) => p.url)
      .join("\n    ")}`,
  );
} else {
  pass("Page coverage", `all ${indexPages.length} index pages reachable`);
}

// ── Check 4: catch-all creep ─────────────────────────────────────────────────
const unmatched = llms.getUnmatchedLLMsPages(indexPages, availableSections);
if (unmatched.length > CATCHALL_WARN) {
  warn(
    "Catch-all creep",
    `${unmatched.length} pages fall into the root "Other pages" list (> ${CATCHALL_WARN}); add a dedicated section to llmsSections for the new docs area`,
  );
} else {
  pass("Catch-all creep", `${unmatched.length} unmatched pages`);
}

// ── Check 5: markdown directive placement + description across ALL pages ──────
// The per-page markdown must carry the llms.txt directive as a blockquote
// IMMEDIATELY after the H1, so agents fetching any `.md` page get pointed at the
// index. Assert positionally (H1 line, blank line, directive line) across every
// index page — not a sample. getLLMText runs on preprocessed content, so this is
// fast enough to cover the full set.
const directiveFailures: string[] = [];
const missingDescription: string[] = [];
const headingMarkerFailures: string[] = [];
const detailsLeaks: string[] = [];
for (const page of indexPages) {
  let text: string;
  try {
    // getLLMText calls page.data.getText("processed"); verified to work under the
    // fumadocs loader used by this script (same loader as lint-links.ts).
    text = await getLLMText(page);
  } catch (error) {
    directiveFailures.push(`${page.url} (getLLMText threw: ${String(error)})`);
    continue;
  }

  const lines = text.split("\n");
  const h1Index = lines.findIndex((line) => line.startsWith("# "));
  // Format is `# Title\n\n> directive…`, so the directive sits two lines below H1.
  if (h1Index === -1 || !(lines[h1Index + 2] ?? "").startsWith(DIRECTIVE_MARKER)) {
    directiveFailures.push(page.url);
  }

  const description = page.data.description?.trim();
  if (description && !text.includes(description)) {
    missingDescription.push(page.url);
  }

  // Heading markers: the processed markdown emits headings as bare
  // "Text [#anchor]" lines; getLLMText restores the `#` markers from the toc.
  // If a toc anchor appears in the output, the line carrying it must be a real
  // markdown heading — otherwise agents see prose and the afdocs parity check
  // strips list-like heading text ("## 1. Set up …") on the markdown side.
  for (const item of page.data.toc ?? []) {
    if (typeof item.url !== "string" || !item.url.startsWith("#")) continue;
    const anchorRef = `[${item.url}]`;
    const anchorLine = lines.find((line) => line.includes(anchorRef));
    if (anchorLine !== undefined && !/^#{1,6} /.test(anchorLine)) {
      headingMarkerFailures.push(`${page.url} (${item.url})`);
    }
  }

  // <details> blocks must be converted to plain markdown (formatDetails in
  // llm-markdown.ts); a leaked <details> means its body is still 2-space
  // indented, which breaks code fences for markdown consumers.
  if (text.includes("<details")) {
    detailsLeaks.push(page.url);
  }
}

if (directiveFailures.length > 0) {
  fail(
    "Directive placement",
    `${directiveFailures.length} of ${indexPages.length} page(s) missing the llms.txt directive immediately after the H1:\n    ${directiveFailures
      .slice(0, 10)
      .join("\n    ")}`,
  );
} else {
  pass("Directive placement", `all ${indexPages.length} pages carry the directive after the H1`);
}

if (missingDescription.length > 0) {
  warn(
    "Description in markdown",
    `${missingDescription.length} page(s) have a frontmatter description not present in their markdown:\n    ${missingDescription
      .slice(0, 10)
      .join("\n    ")}`,
  );
} else {
  pass("Description in markdown", "all frontmatter descriptions present in markdown");
}

if (headingMarkerFailures.length > 0) {
  fail(
    "Heading markers restored",
    `${headingMarkerFailures.length} toc heading(s) rendered without markdown markers (restoreHeadingMarkers in llm-markdown.ts regressed):\n    ${headingMarkerFailures
      .slice(0, 10)
      .join("\n    ")}`,
  );
} else {
  pass("Heading markers restored", "all toc anchors in markdown output sit on real headings");
}

if (detailsLeaks.length > 0) {
  fail(
    "No <details> leakage",
    `${detailsLeaks.length} page(s) leak raw <details> into markdown (formatDetails in llm-markdown.ts regressed):\n    ${detailsLeaks
      .slice(0, 10)
      .join("\n    ")}`,
  );
} else {
  pass("No <details> leakage", "all <details> blocks converted to plain markdown");
}

// ── Check 5b: HTML surface source guard ──────────────────────────────────────
// The rendered HTML page carries the same directive via a hidden element that
// must be the FIRST child of <body> in the ROOT LAYOUT — not inside the page
// component. Agent-readiness audits (afdocs "llms-txt-directive-html") measure
// the directive's byte position within the body and warn when it sits past 50%,
// which is where it lands if it renders inside the content area after the
// sidebar markup. Rendering React in this script is not worth it; instead guard
// at the source level that layout.tsx links llms.txt between <body> and the
// first real child (<Banner). This is a source-level guard, not a render test.
const docsLayoutPath = join(scriptDir, "..", "src", "app", "layout.tsx");
try {
  const layoutSource = readFileSync(docsLayoutPath, "utf8");
  const bodyIndex = layoutSource.indexOf("<body");
  const llmsRefIndex = layoutSource.indexOf('href="https://www.prisma.io/docs/llms.txt"');
  const bannerIndex = layoutSource.indexOf("<Banner");
  const ignoreIndex = layoutSource.indexOf("data-markdown-ignore");
  if (bodyIndex === -1) {
    fail("HTML directive source guard", `<body not found in ${docsLayoutPath}`);
  } else if (llmsRefIndex === -1) {
    fail("HTML directive source guard", "layout.tsx does not link llms.txt");
  } else if (llmsRefIndex < bodyIndex) {
    fail(
      "HTML directive source guard",
      "layout.tsx links llms.txt before <body>; the hidden directive must be the first child of <body>",
    );
  } else if (bannerIndex !== -1 && llmsRefIndex > bannerIndex) {
    fail(
      "HTML directive source guard",
      "layout.tsx links llms.txt after <Banner; the hidden directive must be the first child of <body> so audits find it near the top of the HTML",
    );
  } else if (ignoreIndex === -1 || ignoreIndex > llmsRefIndex) {
    fail(
      "HTML directive source guard",
      "the hidden directive in layout.tsx must carry data-markdown-ignore so it stays out of the HTML/markdown parity comparison",
    );
  } else {
    pass("HTML directive source guard", "hidden llms.txt directive is the first child of <body>");
  }
} catch (error) {
  fail("HTML directive source guard", `could not read ${docsLayoutPath}: ${String(error)}`);
}

// ── Check 5c: APIPage parity guard ───────────────────────────────────────────
// The interactive OpenAPI explorer on /management-api/endpoints/* has no
// markdown equivalent (per-language code samples, auth widgets); the wrapper in
// api-page.tsx must carry data-markdown-ignore so parity checkers compare only
// the generated markdown API reference.
const apiPagePath = join(scriptDir, "..", "src", "components", "api-page.tsx");
try {
  const apiPageSource = readFileSync(apiPagePath, "utf8");
  if (!apiPageSource.includes("data-markdown-ignore")) {
    fail(
      "APIPage parity guard",
      "api-page.tsx no longer wraps the OpenAPI explorer in data-markdown-ignore; management-api endpoint pages will fail markdown/HTML parity",
    );
  } else {
    pass("APIPage parity guard", "OpenAPI explorer is excluded from parity comparison");
  }
} catch (error) {
  fail("APIPage parity guard", `could not read ${apiPagePath}: ${String(error)}`);
}

// ── Check 6: common queries resolve to existing pages ────────────────────────
// filterAvailableLLMsLinks drops internal links whose page is missing; a dropped
// entry is a stale commonQueries link. External links are always kept.
const staleQueries = llms.commonQueries.filter(
  (query) => llms.filterAvailableLLMsLinks([query], allPages).length === 0,
);
if (staleQueries.length > 0) {
  fail(
    "Common queries resolve",
    `${staleQueries.length} commonQueries href(s) do not resolve to an existing page:\n    ${staleQueries
      .map((q) => q.href)
      .join("\n    ")}`,
  );
} else {
  pass("Common queries resolve", `all ${llms.commonQueries.length} links resolve`);
}

// ── Check 7: llms-full exclusions ────────────────────────────────────────────
const fullPages = llms.getLLMsFullPages(allPages);
const v6Leak = fullPages.filter((p) => p.url === "/orm/v6" || p.url.startsWith("/orm/v6/"));
const productLeak = fullPages.filter(
  (p) => p.url.startsWith("/accelerate") || p.url.startsWith("/optimize"),
);
if (fullPages.length === 0) {
  fail("llms-full exclusions", "getLLMsFullPages returned 0 pages");
} else if (v6Leak.length > 0 || productLeak.length > 0) {
  fail(
    "llms-full exclusions",
    `excluded pages leaked into llms-full.txt: ${[...v6Leak, ...productLeak]
      .map((p) => p.url)
      .join(", ")}`,
  );
} else {
  pass("llms-full exclusions", `${fullPages.length} pages, no v6/Accelerate/Optimize leakage`);
}

// ── Check 8: skill.md frontmatter (docs + site) ──────────────────────────────
const docsSkillMissing = missingFrontmatterKeys(agentSkillMarkdown);
if (docsSkillMissing.length > 0) {
  fail("Docs skill frontmatter", `missing keys: ${docsSkillMissing.join(", ")}`);
} else {
  pass("Docs skill frontmatter", "all required keys present");
}

// The site skill is built at runtime from a template literal in agent-skills.ts,
// whose `@/lib/url` import cannot resolve under the docs tsconfig. Read the raw
// source and check the frontmatter keys directly (they sit at column 0 in the
// template literal body).
const siteSkillPath = join(scriptDir, "..", "..", "site", "src", "lib", "agent-skills.ts");
try {
  const siteSkillSource = readFileSync(siteSkillPath, "utf8");
  const siteSkillMissing = missingFrontmatterKeys(siteSkillSource);
  if (siteSkillMissing.length > 0) {
    fail("Site skill frontmatter", `missing keys: ${siteSkillMissing.join(", ")}`);
  } else {
    pass("Site skill frontmatter", "all required keys present");
  }
} catch (error) {
  fail("Site skill frontmatter", `could not read ${siteSkillPath}: ${String(error)}`);
}

// ── Check 9: MCP discovery documents (docs + site) ───────────────────────────
// Field-level validation of both discovery payloads so a wrong URL, transport,
// missing version, or empty authentication is caught — not just "an object
// exists". The site payload is built from a template in agent-skills.ts whose
// `@/lib/url` import cannot resolve under the docs tsconfig, so its static fields
// are validated from raw source (same approach as check 8).
const mcpErrors: string[] = [];

// Widen the `as const` literal types to plain strings so the runtime comparisons
// below are meaningful checks (not always-false literal-vs-literal comparisons).
const docsMcp = mcpDiscoveryDocument as {
  url: string;
  transport: string;
  version: string;
  servers: readonly { name: string; url: string; transport: string; authentication: string }[];
};
if (docsMcp.url !== MCP_URL) {
  mcpErrors.push(`docs: top-level url is "${docsMcp.url}", expected "${MCP_URL}"`);
}
if (docsMcp.transport !== "http") {
  mcpErrors.push(`docs: transport is "${docsMcp.transport}", expected "http"`);
}
if (typeof docsMcp.version !== "string" || docsMcp.version.trim() === "") {
  mcpErrors.push("docs: version is missing or empty");
}
if (!Array.isArray(docsMcp.servers) || docsMcp.servers.length === 0) {
  mcpErrors.push("docs: servers array is missing or empty");
} else {
  docsMcp.servers.forEach((server, i) => {
    if (server.url !== MCP_URL) {
      mcpErrors.push(`docs: servers[${i}].url is "${server.url}", expected "${MCP_URL}"`);
    }
    if (server.transport !== "http") {
      mcpErrors.push(`docs: servers[${i}].transport is "${server.transport}", expected "http"`);
    }
    if (typeof server.authentication !== "string" || server.authentication.trim() === "") {
      mcpErrors.push(`docs: servers[${i}].authentication is missing or empty`);
    }
  });
}

try {
  const siteSource = readFileSync(siteSkillPath, "utf8");
  const urlMatch = siteSource.match(/const MCP_SERVER_URL\s*=\s*"([^"]+)"/);
  if (!urlMatch) {
    mcpErrors.push("site: could not find the MCP_SERVER_URL constant");
  } else if (urlMatch[1] !== MCP_URL) {
    mcpErrors.push(`site: MCP_SERVER_URL is "${urlMatch[1]}", expected "${MCP_URL}"`);
  }

  // Validate the static fields of the buildMcpDiscovery() payload from source.
  const discoveryMatch = siteSource.match(
    /export function buildMcpDiscovery\([^)]*\)\s*\{([\s\S]*?)\n\}/,
  );
  const discoveryBody = discoveryMatch?.[1];
  if (!discoveryBody) {
    mcpErrors.push("site: could not find the buildMcpDiscovery() function");
  } else {
    if (!/\btransport:\s*"http"/.test(discoveryBody)) {
      mcpErrors.push('site: buildMcpDiscovery transport is not "http"');
    }
    if (!/\burl:\s*MCP_SERVER_URL\b/.test(discoveryBody)) {
      mcpErrors.push("site: buildMcpDiscovery url is not MCP_SERVER_URL");
    }
    if (!/\bauthentication:\s*"[^"]+"/.test(discoveryBody)) {
      mcpErrors.push("site: buildMcpDiscovery server authentication is missing or empty");
    }
  }
} catch (error) {
  mcpErrors.push(`site: could not read ${siteSkillPath}: ${String(error)}`);
}

if (mcpErrors.length > 0) {
  fail("MCP discovery", `field validation failed:\n    ${mcpErrors.join("\n    ")}`);
} else {
  pass(
    "MCP discovery",
    `docs + site valid: url "${MCP_URL}", transport http, ${docsMcp.servers.length} server(s)`,
  );
}

// ── Check 9b: MCP protocol endpoints (docs + site) ───────────────────────────
// Discovery documents alone do not satisfy "MCP server discoverable" audits —
// they probe the conventional `<origin>/mcp` endpoints with an MCP initialize
// request. /docs/mcp is a proxy route in this app; www.prisma.io/mcp is a
// marketing page, so MCP traffic there is routed by header-matched rewrites in
// the site next.config. Guard both at the source level.
const mcpEndpointErrors: string[] = [];
const docsMcpRoutePath = join(scriptDir, "..", "src", "app", "mcp", "route.ts");
try {
  const routeSource = readFileSync(docsMcpRoutePath, "utf8");
  if (!routeSource.includes(`"${MCP_URL}"`)) {
    mcpEndpointErrors.push(`docs: src/app/mcp/route.ts does not proxy to "${MCP_URL}"`);
  }
  for (const handler of ["GET", "POST", "DELETE"]) {
    if (!new RegExp(`export (async )?function ${handler}\\b`).test(routeSource)) {
      mcpEndpointErrors.push(`docs: src/app/mcp/route.ts is missing the ${handler} handler`);
    }
  }
} catch (error) {
  mcpEndpointErrors.push(`docs: could not read ${docsMcpRoutePath}: ${String(error)}`);
}

const siteNextConfigPath = join(scriptDir, "..", "..", "site", "next.config.mjs");
try {
  const siteConfigSource = readFileSync(siteNextConfigPath, "utf8");
  // All three header conditions are needed to cover the MCP Streamable HTTP
  // transport: POST messages (content-type), the server event stream (accept),
  // and session teardown (mcp-session-id). Split the config into per-rewrite
  // chunks (each starts at its `source:` and ends before the next one) so a
  // header key and the MCP destination must appear together in the SAME
  // rewrite entry — matching across neighbouring entries would let a dropped
  // header condition slip through.
  const mcpRewriteChunks = siteConfigSource
    .split(/(?=source: ")/)
    .filter((chunk) => chunk.startsWith('source: "/mcp"'));
  const requiredMcpHeaderKeys = ["accept", "content-type", "mcp-session-id"];
  const missingMcpHeaderRewrites = requiredMcpHeaderKeys.filter(
    (key) =>
      !mcpRewriteChunks.some(
        (chunk) => chunk.includes(`key: "${key}"`) && chunk.includes(`destination: "${MCP_URL}"`),
      ),
  );
  if (missingMcpHeaderRewrites.length > 0) {
    mcpEndpointErrors.push(
      `site: next.config.mjs is missing a /mcp rewrite to "${MCP_URL}" for header key(s): ${missingMcpHeaderRewrites.join(", ")}`,
    );
  }
} catch (error) {
  mcpEndpointErrors.push(`site: could not read ${siteNextConfigPath}: ${String(error)}`);
}

if (mcpEndpointErrors.length > 0) {
  fail("MCP protocol endpoints", `\n    ${mcpEndpointErrors.join("\n    ")}`);
} else {
  pass("MCP protocol endpoints", "/docs/mcp proxy route + site /mcp rewrites present");
}

// ── Check 10: placeholder protectors are collision-safe ──────────────────────
// Regression coverage for the protect/restore pipeline shared by llm-markdown.ts
// and get-llm-text.ts. Adversarial inputs embed text that LOOKS like the internal
// placeholders inside inline code and fenced blocks, plus a normal body link. A
// correct implementation restores every input byte-for-byte and rewrites ONLY the
// body links that sit outside code. This guards against the old sequential-replace
// corruption (a protected span reintroducing a later token; the fenced restore
// consuming a sentinel reintroduced by an inline span).
{
  // Mirror absolutizeInBodyLinks exactly: fences first, then inline spans, rewrite
  // the body links in between, then restore inline then fences.
  const runPipeline = (markdown: string) => {
    const fences = protectFencedCodeBlocks(markdown);
    const inline = protectInlineCode(fences.markdown);
    const rewritten = inline.markdown.replace(/\]\((\/[^)\s]*)\)/g, (full, target: string) => {
      if (target.startsWith("//")) return full;
      return `](https://www.prisma.io${target})`;
    });
    return fences.restore(inline.restore(rewritten));
  };

  const fence = "```";
  const cases: { name: string; input: string; expected: string }[] = [
    {
      name: "inline code containing old-format placeholder text is preserved",
      input: "Use `__LLM_INLINE_CODE_1__` and `__LLM_FENCED_CODE_BLOCK_0__` literally here.",
      expected: "Use `__LLM_INLINE_CODE_1__` and `__LLM_FENCED_CODE_BLOCK_0__` literally here.",
    },
    {
      name: "fenced block containing inline-sentinel-looking text + body link is preserved",
      input: `${fence}\n__LLM_INLINE_CODE_0__ and [x](/orm/a)\n${fence}`,
      expected: `${fence}\n__LLM_INLINE_CODE_0__ and [x](/orm/a)\n${fence}`,
    },
    {
      name: "link inside inline code is NOT rewritten",
      input: "See `[label](/orm/foo)` inline.",
      expected: "See `[label](/orm/foo)` inline.",
    },
    {
      name: "body link outside code IS rewritten",
      input: "See [label](/orm/foo) here.",
      expected: "See [label](https://www.prisma.io/orm/foo) here.",
    },
    {
      name: "mixed: body link rewrites while placeholder-looking code stays verbatim",
      input: `Body [a](/x) then \`__LLM_FENCED_CODE_BLOCK_0__\` then\n${fence}\ncode [b](/y)\n${fence}\nend.`,
      expected: `Body [a](https://www.prisma.io/x) then \`__LLM_FENCED_CODE_BLOCK_0__\` then\n${fence}\ncode [b](/y)\n${fence}\nend.`,
    },
  ];

  const protectorFailures = cases.flatMap((testCase) => {
    const actual = runPipeline(testCase.input);
    if (actual === testCase.expected) return [];
    return [
      `${testCase.name}\n      expected: ${JSON.stringify(testCase.expected)}\n      actual:   ${JSON.stringify(actual)}`,
    ];
  });

  if (protectorFailures.length > 0) {
    fail(
      "Protector round-trip",
      `${protectorFailures.length} of ${cases.length} case(s) failed:\n    ${protectorFailures.join("\n    ")}`,
    );
  } else {
    pass("Protector round-trip", `all ${cases.length} adversarial protect/restore cases pass`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
const icon: Record<Status, string> = { pass: "✓", warn: "⚠", fail: "✗" };
console.log("\nAgent-readiness checks\n");
for (const result of results) {
  const line = `${icon[result.status]} ${result.name}`;
  console.log(result.message ? `${line} — ${result.message}` : line);
}

console.log("\nSize budget (bytes)\n");
const nameWidth = Math.max(...sizeTable.map((row) => row.name.length));
for (const row of sizeTable) {
  const headroom = row.budget - row.bytes;
  const flag = row.bytes >= row.budget ? " OVER" : "";
  console.log(
    `  ${row.name.padEnd(nameWidth)}  ${String(row.bytes).padStart(7)} / ${row.budget}  (${headroom >= 0 ? "+" : ""}${headroom} headroom)${flag}`,
  );
}

const failures = results.filter((r) => r.status === "fail").length;
const warnings = results.filter((r) => r.status === "warn").length;
console.log(`\n${failures} failure(s), ${warnings} warning(s)\n`);

if (failures > 0) {
  process.exit(1);
}
