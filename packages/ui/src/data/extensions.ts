/**
 * Prisma 8 extension directory registry.
 *
 * Two JSON files back the directory at prisma.io/extensions and the catalog
 * in the docs. `official.json` lists packages maintained by Prisma;
 * `community.json` lists packages maintained by everyone else and is the file
 * the submission form appends to. See ./extensions/README.md for the entry
 * shape and the submission flow.
 */
import communityEntries from "./extensions/community.json";
import officialEntries from "./extensions/official.json";

export const EXTENSION_SOURCES = ["official", "community"] as const;
export const EXTENSION_STATUSES = ["stable", "release-candidate", "experimental"] as const;
/**
 * Databases Prisma 8 ships or plans today. `databases` on an entry is not
 * limited to this list: an extension that adds a new database names it here
 * with its own lowercase slug (for example `cockroachdb`).
 */
export const KNOWN_DATABASES = ["postgresql", "mongodb", "sqlite", "mysql"] as const;

export type ExtensionSource = (typeof EXTENSION_SOURCES)[number];
export type ExtensionStatus = (typeof EXTENSION_STATUSES)[number];

export type ExtensionEntry = {
  /** URL segment on prisma.io/extensions/<slug>. Lowercase letters, digits, and dashes. */
  slug: string;
  /** Display name. */
  name: string;
  /** npm package name. */
  package: string;
  source: ExtensionSource;
  status: ExtensionStatus;
  /** One sentence, shown on cards and in the docs table. */
  tldr: string;
  /** One short paragraph, shown on the detail page. Inline code allowed. */
  description: string;
  /**
   * Lowercase database slugs the extension works with, or, for an extension
   * that adds a database, the database it adds.
   */
  databases: string[];
  /** Lowercase keywords. `middleware` and `database` drive the docs tables. */
  tags: string[];
  /** Source repository URL. */
  repo: string;
  /** Documentation URL, if any. */
  docs?: string;
  /** Runnable example URL, if any. */
  example?: string;
  author: { name: string; url: string };
  /** ISO date (YYYY-MM-DD) the entry was added to the registry. */
  addedAt: string;
};

export const EXTENSION_SOURCE_LABELS: Record<ExtensionSource, string> = {
  official: "By Prisma",
  community: "Community",
};

const DATABASE_LABELS: Record<string, string> = {
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  sqlite: "SQLite",
  mysql: "MySQL",
  mariadb: "MariaDB",
  cockroachdb: "CockroachDB",
  mssql: "SQL Server",
};

/** Display name for a database slug; unknown slugs are capitalized. */
export function getDatabaseLabel(slug: string): string {
  return DATABASE_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

export const EXTENSION_STATUS_LABELS: Record<ExtensionStatus, string> = {
  stable: "Stable",
  "release-candidate": "Release candidate",
  experimental: "Experimental",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATABASE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NPM_PACKAGE_PATTERN = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** YYYY-MM-DD and a date that exists on the calendar (2026-02-30 does not). */
function isCalendarDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isNonEmptyString(value: unknown, max = 500): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isOneOf<T extends readonly string[]>(values: T, value: unknown): value is T[number] {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

/**
 * Validate one registry entry. Returns a list of problems; an empty list means
 * the entry is valid. Used at module load (so a bad JSON edit fails the build)
 * and by the submission API before it opens a pull request.
 */
export function validateExtensionEntry(input: unknown): string[] {
  const problems: string[] = [];
  if (typeof input !== "object" || input === null) return ["entry must be an object"];
  const entry = input as Record<string, unknown>;

  if (!isNonEmptyString(entry.slug, 64) || !SLUG_PATTERN.test(entry.slug)) {
    problems.push("slug must be lowercase letters, digits, and dashes");
  }
  if (!isNonEmptyString(entry.name, 80)) problems.push("name is required (max 80 characters)");
  if (!isNonEmptyString(entry.package, 214) || !NPM_PACKAGE_PATTERN.test(entry.package)) {
    problems.push("package must be a valid npm package name");
  }
  if (!isOneOf(EXTENSION_SOURCES, entry.source)) {
    problems.push(`source must be one of ${EXTENSION_SOURCES.join(", ")}`);
  }
  if (!isOneOf(EXTENSION_STATUSES, entry.status)) {
    problems.push(`status must be one of ${EXTENSION_STATUSES.join(", ")}`);
  }
  if (!isNonEmptyString(entry.tldr, 140)) problems.push("tldr is required (max 140 characters)");
  if (!isNonEmptyString(entry.description, 600)) {
    problems.push("description is required (max 600 characters)");
  }
  if (
    !Array.isArray(entry.databases) ||
    entry.databases.length === 0 ||
    entry.databases.length > 6 ||
    !entry.databases.every(
      (database) => isNonEmptyString(database, 32) && DATABASE_SLUG_PATTERN.test(database),
    )
  ) {
    problems.push("databases must list 1 to 6 lowercase database slugs, such as postgresql");
  } else if (new Set(entry.databases).size !== entry.databases.length) {
    problems.push("databases must not repeat a slug");
  }
  if (
    !Array.isArray(entry.tags) ||
    entry.tags.length > 8 ||
    !entry.tags.every((tag) => isNonEmptyString(tag, 32) && tag === tag.toLowerCase())
  ) {
    problems.push("tags must be an array of up to 8 short lowercase strings");
  } else if (new Set(entry.tags).size !== entry.tags.length) {
    problems.push("tags must not repeat");
  }
  if (!isHttpsUrl(entry.repo)) problems.push("repo must be an https URL");
  if (entry.docs !== undefined && !isHttpsUrl(entry.docs)) {
    problems.push("docs must be an https URL when set");
  }
  if (entry.example !== undefined && !isHttpsUrl(entry.example)) {
    problems.push("example must be an https URL when set");
  }
  const author = entry.author as Record<string, unknown> | undefined;
  if (
    typeof author !== "object" ||
    author === null ||
    !isNonEmptyString(author.name, 80) ||
    !isHttpsUrl(author.url)
  ) {
    problems.push("author must have a name and an https url");
  }
  if (!isNonEmptyString(entry.addedAt, 10) || !isCalendarDate(entry.addedAt)) {
    problems.push("addedAt must be a real ISO date (YYYY-MM-DD)");
  }
  return problems;
}

function loadRegistry(entries: unknown[], file: string): ExtensionEntry[] {
  const seen = new Set<string>();
  return entries.map((entry, index) => {
    const problems = validateExtensionEntry(entry);
    if (problems.length > 0) {
      throw new Error(`Invalid extension entry #${index + 1} in ${file}: ${problems.join("; ")}`);
    }
    const valid = entry as ExtensionEntry;
    if (seen.has(valid.slug)) {
      throw new Error(`Duplicate extension slug "${valid.slug}" in ${file}`);
    }
    seen.add(valid.slug);
    return valid;
  });
}

export const officialExtensions: ExtensionEntry[] = loadRegistry(officialEntries, "official.json");
export const communityExtensions: ExtensionEntry[] = loadRegistry(
  communityEntries,
  "community.json",
);

/** Every registry entry, official first, each group sorted by name. */
export const extensions: ExtensionEntry[] = [
  ...[...officialExtensions].sort((a, b) => a.name.localeCompare(b.name)),
  ...[...communityExtensions].sort((a, b) => a.name.localeCompare(b.name)),
];

for (const entry of communityExtensions) {
  if (officialExtensions.some((official) => official.slug === entry.slug)) {
    throw new Error(
      `Extension slug "${entry.slug}" exists in both official.json and community.json`,
    );
  }
}

/** Every database slug any entry mentions, known ones first. */
export function getListedDatabases(entries: ExtensionEntry[] = extensions): string[] {
  const seen = new Set(entries.flatMap((entry) => entry.databases));
  const known = KNOWN_DATABASES.filter((database) => seen.has(database));
  const rest = [...seen]
    .filter((database) => !(KNOWN_DATABASES as readonly string[]).includes(database))
    .sort();
  return [...known, ...rest];
}

export function isMiddleware(entry: ExtensionEntry): boolean {
  return entry.tags.includes("middleware");
}

export function isDatabase(entry: ExtensionEntry): boolean {
  return entry.tags.includes("database");
}

export function getExtensionBySlug(slug: string): ExtensionEntry | undefined {
  return extensions.find((entry) => entry.slug === slug);
}

/** The shell command that adds the package to a project. */
export function getInstallCommand(entry: ExtensionEntry): string {
  return `npm install ${entry.package}`;
}

export function getNpmUrl(entry: ExtensionEntry): string {
  return `https://www.npmjs.com/package/${entry.package}`;
}

/** Absolute URL of the entry's page in the directory. */
export function getExtensionDirectoryUrl(entry: ExtensionEntry): string {
  return `https://www.prisma.io/extensions/${entry.slug}`;
}
