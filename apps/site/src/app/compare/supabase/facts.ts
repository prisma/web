import {
  COMPARE_ROWS,
  PRICING,
  SUPABASE_PATH,
  SUPABASE_PUBLISHED,
  SUPABASE_UPDATED,
  TOOLS,
} from "./_content";
import { getSupabaseReadingStats } from "./_sections";

export type FactValue = {
  value: string | null;
  source: string;
  dateChecked: string;
};

/** Machine-readable feature and pricing cells with a source on every value. */
export function getSupabaseFacts() {
  const dateChecked = SUPABASE_UPDATED.iso;
  return {
    path: SUPABASE_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      supabase: {
        value: row.supabase,
        source: row.sources.supabase,
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
      supabase: {
        value: row.supabase,
        source: row.sources.supabase,
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

export function getSupabaseAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.supabase.name,
      softwareVersion: TOOLS.supabase.softwareVersion,
      license: TOOLS.supabase.license,
      codeRepository: TOOLS.supabase.codeRepository,
      programmingLanguage: TOOLS.supabase.programmingLanguage,
      url: TOOLS.supabase.url,
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
export function getSupabaseArticleFields() {
  const { wordCount, timeRequired } = getSupabaseReadingStats();
  return {
    datePublished: SUPABASE_PUBLISHED.iso,
    dateModified: SUPABASE_UPDATED.iso,
    wordCount,
    timeRequired,
    about: getSupabaseAboutEntities(),
  };
}
