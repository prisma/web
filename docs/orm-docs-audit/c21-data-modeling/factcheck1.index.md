Done. Page: `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/apps/docs/content/docs/orm/data-modeling/index.mdx`

## 1. Wording changes (banned terms + page conventions)

| Line | Old | New |
|---|---|---|
| 13 | "you define this structure in a `contract.prisma` file. This file becomes the shared contract between your application code, your database migrations, and your developer tools." | "you define this structure in your contract, the `contract.prisma` file that replaced `schema.prisma`. Prisma ORM derives your TypeScript types, your migrations, and the client's configuration from it." |
| 15 | "If you are coming from Prisma ORM 7, `contract.prisma` plays a similar role to the `schema.prisma` file you used before." | deleted (the required first-use phrasing now covers it) |
| 17 | "This page introduces the four building blocks of every Prisma ORM contract:" | "Every contract is built from four things:" |
| 24 | "...the [relational] and [MongoDB] guides cover that in depth." | "All four apply to every database. How you model relations is where databases differ, so continue with [relational data modeling] or [MongoDB data modeling]." |
| 38 | "its own lifecycle" | "its own history" |
| 61 | "`ObjectId` is the idiomatic type for it" | "it must be an `ObjectId`" |
| 76 | "an opaque number" | "a meaningless number" |
| 124 (code comment) | "the idiomatic MongoDB key" | "the MongoDB key" |
| 143 | "Avoid composite keys on ordinary models ... has to carry all of the key's fields" | "Avoid composite keys for ordinary models ... has to store all of the key's fields" (`keys on` and `carry` both hit the checker) |
| 205 | "Widening a type later is a migration; the wider type today is free." | split into two sentences |
| 215–216 | "a real column or document field"; "It stores nothing itself; it tells Prisma ORM how to navigate" | "The field that stores the other record's primary key..."; "It stores nothing in the database. It tells Prisma ORM how to follow the connection in a query." |
| 236 | "junction tables" | "the model for the join table" |
| 241 | "Projects scaffolded with `create-prisma@latest` install..." | "Projects created with `npm create prisma@latest` include the [Prisma ORM skills](...) for your coding agent. In an existing project, run `npx prisma skills sync`." |
| 251 | "single-collection polymorphism" | "polymorphic collections" (matches the target page's heading) |
| 252 | "once the schema is in place" | "once your contract is in place" |

No heading was renamed, so no anchors were pinned.

## 2. Claims checked

| Line | Claim | Source | Verdict |
|---|---|---|---|
| 13 | contract is the shared contract for app code, migrations, tools | `skills/prisma-8/references/contract.md:5` ("derives types, migrations, and runtime configuration") | **Corrected** → now names TypeScript types, migrations, client configuration |
| all | examples need `// use prisma-8` | `packages/1-framework/3-tooling/language-server/src/schema-directive.ts:1`; no reference in `psl-parser/src/` or either `contract-psl/src/` | **Confirmed** (not needed). It is a language-server marker. The contract-authoring pages show it only on whole-file blocks (`psl-syntax.mdx:15,59`); this page's blocks are fragments, matching that convention. No change. |
| 32,48 | `Int @id @default(autoincrement())` | `cli/src/commands/init/templates/code-templates.ts:106,172` | Confirmed |
| 32 | `autoincrement()` exists as a default function | `3-targets/6-adapters/postgres/src/core/control-mutation-defaults.ts:131-137` | Confirmed |
| — | what `autoincrement()` becomes on PostgreSQL | `postgres/src/core/migrations/planner-ddl-builders.ts:61-71` → `SERIAL` (int4), `BIGSERIAL`, `SMALLSERIAL`; no `DEFAULT` clause | Confirmed. Page's "the database assigns the value, so you only know it after the insert" holds. |
| 34 | `String?` optional modifier | `code-templates.ts:172-180` | Confirmed |
| 55,127 | `ObjectId @id @map("_id")` | `2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:1322-1335` (model *must* declare it) | Confirmed |
| 57,129 | `@@map("users")` for the collection | `mongo-attribute-specs.ts:143,249`; `code-templates.ts:196-210` | Confirmed |
| 44 | "Every model needs one" | SQL: `contract-psl/src/interpreter.ts:763` allows no primary key, but `sql-orm-client/src/collection.ts:2422` — update/delete require a primary key or unique. MongoDB: required. | **Corrected** → "Give every model one, because Prisma ORM needs a primary key to update or delete a record." |
| 61 | MongoDB primary key is `_id`, type `ObjectId` | `mongo interpreter.ts:1327-1335` | Confirmed (strengthened from "idiomatic" to "must be") |
| 71 | `String @id` (natural key) | `contract-psl/src/psl-field-resolution.ts:642,651` (only lists and optionals are rejected) | Confirmed |
| 89,94 | `String @unique` | `code-templates.ts:173` | Confirmed |
| 117 | `String @id @default(uuid())` | `control-mutation-defaults.ts:140-141` (`uuid()`, `uuid(4)`, `uuid(7)`); `1-framework/2-authoring/ids/src/index.ts:62-64` — `uuidv4` applies to `pg/text@1` | Confirmed |
| 117 | UUID "generated before the insert" | `control-mutation-defaults.ts:73-80` returns an *execution* generator, not a column default | Confirmed |
| 141 | `@@id([userId, tagId])` | `interpreter.ts:944-953`; `examples/prisma-8-demo/.../contract.prisma` `PostTag` | Confirmed |
| 172 | `String[]` scalar list on PostgreSQL | `psl-field-resolution.ts:497-500` requires the `scalarList` capability; `3-targets/6-adapters/postgres/src/core/adapter.ts:38` and `descriptor-meta.ts:192` report `scalarList: true` | Confirmed |
| 151 | `String` → text | `control-mutation-defaults.ts:166-169` | Confirmed |
| 152 | `Int` 32-bit | same, `pg/int4@1` / `int4` | Confirmed |
| 153 | `BigInt` 64-bit | same, `pg/int8@1` / `int8` | Confirmed |
| 154 | `Float` | same, `pg/float8@1` / `float8` | Confirmed |
| 155 | `Decimal` = PostgreSQL `numeric`, value is a decimal string | `control-mutation-defaults.ts:184-187`; `postgres/src/core/codecs.ts:896-901` (app type `string`) | Confirmed |
| 155 | `Numeric(10, 2)` written as the type | `control-mutation-defaults.ts:228-244` (`Numeric` native type, `precision`/`scale` args) | Confirmed |
| 155 | PostgreSQL rounds to scale and rejects over precision | Not in the Prisma source (PostgreSQL behaviour) | **Q1** — kept, see below |
| 156 | `Boolean` | `control-mutation-defaults.ts:170-173` (`pg/bool@1` / `bool`) | Confirmed |
| 157 | `DateTime` = timestamp | `control-mutation-defaults.ts:188-191` → `pg/timestamptz-temporal@1` / `timestamptz`; `temporal-codecs.ts:139-143` app type `Temporal.Instant` | **Corrected** → cell now says "Timestamp, PostgreSQL `timestamptz`" and the note says the value reaches your code as a `Temporal.Instant` |
| 158 | `Bytes` = `bytea`, value is `Uint8Array` | `codecs.ts:1164-1178` | Confirmed |
| 159 | `Json` = native `json` | `control-mutation-defaults.ts:192-195` | Confirmed |
| 160 | `Jsonb` = `jsonb`, used by `field.json()` and value objects | `control-mutation-defaults.ts:196-199`; `postgres/src/core/authoring.ts:721-726` (`json` field preset → `pg/jsonb@1`); `6-adapters/postgres/src/exports/control.ts:15` `valueObjectStorageType: 'Jsonb'` | Confirmed |
| 160 | "what a `Json` field meant before 0.17" | page-conventions bans pre-release version references | **Corrected** → clause removed |
| 161 | `ObjectId` = MongoDB document identifier | `mongo contract-psl/src/interpreter.ts:981` | Confirmed |
| 165 | `Jsonb` filters by whole-value equality; `Json` has no comparison | `postgres/src/core/codecs.ts:1417-1421` (`Jsonb` traits `['equality']`) and `1373-1377` (`Json` traits `[]`); `sql-orm-client/src/types.ts:361-395` maps `eq`/`neq`/`in`/`notIn` to `equality`, `gt`/`lt`/… to `order`, `like` to `textual`; `sql-orm-client/src/filters.ts:81-85` throws without the trait | Confirmed |
| 167 | extensions add types such as vectors or geometry | `examples/prisma-8-demo/.../contract.prisma` `pgvector.Vector(1536)`; `examples/prisma-8-postgis-demo/.../contract.prisma` `postgis.Geometry(4326)` | Confirmed |
| 171 | `?` optional | `code-templates.ts:173-175` | Confirmed |
| 218,224 | `@relation(fields:, references:)` and what the two arguments mean | `code-templates.ts:186-188`; `2-sql/2-authoring/contract-psl/src/psl-relation-resolution.ts:431-432` | Confirmed |
| 228-232 | relations come in three shapes, incl. many-to-many | `psl-relation-resolution.ts:308-323,400-418` — many-to-many is recognised, but only through an explicit join model whose `@@id([...])` lists exactly its two foreign-key columns; implicit many-to-many is rejected with `PSL_ORPHANED_BACKRELATION` ("or use an explicit join model for many-to-many") | Confirmed as a shape. The requirement is carried by the wording change on line 236 ("the model for the join table") and belongs to the relational page. |
| 241 | `create-prisma@latest` scaffolds and installs skills | conventions.md mandates `npm create prisma@latest`; `ai/tools/skills.mdx:104` | **Corrected** to the mandated sentence |
| 241 | `prisma-8` skill covers contract authoring | `wip/prisma-src/skills/` contains exactly one skill, `prisma-8`, with `references/contract.md` | Confirmed |
| 241 | `/ai/tools/skills#available-skills-for-prisma-8` | `apps/docs/content/docs/ai/tools/skills.mdx:100` declares `[#available-skills-for-prisma-8]` | Confirmed |
| 24,236,250 | `/orm/data-modeling/relational-databases` | file exists, `url:` matches | Confirmed |
| 24,237,251 | `/orm/data-modeling/mongodb` | file exists, `url:` matches | Confirmed |
| 165 | `/orm/reference/raw-queries` | file exists, `url:` matches | Confirmed |
| 252 | `/orm/fundamentals/reading-data` | file exists, `url:` matches | Confirmed |

## 3. Q list

**Q1 (line 155, now in the note under the table):** "PostgreSQL then rounds stored values to that scale and rejects values that exceed the precision." This is PostgreSQL server behaviour, not Prisma behaviour, and the Prisma source neither states nor contradicts it. Searches run inside `wip/prisma-src`: `grep -rn "precision" packages/3-targets/6-adapters/postgres/src/core/control-mutation-defaults.ts` (only the arg schema, `minimum: 1`/`minimum: 0`), `grep -rn "class PgNumericCodec" -A 14 packages/3-targets/3-targets/postgres/src/core/codecs.ts` (encode passes the string through unchanged, no rounding), `grep -rn "numeric" packages/3-targets/3-targets/postgres/src/core/psl-infer/postgres-type-map.ts`. Left in the page for the operator to decide.

Also worth flagging, not a Q: `Decimal` and `DateTime` have no entry in `postgres-type-map.ts`, which is the *introspection* direction only (`numeric` → `Numeric`, `timestamptz` → `Timestamptz`). The authoring direction in `control-mutation-defaults.ts` does define both, which is what the page describes.

## 4. Line count

252 before, 252 after. `check-plain.sh` prints `plain-language check: clean`, and the extra page-conventions word list has no hits.