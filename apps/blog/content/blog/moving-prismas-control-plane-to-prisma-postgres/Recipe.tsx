import { highlight, type HighlightedCode } from "codehike/code";
import { RecipeClient } from "./RecipeClient";

const STEPS = [
  {
    id: "publication",
    title: "Publish the tables by name",
    file: "01-publication.sql",
    body: "On the source, as the role that owns the tables. Check first that every table has a primary key, which logical replication needs to match rows for updates and deletes. The migration history table is left out of the publication on purpose: the target already has it. A dedicated login does the reading, so no application password ever lives on the new side.",
    code: `-- RDS, as the owner of the tables
SELECT c.relname AS table_without_primary_key
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND NOT EXISTS (SELECT 1 FROM pg_index i
                  WHERE i.indrelid = c.oid AND i.indisprimary);
-- expect no rows

CREATE ROLE migration_repl WITH LOGIN PASSWORD '<password>';
GRANT rds_replication TO migration_repl;
GRANT USAGE ON SCHEMA public TO migration_repl;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO migration_repl;

DO $$
DECLARE tables text;
BEGIN
  SELECT string_agg(quote_ident(tablename), ', ' ORDER BY tablename)
    INTO tables
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename <> '_prisma_migrations';
  EXECUTE 'CREATE PUBLICATION app_migration FOR TABLE ' || tables;
END $$;

SELECT count(*) FROM pg_publication_tables
WHERE pubname = 'app_migration';   -- 82`,
  },
  {
    id: "subscription",
    title: "Subscribe and start the copy",
    file: "02-subscription.sql",
    body: "On the target. Prove the network path and the login first with a dblink query, the Postgres extension that lets one database run a query on another. Then create the subscription, which creates the replication slot on the source and starts the initial copy. From here Postgres does the work; our job is to watch it.",
    code: `-- Prisma Postgres
CREATE EXTENSION IF NOT EXISTS dblink;

SELECT n FROM dblink(
  'host=<rds host> port=5432 dbname=app user=migration_repl password=<password> sslmode=require',
  'SELECT count(*) FROM "Project"') AS t(n bigint);
-- a number means the path and the grants work

CREATE SUBSCRIPTION app_migration
  CONNECTION 'host=<rds host> port=5432 dbname=app
              user=migration_repl password=<password>
              sslmode=require'
  PUBLICATION app_migration
  WITH (copy_data = true,
        create_slot = true,
        slot_name = 'app_migration');`,
  },
  {
    id: "watch",
    title: "Watch the copy, not the clock",
    file: "03-progress.sql",
    body: "Tables move through i (waiting), d (copying), f and s (catch-up) and r (ready). The two error counters must stay at zero. On the source, the slot shows how much WAL it is holding on to.",
    code: `-- Prisma Postgres
SELECT srsubstate AS state, count(*)
FROM pg_subscription_rel
GROUP BY 1 ORDER BY 1;

SELECT apply_error_count, sync_error_count
FROM pg_stat_subscription_stats;

SELECT now() - latest_end_time AS last_report_age
FROM pg_stat_subscription;

-- RDS
SELECT slot_name, active, wal_status,
       pg_size_pretty(
         pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
       ) AS wal_pinned
FROM pg_replication_slots
ORDER BY 1;`,
  },
  {
    id: "verify",
    title: "Compare every table in one query",
    file: "04-verify.sql",
    body: "ANALYZE first, because the initial copy leaves no planner statistics behind and later queries would plan badly. Then count every table on both sides through dblink and return only the mismatches. An empty result is the answer you want.",
    code: `-- Prisma Postgres
ANALYZE;

SELECT p.tablename, r.rows AS rds_rows, p.rows AS ppg_rows
FROM (
  SELECT tablename,
         (xpath('/row/n/text()', query_to_xml(
            format('SELECT count(*) AS n FROM %I', tablename),
            false, true, '')))[1]::text::bigint AS rows
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename <> '_prisma_migrations'
) p
JOIN dblink(
  'host=<rds host> user=migration_repl password=<password> sslmode=require',
  $q$ SELECT tablename,
             (xpath('/row/n/text()', query_to_xml(
                format('SELECT count(*) AS n FROM %I', tablename),
                false, true, '')))[1]::text::bigint
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename <> '_prisma_migrations' $q$
) AS r(tablename text, rows bigint) USING (tablename)
WHERE r.rows <> p.rows;   -- expect no rows

-- spot check: same hash on both sides for slow-moving tables
SELECT md5(string_agg(x::text, '|' ORDER BY id))
FROM "Organization" x;`,
  },
  {
    id: "rollback",
    title: "Rollback slot, then reverse",
    file: "05-rollback.sql",
    body: "The reverse publication can exist any time before; it retains nothing. The slot is created minutes before the cutover, because it pins WAL from that moment. After the old side goes quiet, drop the forward subscription and subscribe the old side to the new one with copy_data off and origin = none, so only the application's own writes travel back.",
    code: `-- Prisma Postgres, any time before the cutover
DO $$
DECLARE tables text;
BEGIN
  SELECT string_agg(quote_ident(tablename), ', ' ORDER BY tablename)
    INTO tables
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename <> '_prisma_migrations';
  EXECUTE 'CREATE PUBLICATION rollback FOR TABLE ' || tables;
END $$;

-- Prisma Postgres, minutes before the merge
SELECT pg_create_logical_replication_slot(
  'rollback', 'pgoutput');

-- Prisma Postgres, once the old side is quiet
DROP SUBSCRIPTION app_migration;
-- RDS
DROP PUBLICATION app_migration;

-- RDS: subscribe the other way round
CREATE SUBSCRIPTION rollback
  CONNECTION 'host=<prisma postgres host> port=5432
              dbname=postgres user=<role> password=<...>'
  PUBLICATION rollback
  WITH (copy_data = false,
        create_slot = false,
        slot_name = 'rollback',
        origin = none);`,
  },
];

export async function Recipe() {
  const codes = (await Promise.all(
    STEPS.map((s) => highlight({ value: s.code, lang: "sql", meta: "" }, "github-from-css")),
  )) as HighlightedCode[];
  return (
    <RecipeClient
      steps={STEPS.map(({ id, title, file, body }) => ({ id, title, file, body }))}
      codes={codes}
    />
  );
}
