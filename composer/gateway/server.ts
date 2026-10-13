import service from "./service.ts";
import { createProxy, bunFetch, type ProxyPlan } from "@prisma/proxy";
import { agentFrontMiddleware } from "./agent-front.ts";
import { readFileSync } from "node:fs";

const plan: ProxyPlan = JSON.parse(
  readFileSync(new URL("./routing.json", import.meta.url), "utf8"),
);
const { agentFront, ...origins } = service.input();
const middleware = agentFrontMiddleware(agentFront);
const proxy = createProxy(plan, {
  origins,
  fetch: bunFetch,
  trustForwardedProto: true,
  middleware: middleware ? { site: middleware } : {},
  onError: (_error, site) => console.error(`Composer proxy failed: ${site}`),
});

Bun.serve({
  port: service.port(),
  hostname: "0.0.0.0",
  fetch: (request) =>
    new URL(request.url).pathname === "/_composer/health" ? new Response("ok") : proxy(request),
});
