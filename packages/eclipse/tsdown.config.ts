import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/index.ts",
    "src/components/*.tsx",
    "src/components/ui/*.tsx",
  ],
  format: ["esm"],
  dts: true,
  outDir: "dist",
  clean: true,
});
