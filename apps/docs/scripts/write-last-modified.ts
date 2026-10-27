import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectLastModified, type HistorySource, MANIFEST_FILE } from "../src/lib/last-modified";

// Runs before `next build` (see the `build` and `build:composer` scripts):
// reads each docs page's last-change date from git once and writes
// cache/last-modified.json, which source.config.ts reads while MDX compiles.
// Never fails the build: a page without a known date gets none.

const SOURCES: Record<HistorySource, string> = {
  local: "the local git history",
  fetched: "git history fetched for this commit",
  shallow: "a shallow git history (pages last changed before it have no date)",
  none: "no git history",
};

const appDir = process.cwd();
const started = Date.now();
const { fetchError, ...manifest } = collectLastModified({ appDir, fetchHistory: true });
const target = path.join(appDir, MANIFEST_FILE);

await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const count = Object.keys(manifest.files).length;
console.log(
  `Wrote ${MANIFEST_FILE}: ${count} page dates from ${SOURCES[manifest.history]}` +
    `${manifest.commit ? ` at ${manifest.commit.slice(0, 12)}` : ""} in ${Date.now() - started} ms` +
    // Network, credential and missing-variable failures otherwise look alike.
    `${fetchError ? ` (history fetch failed: ${fetchError})` : ""}`,
);
if (count === 0) {
  console.warn("No page has a known last-change date; pages will be built without one.");
}
