import {
  COMPARE_ROWS,
  DATABASE_MATRIX,
  DATABASE_SOURCES,
  KYSELY_PATH,
  KYSELY_PUBLISHED,
  KYSELY_UPDATED,
  PRICING,
  TOOLS,
} from "./_content";

export type FactValue = {
  value: string | null;
  source: string;
  dateChecked: string;
};

function statusValue(status: string | null): string {
  return status ?? "No";
}

/** Machine-readable feature, database, and pricing cells with a source on every value. */
export function getKyselyFacts() {
  const dateChecked = KYSELY_UPDATED.iso;
  return {
    path: KYSELY_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      kysely: {
        value: row.kysely,
        source: row.sources.kysely,
        dateChecked,
      } satisfies FactValue,
      prisma: {
        value: row.prisma,
        source: row.sources.prisma,
        dateChecked,
      } satisfies FactValue,
    })),
    databases: DATABASE_MATRIX.map((row) => ({
      database: row.database,
      kysely: {
        value: statusValue(row.kysely),
        source: DATABASE_SOURCES.kysely,
        dateChecked,
      } satisfies FactValue,
      orm8: {
        value: statusValue(row.orm8),
        source: DATABASE_SOURCES.orm8,
        dateChecked,
      } satisfies FactValue,
      orm7: {
        value: statusValue(row.orm7),
        source: DATABASE_SOURCES.orm7,
        dateChecked,
      } satisfies FactValue,
    })),
    pricing: PRICING.map((row) => ({
      label: row.label,
      kysely: {
        value: row.kysely,
        source: row.sources.kysely,
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

export function getKyselyAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.kysely.name,
      softwareVersion: TOOLS.kysely.softwareVersion,
      license: TOOLS.kysely.license,
      codeRepository: TOOLS.kysely.codeRepository,
      programmingLanguage: TOOLS.kysely.programmingLanguage,
      url: TOOLS.kysely.url,
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
export function getKyselyArticleFields() {
  return {
    datePublished: KYSELY_PUBLISHED.iso,
    dateModified: KYSELY_UPDATED.iso,
    about: getKyselyAboutEntities(),
  };
}
