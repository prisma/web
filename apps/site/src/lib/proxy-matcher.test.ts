import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
// Next's own compiled path-to-regexp: the same compiler that turns a proxy
// matcher `source` into a regex at build time.
// @ts-expect-error No types ship for the compiled copy.
import pathToRegexpModule from "next/dist/compiled/path-to-regexp/index.js";
import { NextRequest, type NextFetchEvent } from "next/server";

// Agent Front reads its key at module load and reports when it has one. Make
// sure importing the proxy here can never send an event to ora.
for (const name of ["ORA_INGEST_KEY", "ORA_KEY", "ORA_DOMAIN_ID", "ORA_SALT"]) {
  delete process.env[name];
}
const { config, proxy } = await import("@/proxy");

const { pathToRegexp } = pathToRegexpModule as {
  pathToRegexp: (source: string) => RegExp;
};

type MatcherEntry = {
  source: string;
  missing: { type: string; key: string; value?: string }[];
};

const entries = config.matcher as MatcherEntry[];
const siteRoot = new URL("../..", import.meta.url).pathname;

function matchesPath(pathname: string) {
  return entries.some((entry) => pathToRegexp(entry.source).test(pathname));
}

test("every matcher entry is a valid path-to-regexp source", () => {
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.doesNotThrow(() => pathToRegexp(entry.source), entry.source);
  }
});

test("matches pages in all three zones, and the files agents ask for", () => {
  for (const pathname of [
    "/",
    "/pricing",
    "/orm/",
    "/docs",
    "/docs/orm/overview",
    "/docs/orm/v7/reference/prisma-client-reference",
    "/blog",
    "/blog/some-post",
    "/api/search",
    // What ora may manage under Autopilot, and its status page.
    "/robots.txt",
    "/llms.txt",
    "/agents.md",
    "/openapi.json",
    "/.well-known/agent-skills/prisma/SKILL.md",
    "/pricing.md",
    "/docs/orm/overview.md",
    "/__ora/status",
    // A dot in the path is not a file extension.
    "/docs/orm/v7.2/overview",
    "/sitemap.xml",
  ]) {
    assert.ok(matchesPath(pathname), `${pathname} should reach the proxy`);
  }
});

test("never matches framework or static asset paths", () => {
  for (const pathname of [
    "/_next/static/chunks/main.js",
    "/_next/image",
    "/site-static/_next/static/chunks/main.js",
    "/site-static/_next/image",
    "/docs-static/_next/static/css/app.css",
    "/blog-static/_next/static/media/font.woff2",
    "/favicon.ico",
    "/icon.svg",
    "/apple-icon.png",
    "/og/pricing/image.png",
    "/docs/img/diagram.webp",
    "/blog/some-post/imgs/hero.jpg",
  ]) {
    assert.ok(!matchesPath(pathname), `${pathname} should not reach the proxy`);
  }
});

test("the excluded extensions are exactly the ones Agent Front never reports", () => {
  // The matcher may only skip what `shouldRecord` in agent-front.ts would drop
  // anyway. If ora changes that list in a newer file, this says so.
  const agentFrontSource = readFileSync(join(siteRoot, "src/agent-front.ts"), "utf8");
  const block = agentFrontSource.match(/const ASSET_EXTENSIONS = new Set\(\[([\s\S]*?)\]\)/)?.[1];
  assert.ok(block, "expected ASSET_EXTENSIONS in src/agent-front.ts");
  const reported = [...block.matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  for (const entry of entries) {
    const alternation = entry.source.match(/\\\.\(\?:([^)]+)\)\$/)?.[1];
    assert.ok(alternation, `expected an extension alternation in ${entry.source}`);
    assert.deepEqual(alternation.split("|").sort(), [...reported].sort());
  }
});

test("App Router fetches skip the proxy", () => {
  // Soft navigations and <Link> prefetches carry `rsc`. Agent Front does not
  // count them, so there is nothing for the proxy to do.
  for (const entry of entries) {
    assert.deepEqual(entry.missing, [{ type: "header", key: "rsc" }]);
  }
});

// --- the containment boundary, now that the matcher is no longer it ---------

const event = { waitUntil() {} } as unknown as NextFetchEvent;

function request(pathname: string, headers: Record<string, string> = {}, method = "GET") {
  return new NextRequest(`https://www.prisma.io${pathname}`, { headers, method });
}

test("an agent asking for a marketing page is rewritten to its Markdown", async () => {
  const response = await proxy(request("/pricing", { accept: "text/markdown" }), event);
  const rewrite = response.headers.get("x-middleware-rewrite");
  assert.ok(rewrite, "expected a rewrite");
  assert.equal(new URL(rewrite, "https://www.prisma.io").pathname, "/llms.mdx/pricing");
  assert.equal(response.headers.get("x-prisma-agent-markdown"), "accept");
});

test("an agent user agent on a marketing page is rewritten to its Markdown", async () => {
  for (const userAgent of [
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    "Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)",
    // The user-triggered fetchers, as their vendors document them.
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-User/1.0; +https://docs.mistral.ai/robots)",
    // Meta documents both forms.
    "meta-externalfetcher/1.1 (+/documentation/sharing/webmasters/web-crawlers)",
    "meta-externalfetcher/1.1",
    "Mozilla/5.0 (compatible; Google-Gemini-CLI/1.0; +https://github.com/google-gemini/gemini-cli)",
  ]) {
    const response = await proxy(request("/pricing", { "user-agent": userAgent }), event);
    const rewrite = response.headers.get("x-middleware-rewrite");
    assert.ok(rewrite, `${userAgent} should be rewritten`);
    assert.equal(new URL(rewrite, "https://www.prisma.io").pathname, "/llms.mdx/pricing");
    assert.equal(response.headers.get("x-prisma-agent-markdown"), "user-agent", userAgent);
  }
});

test("browsers, search engines and the vendors' other crawlers get the HTML", async () => {
  for (const userAgent of [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-AdsBot/1.0; +https://openai.com/bot)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-Index/1.0; +https://docs.mistral.ai/robots)",
    "meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "meta-externalads/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)",
    "Google-Agent/1.0",
  ]) {
    const response = await proxy(request("/pricing", { "user-agent": userAgent }), event);
    const label = userAgent || "(empty user agent)";
    assert.equal(response.headers.get("x-middleware-next"), "1", label);
    assert.equal(response.headers.get("x-middleware-rewrite"), null, label);
    assert.equal(response.headers.get("vary"), "Accept", label);
  }
});

test("a browser on a marketing page passes through with Vary: Accept", async () => {
  const response = await proxy(request("/pricing", { accept: "text/html" }), event);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(response.headers.get("x-middleware-rewrite"), null);
  assert.equal(response.headers.get("vary"), "Accept");
});

test("everything outside the nine pages passes through untouched, agent or not", async () => {
  const headerSets: Record<string, string>[] = [
    { accept: "text/markdown" },
    { "user-agent": "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" },
    { accept: "text/html" },
  ];

  for (const pathname of [
    "/docs",
    "/docs/orm/overview",
    "/blog/some-post",
    "/api/search",
    "/llms.txt",
    "/pricing.md",
    "/llms.mdx/pricing",
    "/changelog",
    "/pricing/enterprise",
  ]) {
    for (const headers of headerSets) {
      const response = await proxy(request(pathname, headers), event);
      assert.equal(response.headers.get("x-middleware-next"), "1", pathname);
      assert.equal(response.headers.get("x-middleware-rewrite"), null, pathname);
      assert.equal(response.headers.get("vary"), null, pathname);
      assert.equal(response.headers.get("x-md-probe"), null, pathname);
    }
  }
});

test("MCP protocol traffic on /mcp is never rewritten", async () => {
  const post = await proxy(
    request(
      "/mcp",
      { accept: "application/json, text/event-stream", "user-agent": "Cursor/1.0" },
      "POST",
    ),
    event,
  );
  assert.equal(post.headers.get("x-middleware-rewrite"), null);

  const stream = await proxy(
    request("/mcp", { accept: "text/event-stream", "user-agent": "Cursor/1.0" }),
    event,
  );
  assert.equal(stream.headers.get("x-middleware-rewrite"), null);
});

test("/__ora/status answers with configuration and no key", async () => {
  const response = await proxy(request("/__ora/status"), event);
  assert.equal(response.status, 200);
  const body = (await response.json()) as Record<string, unknown>;
  assert.equal(body.reporting, false);
  assert.equal(body.autopilot, false);
  assert.ok(!JSON.stringify(body).includes("ora_sk"));
});
