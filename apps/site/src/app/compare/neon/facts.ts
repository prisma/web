import { COMPARE_ROWS, NEON_PATH, NEON_PUBLISHED, NEON_UPDATED, PRICING, TOOLS } from "./_content";
import { getNeonReadingStats } from "./_sections";

export type FactValue = {
  value: string | null;
  source: string;
  dateChecked: string;
};

/** Machine-readable feature and pricing cells with a source on every value. */
export function getNeonFacts() {
  const dateChecked = NEON_UPDATED.iso;
  return {
    path: NEON_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      neon: {
        value: row.neon,
        source: row.sources.neon,
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
      neon: {
        value: row.neon,
        source: row.sources.neon,
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

export function getNeonAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.neon.name,
      softwareVersion: TOOLS.neon.softwareVersion,
      license: TOOLS.neon.license,
      codeRepository: TOOLS.neon.codeRepository,
      programmingLanguage: TOOLS.neon.programmingLanguage,
      url: TOOLS.neon.url,
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
export function getNeonArticleFields() {
  const { wordCount, timeRequired } = getNeonReadingStats();
  return {
    datePublished: NEON_PUBLISHED.iso,
    dateModified: NEON_UPDATED.iso,
    wordCount,
    timeRequired,
    about: getNeonAboutEntities(),
  };
}
