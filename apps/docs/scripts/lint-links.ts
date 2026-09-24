import { type FileObject, printErrors, scanURLs, validateFiles } from "next-validate-link";
import type { InferPageType } from "fumadocs-core/source";

import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { collectPageAnchors, maskCodeRegions } from "./lib/markdown-regions";
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

function checkSamePageFragments(): FragmentError[] {
  const errors: FragmentError[] = [];

  for (const page of source.getPages()) {
    const raw = readFileSync(page.absolutePath ?? "", "utf8");
    const content = maskCodeRegions(raw, { maskHeadings: true });
    // The table of contents carries the ids fumadocs actually renders; the
    // anchors parsed from the file cover headings nested in MDX components,
    // which never reach the toc.
    const anchors = new Set([...getHeadings(page), ...collectPageAnchors(raw).keys()]);
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

  const docsPages = source.getPages().map(async (page): Promise<FileObject> => ({
    path: page.absolutePath ?? "",
    content: await page.data.getText("raw"),
    url: page.url,
    data: page.data,
  }));

  return Promise.all(docsPages);
}

void checkLinks();
