import { Server, type IncomingMessage } from "node:http";
import { timingSafeEqual } from "node:crypto";
import type { ProxyOptions } from "@prisma/proxy";

const keyHeader = "x-web-proxy-key";
const hostHeader = "x-web-proxy-host";
const protoHeader = "x-web-proxy-proto";
const websites = new Set(["site", "docs", "blog", "handbook", "eclipse"]);

export function proxyRequestHeaders(key: string): NonNullable<ProxyOptions["upstreamHeaders"]> {
  if (!key) throw new Error("The internal web proxy key must not be empty");
  return ({ site, publicUrl, headers }) => {
    for (const name of [keyHeader, hostHeader, protoHeader]) headers.delete(name);
    return site && websites.has(site.name)
      ? {
          [keyHeader]: key,
          [hostHeader]: publicUrl.host,
          [protoHeader]: publicUrl.protocol.slice(0, -1),
        }
      : undefined;
  };
}

// Compute ingress needs the upstream HTTP Host. Restore the public host only
// inside this Next process, after ingress has routed the authenticated hop.
export function installRequestOrigin(key: string) {
  if (!key) throw new Error("The internal web proxy key must not be empty");
  const expected = Buffer.from(key);
  const original = Server.prototype.emit;
  function emit(this: Server, event: string | symbol, ...args: unknown[]) {
    if (event === "request") {
      const request = args[0] as IncomingMessage;
      const token = request.headers[keyHeader];
      const host = request.headers[hostHeader];
      const proto = request.headers[protoHeader];
      const supplied = typeof token === "string" ? Buffer.from(token) : undefined;
      if (
        supplied?.length === expected.length &&
        timingSafeEqual(supplied, expected) &&
        typeof host === "string" &&
        (proto === "https" || proto === "http")
      ) {
        try {
          const url = new URL(`${proto}://${host}/`);
          if (url.host === host && !url.username && !url.password && url.pathname === "/") {
            request.headers.host = host;
            request.headers["x-forwarded-host"] = host;
            request.headers["x-forwarded-proto"] = proto;
          }
        } catch {
          /* Leave the original host intact for malformed markers. */
        }
      }
      for (const name of [keyHeader, hostHeader, protoHeader]) delete request.headers[name];
      // Next and other request consumers can inspect either header representation.
      for (let index = request.rawHeaders.length - 2; index >= 0; index -= 2) {
        const name = request.rawHeaders[index].toLowerCase();
        if ([keyHeader, hostHeader, protoHeader].includes(name))
          request.rawHeaders.splice(index, 2);
        else if (
          ["host", "x-forwarded-host", "x-forwarded-proto"].includes(name) &&
          typeof request.headers[name] === "string"
        )
          request.rawHeaders[index + 1] = request.headers[name];
      }
    }
    return original.call(this, event, ...args);
  }
  Server.prototype.emit = emit;
  return () => {
    if (Server.prototype.emit === emit) Server.prototype.emit = original;
  };
}
