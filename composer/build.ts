import "./env.ts";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { websiteBuild } from "./website-build.ts";

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
run("pnpm", [
  "turbo",
  "run",
  "build:composer",
  "--concurrency=1",
  ...names.map((name) => `--filter=${name}`),
]);
await mkdir(new URL("../dist/composer/gateway/", import.meta.url), { recursive: true });
run("bun", [
  "build",
  "composer/gateway/server.ts",
  "--target=bun",
  "--outfile=dist/composer/gateway/server.mjs",
]);

const manifest = JSON.parse(
  await readFile(new URL("../apps/site/.next/routes-manifest.json", import.meta.url), "utf8"),
);
await writeFile(
  new URL("../dist/composer/gateway/redirects.json", import.meta.url),
  JSON.stringify(manifest.redirects),
);

// Measure the real assembler's output, including repaired pnpm dependencies
// and public/static assets. The same check runs again in dev/deploy assembly.
for (const name of names) {
  const { default: service } = await import(`./${name}.ts`);
  await websiteBuild().nodes.nextjs.assemble({ cwd: root, address: name, build: service.build });
}
