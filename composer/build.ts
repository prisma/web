import "./env.ts";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { publicAssetInventory } from "./public-assets.ts";
import { websiteBuild } from "./website-build.ts";
import { checkBudget } from "./budget.ts";
import { prepareRetainedAssets } from "./retained-assets.ts";
import path from "node:path";

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
const gateway = new URL("../dist/composer/gateway/", import.meta.url);
await rm(gateway, { recursive: true, force: true });
await mkdir(gateway, { recursive: true });
const retain = process.env.WEB_RETAIN_ASSETS === "1";
let previousOrigin: string | undefined;
if (retain) {
  const branch =
    process.env.GITHUB_HEAD_REF ||
    process.env.GITHUB_REF_NAME ||
    spawnSync("git", ["branch", "--show-current"], { cwd: root, encoding: "utf8" }).stdout?.trim();
  if (!branch) throw new Error("Cannot determine the deployment branch for static retention");
  const result = spawnSync(
    path.join(root, "node_modules/.bin/prisma"),
    ["service", "list", "--project", "web", "--branch", branch, "--json"],
    { cwd: root, encoding: "utf8" },
  );
  if (result.error || result.status !== 0)
    throw new Error("Cannot inspect the existing gateway for static retention");
  const envelope = JSON.parse(result.stdout).envelope;
  if (!envelope.ok || !Array.isArray(envelope.result?.services))
    throw new Error("Invalid service inventory for static retention");
  previousOrigin = envelope.result.services.find(
    (service: { name: string }) => service.name === "gateway",
  )?.liveUrl;
  if (
    previousOrigin &&
    (new URL(previousOrigin).protocol !== "https:" ||
      !new URL(previousOrigin).hostname.endsWith(".prisma.build"))
  )
    throw new Error("Unexpected previous gateway address");
}
await prepareRetainedAssets({
  root,
  gateway: fileURLToPath(gateway),
  previousOrigin,
  enabled: retain,
});
await writeFile(
  new URL("public-assets.json", gateway),
  JSON.stringify(await publicAssetInventory(root, names)),
);
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
await checkBudget(fileURLToPath(gateway), "gateway");

// Measure the real assembler's output, including repaired pnpm dependencies
// and public/static assets. The same check runs again in dev/deploy assembly.
for (const name of names) {
  const { default: service } = await import(`./${name}.ts`);
  await websiteBuild().nodes.nextjs.assemble({ cwd: root, address: name, build: service.build });
}
