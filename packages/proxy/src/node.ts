import http from "node:http";
import https from "node:https";
import { Readable } from "node:stream";
import type { ProxyFetch } from "./types.ts";

/** Node's native fetch decompresses bodies while retaining compression headers. */
export const rawFetch: ProxyFetch = (input, init) =>
  new Promise((resolve, reject) => {
    const url = new URL(input),
      headers: Record<string, string> = {};
    new Headers(init.headers).forEach((value, key) => {
      headers[key] = value;
    });
    const request = (url.protocol === "https:" ? https : http).request(
      url,
      {
        method: init.method,
        headers,
        signal: init.signal ?? undefined,
      },
      (incoming) => {
        const outgoing = new Headers();
        for (let i = 0; i < incoming.rawHeaders.length; i += 2)
          outgoing.append(incoming.rawHeaders[i], incoming.rawHeaders[i + 1]);
        const status = incoming.statusCode ?? 502;
        const empty = init.method === "HEAD" || [204, 205, 304].includes(status);
        if (empty) incoming.resume();
        resolve(
          new Response(empty ? null : (Readable.toWeb(incoming) as ReadableStream<Uint8Array>), {
            status,
            headers: outgoing,
          }),
        );
      },
    );
    request.on("error", reject);
    if (init.body instanceof ReadableStream) {
      const body = Readable.fromWeb(init.body as import("node:stream/web").ReadableStream);
      body.on("error", (error) => request.destroy(error));
      body.pipe(request);
      request.on("close", () => body.destroy());
    } else if (init.body != null) {
      void new Response(init.body)
        .arrayBuffer()
        .then((body) => request.end(Buffer.from(body)), reject);
    } else request.end();
  });
