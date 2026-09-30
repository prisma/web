import { escapeTabValue } from "@prisma/eclipse";

export const DATABASE_STORAGE_KEY = "prisma-docs-database";

// Keep link values independent of display labels and Radix's escaped tab IDs.
export const DATABASES = [
  { id: "postgresql", label: "PostgreSQL", aliases: ["postgres"] },
  { id: "mongodb", label: "MongoDB", aliases: ["mongo"] },
  { id: "mysql", label: "MySQL", aliases: [] },
  { id: "sqlite", label: "SQLite", aliases: [] },
  {
    id: "sqlserver",
    label: "SQL Server",
    aliases: ["mssql", "sql-server", "microsoft sql server"],
  },
  { id: "cockroachdb", label: "CockroachDB", aliases: ["cockroach"] },
] as const;

export type Database = (typeof DATABASES)[number]["id"];

export function normalizeDatabase(value: string | null | undefined): Database | null {
  const normalized = value?.trim().toLowerCase();
  return (
    DATABASES.find(
      (database) =>
        database.id === normalized ||
        database.label.toLowerCase() === normalized ||
        database.aliases.some((alias) => alias === normalized),
    )?.id ?? null
  );
}

export function getDatabaseTabValue(
  values: string[],
  database: Database | null,
  defaultValue?: string,
): string | undefined {
  return (
    values.find((value) => normalizeDatabase(value) === database) ??
    values.find((value) => escapeTabValue(value) === escapeTabValue(defaultValue ?? "")) ??
    values[0]
  );
}

export function databaseFromTabValue(value: string, values: string[]): Database | null {
  const label = values.find((label) => escapeTabValue(label) === value);
  return normalizeDatabase(label);
}

export function getDatabaseSelection(search: string, stored: string | null): Database | null {
  return normalizeDatabase(new URLSearchParams(search).get("db")) ?? normalizeDatabase(stored);
}

export function getDatabaseUrl(href: string, database: Database): string {
  const url = new URL(href);
  url.searchParams.set("db", database);
  return `${url.pathname}${url.search}${url.hash}`;
}
