/**
 * Small helpers for assembling the Markdown renditions of the marketing pages.
 *
 * These exist so every rendition emits the same shapes — an H2 per page
 * section, a bullet per feature, CTAs as real links — without each page module
 * reinventing the joining and blank-line rules.
 */

export type Cta = { label: string; href: string };

/** Collapses the blank lines that fall out of conditional blocks. */
export function joinBlocks(blocks: (string | undefined | null | false)[]): string {
  return blocks
    .filter((block): block is string => typeof block === "string" && block.trim().length > 0)
    .map((block) => block.trim())
    .join("\n\n");
}

export function heading(level: 1 | 2 | 3, text: string): string {
  return `${"#".repeat(level)} ${text.trim()}`;
}

export function paragraphs(text: string | string[]): string {
  return (Array.isArray(text) ? text : [text])
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function bulletList(items: (string | undefined)[]): string {
  return items
    .filter((item): item is string => Boolean(item?.trim()))
    .map((item) => `- ${item.trim()}`)
    .join("\n");
}

export function numberedList(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item.trim()}`).join("\n");
}

/**
 * A named item rendered as a bold lead-in plus its description, which is how
 * feature grids and benefit cards read once the layout is gone.
 */
export function definitionList(items: { name: string; description: string; href?: string }[]) {
  return items
    .map((item) => {
      const name = item.href ? `[${item.name}](${item.href})` : item.name;
      return `- **${name}** — ${item.description.trim()}`;
    })
    .join("\n");
}

export function link(cta: Cta): string {
  return `[${cta.label}](${cta.href})`;
}

/** CTAs kept as links so an agent can follow them, primary first. */
export function ctaList(ctas: (Cta | undefined)[]): string {
  const rendered = ctas.filter((cta): cta is Cta => Boolean(cta)).map((cta) => `- ${link(cta)}`);
  return rendered.length > 0 ? rendered.join("\n") : "";
}

/**
 * A simple pipe table. Used where the HTML is genuinely tabular (the pricing
 * plan and spec tables); everything else reads better as prose and lists.
 */
export function table(headers: string[], rows: string[][]): string {
  const headerRow = `| ${headers.join(" | ")} |`;
  const separator = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyRows = rows.map((row) => `| ${row.join(" | ")} |`);
  return [headerRow, separator, ...bodyRows].join("\n");
}
