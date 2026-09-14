import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import {
  applyRules,
  codeRanges,
  compileSource,
  findHrefs,
  fetchFollowing,
  resolvedWithFragment,
  resolveOffline,
  isOutOfScopeHref,
  parseNextRedirects,
  repairMisplacedQuery,
  stripTracking,
  toAbsoluteSameSiteUrl,
  toHrefForZone,
  // @ts-expect-error Node's TypeScript test runner requires the explicit extension.
} from "./fix-internal-links.ts";

test("ignores hrefs that are not same-site page links", () => {
  for (const href of ["#section", "mailto:x@y.z", "tel:+1", "./sibling", "../up", "bare"]) {
    assert.equal(isOutOfScopeHref(href), true, href);
  }
  assert.equal(isOutOfScopeHref("/docs"), false);
  assert.equal(isOutOfScopeHref("https://www.prisma.io/docs"), false);
});

test("resolves a root-relative href against the zone's basePath", () => {
  assert.equal(
    toAbsoluteSameSiteUrl("/my-post", "/blog")?.toString(),
    "https://www.prisma.io/blog/my-post",
  );
  assert.equal(toAbsoluteSameSiteUrl("/pricing", "")?.toString(), "https://www.prisma.io/pricing");
});

test("normalises the apex domain to www", () => {
  assert.equal(
    toAbsoluteSameSiteUrl("https://prisma.io/postgres", "")?.toString(),
    "https://www.prisma.io/postgres",
  );
});

test("leaves other hosts and assets alone", () => {
  assert.equal(toAbsoluteSameSiteUrl("https://github.com/prisma", ""), null);
  assert.equal(toAbsoluteSameSiteUrl("https://console.prisma.io/login", ""), null);
  assert.equal(toAbsoluteSameSiteUrl("/images/logo.svg", ""), null);
});

test("strips utm_* and via, keeps everything else", () => {
  const { url, removed } = stripTracking(
    new URL("https://www.prisma.io/blog/x?utm_source=a&utm_medium=b&via=c&page=2"),
  );
  assert.equal(url.toString(), "https://www.prisma.io/blog/x?page=2");
  assert.deepEqual(removed.sort(), ["utm_medium", "utm_source", "via"]);
});

test("repairs a query string written after the fragment", () => {
  // audit 2.1: `#frag?utm_source=x` makes the whole tail the fragment.
  const { url, repaired } = repairMisplacedQuery(
    new URL("https://www.prisma.io/blog/operations-based-billing#why-better?utm_source=pricing"),
  );
  assert.equal(repaired, true);
  assert.equal(url.hash, "#why-better");
  assert.equal(url.search, "");
});

test("leaves a correctly ordered query and fragment untouched", () => {
  const { url, repaired } = repairMisplacedQuery(
    new URL("https://www.prisma.io/docs/accelerate/caching?utm_source=x#on-demand"),
  );
  assert.equal(repaired, false);
  assert.equal(url.hash, "#on-demand");
});

test("a basePath zone can only express its own paths root-relatively", () => {
  // Inside apps/blog, `/x` means `/blog/x`, so a /docs target must stay absolute.
  assert.equal(
    toHrefForZone(new URL("https://www.prisma.io/blog/post#frag"), "/blog"),
    "/post#frag",
  );
  assert.equal(
    toHrefForZone(new URL("https://www.prisma.io/docs/postgres"), "/blog"),
    "https://www.prisma.io/docs/postgres",
  );
});

test("the host zone keeps cross-zone targets absolute", () => {
  assert.equal(toHrefForZone(new URL("https://www.prisma.io/pricing"), ""), "/pricing");
  assert.equal(
    toHrefForZone(new URL("https://www.prisma.io/docs/postgres"), ""),
    "https://www.prisma.io/docs/postgres",
  );
  assert.equal(
    toHrefForZone(new URL("https://www.prisma.io/blog/post"), ""),
    "https://www.prisma.io/blog/post",
  );
});

test("an off-site final destination stays absolute in every zone", () => {
  assert.equal(toHrefForZone(new URL("https://app.prisma.io/"), ""), "https://app.prisma.io/");
});

test("finds markdown links and href attributes, but not images or src", () => {
  const source = [
    "[one](/a) and ![alt](/img.png) and <a href='/b'>two</a>",
    '<img src="/c.png" />',
    "[ref]: /d",
  ].join("\n");
  assert.deepEqual(
    findHrefs(source).map((o) => o.raw),
    ["/a", "/b", "/d"],
  );
});

test("never touches links inside code", () => {
  const source = [
    "before [keep](/keep)",
    "```jsx",
    '<Link href="/api/auth/login" />',
    "[skip](/skip)",
    "```",
    "after `[skip2](/skip2)` done",
  ].join("\n");
  assert.deepEqual(
    findHrefs(source).map((o) => o.raw),
    ["/keep"],
  );
});

test("an unterminated fence masks to end of file rather than leaking", () => {
  const ranges = codeRanges("text\n```\n[x](/x)\n");
  assert.equal(ranges.length, 1);
  assert.equal(ranges[0][1], "text\n```\n[x](/x)\n".length);
});

test("the offsets a match reports point at the href itself", () => {
  const source = "see [docs](/docs/postgres) now";
  const [occurrence] = findHrefs(source);
  assert.equal(source.slice(occurrence.start, occurrence.end), "/docs/postgres");
});

test("compiles Next.js redirect sources, including the :path* / :path+ difference", () => {
  // `:path*` matches the empty tail; `:path+` requires a segment. That is the
  // whole of audit finding 1.2's trailing-slash chain.
  assert.equal(compileSource("/cli/dev/:path*").regex.test("/cli/dev"), true);
  assert.equal(compileSource("/cli/dev/:path+").regex.test("/cli/dev"), false);
  assert.equal(compileSource("/cli/dev/:path+").regex.test("/cli/dev/a/b"), true);
  // Next.js matches sources case-insensitively — the cause of the loop in 1.1.
  assert.equal(compileSource("/nestjs-x-7d056").regex.test("/nestjs-x-7D056"), true);
});

test("substitutes captured segments into the destination", () => {
  assert.equal(
    applyRules("/cli/dev/a/b", [
      { source: "/cli/dev/:path+", destination: "/cli/v7/dev/:path+", prefix: "" },
    ]),
    "/cli/v7/dev/a/b",
  );
  assert.equal(
    applyRules("/showcase", [{ source: "/showcase", destination: "/customers", prefix: "" }]),
    "/customers",
  );
  assert.equal(
    applyRules("/untouched", [{ source: "/showcase", destination: "/customers", prefix: "" }]),
    null,
  );
});

test("reads a Next config redirect table without importing it", () => {
  const config = [
    "const config = {",
    "  async redirects() {",
    "    return [",
    '      { source: "/a", destination: "/b", permanent: true },',
    '      { source: "/host-only", destination: "/x", has: [{ type: "host", value: "h" }] },',
    '      { source: "/", destination: "/blog", permanent: false, basePath: false },',
    "    ];",
    "  },",
    "  async rewrites() {",
    '    return [{ source: "/not-a-redirect", destination: "/nope" }];',
    "  },",
    "};",
  ].join("\n");

  assert.deepEqual(parseNextRedirects(config), [{ source: "/a", destination: "/b" }]);
});

test("native anchors keep /blog while router links use the app basePath", () => {
  const source =
    '<a target="_blank"\n href="/blog/post">native</a> [markdown](/post) <Link href="/post">router</Link>';
  const occurrences = findHrefs(source);
  assert.deepEqual(
    occurrences.map((o) => Boolean(o.nativeAnchor)),
    [true, false, false],
  );
  for (const occurrence of occurrences) {
    const absolute = toAbsoluteSameSiteUrl(occurrence.raw, "/blog", occurrence.nativeAnchor)!;
    assert.equal(absolute.href, "https://www.prisma.io/blog/post");
    assert.equal(
      toHrefForZone(absolute, "/blog", occurrence.nativeAnchor),
      occurrence.nativeAnchor ? "https://www.prisma.io/blog/post" : "/post",
    );
  }
  const post = readFileSync(
    new URL(
      "../apps/blog/content/blog/accelerate-preview-release-ab229e69ed2/index.mdx",
      import.meta.url,
    ),
    "utf8",
  );
  const link = findHrefs(post).find(
    (o) => o.nativeAnchor && o.raw.includes("benefits-and-challenges"),
  )!;
  assert.equal(
    toAbsoluteSameSiteUrl(link.raw, "/blog", link.nativeAnchor)?.pathname,
    "/blog/benefits-and-challenges-of-caching-database-query-results-x2s9ei21e8kq",
  );
});

test("online redirects preserve fragments through multiple hops and HEAD fallback", async () => {
  const server = createServer((req, res) => {
    if (req.method === "HEAD" && req.url === "/get-only") {
      res.writeHead(405).end();
      return;
    }
    const redirects: Record<string, string> = {
      "/old": "/middle#named-constraints-and-indexes",
      "/middle": "/new",
      "/empty": "/new#",
      "/get-only": "/new#get-section",
      "/loop": "/loop",
    };
    const location = redirects[req.url ?? ""];
    if (location) res.writeHead(308, { Location: location }).end();
    else res.end("ok");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const origin = `http://127.0.0.1:${address.port}`;
    assert.deepEqual(await fetchFollowing(`${origin}/old`), {
      finalUrl: `${origin}/new#named-constraints-and-indexes`,
      status: 200,
    });
    assert.equal(
      (await fetchFollowing(`${origin}/get-only`)).finalUrl,
      `${origin}/new#get-section`,
    );
    assert.equal((await fetchFollowing(`${origin}/empty#original`)).finalUrl, `${origin}/new#`);
    await assert.rejects(fetchFollowing(`${origin}/loop`), /Too many redirects/);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("offline redirects and final replacements honor Location fragment precedence", () => {
  const origin = "https://www.prisma.io";
  const rules = [
    { source: "/old", destination: "/middle#section", prefix: "" },
    { source: "/middle", destination: "/new", prefix: "" },
  ];
  const resolution = resolveOffline(`${origin}/old`, rules);
  assert.equal(resolution.finalUrl, `${origin}/new#section`);
  assert.equal(
    resolvedWithFragment(resolution.finalUrl, new URL(`${origin}/old#author`)).hash,
    "#section",
  );
  assert.equal(
    resolvedWithFragment(`${origin}/new`, new URL(`${origin}/old#author`)).hash,
    "#author",
  );
  assert.equal(
    resolvedWithFragment(`${origin}/new#`, new URL(`${origin}/old#author`)).href,
    `${origin}/new#`,
  );
  for (const post of ["wnip-q3-hpk7pyth8v", "wnip-q4-dsk0golh8v"]) {
    const source = readFileSync(
      new URL(`../apps/blog/content/blog/${post}/index.mdx`, import.meta.url),
      "utf8",
    );
    assert.match(
      source,
      /\[Named Constraints upgrade guide\]\(https:\/\/www\.prisma\.io\/docs\/guides\/upgrade-prisma-orm\/v3#named-constraints-and-indexes\)/,
    );
  }
});
