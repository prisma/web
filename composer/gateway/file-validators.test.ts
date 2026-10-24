import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { withFileValidators } from "./file-validators.ts";

test("equal-size asset edits have different validators despite the same archive mtime", async () => {
  const tag = (body: string) => `"asset-v1-${createHash("sha256").update(body).digest("hex")}"`;
  const old = tag("old!");
  const current = tag("new!");
  const files = new Map([
    ["/file.gif", { bytes: 4, sha256: createHash("sha256").update("new!").digest("hex") }],
  ]);
  const seen: Request[] = [];
  const handler = withFileValidators((request) => {
    seen.push(request);
    return new Response("new!", {
      headers: {
        etag: 'W/"4-3e8"',
        "last-modified": "Thu, 01 Jan 1970 00:00:01 GMT",
        "content-length": "4",
      },
    });
  }, files);
  const request = (headers: Record<string, string> = {}) =>
    new Request("https://web.test/file.gif", { headers });
  const updated = await handler(request({ "if-none-match": old }));
  assert.equal(updated.status, 200);
  assert.equal(updated.headers.get("etag"), current);
  assert.equal(updated.headers.has("last-modified"), false);
  assert.equal(await updated.text(), "new!");
  const cached = await handler(request({ "if-none-match": `W/${current}` }));
  assert.equal(cached.status, 304);
  assert.equal(cached.body, null);
  assert.equal(cached.headers.has("content-length"), false);
  assert.equal(seen[0].headers.has("if-none-match"), false);
  assert.equal((await handler(request({ "if-match": old }))).status, 412);
  assert.equal((await handler(request({ "if-match": current }))).status, 200);
  await handler(request({ range: "bytes=0-1", "if-range": old }));
  assert.equal(seen.at(-1)!.headers.has("range"), false);
  await handler(request({ range: "bytes=0-1", "if-range": current }));
  assert.equal(seen.at(-1)!.headers.get("range"), "bytes=0-1");
  assert.equal(seen.at(-1)!.headers.has("if-range"), false);
});

test("encoded representations have weak content validators and unknown paths are untouched", async () => {
  const source = () =>
    new Response(new Uint8Array([31, 139, 8]), {
      headers: { etag: 'W/"4-3e8"', "content-encoding": "gzip" },
    });
  const handler = withFileValidators(
    source,
    new Map([["/file.svg", { bytes: 4, sha256: "digest" }]]),
  );
  const response = await handler(new Request("https://web.test/file.svg"));
  assert.equal(response.headers.get("etag"), 'W/"asset-v1-digest"');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), new Uint8Array([31, 139, 8]));
  const original = source();
  assert.equal(
    await withFileValidators(
      () => original,
      new Map(),
    )(new Request("https://web.test/api/image.gif")),
    original,
  );
});
