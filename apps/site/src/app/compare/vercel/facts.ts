import {
  COMPARE_ROWS,
  PRICING,
  TOOLS,
  VERCEL_PATH,
  VERCEL_PUBLISHED,
  VERCEL_UPDATED,
} from "./_content";
import { getVercelReadingStats } from "./_sections";

export type FactValue = {
  value: string | null;
  source: string;
  dateChecked: string;
};

/** Machine-readable feature and pricing cells with a source on every value. */
export function getVercelFacts() {
  const dateChecked = VERCEL_UPDATED.iso;
  return {
    path: VERCEL_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      vercel: {
        value: row.vercel,
        source: row.sources.vercel,
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
      vercel: {
        value: row.vercel,
        source: row.sources.vercel,
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

export function getVercelAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.prisma.name,
      softwareVersion: TOOLS.prisma.softwareVersion,
      license: TOOLS.prisma.license,
      codeRepository: TOOLS.prisma.codeRepository,
      programmingLanguage: TOOLS.prisma.programmingLanguage,
      url: TOOLS.prisma.url,
    },
    {
      "@type": "SoftwareApplication",
      name: TOOLS.vercel.name,
      softwareVersion: TOOLS.vercel.softwareVersion,
      url: TOOLS.vercel.url,
    },
  ];
}

/** Article JSON-LD fields that sit on top of the shared comparison graph. */
export function getVercelArticleFields() {
  const { wordCount, timeRequired } = getVercelReadingStats();
  return {
    datePublished: VERCEL_PUBLISHED.iso,
    dateModified: VERCEL_UPDATED.iso,
    wordCount,
    timeRequired,
    about: getVercelAboutEntities(),
  };
}
