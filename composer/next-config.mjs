import { fileURLToPath } from "node:url";

export const composerBuild = process.env.COMPOSER_BUILD === "1";

// These content routes render the repository's public MDX on demand to keep
// their artifacts below Compute's file limit. They are safe to share without
// writing every generated HTML/RSC document into the service's runtime disk.
// Do not use this opt-in on a route that reads user/session/request data.
export const composerPublicDocumentHeaders = composerBuild
  ? [{ key: "X-Composer-Public-Document", value: "1" }]
  : [];

// Opt-in only: Vercel retains each app's existing output and routing.
export const composerNextConfig = composerBuild
  ? {
      output: "standalone",
      env: { COMPOSER_BUILD: "1" },
      outputFileTracingRoot: fileURLToPath(new URL("../", import.meta.url)),
      experimental: { cpus: 1 },
    }
  : {};
