// Regenerates the Prisma 8 extension catalog tables in the docs from the
// shared registry in packages/ui/src/data/extensions/*.json, so the docs and
// prisma.io/extensions never disagree about what exists.
//
// Usage:
//   node scripts/generate-extensions-catalog.mjs          # rewrite the tables in place
//   node scripts/generate-extensions-catalog.mjs --check  # exit 1 if a table is stale
//
// A table lives between two MDX comments in a content file:
//
//   {/* extensions-catalog:start tag=middleware */}
//   ...generated...
//   {/* extensions-catalog:end */}
//
// Options: none (every entry), `tag=<tag>` (entries carrying the tag),
// `not-tag=<tag>` (entries without it), and `source=official|community`.
// Options combine. MDX comments are stripped from
// the rendered page and from the llms.txt renditions, so the generated table is
// plain markdown that agents and search engines read as-is.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..");
const REGISTRY_DIR = join(REPO_ROOT, "packages/ui/src/data/extensions");
const CONTENT_DIR = join(HERE, "..", "content/docs/orm");

const TARGETS = [
  join(CONTENT_DIR, "extensions/index.mdx"),
  join(CONTENT_DIR, "extensions/using-extensions.mdx"),
  join(CONTENT_DIR, "middleware/how-middleware-works.mdx"),
];

const MARKER =
  /(\{\/\* extensions-catalog:start([^*]*)\*\/\}\n)([\s\S]*?)(\{\/\* extensions-catalog:end \*\/\})/g;

const DATABASE_LABELS = {
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  sqlite: "SQLite",
  mysql: "MySQL",
  mariadb: "MariaDB",
  cockroachdb: "CockroachDB",
  mssql: "SQL Server",
};
const databaseLabel = (slug) =>
  DATABASE_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
const STATUS_LABELS = {
  stable: "Stable",
  "release-candidate": "Release candidate",
  experimental: "Experimental",
};

function readRegistry(file) {
  return JSON.parse(readFileSync(join(REGISTRY_DIR, file), "utf8"));
}

const official = readRegistry("official.json");
const community = readRegistry("community.json");
const byName = (a, b) => a.name.localeCompare(b.name);
const entries = [...official.sort(byName), ...community.sort(byName)];

// Backslashes first, otherwise a `\|` in the input becomes `\\|` and GFM
// reads the pipe as a column boundary.
function escapeCell(text) {
  return text.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

function renderTable(options) {
  const rows = entries.filter((entry) => {
    if (options.tag && !entry.tags.includes(options.tag)) return false;
    if (options["not-tag"] && entry.tags.includes(options["not-tag"])) return false;
    if (options.source && entry.source !== options.source) return false;
    return true;
  });
  const header = [
    "| Name | What it adds | Package | Databases | By |",
    "| --- | --- | --- | --- | --- |",
  ];
  const body = rows.map((entry) => {
    const name = `[${escapeCell(entry.name)}](https://www.prisma.io/extensions/${entry.slug})`;
    // Release candidate is the baseline for Prisma 8 today, so only flag the
    // entries whose surface is still moving.
    const status =
      entry.status === "experimental" ? ` (${STATUS_LABELS[entry.status].toLowerCase()})` : "";
    const pkg = entry.builtIn
      ? `\`${entry.importPath ?? entry.package}\` (built in)`
      : `\`${entry.package}\``;
    const databases = entry.databases.map(databaseLabel).join(", ");
    const by =
      entry.source === "official"
        ? "Prisma"
        : `[${escapeCell(entry.author.name)}](${entry.author.url})`;
    return `| ${name}${status} | ${escapeCell(entry.tldr)} | ${pkg} | ${databases} | ${by} |`;
  });
  return [...header, ...body].join("\n");
}

function parseOptions(raw) {
  const options = {};
  for (const pair of raw.trim().split(/\s+/).filter(Boolean)) {
    const [key, value] = pair.split("=");
    if (key && value) options[key] = value;
  }
  return options;
}

const check = process.argv.includes("--check");
let stale = 0;

for (const file of TARGETS) {
  const current = readFileSync(file, "utf8");
  let matched = false;
  const next = current.replace(MARKER, (_match, start, rawOptions, _body, end) => {
    matched = true;
    return `${start}${renderTable(parseOptions(rawOptions))}\n${end}`;
  });
  const label = relative(REPO_ROOT, file);
  if (!matched) {
    console.warn(`No extensions-catalog markers in ${label}`);
    continue;
  }
  if (next === current) {
    console.log(`Up to date: ${label}`);
    continue;
  }
  if (check) {
    stale += 1;
    console.error(`Stale catalog table: ${label}`);
    continue;
  }
  writeFileSync(file, next);
  console.log(`Regenerated: ${label}`);
}

if (check && stale > 0) {
  console.error(
    `\n${stale} file(s) out of date. Run \`pnpm --filter docs run generate:extensions-catalog\`.`,
  );
  process.exit(1);
}
