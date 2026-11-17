import {
  COMPARE_ROWS,
  PLANETSCALE_PATH,
  PLANETSCALE_PUBLISHED,
  PLANETSCALE_UPDATED,
  PRICING,
  TOOLS,
} from "./_content";
import { getPlanetScaleReadingStats } from "./_sections";

export type FactValue = {
  value: string | null;
  source: string;
  dateChecked: string;
};

/** Machine-readable feature and pricing cells with a source on every value. */
export function getPlanetScaleFacts() {
  const dateChecked = PLANETSCALE_UPDATED.iso;
  return {
    path: PLANETSCALE_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      planetscale: {
        value: row.planetscale,
        source: row.sources.planetscale,
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
      planetscale: {
        value: row.planetscale,
        source: row.sources.planetscale,
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

export function getPlanetScaleAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.planetscale.name,
      softwareVersion: TOOLS.planetscale.softwareVersion,
      license: TOOLS.planetscale.license,
      codeRepository: TOOLS.planetscale.codeRepository,
      programmingLanguage: TOOLS.planetscale.programmingLanguage,
      url: TOOLS.planetscale.url,
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
export function getPlanetScaleArticleFields() {
  const { wordCount, timeRequired } = getPlanetScaleReadingStats();
  return {
    datePublished: PLANETSCALE_PUBLISHED.iso,
    dateModified: PLANETSCALE_UPDATED.iso,
    wordCount,
    timeRequired,
    about: getPlanetScaleAboutEntities(),
  };
}
