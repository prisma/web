import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { createProxy } from "@prisma/proxy";
import { gatewaySites } from "./config.ts";
import { agentFrontMiddleware } from "./agent-front.ts";

test("Agent Front remains optional and observes child page requests exactly once", async () => {
  assert.equal(agentFrontMiddleware(), undefined);
  const events: { path: string }[] = [];
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += String(chunk);
    events.push(JSON.parse(body.trim()));
    res.writeHead(202, { "content-type": "application/json" });
    res.end("{}");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const names = [
    "ORA_INGEST_KEY",
    "ORA_KEY",
    "ORA_SALT",
    "ORA_DOMAIN_ID",
    "ORA_POLICY_URL",
    "ORA_EDGE",
    "ORA_INGEST_URL",
    "ORA_INGEST",
  ];
  const saved = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  try {
    const address = server.address() as import("node:net").AddressInfo;
    const middleware = agentFrontMiddleware({
      ORA_INGEST_KEY: "local-fixture",
      ORA_SALT: "local-fixture",
      ORA_INGEST_URL: `http://127.0.0.1:${address.port}/events`,
    })!;
    const jobs: Promise<unknown>[] = [];
    const origins = Object.fromEntries(
      ["site", "docs", "blog", "handbook", "eclipse"].map((name) => [name, `http://${name}.test`]),
    );
    const proxy = createProxy(gatewaySites(new URL("../../apps/", import.meta.url), {}, []), {
      origins,
      fetch: async () => new Response("page"),
      middleware: { site: middleware },
      waitUntil: (job) => jobs.push(job),
    });
    const headers = {
      "sec-fetch-mode": "navigate",
      "sec-fetch-dest": "document",
      "user-agent": "Browser",
    };
    for (const path of ["/docs/composer", "/blog/prisma-orm-8-nestjs"])
      assert.equal((await proxy(new Request(`https://web.test${path}`, { headers }))).status, 200);
    for (const [path, extra] of [
      ["/", {}],
      ["/docs-static/_next/static/asset.js", {}],
      ["/docs/composer", { rsc: "1" }],
    ] as const)
      assert.equal(
        (await proxy(new Request(`https://web.test${path}`, { headers: { ...headers, ...extra } })))
          .status,
        200,
      );
    await Promise.all(jobs);
    assert.deepEqual(
      events.map((event) => event.path),
      ["/docs/composer", "/blog/prisma-orm-8-nestjs"],
    );
  } finally {
    for (const name of names)
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
    server.close();
    server.closeAllConnections();
    await once(server, "close");
  }
});
