import assert from "node:assert/strict";
import test from "node:test";

import { metadata as homeMetadata } from "../app/page";
import { AGENT_MARKDOWN_PATHS, getMarkdownUrlPath } from "./agent-markdown";
import { createPageMetadata } from "./page-metadata";

function markdownAlternate(path: string) {
  const metadata = createPageMetadata({ title: "Pricing", description: "Plans", path });
  return (metadata.alternates?.types as Record<string, string> | undefined)?.["text/markdown"];
}

test("a page with a Markdown rendition names its .md URL as an alternate", () => {
  assert.match(markdownAlternate("/pricing") ?? "", /\/pricing\.md$/);
  assert.match(markdownAlternate("/compute") ?? "", /\/compute\.md$/);
  assert.match(markdownAlternate("/compare/neon") ?? "", /\/compare\/neon\.md$/);
});

test("every Markdown page's alternate matches the URL in its Link header", () => {
  for (const path of AGENT_MARKDOWN_PATHS) {
    if (path === "/") continue;
    const alternate = markdownAlternate(path);
    assert.ok(alternate, `${path}: no text/markdown alternate`);
    assert.equal(new URL(alternate).pathname, getMarkdownUrlPath(path), path);
  }
});

test("a page without a Markdown rendition names none", () => {
  assert.equal(markdownAlternate("/company"), undefined);
  assert.equal(markdownAlternate("/docs"), undefined);
  assert.equal(markdownAlternate("/blog/prisma-vs-netlify"), undefined);
});

test("the homepage names /index.md", () => {
  assert.deepEqual(homeMetadata.alternates?.types, { "text/markdown": "/index.md" });
});
