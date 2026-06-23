#!/usr/bin/env node
import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, cp, mkdir, readdir, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const pruneCutoffYear = 2024;

const apps = {
  site: {
    appDir: "apps/site",
    filter: "site",
  },
  blog: {
    appDir: "apps/blog",
    filter: "blog",
    prune: pruneBlogContent,
  },
  docs: {
    appDir: "apps/docs",
    filter: "docs",
  },
};

const appName = process.argv[2];
const app = apps[appName];

if (!app) {
  console.error(`Usage: node scripts/compute-build-app.mjs <${Object.keys(apps).join("|")}>`);
  process.exit(1);
}

const appDir = path.join(repoRoot, app.appDir);
const restoreSteps = [];

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function movePath(from, to) {
  await mkdir(path.dirname(to), { recursive: true });
  await rename(from, to);
  restoreSteps.push(async () => {
    if (await exists(to)) {
      await mkdir(path.dirname(from), { recursive: true });
      await rename(to, from);
    }
  });
}

async function restoreMovedPaths() {
  for (const restore of restoreSteps.reverse()) {
    await restore();
  }
}

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
        PRISMA_COMPUTE_DEPLOY: "true",
      },
      stdio: "inherit",
    });

    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with ${signal ?? code}`));
    });
  });
}

async function listDirectories(dir) {
  if (!(await exists(dir))) return [];

  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function blogPostYear(slug) {
  const filePath = path.join(appDir, "content/blog", slug, "index.mdx");
  const contents = await readFile(filePath, "utf8");
  const match = contents.match(/^date:\s*["']?(\d{4})/m);

  if (!match) {
    throw new Error(`Missing date frontmatter in ${path.relative(repoRoot, filePath)}`);
  }

  return Number(match[1]);
}

async function pruneBlogContent() {
  const contentDir = path.join(appDir, "content/blog");
  const publicDir = path.join(appDir, "public");
  const backupRoot = path.join(appDir, `.compute-pruned-${process.pid}`);
  const slugs = await listDirectories(contentDir);
  const oldSlugs = [];

  for (const slug of slugs) {
    if ((await blogPostYear(slug)) < pruneCutoffYear) {
      oldSlugs.push(slug);
    }
  }

  for (const slug of oldSlugs) {
    await movePath(path.join(contentDir, slug), path.join(backupRoot, "content/blog", slug));

    const publicPostDir = path.join(publicDir, slug);
    if (await exists(publicPostDir)) {
      await movePath(publicPostDir, path.join(backupRoot, "public", slug));
    }
  }

  console.log(
    `Pruned ${oldSlugs.length} pre-${pruneCutoffYear} blog post(s) and matching public media director${oldSlugs.length === 1 ? "y" : "ies"} for Compute build`,
  );
}

async function copyIfExists(from, to) {
  if (!(await exists(from))) return;

  await rm(to, { force: true, recursive: true });
  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to, { force: true, recursive: true });
}

async function prepareStandaloneOutput() {
  const standaloneAppDir = path.join(appDir, ".next/standalone", app.appDir);
  await copyIfExists(path.join(appDir, ".next/static"), path.join(standaloneAppDir, ".next/static"));
  await copyIfExists(path.join(appDir, "public"), path.join(standaloneAppDir, "public"));
}

try {
  await rm(path.join(appDir, ".next"), { force: true, recursive: true });
  await rm(path.join(appDir, ".source"), { force: true, recursive: true });

  if (app.prune) await app.prune();

  await run("pnpm", ["turbo", "run", "build", `--filter=${app.filter}...`, "--force"]);
  await prepareStandaloneOutput();
} finally {
  await restoreMovedPaths();
  await rm(path.join(appDir, `.compute-pruned-${process.pid}`), { force: true, recursive: true });
}
