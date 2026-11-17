import {
  COMPARE_ROWS,
  CONVEX_PATH,
  CONVEX_PUBLISHED,
  CONVEX_UPDATED,
  PRICING,
  TOOLS,
} from "./_content";
import { getConvexReadingStats } from "./_sections";

export type FactValue = {
  value: string | null;
  source: string;
  dateChecked: string;
};

/** Machine-readable feature and pricing cells with a source on every value. */
export function getConvexFacts() {
  const dateChecked = CONVEX_UPDATED.iso;
  return {
    path: CONVEX_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      convex: {
        value: row.convex,
        source: row.sources.convex,
        dateChecked,
      } satisfies FactValue,
      prisma: {
        value: row.prisma,
        source: row.sources.prisma,
        dateChecked,
      } satisfies FactValue,
    })),
    pricing: PRICING.map((row) => ({
      label: row.label,
      convex: {
        value: row.convex,
        source: row.sources.convex,
        dateChecked,
      } satisfies FactValue,
      prisma: {
        value: row.prisma,
        source: row.sources.prisma,
        dateChecked,
      } satisfies FactValue,
    })),
  };
}

export function getConvexAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.convex.name,
      softwareVersion: TOOLS.convex.softwareVersion,
      license: TOOLS.convex.license,
      codeRepository: TOOLS.convex.codeRepository,
      programmingLanguage: TOOLS.convex.programmingLanguage,
      url: TOOLS.convex.url,
    },
    {
      "@type": "SoftwareApplication",
      name: TOOLS.prisma.name,
      softwareVersion: TOOLS.prisma.softwareVersion,
      license: TOOLS.prisma.license,
      codeRepository: TOOLS.prisma.codeRepository,
      programmingLanguage: TOOLS.prisma.programmingLanguage,
      url: TOOLS.prisma.url,
    },
  ];
}

/** Article JSON-LD fields that sit on top of the shared comparison graph. */
export function getConvexArticleFields() {
  const { wordCount, timeRequired } = getConvexReadingStats();
  return {
    datePublished: CONVEX_PUBLISHED.iso,
    dateModified: CONVEX_UPDATED.iso,
    wordCount,
    timeRequired,
    about: getConvexAboutEntities(),
  };
}
