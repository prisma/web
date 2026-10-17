import { fileURLToPath } from "node:url";

export const composerBuild = process.env.COMPOSER_BUILD === "1";

// Opt-in only: Vercel retains each app's existing output and routing.
export const composerNextConfig = composerBuild
  ? {
      output: "standalone",
      env: { COMPOSER_BUILD: "1" },
      outputFileTracingRoot: fileURLToPath(new URL("../", import.meta.url)),
      experimental: { cpus: 1 },
    }
  : {};
