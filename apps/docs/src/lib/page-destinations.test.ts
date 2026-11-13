import assert from "node:assert/strict";
import test from "node:test";
import { destinationHrefs, destinationPrompt, type DestinationTool } from "./page-destinations";

const markdownUrl = "/docs/orm.mdx";
const origin = "https://www.prisma.io";
const prompt = "Read https://www.prisma.io/docs/orm.mdx, I want to ask questions about it.";

/**
 * Where each tool expects the prompt. A wrong key or encoding breaks the
 * hand-off silently (the tool opens with an empty box), so each format is
 * pinned here: the URL's base, where the prompt lives, and any fixed params.
 */
const expected: Record<
  DestinationTool,
  { base: string; param?: string; hash?: string; extra?: Record<string, string> }
> = {
  chatgpt: { base: "https://chatgpt.com/", param: "q", extra: { hints: "search" } },
  claude: { base: "https://claude.ai/new", param: "q" },
  perplexity: { base: "https://www.perplexity.ai/", param: "q" },
  cursor: { base: "https://cursor.com/link/prompt", param: "text" },
  zed: { base: "zed://agent", param: "prompt" },
  v0: { base: "https://v0.app/chat", param: "q" },
  bolt: { base: "https://bolt.new/", param: "prompt" },
  lovable: { base: "https://lovable.dev/", hash: "prompt" },
};

test("the prompt points at the absolute Markdown URL", () => {
  assert.equal(destinationPrompt(markdownUrl, origin), prompt);
});

test("before hydration the prompt falls back to the relative URL", () => {
  assert.equal(
    destinationPrompt(markdownUrl, null),
    "Read /docs/orm.mdx, I want to ask questions about it.",
  );
});

test("every destination has a pinned format", () => {
  assert.deepEqual(
    Object.keys(destinationHrefs(markdownUrl, origin)).sort(),
    Object.keys(expected).sort(),
  );
});

for (const [tool, spec] of Object.entries(expected) as [
  DestinationTool,
  (typeof expected)[DestinationTool],
][]) {
  test(`${tool}: prompt arrives intact in the expected place`, () => {
    const url = new URL(destinationHrefs(markdownUrl, origin)[tool]);

    assert.equal(`${url.protocol}//${url.host}${url.pathname}`, spec.base);

    if (spec.param) {
      assert.equal(url.searchParams.get(spec.param), prompt);
    }
    if (spec.hash) {
      const hash = new URLSearchParams(url.hash.slice(1));
      assert.equal(hash.get(spec.hash), prompt);
    }
    for (const [key, value] of Object.entries(spec.extra ?? {})) {
      assert.equal(url.searchParams.get(key), value);
    }

    // No params beyond the prompt and the pinned extras, so nothing like
    // Lovable's `autosubmit` slips in and runs the prompt unseen.
    const allowed = new Set([spec.param, ...Object.keys(spec.extra ?? {})].filter(Boolean));
    for (const key of url.searchParams.keys()) {
      assert.ok(allowed.has(key), `unexpected query param "${key}" on ${tool}`);
    }
  });
}
