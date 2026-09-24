/**
 * Measure what a docs page costs to send, without a full `next build`.
 *
 * ```sh
 * pnpm --filter docs exec tsx scripts/measure-page-size.ts \
 *   orm/v7/reference/prisma-client-reference postgres/overview
 * ```
 *
 * It reports the two things the September 2026 SEO audit found to dominate a
 * docs document, for each page and for the whole page tree:
 *
 * 1. **The page tree that crosses to the client.** Rebuilt from
 *    `content/docs` through the same fumadocs `loader`, then measured before
 *    and after `trimPageTreeForClient`. This is per-page overhead: the same
 *    bytes appear in the RSC payload of every single page.
 * 2. **The code blocks.** Every fenced block in the page's MDX, highlighted
 *    twice through the real fumadocs `rehypeCode` — once with Shiki's inline
 *    dual-theme styles, once with `transformerShikiTokenClasses` — reporting
 *    HTML bytes and the bytes spent on `style` and `class` attributes.
 *
 * What it deliberately does not do is render the page's server components.
 * That needs Next's RSC runtime (`next/navigation`, the layout contexts, the
 * client-reference manifest), which is a build, not a script. The rendered
 * markup is also duplicated in the flight payload, so the code-block and tree
 * numbers below count once and the document pays roughly twice — the pull
 * request body reconciles them against the bytes actually served by
 * production.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import matter from "gray-matter";
import { loader } from "fumadocs-core/source";
import { rehypeCode, rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { hastToHtml } from "shiki/core";
import { rehypeCodeOptions } from "@prisma-docs/ui/mdx/rehype-code-options";
import { trimPageTreeForClient } from "../src/lib/client-page-tree";

const CONTENT_DIR = path.join(fileURLToPath(new URL("../", import.meta.url)), "content/docs");

function bytes(value: string) {
  return Buffer.byteLength(value, "utf8");
}

function format(value: number) {
  return value.toLocaleString("en-US");
}

function delta(before: number, after: number) {
  if (before === 0) return "—";
  const percent = ((after - before) / before) * 100;
  return `${after - before >= 0 ? "+" : ""}${format(after - before)} B (${percent.toFixed(1)}%)`;
}

/**
 * Rebuild `source.pageTree` from disk.
 *
 * The real tree comes from `.source/server`, which only a bundler can load
 * (every MDX file is an import). Frontmatter plus `meta.json` is all the tree
 * is made of, so reading those and handing them to the same `loader` produces
 * the same structure. The one difference is icons: the app's icon plugins turn
 * them into React elements, which have no JSON size, so they are left as the
 * strings they are in `meta.json`.
 */
async function buildPageTree() {
  const [pagePaths, metaPaths] = await Promise.all([
    fg("**/*.mdx", { cwd: CONTENT_DIR }),
    fg("**/meta.json", { cwd: CONTENT_DIR }),
  ]);

  const pages = await Promise.all(
    pagePaths.map(async (file) => {
      const { data } = matter(await readFile(path.join(CONTENT_DIR, file), "utf8"));
      return { type: "page" as const, path: file, data };
    }),
  );
  const metas = await Promise.all(
    metaPaths.map(async (file) => ({
      type: "meta" as const,
      path: file,
      data: JSON.parse(await readFile(path.join(CONTENT_DIR, file), "utf8")),
    })),
  );

  return loader({ baseUrl: "/", source: { files: [...pages, ...metas] } }).pageTree;
}

/** Fenced code blocks in an MDX source, as `PreParser` would see them. */
function codeBlocks(mdx: string) {
  const blocks: { lang: string; meta: string; code: string }[] = [];
  const fence = /^([`~]{3,})([^\n]*)\n([\s\S]*?)^\1[ \t]*$/gm;

  for (const match of mdx.matchAll(fence)) {
    const info = match[2].trim();
    const [lang = "", ...rest] = info.split(/\s+/);
    blocks.push({ lang: lang || "plaintext", meta: rest.join(" "), code: match[3] });
  }

  return blocks;
}

function codeBlockTree(lang: string, code: string, meta: string) {
  return {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "pre",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "code",
            properties: { className: [`language-${lang}`], metastring: meta },
            children: [{ type: "text", value: code }],
          },
        ],
      },
    ],
  };
}

function attributeBytes(html: string, attribute: "style" | "class") {
  const pattern = new RegExp(`\\s${attribute}="[^"]*"`, "g");
  return [...html.matchAll(pattern)].reduce((total, match) => total + bytes(match[0]), 0);
}

interface CodeMeasurement {
  blocks: number;
  html: number;
  style: number;
  class: number;
}

async function measureCodeBlocks(
  mdx: string,
  options: Record<string, unknown>,
): Promise<CodeMeasurement> {
  // `rehypeCode` is typed as a unified plugin; called outside a processor the
  // `this` context has to be dropped.
  const createTransform = rehypeCode as unknown as (
    options: unknown,
  ) => (tree: unknown, file: unknown) => Promise<void>;
  const transform = createTransform(options);
  const result: CodeMeasurement = { blocks: 0, html: 0, style: 0, class: 0 };

  for (const block of codeBlocks(mdx)) {
    const tree = codeBlockTree(block.lang, block.code, block.meta);
    await transform(tree, {});
    const html = hastToHtml(tree as never);

    result.blocks += 1;
    result.html += bytes(html);
    result.style += attributeBytes(html, "style");
    result.class += attributeBytes(html, "class");
  }

  return result;
}

/**
 * Both pipelines get the same two concessions to running without the remark
 * half of the pipeline:
 *
 * - `tab: false`, because `tab="…"` meta wraps the block in an MDX JSX
 *   element, which is not HTML and has nothing to do with token size.
 * - `fallbackLanguage: "bash"`, because ` ```npm ` fences are rewritten by
 *   `remarkNpm` before Shiki ever sees them.
 */
const MEASUREMENT_OPTIONS = { tab: false, fallbackLanguage: "bash" } as const;

/** Shiki's inline dual-theme styles: the pipeline without our transformer. */
const INLINE_STYLE_OPTIONS = {
  ...MEASUREMENT_OPTIONS,
  transformers: [...(rehypeCodeDefaultOptions.transformers ?? [])],
};

async function main() {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error(
      "usage: tsx scripts/measure-page-size.ts <slug>...\n" +
        "  e.g. orm/v7/reference/prisma-client-reference",
    );
    process.exitCode = 1;
    return;
  }

  const tree = await buildPageTree();
  const treeBefore = bytes(JSON.stringify(tree));
  const treeAfter = bytes(JSON.stringify(trimPageTreeForClient(tree)));

  console.log("Page tree serialised into the RSC payload of EVERY page");
  console.log(`  before  ${format(treeBefore)} B`);
  console.log(`  after   ${format(treeAfter)} B    ${delta(treeBefore, treeAfter)}`);
  console.log("");

  for (const slug of slugs) {
    const normalized = slug.replace(/^\/+|\/+$/g, "");
    const candidates = [`${normalized}.mdx`, `${normalized}/index.mdx`];
    let mdx: string | undefined;
    let file: string | undefined;

    for (const candidate of candidates) {
      try {
        mdx = await readFile(path.join(CONTENT_DIR, candidate), "utf8");
        file = candidate;
        break;
      } catch {
        // try the next shape
      }
    }

    if (mdx === undefined || file === undefined) {
      console.log(`${normalized}: not found (tried ${candidates.join(", ")})`);
      console.log("");
      continue;
    }

    const [before, after] = await Promise.all([
      measureCodeBlocks(mdx, INLINE_STYLE_OPTIONS),
      measureCodeBlocks(mdx, { ...rehypeCodeOptions, ...MEASUREMENT_OPTIONS }),
    ]);

    console.log(`${file}`);
    console.log(`  MDX source              ${format(bytes(mdx))} B`);
    console.log(`  code blocks             ${format(before.blocks)}`);
    console.log(
      `  highlighted HTML        ${format(before.html)} B -> ${format(after.html)} B    ${delta(before.html, after.html)}`,
    );
    console.log(
      `    style= attributes     ${format(before.style)} B -> ${format(after.style)} B    ${delta(before.style, after.style)}`,
    );
    console.log(
      `    class= attributes     ${format(before.class)} B -> ${format(after.class)} B    ${delta(before.class, after.class)}`,
    );
    console.log(
      `  per-document saving     ${format(before.html - after.html + (treeBefore - treeAfter))} B once, ~${format(2 * (before.html - after.html) + (treeBefore - treeAfter))} B counting the flight payload's copy of the markup`,
    );
    console.log("");
  }
}

await main();
