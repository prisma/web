import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { AGENT_MARKDOWN_PATHS, type AgentMarkdownPath } from "@/lib/agent-markdown";
import { markdownPageList, markdownPages, renderMarkdownDocument } from "@/lib/markdown-pages";

const siteRoot = new URL("../../..", import.meta.url).pathname;
const baseUrl = "https://www.prisma.io";

/**
 * The component files that render each page's headings.
 *
 * The renditions of /orm, /postgres and /compute are generated from the same
 * `ProductPageContent` objects the pages render from, so their copy cannot
 * drift; what can drift is the framing text that is literal JSX in the shared
 * product sections, which is why those files are listed here too.
 *
 * For the pages whose copy is literal JSX, this list is the drift alarm: the
 * test below pulls every literal `<h1>`/`<h2>` out of these files and fails if
 * one of them is missing from the Markdown.
 */
const PAGE_SOURCES: Record<AgentMarkdownPath, string[]> = {
  "/": [
    "src/app/page.tsx",
    "src/components/sections/hero-home.tsx",
    "src/components/sections/logo-cloud.tsx",
    "src/components/sections/comparison.tsx",
    "src/components/sections/how-it-works.tsx",
    "src/components/sections/stack-bento.tsx",
    "src/components/sections/agent-loop.tsx",
    "src/components/sections/pricing-scale.tsx",
    "src/components/sections/faq.tsx",
    "src/components/sections/cta-burst.tsx",
  ],
  "/orm": [
    "src/components/product/product-hero.tsx",
    "src/components/product/product-problem.tsx",
    "src/components/product/product-features.tsx",
    "src/components/product/product-narrative.tsx",
    "src/components/product/product-detail-blocks.tsx",
    "src/components/product/product-platform.tsx",
  ],
  "/postgres": [
    "src/components/product/product-hero.tsx",
    "src/components/product/product-problem.tsx",
    "src/components/product/product-features.tsx",
    "src/components/product/product-platform.tsx",
  ],
  "/compute": [
    "src/components/product/product-hero.tsx",
    "src/components/product/product-problem.tsx",
    "src/components/product/product-features.tsx",
    "src/components/product/product-platform.tsx",
  ],
  "/pricing": [
    "src/app/pricing/page.tsx",
    "src/components/sections/pricing-hero.tsx",
    "src/components/sections/pricing-plans.tsx",
    "src/components/sections/pricing-how-it-works.tsx",
    "src/components/sections/pricing-includes.tsx",
    "src/components/sections/pricing-calculator.tsx",
    "src/components/sections/pricing-comparison.tsx",
    "src/components/sections/pricing-spec-table.tsx",
    "src/components/sections/faq.tsx",
  ],
  "/studio": ["src/app/studio/page.tsx"],
  "/stack": ["src/app/stack/page.tsx", "src/components/sections/stack-bento.tsx"],
  "/enterprise": ["src/app/enterprise/page.tsx"],
  "/mcp": [
    "src/app/mcp/page.tsx",
    "src/app/mcp/_components/mcp-hero-section.tsx",
    "src/app/mcp/_components/mcp-video-section.tsx",
    "src/app/mcp/_components/mcp-agents-section.tsx",
    "src/app/mcp/_components/mcp-capabilities-section.tsx",
    "src/app/mcp/_components/mcp-cta-section.tsx",
  ],
};

/**
 * How many literal `<h1>`/`<h2>` strings the scan below is expected to find
 * per page, so it cannot go quietly hollow when a heading moves into a
 * component that PAGE_SOURCES does not list.
 *
 * The three product pages sit at 1 on purpose: every heading on them except
 * the platform section's comes from the page's `ProductPageContent`, so it is
 * an expression in the JSX and the content-object test below is what covers it.
 */
const MIN_LITERAL_HEADINGS: Record<AgentMarkdownPath, number> = {
  "/": 6,
  "/orm": 1,
  "/postgres": 1,
  "/compute": 1,
  "/pricing": 5,
  "/studio": 3,
  "/stack": 2,
  "/enterprise": 3,
  "/mcp": 4,
};

const HEADING_PATTERN = /<(h[12])\b[^>]*>([\s\S]*?)<\/\1>/g;

/**
 * The literal text of every `<h1>`/`<h2>` in a source file.
 *
 * Presentational wrappers inside a heading (`<GlassGlide>`, `<span>`) are
 * flattened, because they carry no meaning in Markdown. A heading whose text
 * is still an expression after that (`{heading}`, `{hero.headline}`) is
 * skipped: the string is not in this file. For the pages that have one it
 * comes from the same content object the Markdown is generated from, and the
 * content-object test below covers it.
 */
function literalHeadings(source: string): string[] {
  const headings: string[] = [];

  for (const [, , inner] of source.matchAll(HEADING_PATTERN)) {
    // JSX's explicit whitespace literal, used to keep a space before a tag.
    let flattened = inner.replace(/\{" "\}/g, " ");

    // Strip the wrappers' tags until none are left. This runs to a fixpoint
    // rather than in one pass because CodeQL's
    // js/incomplete-multi-character-sanitization rule flags a lone
    // `<[^>]*>` replace (`<<b>b>` would survive it) and a loop is the shape it
    // recognises as complete. The input is this repo's own source, not
    // untrusted markup, so the loop is about keeping the scan green, not safe.
    let previous: string;
    do {
      previous = flattened;
      flattened = flattened.replace(/<[^>]*>/g, "");
    } while (flattened !== previous);

    if (flattened.includes("{")) continue;

    const text = flattened
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    if (text) headings.push(text);
  }

  return headings;
}

function readSource(relativePath: string) {
  return readFileSync(join(siteRoot, relativePath), "utf8");
}

test("every supported path has a markdown page, and vice versa", () => {
  assert.deepEqual(
    Object.keys(markdownPages).sort(),
    [...AGENT_MARKDOWN_PATHS].sort(),
    "markdownPages and AGENT_MARKDOWN_PATHS disagree",
  );
  assert.equal(markdownPageList.length, AGENT_MARKDOWN_PATHS.length);
});

for (const page of markdownPageList) {
  test(`${page.path} renders a markdown document with one H1 and real sections`, () => {
    const document = renderMarkdownDocument(page, baseUrl);
    const lines = document.split("\n");

    const h1Lines = lines.filter((line) => line.startsWith("# "));
    assert.equal(h1Lines.length, 1, `${page.path} should have exactly one H1`);
    assert.equal(h1Lines[0], `# ${page.h1} (${page.path})`);

    const h2Lines = lines.filter((line) => line.startsWith("## "));
    assert.ok(
      h2Lines.length >= 2,
      `${page.path} should have at least two H2 sections, got ${h2Lines.length}`,
    );

    // Not a title-and-description stub: the audit's whole complaint.
    assert.ok(
      document.length > 1500,
      `${page.path} markdown is only ${document.length} characters — too short to be at parity with the page`,
    );

    // CTAs survive as followable links.
    assert.ok(/\]\((https?:\/\/|\/)/.test(document), `${page.path} markdown has no links`);

    assert.ok(document.includes(page.subheadline), `${page.path} is missing its subheadline`);
  });

  test(`${page.path} markdown carries every literal heading its components render`, () => {
    const document = renderMarkdownDocument(page, baseUrl);
    const missing: string[] = [];
    let found = 0;

    for (const relativePath of PAGE_SOURCES[page.path]) {
      for (const heading of literalHeadings(readSource(relativePath))) {
        found++;
        if (!document.includes(heading)) missing.push(`${relativePath}: ${heading}`);
      }
    }

    // Guards the check itself: if a refactor moves the headings out of the
    // files listed in PAGE_SOURCES, this test would otherwise pass vacuously.
    assert.ok(
      found >= MIN_LITERAL_HEADINGS[page.path],
      `${page.path}: found ${found} literal headings across ${PAGE_SOURCES[page.path].length} source files, expected at least ${MIN_LITERAL_HEADINGS[page.path]} — PAGE_SOURCES is out of date`,
    );

    assert.deepEqual(
      missing,
      [],
      `${page.path}'s markdown rendition has fallen behind the page. Missing headings:\n${missing.join("\n")}`,
    );
  });
}

test("the product pages inherit their copy from the page's own content object", async () => {
  // Parity for /orm, /postgres and /compute is structural: assert the headline
  // strings in the content modules reach the markdown, so a copy change to the
  // page is a copy change to the rendition with no second edit.
  const { ormContent } = await import("@/components/product/content/orm");
  const { postgresContent } = await import("@/components/product/content/postgres");
  const { computeContent } = await import("@/components/product/content/compute");

  for (const [path, content] of [
    ["/orm", ormContent],
    ["/postgres", postgresContent],
    ["/compute", computeContent],
  ] as const) {
    const document = renderMarkdownDocument(markdownPages[path], baseUrl);

    assert.ok(document.includes(content.hero.headline), `${path}: hero headline missing`);
    assert.ok(document.includes(content.hero.subheadline), `${path}: subheadline missing`);
    assert.ok(document.includes(content.problem.headline), `${path}: problem headline missing`);
    assert.ok(document.includes(content.features.headline), `${path}: features headline missing`);
    assert.ok(document.includes(content.cta.headline), `${path}: cta headline missing`);
    assert.ok(document.includes(content.platform.body), `${path}: platform body missing`);

    for (const benefit of content.hero.benefits) {
      assert.ok(document.includes(benefit), `${path}: hero benefit missing: ${benefit}`);
    }
    for (const item of content.features.items) {
      assert.ok(document.includes(item.name), `${path}: feature missing: ${item.name}`);
      assert.ok(document.includes(item.description), `${path}: feature copy missing: ${item.name}`);
    }
    for (const outcome of content.problem.outcomes) {
      assert.ok(document.includes(outcome.label), `${path}: outcome missing: ${outcome.label}`);
    }
    for (const cta of [
      content.hero.primaryCta,
      content.hero.secondaryCta,
      content.cta.primaryCta,
      content.cta.secondaryCta,
    ]) {
      assert.ok(
        document.includes(`[${cta.label}](${cta.href})`),
        `${path}: CTA missing: ${cta.label} -> ${cta.href}`,
      );
    }
  }
});

test("llms.txt lists every rendition and links its .md URL", async () => {
  const { buildLlmsIndexContent, buildLlmsFullContent } = await import("@/app/llms-content");

  const index = buildLlmsIndexContent(baseUrl);
  for (const page of markdownPageList) {
    const markdownUrl = page.path === "/" ? `${baseUrl}/index.md` : `${baseUrl}${page.path}.md`;
    assert.ok(index.includes(page.title), `llms.txt is missing ${page.path}`);
    assert.ok(index.includes(markdownUrl), `llms.txt does not link ${markdownUrl}`);
  }

  const full = buildLlmsFullContent(baseUrl);
  for (const page of markdownPageList) {
    // The whole body, not a summary.
    assert.ok(full.includes(page.h1), `llms-full.txt is missing the ${page.path} H1`);
    assert.ok(
      full.includes(page.renderBody().split("\n")[0]),
      `llms-full.txt does not embed the ${page.path} body`,
    );
  }
});
