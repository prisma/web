import {
  COMPARE_ROWS,
  DATABASE_MATRIX,
  DATABASE_SOURCES,
  MONGOOSE_PATH,
  MONGOOSE_PUBLISHED,
  MONGOOSE_UPDATED,
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
export function getMongooseFacts() {
  const dateChecked = MONGOOSE_UPDATED.iso;
  return {
    path: MONGOOSE_PATH,
    dateChecked,
    tools: TOOLS,
    features: COMPARE_ROWS.map((row) => ({
      feature: row.feature,
      mongoose: {
        value: row.mongoose,
        source: row.sources.mongoose,
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
      mongoose: {
        value: statusValue(row.mongoose),
        source: DATABASE_SOURCES.mongoose,
        dateChecked,
      } satisfies FactValue,
      orm8: {
        value: statusValue(row.orm8),
        source: DATABASE_SOURCES.orm8,
        dateChecked,
      } satisfies FactValue,
      orm7: {
        value: statusValue(row.orm7),
        source: row.database === "MongoDB" ? DATABASE_SOURCES.orm7Mongo : DATABASE_SOURCES.orm7,
        dateChecked,
      } satisfies FactValue,
    })),
    pricing: PRICING.map((row) => ({
      label: row.label,
      mongoose: {
        value: row.mongoose,
        source: row.sources.mongoose,
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

export function getMongooseAboutEntities() {
  return [
    {
      "@type": "SoftwareApplication",
      name: TOOLS.mongoose.name,
      softwareVersion: TOOLS.mongoose.softwareVersion,
      license: TOOLS.mongoose.license,
      codeRepository: TOOLS.mongoose.codeRepository,
      programmingLanguage: TOOLS.mongoose.programmingLanguage,
      url: TOOLS.mongoose.url,
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
export function getMongooseArticleFields() {
  return {
    datePublished: MONGOOSE_PUBLISHED.iso,
    dateModified: MONGOOSE_UPDATED.iso,
    about: getMongooseAboutEntities(),
  };
}
