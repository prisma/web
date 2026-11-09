import assert from "node:assert/strict";
import { test } from "node:test";
import { request } from "node:http";
import { gzipSync } from "node:zlib";
import { createHttpServer, rawFetch } from "./node.ts";

async function listen(
  handler: Parameters<typeof createHttpServer>[0],
  options?: Parameters<typeof createHttpServer>[1],
) {
  const server = createHttpServer(handler, options);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return { server, url: `http://127.0.0.1:${address.port}` };
}

test("the HTTP adapter preserves a known length on multi-chunk streams, including Bun", async () => {
  const length = 2 * 1024 * 1024;
  const { server, url } = await listen((request) => {
    if (new URL(request.url).pathname === "/not-modified")
      return new Response(null, { status: 304, headers: { etag: '"same"' } });
    let sent = 0;
    return new Response(
      new ReadableStream({
        pull(controller) {
          if (sent === length) controller.close();
          else {
            controller.enqueue(new Uint8Array(65536).fill(42));
            sent += 65536;
          }
        },
      }),
      { headers: { "content-length": String(length) } },
    );
  });
  try {
    const response = await rawFetch(new URL(url), {});
    assert.equal(response.headers.get("content-length"), String(length));
    assert.equal(response.headers.has("transfer-encoding"), false);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.equal(bytes.length, length);
    assert.ok(bytes.every((n) => n === 42));
    const head = await rawFetch(new URL(url), { method: "HEAD" });
    assert.equal(head.headers.get("content-length"), String(length));
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    const cached = await rawFetch(new URL(url + "/not-modified"), {});
    assert.equal(cached.status, 304);
    assert.equal(cached.headers.get("content-length"), null);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((r) => server.close(() => r()));
  }
});

test("compressed bytes, duplicate cookies and streamed request bodies survive the adapter", async () => {
  const bytes = gzipSync("original compressed response");
  const { server, url } = await listen(async (request) => {
    if (request.method === "POST") return new Response(request.body);
    const headers = new Headers({
      "content-encoding": "gzip",
      "content-length": String(bytes.length),
    });
    headers.append("set-cookie", "one=1; Expires=Wed, 21 Oct 2037 07:28:00 GMT");
    headers.append("set-cookie", "two=2");
    return new Response(bytes, { headers });
  });
  try {
    const response = await rawFetch(new URL(url), {});
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
    assert.equal(response.headers.getSetCookie().length, 2);
    const posted = await rawFetch(new URL(url), {
      method: "POST",
      body: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode("streamed post"));
          c.close();
        },
      }),
    });
    assert.equal(await posted.text(), "streamed post");
  } finally {
    server.closeAllConnections();
    await new Promise<void>((r) => server.close(() => r()));
  }
});

test("a disconnected client aborts the handler and cancels its response stream", async () => {
  let cancelled!: () => void, aborted!: () => void;
  const cancellation = new Promise<void>((r) => (cancelled = r)),
    abortion = new Promise<void>((r) => (aborted = r));
  const { server, url } = await listen((req) => {
    req.signal.addEventListener("abort", aborted, { once: true });
    return new Response(
      new ReadableStream({
        start(c) {
          c.enqueue(new Uint8Array(1024));
        },
        cancel() {
          cancelled();
        },
      }),
    );
  });
  try {
    const client = request(url, (res) => {
      res.once("data", () => res.destroy());
      res.on("error", () => {});
    });
    client.on("error", () => {});
    client.end();
    await Promise.race([
      Promise.all([cancellation, abortion]),
      new Promise((_, reject) => {
        const timer = setTimeout(() => reject(new Error("Stream not cancelled")), 3000);
        timer.unref();
      }),
    ]);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((r) => server.close(() => r()));
  }
});

test(
  "a failed upstream body is reported and the adapter keeps serving requests",
  { timeout: 5000 },
  async () => {
    const failure = new Error("upstream body failed");
    const errors: unknown[] = [];
    let upstream!: ReadableStreamDefaultController<Uint8Array>;
    const { server, url } = await listen(
      (req) => {
        if (new URL(req.url).pathname === "/healthy") return new Response("still healthy");
        return new Response(
          new ReadableStream<Uint8Array>({
            start(controller) {
              upstream = controller;
              controller.enqueue(new TextEncoder().encode("partial response"));
            },
          }),
        );
      },
      { onError: (error) => errors.push(error) },
    );
    try {
      const response = await rawFetch(new URL(url), {});
      assert.equal(response.status, 200);
      const body = response.text();
      upstream.error(failure);
      await assert.rejects(body);
      assert.deepEqual(errors, [failure]);
      const healthy = await rawFetch(new URL(url + "/healthy"), {});
      assert.equal(await healthy.text(), "still healthy");
    } finally {
      server.closeAllConnections();
      await new Promise<void>((r) => server.close(() => r()));
    }
  },
);
