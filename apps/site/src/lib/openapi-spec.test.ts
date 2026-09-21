import assert from "node:assert/strict";
import test, { afterEach, mock } from "node:test";
import { getOpenApiSpec, openApiSpecResponse } from "./openapi-spec";

/**
 * A trimmed stand-in for what api.prisma.io/v1/doc returns: a valid OpenAPI 3.1
 * document that, like the real upstream, has no top-level `servers` entry.
 */
const upstream = {
  openapi: "3.1.0",
  info: { title: "Prisma Postgres Management API", version: "v1" },
  paths: { "/v1/projects": {} },
};

/** Replaces global `fetch` with one that answers every call with `body` at `status`. */
function stubFetch(status: number, body: unknown) {
  return mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
  );
}

afterEach(() => mock.restoreAll());

test("injects the api.prisma.io servers entry the upstream spec omits", async () => {
  const fetchMock = stubFetch(200, upstream);
  const doc = await getOpenApiSpec();
  assert.deepEqual(doc.servers, [{ url: "https://api.prisma.io" }]);
  assert.equal((doc.info as { title?: string }).title, "Prisma Postgres Management API");

  assert.equal(fetchMock.mock.callCount(), 1);
  const [url, init] = fetchMock.mock.calls[0].arguments as [string, RequestInit];
  assert.equal(url, "https://api.prisma.io/v1/doc");
  assert.ok(init.signal instanceof AbortSignal, "upstream fetch is bounded by a timeout signal");
});

test("serves the spec as JSON with a cache header", async () => {
  stubFetch(200, upstream);
  const res = await openApiSpecResponse();
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  assert.equal(
    res.headers.get("cache-control"),
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
  );
  const json = (await res.json()) as { servers?: unknown };
  assert.deepEqual(json.servers, [{ url: "https://api.prisma.io" }]);
});

test("returns 502 when the upstream API answers with an error", async () => {
  stubFetch(500, { error: "boom" });
  const res = await openApiSpecResponse();
  assert.equal(res.status, 502);
});

test("returns 502 when the upstream fetch fails outright (network error or timeout)", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
  });
  const res = await openApiSpecResponse();
  assert.equal(res.status, 502);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
});
