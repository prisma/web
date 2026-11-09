import service from "./service.ts";
import { createProxy, bunFetch } from "@prisma/proxy";
import { agentFrontMiddleware } from "./agent-front.ts";
import { gatewaySites } from "./config.ts";
import { proxyRequestHeaders } from "../request-origin.ts";
import { withGatewayTiming } from "./timing.ts";
import { withOriginCache } from "./cache.ts";
import { readFileSync } from "node:fs";
import type { PublicFile } from "./file-validators.ts";
import { createHttpServer } from "@prisma/proxy/node";
import { withRetainedStatic } from "./retained-static.ts";
import type { StaticAssets } from "../static-assets.ts";
import { fileURLToPath } from "node:url";

const { agentFront, proxyKey } = service.input();
const origins = Object.fromEntries(
  Object.entries(service.load()).map(([name, client]) => [name, client.url]),
);
const middleware = agentFrontMiddleware(agentFront);
const retained = JSON.parse(
  readFileSync(new URL("./retained-assets.json", import.meta.url), "utf8"),
) as StaticAssets;
const proxy = createProxy(gatewaySites(), {
  origins,
  fetch: bunFetch,
  upstreamHeaders: proxyRequestHeaders(proxyKey.expose()),
  trustForwardedProto: true,
  middleware: middleware ? { site: middleware } : {},
  onError: (_error, site) => console.error(`Composer proxy failed: ${site}`),
  onDiagnostic: ({ site, message }) => console.warn(`[${site}] ${message}`),
});

createHttpServer(
  withOriginCache(
    withRetainedStatic(
      withGatewayTiming((request) =>
        new URL(request.url).pathname === "/_composer/health" ? new Response("ok") : proxy(request),
      ),
      retained,
      fileURLToPath(new URL("./static/", import.meta.url)),
    ),
    new Map(
      Object.entries(
        JSON.parse(
          readFileSync(new URL("./public-assets.json", import.meta.url), "utf8"),
        ) as Record<string, PublicFile>,
      ),
    ),
    { blogStaleSeconds: retained.blogStaleSeconds, release: retained.release },
  ),
).listen(service.port(), "0.0.0.0");
