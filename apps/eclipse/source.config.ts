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
import convert from 'npm-to-yarn';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const designSystem = defineDocs({
  dir: 'content/design-system',
  docs: {
    schema: frontmatterSchema,
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
      remarkImage,
      remarkMdxFiles,
    ],
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    remarkNpmOptions: {
      persist: {
        id: 'package-manager',
      },
      // Custom package managers to add --bun flag for bunx commands
      packageManagers: [
        { command: (cmd: string) => convert(cmd.replace(/^npm init -y$/, 'npm init'), 'npm'), name: 'npm' },
        { command: (cmd: string) => convert(cmd.replace(/^npm init -y$/, 'npm init'), 'pnpm'), name: 'pnpm' },
        { command: (cmd: string) => convert(cmd.replace(/^npm init -y$/, 'npm init'), 'yarn'), name: 'yarn' },
        {
          command: (cmd: string) => {
            const converted = convert(cmd.replace(/^npm init -y$/, 'npm init'), 'bun');
            if (!converted) return undefined;
            return converted.replace(/^bun x /, 'bunx --bun ');
          },
          name: 'bun',
        },
      ],
    },
  },
});
