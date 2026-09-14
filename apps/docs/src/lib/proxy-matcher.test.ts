import assert from "node:assert/strict";
import test from "node:test";
// Next's own compiled path-to-regexp: the same compiler that turns a middleware
// matcher `source` into a regex at build time.
// @ts-expect-error No types ship for the compiled copy.
import pathToRegexpModule from "next/dist/compiled/path-to-regexp/index.js";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { config } from "../proxy.ts";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { AGENT_USER_AGENT_TOKENS, getAgentMarkdownSignal } from "./agent-markdown.ts";

const { pathToRegexp } = pathToRegexpModule as {
  pathToRegexp: (source: string) => RegExp;
};

type MatcherEntry = {
  source: string;
  has: { type: string; key: string; value: string }[];
};

const entries = config.matcher as MatcherEntry[];

/** How `matchHas` in Next compiles a `has` value: anchored, no flags. */
const hasMatcher = (value: string) => new RegExp(`^${value}$`);

function matchesPath(pathname: string) {
  return entries.some((entry) => pathToRegexp(entry.source).test(pathname));
}

function headerEntry(key: string) {
  const found = entries.find((entry) => entry.has.some((item) => item.key === key));
  assert.ok(found, `no matcher entry keyed on ${key}`);
  return found.has.find((item) => item.key === key)!;
}

test("every matcher entry is a valid path-to-regexp source", () => {
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.doesNotThrow(() => pathToRegexp(entry.source), entry.source);
    assert.ok(entry.has.length > 0, "an unconditional entry would run on every request");
  }
});

test("matches docs pages, including the root", () => {
  for (const pathname of [
    "/",
    "/postgres/overview",
    "/orm/v7/reference/prisma-client-reference",
    "/orm/v7/",
  ]) {
    assert.ok(matchesPath(pathname), `${pathname} should reach the proxy`);
  }
});

test("never matches framework or static asset paths", () => {
  for (const pathname of [
    "/_next/static/chunks/main.js",
    "/monitoring",
    "/docs-static/_next/static/css/app.css",
    "/favicon.ico",
    "/rss.xml",
    "/sitemap.xml",
    "/og/postgres/overview/image.png",
    "/orm/v7/reference/prisma-client-reference.md",
    "/llms.txt",
  ]) {
    assert.ok(!matchesPath(pathname), `${pathname} should not reach the proxy`);
  }
});

test("the accept condition fires for exactly the Accept headers the proxy acts on", () => {
  const matcher = hasMatcher(headerEntry("accept").value);

  for (const accept of [
    "text/markdown",
    "text/markdown;q=0.9",
    "text/markdown, text/html;q=0.8",
    "text/html, text/markdown",
    "TEXT/MARKDOWN",
  ]) {
    assert.ok(matcher.test(accept), `Accept: ${accept} should reach the proxy`);
    assert.equal(
      getAgentMarkdownSignal(new Headers({ accept })),
      "accept",
      `Accept: ${accept} should still be rewritten`,
    );
  }

  for (const accept of ["text/html", "text/html,application/xhtml+xml", "*/*"]) {
    assert.ok(!matcher.test(accept), `Accept: ${accept} should not reach the proxy`);
    assert.equal(getAgentMarkdownSignal(new Headers({ accept })), undefined);
  }
});

test("the user-agent condition covers every token the runtime check accepts", () => {
  const matcher = hasMatcher(headerEntry("user-agent").value);

  for (const token of AGENT_USER_AGENT_TOKENS) {
    for (const userAgent of [
      token,
      token.toUpperCase(),
      `Mozilla/5.0 (compatible; ${token}/1.0)`,
    ]) {
      assert.ok(matcher.test(userAgent), `${userAgent} should reach the proxy`);
      assert.equal(
        getAgentMarkdownSignal(new Headers({ "user-agent": userAgent })),
        "user-agent",
        `${userAgent} should still be rewritten`,
      );
    }
  }

  // The casings these crawlers actually send.
  for (const userAgent of [
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Claude-User/1.0",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
    "Cursor/1.0",
  ]) {
    assert.ok(matcher.test(userAgent), `${userAgent} should reach the proxy`);
  }
});

test("the user-agent condition does not fire for ordinary browsers and crawlers", () => {
  const matcher = hasMatcher(headerEntry("user-agent").value);

  for (const userAgent of [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "curl/8.7.1",
  ]) {
    assert.ok(!matcher.test(userAgent), `${userAgent} should not reach the proxy`);
    assert.equal(getAgentMarkdownSignal(new Headers({ "user-agent": userAgent })), undefined);
  }
});
