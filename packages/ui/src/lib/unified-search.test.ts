import assert from "node:assert/strict";
import test, { describe } from "node:test";
import type Mixedbread from "@mixedbread/sdk";
import { createUnifiedSearch, Chunk } from "./unified-search";

/** A unified search backed by a fake Mixedbread client that records every `stores.search` call. */
function searchWith(chunks: Chunk[]) {
  const calls: Record<string, unknown>[] = [];
  const client = {
    stores: {
      async search(params: Record<string, unknown>) {
        calls.push(params);
        return { data: chunks };
      },
    },
  } as unknown as Mixedbread;
  return { ...createUnifiedSearch(() => client), calls };
}

const docsChunk = (url: string, extra: Partial<Chunk> = {}): Chunk => ({
  type: "text",
  file_id: url,
  generated_metadata: { url, title: `Title of ${url}` },
  ...extra,
});

describe("ORM version breadcrumb", () => {
  const cases: [url: string, expectedUrl: string, breadcrumbs: string[]][] = [
    ["/docs/orm", "/docs/orm", ["[ORM Latest]", "Docs"]],
    ["/docs/orm/prisma-schema", "/docs/orm/prisma-schema", ["[ORM Latest]", "Docs"]],
    ["/docs/orm/v6/prisma-schema", "/docs/orm/v6/prisma-schema", ["[ORM v6]", "Docs"]],
    ["/docs/orm/v7", "/docs/orm/v7", ["[ORM v7]", "Docs"]],
    ["orm/v7/overview", "/docs/orm/v7/overview", ["[ORM v7]", "Docs"]],
    ["/docs/orm/latest/overview", "/docs/orm/overview", ["[ORM Latest]", "Docs"]],
    ["/docs/orm/latest", "/docs/orm", ["[ORM Latest]", "Docs"]],
    ["https://www.prisma.io/docs/orm/v6/overview/", "/docs/orm/v6/overview", ["[ORM v6]", "Docs"]],
    ["/docs/cli/v7/init", "/docs/cli/v7/init", ["Docs"]],
    ["/docs/guides/nextjs", "/docs/guides/nextjs", ["Docs"]],
    ["/docs", "/docs", ["Docs"]],
    // Documents current behaviour: the prefix check does not require a path boundary.
    ["/docs/orm-something", "/docs/orm-something", ["[ORM Latest]", "Docs"]],
  ];
  for (const [url, expectedUrl, breadcrumbs] of cases) {
    test(`${url} -> ${breadcrumbs.join(" / ")}`, async () => {
      const { searchPages } = searchWith([docsChunk(url, { type: "image" })]);
      const [result] = await searchPages("orm");
      assert.equal(result?.url, expectedUrl);
      assert.deepEqual(result?.breadcrumbs, breadcrumbs);
    });
  }

  test("blog and website results carry no ORM version", async () => {
    const { searchPages } = searchWith([
      { generated_metadata: { slug: "orm-v7-release", title: "ORM v7" } },
      { metadata: { source: "website", url: "/orm", title: "ORM" } },
    ]);
    const results = await searchPages("orm");
    assert.deepEqual(
      results.map((r: { url: string; breadcrumbs?: string[] }) => [r.url, r.breadcrumbs]),
      [
        ["/blog/orm-v7-release", ["Blog"]],
        ["/orm", ["Website"]],
      ],
    );
  });
});

describe("searchPages", () => {
  test("skips the client for empty or symbol-only queries", async () => {
    const { searchPages, calls } = searchWith([docsChunk("/docs/x")]);
    assert.deepEqual(await searchPages("   "), []);
    assert.deepEqual(await searchPages("?!-"), []);
    assert.equal(calls.length, 0);
  });

  test("trims and caps the query, and picks stores per source", async () => {
    const { searchPages, calls } = searchWith([]);
    await searchPages(`  ${"a".repeat(250)}  `);
    await searchPages("prisma", "blog");
    await searchPages("prisma", "docs");
    assert.equal((calls[0]!.query as string).length, 200);
    assert.deepEqual(calls[0]!.store_identifiers, ["website-search", "web-search", "blog-search"]);
    assert.deepEqual(calls[0]!.search_options, { rerank: true, return_metadata: true });
    assert.deepEqual(calls[1]!.store_identifiers, ["blog-search"]);
    assert.deepEqual(calls[1]!.search_options, { return_metadata: true });
    assert.deepEqual(calls[2]!.store_identifiers, ["web-search"]);
    assert.equal(calls[0]!.top_k, 20);
  });

  test("drops unusable or foreign URLs", async () => {
    const { searchPages } = searchWith([
      docsChunk("#"),
      docsChunk(""),
      docsChunk("https://example.com/docs/x"),
      docsChunk("/docs/eclipse/button"),
      docsChunk("/eclipse"),
      { metadata: { source: "website", url: "/docs/orm", title: "Docs via website" } },
      docsChunk("/docs/kept", { type: "image" }),
    ]);
    const results = await searchPages("x");
    assert.deepEqual(
      results.map((r: { url: string }) => r.url),
      ["/docs/kept"],
    );
  });

  test("titles: blog prefers metaTitle, missing titles become Untitled", async () => {
    const { searchPages } = searchWith([
      { generated_metadata: { slug: "post", title: "Title", metaTitle: "Meta title" } },
      { type: "image", generated_metadata: { url: "/docs/untitled" } },
    ]);
    const results = await searchPages("x");
    assert.deepEqual(
      results.map((r: { content: string }) => r.content),
      ["Meta title", "Untitled"],
    );
  });

  test("dedupes pages and adds deduped heading results for docs text chunks", async () => {
    const { searchPages } = searchWith([
      docsChunk("/docs/orm/v6/a", { chunk_index: 0, text: "## Foo Bar!\nBody" }),
      docsChunk("/docs/orm/v6/a", { chunk_index: 1, text: "## Foo Bar!\nMore body" }),
      docsChunk("/docs/orm/v6/a", { chunk_index: 2, text: "Plain paragraph" }),
    ]);
    const results = await searchPages("foo");
    assert.deepEqual(
      results.map((r: { type: string; url: string; content: string }) => [
        r.type,
        r.url,
        r.content,
      ]),
      [
        ["page", "/docs/orm/v6/a", "Title of /docs/orm/v6/a"],
        ["heading", "/docs/orm/v6/a#foo-bar", "Foo Bar!"],
      ],
    );
  });

  test("filters results to the requested source", async () => {
    const { searchPages } = searchWith([
      { generated_metadata: { slug: "post", title: "Post" } },
      docsChunk("/docs/x", { type: "image" }),
    ]);
    const results = await searchPages("x", "docs");
    assert.deepEqual(
      results.map((r: { url: string }) => r.url),
      ["/docs/x"],
    );
  });

  test("returns at most 30 results", async () => {
    const chunks = Array.from({ length: 50 }, (_, i) =>
      docsChunk(`/docs/page-${i}`, { chunk_index: 0, text: `## Heading ${i}` }),
    );
    const { searchPages } = searchWith(chunks);
    assert.equal((await searchPages("heading")).length, 30);
  });
});

describe("GET", () => {
  const envKeys = ["NEXT_SITE_ORIGIN", "NEXT_DOCS_ORIGIN", "NEXT_BLOG_ORIGIN"] as const;
  function withCleanEnv(fn: () => Promise<void>) {
    return async () => {
      const saved = Object.fromEntries(envKeys.map((k) => [k, process.env[k]]));
      for (const k of envKeys) delete process.env[k];
      try {
        await fn();
      } finally {
        for (const k of envKeys) {
          if (saved[k] === undefined) delete process.env[k];
          else process.env[k] = saved[k];
        }
      }
    };
  }

  test("rejects an unknown source", async () => {
    const { GET, calls } = searchWith([]);
    const response = await GET(new Request("https://www.prisma.io/api/search?query=x&source=nope"));
    assert.equal(response.status, 400);
    assert.equal(calls.length, 0);
  });

  test(
    "links results to per-zone origins locally",
    withCleanEnv(async () => {
      const { GET } = searchWith([
        docsChunk("/docs/orm/v6/a", { type: "image" }),
        { generated_metadata: { slug: "post", title: "Post" } },
        { metadata: { source: "website", url: "/pricing", title: "Pricing" } },
      ]);
      const response = await GET(new Request("http://localhost:3000/api/search?query=x"));
      const body = (await response.json()) as { url: string; breadcrumbs: string[] }[];
      assert.deepEqual(
        body.map((r) => [r.url, r.breadcrumbs]),
        [
          ["http://localhost:3001/docs/orm/v6/a", ["[ORM v6]", "Docs"]],
          ["http://localhost:3002/blog/post", ["Blog"]],
          ["http://localhost:3000/pricing", ["Website"]],
        ],
      );
    }),
  );

  test(
    "links every result under the site origin in production",
    withCleanEnv(async () => {
      const { GET } = searchWith([docsChunk("/docs/orm/a", { type: "image" })]);
      const response = await GET(new Request("https://www.prisma.io/api/search?query=x&tag=docs"));
      const body = (await response.json()) as { url: string }[];
      assert.deepEqual(
        body.map((r) => r.url),
        ["https://www.prisma.io/docs/orm/a"],
      );
    }),
  );
});
