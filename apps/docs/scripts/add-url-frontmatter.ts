/**
 * Adds a `url` field to the frontmatter of all MDX files under a docs directory.
 * The URL is derived from the file path relative to the docs folder root.
 * The `(index)` folder is treated as the root (i.e. its path segment is omitted).
 *
 * Usage:
 *   tsx scripts/add-url-frontmatter.ts                    # content/docs, base /
 *   tsx scripts/add-url-frontmatter.ts content/docs/orm/v6 /orm/v6  # versioned ORM docs, base /orm/v6
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const [dirArg, baseArg] = process.argv.slice(2);
const DOCS_DIR = path.join(process.cwd(), dirArg ?? "content/docs");
const URL_BASE = (baseArg ?? "").replace(/\/$/, "") || ""; // "" for /, "/v6" for /v6

function getUrlFromRelativePath(relativePath: string): string {
  // Use forward slashes for URL path
  let urlPath = relativePath.replace(/\\/g, "/");
  // Treat (index) as root: remove leading (index)/
  urlPath = urlPath.replace(/^\(index\)\/?/, "");
  // Remove .mdx extension
  urlPath = urlPath.replace(/\.mdx$/, "");
  // If the last segment is "index", use the directory path only
  if (urlPath.endsWith("/index") || urlPath === "index") {
    urlPath = urlPath.replace(/\/index$/, "").replace(/^index$/, "");
  }
  const pathPart = urlPath ? `/${urlPath}` : "";
  return URL_BASE ? `${URL_BASE}${pathPart || ""}` : pathPart || "/";
}

function walkMdxFiles(
  dir: string,
  relativeTo: string,
  files: { absolute: string; relative: string }[] = [],
): { absolute: string; relative: string }[] {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, name.name);
    const relative = path.relative(relativeTo, absolute);
    if (name.isDirectory()) {
      walkMdxFiles(absolute, relativeTo, files);
    } else if (name.name.endsWith(".mdx")) {
      files.push({ absolute, relative });
    }
  }
  return files;
}

const files = walkMdxFiles(DOCS_DIR, DOCS_DIR);

for (const { absolute, relative } of files) {
  const raw = fs.readFileSync(absolute, "utf-8");
  const { data, content } = matter(raw);
  const url = getUrlFromRelativePath(relative);

  if (data.url === url) continue;

  data.url = url;
  const updated = matter.stringify(content, data, {
    lineWidth: -1,
  } as Parameters<typeof matter.stringify>[2]);
  fs.writeFileSync(absolute, updated, "utf-8");
  console.log(`${relative} -> url: ${url}`);
}

console.log(`Done. Updated ${files.length} MDX files.`);
