import assert from "node:assert/strict";
import test from "node:test";
import {
  applyRules,
  codeRanges,
  compileSource,
  findHrefs,
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
  assert.equal(toHrefForZone(new URL("https://www.prisma.io/blog/post#frag"), "/blog"), "/post#frag");
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
    applyRules("/cli/dev/a/b", [{ source: "/cli/dev/:path+", destination: "/cli/v7/dev/:path+", prefix: "" }]),
    "/cli/v7/dev/a/b",
  );
  assert.equal(applyRules("/showcase", [{ source: "/showcase", destination: "/customers", prefix: "" }]), "/customers");
  assert.equal(applyRules("/untouched", [{ source: "/showcase", destination: "/customers", prefix: "" }]), null);
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
