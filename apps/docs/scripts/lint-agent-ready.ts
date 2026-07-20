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
const { withDocsBasePath } = await import("@/lib/urls");
const { agentSkillMarkdown } = await import("@/lib/agent-skill");
const { mcpDiscoveryDocument } = await import("@/lib/mcp-discovery");

// Measure against the production base URL so byte budgets are stable regardless
// of the local NEXT_PUBLIC_PRISMA_URL, and match the numbers reviewers see live.
const baseUrl = process.env.NEXT_PUBLIC_PRISMA_URL ?? "https://www.prisma.io";

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

// ── Check 5: markdown directive + description on sample pages ─────────────────
for (const slug of ["orm", "postgres", "guides"]) {
  const section = llms.llmsSections.find((s) => s.slug === slug);
  const samplePage = section ? llms.filterPagesForLLMsSection(indexPages, section)[0] : undefined;
  if (!samplePage) {
    warn(`Directive (${slug})`, `no page found for section "${slug}" to sample`);
    continue;
  }

  let text: string;
  try {
    // getLLMText calls page.data.getText("processed"); verified to work under the
    // fumadocs loader used by this script (same loader as lint-links.ts).
    text = await getLLMText(samplePage);
  } catch (error) {
    fail(`Directive (${slug})`, `getLLMText threw for ${samplePage.url}: ${String(error)}`);
    continue;
  }

  if (!text.includes(DIRECTIVE_MARKER)) {
    fail(`Directive (${slug})`, `${samplePage.url} markdown is missing the llms.txt directive`);
  } else {
    pass(`Directive (${slug})`, samplePage.url);
  }

  const description = samplePage.data.description?.trim();
  if (description && !text.includes(description)) {
    warn(
      `Description (${slug})`,
      `${samplePage.url} has a frontmatter description not in its markdown`,
    );
  }
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
const scriptDir = dirname(fileURLToPath(import.meta.url));
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

// ── Check 9: MCP discovery document ──────────────────────────────────────────
const mcpUrlOk = mcpDiscoveryDocument.url === MCP_URL;
const mcpServersOk =
  Array.isArray(mcpDiscoveryDocument.servers) && mcpDiscoveryDocument.servers.length > 0;
if (!mcpUrlOk || !mcpServersOk) {
  fail("MCP discovery", !mcpUrlOk ? `url is not ${MCP_URL}` : "servers array is missing or empty");
} else {
  pass("MCP discovery", `url ${MCP_URL}, ${mcpDiscoveryDocument.servers.length} server(s)`);
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
