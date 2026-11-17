import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
// Next's own compiled path-to-regexp: the same compiler that turns a rewrite
// `source` into a regex at build time.
// @ts-expect-error No types ship for the compiled copy.
import pathToRegexpModule from "next/dist/compiled/path-to-regexp/index.js";
import { NextRequest, type NextFetchEvent } from "next/server";

import nextConfig from "../../next.config.mjs";
import { AGENT_MARKDOWN_VARY, getAgentMarkdownRewritePathname } from "./agent-markdown";
import {
  DATAGUIDE_ORIGIN,
  getDataguideMarkdownPath,
  getDataguidePagePath,
  getDataguideRewritePathname,
} from "./dataguide-markdown";

// Agent Front reads its key at module load and reports when it has one. Make
// sure importing the proxy here can never report an event.
for (const name of ["ORA_INGEST_KEY", "ORA_KEY", "ORA_DOMAIN_ID", "ORA_SALT"]) {
  delete process.env[name];
}
const { proxy } = await import("@/proxy");
const { GET } = await import("@/app/llms.mdx/dataguide/[...slug]/route");

const { pathToRegexp, compile } = pathToRegexpModule as {
  pathToRegexp: (source: string, keys?: { name: string }[]) => RegExp;
  compile: (path: string) => (params: Record<string, unknown>) => string;
};

type Rewrite = { source: string; destination: string; has?: unknown; missing?: unknown };
type Rewrites = { beforeFiles: Rewrite[]; afterFiles: Rewrite[]; fallback: Rewrite[] };

const siteRoot = new URL("../..", import.meta.url).pathname;

/** Real Data Guide URLs, from /dataguide/llms.txt and the sitemap. */
const ARTICLE_PATHS = [
  "/dataguide/intro",
  "/dataguide/intro/what-are-databases",
  "/dataguide/postgresql/5-ways-to-host-postgresql",
  "/dataguide/postgresql/authentication-and-authorization/configuring-user-authentication",
  "/dataguide/managing-databases/introduction-to-OLAP-OLTP",
];

const NOT_PAGES = [
  "/dataguide/llms.txt",
  "/dataguide/llms-full.txt",
  "/dataguide/agent-index.json",
  "/dataguide/intro.md",
  "/dataguide/index",
  "/dataguide/sitemap/sitemap-index.xml",
  "/dataguide/page-data/app-data.json",
  "/dataguide/page-data/intro",
  "/dataguide/static/logo",
  "/dataguide/_gatsby/slices",
  "/dataguide/~partytown/debug",
  "/dataguide/intro/%2e%2e/secret",
  "/dataguide/intro/under_score",
  "/dataguide/a/b/c/d/e/f/g/h/i",
  "/dataguides/intro",
  "/docs/intro",
  "/llms.mdx/dataguide/intro",
];

// --- path handling ----------------------------------------------------------

test("Data Guide HTML URLs map to the Markdown route, the overview to index", () => {
  assert.equal(getDataguideRewritePathname("/dataguide"), "/llms.mdx/dataguide/index");
  assert.equal(getDataguideRewritePathname("/dataguide/"), "/llms.mdx/dataguide/index");
  for (const path of ARTICLE_PATHS) {
    const expected = `/llms.mdx${path}`;
    assert.equal(getDataguideRewritePathname(path), expected, path);
    assert.equal(getDataguideRewritePathname(`${path}/`), expected, `${path}/`);
    assert.equal(getAgentMarkdownRewritePathname(path), expected, path);
  }
});

test("files, Gatsby internals and lookalikes are not Data Guide pages", () => {
  for (const path of NOT_PAGES) {
    assert.equal(getDataguideRewritePathname(path), undefined, path);
    assert.equal(getAgentMarkdownRewritePathname(path), undefined, path);
  }
});

test("a route slug resolves to the page and to the export the Data Guide publishes", () => {
  assert.equal(getDataguidePagePath(["index"]), "/dataguide");
  assert.equal(getDataguideMarkdownPath(["index"]), "/dataguide/index.md");
  assert.equal(
    getDataguidePagePath(["postgresql", "5-ways-to-host-postgresql"]),
    "/dataguide/postgresql/5-ways-to-host-postgresql",
  );
  assert.equal(
    getDataguideMarkdownPath(["postgresql", "5-ways-to-host-postgresql"]),
    "/dataguide/postgresql/5-ways-to-host-postgresql.md",
  );
  for (const slug of [[], [".."], ["intro", ".."], ["static", "x"], ["page-data"], ["a.b"]]) {
    assert.equal(getDataguidePagePath(slug), undefined, slug.join("/"));
    assert.equal(getDataguideMarkdownPath(slug), undefined, slug.join("/"));
  }
});

// --- routing in next.config.mjs ---------------------------------------------

async function rewrites() {
  return (await (nextConfig as { rewrites: () => Promise<Rewrites> }).rewrites()) as Rewrites;
}

function rewriteTarget(rules: Rewrite[], pathname: string) {
  for (const rule of rules) {
    if (rule.has || rule.missing) continue;
    const keys: { name: string }[] = [];
    const match = pathToRegexp(rule.source, keys).exec(pathname);
    if (!match) continue;
    const params: Record<string, unknown> = {};
    keys.forEach((key, index) => {
      const value = match[index + 1];
      if (value !== undefined) params[key.name] = value.split("/");
    });
    const destination = new URL(rule.destination, "https://www.prisma.io");
    return `${destination.origin}${compile(destination.pathname)(params)}`;
  }
  return undefined;
}

test("DATAGUIDE_ORIGIN is the deployment the site forwards /dataguide to", async () => {
  const { fallback } = await rewrites();
  assert.equal(rewriteTarget(fallback, "/dataguide/intro"), `${DATAGUIDE_ORIGIN}/dataguide/intro`);
});

test("/dataguide/<path>.md reaches this route, not the site's own Markdown route", async () => {
  const { beforeFiles, afterFiles } = await rewrites();
  for (const path of [...ARTICLE_PATHS, "/dataguide/index"]) {
    // Nothing earlier claims it...
    assert.equal(rewriteTarget(beforeFiles, `${path}.md`), undefined, path);
    // ...so the `.md` rewrite sends it under /llms.mdx/dataguide/, which the
    // more specific route folder answers.
    assert.equal(
      rewriteTarget(afterFiles, `${path}.md`),
      `https://www.prisma.io/llms.mdx${path}`,
      path,
    );
  }
  assert.ok(existsSync(join(siteRoot, "src/app/llms.mdx/dataguide/[...slug]/route.ts")));
});

test("/dataguide/<path>.mdx reaches the same route, like the site's other .mdx URLs", async () => {
  const { beforeFiles } = await rewrites();
  for (const path of [...ARTICLE_PATHS, "/dataguide/index"]) {
    assert.equal(
      rewriteTarget(beforeFiles, `${path}.mdx`),
      `https://www.prisma.io/llms.mdx${path}`,
      path,
    );
  }
});

// --- the proxy ----------------------------------------------------------------

const event = { waitUntil() {} } as unknown as NextFetchEvent;

function request(pathname: string, headers: Record<string, string> = {}, method = "GET") {
  return new NextRequest(`https://www.prisma.io${pathname}`, { headers, method });
}

const AGENTS: Record<string, string>[] = [
  {
    "user-agent":
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
  },
  { "user-agent": "Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)" },
  { "user-agent": "Mozilla/5.0 (compatible; PerplexityBot/1.0)" },
  {
    "user-agent":
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)",
  },
  { accept: "text/markdown" },
];

const NOT_AGENTS: Record<string, string>[] = [
  {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  },
  { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  { "user-agent": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" },
  {
    "user-agent":
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  },
];

test("agents asking for a Data Guide page are rewritten to its Markdown", async () => {
  for (const path of ["/dataguide", ...ARTICLE_PATHS]) {
    for (const headers of AGENTS) {
      const response = await proxy(request(path, headers), event);
      const rewrite = response.headers.get("x-middleware-rewrite");
      assert.ok(rewrite, `${JSON.stringify(headers)} on ${path}`);
      assert.equal(
        new URL(rewrite, "https://www.prisma.io").pathname,
        path === "/dataguide" ? "/llms.mdx/dataguide/index" : `/llms.mdx${path}`,
      );
      assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY);
    }
  }
});

test("browsers and search crawlers get Data Guide HTML, with Vary: Accept", async () => {
  for (const path of ["/dataguide", ...ARTICLE_PATHS]) {
    for (const headers of NOT_AGENTS) {
      const response = await proxy(request(path, headers), event);
      assert.equal(response.headers.get("x-middleware-next"), "1", path);
      assert.equal(response.headers.get("x-middleware-rewrite"), null, path);
      assert.equal(response.headers.get("vary"), "Accept", path);
    }
  }
});

test("Data Guide files and .md URLs pass the proxy untouched", async () => {
  for (const path of [
    "/dataguide/llms.txt",
    "/dataguide/agent-index.json",
    "/dataguide/intro.md",
  ]) {
    for (const headers of [...AGENTS, ...NOT_AGENTS]) {
      const response = await proxy(request(path, headers), event);
      assert.equal(response.headers.get("x-middleware-rewrite"), null, path);
      assert.equal(response.headers.get("vary"), null, path);
    }
  }
});

/** The request headers a `next()` or rewrite forwards, as Next encodes them. */
function forwardedHeaderNames(response: Response) {
  return (response.headers.get("x-middleware-override-headers") ?? "").split(",").filter(Boolean);
}

test("a client-sent negotiation header is dropped when the proxy does not rewrite", async () => {
  const spoofed = {
    "x-prisma-agent-markdown": "user-agent",
    "x-prisma-agent-markdown-path": "/dataguide/intro",
  };
  const cases: [string, Record<string, string>, string?][] = [
    // A .md URL: the route has to treat it as a .md URL.
    ["/dataguide/intro.md", {}],
    ["/dataguide/intro.md", AGENTS[0]],
    // A Data Guide HTML URL for a browser, and a non-read on one.
    ["/dataguide/intro", NOT_AGENTS[0]],
    ["/dataguide/intro", AGENTS[0], "POST"],
    // Anything else under the proxy.
    ["/pricing", NOT_AGENTS[0]],
    ["/llms.mdx/dataguide/intro", {}],
  ];
  for (const [path, headers, method] of cases) {
    const response = await proxy(request(path, { ...headers, ...spoofed }, method), event);
    const label = `${method ?? "GET"} ${path} ${JSON.stringify(headers)}`;
    assert.equal(response.headers.get("x-middleware-next"), "1", label);
    assert.equal(response.headers.get("x-middleware-rewrite"), null, label);
    // The override is there, and it leaves both headers out.
    assert.notEqual(response.headers.get("x-middleware-override-headers"), null, label);
    const forwarded = forwardedHeaderNames(response);
    assert.ok(!forwarded.includes("x-prisma-agent-markdown"), label);
    assert.ok(!forwarded.includes("x-prisma-agent-markdown-path"), label);
    assert.equal(response.headers.get("x-middleware-request-x-prisma-agent-markdown"), null, label);
  }
});

test("a request without the negotiation headers gets no header override", async () => {
  for (const path of ["/dataguide/intro.md", "/dataguide/intro", "/pricing"]) {
    const response = await proxy(request(path, NOT_AGENTS[0]), event);
    assert.equal(response.headers.get("x-middleware-override-headers"), null, path);
  }
});

test("the rewrite for an agent sets the negotiation headers itself", async () => {
  const response = await proxy(
    request("/dataguide/intro", { ...AGENTS[0], "x-prisma-agent-markdown": "accept" }),
    event,
  );
  assert.ok(response.headers.get("x-middleware-rewrite"));
  assert.equal(response.headers.get("x-middleware-request-x-prisma-agent-markdown"), "user-agent");
  assert.equal(
    response.headers.get("x-middleware-request-x-prisma-agent-markdown-path"),
    "/dataguide/intro",
  );
});

// --- the route ----------------------------------------------------------------

type FetchStub = (url: string, init?: RequestInit) => Response | Promise<Response>;

async function withFetch<T>(
  stub: FetchStub,
  run: (calls: string[], inits: (RequestInit | undefined)[]) => Promise<T>,
) {
  const original = globalThis.fetch;
  const calls: string[] = [];
  const inits: (RequestInit | undefined)[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    calls.push(url);
    inits.push(init);
    return stub(url, init);
  }) as typeof fetch;
  try {
    return await run(calls, inits);
  } finally {
    globalThis.fetch = original;
  }
}

function callRoute(slug: string[], headers: Record<string, string> = {}) {
  const req = new Request(`https://www.prisma.io/llms.mdx/dataguide/${slug.join("/")}`, {
    headers,
  });
  return GET(req, { params: Promise.resolve({ slug }) } as never);
}

const ARTICLE_MARKDOWN = "# 5 ways to host PostgreSQL databases\n\nBody.\n";

test("serves the Data Guide's export as text/plain with canonical and llms.txt links", async () => {
  await withFetch(
    () =>
      new Response(ARTICLE_MARKDOWN, {
        headers: { "content-type": "text/markdown; charset=utf-8" },
      }),
    async (calls) => {
      const response = await callRoute(["postgresql", "5-ways-to-host-postgresql"]);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
      assert.equal(response.headers.get("vary"), "Accept");
      const link = response.headers.get("link") ?? "";
      assert.match(link, /\/dataguide\/postgresql\/5-ways-to-host-postgresql>; rel="canonical"/);
      assert.match(link, /\/dataguide\/llms\.txt>; rel="llms-txt"/);
      assert.equal(await response.text(), ARTICLE_MARKDOWN);
      assert.deepEqual(calls, [
        `${DATAGUIDE_ORIGIN}/dataguide/postgresql/5-ways-to-host-postgresql.md`,
      ]);
    },
  );
});

test("the overview is read from the Data Guide's index.md", async () => {
  await withFetch(
    () => new Response("# Data Guide\n", { headers: { "content-type": "text/markdown" } }),
    async (calls) => {
      const response = await callRoute(["index"]);
      assert.equal(response.status, 200);
      assert.match(response.headers.get("link") ?? "", /\/dataguide>; rel="canonical"/);
      assert.deepEqual(calls, [`${DATAGUIDE_ORIGIN}/dataguide/index.md`]);
    },
  );
});

test("a missing export is a text/plain 404 for a .md URL", async () => {
  await withFetch(
    () =>
      new Response("<!DOCTYPE html>", { status: 404, headers: { "content-type": "text/html" } }),
    async () => {
      const response = await callRoute(["postgresql", "nope"]);
      assert.equal(response.status, 404);
      assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
      assert.match(await response.text(), /dataguide\/llms\.txt/);
    },
  );
});

test("an HTML answer with status 200 is never passed off as Markdown", async () => {
  await withFetch(
    () => new Response("<!DOCTYPE html>", { headers: { "content-type": "text/html" } }),
    async () => {
      const response = await callRoute(["intro"]);
      assert.equal(response.status, 404);
    },
  );
});

test("Markdown chosen for an HTML URL varies on Accept and User-Agent", async () => {
  await withFetch(
    () => new Response(ARTICLE_MARKDOWN, { headers: { "content-type": "text/markdown" } }),
    async () => {
      const response = await callRoute(["postgresql", "5-ways-to-host-postgresql"], {
        "x-prisma-agent-markdown": "user-agent",
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY);
      assert.equal(await response.text(), ARTICLE_MARKDOWN);
    },
  );
});

test("an agent on an HTML URL without an export gets the page it would have got", async () => {
  await withFetch(
    (url) =>
      url.endsWith(".md")
        ? new Response("missing", { status: 404, headers: { "content-type": "text/html" } })
        : new Response("<!DOCTYPE html><p>page</p>", {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8" },
          }),
    async (calls) => {
      const response = await callRoute(["intro", "no-export"], {
        "x-prisma-agent-markdown": "user-agent",
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
      assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY);
      assert.equal(await response.text(), "<!DOCTYPE html><p>page</p>");
      assert.deepEqual(calls, [
        `${DATAGUIDE_ORIGIN}/dataguide/intro/no-export.md`,
        `${DATAGUIDE_ORIGIN}/dataguide/intro/no-export`,
      ]);
    },
  );
});

test("the page an agent falls back to keeps the Data Guide's own Vary", async () => {
  await withFetch(
    (url) =>
      url.endsWith(".md")
        ? new Response("missing", { status: 404, headers: { "content-type": "text/html" } })
        : new Response("<!DOCTYPE html>", {
            headers: { "content-type": "text/html", vary: "Accept-Encoding" },
          }),
    async () => {
      const response = await callRoute(["intro", "no-export"], {
        "x-prisma-agent-markdown": "accept",
      });
      assert.equal(response.headers.get("vary"), `Accept-Encoding, ${AGENT_MARKDOWN_VARY}`);
    },
  );
});

test("an unusable slug is a 404 without any upstream request", async () => {
  await withFetch(
    () => {
      throw new Error("should not fetch");
    },
    async (calls) => {
      for (const slug of [["static", "x"], [".."], ["a.b"]]) {
        const response = await callRoute(slug);
        assert.equal(response.status, 404, slug.join("/"));
      }
      assert.deepEqual(calls, []);
    },
  );
});

test("an upstream failure is a 502 for a .md URL", async () => {
  await withFetch(
    () => {
      throw new TypeError("fetch failed");
    },
    async () => {
      const response = await callRoute(["intro"]);
      assert.equal(response.status, 502);
      assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
      assert.equal(response.headers.get("vary"), "Accept");
    },
  );
});

test("every upstream request has a timeout", async () => {
  await withFetch(
    (url) =>
      url.endsWith(".md")
        ? new Response("missing", { status: 404, headers: { "content-type": "text/html" } })
        : new Response("<!DOCTYPE html>", { headers: { "content-type": "text/html" } }),
    async (calls, inits) => {
      await callRoute(["intro", "no-export"], { "x-prisma-agent-markdown": "user-agent" });
      assert.equal(calls.length, 2);
      for (const init of inits) assert.ok(init?.signal instanceof AbortSignal);
    },
  );
});

test("an agent on an HTML URL that redirects upstream gets the redirect", async () => {
  await withFetch(
    (url, init) => {
      if (url.endsWith(".md")) {
        return new Response("missing", { status: 404, headers: { "content-type": "text/html" } });
      }
      assert.equal(init?.redirect, "manual");
      return new Response(null, {
        status: 301,
        headers: { location: "/dataguide/intro/moved" },
      });
    },
    async () => {
      const response = await callRoute(["intro", "old"], {
        "x-prisma-agent-markdown": "user-agent",
      });
      assert.equal(response.status, 301);
      assert.equal(response.headers.get("location"), "/dataguide/intro/moved");
      assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY);
    },
  );
});

test("an agent gets a 502 when both upstream requests fail", async () => {
  await withFetch(
    () => {
      throw new TypeError("fetch failed");
    },
    async (calls) => {
      const response = await callRoute(["intro"], { "x-prisma-agent-markdown": "user-agent" });
      assert.equal(response.status, 502);
      assert.equal(response.headers.get("vary"), AGENT_MARKDOWN_VARY);
      assert.equal(calls.length, 2);
    },
  );
});
