import service from "./service.ts";
import { createGateway } from "./proxy.ts";
import { readFileSync } from "node:fs";

// Preserve site-level rules before zone dispatch. The build generates this
// snapshot from Next's own routes manifest; Next still executes the rewrites.
const routing = JSON.parse(readFileSync(new URL("./routing.json", import.meta.url), "utf8"));

Bun.serve({
  port: service.port(),
  hostname: "0.0.0.0",
  // Stream request and response bodies; never buffer the blog's media files.
  fetch: createGateway(service.input(), fetch, routing.redirects, routing.beforeFiles),
});
