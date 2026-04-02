import remarkDirective from "remark-directive";
import {
  remarkDirectiveAdmonition,
  remarkImage,
  remarkMdxFiles,
} from "fumadocs-core/mdx-plugins";
import {
  defineCollections,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

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
  },
});
