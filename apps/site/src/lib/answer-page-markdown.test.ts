import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
// Next's own compiled path-to-regexp: the same compiler that turns a header
// `source` into a regex at build time.
// @ts-expect-error No types ship for the compiled copy.
import pathToRegexpModule from "next/dist/compiled/path-to-regexp/index.js";
import { NextRequest, type NextFetchEvent } from "next/server";

import nextConfig, { ANSWER_PAGE_HEADER_SOURCES } from "../../next.config.mjs";
import {
  ANSWER_PAGE_RESERVED_SEGMENTS,
  getAgentMarkdownRewritePathname,
  getAnswerPagePath,
} from "./agent-markdown";
import { getAnswerEntries } from "./answer-page-content";
import { answerProductIds } from "./answer-products";

// Agent Front reads its key at module load and reports when it has one. Make
// sure importing the proxy here can never send an event to ora.
for (const name of ["ORA_INGEST_KEY", "ORA_KEY", "ORA_DOMAIN_ID", "ORA_SALT"]) {
  delete process.env[name];
}
const { proxy } = await import("@/proxy");

const { pathToRegexp } = pathToRegexpModule as {
  pathToRegexp: (source: string) => RegExp;
};

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

const siteRoot = new URL("../..", import.meta.url).pathname;
const answerUrls = getAnswerEntries().map((entry) => entry.url);

/** Paths that look close to a guide URL but are not one. */
const NOT_GUIDES = [
  "/postgres",
  "/compute",
  "/postgres/",
  "/postgres/guides",
  "/postgres/hipaa",
  "/compute/guides",
  "/postgres/guides/",
  "/postgres/typescript-test-environment/nested",
  "/postgres/typescript-test-environment.md",
  "/postgres/TypeScript-Test-Environment",
  "/postgres/under_score",
  "/postgres/-leading-hyphen",
  "/postgres/double--hyphen",
  "/orm/typescript-test-environment",
  "/compare/neon",
  "/docs/postgres/typescript-test-environment",
  "/blog/typescript-test-environment",
  "/llms.mdx/postgres/typescript-test-environment",
];

test("there are guides to check, in both products", () => {
  for (const product of answerProductIds) {
    assert.ok(
      answerUrls.some((url) => url.startsWith(`/${product}/`)),
      `no ${product} guides found`,
    );
  }
});

test("every guide URL is recognised and rewritten to its Markdown route", () => {
  for (const url of answerUrls) {
    assert.equal(getAnswerPagePath(url), url);
    assert.equal(getAnswerPagePath(`${url}/`), url, `${url}/ (trailing slash)`);
    assert.equal(getAgentMarkdownRewritePathname(url), `/llms.mdx${url}`);
  }
});

test("near misses are not guides and are not rewritten", () => {
  for (const pathname of NOT_GUIDES) {
    assert.equal(getAnswerPagePath(pathname), undefined, pathname);
  }
  // The two product pages keep their own renditions.
  assert.equal(getAgentMarkdownRewritePathname("/postgres"), "/llms.mdx/postgres");
  assert.equal(getAgentMarkdownRewritePathname("/compute"), "/llms.mdx/compute");
  for (const pathname of ["/postgres/guides", "/postgres/hipaa", "/compute/guides"]) {
    assert.equal(getAgentMarkdownRewritePathname(pathname), undefined, pathname);
  }
});

test("the reserved segments are exactly the static routes beside the guides", () => {
  assert.deepEqual(Object.keys(ANSWER_PAGE_RESERVED_SEGMENTS).sort(), [...answerProductIds].sort());

  for (const product of answerProductIds) {
    // Every child folder of src/app/<product> that is a route of its own:
    // not the dynamic [slug] adapter, not a private (_) or group "(" folder.
    const staticRoutes = readdirSync(join(siteRoot, "src/app", product), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => !/^[[_(]/.test(name));

    assert.deepEqual(
      [...ANSWER_PAGE_RESERVED_SEGMENTS[product]].sort(),
      staticRoutes.sort(),
      `ANSWER_PAGE_RESERVED_SEGMENTS.${product} must list the static routes in src/app/${product}`,
    );
  }
});

// --- next.config.mjs: Link and Vary headers ----------------------------------

const rules = (await nextConfig.headers?.()) as HeaderRule[];

test("each product's guides send a Markdown Link header and Vary: Accept", () => {
  assert.deepEqual(Object.keys(ANSWER_PAGE_HEADER_SOURCES).sort(), [...answerProductIds].sort());

  for (const [product, source] of Object.entries(ANSWER_PAGE_HEADER_SOURCES)) {
    const rule = rules.find((candidate) => candidate.source === source);
    assert.ok(rule, `no header rule for ${product} guides`);
    assert.deepEqual(rule.headers, [
      { key: "Vary", value: "Accept" },
      {
        key: "Link",
        value: `</${product}/:slug.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="llms-txt"`,
      },
    ]);
  }
});

test("a guide URL matches a single Link header rule", () => {
  // Next keeps the last of several matching Link values, so a second rule
  // would silently replace the guide's own.
  for (const url of answerUrls) {
    const linkRules = rules.filter(
      (rule) =>
        pathToRegexp(rule.source).test(url) && rule.headers.some((header) => header.key === "Link"),
    );
    assert.equal(linkRules.length, 1, `${url} matched ${linkRules.length} Link rules`);
  }
});

test("the header rules match exactly the URLs the proxy treats as guides", () => {
  const patterns = Object.values(ANSWER_PAGE_HEADER_SOURCES).map((source) => pathToRegexp(source));

  for (const pathname of [...answerUrls, ...NOT_GUIDES]) {
    // Next redirects a trailing slash away before headers apply. Header sources
    // are compiled case-insensitively, so a mis-cased guide URL gets the Link
    // header on its 404 page; the proxy's slug check is lowercase only, so the
    // same URL is a 404 for agents too. Neither is a guide.
    if (pathname.endsWith("/") || pathname !== pathname.toLowerCase()) continue;
    assert.equal(
      patterns.some((pattern) => pattern.test(pathname)),
      getAnswerPagePath(pathname) !== undefined,
      `${pathname}: the Link header rule and getAnswerPagePath disagree`,
    );
  }
});

// --- the proxy, end to end ----------------------------------------------------

const event = { waitUntil() {} } as unknown as NextFetchEvent;

function request(pathname: string, headers: Record<string, string> = {}, method = "GET") {
  return new NextRequest(`https://www.prisma.io${pathname}`, { headers, method });
}

/** The same user agents and Accept values the blog's post URLs answer Markdown to. */
const AGENT_REQUESTS: [string, Record<string, string>][] = [
  [
    "ChatGPT-User",
    {
      "user-agent":
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    },
  ],
  [
    "Claude-User",
    { "user-agent": "Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)" },
  ],
  ["PerplexityBot", { "user-agent": "Mozilla/5.0 (compatible; PerplexityBot/1.0)" }],
  [
    "Perplexity-User",
    {
      "user-agent":
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)",
    },
  ],
  ["Accept: text/markdown", { accept: "text/markdown" }],
];

const HTML_REQUESTS: [string, Record<string, string>][] = [
  [
    "browser",
    {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  ],
  [
    "Googlebot",
    { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  ],
  [
    "bingbot",
    { "user-agent": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" },
  ],
  [
    "OAI-SearchBot",
    {
      "user-agent":
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
    },
  ],
];

test("agents asking for a guide are rewritten to its Markdown", async () => {
  for (const url of answerUrls) {
    for (const [label, headers] of AGENT_REQUESTS) {
      const response = await proxy(request(url, headers), event);
      const rewrite = response.headers.get("x-middleware-rewrite");
      assert.ok(rewrite, `${label} on ${url} should be rewritten`);
      assert.equal(new URL(rewrite, "https://www.prisma.io").pathname, `/llms.mdx${url}`);
      assert.equal(
        response.headers.get("x-prisma-agent-markdown"),
        headers.accept ? "accept" : "user-agent",
        `${label} on ${url}`,
      );
    }
  }
});

test("browsers and search crawlers get a guide's HTML, with Vary: Accept", async () => {
  for (const url of answerUrls) {
    for (const [label, headers] of HTML_REQUESTS) {
      const response = await proxy(request(url, headers), event);
      assert.equal(response.headers.get("x-middleware-next"), "1", `${label} on ${url}`);
      assert.equal(response.headers.get("x-middleware-rewrite"), null, `${label} on ${url}`);
      assert.equal(response.headers.get("vary"), "Accept", `${label} on ${url}`);
    }
  }
});

test("the guide indexes and the HIPAA page are left alone, agent or not", async () => {
  for (const pathname of ["/postgres/guides", "/compute/guides", "/postgres/hipaa"]) {
    for (const [label, headers] of [...AGENT_REQUESTS, ...HTML_REQUESTS]) {
      const response = await proxy(request(pathname, headers), event);
      assert.equal(response.headers.get("x-middleware-rewrite"), null, `${label} on ${pathname}`);
      assert.equal(response.headers.get("vary"), null, `${label} on ${pathname}`);
    }
  }
});

test("a non-GET request to a guide is never rewritten", async () => {
  const [url] = answerUrls;
  const response = await proxy(request(url, { accept: "text/markdown" }, "POST"), event);
  assert.equal(response.headers.get("x-middleware-rewrite"), null);
});
