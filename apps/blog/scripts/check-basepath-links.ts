/**
 * Guards against re-introducing a doubled basePath in blog links.
 *
 * The blog app runs with `basePath: "/blog"`. next/link prepends that itself,
 * so `<Link href={withBlogBasePath("/series/x")}>` renders
 * /blog/blog/series/x — a 404 that nothing else in the build catches.
 * `withBlogBasePath` is still correct for canonical URLs, OpenGraph URLs,
 * sitemap entries and image `src`, which are consumed as absolute paths and
 * never go through next/link, so this checks the pairing rather than the
 * helper.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const SRC = path.join(import.meta.dirname, "..", "src");

/** `href={withBlogBasePath(...)}` or `href={`${withBlogBasePath(...)}`}` on a Link. */
const DOUBLED = /href=\{\s*(?:`\$\{)?\s*withBlogBasePath\s*\(/g;

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let errors = 0;
for (const file of await walk(SRC)) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(DOUBLED)) {
    const line = text.slice(0, match.index).split("\n").length;
    console.error(
      `${path.relative(path.join(SRC, ".."), file)}:${line}: href={withBlogBasePath(...)} — next/link adds the basePath itself, so this renders /blog/blog/... Pass the path without the prefix.`,
    );
    errors += 1;
  }
}

if (errors > 0) {
  console.error(`------\n${errors} doubled basePath link(s)`);
  process.exit(1);
}
console.log(`No doubled basePath links (${(await walk(SRC)).length} files checked)`);
