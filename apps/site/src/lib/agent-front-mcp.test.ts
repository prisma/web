import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest, type NextFetchEvent } from "next/server";

process.env.ORA_INGEST_KEY = "test-key";
process.env.ORA_DOMAIN_ID = "test-domain";
let oraCalls = 0;
globalThis.fetch = (async () => {
  oraCalls += 1;
  throw new Error("MCP must never contact Ora");
}) as typeof fetch;

const { proxy } = await import("@/proxy");

test("Prisma MCP protocol requests bypass Ora even with Autopilot configured", async () => {
  const pending: Promise<unknown>[] = [];
  const event = { waitUntil: (job: Promise<unknown>) => pending.push(job) } as unknown as NextFetchEvent;
  const status = await proxy(new NextRequest("https://www.prisma.io/__ora/status"), event);
  assert.equal((await status.json()).autopilot, true);

  for (const pathname of ["/mcp", "/mcp/"]) {
    for (const method of ["GET", "POST", "HEAD", "OPTIONS"]) {
      const response = await proxy(
        new NextRequest(`https://www.prisma.io${pathname}`, {
          method,
          headers: { accept: "application/json, text/event-stream", "user-agent": "Cursor/1.0" },
        }),
        event,
      );
      assert.equal(response.headers.get("x-middleware-next"), "1");
      assert.equal(response.headers.get("x-middleware-rewrite"), null);
    }
  }
  await Promise.all(pending);
  assert.equal(oraCalls, 0);
});
