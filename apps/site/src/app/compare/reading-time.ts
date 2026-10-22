import { isValidElement, type ReactNode } from "react";

/**
 * `CompareTable` and `ComparisonPricingTable` carry their text in props, not
 * children, so the walker reads the same props the Markdown serializer does.
 */
type TableLikeProps = {
  children?: ReactNode;
  "aria-hidden"?: boolean | "true";
  corner?: string;
  columns?: readonly (string | { label: string })[];
  rows?: readonly { label?: string; cells: readonly ReactNode[] }[];
  note?: ReactNode;
};

/**
 * Midpoint of the usual 200–250 words-per-minute silent-reading range.
 * Minutes are rounded to the nearest whole minute, at least 1.
 */
export const WORDS_PER_MINUTE = 225;

/** Walk a React tree for visible words. Skips aria-hidden nodes (icons, tooltips). */
export function countWords(node: ReactNode): number {
  const parts: string[] = [];
  function walk(value: ReactNode) {
    if (value == null || typeof value === "boolean") return;
    if (typeof value === "string" || typeof value === "number") {
      parts.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!isValidElement<TableLikeProps>(value)) {
      return;
    }
    if (value.props["aria-hidden"] === true || value.props["aria-hidden"] === "true") return;
    const { corner, columns, rows, note } = value.props;
    if (Array.isArray(rows)) {
      walk(corner);
      for (const column of columns ?? []) walk(typeof column === "string" ? column : column.label);
      for (const row of rows) {
        walk(row.label);
        row.cells.forEach(walk);
      }
      walk(note);
    }
    walk(value.props.children);
  }
  walk(node);
  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").length;
}

export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Schema.org Duration for an Article's timeRequired. */
export function timeRequiredIso(minutes: number): string {
  return `PT${minutes}M`;
}

export function articleReadingStats(node: ReactNode) {
  const words = countWords(node);
  const minutes = readingMinutes(words);
  return { wordCount: words, minutes, timeRequired: timeRequiredIso(minutes) };
}
