export const indexesBefore = `-- one btree per column
CREATE INDEX btree_tenant_id   ON cache_entries (tenant_id);
CREATE INDEX btree_user_id     ON cache_entries (user_id);
CREATE INDEX btree_endpoint    ON cache_entries (endpoint);
CREATE INDEX btree_locale      ON cache_entries (locale);
CREATE INDEX btree_region      ON cache_entries (region);
CREATE INDEX btree_api_version ON cache_entries (api_version);`;

export const indexesAfter = `-- !mark
CREATE EXTENSION IF NOT EXISTS bloom;

-- !mark
CREATE INDEX cache_bloom_idx ON cache_entries
  -- !mark
  USING bloom (
    -- !mark
    tenant_id, user_id, endpoint,
    -- !mark
    locale, region, api_version
  -- !mark
  );`;

export const demoTerminalLines = [
  "Provisioning a temporary Prisma Postgres database (1h TTL)...",
  "   claim URL: https://create-db.prisma.io/claim?projectID=...",
  "Creating cache_entries table and enabling bloom extension...",
  "Seeding 10,000 rows...",
  "   seeded in 1.2s",
  "",
  "A. Six btree indexes (one per column)...",
  "   index size: 0.5 MB",
  "   3 lookups:  306.5 ms",
  "",
  "B. One bloom index (all six columns)...",
  "   index size: 0.2 MB",
  "   3 lookups:  302.7 ms",
  "",
  "   Bloom index is 70% smaller (0.2 MB vs 0.5 MB),",
  "   and one index covers any subset of those six columns.",
];
