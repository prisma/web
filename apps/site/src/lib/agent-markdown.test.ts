import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  AGENT_MARKDOWN_PATHS,
  getAgentMarkdownPath,
  getAgentMarkdownRewritePathname,
  getAgentMarkdownSignal,
  getMarkdownUrlPath,
  isMcpProtocolRequest,
} from "./agent-markdown";

function headers(values: Record<string, string>) {
  return new Headers(values);
}

test("Accept: text/markdown is an agent signal", () => {
  assert.equal(getAgentMarkdownSignal(headers({ accept: "text/markdown" })), "accept");
  assert.equal(
    getAgentMarkdownSignal(headers({ accept: "text/markdown; charset=utf-8" })),
    "accept",
  );
  assert.equal(
    getAgentMarkdownSignal(headers({ accept: "text/html, text/markdown;q=0.9" })),
    "accept",
  );
  assert.equal(getAgentMarkdownSignal(headers({ Accept: "TEXT/MARKDOWN" })), "accept");
});

test("a browser Accept header is not a signal", () => {
  const browserAccept =
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
  assert.equal(getAgentMarkdownSignal(headers({ accept: browserAccept })), undefined);
  assert.equal(getAgentMarkdownSignal(headers({})), undefined);
  assert.equal(getAgentMarkdownSignal(headers({ accept: "*/*" })), undefined);
});

test("a media type that merely contains text/markdown does not match", () => {
  // Split on "," then startsWith: the value has to be its own media type, so a
  // parameter that happens to mention the string is not a signal.
  assert.equal(
    getAgentMarkdownSignal(headers({ accept: "text/html; profile=text/markdown" })),
    undefined,
  );
});

test("known agent user agents are a signal", () => {
  for (const userAgent of [
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)",
    "Mozilla/5.0 (compatible; PerplexityBot/1.0)",
    "Cursor/1.0",
  ]) {
    assert.equal(getAgentMarkdownSignal(headers({ "user-agent": userAgent })), "user-agent");
  }
});

test("an ordinary browser user agent is not a signal", () => {
  assert.equal(
    getAgentMarkdownSignal(
      headers({
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
      }),
    ),
    undefined,
  );
  assert.equal(getAgentMarkdownSignal(headers({ "user-agent": "Googlebot/2.1" })), undefined);
});

test("Accept wins over the user agent when both are present", () => {
  assert.equal(
    getAgentMarkdownSignal(headers({ accept: "text/markdown", "user-agent": "GPTBot" })),
    "accept",
  );
});

test("supported pages map to their llms.mdx route", () => {
  // Not the bare "/llms.mdx": that would re-match the /:path*.mdx rewrite.
  assert.equal(getAgentMarkdownRewritePathname("/"), "/llms.mdx/index");
  assert.equal(getAgentMarkdownRewritePathname("/orm"), "/llms.mdx/orm");
  assert.equal(getAgentMarkdownRewritePathname("/pricing"), "/llms.mdx/pricing");
  assert.equal(getAgentMarkdownRewritePathname("/mcp"), "/llms.mdx/mcp");
  // A trailing slash is the same page.
  assert.equal(getAgentMarkdownRewritePathname("/orm/"), "/llms.mdx/orm");
});

test("everything the proxy must not intercept maps to undefined", () => {
  for (const pathname of [
    // The zones the site app fronts; they serve their own markdown.
    "/docs",
    "/docs/orm",
    "/docs/orm/overview",
    "/blog",
    "/blog/some-post",
    // Assets and internals.
    "/site-static/chunk.js",
    "/docs-static/chunk.js",
    "/blog-static/chunk.js",
    "/api/search",
    "/_next/static/chunk.js",
    // Anything with a file extension, including the markdown URLs themselves.
    "/index.md",
    "/orm.md",
    "/orm.mdx",
    "/llms.txt",
    "/llms-full.txt",
    "/changelog.md",
    "/skill.md",
    "/favicon.ico",
    "/sitemap.xml",
    "/robots.txt",
    // Pages that exist but have no rendition.
    "/changelog",
    "/support",
    "/ecosystem",
    "/company",
    "/customers",
    "/contact",
    // Nested paths under a supported page are not the supported page.
    "/orm/nested",
    "/pricing/enterprise",
    // The markdown route itself must never be rewritten onto itself.
    "/llms.mdx",
    "/llms.mdx/orm",
  ]) {
    assert.equal(
      getAgentMarkdownRewritePathname(pathname),
      undefined,
      `${pathname} should not be rewritten`,
    );
  }
});

test("MCP protocol traffic is recognised so /mcp keeps working as an endpoint", () => {
  // The three conditions next.config.mjs uses to forward /mcp to mcp.prisma.io.
  assert.equal(
    isMcpProtocolRequest(headers({ accept: "application/json, text/event-stream" })),
    true,
  );
  assert.equal(isMcpProtocolRequest(headers({ "content-type": "application/json" })), true);
  assert.equal(isMcpProtocolRequest(headers({ "mcp-session-id": "abc" })), true);
  // A plain markdown request for the /mcp marketing page is not protocol traffic.
  assert.equal(isMcpProtocolRequest(headers({ accept: "text/markdown" })), false);
  assert.equal(isMcpProtocolRequest(headers({ "user-agent": "Cursor/1.0" })), false);
});

test("the public .md URL for each page", () => {
  assert.equal(getMarkdownUrlPath("/"), "/index.md");
  assert.equal(getMarkdownUrlPath("/orm"), "/orm.md");
  assert.equal(getMarkdownUrlPath("/enterprise"), "/enterprise.md");
});

test("getAgentMarkdownPath normalises to a member of AGENT_MARKDOWN_PATHS", () => {
  for (const path of AGENT_MARKDOWN_PATHS) {
    assert.equal(getAgentMarkdownPath(path), path);
  }
  assert.equal(getAgentMarkdownPath("/orm/"), "/orm");
  assert.equal(getAgentMarkdownPath("/nope"), undefined);
});

// --- the three places the page list is spelled out have to agree ---------

const siteRoot = new URL("../..", import.meta.url).pathname;

test("the proxy matcher covers exactly AGENT_MARKDOWN_PATHS", () => {
  // config.matcher has to be a statically analysable literal, so it cannot be
  // derived from AGENT_MARKDOWN_PATHS. Read it back out of the source instead.
  const proxySource = readFileSync(join(siteRoot, "src/proxy.ts"), "utf8");
  const matcher = proxySource.match(/matcher:\s*\[([\s\S]*?)\]/)?.[1];
  assert.ok(matcher, "expected a matcher array in src/proxy.ts");
  assert.ok(matcher.includes('"/"'), "the proxy matcher should cover the homepage");

  const alternation = matcher.match(/"\/:page\(([^)]+)\)"/)?.[1];
  assert.ok(alternation, "expected a /:page(...) matcher source in src/proxy.ts");

  const matched = new Set(["/", ...alternation.split("|").map((page) => `/${page}`)]);
  assert.deepEqual(
    [...matched].sort(),
    [...AGENT_MARKDOWN_PATHS].sort(),
    "src/proxy.ts matcher and AGENT_MARKDOWN_PATHS disagree",
  );
});

test("next.config.mjs sends Vary/Link for exactly AGENT_MARKDOWN_PATHS", () => {
  const configSource = readFileSync(join(siteRoot, "next.config.mjs"), "utf8");
  const block = configSource.match(/const agentMarkdownPaths = \[([\s\S]*?)\];/)?.[1];
  assert.ok(block, "expected agentMarkdownPaths in next.config.mjs");

  const paths = [...block.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(
    paths.sort(),
    [...AGENT_MARKDOWN_PATHS].sort(),
    "next.config.mjs agentMarkdownPaths and AGENT_MARKDOWN_PATHS disagree",
  );
});
