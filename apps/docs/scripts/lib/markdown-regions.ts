/**
 * Shared markdown helpers for the content linters.
 *
 * Both the link linter and the anchor-text rewrite need to ignore code and to
 * know which anchors a page defines. Fence tracking is the subtle part: a
 * closing fence must be bare, so a line like ```` ```ts ```` always opens a
 * block. Counting every fence-looking line instead desynchronises on the first
 * nested example and silently hides the rest of the file.
 */

interface MaskOptions {
  /** Also blank out heading lines (links in headings are out of scope). */
  maskHeadings?: boolean;
  /** Also blank out inline code spans. */
  maskInlineCode?: boolean;
}

/**
 * Replaces code (and optionally headings) with spaces, so offsets and line
 * numbers in the result still line up with the original content.
 */
export function maskCodeRegions(content: string, options: MaskOptions = {}): string {
  const { maskHeadings = false, maskInlineCode = true } = options;
  let fence: { marker: string; length: number } | null = null;

  return content
    .split("\n")
    .map((line) => {
      const blank = " ".repeat(line.length);
      const match = line.match(/^\s*(`{3,}|~{3,})(.*)$/);

      if (fence) {
        // A closing fence carries no info string and is at least as long.
        if (
          match &&
          match[1][0] === fence.marker &&
          match[1].length >= fence.length &&
          match[2].trim() === ""
        ) {
          fence = null;
        }
        return blank;
      }

      if (match) {
        fence = { marker: match[1][0], length: match[1].length };
        return blank;
      }

      if (maskHeadings && /^\s*#{1,6}\s/.test(line)) return blank;
      return maskInlineCode ? line.replace(/`[^`]*`/g, (span) => " ".repeat(span.length)) : line;
    })
    .join("\n");
}

/**
 * GitHub-flavoured heading slug, close enough to the ids fumadocs generates.
 */
export function slugifyHeading(heading: string): string {
  return heading
    .replace(/`/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function stripInlineFormatting(text: string) {
  return text.replace(/\*\*|__|\*|_/g, "").trim();
}

/**
 * Every anchor a page defines: heading ids (explicit `[#id]` wins over the
 * slug) plus `id="..."` attributes on JSX/HTML elements. Maps anchor → the
 * heading text, so callers can name a link's destination.
 */
export function collectPageAnchors(content: string): Map<string, string> {
  const anchors = new Map<string, string>();
  const withoutCode = maskCodeRegions(content, { maskInlineCode: false });

  for (const match of withoutCode.matchAll(/^\s*#{1,6}\s+(.+?)\s*$/gm)) {
    const explicit = match[1].match(/\[#([^\]\s]+)\]\s*$/);
    const heading = match[1].replace(/\s*\[#[^\]\s]+\]\s*$/, "");
    anchors.set(explicit ? explicit[1] : slugifyHeading(heading), stripInlineFormatting(heading));
  }

  for (const match of withoutCode.matchAll(/\bid=["']([^"']+)["']/g)) {
    if (!anchors.has(match[1])) anchors.set(match[1], "");
  }

  return anchors;
}
