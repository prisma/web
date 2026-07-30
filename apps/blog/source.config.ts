import remarkDirective from "remark-directive";
import {
  remarkDirectiveAdmonition,
  remarkMdxFiles,
  remarkMdxMermaid,
} from "fumadocs-core/mdx-plugins";
import { remarkImage } from "fumadocs-core/mdx-plugins";
import { defineCollections, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
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
    updatedAt: z.coerce.date().optional(),
    heroImagePath: z.string().optional(),
    metaImagePath: z.string().optional(),
    series: z.string().optional(),
    seriesIndex: z.number().int().positive().optional(),
    pinned: z.boolean().optional(),
    prev: z.string().optional(),
    next: z.string().optional(),
    tags: z
      .array(
        z.enum([
          "prisma-postgres",
          "ai",
          "studio",
          "announcement",
          "platform",
          "orm",
          "education",
          "case-study",
        ]),
      )
      .optional(),
    metaDescription: z.string().optional(),
    metaTitle: z.string().optional(),
    excerpt: z.string().optional(),
    /**
     * Absolute URL of the original article, for posts cross-posted from
     * another site. Search engines are pointed at that copy instead of this
     * one, so the syndicated version here does not compete with the original.
     */
    canonicalUrl: z.string().url().optional(),
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
      remarkMdxMermaid,
    ],
    remarkCodeTabOptions: { parseMdx: true },
    remarkNpmOptions: {
      persist: { id: "package-manager" },
      packageManagers: [
        {
          command: (cmd: string) => {
            const converted = convert(cmd.replace(/^npm init -y$/, "npm init"), "bun");
            if (!converted) return undefined;
            return converted
              .replace(/^bun x (prisma(?:@\S+)? init\b)/gm, "bunx --bun $1")
              .replace(/^bun x /gm, "bunx ");
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
