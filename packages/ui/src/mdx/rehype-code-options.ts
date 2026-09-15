import { rehypeCodeDefaultOptions, type RehypeCodeOptions } from "fumadocs-core/mdx-plugins";
import { transformerShikiTokenClasses } from "@prisma-docs/ui/mdx/shiki-token-classes";

/**
 * `rehypeCodeOptions` for every app whose global CSS imports
 * `@prisma-docs/ui/styles` — docs, blog and eclipse. It is the fumadocs
 * defaults plus `transformerShikiTokenClasses` (see that module for why).
 *
 * The defaults are respread by hand because `rehypeCode` merges the caller's
 * options over them shallowly: passing `transformers` alone would drop the four
 * notation transformers (line highlight, word highlight, diff, focus) that the
 * docs content relies on.
 *
 * `apps/site` is deliberately not on this: its changelog MDX colours tokens
 * from its own `globals.css`, which does not import this package's styles, so
 * it keeps Shiki's inline declarations.
 */
export const rehypeCodeOptions: RehypeCodeOptions = {
  ...rehypeCodeDefaultOptions,
  transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerShikiTokenClasses()],
};

/**
 * The themes the token classes are generated from, read back off the fumadocs
 * defaults so the stylesheet generator and the pipeline cannot disagree.
 *
 * `defaultColor: false` is the mode the whole approach assumes: it is what
 * makes Shiki emit `--shiki-light` / `--shiki-dark` custom properties instead
 * of a resolved `color`. Under anything else the generated classes would be
 * declaring properties nothing reads, so both assumptions are asserted here
 * rather than left to be discovered as grey code on a page.
 */
export function resolveShikiThemes(): { light: string; dark: string } {
  const options: RehypeCodeOptions = rehypeCodeDefaultOptions;
  const themes = "themes" in options ? options.themes : undefined;
  const light = typeof themes?.light === "string" ? themes.light : undefined;
  const dark = typeof themes?.dark === "string" ? themes.dark : undefined;

  if (!light || !dark) {
    throw new Error(
      "fumadocs no longer defaults to a light/dark Shiki theme pair; " +
        "packages/ui/src/mdx/shiki-token-classes.ts needs revisiting.",
    );
  }
  if ("defaultColor" in options && options.defaultColor !== false) {
    throw new Error(
      `fumadocs no longer defaults to defaultColor: false (got ${String(options.defaultColor)}); ` +
        "packages/ui/src/mdx/shiki-token-classes.ts needs revisiting.",
    );
  }

  return { light, dark };
}
