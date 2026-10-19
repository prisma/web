import type { ReactNode } from "react";
import { CtaBurst } from "@/components/sections/cta-burst";
import { COMPARISON_CTA } from "@/app/compare/_content";
import {
  COMPARISONS,
  COMPARISON_INDEX,
  type ComparisonPath,
  type ComparisonSlug,
} from "@/app/compare/comparisons";
import { CHECKED as CONVEX_CHECKED, CONVEX_UPDATED } from "@/app/compare/convex/_content";
import { getConvexPageContent } from "@/app/compare/convex/_sections";
import { CHECKED as KYSELY_CHECKED, KYSELY_UPDATED } from "@/app/compare/kysely/_content";
import { getKyselyPageContent } from "@/app/compare/kysely/_sections";
import { CHECKED as MONGOOSE_CHECKED, MONGOOSE_UPDATED } from "@/app/compare/mongoose/_content";
import { getMongoosePageContent } from "@/app/compare/mongoose/_sections";
import { CHECKED as NEON_CHECKED, NEON_UPDATED } from "@/app/compare/neon/_content";
import { getNeonPageContent } from "@/app/compare/neon/_sections";
import type { MarkdownPage } from "@/lib/markdown-pages";
import { heading, joinBlocks } from "./blocks";
import { renderComparisonContent } from "./comparison-content";

export const comparisonContent = {
  convex: getConvexPageContent,
  kysely: getKyselyPageContent,
  mongoose: getMongoosePageContent,
  neon: getNeonPageContent,
} satisfies Record<ComparisonSlug, () => ReactNode>;

/** Register complete comparison renditions using the same trees as the HTML pages. */
export function getComparisonMarkdownPages(): Record<ComparisonPath, MarkdownPage> {
  const index: MarkdownPage = {
    ...COMPARISON_INDEX,
    h1: COMPARISON_INDEX.title,
    subheadline: COMPARISON_INDEX.description,
    renderBody: () =>
      joinBlocks([
        ...COMPARISONS.map((entry) =>
          joinBlocks([
            heading(2, entry.competitor),
            `[${entry.title}](/compare/${entry.slug})`,
            entry.description,
          ]),
        ),
        renderComparisonContent(<CtaBurst {...COMPARISON_CTA} />, COMPARISON_INDEX.path),
      ]),
  };

  return Object.fromEntries([
    [index.path, index],
    ...COMPARISONS.map((entry) => {
      const path = `/compare/${entry.slug}` as const;
      const blocks = renderComparisonContent(comparisonContent[entry.slug](), path).split("\n\n");
      if (blocks[0] !== `# ${entry.title}` || !blocks[1]) {
        throw new Error(`Comparison opening does not match its metadata: ${path}`);
      }
      return [
        path,
        {
          path,
          title: entry.title,
          description: entry.description,
          h1: entry.title,
          subheadline: blocks[1],
          renderBody: () => blocks.slice(2).join("\n\n"),
          ...(entry.slug === "kysely"
            ? { checked: KYSELY_CHECKED, dateModified: KYSELY_UPDATED.iso }
            : entry.slug === "mongoose"
              ? { checked: MONGOOSE_CHECKED, dateModified: MONGOOSE_UPDATED.iso }
              : entry.slug === "convex"
                ? { checked: CONVEX_CHECKED, dateModified: CONVEX_UPDATED.iso }
                : entry.slug === "neon"
                  ? { checked: NEON_CHECKED, dateModified: NEON_UPDATED.iso }
                  : {}),
        } satisfies MarkdownPage,
      ];
    }),
  ]) as Record<ComparisonPath, MarkdownPage>;
}
