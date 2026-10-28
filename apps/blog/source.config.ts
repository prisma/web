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
import { rehypeCodeOptions } from "@prisma-docs/ui/mdx/rehype-code-options";

export const blogPosts = defineCollections({
  type: "doc",
  async: process.env.COMPOSER_BUILD === "1",
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
    /**
     * A post that is not published yet. Its page and `.md` URL still render,
     * marked `noindex`, but the listings, tag and author pages, series, related
     * posts, RSS feed, sitemap and agent-facing text files leave it out.
     */
    draft: z.boolean().optional(),
    prev: z.string().optional(),
    next: z.string().optional(),
    /**
     * Per-post override for the end-of-post conversion panel. The panel is
     * rendered for every post; a post that wants a campaign-specific label or
     * a tracked Console URL (UTMs) sets these instead of adding a second CTA
     * inside the article.
     */
    cta: z
      .object({
        title: z.string().trim().min(1).optional(),
        description: z.string().trim().min(1).optional(),
        text: z.string().trim().min(1).optional(),
        href: z.string().url().optional(),
      })
      .optional(),
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
    // Class-based Shiki token colours instead of a style attribute per token.
    rehypeCodeOptions,
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
