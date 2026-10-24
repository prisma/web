import { createServer } from "node:http";
import { Readable } from "node:stream";

type Handler = (request: Request) => Response | Promise<Response>;

/** HTTP adapter for Node and Bun, preserving stream lengths and backpressure. */
export function createHttpServer(
  handler: Handler,
  options: { onError?: (error: unknown) => void } = {},
) {
  return createServer(async (incoming, outgoing) => {
    const controller = new AbortController();
    let body: Readable | undefined;
    incoming.once("aborted", () => controller.abort());
    outgoing.once("close", () => {
      if (!outgoing.writableFinished) {
        controller.abort();
        body?.destroy();
      }
    });
    try {
      if (!incoming.url?.startsWith("/")) {
        outgoing.writeHead(400).end();
        return;
      }
      const headers = new Headers();
      for (let i = 0; i < incoming.rawHeaders.length; i += 2) {
        const name = incoming.rawHeaders[i],
          value = incoming.rawHeaders[i + 1];
        if (name.toLowerCase() === "cookie" && headers.has(name))
          headers.set(name, `${headers.get(name)}; ${value}`);
        else headers.append(name, value);
      }
      const method = incoming.method ?? "GET";
      const request = new Request(`http://${incoming.headers.host ?? "localhost"}${incoming.url}`, {
        method,
        headers,
        signal: controller.signal,
        body: ["GET", "HEAD"].includes(method) ? undefined : Readable.toWeb(incoming),
        duplex: "half",
      } as RequestInit);
      const response = await handler(request);
      if (outgoing.destroyed) {
        await response.body?.cancel();
        return;
      }
      const responseHeaders: Record<string, string | string[]> = Object.fromEntries(
        response.headers,
      );
      const cookies = response.headers.getSetCookie();
      if (cookies.length) responseHeaders["set-cookie"] = cookies;
      outgoing.writeHead(response.status, responseHeaders);
      if (!response.body || method === "HEAD" || [204, 205, 304].includes(response.status)) {
        await response.body?.cancel();
        outgoing.end();
        return;
      }
      body = Readable.fromWeb(response.body as import("node:stream/web").ReadableStream);
      body.once("error", (error) => outgoing.destroy(error));
      body.pipe(outgoing);
    } catch (error) {
      options.onError?.(error);
      if (!outgoing.headersSent && !outgoing.destroyed) outgoing.writeHead(502).end("Bad Gateway");
      else outgoing.destroy();
    }
  });
}
