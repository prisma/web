/**
 * Generate `src/styles/shiki-tokens.css`: the rules behind the classes
 * `transformerShikiTokenClasses` puts on Shiki tokens in the docs, blog and
 * eclipse code blocks.
 *
 * Run it after bumping Shiki or changing the themes:
 *
 * ```sh
 * pnpm --filter @prisma-docs/ui generate:shiki-tokens
 * ```
 *
 * `src/mdx/shiki-token-classes.test.ts` fails when the committed file has
 * drifted, so the gate catches a forgotten run.
 *
 * ## Why this is exhaustive
 *
 * A token carries the colour and font style of both themes, resolved
 * independently: the light half against `github-light`, the dark half against
 * `github-dark`. TextMate also resolves a scope's colour and its font style
 * independently, so a token can pair any colour in a theme with any font style
 * in that theme — `~~strike~~` in Markdown is exactly that (the theme
 * foreground plus a strikethrough from a scope that sets no colour).
 *
 * So the value space is:
 *
 * - colour pairs: `(light colours + inherit) × (dark colours + inherit)`
 * - font-style pairs: every combination of the four TextMate font-style bits,
 *   for each theme, rendered the way `flatTokenVariants` in `@shikijs/core`
 *   renders it — including its rule that a property present in only one theme
 *   is `inherit` in the other
 *
 * Both are enumerated in full here. Token *backgrounds* are the one thing left
 * out: `parseShikiTokenStyle` refuses a declaration containing `-bg`, so those
 * tokens keep their inline style rather than adding a third dimension for
 * something that occurs zero times in the content.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHighlighter, type ThemeRegistrationResolved } from "shiki";
import { getTokenStyleObject } from "shiki/core";
import { FontStyle } from "shiki/textmate";
import { shikiTokenClassGroups } from "@prisma-docs/ui/mdx/shiki-token-classes";
import { resolveShikiThemes } from "@prisma-docs/ui/mdx/rehype-code-options";

/**
 * The themes the MDX pipeline actually uses, read off the fumadocs defaults so
 * the stylesheet cannot be generated from a different palette than the one the
 * tokens are highlighted with.
 */
export const SHIKI_THEMES = resolveShikiThemes();

const VARIANTS = ["light", "dark"] as const;
const CSS_VARIABLE_PREFIX = "--shiki-";

/** Every font-style bit combination TextMate can resolve, including none. */
const FONT_STYLES = [
  FontStyle.None,
  FontStyle.Italic,
  FontStyle.Bold,
  FontStyle.Underline,
  FontStyle.Strikethrough,
].reduce<number[]>(
  (all, bit) => [...new Set([...all, ...all.map((style) => style | bit)])],
  [FontStyle.None],
);

/** Every colour a theme can give a token, plus the "no colour" case. */
function themeColors(theme: ThemeRegistrationResolved): (string | undefined)[] {
  const colors = new Set<string>();

  if (theme.fg) colors.add(theme.fg.toLowerCase());
  for (const setting of theme.settings ?? []) {
    const foreground = setting.settings?.foreground;
    if (foreground) colors.add(foreground.toLowerCase());
  }

  return [undefined, ...[...colors].sort()];
}

/** `varKey` from `flatTokenVariants` in `@shikijs/core`. */
function variableName(variant: string, property: string): string {
  if (property === "color") return `${CSS_VARIABLE_PREFIX}${variant}`;
  return `${CSS_VARIABLE_PREFIX}${variant}-${property}`;
}

/**
 * `flatTokenVariants` for one pair: the union of both halves' properties, each
 * emitted per variant, with `inherit` where a half does not have it.
 */
function mergePair(
  halves: { variant: string; style: Record<string, string> }[],
): Map<string, string> {
  const properties = new Set(halves.flatMap(({ style }) => Object.keys(style)));
  const merged = new Map<string, string>();

  for (const { variant, style } of halves) {
    for (const property of properties) {
      merged.set(variableName(variant, property), (style[property] ?? "inherit").toLowerCase());
    }
  }

  return merged;
}

function pairDeclarations(
  lightStyle: Record<string, string>,
  darkStyle: Record<string, string>,
): Map<string, string> {
  return mergePair([
    { variant: VARIANTS[0], style: lightStyle },
    { variant: VARIANTS[1], style: darkStyle },
  ]);
}

export async function generateShikiTokenCss(): Promise<string> {
  const highlighter = await createHighlighter({
    themes: [SHIKI_THEMES.light, SHIKI_THEMES.dark],
    langs: [],
  });
  const light = themeColors(highlighter.getTheme(SHIKI_THEMES.light));
  const dark = themeColors(highlighter.getTheme(SHIKI_THEMES.dark));
  highlighter.dispose();

  const rules = new Map<string, string>();
  const collisions: string[] = [];

  const record = (declarations: Map<string, string>) => {
    for (const group of shikiTokenClassGroups(declarations)) {
      const existing = rules.get(group.className);
      if (existing !== undefined && existing !== group.rule) {
        collisions.push(`${group.className}: ${existing} vs ${group.rule}`);
        continue;
      }
      rules.set(group.className, group.rule);
    }
  };

  // Colour pairs. `getTokenStyleObject` omits `color` for an absent colour, so
  // `undefined` produces the `inherit` half on its own.
  for (const lightColor of light) {
    for (const darkColor of dark) {
      if (lightColor === undefined && darkColor === undefined) continue;
      record(
        pairDeclarations(
          getTokenStyleObject({ color: lightColor, fontStyle: FontStyle.None }),
          getTokenStyleObject({ color: darkColor, fontStyle: FontStyle.None }),
        ),
      );
    }
  }

  // Font-style pairs, independent of the colour.
  for (const lightStyle of FONT_STYLES) {
    for (const darkStyle of FONT_STYLES) {
      if (lightStyle === FontStyle.None && darkStyle === FontStyle.None) continue;
      record(
        pairDeclarations(
          getTokenStyleObject({ fontStyle: lightStyle }),
          getTokenStyleObject({ fontStyle: darkStyle }),
        ),
      );
    }
  }

  if (collisions.length > 0) {
    throw new Error(
      `Class name collisions (widen CLASS_NAME_DIGITS in shiki-token-classes.ts):\n${collisions.join("\n")}`,
    );
  }

  const header = [
    "/*",
    " * GENERATED — do not edit.",
    " *",
    " * pnpm --filter @prisma-docs/ui generate:shiki-tokens",
    " *",
    ` * Themes: ${SHIKI_THEMES.light} + ${SHIKI_THEMES.dark}.`,
    " * Every token colour pair and font-style pair those two themes can produce.",
    " * `transformerShikiTokenClasses` puts the matching class(es) on the token",
    " * instead of repeating the declarations inline on all 6,000-odd of them.",
    " * See src/mdx/shiki-token-classes.ts.",
    " *",
    " * One rule per line, and excluded from oxfmt in .oxfmtrc.json: the format is",
    " * asserted by shiki-token-classes.test.ts, which compares this file byte for",
    " * byte against a fresh generator run.",
    " */",
    "",
  ].join("\n");

  return `${header}${[...rules.values()].sort().join("\n")}\n`;
}

export const SHIKI_TOKEN_CSS_PATH = path.join(
  fileURLToPath(new URL("../src/styles/", import.meta.url)),
  "shiki-tokens.css",
);

/** Sanity check for the generated sheet, shared with the test. */
export function shikiTokenCssRules(css: string): string[] {
  return css.split("\n").filter((line) => line.startsWith("."));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const css = await generateShikiTokenCss();
  await mkdir(path.dirname(SHIKI_TOKEN_CSS_PATH), { recursive: true });
  await writeFile(SHIKI_TOKEN_CSS_PATH, css, "utf8");
  console.log(`Wrote ${shikiTokenCssRules(css).length} rules to ${SHIKI_TOKEN_CSS_PATH}`);
}
