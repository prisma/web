import "./env.ts";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { websiteBuild, gatewayBuild } from "./website-build.ts";
import { checkBudget } from "./budget.ts";
import { buildBlogMedia } from "./media/build.ts";
import { blogMedia } from "./media/services.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const names = ["site", "docs", "blog", "handbook", "eclipse"];
const env = { ...process.env, COMPOSER_BUILD: "1" };
function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { cwd: root, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Builders run on the developer/CI machine, not inside the 1 GB runtime.
// Serialize the five Next builds and their workers to bound build memory too.
run("pnpm", ["--filter", "@prisma/proxy", "build"]);
run("pnpm", [
  "turbo",
  "run",
  "build:composer",
  "--concurrency=1",
  ...names.map((name) => `--filter=${name}`),
]);
const media = await buildBlogMedia();
const gateway = new URL("../dist/composer/gateway/", import.meta.url);
await rm(gateway, { recursive: true, force: true });
await mkdir(gateway, { recursive: true });
run("bun", [
  "build",
  "composer/gateway/server.ts",
  "--target=bun",
  "--outfile=dist/composer/gateway/server.mjs",
]);

// Ship original inputs; the gateway reads and compiles them in memory at boot.
for (const name of ["site", "docs"]) {
  await mkdir(new URL(`sites/${name}/`, gateway), { recursive: true });
  await copyFile(
    new URL(`../apps/${name}/vercel.json`, import.meta.url),
    new URL(`sites/${name}/vercel.json`, gateway),
  );
}
await copyFile(
  new URL("../apps/site/.next/routes-manifest.json", import.meta.url),
  new URL("sites/site/routes-manifest.json", gateway),
);
await mkdir(new URL("sites/blog/", gateway), { recursive: true });
await copyFile(
  new URL("../apps/blog/.next/routes-manifest.json", import.meta.url),
  new URL("sites/blog/routes-manifest.json", gateway),
);
await writeFile(new URL("sites/blog/media.json", gateway), JSON.stringify(media));
await checkBudget(fileURLToPath(gateway), "gateway");

// Measure the real assembler's output, including repaired pnpm dependencies
// and public/static assets. The same check runs again in dev/deploy assembly.
for (const name of names) {
  const { default: service } = await import(`./${name}.ts`);
  await websiteBuild().nodes.nextjs.assemble({ cwd: root, address: name, build: service.build });
}
for (const service of blogMedia) {
  await gatewayBuild().nodes.node.assemble({
    cwd: root,
    address: service.name,
    build: service.build,
  });
}
