// Twin of packages/ui/src/lib/html-text.ts; eclipse cannot depend on @prisma-docs/ui without a cycle.
/**
 * Text content of a server-rendered HTML fragment: everything outside of tags,
 * whitespace collapsed, React's entity escapes decoded. A single pass over the
 * string rather than a tag-stripping regex, so a `<` inside text can never
 * re-form a tag after removal (which is what makes regex stripping a
 * sanitisation smell; here it is only ever applied to markup we rendered
 * ourselves in tests, but the loop is just as short and exact).
 */
export function textContent(html: string): string {
  let text = "";
  let inTag = false;
  for (const char of html) {
    if (inTag) {
      if (char === ">") inTag = false;
    } else if (char === "<") {
      inTag = true;
    } else {
      text += char;
    }
  }
  return text
    .replace(/&(amp|lt|gt|quot|#x27|#39);/g, (_, entity: string) => ENTITIES[entity] ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#x27": "'",
  "#39": "'",
};
