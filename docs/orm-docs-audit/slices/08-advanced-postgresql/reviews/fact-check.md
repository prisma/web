# Fact re-check: `orm/contract-authoring/advanced-postgresql.mdx` (2026-10-22, Opus)

Sources: prisma/orm at `v8.0.0-rc.19` (`rc19:` paths), the rc.18 and rc.19 release notes, the linked docs pages, and the PostgreSQL 15 manual (fetched) for the PostgreSQL facts. 206 lines before and after.

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| The loop ends with plain `npx prisma db migrate` | `orm/migrations/generating-a-migration.mdx:115,146`: development needs `--advance-ref db` or the next plan repeats the work | "then `npx prisma db migrate --advance-ref db`, which applies it to your development database" |
| Open the migration and add `createExtension` | `orm/migrations/editing-a-migration.mdx:11-17`: an edit does not run until the file is recompiled into `ops.json` | "...and recompile the file as that page shows" |
| The `rawSql` step goes in a new migration | same; rc19:`cli/src/orm/migration/new.ts:66-70` | added "Recompile the file afterwards, as Editing a migration shows" |
| The Supabase extension "connects as the right role" | rc19:`skills/prisma-8/references/supabase.md:28-29`: each query is bound with `set_config('role', ...)` | "runs each query as the right role for you" |
| `contract infer` writes `map:` on policies | rc19:`postgres/src/core/psl-infer/infer-policy-blocks.ts:26-31,115-127`: a policy gets `@@map` | "with `map:` (`@@map` on a policy)" |
| A warning for every `map:` object | rc19:`sql/1-core/contract/src/index-naming.ts:99-104,175-188`: only objects with SQL in them | "...for every policy, check, and index that has SQL in it and uses `map:` or `@@map`" |
| `contract infer` skips only policies | rc19:`infer-model-blocks.ts:131-153`: indexes and checks whose SQL does not read back unchanged are skipped too | "any index, check, or policy whose SQL it cannot read back unchanged" |

## Confirmed

`contract emit` output (`cli/src/orm/contract/emit.ts:56,72-75`); the `sql` literal rule and `PSL_VALUE_TYPE_INCOMPATIBLE` (`contract-psl/README.md:116`, `interpreter.sql-expression-places.test.ts:89-105`); `@onCreate(uuid())` on `Uuid` (`README.md:93-94`); top-level models land in `public` (rc.18 note line 122, `psl-policy-cross-namespace.test.ts:142-155`); policy and role block syntax (`authoring.ts:129,171-266`, the Supabase contracts); `"ownerId"` quoting (`psl-name-mapping.ts:16`); `migration plan` creates policies, never roles, and `db verify` fails on a missing role (`postgres-role.ts:4-11`, `supabase.md:27`); `db.connection` for the CLI and `url` in `db.ts` (`cli/configuration.mdx:24,190,238`, `transactions-and-runtime.mdx:81`); the `set_config` snippet, including returning `.all()` from the callback (`async-iterable-result.ts:3`, `sql-runtime.ts:1855`); `migration new` (`migration-new.ts:2,203,255`); the index suffix and rename-not-rebuild (`schema-ir/src/naming.ts:274`, `index-and-check-renames.ts:13-43`); `map:` versus `name:` (`index-naming.ts:150-165`); the `@@control` table (`verifier-disposition.ts:34-60`, `control-policy.ts:64-86`); `Raw` values typed `unknown` (`authoring-type-constructors.ts:4-12`); `migrations/app/` (`cli/src/orm/migration/paths.ts`); the import line, `createExtension`, and `col('email', 'citext')` (`exports/migration.ts`, `column.ts:52`, `dependencies.ts:7-22`); `installExtension` in pgvector's migration; `contract infer --db` and PostgreSQL's text (`index-attributes.ts:146-155`); every Limitations bullet and all four issue numbers open; the `rawSql` fields (`operations/raw.ts`, `shared.ts`); `widening` for a `GRANT` (`control-migration-types.ts:79-91`, a judgement); `String?[]` (rc.19 note line 64); the PostgreSQL facts (manual pages `ddl-rowsecurity`, `functions-admin`, `sql-createextension`, `citext`); all links and anchors.

## Q

None.

## Left as written

"the role a connection logs in as": the manual says the role running the query, which `SET ROLE` can change; accurate for the page's setup. The `col('email', 'citext')` call shows no options; what `migration plan` writes may add some, and the snippet is marked as an excerpt.
