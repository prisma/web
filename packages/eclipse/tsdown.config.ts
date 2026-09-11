import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/index.ts",
    "src/components/*.tsx",
    "src/components/ui/*.tsx",
    // Its own entry on purpose: `src/index.ts` (server-safe) and the "use client"
    // tabs components both import it. Left to the bundler, the helper gets merged
    // into the shared tabs chunk, that chunk loses its "use client" directive, and
    // `index.mjs` then imports React hooks into a Server Component graph.
    "src/lib/tab-value.ts",
  ],
  format: ["esm"],
  dts: true,
  outDir: "dist",
  clean: true,
});
