import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { NextRequest } from "next/server";

import { proxy } from "../proxy";
import { AGENT_MARKDOWN_VARY } from "./agent-markdown";

/**
 * src/proxy.ts serves a page's Markdown on the page's own URL, picked by
 * `Accept` or the agent's User-Agent, so both sides name both headers. On
 * Vercel a 200 carries the Markdown route's own `Vary` (the proxy's is
 * dropped) and a CDN 304 carries the proxy's (the route's is not sent).
 *
 * The route reads the MDX collection, which node:test cannot load, so the
 * route checks below read its source with regexes: every `new Response(` must
 * carry the value, either inline or through a `const` headers object. They are
 * a guard against a forgotten header, not an end-to-end test (a headers object
 * passed through a differently shaped variable, or a nested `});`, can fool
 * them). The end-to-end check is a `next build` + `next start` header matrix.
 */
const routeSource = readFileSync(
  new URL("../app/llms.mdx/[[...slug]]/route.ts", import.meta.url),
  "utf8",
);

test("the Markdown variant varies on Accept and User-Agent", () => {
  assert.equal(AGENT_MARKDOWN_VARY, "Accept, User-Agent");
});

test("every Markdown response the route builds declares that Vary", () => {
  const varyHeaders = /Vary: AGENT_MARKDOWN_VARY\b/;
  const sharedHeaders = routeSource.match(
    /const (\w+) = \{[^}]*Vary: AGENT_MARKDOWN_VARY,[^}]*\};/,
  );

  const responses = routeSource.split("new Response(").slice(1);
  assert.ok(responses.length > 0, "expected the route to build a Response");

  for (const [index, call] of responses.entries()) {
    const body = call.slice(0, call.indexOf("});"));
    const ok =
      varyHeaders.test(body) ||
      (sharedHeaders !== null &&
        (body.includes(`headers: ${sharedHeaders[1]}`) ||
          body.includes(`headers: { ...${sharedHeaders[1]},`)));
    assert.ok(ok, `Response #${index + 1} in the Markdown route does not set Vary`);
  }
});

test("the route does not use notFound() or permanentRedirect()", () => {
  // Both send only Next's RSC `Vary`, so an agent rewritten here would get a
  // 404 or 308 that does not name the headers it was negotiated on.
  const code = routeSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(code, /\b(?:notFound|permanentRedirect|redirect)\(/);
});

test("the proxy's rewrite appends the same Vary", async () => {
  for (const headers of [
    { accept: "text/markdown" },
    {
      "user-agent":
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    },
  ] as Record<string, string>[]) {
    const response = proxy(new NextRequest("https://www.prisma.io/docs/orm", { headers }));
    assert.ok(response.headers.get("x-middleware-rewrite"), "expected a rewrite");
    assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY);
  }
});
