import { type FileObject, printErrors, scanURLs, validateFiles } from "next-validate-link";
import type { InferPageType } from "fumadocs-core/source";

import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { register } from "node:module";
register("fumadocs-mdx/node/loader", import.meta.url);

const { source } = await import("@/lib/source");

const pages = source.getPages().map((page) => {
  return {
    value: { slug: page.slugs },
    hashes: getHeadings(page),
  };
});

// const ormLatestAliasPages = source
//   .getPages()
//   .filter((page) => page.slugs[0] === 'orm' && page.slugs[1] === 'latest')
//   .map((page) => {
//     const aliasSlug = ['orm', ...page.slugs.slice(2)];
//     return {
//       value: { slug: aliasSlug.length > 1 ? aliasSlug : ['orm'] },
//       hashes: getHeadings(page),
//     };
//   });
//
// const ormV6AliasPages = source
//   .getPages()
//   .filter((page) => page.slugs[0] === 'orm' && page.slugs[1] === 'v6')
//   .map((page) => {
//     const aliasSlug = ['orm', ...page.slugs.slice(2)];
//     return {
//       value: { slug: aliasSlug.length > 1 ? aliasSlug : ['orm'] },
//       hashes: getHeadings(page),
//     };
//   });

console.log(`Found ${pages.length} current files`);

async function checkLinks() {
  const scanned = await scanURLs({
    preset: "next",
    populate: {
      "(docs)/(default)/[[...slug]]": [...pages],
    },
  });

  const files = await getFiles();

  // next-validate-link resolves `#fragment` only on links that carry a path,
  // so a same-page bookmark left behind by a renamed heading passes silently
  // (audit finding 3.4). Check those ourselves before handing over.
  const samePageErrors = checkSamePageFragments();

  printErrors(
    await validateFiles(files, {
      scanned,
      markdown: {
        components: {
          Card: { attributes: ["href"] },
          Cards: { attributes: ["href"] },
        },
      },
      checkRelativePaths: "as-url",
    }),
    samePageErrors.length === 0,
  );

  if (samePageErrors.length > 0) {
    console.error(
      `\nInvalid same-page fragments (${samePageErrors.length}); the heading they point at no longer exists:`,
    );
    for (const error of samePageErrors) {
      console.error(`${error.file}:${error.line} -> #${error.fragment}`);
    }
    process.exit(1);
  }
}

interface FragmentError {
  file: string;
  line: number;
  fragment: string;
}

/**
 * GitHub-flavoured heading slug, close enough to the ids fumadocs generates.
 * Only ever used to *widen* the set of accepted anchors (headings nested in MDX
 * components never reach the table of contents), so a slug that differs in an
 * edge case costs a missed report, never a false failure.
 */
function slugify(heading: string) {
  return heading
    .replace(/`/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function blankCodeBlocks(content: string) {
  // Keep line numbers intact: replace code with blank lines rather than dropping it.
  let inFence = false;
  return content
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return "";
      }
      if (inFence) return "";
      return line.replace(/`[^`]*`/g, "");
    })
    .join("\n");
}

function getAnchors(content: string, tocHashes: string[]) {
  const anchors = new Set(tocHashes);

  for (const match of content.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
    const heading = match[1];
    const explicit = heading.match(/\[#([^\]\s]+)\]\s*$/);
    anchors.add(explicit ? explicit[1] : slugify(heading));
  }

  // Anchors that are not headings: `id="..."` on JSX/HTML elements.
  for (const match of content.matchAll(/\bid=["']([^"']+)["']/g)) {
    anchors.add(match[1]);
  }

  return anchors;
}

function checkSamePageFragments(): FragmentError[] {
  const errors: FragmentError[] = [];

  for (const page of source.getPages()) {
    const raw = readFileSync(page.absolutePath ?? "", "utf8");
    const content = blankCodeBlocks(raw);
    const anchors = getAnchors(content, getHeadings(page));
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      for (const match of line.matchAll(/(?:\]\(|href=["'])#([^)"'\s]+)/g)) {
        const fragment = decodeURIComponent(match[1]);
        if (anchors.has(fragment)) continue;
        errors.push({
          file: relative(process.cwd(), page.absolutePath ?? ""),
          line: index + 1,
          fragment: match[1],
        });
      }
    });
  }

  return errors;
}

function getHeadings({ data }: InferPageType<typeof source>): string[] {
  return data.toc.map((item) => item.url.slice(1));
}

function getFiles() {
  console.log("Validating Files");

  const docsPages = source.getPages().map(
    async (page): Promise<FileObject> => ({
      path: page.absolutePath ?? "",
      content: await page.data.getText("raw"),
      url: page.url,
      data: page.data,
    }),
  );

  return Promise.all(docsPages);
}

void checkLinks();
