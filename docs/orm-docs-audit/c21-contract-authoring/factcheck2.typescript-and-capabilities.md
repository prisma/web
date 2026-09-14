Both pages are checked and corrected. Summary below.

## typescript-schema-builder.mdx (318 lines before, 318 after)

| Line | Claim | Source that decides it | Verdict |
| --- | --- | --- | --- |
| 9 | `contract.ts` under `src/prisma`, emit writes the two files beside it | `cli/src/commands/init/templates/code-templates.ts:64`, `config/src/config-types.ts:45`, `postgres/src/config/define-config.ts:28-46`, `emitter/src/artifact-paths.ts:19` | Confirmed |
| 18 | `contract infer` writes PSL | `cli/src/orm/contract/infer.ts:83-88` | Confirmed |
| 22 | `orm init` asks how you want to write your schema | `cli/src/orm/init-inputs.ts:98-102` | Confirmed |
| 24 | `.ts` extension selects TypeScript authoring | `postgres/src/config/define-config.ts:43-45` | Confirmed |
| 27, 38, 279 | `import { definePrismaConfig } from "prisma/config"` | `cli/src/commands/init/templates/code-templates.ts:304`, `skills/prisma-8/references/contract.md:47-55`, `examples/prisma-8-demo/prisma.config.contract-ts.ts` | **Corrected** → `from "@prisma/cli-engine"`. `prisma/config` appears nowhere in rc.10. |
| 50 | Builder import paths | `orm-postgres/package.json:81`, `orm-mongo/package.json:72` | Confirmed |
| 52 | Export named `contract` or default only | `cli/src/load-ts-contract.ts:255-267`, `sql-contract-ts/src/config-types.ts:105-113` (`CONTRACT.MODULE_EXPORT_MISSING`) | Confirmed |
| 54-93 | Whole PostgreSQL example, every helper and option | `examples/prisma-8-demo/prisma/contract.ts` (same shape), `contract-dsl.ts`, `postgres/src/core/authoring.ts` | Confirmed |
| 57 | `nativeType` / `codecId` / `@1` comment | `framework-components/src/shared/column-spec.ts:20-24` | Confirmed |
| 95-123 | MongoDB example (`collection`, `field.objectId/string/date().optional()`, `rel.hasMany("Post", {from,to})`, `User.ref("_id")`) | `mongo-family/2-authoring/contract-ts/src/contract-builder.ts:1006-1030, 1157-1164, 1362, 252-254` | Confirmed |
| 127 | PostgreSQL `defineContract(options, factory)` | `postgres/src/contract/define-contract.ts:81-103` | Confirmed (a single-object form also exists; see Q1) |
| 129 | Package also exports `field`, `model`, `rel` | `contract-dsl.ts:2102-2106` — the exported `field` is only `column`/`generated`/`namedType` | **Corrected** → now says the package exports `model` and `rel`, "plus a `field` that has only `column`, `generated`, and `namedType`". |
| 131 | MongoDB `defineContract` takes a single object | `mongo/src/contract/define-contract.ts:45-65` — a factory form exists too | **Corrected** → "also accepts a single object holding `models`, as above". |
| 133 | `_id`, no `.id()`, no `.attributes(...)` on MongoDB | `mongo .../contract-builder.ts:163-177, 222-255`; PSL requires `_id` at `mongo/contract-psl/src/interpreter.ts:1326-1335` | Confirmed (see Q2) |
| 134 | MongoDB scalar helpers | `mongo .../contract-builder.ts:1006-1030` | Confirmed |
| 135 | Collection and relations inline "rather than chained calls" | `composed-authoring-helpers.ts:113-129` — PostgreSQL `model()` also accepts inline `relations` | **Corrected** → "The collection name is an inline option on the model rather than a chained call, and relations are inline as well." |
| 136 | `{from,to}` vs `{by}`, string or `User.ref()`, `User.refs.id` | `mongo .../contract-builder.ts:372-375, 1144-1155`; `contract-dsl.ts:1456` | Confirmed |
| 137 | `indexes: [index({ email: 1 }, { unique: true })]`, `1` is ascending | `mongo .../contract-builder.ts:1062-1085`; `mongo-contract/src/contract-types.ts:5` | Confirmed |
| 139 | MongoDB `enums` and `extensions` in the same object | `mongo .../contract-builder.ts:899-910` | Confirmed |
| 147-159 | Field-helper table | `postgres/src/core/authoring.ts:678-770`, `2-sql/9-family/src/core/authoring-field-presets.ts:41-50` | Confirmed, except the UUID row |
| 158 | "UUID stored as text" | `authoring-field-presets.ts:24-49` — `sql/char@1`, `character(36)` | **Corrected** → "UUID stored in a `character(36)` column". |
| 161 | `field.column({codecId:"pg/date-temporal@1", nativeType:"date"})`; `field.column` vs `.column(name)` | `postgres/src/core/codec-ids.ts:26`, `temporal-codecs.ts:77-78`; `contract-dsl.ts:217, 505` | Confirmed |
| 163 | `field.id.*` list, generated in your app, `*Native` variants, no auto-increment helper, `defaultSql("gen_random_uuid()").id()` | `authoring-field-presets.ts:93-200`, `postgres/src/core/authoring.ts:770-800`; no auto-increment preset in either file | Confirmed |
| 165 | `createdAt` uses `now()`; `updatedAt` set in the client | `2-sql/9-family/src/core/timestamp-now-generator.ts:60-79` | Confirmed |
| 167-172 | `.optional()`, `.default()`, `.defaultSql("now()")`, `.unique()`, `.id()`, `.column()` | `contract-dsl.ts:183, 217, 313, 320, 327, 379` | Confirmed |
| 176-180 | `enumType(name, codec, ...members)`, `member()`, `.members.Low`, `enums` map | `contract/src/enum-type.ts:23-28, 153-233`; `postgres/src/contract/enum-type.ts` | Confirmed |
| 178 | `pg/int4@1` / `int4` pair | `postgres/src/core/authoring.ts:686-690` | Confirmed |
| 182-195 | `nativeEnum("Role","user","admin")`, `field.column(pg.enum(Role))`, type name = the name you give, `Role` not in `enums` | `postgres/src/contract/native-enum.ts:20-35, 88-130, 176` | Confirmed |
| 201-203 | `hasMany/hasOne({by})`, `belongsTo({from,to})`, `manyToMany({through,from,to})` | `contract-dsl.ts:2001-2100` | Confirmed |
| 211-219 | `belongsTo` alone makes no foreign key; `.sql({fk})`; the five action values | `contract-lowering.ts:299-336`; `contract-dsl.ts:843-853` | Confirmed (`fk` also accepts `constraint` and `index`, which the page does not list) |
| 221 | No column-type check across a relation | No such check in `build-contract.ts` / `contract-lowering.ts` (see Q3) | Confirmed |
| 223 | Model object vs string name; string typo caught at emit | `contract-dsl.ts:2008-2011`; `build-contract.ts:630` (`CONTRACT.MODEL_UNKNOWN`) | Confirmed |
| 229 | `.relations`, `.attributes`, `.sql` in any order | `contract-dsl.ts:1520-1610` (all three are methods on the same builder) | Confirmed |
| 231-243 | `{cols, constraints}`, `constraints.index([...])` always a list, `{unique:true}` | `contract-dsl.ts:1248-1254, 1065-1090, 816` | Confirmed |
| 245 | `constraints.foreignKey(cols.userId, User.refs.id)` | `contract-dsl.ts:1119-1150, 1456` | Confirmed |
| 247-255 | `.attributes(({fields,constraints}))`, only `id` and `uniques` | `contract-dsl.ts:1210-1213, 1228-1231` | Confirmed |
| 259-274 | `extensions: {pgvector}`, `type.pgvector.Vector(1536)`, pack name fixed by the pack, `Embedding1536` in `contract.d.ts` | `pgvector/src/core/authoring.ts:4-19`; `examples/prisma-8-demo/prisma/contract.ts:21-22` and `src/prisma/contract.d.ts:927` | Confirmed |
| 276-289 | `/pack` in the contract, `/control` in the config, `extensions` inside `ormConfig` | `orm-extension-pgvector/package.json:46-48`; `postgres/src/config/define-config.ts:21` | Confirmed |
| 295-298 | Purity rules; emit loads the file with a dynamic import and does not type-check it | `sql-contract-ts/src/config-types.ts:104` (plain `await import(...)`) | Confirmed |
| 304-306 | One contract file per config; no command converts PSL to TypeScript | `define-config.ts:16-17`; no such command under `cli/src/orm/` | Confirmed |
| 141 | "The rest of this page uses..." | page-conventions ban on docs commentary | **Corrected** → "The examples below use the PostgreSQL builder." |
| all | Every link target and anchor | Files under `apps/docs/content/docs`; `raw-queries.mdx:78`, `ai/tools/skills.mdx:100` | Confirmed |

## capabilities.mdx (96 lines before, 96 after)

| Line | Claim | Source | Verdict |
| --- | --- | --- | --- |
| 9 | Emit writes the section; you never edit it | `build-contract.ts:1577-1590` (authors can no longer declare capabilities) | Confirmed |
| 13 | Keys come from the database package and the extension packages; emit never connects | `cli/src/control-api/contract-enrichment.ts:62-84`; no connection code in `operations/contract-emit.ts` | Confirmed |
| 15-22 | `contract.json` excerpt keys | `adapters/postgres/src/core/adapter.ts:24-40`; `pgvector/src/core/descriptor-meta.ts:66-70` | Confirmed |
| 24 | Group named first; `sql` is shared | same files | Confirmed |
| 24 | "SQLite reports `false` for most of them" | `adapters/sqlite/src/core/adapter.ts:76-85` — 2 of 6 are `false` | **Corrected** → "for some of them". |
| 26-38 | `prisma.config.ts` with `extensions: [pgvector]`, `db.connection` | `postgres/src/config/define-config.ts:16-24` | Confirmed |
| 27 | `definePrismaConfig` import path | as above | **Corrected** → `@prisma/cli-engine` |
| 40 | pgvector ships a migration that installs the server extension; apply with `db migrate` | `pgvector/migrations/20260601T0000_install_vector_extension/migration.ts` | Confirmed |
| 44-50 | SQLite has no `scalarList`; the message, verbatim including the remedy line | `contract-psl/src/psl-field-resolution.ts:497-503` | Confirmed, exact match |
| 52 | `@prisma/orm-sqlite/config` exists | `orm-sqlite/package.json:63` | Confirmed |
| 54 | "when you call a method on the SQL query builder" | `sql-orm-client/src/collection-contract.ts:578-602` and `collection.ts:1063, 1350` — the ORM client raises it too | **Corrected** → "on the SQL query builder or on the ORM client". |
| 54-57 | `ORM.CAPABILITY_MISSING`, `distinctOn() requires capability postgres.distinctOn` | `sql-builder/src/runtime/builder-base.ts:278-292`; `collection-contract.ts:599-600` | Confirmed, exact match |
| 60 | Error at call time, not at await | `builder-base.ts:57-64`; `collection.ts:1063` | Confirmed |
| 60-66 | `db.contract.capabilities...`, `db.ts` written by `orm init` | `postgres/src/runtime/postgres.ts:63, 286`; `code-templates.ts:318-333` | Confirmed |
| 72-78 | Table rows | `adapters/postgres/src/core/adapter.ts:24-40`; `builder-base` gated methods `lateralJoin`/`distinctOn`; `assertReturningCapability`; `pgvector/src/core/descriptor-meta.ts:68` | Confirmed |
| 80 | "SQLite reports `false` for them"; "build-time check runs for every database"; "run-time check only on the SQL query builder" | `adapters/sqlite/src/core/adapter.ts:76-85` (returning is `true`, `scalarList` absent); no capability keys or checks anywhere under `2-mongo-family` or the mongo target | **Corrected** → "PostgreSQL reports `true` for all three `sql` keys above. SQLite reports `false` for `sql.lateral`, `true` for `sql.returning`, and has no `sql.scalarList` key at all. … The MongoDB packages report no keys, so neither check applies on MongoDB." |
| 84 | `db verify` checks tables and columns, not this section | `cli/src/control-api/operations/db-verify.ts:38-58` | Confirmed |
| all | Link targets and anchors | as above | Confirmed |

## Q list (unverifiable, page left alone)

- **Q1.** PostgreSQL `defineContract` also accepts a one-argument definition object (`postgres/src/contract/define-contract.ts:81-89`), so line 127's "takes an options object and then a function" describes only the form the page teaches. I left it, because it is true of that form, and corrected the MongoDB sentence instead. Searches: `grep -n "export function defineContract" -A 25` in both `define-contract.ts` files.
- **Q2.** No code in the TypeScript MongoDB builder requires an `_id` field. The PSL interpreter does (`interpreter.ts:1326-1335`). Searches: `grep -rn "_id" packages/2-mongo-family/2-authoring/contract-ts/src/`, `grep -rn "must declare an _id\|DOCUMENT_ID" packages --include="*.ts"`.
- **Q3.** Line 221's "Prisma ORM does not check that the column types on the two sides of a relation match" rests on absence. Searches: `grep -rn "RELATION_INVALID\|FOREIGN_KEY_INVALID" build-contract.ts contract-lowering.ts`, `grep -n "codecId\|mismatch" derived-checks.ts`. The only relation checks I found are nullability and missing `through`.

## One thing the operator should decide beyond my two pages

`prisma/config` is not an import path in rc.10. Every `prisma.config.ts` example in the section that imports `definePrismaConfig` from `prisma/config` is wrong the same way. I fixed my two pages; the other contract-authoring pages (and any CLI page with a config example) likely need the same change.