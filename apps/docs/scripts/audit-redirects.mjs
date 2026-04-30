import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cwd = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(cwd, "..");
const broadDestinations = new Set([
  "/docs",
  "/docs/orm",
  "/docs/orm/reference/supported-databases",
  "/docs/orm/prisma-client/queries/crud",
  "/docs/orm/prisma-client/setup-and-configuration/introduction",
]);

function normalizeRoute(route) {
  const cleanRoute = route.split(/[?#]/, 1)[0];

  if (cleanRoute.length > 1 && cleanRoute.endsWith("/")) return cleanRoute.slice(0, -1);
  return cleanRoute;
}

function toDocsRoute(url) {
  const normalized = normalizeRoute(url);
  if (normalized === "/") return "/docs";
  return `/docs${normalized}`;
}

function hasPattern(route) {
  return route.includes(":") || route.includes("*");
}

function segmentCount(route) {
  return route.split("/").filter(Boolean).length;
}

function shouldWarnForBroadRedirect(source, destination) {
  if (hasPattern(source)) return false;
  if (broadDestinations.has(destination)) return true;

  const sourceDepth = segmentCount(source);
  const destinationDepth = segmentCount(destination);

  return sourceDepth >= 4 && destinationDepth + 1 < sourceDepth;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractFrontmatterUrl(raw) {
  if (!raw.startsWith("---\n")) return null;

  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) return null;

  const frontmatter = raw.slice(4, end);
  const match = frontmatter.match(/^url:\s*(.+)$/m);
  if (!match) return null;

  const value = match[1].trim();

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

async function collectDocsRoutes() {
  const roots = [
    path.join(docsRoot, "content", "docs"),
    path.join(docsRoot, "content", "docs.v6"),
  ];

  const routes = new Set();
  const extraRoutes = new Set([
    "/docs/llms-full.txt",
    "/docs/llms-full-v6.txt",
  ]);

  for (const root of roots) {
    const files = await walk(root);

    for (const file of files) {
      const raw = await readFile(file, "utf8");
      const url = extractFrontmatterUrl(raw);
      if (!url) continue;

      routes.add(toDocsRoute(url));
    }
  }

  for (const route of extraRoutes) {
    routes.add(route);
  }

  return routes;
}

async function main() {
  const strict = process.argv.includes("--strict");
  const routes = await collectDocsRoutes();
  const vercelConfig = JSON.parse(
    await readFile(path.join(docsRoot, "vercel.json"), "utf8"),
  );

  const missing = [];
  const broad = [];

  for (const rule of vercelConfig.redirects) {
    if (!rule.source.startsWith("/docs") || !rule.destination.startsWith("/docs")) continue;
    if (hasPattern(rule.destination)) continue;

    const destination = normalizeRoute(rule.destination);

    if (!routes.has(destination)) {
      missing.push(`${rule.source} -> ${destination}`);
      continue;
    }

    if (shouldWarnForBroadRedirect(rule.source, destination)) {
      broad.push(`${rule.source} -> ${destination}`);
    }
  }

  console.log(`Checked ${vercelConfig.redirects.length} redirects against ${routes.size} docs routes.`);

  if (missing.length > 0) {
    console.log("\nMissing redirect destinations:");
    for (const entry of missing) console.log(`- ${entry}`);
  }

  if (broad.length > 0) {
    console.log("\nBroad redirects to review:");
    for (const entry of broad) console.log(`- ${entry}`);
  }

  if (strict && missing.length > 0) {
    process.exitCode = 1;
  }
}

await main();
