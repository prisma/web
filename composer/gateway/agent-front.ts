import { NextRequest } from "next/server.js";
import type { Middleware } from "@prisma/proxy";

type Setting = string | { expose(): string } | undefined;
export type AgentFrontSettings = Record<string, Setting>;
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

/** Preserve the site's global Agent Front middleware on requests dispatched to child sites. */
export function agentFrontMiddleware(settings?: AgentFrontSettings): Middleware | undefined {
  if (!settings) return;
  for (const name of names) {
    const value = settings[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = typeof value === "string" ? value : value.expose();
  }
  let handler: Promise<typeof import("../../apps/site/src/agent-front.ts")> | undefined;
  return async ({ request, url, site, target, waitUntil }) => {
    // Root requests already run this middleware in Next. Match the site's
    // proxy exclusions so child requests are observed once, assets/RSC never.
    if (
      site.name === target.name ||
      request.headers.has("rsc") ||
      /^\/(?:_next\/(?:static|image)|site-static|docs-static|blog-static)/i.test(url.pathname) ||
      /\.(?:js|mjs|css|map|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|otf|eot|mp4|webm|mp3|wav)$/i.test(
        url.pathname,
      )
    )
      return;
    handler ??= import("../../apps/site/src/agent-front.ts");
    const { handleAgentFront } = await handler;
    // Agent Front reads metadata only; leave the streaming body with the proxy.
    const headers = new Headers(request.headers);
    headers.set("host", url.host);
    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", url.protocol.slice(0, -1));
    const incoming = new NextRequest(url, { method: request.method, headers });
    return handleAgentFront(incoming, { waitUntil } as Parameters<typeof handleAgentFront>[1]);
  };
}
