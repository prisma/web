import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from 'next-validate-link';
import type { InferPageType } from 'fumadocs-core/source';

import { register } from 'node:module';
register('fumadocs-mdx/node/loader', import.meta.url);

const { source, sourceV6 } = await import('@/lib/source');
const v7Pages = source.getPages().map((page) => {
  return {
    value: { slug: page.slugs },
    hashes: getHeadings(page),
  };
});
const v6Pages = sourceV6.getPages().map((page) => {
  return {
    value: { slug: page.slugs },
    hashes: getHeadings(page),
  };
});

console.log(`Found ${v7Pages.length} v7 files and ${v6Pages.length} v6 files`);

async function checkLinks() {
  const scanned = await scanURLs({
    preset: 'next',
    populate: {
      '(docs)/(default)/[[...slug]]': v7Pages,
      '(docs)/v6/[[...slug]]': v6Pages,
    },
  });

  printErrors(
    await validateFiles(await getFiles(), {
      scanned,
      markdown: {
        components: {
          Card: { attributes: ['href'] },
          Cards: { attributes: ['href'] },
        },
      },
      checkRelativePaths: 'as-url',
    }),
    true,
  );
}

function getHeadings({ data }: InferPageType<typeof source> | InferPageType<typeof sourceV6>): string[] {
  return data.toc.map((item) => item.url.slice(1));
}

function getFiles() {
  console.log("Validating Files")

  const v7Promises = source.getPages().map(
    async (page): Promise<FileObject> => ({
      path: page.absolutePath ?? '',
      content: await page.data.getText('raw'),
      url: page.url,
      data: page.data,
    }),
  );

  const v6Promises = sourceV6.getPages().map(
    async (page): Promise<FileObject> => ({
      path: page.absolutePath ?? '',
      content: await page.data.getText('raw'),
      url: page.url,
      data: page.data,
    }),
  );

  const promises = [...v7Promises, ...v6Promises];

  return Promise.all(promises);
}

void checkLinks();
