import remarkDirective from "remark-directive";
import { remarkDirectiveAdmonition, remarkImage, remarkMdxFiles } from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";
import { rehypeCodeOptions } from "@prisma-docs/ui/mdx/rehype-code-options";

import { CHAPTER_STATUS } from "./src/lib/chapter-status";

export const handbook = defineDocs({
  dir: "content/handbook",
  docs: {
    schema: frontmatterSchema.extend({
      status: z.enum(CHAPTER_STATUS).optional(),
      // Minutes, hand-set. Reading-time estimators lie about prose with
      // checklists and code in it.
      readingTime: z.number().int().positive().optional(),
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
    rehypeCodeOptions,
    remarkPlugins: [
      remarkDirective,
      [
        remarkDirectiveAdmonition,
        {
          // `:::note` etc. in MDX. The types on the right are what
          // src/mdx-components.tsx receives in CalloutContainer.
          types: {
            note: "note",
            tip: "tip",
            warning: "warning",
            warn: "warning",
            example: "example",
          },
        },
      ],
      [remarkImage, { useImport: false }],
      remarkMdxFiles,
    ],
    remarkCodeTabOptions: {
      parseMdx: true,
    },
  },
});
