import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { TEMPLATE_MANIFEST_URL } from "./catalog";
import {
  loadTemplates,
  MANIFEST_REVALIDATE_SECONDS,
  manifestFetchInit,
  showsPreviewManifests,
} from "./manifest";

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

/** Replaces `fetch` with one that serves a one-template manifest and records each request's options. */
function stubManifestFetch(): RequestInit[] {
  const requests: RequestInit[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(input), TEMPLATE_MANIFEST_URL);
    requests.push(init ?? {});
    return Response.json({
      version: 1,
      templates: [
        {
          id: "hono",
          name: "Hono API",
          description: "Hono REST API.",
          path: "compute/hono",
          framework: "hono",
        },
      ],
    });
  }) as typeof fetch;
  return requests;
}

test("the sitemap reads the manifest once, with no revalidation interval for its route", async () => {
  // A revalidating fetch would make /sitemap-site.xml a page Next rebuilds on
  // the server, where the TSX routes' git dates are not available.
  const requests = stubManifestFetch();
  const templates = await loadTemplates("build");
  assert.deepEqual(
    templates.map((template) => template.pagePath),
    ["/apps/hono"],
  );
  assert.equal(requests.length, 1);
  assert.equal(requests[0]?.cache, "no-store");
  assert.equal(requests[0]?.next, undefined);
});

test("pages re-read the manifest every five minutes", async () => {
  const requests = stubManifestFetch();
  await loadTemplates();
  assert.equal(requests.length, 1);
  assert.deepEqual(requests[0]?.next, { revalidate: 300 });
  assert.equal(requests[0]?.cache, undefined);
  assert.equal(MANIFEST_REVALIDATE_SECONDS, 300);
});

test("only the build read opts out of the page cache", () => {
  assert.deepEqual(manifestFetchInit("build"), { cache: "no-store" });
  assert.deepEqual(manifestFetchInit("revalidate"), { next: { revalidate: 300 } });
});

test("an unreachable manifest leaves the sitemap without app pages instead of failing it", async () => {
  globalThis.fetch = (async () => new Response("down", { status: 503 })) as typeof fetch;
  assert.deepEqual(await loadTemplates("build"), []);
});

test("production reads the latest branch only; previews and local dev also read review branches", () => {
  assert.equal(showsPreviewManifests({ VERCEL_ENV: "production", NODE_ENV: "production" }), false);
  assert.equal(showsPreviewManifests({ VERCEL_ENV: "preview", NODE_ENV: "production" }), true);
  assert.equal(showsPreviewManifests({ NODE_ENV: "development" }), true);
  assert.equal(showsPreviewManifests({ NODE_ENV: "test" }), false);
});
