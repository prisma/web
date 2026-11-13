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
/**
 * The current Prisma mark (apps/docs/public/logo/mark.svg), for code blocks
 * in `prisma` files. fumadocs still ships the retired triangle from Simple
 * Icons for that language. Brand colours are kept: the mark is defined by its
 * three colour bands and collapses to a plain block in one colour. Its
 * clip-path and the two zero-area sliver paths are dropped, so the inline SVG
 * carries no ids that could collide when a page repeats it.
 */
const prismaMark =
  '<svg viewBox="0 0 263 264" fill="none" aria-hidden="true">' +
  '<path d="M57.3357 92.5003L0 149.939V53.5L53.2105 0.10425V0H149.524L57.3357 92.5003Z" fill="#04D5E7"/>' +
  '<path d="M263 91.7452L91.0537 264H0V172.229L171.92 0H263V91.7452Z" fill="#FE4352"/>' +
  '<path d="M209.686 264H113.373L156.453 220.773L263.001 114.034V210.5L209.686 264Z" fill="#FEBE29"/>' +
  "</svg>";

export const rehypeCodeOptions: RehypeCodeOptions = {
  ...rehypeCodeDefaultOptions,
  icon: { extend: { prisma: prismaMark } },
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
