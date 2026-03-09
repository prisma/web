import remarkDirective from "remark-directive";
import {
  remarkDirectiveAdmonition,
  remarkMdxFiles,
} from "fumadocs-core/mdx-plugins";
import { remarkImage } from "fumadocs-core/mdx-plugins";
import {
  defineCollections,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";
import convert from "npm-to-yarn";

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    authors: z.array(z.string()),
    authorSrc: z.string().optional(),
    date: z.coerce.date(),
    heroImagePath: z.string().optional(),
    metaImagePath: z.string().optional(),
    series: z
      .object({
        title: z.string(),
      })
      .optional(),
    seriesIndex: z.number().int().positive().optional(),
    tags: z
      .array(
        z.enum([
          "prisma-postgres",
          "ai",
          "studio",
          "announcement",
          "data-platform",
          "orm",
          "serverless",
          "release",
          "education",
          "user-success-story",
        ]),
      )
      .optional(),
    metaDescription: z.string().optional(),
    metaTitle: z.string().optional(),
    description: z.string().optional(),
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
      // Custom package managers to add --bun flag for bunx commands
      packageManagers: [
        { command: (cmd: string) => convert(cmd, "npm"), name: "npm" },
        { command: (cmd: string) => convert(cmd, "pnpm"), name: "pnpm" },
        { command: (cmd: string) => convert(cmd, "yarn"), name: "yarn" },
        {
          command: (cmd: string) => {
            const converted = convert(cmd, "bun");
            if (!converted) return undefined;
            return converted.replace(/^bun x /, "bunx --bun ");
          },
          name: "bun",
        },
      ],
    },
  },
});
