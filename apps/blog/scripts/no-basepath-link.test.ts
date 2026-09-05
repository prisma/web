/**
 * Guard for audit finding 1.4: `next/link` prepends the app's `basePath`
 * ("/blog") to any root-relative href it is given. Wrapping an href in
 * `withBlogBasePath()` before handing it to `<Link>` therefore emits
 * `/blog/blog/...`, which 404s.
 *
 * Plain `<a>` tags are the opposite case: they are rendered as-is by the
 * browser against www.prisma.io, so they *do* need `withBlogBasePath()`.
 * This check only looks at `<Link>`.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|jsx?|mjs)$/.test(entry)) out.push(full);
  }
  return out;
}

/**
 * Matches `href={withBlogBasePath(` on a `<Link>` element, tolerating the
 * formatting oxfmt produces (attributes on their own lines, comments between
 * the tag name and the attribute).
 */
export function findBasePathLinkViolations(source: string): number[] {
  const violations: number[] = [];
  const linkOpen = /<Link\b/g;
  let match: RegExpExecArray | null;

  while ((match = linkOpen.exec(source)) !== null) {
    // Scan forward to the end of this opening tag, respecting nested braces so
    // an inner `>` (e.g. an arrow function) does not end the tag early.
    let depth = 0;
    let end = match.index;
    for (let i = match.index; i < source.length; i++) {
      const ch = source[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === ">" && depth === 0) {
        end = i;
        break;
      }
      end = i;
    }
    const tag = source.slice(match.index, end + 1);
    if (/href=\{\s*withBlogBasePath\s*\(/.test(tag)) {
      violations.push(source.slice(0, match.index).split("\n").length);
    }
  }

  return violations;
}

test("the violation matcher recognises the shape it is guarding against", () => {
  assert.deepEqual(
    findBasePathLinkViolations(
      '<Link\n  href={withBlogBasePath(`/series/${k}`)}\n  className="x"\n>',
    ),
    [1],
  );
  assert.deepEqual(findBasePathLinkViolations("<Link href={`/series/${k}`}>"), []);
  // A plain anchor legitimately needs the basePath.
  assert.deepEqual(findBasePathLinkViolations("<a href={withBlogBasePath(post.url)}>"), []);
});

test("no <Link> in apps/blog/src wraps its href in withBlogBasePath", () => {
  const offenders: string[] = [];

  for (const file of walk(srcDir)) {
    for (const line of findBasePathLinkViolations(readFileSync(file, "utf8"))) {
      offenders.push(`${path.relative(srcDir, file)}:${line}`);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `next/link already adds the /blog basePath; these produce /blog/blog/...:\n${offenders.join("\n")}`,
  );
});
