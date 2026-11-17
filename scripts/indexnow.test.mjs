import assert from "node:assert/strict";
import test from "node:test";
import {
  parseSitemap,
  publicUrl,
  contentPath,
  manifestFor,
  changedUrls,
  submitUrls,
} from "./indexnow.mjs";
const origin = "https://www.prisma.io";
test("rejects preview, private, parameterized and asset URLs", () => {
  for (const url of [
    "https://preview.vercel.app/docs",
    "http://www.prisma.io/docs",
    origin + "/api/x",
    origin + "/docs/api/x",
    origin + "/pricing?utm_source=x",
    origin + "/favicon.ico",
    origin + "/cloud",
    origin + "/docs#x",
  ])
    assert.throws(() => publicUrl(url));
  assert.equal(publicUrl(origin + "/compute"), origin + "/compute");
});
test("reads canonical sitemap URLs and refuses malformed or empty input", () => {
  assert.deepEqual(parseSitemap(`<urlset><url><loc>${origin}/compute</loc></url></urlset>`), [
    origin + "/compute",
  ]);
  for (const xml of ["<urlset/>", "<sitemapindex></sitemapindex>", "<!DOCTYPE x><urlset></urlset>"])
    assert.throws(() => parseSitemap(xml));
});
test("decodes XML entities once without interpreting escaped entity text", () => {
  assert.deepEqual(
    parseSitemap(`<urlset><url><loc>${origin}/blog/a&amp;quot;b</loc></url></urlset>`),
    [origin + "/blog/a&quot;b"],
  );
});
test("maps docs route groups and blog index pages", () => {
  assert.equal(contentPath("apps/docs/content/docs/(index)/v7/index.mdx", "docs"), "/docs/v7");
  assert.equal(contentPath("apps/blog/content/blog/example/index.mdx", "blog"), "/blog/example");
});
test("notifies only changed content plus affected listings", () => {
  const urls = [origin + "/blog/a", origin + "/blog/b", origin + "/blog"];
  const tree = [
    { file: "apps/blog/content/blog/a/index.mdx", sha: "a1" },
    { file: "apps/blog/content/blog/b/index.mdx", sha: "b1" },
    { file: "apps/blog/src/app/layout.tsx", sha: "layout" },
  ];
  const before = manifestFor("blog", urls, tree);
  const after = manifestFor("blog", urls, [{ ...tree[0], sha: "a2" }, ...tree.slice(1)]);
  assert.deepEqual(changedUrls(before, after), [origin + "/blog", origin + "/blog/a"]);
  assert.deepEqual(changedUrls(after, after), []);
  const unrelated = manifestFor("blog", urls, [
    ...tree,
    { file: "apps/docs/content/docs/x.mdx", sha: "x" },
  ]);
  assert.deepEqual(changedUrls(before, unrelated), []);
});
test("shared layout changes notify affected pages and removed URLs are included", () => {
  const urls = [origin + "/blog/a", origin + "/blog/b"];
  const tree = [
    { file: "apps/blog/content/blog/a/index.mdx", sha: "a1" },
    { file: "apps/blog/src/app/layout.tsx", sha: "old" },
  ];
  assert.deepEqual(
    changedUrls(
      manifestFor("blog", urls, tree),
      manifestFor("blog", urls, [tree[0], { ...tree[1], sha: "new" }]),
    ),
    urls,
  );
  assert.deepEqual(changedUrls({ [urls[0]]: "a", [urls[1]]: "b" }, { [urls[0]]: "a" }), [urls[1]]);
});
test("requires a matching published key and accepts only confirmed notifications", async () => {
  const key = "prisma-test-key";
  let posts = 0;
  const fake = async (url, options) => {
    if (options.method === "POST") {
      posts++;
      return { status: 200 };
    }
    return { ok: true, text: async () => key };
  };
  await submitUrls([origin + "/compute"], key, fake);
  assert.equal(posts, 1);
  await assert.rejects(
    () =>
      submitUrls([origin + "/compute"], key, async () => ({ ok: true, text: async () => "wrong" })),
    /key file/,
  );
  for (const status of [202, 403, 429, 500])
    await assert.rejects(
      () =>
        submitUrls([origin + "/compute"], key, async (url, options) =>
          options.method === "POST" ? { status } : { ok: true, text: async () => key },
        ),
      /checkpoint not saved/,
    );
});

test("full sync resubmits unchanged URLs and retains removal notifications", () => {
  const previous = { [origin + "/compute"]: "same", [origin + "/old"]: "old" };
  const current = { [origin + "/compute"]: "same" };
  assert.deepEqual(changedUrls(previous, current), [origin + "/old"]);
  assert.deepEqual(changedUrls(previous, current, true), [origin + "/compute", origin + "/old"]);
});

test("rejects truncated and structurally invalid XML before computing removals", () => {
  const prior = { [origin + "/compute"]: "old", [origin + "/postgres"]: "old" };
  for (const xml of [
    `<urlset><url><loc>${origin}/compute</loc></url>`,
    `<urlset><loc>${origin}/compute</loc></urlset>`,
    `<urlset><url><loc>${origin}/compute</loc><loc>${origin}/postgres</loc></url></urlset>`,
    `<urlset><url><loc>${origin}/compute</loc></url><url/></urlset>`,
    `<urlset><url><loc>${origin}/compute</loc></url></urlset><extra/>`,
  ]) {
    let changeDetectionReached = false;
    assert.throws(() => {
      const urls = parseSitemap(xml);
      changeDetectionReached = true;
      changedUrls(prior, manifestFor("site", urls, []));
    }, /Invalid sitemap XML/);
    assert.equal(changeDetectionReached, false);
  }
  assert.deepEqual(
    parseSitemap(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/compute</loc></url></urlset>`,
    ),
    [origin + "/compute"],
  );
});
