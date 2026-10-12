import { writeFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextjsBuildAdapter } from "@prisma/composer/nextjs";
import { nextjsBuild, assemble, type AssembleInput } from "@prisma/composer/nextjs/control";
import { nodeBuild, assemble as assembleNode } from "@prisma/composer/node/control";
import { checkBudget } from "./budget.ts";

async function removeServerMaps(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await removeServerMaps(file);
    else if (/\.(?:[cm]?js|css)\.map$/.test(entry.name)) await rm(file);
  }
}

// Reuse Composer's Next.js assembler, including monorepo and pnpm link repair.
// Only add an entry that installs the resolved input before Next.js starts.
export function websiteBuild() {
  const extension = nextjsBuild();
  return {
    ...extension,
    nodes: {
      nextjs: {
        kind: "build" as const,
        async assemble(input: AssembleInput) {
          const bundle = await assemble(input);
          // Next traces server maps into standalone; docs alone emits hundreds
          // of MB of them. Build-time Sentry uploads still see the originals.
          await removeServerMaps(path.join(bundle.dir, "bundle"));
          await writeFile(
            path.join(bundle.dir, "bootstrap.mjs"),
            `import { initialize } from './main.mjs';\ninitialize();\nawait import(${JSON.stringify(`./${bundle.entry}`)});\n`,
          );
          await checkBudget(bundle.dir, input.address);
          const build = input.build as NextjsBuildAdapter;
          const appDir = path.resolve(path.dirname(fileURLToPath(build.module)), build.appDir);
          // Next updates BUILD_ID once the whole build is complete. Watching
          // tens of thousands of traced dependencies exhausts local watchers
          // and can restart a server while its build is still being written.
          return {
            ...bundle,
            entry: "bootstrap.mjs",
            watch: [path.join(appDir, ".next", "BUILD_ID")],
          };
        },
      },
    },
  };
}

export function gatewayBuild() {
  const extension = nodeBuild();
  return {
    ...extension,
    nodes: {
      node: {
        kind: "build" as const,
        async assemble(input: AssembleInput) {
          const bundle = await assembleNode(input);
          await checkBudget(bundle.dir, input.address);
          return bundle;
        },
      },
    },
  };
}
