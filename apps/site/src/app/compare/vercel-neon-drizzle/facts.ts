import {
  COMPARE_ROWS,
  PRICING,
  TOOLS,
  VERCEL_NEON_DRIZZLE_PATH,
  VERCEL_NEON_DRIZZLE_PUBLISHED,
  VERCEL_NEON_DRIZZLE_UPDATED,
} from "./_content";
import { getVercelNeonDrizzleReadingStats } from "./_sections";

export type FactValue = {
  value: string | null;
  source: string;
  dateChecked: string;
};

/** Machine-readable feature and pricing cells with a source on every value. */
export function getVercelNeonDrizzleFacts() {
  const dateChecked = VERCEL_NEON_DRIZZLE_UPDATED.iso;
  return {
    path: VERCEL_NEON_DRIZZLE_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      combo: {
        value: row.combo,
        source: row.sources.combo,
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
      combo: {
        value: row.combo,
        source: row.sources.combo,
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

export function getVercelNeonDrizzleAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.combo.name,
      softwareVersion: TOOLS.combo.softwareVersion,
      license: TOOLS.combo.license,
      codeRepository: TOOLS.combo.codeRepository,
      programmingLanguage: TOOLS.combo.programmingLanguage,
      url: TOOLS.combo.url,
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
    {
      "@type": "SoftwareApplication",
      name: TOOLS.drizzle.name,
      softwareVersion: TOOLS.drizzle.softwareVersion,
      license: TOOLS.drizzle.license,
      codeRepository: TOOLS.drizzle.codeRepository,
      programmingLanguage: TOOLS.drizzle.programmingLanguage,
      url: TOOLS.drizzle.url,
    },
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
      name: TOOLS.vercel.name,
      softwareVersion: TOOLS.vercel.softwareVersion,
      license: TOOLS.vercel.license,
      codeRepository: TOOLS.vercel.codeRepository,
      programmingLanguage: TOOLS.vercel.programmingLanguage,
      url: TOOLS.vercel.url,
    },
  ];
}

/** Article JSON-LD fields that sit on top of the shared comparison graph. */
export function getVercelNeonDrizzleArticleFields() {
  const { wordCount, timeRequired } = getVercelNeonDrizzleReadingStats();
  return {
    datePublished: VERCEL_NEON_DRIZZLE_PUBLISHED.iso,
    dateModified: VERCEL_NEON_DRIZZLE_UPDATED.iso,
    wordCount,
    timeRequired,
    about: getVercelNeonDrizzleAboutEntities(),
  };
}
