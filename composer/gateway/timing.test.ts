import assert from "node:assert/strict";
import { test } from "node:test";
import { withGatewayTiming } from "./timing.ts";

test("gateway timing preserves status, upstream timings and an unread stream", async () => {
  let controller: ReadableStreamDefaultController;
  const body = new ReadableStream({
    start(value) {
      controller = value;
    },
  });
  const handler = withGatewayTiming(
    async () =>
      new Response(body, {
        status: 206,
        headers: {
          "server-timing": "render;dur=3",
          "content-range": "bytes 0-1/2",
          "set-cookie": "session=value; HttpOnly",
        },
      }),
  );
  const response = await handler(new Request("https://example.com/"));
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("content-range"), "bytes 0-1/2");
  assert.equal(response.headers.get("set-cookie"), "session=value; HttpOnly");
  assert.match(response.headers.get("server-timing")!, /^render;dur=3, gateway;dur=\d+\.\d$/);
  assert.equal(response.bodyUsed, false);
  controller!.enqueue(new TextEncoder().encode("ok"));
  controller!.close();
  assert.equal(await response.text(), "ok");
});
