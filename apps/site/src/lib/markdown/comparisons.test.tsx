import * as convex from "@/app/compare/convex/_content";
import * as kysely from "@/app/compare/kysely/_content";
import { getKyselyArticleFields, getKyselyFacts } from "@/app/compare/kysely/facts";
import { GET as getKyselyFactsResponse } from "@/app/compare/kysely.json/route";
import * as mongoose from "@/app/compare/mongoose/_content";
import { COMPARISON_CTA, ORM_COMPARISON_CTA } from "@/app/compare/_content";
import { CompareTable } from "@/app/compare/compare-table";
import { ComparisonPricingTable } from "@/app/compare/pricing-table";
import { TABLE_FRAME } from "@/app/compare/table-styles";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Children, isValidElement, type ReactNode } from "react";
import { COMPARISONS, COMPARISON_PATHS } from "@/app/compare/comparisons";
import { getComparisonMetadata, getComparisonStructuredData } from "@/lib/comparison-metadata";
import { getAgentMarkdownRewritePathname } from "@/lib/agent-markdown";
import { getMarkdownPage, renderMarkdownDocument } from "@/lib/markdown-pages";
import { renderComparisonContent } from "./comparison-content";

/** Collapse formatting when comparing complete prose and cells across HTML and Markdown. */
function plainMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\\([\\`*_{}[\]<>|#+.()-])/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

for (const entry of COMPARISONS) {
  test(`${entry.slug} Markdown preserves comparison cells and every FAQ answer`, () => {
    const content = { convex, kysely, mongoose }[entry.slug];
    const page = getMarkdownPage(`/compare/${entry.slug}`);
    assert.ok(page);
    const markdown = renderMarkdownDocument(page);
    const plain = plainMarkdown(markdown);
    for (const row of content.COMPARE_ROWS) {
      for (const cell of Object.values(row)) {
        if (typeof cell !== "string") continue;
        assert.ok(plain.includes(stripFaqAnswerMarkup(cell)), `missing table cell: ${cell}`);
      }
    }
    for (const faq of content.FAQ) {
      assert.ok(markdown.includes(`### ${faq.question}`));
      assert.ok(
        plain.includes(stripFaqAnswerMarkup(faq.answer)),
        `missing answer: ${faq.question}`,
      );
    }
    assert.match(markdown, /\n## (Pricing|How much do .+ cost\?)\n/);
    assert.match(markdown, /\n## (What teams on Prisma say|What do teams say about .+\?)\n/);
    assert.match(markdown, /\n## (Move from|How do I switch from) /);
  });

  test(`${entry.slug} article schema agrees with the page metadata and directory`, () => {
    const graph = getComparisonStructuredData(entry.slug)["@graph"];
    const article = graph.find((node) => node["@type"] === "Article");
    const breadcrumbs = graph.find((node) => node["@type"] === "BreadcrumbList");
    assert.ok(article);
    assert.equal(article.headline, entry.title);
    assert.equal(article.description, entry.description);
    assert.equal(article.url, getComparisonMetadata(entry.slug).alternates?.canonical);
    assert.equal(getComparisonMetadata(entry.slug).openGraph.type, "article");
    assert.equal(breadcrumbs?.itemListElement?.length, 2);
    assert.equal(article.publisher?.["@id"], `${new URL(article.url!).origin}#organization`);
  });
}

test("every registered comparison negotiates Markdown, and unknown slugs stay outside the boundary", () => {
  for (const path of COMPARISON_PATHS) {
    assert.equal(getAgentMarkdownRewritePathname(path), `/llms.mdx${path}`);
    assert.equal(getAgentMarkdownRewritePathname(`${path}/`), `/llms.mdx${path}`);
  }
  assert.equal(getAgentMarkdownRewritePathname("/compare/not-a-comparison"), undefined);
  assert.equal(getAgentMarkdownRewritePathname("/compare/convex.md"), undefined);
});

test("comparison Markdown preserves literal code and escapes table pipes", () => {
  const content = (
    <>
      <p>
        Use <code>{"db.orm.<collection>"}</code> with <strong>typed queries</strong>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Literal</td>
            <td>left | right</td>
          </tr>
        </tbody>
      </table>
      <pre>
        <code>{"SELECT '<value>';"}</code>
      </pre>
    </>
  );
  const markdown = renderComparisonContent(content, "/compare/convex");
  assert.ok(markdown.includes("`db.orm.<collection>`"));
  assert.ok(markdown.includes("**typed queries**"));
  assert.ok(markdown.includes("| Literal | left \\| right |"));
  assert.ok(markdown.includes("```\nSELECT '<value>';\n```"));
});

test("Kysely Markdown carries the byline and each code tab as a labelled TypeScript fence", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(
    markdown.includes(
      `By [${kysely.KYSELY_AUTHOR.name}](${kysely.KYSELY_AUTHOR.path}) · Updated ${kysely.KYSELY_UPDATED.label}`,
    ),
  );
  assert.ok(markdown.includes(`**Kysely**\n\n\`\`\`ts\n${kysely.SAME_QUERY.kysely}\n\`\`\``));
  assert.ok(markdown.includes(`**Prisma ORM**\n\n\`\`\`ts\n${kysely.SAME_QUERY.prisma}\n\`\`\``));
  assert.ok(markdown.includes(`**SQL sent**\n\n\`\`\`sql\n${kysely.SAME_QUERY.sql}\n\`\`\``));
});

test("a table without rows does not interrupt the comparison rendition", () => {
  assert.equal(renderComparisonContent(<table />, "/compare/convex"), "");
});

test("comparison text escapes literal backslashes together with pipes", () => {
  const markdown = renderComparisonContent(<p>{String.raw`left\|right`}</p>, "/compare/convex");
  assert.equal(markdown, String.raw`left\\\|right`);
});

test("literal block markers stay prose while semantic headings and lists keep their syntax", () => {
  for (const [text, expected] of [
    ["# Literal heading", String.raw`\# Literal heading`],
    ["- Literal bullet", String.raw`\- Literal bullet`],
    ["+ Literal bullet", String.raw`\+ Literal bullet`],
    ["1. Literal step", String.raw`1\. Literal step`],
    ["2) Literal step", String.raw`2\) Literal step`],
    ["Prose.\n  - Literal bullet", "Prose.\n  \\- Literal bullet"],
    ["Node.js with type-safe SQL and C++.", "Node.js with type-safe SQL and C++."],
  ]) {
    assert.equal(renderComparisonContent(<p>{text}</p>, "/compare/convex"), expected);
  }

  for (const marker of [".", ")"]) {
    assert.equal(
      renderComparisonContent(
        <p>
          <span>1</span>
          {marker} Literal step
        </p>,
        "/compare/convex",
      ),
      `1\\${marker} Literal step`,
    );
  }

  assert.equal(
    renderComparisonContent(
      <>
        <h2>Heading</h2>
        <ul>
          <li>
            <span>-</span> Literal bullet
          </li>
        </ul>
      </>,
      "/compare/convex",
    ),
    "## Heading\n\n- \\- Literal bullet",
  );
});

test("kysely Markdown keeps yes and no marks out of the table, and anchored headings intact", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const hosted = markdown.split("\n").find((line) => line.startsWith("| Hosted database |"));
  assert.ok(hosted);
  assert.ok(
    hosted.startsWith("| Hosted database | None. Kysely is a library. | [Prisma Postgres]"),
  );
  assert.doesNotMatch(hosted, /\b(Yes|No)\b/);
  assert.ok(markdown.includes("\n## When should I choose Kysely or Prisma ORM?\n"));
  assert.ok(markdown.includes("\n### A model API and a SQL query builder\n"));
  assert.ok(markdown.includes("\n### A migration plan that does not need the database\n"));
  assert.doesNotMatch(markdown, /Copy link|Copied/);
});

test("kysely Markdown carries the database matrix and the task table as Markdown tables", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes("\n## Which databases do Prisma ORM and Kysely support?\n"));
  assert.ok(markdown.includes("| Database | Kysely | Prisma ORM 8 | Prisma ORM 7 |"));
  for (const row of kysely.DATABASE_MATRIX) {
    const cells = [row.kysely, row.orm8, row.orm7].map((status) => status ?? "No");
    assert.ok(
      markdown.includes(`| ${row.database} | ${cells.join(" | ")} |`),
      `missing matrix row: ${row.database}`,
    );
  }
  assert.ok(markdown.includes("](/compare/kysely#databases)"), "Databases row links to the matrix");

  assert.ok(markdown.includes("\n## How does each task look in Kysely and Prisma ORM?\n"));
  assert.ok(markdown.includes("| Task | Kysely | Prisma ORM |"));
  const plain = plainMarkdown(markdown);
  for (const row of kysely.SAME_JOB) {
    const line = markdown.split("\n").find((text) => text.startsWith(`| ${row.task} |`));
    assert.ok(line, `missing task row: ${row.task}`);
    assert.ok(plain.includes(stripFaqAnswerMarkup(row.kysely)), `missing Kysely cell: ${row.task}`);
    assert.ok(plain.includes(stripFaqAnswerMarkup(row.prisma)), `missing Prisma cell: ${row.task}`);
  }
});

test("kysely Markdown renders the remaining cards and drops the fit columns", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.equal(kysely.APART.length, 2);
  for (const card of kysely.APART) {
    assert.ok(markdown.includes(`\n### ${card.title}\n`), `missing card heading: ${card.title}`);
  }
  assert.doesNotMatch(markdown, /When is Kysely the better fit\?/);
  assert.doesNotMatch(markdown, /When is Prisma ORM the better fit\?/);
  assert.doesNotMatch(markdown, /One contract for queries and migrations/);
  assert.doesNotMatch(markdown, /A contract from tables you already have/);
});

test("kysely Markdown carries pricing as a table followed by the free tier note", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const section = markdown
    .split("\n## How much do Prisma ORM and Kysely cost?\n")[1]
    ?.split("\n## ")[0];
  assert.ok(section, "missing pricing section");
  assert.ok(section.includes("| Cost | Kysely | Prisma ORM |"));
  for (const row of kysely.PRICING) {
    const line = section.split("\n").find((text) => text.startsWith(`| ${row.label} |`));
    assert.ok(line, `missing pricing row: ${row.label}`);
    assert.ok(plainMarkdown(line).includes(stripFaqAnswerMarkup(row.prisma)));
  }
  assert.match(
    section.trimEnd(),
    /\|\n\nPrisma Postgres has a Free plan: \$0 a month for 200,000 operations, 2 GB of storage, and 50 databases\. The \[pricing page\]\(\/pricing\) lists the paid plans\.$/,
  );
  assert.doesNotMatch(markdown, /pricing page, October 2026/);
});

test("kysely Markdown opens with the check date and does not add a period after the title's question mark", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes("Checked October 2026."));
  assert.ok(markdown.includes(`dateModified: ${kysely.KYSELY_UPDATED.iso}`));
  assert.doesNotMatch(markdown, /builder\?\./);
  assert.doesNotMatch(markdown, /`[^`\n]+`\\\./);
  assert.doesNotMatch(markdown, /\]\([^)]+\)\\\./);
});

test("kysely Markdown keeps the 500K Prisma ORM figure in the closing copy", () => {
  assert.ok(
    COMPARISON_CTA.checks.some((item) => item.label === "Trusted by 500K+ developers globally"),
  );
  assert.ok(
    ORM_COMPARISON_CTA.checks.some((item) => item.label === "Trusted by 500K+ developers globally"),
  );
  assert.ok(ORM_COMPARISON_CTA.checks.some((item) => item.label === "Add the library"));
  assert.ok(ORM_COMPARISON_CTA.checks.some((item) => item.label === "Read the ORM docs"));
  assert.equal(ORM_COMPARISON_CTA.body, "Prisma ORM is free and open source, and always will be.");
  assert.equal(COMPARISON_CTA.body, "Free to start, no credit card required.");
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes("Trusted by 500K+ developers globally"));
  assert.ok(markdown.includes("Prisma ORM is free and open source, and always will be."));
  assert.ok(markdown.includes("Add the library"));
  assert.ok(markdown.includes("Read the ORM docs"));
  assert.match(
    markdown,
    /Need a database\? \[Create one instantly\]\(https:\/\/console\.prisma\.io\)/,
  );
  assert.doesNotMatch(markdown, /Free to start, no credit card required/);
  assert.doesNotMatch(markdown, /Create a database and start building in minutes/);
  assert.ok(markdown.includes("\n## Add Prisma ORM to an existing project\n"));
  assert.ok(
    markdown.includes("[Get started with Prisma ORM](/docs/prisma-orm/quickstart/postgresql)"),
  );
  assert.ok(markdown.includes("[Get started with Prisma Postgres](https://console.prisma.io)"));
  const mongoosePage = getMarkdownPage("/compare/mongoose");
  assert.ok(mongoosePage);
  const mongooseMarkdown = renderMarkdownDocument(mongoosePage);
  assert.ok(mongooseMarkdown.includes("Prisma ORM is free and open source, and always will be."));
  assert.ok(mongooseMarkdown.includes("Add the library"));
  assert.doesNotMatch(mongooseMarkdown, /Free to start, no credit card required/);
  const convexPage = getMarkdownPage("/compare/convex");
  assert.ok(convexPage);
  const convexMarkdown = renderMarkdownDocument(convexPage);
  assert.ok(convexMarkdown.includes("Free to start, no credit card required."));
});

test("kysely Markdown carries the switch types, contract, and four commands", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(
    markdown.includes(`**Kysely types**\n\n\`\`\`ts\n${kysely.SWITCH_KYSELY_TYPES}\n\`\`\``),
  );
  assert.ok(
    markdown.includes(
      `**contract.prisma**\n\n\`\`\`prisma\n${kysely.SWITCH_PRISMA_CONTRACT}\n\`\`\``,
    ),
  );
  assert.ok(markdown.includes(`\`\`\`bash\n${kysely.SWITCH_COMMANDS}\n\`\`\``));
});

test("kysely JSON facts carry a source and dateChecked on every value", async () => {
  const facts = getKyselyFacts();
  assert.equal(facts.path, "/compare/kysely");
  assert.equal(facts.dateChecked, kysely.KYSELY_UPDATED.iso);
  assert.equal(facts.tools.kysely.softwareVersion, "0.29.7");
  assert.equal(facts.features.length, kysely.COMPARE_ROWS.length);
  for (const row of [...facts.features, ...facts.pricing]) {
    assert.match(row.kysely.source, /^https?:\/\//);
    assert.match(row.prisma.source, /^https?:\/\//);
    assert.equal(row.kysely.dateChecked, facts.dateChecked);
    assert.equal(row.prisma.dateChecked, facts.dateChecked);
  }
  for (const row of facts.databases) {
    for (const side of [row.kysely, row.orm8, row.orm7] as const) {
      assert.match(side.source, /^https?:\/\//);
      assert.equal(side.dateChecked, facts.dateChecked);
      assert.ok(side.value === "No" || typeof side.value === "string");
    }
  }
  const response = getKyselyFactsResponse();
  assert.match(response.headers.get("content-type") ?? "", /^application\/json/);
  assert.deepEqual(await response.json(), facts);

  const fields = getKyselyArticleFields();
  assert.equal(fields.datePublished, kysely.KYSELY_PUBLISHED.iso);
  assert.equal(fields.dateModified, kysely.KYSELY_UPDATED.iso);
  assert.equal(fields.about[0]?.name, "Kysely");
  assert.equal(fields.about[1]?.name, "Prisma ORM");
});

test("kysely metadata advertises Markdown and JSON alternates", () => {
  const types = getComparisonMetadata("kysely").alternates?.types;
  assert.ok(types);
  assert.match(types["text/markdown"] ?? "", /\/compare\/kysely\.md$/);
  assert.match(types["application/json"] ?? "", /\/compare\/kysely\.json$/);
});

function dataLabels(node: ReactNode): string[] {
  const labels: string[] = [];
  function walk(value: ReactNode) {
    if (!isValidElement<{ children?: ReactNode; "data-label"?: string }>(value)) return;
    if (typeof value.props["data-label"] === "string") labels.push(value.props["data-label"]);
    Children.forEach(value.props.children, walk);
  }
  walk(node);
  return labels;
}

test("stacked comparison tables label every cell for the phone card layout", () => {
  const feature = CompareTable({
    labelledBy: "feature-table",
    corner: "Feature",
    columns: ["Kysely", "Prisma ORM"],
    minWidth: "40rem",
    rows: [{ label: "Library price", cells: ["Free. MIT license.", "Free. Apache License 2.0."] }],
  });
  assert.deepEqual(dataLabels(feature), ["Kysely", "Prisma ORM"]);

  const pricing = ComparisonPricingTable({
    labelledBy: "pricing",
    corner: "Cost",
    columns: [
      { label: "Kysely", id: "pricing-kysely" },
      { label: "Prisma ORM", id: "pricing-prisma" },
    ],
    rows: [{ label: "Library license and cost", cells: ["Free, MIT", "Free, Apache 2.0"] }],
  });
  assert.deepEqual(dataLabels(pricing), ["Kysely", "Prisma ORM"]);
});

test("same-query line groups stay inside each tab's line count", () => {
  const count = (code: string) => code.split("\n").length;
  for (const group of kysely.SAME_QUERY_LINE_GROUPS) {
    for (const line of group.kysely) assert.ok(line >= 0 && line < count(kysely.SAME_QUERY.kysely));
    for (const line of group.prisma) assert.ok(line >= 0 && line < count(kysely.SAME_QUERY.prisma));
    for (const line of group.sql) assert.ok(line >= 0 && line < count(kysely.SAME_QUERY.sql));
  }
});

const compareDir = join(dirname(fileURLToPath(import.meta.url)), "../../app/compare");

test("comparison tables use the border token and only tab-stop when they scroll", () => {
  assert.match(TABLE_FRAME, /\bborder-border\b/);
  assert.doesNotMatch(TABLE_FRAME, /border-black\/\[0\.08\]/);
  const styles = readFileSync(join(compareDir, "table-styles.ts"), "utf8");
  assert.match(styles, /TABLE_ROW = "border-t border-border"/);
  for (const file of ["compare-table.tsx", "pricing-table.tsx"]) {
    const source = readFileSync(join(compareDir, file), "utf8");
    assert.doesNotMatch(source, /tabIndex=\{0\}/);
    assert.match(source, /TableScrollRegion/);
    assert.match(source, /TABLE_ROW/);
    assert.doesNotMatch(source, /border-black\/\[0\.06\]/);
  }
});

test("kysely code tabs stay unmounted when closed, while Markdown still has every snippet", () => {
  const source = readFileSync(join(compareDir, "kysely/_sections.tsx"), "utf8");
  assert.equal([...source.matchAll(/<CodeBlockTab /g)].length, 5);
  assert.doesNotMatch(source, /forceMount/);
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes(`**Kysely**\n\n\`\`\`ts\n${kysely.SAME_QUERY.kysely}\n\`\`\``));
  assert.ok(markdown.includes(`**Prisma ORM**\n\n\`\`\`ts\n${kysely.SAME_QUERY.prisma}\n\`\`\``));
  assert.ok(markdown.includes(`**SQL sent**\n\n\`\`\`sql\n${kysely.SAME_QUERY.sql}\n\`\`\``));
  assert.ok(
    markdown.includes(`**Kysely types**\n\n\`\`\`ts\n${kysely.SWITCH_KYSELY_TYPES}\n\`\`\``),
  );
  assert.ok(
    markdown.includes(
      `**contract.prisma**\n\n\`\`\`prisma\n${kysely.SWITCH_PRISMA_CONTRACT}\n\`\`\``,
    ),
  );
});

test("kysely code lines pad past the Copy pill and preload the unbracketed mono face", () => {
  const highlight = readFileSync(join(compareDir, "kysely/highlight.tsx"), "utf8");
  assert.match(highlight, /line pl-4 pr-12/);
  assert.match(highlight, /bg-prism-cyan-100/);
  assert.match(highlight, /bg-prism-yellow-100/);
  const sections = readFileSync(join(compareDir, "kysely/_sections.tsx"), "utf8");
  assert.match(sections, /not-fumadocs-codeblock/);
  assert.match(sections, /<TabCodeCopy /);
  assert.equal([...sections.matchAll(/allowCopy=\{false\}/g)].length, 5);
  const page = readFileSync(join(compareDir, "kysely/page.tsx"), "utf8");
  assert.match(page, /src: "\.\/mona-sans-mono\.woff2"/);
  assert.doesNotMatch(page, /preload:\s*false/);
  const toc = readFileSync(join(compareDir, "article-toc.tsx"), "utf8");
  assert.match(toc, /min-h-11 items-center/);
  const heading = readFileSync(join(compareDir, "anchor-heading.tsx"), "utf8");
  assert.match(heading, /tabIndex=\{inTabOrder \? 0 : -1\}/);
  assert.match(heading, /COPIED_VISIBLE_MS/);
  assert.match(readFileSync(join(compareDir, "copied.ts"), "utf8"), /COPIED_VISIBLE_MS = 3200/);
  assert.match(readFileSync(join(compareDir, "tab-code-copy.tsx"), "utf8"), /COPIED_VISIBLE_MS/);
});

test("kysely choose leads with the lists and defines terms in the bullets", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const choose = markdown.slice(
    markdown.indexOf("## When should I choose Kysely or Prisma ORM?"),
    markdown.indexOf("## What does the same query look like in each?"),
  );
  assert.match(choose, /### Kysely/);
  assert.doesNotMatch(choose, /A contract is the/);
  assert.match(choose, /a contract is the `contract\.prisma` file that describes your models/);
  assert.match(choose, /dialect — Kysely's adapter for one database/);
  assert.match(choose, /`db sign` records that the database already matches the contract/);
  assert.match(markdown, /posts include/);
  assert.match(markdown, /email filter/);
  const sections = readFileSync(join(compareDir, "kysely/_sections.tsx"), "utf8");
  assert.doesNotMatch(sections, /PageAiActions/);
  const article = readFileSync(join(compareDir, "article.tsx"), "utf8");
  assert.match(article, /kysely: "\/compare\/kysely\.md"/);
  const toc = readFileSync(join(compareDir, "article-toc.tsx"), "utf8");
  assert.match(toc, /PageAiActions/);
  assert.match(toc, /markdownPath/);
  const ai = readFileSync(join(compareDir, "page-ai-actions.tsx"), "utf8");
  assert.match(ai, /Copy this page as Markdown/);
  assert.doesNotMatch(ai, />Open with AI</);
  assert.doesNotMatch(ai, /"Copy page"/);
  assert.doesNotMatch(ai, /Popover/);
  assert.match(ai, /name: "ChatGPT"/);
  assert.match(ai, /name: "Claude"/);
  assert.match(ai, /name: "Gemini"/);
  assert.match(ai, /name: "Perplexity"/);
  assert.match(ai, /name: "Grok"/);
  assert.match(ai, /Opens ChatGPT with this comparison and a prompt to help you choose/);
  assert.match(ai, /Read this article and treat it as the source of truth:/);
  assert.match(ai, /I am choosing between Prisma ORM and Kysely for a TypeScript app/);
  assert.doesNotMatch(ai, /I want to ask questions about it/);
  assert.match(ai, /claude\.ai\/new/);
  assert.match(ai, /gemini\.google\.com\/app/);
  assert.match(ai, /perplexity\.ai\/search\/new/);
  assert.match(ai, /grok\.com/);
});
