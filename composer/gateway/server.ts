import service from "./service.ts";
import { createProxy, bunFetch } from "@prisma/proxy";
import { agentFrontMiddleware } from "./agent-front.ts";
import { gatewaySites } from "./config.ts";
import { proxyRequestHeaders } from "../request-origin.ts";
import { withGatewayTiming } from "./timing.ts";
import { withOriginCache } from "./cache.ts";
import { withRobotsDirectives } from "./robots.ts";
import { readFileSync } from "node:fs";
import type { PublicFile } from "./file-validators.ts";
import { createHttpServer } from "@prisma/proxy/node";
import { withRetainedStatic } from "./retained-static.ts";
import { withExternalDocuments } from "./external-documents.ts";
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
const inventory = new Map<string, PublicFile>(
  Object.entries(
    JSON.parse(readFileSync(new URL("./public-assets.json", import.meta.url), "utf8")) as Record<
      string,
      PublicFile
    >,
  ),
);
for (const [path, file] of Object.entries(retained.assets)) {
  inventory.set(path, file);
  inventory.set(
    path
      .replace(/^\/site-static\/_next\//, "/_next/")
      .replace(/^\/(docs|blog|handbook|eclipse)-static\/_next\//, "/$1/_next/"),
    file,
  );
}
const proxy = createProxy(gatewaySites(), {
  origins,
  fetch: bunFetch,
  upstreamHeaders: proxyRequestHeaders(proxyKey.expose()),
  trustForwardedProto: true,
  middleware: middleware ? { site: middleware } : {},
  onError: (_error, site) => console.error(`Composer proxy failed: ${site}`),
  onDiagnostic: ({ site, message }) => console.warn(`[${site}] ${message}`),
});

const indexableProxy = withRobotsDirectives(proxy);

createHttpServer(
  withOriginCache(
    withRetainedStatic(
      withExternalDocuments(
        withGatewayTiming((request) =>
          new URL(request.url).pathname === "/_composer/health"
            ? new Response("ok")
            : indexableProxy(request),
        ),
      ),
      retained,
      fileURLToPath(new URL("./static/", import.meta.url)),
    ),
    inventory,
    { blogStaleSeconds: retained.blogStaleSeconds, release: retained.release },
  ),
).listen(service.port(), "0.0.0.0");
