import remarkDirective from "remark-directive";
import { remarkDirectiveAdmonition, remarkMdxFiles } from "fumadocs-core/mdx-plugins";
import { remarkImage } from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";
import convert from "npm-to-yarn";
import remarkConsoleUtm from "@/lib/remark-console-utm";

// npm-to-yarn only converts the last line of multi-line strings,
// so we split, convert each line, and rejoin.
function convertLine(cmd: string, pm: "npm" | "pnpm" | "yarn" | "bun"): string {
  return cmd
    .split("\n")
    .map((line) => {
      // npm-to-yarn strips @latest from `npm create X@latest` and handles the
      // npm-specific `--` separator inconsistently across PMs. Handle this
      // pattern directly instead of fighting the library's output.
      const m = line.match(/^npm create ([^\s]+@latest)((?:\s+--\s*.*)?)$/);
      if (m) {
        const pkg = m[1]; // e.g. "prisma@latest"
        const flags = m[2].replace(/^\s+--\s*/, " ").trim(); // strip -- separator
        const f = flags ? ` ${flags}` : "";
        switch (pm) {
          case "npm":  return line;
          case "pnpm": return `pnpm create ${pkg}${f}`;
          case "yarn": return `yarn create ${pkg}${f}`;
          case "bun":  return `bun create ${pkg}${f}`;
        }
      }
      return convert(line.replace(/^npm init -y$/, "npm init"), pm);
    })
    .join("\n");
}

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      image: z.string().optional(),
      badge: z.enum(["early-access", "deprecated", "preview"]).optional(),
      url: z.string(),
      metaTitle: z.string(),
      metaDescription: z.string(),
      aiPrompt: z.string().optional(),
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
  dir: "content/docs.v6",
  docs: {
    schema: frontmatterSchema.extend({
      image: z.string().optional(),
      badge: z.enum(["early-access", "deprecated", "preview"]).optional(),
      url: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      aiPrompt: z.string().optional(),
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
      [
        remarkDirectiveAdmonition,
        {
          types: {
            note: "info",
            tip: "info",
            info: "info",
            warn: "warning",
            warning: "warning",
            danger: "error",
            success: "success",
            ppg: "ppg",
            error: "error",
          },
        },
      ],
      [remarkImage, { useImport: false }],
      remarkMdxFiles,
      remarkConsoleUtm,
    ],
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
      packageManagers: [
        { command: (cmd: string) => convertLine(cmd, "npm"), name: "npm" },
        { command: (cmd: string) => convertLine(cmd, "pnpm"), name: "pnpm" },
        { command: (cmd: string) => convertLine(cmd, "yarn"), name: "yarn" },
        {
          command: (cmd: string) => {
            const converted = convertLine(cmd, "bun");
            if (!converted) return undefined;
            return converted.replace(/^bun x /, "bunx --bun ");
          },
          name: "bun",
        },
      ],
    },
  },
});
