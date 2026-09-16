import type { ShikiTransformer } from "shiki";

/**
 * Class-based dual-theme syntax colours for Shiki.
 *
 * Shiki's dual-theme mode (`themes: { light, dark }`, `defaultColor: false` —
 * the fumadocs-mdx default) puts the colours of *both* themes on every token as
 * inline custom properties:
 *
 * ```html
 * <span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span>
 * ```
 *
 * `@fumadocs/base-ui` reads them back with `code span { color:
 * var(--shiki-light) }` plus a `.dark` override. That is 50 bytes per token,
 * and because the rendered HTML is duplicated in the RSC flight payload every
 * token is paid for twice. On
 * `/docs/orm/v7/reference/prisma-client-reference` that was 6,129 tokens =
 * 341 KB of `style` attributes plus 374 KB of the same thing in the payload,
 * for a grand total of **eight** distinct declarations.
 *
 * So this transformer moves the declarations into a generated stylesheet and
 * leaves a short class behind:
 *
 * ```html
 * <span class="skc1a2b">const</span>
 * ```
 * ```css
 * .skc1a2b { --shiki-light: #d73a49; --shiki-dark: #f97583; }
 * ```
 *
 * Declaring the same custom properties — rather than `color` — is what makes
 * this a pure size change. The fumadocs rules that consume `--shiki-light` /
 * `--shiki-dark` / `--shiki-*-font-style`, the eclipse code block's
 * `bg-(--shiki-light-bg)` (`keepBackground`), and the line-highlight, diff,
 * focus and word-highlight transformers (which work on classes, on the line and
 * token elements) all keep working untouched, in both themes.
 *
 * ## Why two groups
 *
 * A token's light colour is resolved against `github-light` and its dark colour
 * against `github-dark`, independently, and TextMate resolves a colour and a
 * font style independently too. So the set of possible declarations is a cross
 * product, and one class per whole declaration would need
 * `colours² × fontStyles²` ≈ 43,000 rules to be exhaustive.
 *
 * Splitting the declaration into the colour pair and the font-style pair brings
 * that down to `colours² + fontStyles²` ≈ 450 rules — small enough to generate
 * exhaustively, so no token can ever miss its rule — while still costing one
 * class for the overwhelmingly common colour-only token.
 *
 * The stylesheet is generated: `scripts/generate-shiki-token-css.ts` writes
 * `src/styles/shiki-tokens.css`, and `shiki-token-classes.test.ts` fails if the
 * committed file has drifted from what the installed Shiki and themes produce.
 * On top of that, a declaration whose class is not in the stylesheet is left as
 * an inline style, so the worst case is today's output, never an uncoloured
 * token.
 */

const CSS_VARIABLE_PREFIX = "--shiki-";

/** Colour-pair classes. */
export const COLOR_CLASS_PREFIX = "skc";
/** Font-style/weight/decoration-pair classes. */
export const STYLE_CLASS_PREFIX = "sks";

const CLASS_NAME_DIGITS = 4;
const CLASS_NAME_SPACE = 36 ** CLASS_NAME_DIGITS;

/**
 * Token backgrounds (`--shiki-light-bg` on a token, from a theme scope with a
 * `background`) are left inline. They would add a third dimension to the cross
 * product for something that occurs zero times across the docs content, and
 * leaving them alone is free.
 */
const BACKGROUND_SUFFIX = "-bg";

/** FNV-1a, 32 bit. Stable across runtimes and versions, unlike a JS hash. */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Parse a token `style` attribute into declarations, or `null` if it is not a
 * pure Shiki token style this transform handles.
 *
 * The guard is what keeps the transform honest: anything carrying a property
 * Shiki did not put there, a token background, or nothing at all, is left
 * exactly as it was.
 */
export function parseShikiTokenStyle(style: string): Map<string, string> | null {
  const declarations = new Map<string, string>();

  for (const part of style.split(";")) {
    const trimmed = part.trim();
    if (trimmed.length === 0) continue;

    const separator = trimmed.indexOf(":");
    if (separator === -1) return null;

    const property = trimmed.slice(0, separator).trim().toLowerCase();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .toLowerCase();

    if (!property.startsWith(CSS_VARIABLE_PREFIX) || value.length === 0) return null;
    if (property.endsWith(BACKGROUND_SUFFIX)) return null;

    declarations.set(property, value);
  }

  return declarations.size > 0 ? declarations : null;
}

/** `--shiki-light` / `--shiki-dark`: the colour of each theme. */
function isColorProperty(property: string): boolean {
  const variant = property.slice(CSS_VARIABLE_PREFIX.length);
  return variant.length > 0 && !variant.includes("-");
}

/** Property order does not matter to the browser, so it must not matter here. */
export function canonicalizeDeclarations(declarations: Iterable<[string, string]>): string {
  return [...declarations]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([property, value]) => `${property}:${value}`)
    .join(";");
}

function hashedClassName(prefix: string, canonical: string): string {
  const digits = (fnv1a(canonical) % CLASS_NAME_SPACE).toString(36);
  return prefix + digits.padStart(CLASS_NAME_DIGITS, "0");
}

export interface ShikiTokenClassGroup {
  className: string;
  /** The rule the generated stylesheet must contain for `className`. */
  rule: string;
}

/**
 * Split a token's declarations into the groups that become classes: the colour
 * pair, and the font-style pair when the token has one.
 *
 * Pure, and the single source of truth shared by this transformer and the
 * stylesheet generator.
 */
export function shikiTokenClassGroups(declarations: Map<string, string>): ShikiTokenClassGroup[] {
  const colors: [string, string][] = [];
  const styles: [string, string][] = [];

  for (const entry of declarations) {
    (isColorProperty(entry[0]) ? colors : styles).push(entry);
  }

  const groups: ShikiTokenClassGroup[] = [];
  for (const [prefix, entries] of [
    [COLOR_CLASS_PREFIX, colors],
    [STYLE_CLASS_PREFIX, styles],
  ] as const) {
    if (entries.length === 0) continue;
    const canonical = canonicalizeDeclarations(entries);
    const className = hashedClassName(prefix, canonical);
    groups.push({ className, rule: `.${className}{${canonical}}` });
  }

  return groups;
}

interface HastElement {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/**
 * The slice of HAST this walker touches. Spelled out rather than imported from
 * `hast` so the package needs no `@types/hast` dependency for one type import.
 */
type HastNode = HastElement | { type: string; children?: HastNode[] };

function addClasses(element: HastElement, classNames: string[]) {
  const properties = (element.properties ??= {});
  const existing = properties.class ?? properties.className;
  const before = Array.isArray(existing)
    ? existing.map(String)
    : existing === undefined || existing === null || existing === ""
      ? []
      : [String(existing)];

  properties.class = [...before, ...classNames].join(" ");
  // Keep one spelling on the node, so a later `addClassToHast` does not write
  // to the other key and lose these.
  if ("className" in properties) delete properties.className;
}

/**
 * Tags whose `style` is the code block's own (foreground plus background for
 * both themes), not a token's. Walked through, never rewritten.
 */
const CONTAINER_TAGS = new Set(["pre", "code"]);

function convert(node: HastNode, knownClasses?: ReadonlySet<string>) {
  if (node.type === "element") {
    const element = node as HastElement;
    const style = element.properties?.style;

    if (!CONTAINER_TAGS.has(element.tagName) && typeof style === "string") {
      const declarations = parseShikiTokenStyle(style);
      const groups = declarations ? shikiTokenClassGroups(declarations) : [];

      // A group with no generated rule means a token with no colour, so keep
      // the inline style. The drift test makes this unreachable in production;
      // the fallback is what makes the change safe if it ever is not.
      if (
        groups.length > 0 &&
        (!knownClasses || groups.every((group) => knownClasses.has(group.className)))
      ) {
        delete element.properties!.style;
        addClasses(
          element,
          groups.map((group) => group.className),
        );
      }
    }
  }

  for (const child of node.children ?? []) convert(child, knownClasses);
}

export interface ShikiTokenClassesOptions {
  /**
   * When given, only these class names are used; a token whose classes are not
   * all in the set keeps its inline style. Meant for tests — production leaves
   * it unset, because the generated stylesheet is exhaustive over the two
   * themes' palettes and a drift test guards it.
   */
  knownClasses?: ReadonlySet<string>;
}

/**
 * Replace per-token inline Shiki styles with generated classes.
 *
 * Runs `post` so the notation transformers (highlight, word highlight, diff,
 * focus) have already added their classes and split their spans.
 */
export function transformerShikiTokenClasses(
  options: ShikiTokenClassesOptions = {},
): ShikiTransformer {
  return {
    name: "prisma:shiki-token-classes",
    enforce: "post",
    root(root) {
      convert(root as unknown as HastNode, options.knownClasses);
      return root;
    },
  };
}
