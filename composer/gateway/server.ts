import service from "./service.ts";
import { createGateway } from "./proxy.ts";
import { readFileSync } from "node:fs";

// Preserve the site's redirects for legacy /blog and /docs URLs before
// dispatch. The build generates this file from Next's own routes manifest.
const redirects = JSON.parse(readFileSync(new URL("./redirects.json", import.meta.url), "utf8"));

Bun.serve({
  port: service.port(),
  hostname: "0.0.0.0",
  // Stream request and response bodies; never buffer the blog's media files.
  fetch: createGateway(service.input(), fetch, redirects),
});
