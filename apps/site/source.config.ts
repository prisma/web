import remarkDirective from "remark-directive";
import { remarkDirectiveAdmonition, remarkImage, remarkMdxFiles } from "fumadocs-core/mdx-plugins";
import { defineCollections, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";
import convert from "npm-to-yarn";

export const releaseNotes = defineCollections({
  type: "doc",
  dir: "content/changelog",
  schema: frontmatterSchema.extend({
    date: z.coerce.date(),
    version: z.string(),
    summary: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  postprocess: {
    includeProcessedMarkdown: true,
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
    remarkCodeTabOptions: { parseMdx: true },
    remarkNpmOptions: {
      persist: { id: "package-manager" },
      packageManagers: [
        {
          command: (cmd: string) => {
            const converted = convert(cmd.replace(/^npm init -y$/, "npm init"), "bun");
            if (!converted) return undefined;
            return converted.replace(/^bun x /, "bunx --bun ");
          },
          name: "bun",
        },
        {
          command: (cmd: string) => convert(cmd.replace(/^npm init -y$/, "npm init"), "pnpm"),
          name: "pnpm",
        },
        {
          command: (cmd: string) => convert(cmd.replace(/^npm init -y$/, "npm init"), "yarn"),
          name: "yarn",
        },
        {
          command: (cmd: string) => convert(cmd.replace(/^npm init -y$/, "npm init"), "npm"),
          name: "npm",
        },
      ],
    },
  },
});
