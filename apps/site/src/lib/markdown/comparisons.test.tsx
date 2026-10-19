import * as convex from "@/app/compare/convex/_content";
import * as kysely from "@/app/compare/kysely/_content";
import { MARTIN_SOCIALS, comparisonAuthorPerson } from "@/app/compare/byline";
import { getConvexArticleFields, getConvexFacts } from "@/app/compare/convex/facts";
import { GET as getConvexFactsResponse } from "@/app/compare/convex.json/route";
import { getConvexReadingStats } from "@/app/compare/convex/_sections";
import { getKyselyArticleFields, getKyselyFacts } from "@/app/compare/kysely/facts";
import { GET as getKyselyFactsResponse } from "@/app/compare/kysely.json/route";
import { getKyselyReadingStats } from "@/app/compare/kysely/_sections";
import * as mongoose from "@/app/compare/mongoose/_content";
import { getMongooseArticleFields, getMongooseFacts } from "@/app/compare/mongoose/facts";
import { getMongooseReadingStats } from "@/app/compare/mongoose/_sections";
import * as neon from "@/app/compare/neon/_content";
import { getNeonArticleFields, getNeonFacts } from "@/app/compare/neon/facts";
import { GET as getNeonFactsResponse } from "@/app/compare/neon.json/route";
import { getNeonReadingStats } from "@/app/compare/neon/_sections";
import * as supabase from "@/app/compare/supabase/_content";
import { getSupabaseArticleFields, getSupabaseFacts } from "@/app/compare/supabase/facts";
import { GET as getSupabaseFactsResponse } from "@/app/compare/supabase.json/route";
import { getSupabaseReadingStats } from "@/app/compare/supabase/_sections";
import { WORDS_PER_MINUTE, readingMinutes } from "@/app/compare/reading-time";
import { GET as getMongooseFactsResponse } from "@/app/compare/mongoose.json/route";
import {
  COMPARISON_CTA,
  CREATE_DB_NEW_TAB,
  CREATE_DB_WEB,
  ORM_COMPARISON_CTA,
  ORM_HERO_CTAS,
  POSTGRES_HERO_CTAS,
} from "@/app/compare/_content";
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
import { getBaseUrl } from "@/lib/url";
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
    const content = { convex, kysely, mongoose, neon, supabase }[entry.slug];
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
    assert.doesNotMatch(markdown, /listed in one place/);
    const sections = readFileSync(join(compareDir, `${entry.slug}/_sections.tsx`), "utf8");
    assert.doesNotMatch(sections, /listed in one place/);
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
  const minutes = getKyselyReadingStats().minutes;
  assert.ok(
    markdown.includes(
      `By [${kysely.KYSELY_AUTHOR.name}](${kysely.KYSELY_AUTHOR.path}) · Updated ${kysely.KYSELY_UPDATED.label} · ${minutes} min read`,
    ),
  );
  for (const social of MARTIN_SOCIALS) {
    assert.ok(
      markdown.includes(`[${social.label}](${social.href})`),
      `missing ${social.label} profile`,
    );
  }
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
    /Need a database\? \[Create an instant database\]\(https:\/\/create-db\.prisma\.io\/web\)/,
  );
  assert.doesNotMatch(markdown, /Free to start, no credit card required/);
  assert.doesNotMatch(markdown, /Create a database and start building in minutes/);
  assert.ok(markdown.includes("\n## Add Prisma ORM to an existing project\n"));
  assert.ok(
    markdown.includes("[Get started with Prisma ORM](/docs/prisma-orm/quickstart/postgresql)"),
  );
  assert.ok(markdown.includes(`[Create an instant database](${CREATE_DB_WEB})`));
  assert.doesNotMatch(
    markdown.slice(0, markdown.indexOf("## Add Prisma ORM to an existing project")),
    /console\.prisma\.io/,
  );
  assert.ok(markdown.includes("[Get started with Prisma Postgres](https://console.prisma.io)"));
  assert.equal(ORM_HERO_CTAS.secondary.href, CREATE_DB_WEB);
  assert.equal(ORM_HERO_CTAS.secondary.label, "Create an instant database");
  assert.equal(CREATE_DB_NEW_TAB.target, "_blank");
  assert.equal(CREATE_DB_NEW_TAB.rel, "noopener noreferrer");
  assert.doesNotMatch(CREATE_DB_WEB, /console\.prisma\.io|^\/docs/);
  const article = readFileSync(join(compareDir, "article.tsx"), "utf8");
  assert.match(article, /comparisonDisclosure/);
  assert.match(article, /w-full min-w-0/);
  assert.match(article, /CREATE_DB_NEW_TAB/);
  assert.doesNotMatch(article, /max-w-\[32rem\].*Prisma makes Prisma ORM/);
  const prismButton = readFileSync(
    join(compareDir, "../../components/brand/prism-button.tsx"),
    "utf8",
  );
  assert.match(prismButton, /target\?: React\.HTMLAttributeAnchorTarget/);
  assert.match(prismButton, /target=\{href \? target : undefined\}/);
  const mongoosePage = getMarkdownPage("/compare/mongoose");
  assert.ok(mongoosePage);
  const mongooseMarkdown = renderMarkdownDocument(mongoosePage);
  assert.ok(mongooseMarkdown.includes("Prisma ORM is free and open source, and always will be."));
  assert.ok(mongooseMarkdown.includes("Add the library"));
  assert.ok(mongooseMarkdown.includes(`[Create an instant database](${CREATE_DB_WEB})`));
  assert.match(
    mongooseMarkdown,
    /Need a database\? \[Create an instant database\]\(https:\/\/create-db\.prisma\.io\/web\)/,
  );
  assert.doesNotMatch(mongooseMarkdown, /Free to start, no credit card required/);
  const convexPage = getMarkdownPage("/compare/convex");
  assert.ok(convexPage);
  const convexMarkdown = renderMarkdownDocument(convexPage);
  assert.ok(convexMarkdown.includes("Free to start, no credit card required."));
  assert.ok(convexMarkdown.includes("Trusted by 500K+ developers globally"));
  assert.ok(convexMarkdown.includes("Prisma ORM is free and open source, and always will be."));
  assert.match(
    convexMarkdown,
    /Need a database\? \[Create an instant database\]\(https:\/\/create-db\.prisma\.io\/web\)/,
  );
  const neonPage = getMarkdownPage("/compare/neon");
  assert.ok(neonPage);
  const neonMarkdown = renderMarkdownDocument(neonPage);
  assert.ok(neonMarkdown.includes("Free to start, no credit card required."));
  assert.ok(neonMarkdown.includes("Trusted by 500K+ developers globally"));
  assert.ok(neonMarkdown.includes("Prisma ORM is free and open source, and always will be."));
  assert.match(
    neonMarkdown,
    /Need a database\? \[Create an instant database\]\(https:\/\/create-db\.prisma\.io\/web\)/,
  );
  const supabasePage = getMarkdownPage("/compare/supabase");
  assert.ok(supabasePage);
  const supabaseMarkdown = renderMarkdownDocument(supabasePage);
  assert.ok(supabaseMarkdown.includes("Free to start, no credit card required."));
  assert.ok(supabaseMarkdown.includes("Trusted by 500K+ developers globally"));
  assert.ok(supabaseMarkdown.includes("Prisma ORM is free and open source, and always will be."));
  assert.match(
    supabaseMarkdown,
    /Need a database\? \[Create an instant database\]\(https:\/\/create-db\.prisma\.io\/web\)/,
  );
  assert.equal(POSTGRES_HERO_CTAS.secondary.href, CREATE_DB_WEB);
  assert.equal(POSTGRES_HERO_CTAS.secondary.label, "Create an instant database");
  assert.equal(POSTGRES_HERO_CTAS.primary.href, "https://console.prisma.io");
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
  const stats = getKyselyReadingStats();
  assert.equal(fields.datePublished, kysely.KYSELY_PUBLISHED.iso);
  assert.equal(fields.dateModified, kysely.KYSELY_UPDATED.iso);
  assert.equal(WORDS_PER_MINUTE, 225);
  assert.equal(fields.wordCount, stats.wordCount);
  assert.equal(fields.timeRequired, `PT${stats.minutes}M`);
  assert.equal(stats.minutes, readingMinutes(stats.wordCount));
  assert.ok(stats.wordCount > 800);
  assert.equal(fields.about[0]?.name, "Kysely");
  assert.equal(fields.about[1]?.name, "Prisma ORM");
});

test("Kysely, Mongoose, and Convex Article JSON-LD authors are a Person with confirmed sameAs", () => {
  const hrefs = MARTIN_SOCIALS.map((social) => social.href);
  assert.deepEqual(hrefs, [
    "https://x.com/vanrensbird",
    "https://www.linkedin.com/in/martjvr/",
    "https://github.com/vanrensbird",
  ]);
  for (const author of [
    kysely.KYSELY_AUTHOR,
    mongoose.MONGOOSE_AUTHOR,
    convex.CONVEX_AUTHOR,
    neon.NEON_AUTHOR,
    supabase.SUPABASE_AUTHOR,
  ]) {
    const person = comparisonAuthorPerson(author, getBaseUrl());
    assert.equal(person["@type"], "Person");
    assert.equal(person.name, author.name);
    assert.equal(person.url, new URL(author.path, getBaseUrl()).toString());
    assert.deepEqual(person.sameAs, hrefs);
  }
  for (const page of [
    "kysely/page.tsx",
    "mongoose/page.tsx",
    "convex/page.tsx",
    "neon/page.tsx",
    "supabase/page.tsx",
  ]) {
    const source = readFileSync(join(compareDir, page), "utf8");
    assert.match(source, /comparisonAuthorPerson\(/);
    assert.doesNotMatch(source, /sameAs:\s*\[/);
  }
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

  const choose = CompareTable({
    labelledBy: "choose",
    columns: ["Kysely", "Prisma ORM"],
    minWidth: "40rem",
    rows: [
      {
        cells: [
          "You want the library itself to be the SQL query builder.",
          "You want a contract file.",
        ],
      },
    ],
  });
  assert.deepEqual(dataLabels(choose), ["Kysely", "Prisma ORM"]);

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
  assert.match(toc, /text-\[0\.8125rem\] leading-5/);
  assert.match(toc, /py-2\.5 pl-3\.5/);
  assert.match(toc, /overflow-y-auto/);
  const heading = readFileSync(join(compareDir, "anchor-heading.tsx"), "utf8");
  assert.match(heading, /tabIndex=\{inTabOrder \? 0 : -1\}/);
  assert.match(heading, /COPIED_VISIBLE_MS/);
  assert.match(readFileSync(join(compareDir, "copied.ts"), "utf8"), /COPIED_VISIBLE_MS = 3200/);
  assert.match(readFileSync(join(compareDir, "tab-code-copy.tsx"), "utf8"), /COPIED_VISIBLE_MS/);
});

test("kysely FAQ is the six Prisma-vs-Kysely Q&As with code fences, mongoose is not", () => {
  assert.equal(kysely.FAQ.length, 6);
  assert.equal(
    kysely.FAQ[0].question,
    "Does Prisma generate database migrations for you, unlike Kysely?",
  );
  assert.match(kysely.FAQ[0].answer, /```bash/);
  assert.match(kysely.FAQ[5].question, /Prisma 7 or Prisma 8/);
  assert.doesNotMatch(kysely.FAQ.map((item) => item.answer).join("\n"), /Kysely is a really good/);
  assert.equal(
    mongoose.FAQ.some((item) => item.question.includes("nested relations")),
    false,
  );
});

test("kysely choose leads with the lists and defines terms in the bullets", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const choose = markdown.slice(
    markdown.indexOf("## When should I choose Kysely or Prisma ORM?"),
    markdown.indexOf("## What does the same query look like in each?"),
  );
  assert.match(choose, /\| Kysely \| Prisma ORM \|/);
  assert.doesNotMatch(choose, /### Kysely/);
  assert.doesNotMatch(choose, /A contract is the/);
  assert.match(choose, /a contract is the `contract\.prisma` file that describes your models/);
  assert.match(choose, /dialect — Kysely's adapter for one database/);
  assert.match(choose, /`db sign` records that the database already matches the contract/);
  assert.match(markdown, /posts include/);
  assert.match(markdown, /email filter/);
  const sections = readFileSync(join(compareDir, "kysely/_sections.tsx"), "utf8");
  assert.doesNotMatch(sections, /PageAiActions/);
  assert.match(sections, /comparisonChooseTable/);
  assert.doesNotMatch(sections, /grid gap-10 sm:grid-cols-2/);
  const article = readFileSync(join(compareDir, "article.tsx"), "utf8");
  assert.match(article, /function comparisonChooseTable/);
  assert.match(article, /kysely: "\/compare\/kysely\.md"/);
  assert.match(article, /pt-32 sm:pt-40/);
  assert.match(article, /header className="mx-auto max-w-site px-6 sm:px-8"/);
  assert.match(article, /lg:justify-center/);
  assert.match(article, /rounded-2xl bg-muted\/50 px-6 py-10 sm:px-12 sm:py-14 lg:px-16/);
  assert.match(article, /lg:grid-cols-\[minmax\(0,760px\)_220px\]/);
  assert.match(article, /min-w-0 max-w-3xl/);
  assert.match(article, /overflow-x-clip/);
  assert.doesNotMatch(article, /w-screen|100vw/);
  assert.doesNotMatch(article, /max-w-\[54rem\]/);
  assert.doesNotMatch(article, /lg:grid-cols-\[minmax\(0,1fr\)_11rem\]/);
  const byline = readFileSync(join(compareDir, "byline.tsx"), "utf8");
  assert.match(byline, /linkedin\.com\/in\/martjvr/);
  assert.match(byline, /x\.com\/vanrensbird/);
  assert.match(byline, /github\.com\/vanrensbird/);
  assert.match(byline, /size-11/);
  const toc = readFileSync(join(compareDir, "article-toc.tsx"), "utf8");
  assert.match(toc, /PageAiActions/);
  assert.match(toc, /markdownPath/);
  const desktopToc = toc.slice(
    toc.indexOf("export function ArticleToc"),
    toc.indexOf("export function ArticleTocDisclosure"),
  );
  assert.ok(desktopToc.indexOf("PageAiActions") < desktopToc.indexOf(">On this page</p>"));
  assert.match(desktopToc, /mb-3 text-\[0\.8125rem\] font-medium/);
  const disclosureToc = toc.slice(toc.indexOf("export function ArticleTocDisclosure"));
  assert.ok(disclosureToc.indexOf("PageAiActions") < disclosureToc.indexOf("<TocList"));
  assert.match(disclosureToc, /px-4 pt-1 pb-3/);
  assert.doesNotMatch(toc, /text-\[11px\]/);
  assert.doesNotMatch(toc, /py-1 pl-2\.5/);
  assert.match(sections, /max-w-4xl text-balance font-heading/);
  assert.match(sections, /mt-6 max-w-3xl text-pretty/);
  assert.doesNotMatch(sections, /max-w-2xl/);
  assert.match(sections, /comparisonProofCards/);
  const proof = readFileSync(join(compareDir, "proof-cards.tsx"), "utf8");
  assert.match(proof, /grid gap-4 sm:grid-cols-2/);
  assert.match(proof, /rounded-xl border border-border bg-card p-6/);
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
  assert.match(ai, /I am choosing between Prisma ORM and Mongoose for a TypeScript app/);
  assert.match(ai, /I am choosing between Prisma Postgres and Convex for a TypeScript app/);
  assert.doesNotMatch(ai, /I want to ask questions about it/);
  assert.match(ai, /claude\.ai\/new/);
  assert.match(ai, /gemini\.google\.com\/app/);
  assert.match(ai, /perplexity\.ai\/search\/new/);
  assert.match(ai, /grok\.com/);
});

test("Mongoose Markdown carries the byline and each code tab as a labelled TypeScript fence", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const minutes = getMongooseReadingStats().minutes;
  assert.ok(
    markdown.includes(
      `By [${mongoose.MONGOOSE_AUTHOR.name}](${mongoose.MONGOOSE_AUTHOR.path}) · Updated ${mongoose.MONGOOSE_UPDATED.label} · ${minutes} min read`,
    ),
  );
  for (const social of MARTIN_SOCIALS) {
    assert.ok(
      markdown.includes(`[${social.label}](${social.href})`),
      `missing ${social.label} profile`,
    );
  }
  assert.ok(markdown.includes(`**Mongoose**\n\n\`\`\`ts\n${mongoose.SAME_QUERY.mongoose}\n\`\`\``));
  assert.ok(markdown.includes(`**Prisma ORM**\n\n\`\`\`ts\n${mongoose.SAME_QUERY.prisma}\n\`\`\``));
  assert.ok(
    markdown.includes(`**MongoDB sent**\n\n\`\`\`ts\n${mongoose.SAME_QUERY.mongo}\n\`\`\``),
  );
});

test("mongoose Markdown keeps yes and no marks out of the feature table, and anchored headings intact", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const hosted = markdown.split("\n").find((line) => line.startsWith("| Hosted database |"));
  assert.ok(hosted);
  assert.ok(
    hosted.startsWith("| Hosted database | None. Mongoose is a library. You bring MongoDB. |"),
  );
  assert.doesNotMatch(hosted, /\b(Yes|No)\b/);
  assert.ok(markdown.includes("\n## When should I choose Mongoose or Prisma ORM?\n"));
  assert.ok(markdown.includes("\n### The same ORM client on PostgreSQL\n"));
  assert.ok(markdown.includes("\n### Migrations for indexes and validators\n"));
  assert.doesNotMatch(markdown, /Copy link|Copied/);
});

test("mongoose Markdown carries the database matrix and the task table as Markdown tables", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes("\n## Which databases do Prisma ORM and Mongoose support?\n"));
  assert.ok(markdown.includes("| Database | Mongoose | Prisma ORM 8 | Prisma ORM 7 |"));
  for (const row of mongoose.DATABASE_MATRIX) {
    const cells = [row.mongoose, row.orm8, row.orm7].map((status) => status ?? "No");
    assert.ok(
      markdown.includes(`| ${row.database} | ${cells.join(" | ")} |`),
      `missing matrix row: ${row.database}`,
    );
  }
  assert.ok(
    markdown.includes("| MongoDB | Supported | Early access | Use 6.19 |"),
    "MongoDB ORM 7 follows the migrate guide, not the v7 databases page",
  );
  assert.ok(
    markdown.includes("](/compare/mongoose#databases)"),
    "Databases row links to the matrix",
  );

  assert.ok(markdown.includes("\n## How does each task look in Mongoose and Prisma ORM?\n"));
  assert.ok(markdown.includes("| Task | Mongoose | Prisma ORM |"));
  const plain = plainMarkdown(markdown);
  for (const row of mongoose.SAME_JOB) {
    const line = markdown.split("\n").find((text) => text.startsWith(`| ${row.task} |`));
    assert.ok(line, `missing task row: ${row.task}`);
    assert.ok(
      plain.includes(stripFaqAnswerMarkup(row.mongoose)),
      `missing Mongoose cell: ${row.task}`,
    );
    assert.ok(plain.includes(stripFaqAnswerMarkup(row.prisma)), `missing Prisma cell: ${row.task}`);
  }
});

test("mongoose Markdown renders the remaining cards and drops the fit columns", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.equal(mongoose.APART.length, 4);
  for (const card of mongoose.APART) {
    assert.ok(markdown.includes(`\n### ${card.title}\n`), `missing card heading: ${card.title}`);
  }
  assert.doesNotMatch(markdown, /When is Mongoose the better fit\?/);
  assert.doesNotMatch(markdown, /When is Prisma ORM the better fit\?/);
  assert.doesNotMatch(markdown, /Where each fits/);
  assert.doesNotMatch(markdown, /choose-mongoose/);
});

test("mongoose Markdown cites the MongoDB Prisma Next post, /mongodb, and MongoDB without compromise in the body and Sources", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const sourcesAt = markdown.indexOf("\n## Sources\n");
  assert.ok(sourcesAt > 0, "missing Sources heading");
  const body = markdown.slice(0, sourcesAt);
  const sources = markdown.slice(sourcesAt);
  const cites = [
    mongoose.MONGO_BLOG_PRISMA_NEXT,
    mongoose.PRISMA_MONGODB_PAGE,
    mongoose.PRISMA_MONGODB_BLOG,
  ];
  for (const href of cites) {
    assert.ok(body.includes(`](${href})`), `body missing ${href}`);
    assert.ok(sources.includes(`](${href})`), `Sources missing ${href}`);
  }
  assert.match(body, /Driver team named this as the top missing feature/);
  assert.match(body, /findMany/);
  assert.match(body, /data migrations were still coming/);
});

test("mongoose Markdown carries pricing as a table followed by the free tier note", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const section = markdown
    .split("\n## How much do Prisma ORM and Mongoose cost?\n")[1]
    ?.split("\n## ")[0];
  assert.ok(section, "missing pricing section");
  assert.ok(section.includes("| Cost | Mongoose | Prisma ORM |"));
  for (const row of mongoose.PRICING) {
    const line = section.split("\n").find((text) => text.startsWith(`| ${row.label} |`));
    assert.ok(line, `missing pricing row: ${row.label}`);
    assert.ok(plainMarkdown(line).includes(stripFaqAnswerMarkup(row.prisma)));
  }
  assert.match(
    section.trimEnd(),
    /\|\n\nPrisma Postgres has a Free plan: \$0 a month for 200,000 operations, 2 GB of storage, and 50 databases\. The \[pricing page\]\(\/pricing\) lists the paid plans\.$/,
  );
});

test("mongoose Markdown opens with the check date and does not add a period after the title's question mark", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes("Checked October 2026."));
  assert.ok(markdown.includes(`dateModified: ${mongoose.MONGOOSE_UPDATED.iso}`));
  assert.doesNotMatch(markdown, /code\?\./);
  assert.doesNotMatch(markdown, /`[^`\n]+`\\\./);
  assert.doesNotMatch(markdown, /\]\([^)]+\)\\\./);
});

test("mongoose Markdown carries the switch schema, contract, and commands", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(
    markdown.includes(
      `**Mongoose schema**\n\n\`\`\`ts\n${mongoose.SWITCH_MONGOOSE_SCHEMA}\n\`\`\``,
    ),
  );
  assert.ok(
    markdown.includes(
      `**contract.prisma**\n\n\`\`\`prisma\n${mongoose.SWITCH_PRISMA_CONTRACT}\n\`\`\``,
    ),
  );
  assert.ok(markdown.includes(`\`\`\`bash\n${mongoose.SWITCH_COMMANDS}\n\`\`\``));
  assert.ok(markdown.includes("orm init --target mongodb"));
  assert.doesNotMatch(markdown, /contract infer --output/);
});

test("mongoose JSON facts carry a source and dateChecked on every value", async () => {
  const facts = getMongooseFacts();
  assert.equal(facts.path, "/compare/mongoose");
  assert.equal(facts.dateChecked, mongoose.MONGOOSE_UPDATED.iso);
  assert.equal(facts.tools.mongoose.softwareVersion, "9.11.2");
  assert.equal(facts.features.length, mongoose.COMPARE_ROWS.length);
  for (const row of [...facts.features, ...facts.pricing]) {
    assert.match(row.mongoose.source, /^https?:\/\//);
    assert.match(row.prisma.source, /^https?:\/\//);
    assert.equal(row.mongoose.dateChecked, facts.dateChecked);
    assert.equal(row.prisma.dateChecked, facts.dateChecked);
  }
  for (const row of facts.databases) {
    for (const side of [row.mongoose, row.orm8, row.orm7] as const) {
      assert.match(side.source, /^https?:\/\//);
      assert.equal(side.dateChecked, facts.dateChecked);
      assert.ok(side.value === "No" || typeof side.value === "string");
    }
  }
  const mongo = facts.databases.find((row) => row.database === "MongoDB");
  assert.equal(mongo?.orm7.value, "Use 6.19");
  assert.match(mongo?.orm7.source ?? "", /guides\/v7\/switch-to-prisma-orm\/from-mongoose/);
  const response = getMongooseFactsResponse();
  assert.match(response.headers.get("content-type") ?? "", /^application\/json/);
  assert.deepEqual(await response.json(), facts);

  const fields = getMongooseArticleFields();
  const stats = getMongooseReadingStats();
  assert.equal(fields.datePublished, mongoose.MONGOOSE_PUBLISHED.iso);
  assert.equal(fields.dateModified, mongoose.MONGOOSE_UPDATED.iso);
  assert.equal(fields.wordCount, stats.wordCount);
  assert.equal(fields.timeRequired, `PT${stats.minutes}M`);
  assert.equal(stats.minutes, readingMinutes(stats.wordCount));
  assert.ok(stats.wordCount > 800);
  assert.equal(fields.about[0]?.name, "Mongoose");
  assert.equal(fields.about[1]?.name, "Prisma ORM");
});

test("mongoose metadata advertises Markdown and JSON alternates", () => {
  const types = getComparisonMetadata("mongoose").alternates?.types;
  assert.ok(types);
  assert.match(types["text/markdown"] ?? "", /\/compare\/mongoose\.md$/);
  assert.match(types["application/json"] ?? "", /\/compare\/mongoose\.json$/);
});

test("mongoose same-query line groups stay inside each tab's line count", () => {
  const count = (code: string) => code.split("\n").length;
  for (const group of mongoose.SAME_QUERY_LINE_GROUPS) {
    for (const line of group.mongoose)
      assert.ok(line >= 0 && line < count(mongoose.SAME_QUERY.mongoose));
    for (const line of group.prisma)
      assert.ok(line >= 0 && line < count(mongoose.SAME_QUERY.prisma));
    for (const line of group.mongo) assert.ok(line >= 0 && line < count(mongoose.SAME_QUERY.mongo));
  }
});

test("mongoose code tabs stay unmounted when closed, while Markdown still has every snippet", () => {
  const source = readFileSync(join(compareDir, "mongoose/_sections.tsx"), "utf8");
  assert.equal([...source.matchAll(/<CodeBlockTab /g)].length, 5);
  assert.doesNotMatch(source, /forceMount/);
  assert.doesNotMatch(source, /PageAiActions/);
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes("\n## Sources\n"));
  assert.ok(markdown.includes("Prisma makes Prisma ORM"));
});

test("mongoose choose leads with the lists and Open-with-AI points at mongoose.md", () => {
  const page = getMarkdownPage("/compare/mongoose");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const choose = markdown.slice(
    markdown.indexOf("## When should I choose Mongoose or Prisma ORM?"),
    markdown.indexOf("## What does the same query look like in each?"),
  );
  assert.match(choose, /\| Mongoose \| Prisma ORM \|/);
  assert.doesNotMatch(choose, /### Mongoose/);
  assert.match(choose, /a contract is the file that describes your collections or tables/);
  assert.match(markdown, /author include/);
  assert.match(markdown, /published filter/);
  const article = readFileSync(join(compareDir, "article.tsx"), "utf8");
  assert.match(article, /mongoose: "\/compare\/mongoose\.md"/);
  const sections = readFileSync(join(compareDir, "mongoose/_sections.tsx"), "utf8");
  assert.match(sections, /comparisonChooseTable/);
  assert.doesNotMatch(sections, /grid gap-10 sm:grid-cols-2/);
  assert.match(sections, /max-w-4xl text-balance font-heading/);
  assert.match(sections, /mt-6 max-w-3xl text-pretty/);
  assert.doesNotMatch(sections, /max-w-2xl/);
  assert.match(sections, /comparisonProofCards/);
  const ai = readFileSync(join(compareDir, "page-ai-actions.tsx"), "utf8");
  assert.match(ai, /pageMdUrl.includes\("\/compare\/mongoose\.md"\)/);
  assert.match(ai, /I am choosing between Prisma ORM and Mongoose for a TypeScript app/);
  assert.match(ai, /schema lives next to the model in application code/);
  assert.doesNotMatch(ai, /Open-with-AI prompt pointed at `\/compare\/kysely\.md` for mongoose/);
});

test("Convex Markdown carries the byline, disclosure, and Sources on the shared chrome", () => {
  const page = getMarkdownPage("/compare/convex");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const minutes = getConvexReadingStats().minutes;
  assert.ok(
    markdown.includes(
      `By [${convex.CONVEX_AUTHOR.name}](${convex.CONVEX_AUTHOR.path}) · Updated ${convex.CONVEX_UPDATED.label} · ${minutes} min read`,
    ),
  );
  for (const social of MARTIN_SOCIALS) {
    assert.ok(
      markdown.includes(`[${social.label}](${social.href})`),
      `missing ${social.label} profile`,
    );
  }
  assert.ok(markdown.includes("Checked October 2026."));
  assert.ok(markdown.includes(`dateModified: ${convex.CONVEX_UPDATED.iso}`));
  assert.ok(markdown.includes("Prisma makes Prisma Postgres"));
  assert.ok(markdown.includes("\n## Sources\n"));
  assert.ok(markdown.includes("\n## When should I choose Convex or Prisma Postgres?\n"));
  const choose = markdown.slice(
    markdown.indexOf("## When should I choose Convex or Prisma Postgres?"),
    markdown.indexOf("## How do Convex and Prisma Postgres compare?"),
  );
  assert.match(choose, /^\| Convex \| Prisma Postgres \|$/m);
  assert.doesNotMatch(choose, /### Convex/);
  assert.ok(markdown.includes("\n## How do Convex and Prisma Postgres compare?\n"));
  assert.ok(markdown.includes("\n## Where does each one fit?\n"));
  assert.ok(markdown.includes("\n## How much do Convex and Prisma Postgres cost?\n"));
  assert.ok(markdown.includes("| Feature | Convex | Prisma Postgres |"));
  assert.ok(markdown.includes("| Cost | Convex | Prisma Postgres |"));
  assert.doesNotMatch(markdown, /When should I choose Kysely/);
  assert.doesNotMatch(markdown, /fluent TypeScript builder/);
  assert.doesNotMatch(markdown, /Copy link|Copied/);
  const article = readFileSync(join(compareDir, "article.tsx"), "utf8");
  assert.match(article, /convex: "\/compare\/convex\.md"/);
  const sections = readFileSync(join(compareDir, "convex/_sections.tsx"), "utf8");
  assert.match(sections, /comparisonChooseTable/);
  assert.match(sections, /max-w-4xl text-balance font-heading/);
  assert.match(sections, /mt-6 max-w-3xl text-pretty/);
  assert.match(sections, /comparisonProofCards/);
  assert.match(sections, /comparisonDisclosure/);
  assert.doesNotMatch(sections, /defaultValue=/);
  assert.doesNotMatch(sections, /PageAiActions/);
  const ai = readFileSync(join(compareDir, "page-ai-actions.tsx"), "utf8");
  assert.match(ai, /pageMdUrl.includes\("\/compare\/convex\.md"\)/);
  assert.match(ai, /I am choosing between Prisma Postgres and Convex for a TypeScript app/);
  assert.match(ai, /reactive database with TypeScript query functions/);
});

test("convex JSON facts carry a source and dateChecked on every value", async () => {
  const facts = getConvexFacts();
  assert.equal(facts.path, "/compare/convex");
  assert.equal(facts.dateChecked, convex.CONVEX_UPDATED.iso);
  assert.equal(facts.tools.convex.softwareVersion, "1.47.0");
  assert.equal(facts.features.length, convex.COMPARE_ROWS.length);
  for (const row of [...facts.features, ...facts.pricing]) {
    assert.match(row.convex.source, /^https?:\/\//);
    assert.match(row.prisma.source, /^https?:\/\//);
    assert.equal(row.convex.dateChecked, facts.dateChecked);
    assert.equal(row.prisma.dateChecked, facts.dateChecked);
  }
  const response = getConvexFactsResponse();
  assert.match(response.headers.get("content-type") ?? "", /^application\/json/);
  assert.deepEqual(await response.json(), facts);

  const fields = getConvexArticleFields();
  const stats = getConvexReadingStats();
  assert.equal(fields.datePublished, convex.CONVEX_PUBLISHED.iso);
  assert.equal(fields.dateModified, convex.CONVEX_UPDATED.iso);
  assert.equal(WORDS_PER_MINUTE, 225);
  assert.equal(fields.wordCount, stats.wordCount);
  assert.equal(fields.timeRequired, `PT${stats.minutes}M`);
  assert.equal(stats.minutes, readingMinutes(stats.wordCount));
  assert.ok(stats.wordCount > 800);
  assert.equal(fields.about[0]?.name, "Convex");
  assert.equal(fields.about[1]?.name, "Prisma Postgres");
});

test("convex metadata advertises Markdown and JSON alternates", () => {
  const types = getComparisonMetadata("convex").alternates?.types;
  assert.ok(types);
  assert.match(types["text/markdown"] ?? "", /\/compare\/convex\.md$/);
  assert.match(types["application/json"] ?? "", /\/compare\/convex\.json$/);
});

test("Neon Markdown carries the byline, disclosure, and Sources on the shared chrome", () => {
  const page = getMarkdownPage("/compare/neon");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const minutes = getNeonReadingStats().minutes;
  assert.ok(
    markdown.includes(
      `By [${neon.NEON_AUTHOR.name}](${neon.NEON_AUTHOR.path}) · Updated ${neon.NEON_UPDATED.label} · ${minutes} min read`,
    ),
  );
  for (const social of MARTIN_SOCIALS) {
    assert.ok(
      markdown.includes(`[${social.label}](${social.href})`),
      `missing ${social.label} profile`,
    );
  }
  assert.ok(markdown.includes("Checked October 2026."));
  assert.ok(markdown.includes(`dateModified: ${neon.NEON_UPDATED.iso}`));
  assert.ok(markdown.includes("Prisma makes Prisma Postgres"));
  assert.ok(markdown.includes("\n## Sources\n"));
  assert.ok(markdown.includes("\n## When should I choose Neon or Prisma Postgres?\n"));
  const choose = markdown.slice(
    markdown.indexOf("## When should I choose Neon or Prisma Postgres?"),
    markdown.indexOf("## How do Neon and Prisma Postgres compare?"),
  );
  assert.match(choose, /^\| Neon \| Prisma Postgres \|$/m);
  assert.doesNotMatch(choose, /### Neon/);
  assert.ok(markdown.includes("\n## How do Neon and Prisma Postgres compare?\n"));
  assert.ok(markdown.includes("\n## Where does each one fit?\n"));
  assert.ok(markdown.includes("\n## How much do Neon and Prisma Postgres cost?\n"));
  assert.ok(markdown.includes("| Feature | Neon | Prisma Postgres |"));
  assert.ok(markdown.includes("| Cost | Neon | Prisma Postgres |"));
  assert.ok(markdown.includes("$0.106"));
  assert.ok(markdown.includes("$0.222"));
  assert.ok(markdown.includes("$0.35"));
  assert.doesNotMatch(markdown, /database branching/);
  assert.doesNotMatch(markdown, /one plan|one bill/);
  assert.doesNotMatch(markdown, /zero cold starts|no cold starts/);
  assert.doesNotMatch(markdown, /requires Prisma ORM/);
  assert.doesNotMatch(markdown, /the only|the first|the best/);
  assert.doesNotMatch(markdown, /listed in one place/);
  assert.doesNotMatch(markdown, /When should I choose Kysely/);
  assert.doesNotMatch(markdown, /Copy link|Copied/);
  const article = readFileSync(join(compareDir, "article.tsx"), "utf8");
  assert.match(article, /neon: "\/compare\/neon\.md"/);
  const sections = readFileSync(join(compareDir, "neon/_sections.tsx"), "utf8");
  assert.match(sections, /comparisonChooseTable/);
  assert.match(sections, /max-w-4xl text-balance font-heading/);
  assert.match(sections, /mt-6 max-w-3xl text-pretty/);
  assert.match(sections, /comparisonProofCards/);
  assert.match(sections, /comparisonDisclosure/);
  assert.doesNotMatch(sections, /defaultValue=/);
  assert.doesNotMatch(sections, /PageAiActions/);
  const ai = readFileSync(join(compareDir, "page-ai-actions.tsx"), "utf8");
  assert.match(ai, /pageMdUrl.includes\("\/compare\/neon\.md"\)/);
  assert.match(ai, /I am choosing between Prisma Postgres and Neon for a TypeScript app/);
  assert.match(ai, /Neon Functions, Auth, Object Storage, and AI Gateway/);
});

test("neon JSON facts carry a source and dateChecked on every value", async () => {
  const facts = getNeonFacts();
  assert.equal(facts.path, "/compare/neon");
  assert.equal(facts.dateChecked, neon.NEON_UPDATED.iso);
  assert.equal(facts.tools.neon.softwareVersion, "current");
  assert.equal(facts.features.length, neon.COMPARE_ROWS.length);
  for (const row of [...facts.features, ...facts.pricing]) {
    assert.match(row.neon.source, /^https?:\/\//);
    assert.match(row.prisma.source, /^https?:\/\//);
    assert.equal(row.neon.dateChecked, facts.dateChecked);
    assert.equal(row.prisma.dateChecked, facts.dateChecked);
  }
  const response = getNeonFactsResponse();
  assert.match(response.headers.get("content-type") ?? "", /^application\/json/);
  assert.deepEqual(await response.json(), facts);

  const fields = getNeonArticleFields();
  const stats = getNeonReadingStats();
  assert.equal(fields.datePublished, neon.NEON_PUBLISHED.iso);
  assert.equal(fields.dateModified, neon.NEON_UPDATED.iso);
  assert.equal(WORDS_PER_MINUTE, 225);
  assert.equal(fields.wordCount, stats.wordCount);
  assert.equal(fields.timeRequired, `PT${stats.minutes}M`);
  assert.equal(stats.minutes, readingMinutes(stats.wordCount));
  assert.ok(stats.wordCount > 800);
  assert.equal(fields.about[0]?.name, "Neon");
  assert.equal(fields.about[1]?.name, "Prisma Postgres");
});

test("neon metadata advertises Markdown and JSON alternates", () => {
  const types = getComparisonMetadata("neon").alternates?.types;
  assert.ok(types);
  assert.match(types["text/markdown"] ?? "", /\/compare\/neon\.md$/);
  assert.match(types["application/json"] ?? "", /\/compare\/neon\.json$/);
});

test("Supabase Markdown carries the byline, disclosure, and Sources on the shared chrome", () => {
  const page = getMarkdownPage("/compare/supabase");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  const minutes = getSupabaseReadingStats().minutes;
  assert.ok(
    markdown.includes(
      `By [${supabase.SUPABASE_AUTHOR.name}](${supabase.SUPABASE_AUTHOR.path}) · Updated ${supabase.SUPABASE_UPDATED.label} · ${minutes} min read`,
    ),
  );
  for (const social of MARTIN_SOCIALS) {
    assert.ok(
      markdown.includes(`[${social.label}](${social.href})`),
      `missing ${social.label} profile`,
    );
  }
  assert.ok(markdown.includes("Checked October 2026."));
  assert.ok(markdown.includes(`dateModified: ${supabase.SUPABASE_UPDATED.iso}`));
  assert.ok(markdown.includes("Prisma makes Prisma Postgres"));
  assert.ok(markdown.includes("\n## Sources\n"));
  assert.ok(markdown.includes("\n## When should I choose Supabase or Prisma Postgres?\n"));
  const choose = markdown.slice(
    markdown.indexOf("## When should I choose Supabase or Prisma Postgres?"),
    markdown.indexOf("## How do Supabase and Prisma Postgres compare?"),
  );
  assert.match(choose, /^\| Supabase \| Prisma Postgres \|$/m);
  assert.doesNotMatch(choose, /### Supabase/);
  assert.ok(markdown.includes("\n## How do Supabase and Prisma Postgres compare?\n"));
  assert.ok(markdown.includes("\n## Where does each one fit?\n"));
  assert.ok(markdown.includes("\n## How much do Supabase and Prisma Postgres cost?\n"));
  assert.ok(markdown.includes("| Feature | Supabase | Prisma Postgres |"));
  assert.ok(markdown.includes("| Cost | Supabase | Prisma Postgres |"));
  assert.ok(markdown.includes("$25"));
  assert.ok(markdown.includes("$599"));
  assert.ok(markdown.includes("2 GB"));
  assert.ok(markdown.includes("500 MB"));
  assert.ok(markdown.includes("Business plan at $129"));
  assert.doesNotMatch(markdown, /500 MB storage on Free/);
  assert.doesNotMatch(
    markdown,
    /HIPAA starts with Pro|HIPAA from Pro|HIPAA support starts with Pro/,
  );
  assert.doesNotMatch(markdown, /database branching/);
  assert.doesNotMatch(markdown, /one plan|one bill/);
  assert.doesNotMatch(markdown, /zero cold starts|no cold starts/);
  assert.doesNotMatch(markdown, /requires Prisma ORM/);
  assert.doesNotMatch(markdown, /listed in one place/);
  assert.doesNotMatch(markdown, /When should I choose Kysely/);
  assert.doesNotMatch(markdown, /Copy link|Copied/);
  const article = readFileSync(join(compareDir, "article.tsx"), "utf8");
  assert.match(article, /supabase: "\/compare\/supabase\.md"/);
  const sections = readFileSync(join(compareDir, "supabase/_sections.tsx"), "utf8");
  assert.match(sections, /comparisonChooseTable/);
  assert.match(sections, /max-w-4xl text-balance font-heading/);
  assert.match(sections, /mt-6 max-w-3xl text-pretty/);
  assert.match(sections, /comparisonProofCards/);
  assert.match(sections, /comparisonDisclosure/);
  assert.doesNotMatch(sections, /defaultValue=/);
  assert.doesNotMatch(sections, /PageAiActions/);
  const ai = readFileSync(join(compareDir, "page-ai-actions.tsx"), "utf8");
  assert.match(ai, /pageMdUrl.includes\("\/compare\/supabase\.md"\)/);
  assert.match(ai, /I am choosing between Prisma Postgres and Supabase for a TypeScript app/);
  assert.match(ai, /Auth, Storage, Realtime, and Edge Functions/);
});

test("supabase JSON facts carry a source and dateChecked on every value", async () => {
  const facts = getSupabaseFacts();
  assert.equal(facts.path, "/compare/supabase");
  assert.equal(facts.dateChecked, supabase.SUPABASE_UPDATED.iso);
  assert.equal(facts.tools.supabase.softwareVersion, "current");
  assert.equal(facts.features.length, supabase.COMPARE_ROWS.length);
  for (const row of [...facts.features, ...facts.pricing]) {
    assert.match(row.supabase.source, /^https?:\/\//);
    assert.match(row.prisma.source, /^https?:\/\//);
    assert.equal(row.supabase.dateChecked, facts.dateChecked);
    assert.equal(row.prisma.dateChecked, facts.dateChecked);
  }
  const response = getSupabaseFactsResponse();
  assert.match(response.headers.get("content-type") ?? "", /^application\/json/);
  assert.deepEqual(await response.json(), facts);

  const fields = getSupabaseArticleFields();
  const stats = getSupabaseReadingStats();
  assert.equal(fields.datePublished, supabase.SUPABASE_PUBLISHED.iso);
  assert.equal(fields.dateModified, supabase.SUPABASE_UPDATED.iso);
  assert.equal(WORDS_PER_MINUTE, 225);
  assert.equal(fields.wordCount, stats.wordCount);
  assert.equal(fields.timeRequired, `PT${stats.minutes}M`);
  assert.equal(stats.minutes, readingMinutes(stats.wordCount));
  assert.ok(stats.wordCount > 800);
  assert.equal(fields.about[0]?.name, "Supabase");
  assert.equal(fields.about[1]?.name, "Prisma Postgres");
});

test("supabase metadata advertises Markdown and JSON alternates", () => {
  const types = getComparisonMetadata("supabase").alternates?.types;
  assert.ok(types);
  assert.match(types["text/markdown"] ?? "", /\/compare\/supabase\.md$/);
  assert.match(types["application/json"] ?? "", /\/compare\/supabase\.json$/);
});
