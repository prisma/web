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
    true,
  );
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
