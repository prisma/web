/** Notify IndexNow only about changed, public sitemap URLs after deployment. */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

export const ORIGIN = "https://www.prisma.io";
export const SITEMAPS = {
  site: "/sitemap-site.xml",
  docs: "/docs/sitemap.xml",
  blog: "/blog/sitemap.xml",
};
const KEY_PATH = "apps/site/public/prisma-indexnow.txt";
const hash = (value) => createHash("sha256").update(value).digest("hex");

/** Validate that a URL identifies a canonical public page. */
export function publicUrl(value) {
  const url = new URL(value);
  if (
    url.origin !== ORIGIN ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    /^\/(?:api|cloud|__ora)(?:\/|$)/.test(url.pathname) ||
    /\/(?:api|_next|og)(?:\/|$)/.test(url.pathname) ||
    /\.(?:ico|woff2?|js|css|png|jpg|svg|xml|txt)$/.test(url.pathname)
  ) {
    throw new Error(`Refusing noncanonical or non-page URL: ${value}`);
  }
  return url.href;
}

/** Validate the entire XML document before exposing URLs to change detection. */
export function parseSitemap(xml) {
  let urls;
  try {
    urls = JSON.parse(
      execFileSync("python3", [fileURLToPath(new URL("./indexnow-sitemap.py", import.meta.url))], {
        input: xml,
        encoding: "utf8",
        maxBuffer: 4 * 1024 * 1024,
        stdio: ["pipe", "pipe", "pipe"],
      }),
    );
  } catch (error) {
    throw new Error(`Invalid sitemap XML: ${error.stderr?.toString().trim() || error.message}`);
  }
  return [...new Set(urls.map(publicUrl))].sort();
}

/** Map an MDX source file to its public docs or blog route. */
export function contentPath(file, app) {
  const prefix = `apps/${app}/content/${app === "blog" ? "blog" : "docs"}/`;
  if (app === "site" || !file.startsWith(prefix) || !file.endsWith(".mdx")) return null;
  const parts = file
    .slice(prefix.length, -4)
    .split("/")
    .filter((part) => !/^\(.*\)$/.test(part));
  if (parts.at(-1) === "index") parts.pop();
  return `/${app}/${parts.join("/")}`.replace(/\/$/, "");
}

/** Fingerprint each published page using its content and shared app sources. */
export function manifestFor(app, urls, tree) {
  const appPrefix = `apps/${app}/`;
  const entries = tree.filter(
    ({ file }) =>
      file.startsWith(appPrefix) ||
      file.startsWith("packages/") ||
      [
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
        "turbo.json",
        "vercel.json",
      ].includes(file),
  );
  const shared = hash(
    entries
      .filter(({ file }) => !contentPath(file, app))
      .map(({ file, sha }) => `${file}:${sha}`)
      .sort()
      .join("\n"),
  );
  const all = hash(
    entries
      .map(({ file, sha }) => `${file}:${sha}`)
      .sort()
      .join("\n"),
  );
  const content = new Map(entries.map(({ file, sha }) => [contentPath(file, app), sha]));
  return Object.fromEntries(
    urls.map((url) => {
      const path = new URL(url).pathname;
      // Listings and unrecognised source routes change whenever the app changes.
      return [url, hash(`${shared}:${content.get(path) ?? all}`)];
    }),
  );
}

/** Select changed or removed pages, or all pages for an explicit full sync. */
export function changedUrls(previous, current, full = false) {
  return [...new Set([...Object.keys(previous), ...Object.keys(current)])]
    .filter((url) => full || previous[url] !== current[url])
    .map(publicUrl)
    .sort();
}

/** Fetch a public resource without following redirects. */
async function getText(url, fetcher) {
  const response = await fetcher(url, { redirect: "error", signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`GET ${url}: ${response.status}`);
  return response.text();
}

/** Verify the live public key and submit batches without accepting pending responses. */
export async function submitUrls(urls, key, fetcher = fetch) {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("Invalid IndexNow key");
  const keyLocation = `${ORIGIN}/prisma-indexnow.txt`;
  if ((await getText(keyLocation, fetcher)).trim() !== key)
    throw new Error("Production key file does not match; deploy the site first");
  const validated = urls.map(publicUrl);
  for (let offset = 0; offset < validated.length; offset += 10000) {
    const response = await fetcher("https://api.indexnow.org/indexnow", {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(30000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.prisma.io",
        key,
        keyLocation,
        urlList: validated.slice(offset, offset + 10000),
      }),
    });
    // A 202 is pending key verification: fail without advancing the checkpoint.
    if (response.status !== 200)
      throw new Error(
        `IndexNow returned ${response.status}; checkpoint not saved (202 means key verification pending)`,
      );
  }
}

/** Read the live sitemap, submit changes when requested, then save the checkpoint. */
export async function main() {
  const app = process.argv[2];
  if (!Object.hasOwn(SITEMAPS, app))
    throw new Error("Usage: node scripts/indexnow.mjs <site|docs|blog> [--submit] [--full]");
  const urls = parseSitemap(await getText(ORIGIN + SITEMAPS[app], fetch));
  const tree = execFileSync("git", ["ls-tree", "-rz", "HEAD"], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  })
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const [meta, file] = line.split("\t");
      return { file, sha: meta.split(" ")[2] };
    });
  const current = manifestFor(app, urls, tree);
  const statePath = resolve(".indexnow-state", `${app}.json`);
  const previous = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
  const urlsToSubmit = changedUrls(previous, current, process.argv.includes("--full"));
  console.log(
    `${app}: ${urls.length} sitemap URLs; ${urlsToSubmit.length} added, changed or removed since last successful notification`,
  );
  if (!process.argv.includes("--submit")) {
    console.log("Dry run. No URLs submitted and no checkpoint saved.");
    return;
  }
  if (urlsToSubmit.length) await submitUrls(urlsToSubmit, readFileSync(KEY_PATH, "utf8").trim());
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, JSON.stringify(current, null, 2) + "\n");
  console.log("Notification accepted; this does not guarantee indexing.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
