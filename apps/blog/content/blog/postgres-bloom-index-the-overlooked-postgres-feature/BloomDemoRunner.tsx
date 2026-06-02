import { highlight, type HighlightedCode } from "codehike/code";
import { BloomDemoRunnerClient, type RunnerStep } from "./BloomDemoRunnerClient";

const SOURCE = `import { create, isDatabaseSuccess } from "create-db";
import { Client } from "pg";

console.log("Provisioning a temporary Prisma Postgres database (1h TTL)...");
const db = await create({ ttl: "1h" });
if (!isDatabaseSuccess(db)) throw new Error(db.message);
console.log(\`   claim URL: \${db.claimUrl}\`);

const client = new Client({ connectionString: db.connectionString! });
await client.connect();

await client.query(\`CREATE EXTENSION IF NOT EXISTS bloom\`);
await client.query(\`
  DROP TABLE IF EXISTS cache_entries;
  CREATE TABLE cache_entries (
    id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT, user_id TEXT, endpoint TEXT,
    locale TEXT, region TEXT, api_version INT,
    payload JSONB
  );
\`);

console.log(\`Seeding \${N.toLocaleString()} rows...\`);
for (let start = 0; start < N; start += BATCH) {
  // build BATCH rows mixing tenants / users / endpoints / locales / regions / versions
  await client.query(\`INSERT INTO cache_entries (...) VALUES \${placeholders}\`, params);
}
await client.query(\`ANALYZE cache_entries\`);

// A. Six B-tree indexes (one per column)
for (const c of COLS) {
  await client.query(\`CREATE INDEX btree_\${c} ON cache_entries (\${c})\`);
}
const btreeMB = await totalIndexMB();
const btreeMs = await runLookups();

// B. One bloom index covering all six columns
await client.query(\`
  CREATE INDEX cache_bloom_idx ON cache_entries
  USING bloom (\${COLS.join(", ")})
\`);
const bloomMB = await totalIndexMB();
const bloomMs = await runLookups();

const shrink = ((1 - bloomMB / btreeMB) * 100).toFixed(0);
console.log(
  \`Bloom index is \${shrink}% smaller \` +
  \`(\${bloomMB.toFixed(1)} MB vs \${btreeMB.toFixed(1)} MB)\`,
);`;

const STEPS: RunnerStep[] = [
  {
    title: "Provision DB",
    caption:
      "Spin up a temporary Prisma Postgres database with a 1 hour TTL and connect over pg.",
    lines: { from: 1, to: 10 },
    output: [
      "Provisioning a temporary Prisma Postgres database (1h TTL)...",
      "   claim URL: https://create-db.prisma.io/claim?projectID=...",
    ],
  },
  {
    title: "Schema + bloom extension",
    caption:
      "Enable the bloom extension once per database, then create the wide cache_entries table.",
    lines: { from: 12, to: 21 },
    output: ["Creating cache_entries table and enabling bloom extension..."],
  },
  {
    title: "Seed 10,000 rows",
    caption:
      "Insert a mix of tenants, users, endpoints, locales, regions, and api versions so the lookups are realistic.",
    lines: { from: 23, to: 28 },
    output: ["Seeding 10,000 rows...", "   seeded in 1.2s"],
  },
  {
    title: "A: Six B-tree indexes",
    caption:
      "One B-tree per filterable column. Measure the total index size and the time for three lookups.",
    lines: { from: 30, to: 35 },
    output: [
      "",
      "A. Six B-tree indexes (one per column)...",
      "   index size: 0.5 MB",
      "   3 lookups:  306.5 ms",
    ],
  },
  {
    title: "B: One bloom index",
    caption:
      "Drop the B-trees and create a single bloom index spanning all six columns. Same three lookups.",
    lines: { from: 37, to: 43 },
    output: [
      "",
      "B. One bloom index (all six columns)...",
      "   index size: 0.2 MB",
      "   3 lookups:  302.7 ms",
    ],
  },
  {
    title: "Compare",
    caption:
      "Print the difference. The bloom index is much smaller, and it covers any subset of those six columns.",
    lines: { from: 45, to: 49 },
    output: [
      "",
      "   Bloom index is 60% smaller (0.2 MB vs 0.5 MB),",
      "   and one index covers any subset of those six columns.",
    ],
  },
];

export async function BloomDemoRunner() {
  const baseCode = (await highlight(
    { value: SOURCE, lang: "typescript", meta: "" },
    "github-from-css",
  )) as HighlightedCode;
  return <BloomDemoRunnerClient baseCode={baseCode} steps={STEPS} />;
}
