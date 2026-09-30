import { COMPARE_PRISMA_LINKS } from "@/components/sections/compare-links-data";
import { definitionList, heading, joinBlocks, paragraphs } from "./blocks";

/**
 * Markdown for sections/compare-links.tsx, shared by every page that renders
 * it (/postgres and /pricing). The list itself comes from the same data module
 * the section renders, so only the heading is a literal here.
 */

/** compare-links.tsx renders this h2 above the list. */
export const COMPARE_PRISMA_HEADING = "Compare Prisma";

/** `intro` is the page's own sentence above the list, the one the section renders. */
export function renderCompareLinksMarkdown(intro: string): string {
  return joinBlocks([
    heading(2, COMPARE_PRISMA_HEADING),
    paragraphs(intro),
    definitionList(
      COMPARE_PRISMA_LINKS.map((item) => ({
        name: item.label,
        href: item.href,
        description: item.description,
      })),
    ),
  ]);
}
