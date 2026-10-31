# Reader round 2: `orm/contract-authoring/advanced-postgresql.mdx` (2026-10-22, Opus, Prisma ORM 7 reader persona)

## Sentences I could not restate after one reading

1. The opening sentence holds what the page covers and three commands; "writes the contract files" is unclear when `contract.prisma` was just called the contract.
2. The eight-character hash explains mechanism; all I need is that the real name gets a suffix and a rename does not rebuild.
3. "`map:` sets the exact name instead, for an index that already exists": can I use `map:` on a new index? The later drift warning leaves an existing index I did not infer unresolved.
4. `external` "extra columns and constraints are ignored" against `tolerated` "extra columns are accepted": I cannot tell "ignored" from "accepted".
5. The guidance for `external` versus `observed` does not let me pick for my own table.
6. "Extension" means a PostgreSQL extension and a Prisma extension package in one sentence; `installExtension` versus `createExtension` is not explained.
7. The `PN_EXACT_NAME_BODY_COMPARISON` sentence is internal mechanics; does it appear on every `emit`?
8. "Variant" and `@@base` are never introduced.

## Words I had to guess

"contract files", `Uuid`, `@onCreate(uuid())` (does `@default(uuid())` still work?), `namespace unbound` and which schema `Document` is in, what goes inside `role app_user {}`, `permissive`, "role-bound clients", `"pg/text@1"`, `tx.orm.public.Document`, the parentheses in `` sql`(done = false)` ``, `migrations/app/`, `operationClass: 'widening'` and the other `rawSql` fields, "drift", "PSL", `@noCheck`.

## So what do I actually type?

- Two database URLs: where the one `db migrate` uses is set.
- A migration with only raw SQL: how to create the file when the contract did not change, where `rawSql` goes, where it is imported from.
- After adding `createExtension`: run anything again? Would a later `migration plan` overwrite the edit? The excerpt does not show the class.
- Where `db` comes from in the `set_config` snippet.
- Which privilege lets `db migrate` create extensions.
- The table name for `Order`, which has no `@@map`.
- The TypeScript type of a `Raw(sql`citext`)` column.

## Other things that tripped me

The two-kinds-of-default paragraph comes before any example. The row-level security example allows `SELECT` and `UPDATE` but the `GRANT` includes `INSERT` and `DELETE`. `order_total_positive` allows `0`. The forward link to Limitations for the raw SQL step did not say how to create one.

## Could I do what the page is for?

Indexes, checks, and `@@control`: mostly. Row-level security: not end to end (the two connections, the raw-SQL-only migration, `"pg/text@1"` and `db`). The `citext` extension: probably, with three unknowns. Adopting from an existing database: yes, for `public`.
