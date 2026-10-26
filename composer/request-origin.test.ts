import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { randomBytes } from "node:crypto";
import { rawFetch } from "@prisma/proxy/node";
import { installRequestOrigin, proxyRequestHeaders } from "./request-origin.ts";
import { createProxy } from "@prisma/proxy";
import { vercel } from "@prisma/proxy/vercel";

test("authenticated proxy hops restore the Next host after ingress, reject forged markers and hide the key", async () => {
  const key = randomBytes(32).toString("hex");
  const restore = installRequestOrigin(key);
  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    response.end(
      JSON.stringify({
        host: request.headers.host,
        forwarded: request.headers["x-forwarded-host"],
        proto: request.headers["x-forwarded-proto"],
        markers: Object.keys(request.headers).filter((key) => key.startsWith("x-web-proxy")),
        rawMarkers: request.rawHeaders.filter((value) => value.startsWith("x-web-proxy")),
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${(server.address() as import("node:net").AddressInfo).port}`;
  try {
    for (const host of ["www.prisma.io", "accelerate-speed-test.prisma.io"]) {
      const proxy = createProxy([{ name: "site", mount: "/", routing: vercel({}) }], {
        origins: { site: origin },
        fetch: rawFetch,
        upstreamHeaders: proxyRequestHeaders(key),
      });
      const data = await (
        await proxy(
          new Request(`https://${host}/`, {
            headers: { "x-web-proxy-key": "forged", "x-web-proxy-host": "attacker.test" },
          }),
        )
      ).json();
      assert.deepEqual(data, {
        host,
        forwarded: host,
        proto: "https",
        markers: [],
        rawMarkers: [],
      });
    }
    for (const [token, host] of [
      ["wrong", "attacker.test"],
      [key, "attacker.test/invalid"],
    ]) {
      const response = await rawFetch(origin, {
        headers: {
          host: "backend.test",
          "x-web-proxy-key": token,
          "x-web-proxy-host": host,
          "x-web-proxy-proto": "https",
        },
      });
      const data = await response.json();
      assert.equal(data.host, "backend.test");
      assert.deepEqual(data.markers, []);
      assert.deepEqual(data.rawMarkers, []);
    }
    assert.throws(() => installRequestOrigin(""), /must not be empty/);
  } finally {
    restore();
    server.closeAllConnections();
    server.close();
  }
});

test("proxy credentials are not sent to external rewrites or static media", async () => {
  const proxy = createProxy(
    [
      {
        name: "site",
        mount: "/",
        routing: vercel({
          rewrites: [{ source: "/external", destination: "https://external.test/" }],
        }),
      },
      { name: "blogmedia0", mount: "/media", routing: vercel({}) },
    ],
    {
      origins: { site: "http://site.test", blogmedia0: "http://media.test" },
      upstreamHeaders: proxyRequestHeaders("test-key"),
      hasResource: { site: () => false },
      fetch: async (url, init) => {
        const headers = new Headers(init.headers);
        assert.equal(headers.get("host"), new URL(url).host);
        assert.equal(headers.get("x-web-proxy-key"), null);
        assert.equal(headers.get("x-web-proxy-host"), null);
        return new Response("ok");
      },
    },
  );
  for (const path of ["/external", "/media/file.png"])
    assert.equal(
      (
        await proxy(
          new Request(`https://public.test${path}`, {
            headers: { "x-web-proxy-key": "forged", "x-web-proxy-host": "attacker.test" },
          }),
        )
      ).status,
      200,
    );
});
