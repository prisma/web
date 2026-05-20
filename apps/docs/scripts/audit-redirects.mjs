import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cwd = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(cwd, "..");
const broadDestinations = new Set([
  "/docs",
  "/docs/orm",
  "/docs/orm/reference/supported-databases",
]);
const acceptableBroadRedirects = new Set([
  "/docs/orm/more/upgrade-guides/upgrading-versions/codemods -> /docs/guides/upgrade-prisma-orm/v7",
  "/docs/orm/accelerate/getting-started/connection-pooler/client-extensions -> /docs/postgres/database/connection-pooling",
]);

function normalizeRoute(route) {
  const cleanRoute = route.split(/[?#]/, 1)[0];

  if (cleanRoute.length > 1 && cleanRoute.endsWith("/")) return cleanRoute.slice(0, -1);
  return cleanRoute;
}

function toDocsRoute(url) {
  const normalized = normalizeRoute(url);
  if (normalized === "/") return "/docs";
  if (normalized === "/orm/latest") return "/docs/orm";
  if (normalized.startsWith("/orm/latest/")) {
    return `/docs${normalized.replace("/orm/latest/", "/orm/")}`;
  }
  return `/docs${normalized}`;
}

function hasPattern(route) {
  return route.includes(":") || route.includes("*");
}

function segmentCount(route) {
  return route.split("/").filter(Boolean).length;
}

function getLastSegment(route) {
  const segments = normalizeRoute(route).split("/").filter(Boolean);
  return segments.at(-1) ?? "";
}

function normalizeComparisonRoute(route) {
  return normalizeRoute(route).replace(/\/page\/\d+$/, "");
}

function getUpgradeGuideVersion(route) {
  const normalized = normalizeRoute(route);
  const destinationMatch = normalized.match(/\/docs\/guides\/upgrade-prisma-orm\/(v\d+)$/);
  if (destinationMatch) return destinationMatch[1];

  if (normalized.includes("prisma-1")) return "v1";
  if (normalized.includes("prisma-3")) return "v3";
  if (normalized.includes("prisma-4")) return "v4";
  if (normalized.includes("prisma-5")) return "v5";
  if (normalized.includes("prisma-6")) return "v6";
  if (normalized.includes("prisma-7") || normalized.endsWith("/upgrading-to-pris")) return "v7";

  return null;
}

function shouldWarnForBroadRedirect(source, destination, rawDestination) {
  if (acceptableBroadRedirects.has(`${source} -> ${destination}`)) return false;
  if (hasPattern(source)) return false;
  if (rawDestination.includes("#")) return false;
  if (broadDestinations.has(destination)) return true;
  if (normalizeComparisonRoute(source) === normalizeComparisonRoute(destination)) return false;

  const sourceUpgradeVersion = getUpgradeGuideVersion(source);
  const destinationUpgradeVersion = getUpgradeGuideVersion(destination);
  if (sourceUpgradeVersion && sourceUpgradeVersion === destinationUpgradeVersion) return false;

  if (getLastSegment(source) === getLastSegment(destination)) return false;

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
  const roots = [path.join(docsRoot, "content", "docs")];

  const routes = new Set();
  const extraRoutes = new Set(["/docs/llms-full.txt"]);

  for (const root of roots) {
    try {
      await access(root);
    } catch {
      continue;
    }

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

    if (shouldWarnForBroadRedirect(rule.source, destination, rule.destination)) {
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
