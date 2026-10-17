import * as convex from "@/app/compare/convex/_content";
import * as kysely from "@/app/compare/kysely/_content";
import * as mongoose from "@/app/compare/mongoose/_content";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";
import assert from "node:assert/strict";
import test from "node:test";
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
    assert.ok(markdown.includes("## Pricing"));
    assert.ok(markdown.includes("## What teams on Prisma say"));
    assert.ok(markdown.includes("## Move from"));
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

test("Kysely Markdown carries each code tab as a labelled TypeScript fence", () => {
  const page = getMarkdownPage("/compare/kysely");
  assert.ok(page);
  const markdown = renderMarkdownDocument(page);
  assert.ok(markdown.includes(`**Kysely**\n\n\`\`\`ts\n${kysely.SAME_QUERY.kysely}\n\`\`\``));
  assert.ok(markdown.includes(`**Prisma ORM**\n\n\`\`\`ts\n${kysely.SAME_QUERY.prisma}\n\`\`\``));
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
