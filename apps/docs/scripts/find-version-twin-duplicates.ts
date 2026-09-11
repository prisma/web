/**
 * Reports ORM v6 pages whose body is materially identical to their v7 twin.
 *
 * "Materially identical" means the bodies match once frontmatter is stripped and
 * `/orm/v6/` links are rewritten to `/orm/v7/` — the pages differ only in which
 * version tree they link into, so the two URLs are the same document and the v6
 * copy should carry `canonical: /orm/v7/...` in its frontmatter.
 *
 *   pnpm tsx ./scripts/find-version-twin-duplicates.ts [--check]
 *
 * `--check` exits non-zero when the canonicals in the content no longer match
 * what the comparison finds: a v6 page that became identical to its twin and
 * has no canonical, or one that declares a canonical after the pages diverged.
 */
import { existsSync, globSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content/docs");

function splitFrontmatter(source: string) {
  if (!source.startsWith("---")) return { frontmatter: "", body: source };
  const end = source.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: "", body: source };
  return { frontmatter: source.slice(4, end), body: source.slice(end + 4) };
}

function getCanonical(frontmatter: string) {
  const match = frontmatter.match(/^canonical:\s*(.+)$/m);
  return match ? match[1].trim().replace(/^["'](.*)["']$/, "$1") : undefined;
}

interface Pair {
  v6: string;
  v7: string;
  canonicalTarget: string;
  identical: boolean;
  canonical?: string;
}

function comparePairs(): Pair[] {
  const pairs: Pair[] = [];

  for (const relative of globSync("orm/v6/**/*.mdx", { cwd: CONTENT_ROOT }).sort()) {
    const twin = relative.replace("orm/v6/", "orm/v7/");
    if (!existsSync(path.join(CONTENT_ROOT, twin))) continue;

    const v6 = splitFrontmatter(readFileSync(path.join(CONTENT_ROOT, relative), "utf8"));
    const v7 = splitFrontmatter(readFileSync(path.join(CONTENT_ROOT, twin), "utf8"));
    const normalized = v6.body.replaceAll("/orm/v6/", "/orm/v7/").trim();

    pairs.push({
      v6: relative,
      v7: twin,
      canonicalTarget: `/${twin.replace(/\.mdx$/, "")}`,
      identical: normalized === v7.body.trim(),
      canonical: getCanonical(v6.frontmatter),
    });
  }

  return pairs;
}

function main() {
  const check = process.argv.includes("--check");
  const pairs = comparePairs();
  const identical = pairs.filter((pair) => pair.identical);
  const missing = identical.filter((pair) => pair.canonical !== pair.canonicalTarget);
  const stale = pairs.filter((pair) => !pair.identical && pair.canonical !== undefined);

  console.log(`Compared ${pairs.length} v6 pages that have a v7 twin.`);
  console.log(`Materially identical: ${identical.length}`);
  for (const pair of identical) {
    console.log(
      `  ${pair.v6} -> ${pair.canonicalTarget}${pair.canonical ? "" : "  (no canonical)"}`,
    );
  }

  if (missing.length > 0) {
    console.log(`\nMissing or wrong canonical (${missing.length}):`);
    for (const pair of missing)
      console.log(`  ${pair.v6}: expected canonical: ${pair.canonicalTarget}`);
  }

  if (stale.length > 0) {
    console.log(`\nCanonical set but the pages have diverged (${stale.length}):`);
    for (const pair of stale) console.log(`  ${pair.v6} -> ${pair.canonical}`);
  }

  if (check && (missing.length > 0 || stale.length > 0)) process.exit(1);
}

main();
