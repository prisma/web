import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { transformerShikiTokenClasses } from "@prisma-docs/ui/mdx/shiki-token-classes";

/**
 * `rehypeCodeOptions` for every app whose global CSS imports
 * `@prisma-docs/ui/styles` — docs, blog and eclipse. It adds
 * `transformerShikiTokenClasses` (see that module for why) on top of the
 * fumadocs defaults.
 *
 * The defaults have to be respread by hand: `rehypeCode` merges the caller's
 * options over `rehypeCodeDefaultOptions` shallowly, so passing `transformers`
 * would otherwise drop the four notation transformers (line highlight, word
 * highlight, diff, focus) that the docs content relies on.
 *
 * `apps/site` is deliberately not on this: its changelog MDX colours tokens
 * from its own `globals.css`, which does not import this package's styles, so
 * it keeps Shiki's inline declarations.
 */
export const rehypeCodeOptions = {
  transformers: [
    ...(rehypeCodeDefaultOptions.transformers ?? []),
    transformerShikiTokenClasses(),
  ],
};
