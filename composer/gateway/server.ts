import service from "./service.ts";
import { createProxy, bunFetch } from "@prisma/proxy";
import { agentFrontMiddleware } from "./agent-front.ts";
import { gatewaySites } from "./config.ts";
import { proxyRequestHeaders } from "../request-origin.ts";
import { withOriginCache } from "./cache.ts";

const { agentFront, proxyKey } = service.input();
const origins = Object.fromEntries(
  Object.entries(service.load()).map(([name, client]) => [name, client.url]),
);
const middleware = agentFrontMiddleware(agentFront);
const proxy = createProxy(gatewaySites(), {
  origins,
  fetch: bunFetch,
  upstreamHeaders: proxyRequestHeaders(proxyKey.expose()),
  trustForwardedProto: true,
  middleware: middleware ? { site: middleware } : {},
  onError: (_error, site) => console.error(`Composer proxy failed: ${site}`),
  onDiagnostic: ({ site, message }) => console.warn(`[${site}] ${message}`),
});

Bun.serve({
  port: service.port(),
  hostname: "0.0.0.0",
  fetch: withOriginCache((request) =>
    new URL(request.url).pathname === "/_composer/health" ? new Response("ok") : proxy(request),
  ),
});
