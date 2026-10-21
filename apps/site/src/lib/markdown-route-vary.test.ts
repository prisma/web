import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../app/llms.mdx/[[...slug]]/route";
import { AGENT_MARKDOWN_VARY } from "./agent-markdown";
import { getAnswerEntries } from "./answer-page-content";

/**
 * On Vercel a 200 carries the Markdown route's own `Vary` (the proxy's is
 * dropped), so the route itself has to name both request headers the proxy
 * negotiates on. A CDN 304 carries the proxy's instead; proxy-matcher.test.ts
 * checks that one.
 */

async function get(slug: string[]) {
  return GET(new Request(`https://www.prisma.io/llms.mdx/${slug.join("/")}`), {
    params: Promise.resolve({ slug }),
  } as Parameters<typeof GET>[1]);
}

test("the Markdown variant varies on Accept and User-Agent", () => {
  assert.equal(AGENT_MARKDOWN_VARY, "Accept, User-Agent");
});

test("a marketing page's Markdown declares Vary: Accept, User-Agent", async () => {
  for (const slug of [[], ["index"], ["pricing"], ["compute"], ["postgres"]]) {
    const response = await get(slug);
    assert.equal(response.status, 200, `/${slug.join("/")}`);
    assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY, `/${slug.join("/")}`);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  }
});

test("every product guide's Markdown declares Vary: Accept, User-Agent", async () => {
  const entries = getAnswerEntries();
  assert.ok(entries.length > 0);

  for (const entry of entries) {
    const response = await get(entry.url.slice(1).split("/"));
    assert.equal(response.status, 200, entry.url);
    assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY, entry.url);
  }
});

test("the Markdown 404 declares the same Vary", async () => {
  const response = await get(["postgres", "no-such-guide"]);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY);
});
