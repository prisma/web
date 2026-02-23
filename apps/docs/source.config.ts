import remarkDirective from 'remark-directive';
import {
  remarkDirectiveAdmonition,
  remarkMdxFiles,
} from 'fumadocs-core/mdx-plugins';
import { remarkImage } from 'fumadocs-core/mdx-plugins';
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { z } from 'zod';
import convert from 'npm-to-yarn';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      image: z.string().optional(),
      badge: z.enum(['early-access', 'deprecated', 'preview']).optional(),
      url: z.string(),
      metaTitle: z.string(),
      metaDescription: z.string(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// v6 docs collection
export const docsV6 = defineDocs({
  dir: 'content/docs.v6',
  docs: {
    schema: frontmatterSchema.extend({
      image: z.string().optional(),
      badge: z.enum(['early-access', 'deprecated', 'preview']).optional(),
      url: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: [
      remarkDirective,
      remarkDirectiveAdmonition,
      [remarkImage, { useImport: false }],
      remarkMdxFiles,
    ],
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    remarkNpmOptions: {
      persist: {
        id: 'package-manager',
      },
      packageManagers: [
        { command: (cmd: string) => convert(cmd, 'npm'), name: 'npm' },
        { command: (cmd: string) => convert(cmd, 'pnpm'), name: 'pnpm' },
        { command: (cmd: string) => convert(cmd, 'yarn'), name: 'yarn' },
        {
          command: (cmd: string) => {
            const converted = convert(cmd, 'bun');
            if (!converted) return undefined;
            return converted.replace(/^bun x /, 'bunx --bun ');
          },
          name: 'bun',
        },
      ],
    },
  },
});
