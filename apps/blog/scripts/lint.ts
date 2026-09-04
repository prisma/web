import { type FileObject, printErrors, scanURLs, validateFiles } from "next-validate-link";
import type { InferPageType } from "fumadocs-core/source";

import { register } from "node:module";
register("fumadocs-mdx/node/loader", import.meta.url);

const { blog } = await import("@/lib/source");
const blogPages = blog.getPages().map((page) => {
  return {
    value: { slug: page.slugs },
    hashes: getHeadings(page),
  };
});

async function checkLinks() {
  const scanned = await scanURLs({
    preset: "next",
    populate: {
      "(blog)/[slug]": blogPages,
    },
  });

  // Same-page anchors first: `next-validate-link` resolves cross-page
  // fragments (it has the target's heading ids) but has nothing to check a
  // bare `](#foo)` against, so stale anchors inside a post slip through. They
  // are the common rot — a heading gets reworded and every anchor pointing at
  // it dies silently.
  const anchorErrors = await checkSameFileAnchors();

  printErrors(
    await validateFiles(await getFiles(), {
      scanned,
      markdown: {
        components: {
          Card: { attributes: ["href"] },
          Cards: { attributes: ["href"] },
        },
      },
      checkRelativePaths: "as-url",
    }),
    // Let the anchor failures be reported too rather than exiting here.
    anchorErrors === 0,
  );

  if (anchorErrors > 0) process.exit(1);
}

/** Validates `](#anchor)` and `href="#anchor"` against the page's own headings. */
async function checkSameFileAnchors(): Promise<number> {
  let errors = 0;

  for (const page of blog.getPages()) {
    const ids = new Set(getHeadings(page));
    const raw = await page.data.getText("raw");
    const anchors = new Set<string>();
    for (const match of raw.matchAll(/\]\(#([^)\s]+)\)/g)) anchors.add(match[1]);
    for (const match of raw.matchAll(/href="#([^"]+)"/g)) anchors.add(match[1]);

    for (const anchor of anchors) {
      let decoded = anchor;
      try {
        decoded = decodeURIComponent(anchor);
      } catch {
        // A malformed escape is not a reason to crash the linter.
      }
      if (ids.has(anchor) || ids.has(decoded)) continue;
      console.error(
        `Invalid anchor in ${page.absolutePath}: #${anchor} matches no heading on this page`,
      );
      errors += 1;
    }
  }

  if (errors > 0) console.error(`------\n${errors} invalid same-page anchor(s)`);
  return errors;
}

function getHeadings({ data }: InferPageType<typeof blog>): string[] {
  return data.toc.map((item) => item.url.slice(1));
}

function getFiles() {
  console.log("Validating Files");

  const blogPromises = blog.getPages().map(
    async (page): Promise<FileObject> => ({
      path: page.absolutePath ?? "",
      content: await page.data.getText("raw"),
      url: page.url,
      data: page.data,
    }),
  );

  const promises = [...blogPromises];

  return Promise.all(promises);
}

void checkLinks();
