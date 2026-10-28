import remarkDirective from "remark-directive";
import { remarkDirectiveAdmonition, remarkImage, remarkMdxFiles } from "fumadocs-core/mdx-plugins";
import { defineCollections, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";
import convert from "npm-to-yarn";
import { answerPageSchema } from "./src/lib/answer-page-schema";

export const answerPages = defineCollections({
  type: "doc",
  dir: "content/answers",
  files: ["**/*.mdx"],
  schema: frontmatterSchema.extend(answerPageSchema.shape),
  postprocess: { includeProcessedMarkdown: true },
});

export const releaseNotes = defineCollections({
  type: "doc",
  dir: "content/changelog",
  schema: frontmatterSchema.extend({
    // `date: 2024-03-13`, quoted or not, parses as a string and becomes a Date
    // here. Anything but a real YYYY-MM-DD date fails the build: coercing the
    // raw value would turn an empty or numeric one into a 1970 date and roll
    // 2024-02-30 over to March 1.
    date: z.iso.date().pipe(z.coerce.date()),
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
