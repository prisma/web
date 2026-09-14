Done. Report below.

## 1. Banned-term and wording replacements

| Line | Old | New |
| --- | --- | --- |
| 9 | "author the Prisma ORM [data contract]"; "usually `prisma/contract.prisma`"; "[`contract emit`] turns it into" | "author [your contract], the `contract.prisma` file that replaced `schema.prisma`"; "usually `src/prisma/contract.prisma`"; "[`prisma contract emit`] writes `contract.json` and `contract.d.ts` beside it" |
| 11 | "This page covers the shared basics briefly and the Prisma ORM 8 additions in detail: …" | "The Prisma ORM 8 additions are …" (docs-about-docs commentary cut) |
| 102 | "Run `npx prisma@latest contract emit` … to refresh the artifacts." | "Run `npx prisma contract emit` … to refresh the two files." |
| 106 | "names the source of truth" | "names the one file Prisma ORM reads" |
| 130 | "Scaffolded projects … already contain this wiring and a starter schema." | "Projects created with `npm create prisma@latest -- my-app` already have this config and a starter contract file." |
| 136–137 | semicolons joining clauses | split into separate sentences |
| 139 | "sets a field's physical name" | "sets a field's column name in the database" (and split the semicolon) |
| 153 | "an ordinary column; pick its type" | "an ordinary column. Pick its type" |
| 165 | "map it to the physical `_id` key" | "map it to `_id`" |
| 181 | "written in type position like this" | "written as the type" |
| 185 | "declares its storage codec with `@@type`" | "declares how its values are stored with `@@type`" |
| 200 | "a structured value that belongs to its parent record and has no identity or table of its own" | "a structured value stored inside its parent row, with no table of its own" (convention wording) |
| 216 | one sentence interleaving PostgreSQL and MongoDB; semicolon | separate sentences per database |
| 220 | semicolon joining clauses | split |
| 233 | "an explicit join model" | "an explicit model for the join table" |
| 256 | "The emitted contract records" | "`contract.json` records" |
| 285 | "constructor expressions"; "Compose the pack in the config" | "constructor calls"; "Add the pack to the config" |
| 311 | "fails the emit with a diagnostic" | "fails with an error whose `code` is `CONFIG.MISSING_EXTENSION_PACKS`" |
| 321 | "Projects scaffolded with `create-prisma@latest` install …" | convention sentence: "Projects created with `npm create prisma@latest` include the [Prisma ORM skills] …; in an existing project, run `npx prisma skills sync`." Also "covers this page" → "covers PSL authoring". |
| 329 | "Emit and inspect [the artifacts] the schema produces." | "Run `npx prisma contract emit` and inspect [the two files it writes]." |

No heading was renamed, so no anchors were pinned. One misplaced paragraph (the "For which shape to choose…" sentence, previously stranded under "Starting from an existing database") was moved to the end of the Relations section.

`check-plain.sh` prints **clean**. The extra page-convention words are gone (the only remaining "artifact" is inside a URL).

## 2. Claim-by-claim check

All line numbers are for the edited file. Source paths are relative to `wip/prisma-src/` (prisma/orm at `cfccb09be2`).

| Line | Claim | Deciding source | Verdict |
| --- | --- | --- | --- |
| 9 | Contract file is `contract.prisma`; default location | `packages/1-framework/1-core/config/src/config-types.ts:45` (`DEFAULT_CONTRACT_SOURCE_DIR = 'src/prisma'`), `cli/src/commands/init/templates/code-templates.ts:63-68` | Corrected → `src/prisma/contract.prisma` (also lines 15, 59, 114, 125, 296, 302) |
| 9 | `contract emit` writes `contract.json` and `contract.d.ts` | `packages/1-framework/3-tooling/emitter/src/generate-contract-dts.ts`, `packages/3-extensions/postgres/src/config/define-config.ts:28-41` (output derived beside the source) | Confirmed |
| 16, 60 | `// use prisma-8` header line | `packages/1-framework/3-tooling/language-server/src/schema-directive.ts:1`; scaffold `code-templates.ts:165,197` | Confirmed |
| 18-20 | `types { ShortName = VarChar(35) }` | `contract-psl/test/interpreter.types.test.ts:33-70` (`Slug = VarChar(191)` → `sql/varchar@1`) | Confirmed |
| 22-27, 62-67 | `type Address { … }` value-object block | `contract-psl/test/interpreter.value-objects.test.ts:46-70`; mongo `2-mongo-family/2-authoring/contract-psl/test/interpreter.attribute-specs.test.ts:140` | Confirmed |
| 29-34 | `enum Priority { @@type("pg/text@1") Low = "low" … }` | `contract-psl/test/interpreter.enum.test.ts:125-150` (same schema verbatim) | Confirmed |
| 37, 47 | `Uuid @id @default(uuid())` | `contract-psl/test/interpreter.defaults.test.ts:152-200`; `3-targets/6-adapters/postgres/src/core/control-mutation-defaults.ts:276` | Confirmed |
| 38, 48 | `String` scalar | `control-mutation-defaults.ts:164` | Confirmed |
| 39, 51 | `DateTime @default(now())` | `control-mutation-defaults.ts:188`; `interpreter.defaults.test.ts:136-142` (storage default `now()`) | Confirmed |
| 40, 82 | `address Address?` (optional value object) | `interpreter.value-objects.test.ts:112-155` | Confirmed |
| 41, 83 | `posts Post[]` navigation list | `contract-psl/README.md` ("Relation navigation lists are supported") | Confirmed |
| 43, 55, 85, 98 | `@@map("user")` / `@@map("posts")` | `contract-psl/README.md`; `interpreter.polymorphism.test.ts:161-190` | Confirmed |
| 48 | `title ShortName` (alias in field position) | `interpreter.types.test.ts:40-60` | Confirmed |
| 50 | `priority Priority @default(Low)` | `interpreter.enum.test.ts:863-885` (`@default(Low)` → stored `"low"`) | Confirmed |
| 53, 95 | `@relation(fields: [...], references: [...])` | `interpreter.relations.test.ts`; mongo `interpreter.test.ts:355-385` | Confirmed |
| 70 | `@@type("mongo/string@1")` | `3-mongo-target/2-mongo-adapter/src/core/codec-ids.ts:2` | Confirmed |
| 77, 91 | `ObjectId @id @map("_id")` | mongo `interpreter.test.ts:146,358`; `2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:1320-1331` | Confirmed |
| 93 | `DateTime` on MongoDB | mongo `interpreter.test.ts:45` (`mongo/date@1`) | Confirmed |
| 97 | `@@index([authorId])` on MongoDB | mongo `interpreter.attribute-specs.test.ts:169`, `interpreter.polymorphism.test.ts:476` | Confirmed |
| 102 | Re-run emit after every change | `page-conventions.md` + emit pipeline | Confirmed |
| 106 | A `.prisma` extension selects PSL authoring | `3-extensions/postgres/src/config/define-config.ts:42-50` (`.ts` → TypeScript, otherwise PSL) | Confirmed |
| 110 | `defineConfig as ormConfig` from `@prisma/orm-postgres/config` | `packages/9-public/@prisma/orm-postgres/package.json:69`; `postgres/src/config/define-config.ts:35` | Confirmed |
| 121 | `@prisma/orm-mongo/config` | `packages/9-public/@prisma/orm-mongo/package.json:60`; `mongo/src/config/define-config.ts` | Confirmed |
| 109, 120, 290 | `definePrismaConfig` from `"prisma/config"` | see Q1 | **Q** |
| 112-116 | `definePrismaConfig({ orm: ormConfig({ contract }) })` envelope | `code-templates.ts:302-313`; `skills/prisma-8/references/contract.md:47` | Confirmed |
| 130 | Scaffolded projects already have the config and a starter contract | `code-templates.ts:69-78` (`starterSchema`), `:299-313` (`configFile`) | Confirmed |
| 136 | `@id` / `@@id([a, b])` | `contract-psl/README.md`; `interpreter.relations.many-to-many.test.ts:52` | Confirmed |
| 137 | `@unique` / `@@index([...])` | `contract-psl/README.md` (`@@index` parameter surface); `interpreter.relations.one-to-one.test.ts:37` | Confirmed |
| 138 | `@default(now())` becomes a column default; `@default(uuid())` is applied by Prisma ORM before each write and appears in `execution` | `interpreter.defaults.test.ts:79-148`; `contract-psl/README.md` ("Execution defaults: `uuid()` …", "This is application-side") | Corrected (dropped the unsupported clause "so they work the same on every database"; "rather than as DDL" → "rather than as a column default") |
| 139 | `@map` sets the column name, `@@map` the table or collection name | `contract-psl/README.md` responsibilities list | Confirmed |
| 147-153 | PostgreSQL ID tab: `id Uuid @id @default(uuid())`, ordinary column | `interpreter.defaults.test.ts:152-200` | Confirmed |
| 159-165 | MongoDB ID tab: `id ObjectId @id @map("_id")`, is `_id` | `2-mongo-family/.../interpreter.ts:1318-1332` | Confirmed |
| 175-179 | `types` block declares reusable aliases | `interpreter.types.test.ts:33-80` | Confirmed |
| 181 | Alias binds `varchar(35)` rather than `text`; `VarChar(35)`, `Uuid`, `Timestamptz` usable directly | `control-mutation-defaults.ts:205-276` (`postgresNativeAuthoringTypes`) | Confirmed |
| 185 | `@@type` declares storage; member values optional | `interpreter.enum.test.ts:624-800` | Corrected → added "Leave `@@type` out and Prisma ORM infers it from the member values", since rc.10 infers the codec from bare, string, or integer members (`interpreter.enum.test.ts:624,650,676`) |
| 196 | `pg/text@1` stores values as `text` | `control-mutation-defaults.ts:164-167`; `interpreter.enum.test.ts:125` | Confirmed (added the convention gloss "the PostgreSQL type plus a version, always `@1` today") |
| 196 | A bare member stores the member name | `interpreter.enum.test.ts:624-647` (`values: ['Admin', 'User']`) | Confirmed |
| 196 | Allowed values enforced with a `CHECK` constraint on each column | `interpreter.enum.test.ts:803-825` (`"priority" IN (1, 10)`); `3-targets/3-targets/postgres/src/core/migrations/operations/constraints.ts:157` | Confirmed |
| 200 | `type` block = value object, no table of its own | `interpreter.value-objects.test.ts:46-78` | Confirmed |
| 216 | PostgreSQL: single `jsonb` column | `interpreter.value-objects.test.ts:112-165` (`pg/jsonb@1`) | Confirmed |
| 216 | MongoDB: embedded document | `2-mongo-family/2-authoring/contract-psl/src/derive-json-schema.ts:56-87` (`bsonType: 'object'`) | Confirmed |
| 216 | `contract.d.ts` types it as a structured object | `emitter/src/domain-type-generation.ts:607-640`; `generate-contract-dts.ts:100-110` | Confirmed |
| 220-231 | Relation shape: FK side declares the scalar field, other side the list | `contract-psl/README.md`; `interpreter.relations.test.ts` | Confirmed |
| 233 | Many-to-many needs an explicit join-table model whose primary key covers both foreign keys | `interpreter.relations.many-to-many.test.ts:35-60` and `:602-636` (`PSL_JUNCTION_ID_NOT_FK_COVERING`) | Confirmed (wording made precise: "Its primary key must cover both foreign keys") |
| 244-253 | `@@id([postId, tagId])` on the join model | same test, line 52 | Confirmed |
| 256 | Relation recorded as `N:M` with the join table's columns | `interpreter.relations.many-to-many.test.ts:63,77` (`cardinality: 'N:M'`, `through: {...}`) | Confirmed |
| 260-279 | `@@discriminator(type)` on the base, `@@base(Task, "bug")` on the variant | `interpreter.polymorphism.test.ts:68-130` | Confirmed |
| 281 | PostgreSQL: variant with its own `@@map` gets its own table sharing the base primary key | `interpreter.polymorphism.test.ts:161-232` (variant table has the base PK column, `primaryKey: ['id']`, FK to the base) | Confirmed |
| 281 | PostgreSQL: without `@@map`, variant fields are nullable columns in the base table | `interpreter.polymorphism.test.ts:131-160, 404-455` | Confirmed |
| 281 | MongoDB: variants stay in the base collection, so no `@@map` of their own | `2-mongo-family/.../interpreter.ts:460-483` (`PSL_MONGO_VARIANT_SEPARATE_COLLECTION`) | Confirmed |
| 285 | Extension packs contribute types via constructor calls in `types {}` | `contract-psl/README.md`; `psl-parser/test/parse-leaf.test.ts:432` | Confirmed |
| 289 | `import pgvector from "@prisma/orm-extension-pgvector/control"` | `packages/9-public/@prisma/orm-extension-pgvector/package.json` exports `"./control"`; `skills/prisma-8/SKILL.md:36` maps `@internal/` → `@prisma/orm-` | Confirmed |
| 295 | `extensions: [pgvector]` | `postgres/src/config/define-config.ts:21,36` | Confirmed |
| 302-303 | `Embedding1536 = pgvector.Vector(1536)` | `3-extensions/pgvector/src/core/authoring.ts:4-19`; `pgvector/src/contract.ts:34` | Confirmed |
| 313 | A type from an unlisted pack fails emit | `1-framework/1-core/errors/src/control.ts:350-370` | Corrected → now names the code `CONFIG.MISSING_EXTENSION_PACKS` |
| 317 | `contract infer` reads the live schema and writes a starter `contract.prisma` | `cli/src/orm/contract/paths.ts:4-24`; `cli/src/orm/contract/infer.ts:87-89` | Confirmed |
| 321 | Skills note | `page-conventions.md`; `skills/prisma-8/SKILL.md` | Corrected to the mandated sentence |
| 324 | "composite unique constraint on userId and title" is expressible | `interpreter.relations.one-to-one.test.ts:37` (`@@unique([a, b])`) | Confirmed |
| 329-331 | Next-steps link targets exist | `apps/docs/content/docs/orm/contract-authoring/the-contract-artifact.mdx`, `typescript-schema-builder.mdx`, `cli/db-init.mdx`, `cli/migration-plan.mdx`, `cli/contract-emit.mdx`, `cli/contract-infer.mdx` all present | Confirmed |
| 216, 281 | Anchors `#embed-or-reference`, `#polymorphic-relations`, `#available-skills-for-prisma-8` | headings in `orm/data-modeling/mongodb.mdx:28`, `relational-databases.mdx:166`, `ai/tools/skills.mdx:100` | Confirmed |

## 3. Q list

**Q1 — `import { definePrismaConfig } from "prisma/config"` (lines 109, 120, 290).** Every occurrence in the rc.10 tree imports it from `@prisma/cli-engine`, never from `prisma/config`: `cli/src/commands/init/templates/code-templates.ts:304`, `templates/quick-reference-postgres.md:43`, `quick-reference-mongo.md:45`, `skills/prisma-8/references/contract.md:47,52`, `docs/releases/v8.0.0-rc.4.md:25`. The tree contains no package named `prisma`, so it cannot confirm or rule out a `prisma/config` re-export in the published CLI. I left the page alone because this is a section-wide decision, not a page-level one: `prisma/config` appears **116 times** across `apps/docs/content/docs/orm/` and only 7 times as a target-specific config import. Changing one page would make the docs inconsistent. The operator should decide for the whole section.

Searches run: `grep -rn "definePrismaConfig" packages skills docs`; `grep -rn '"name": "prisma"' packages --include=package.json`; `grep -rn "cli-engine" packages --include='*.json' -l`; `grep -rn "prisma/config" packages --include='*.ts'` (no hits); `grep -rho 'from "[^"]*config"' apps/docs/content/docs/orm/ | sort | uniq -c`.

No other claims were left unchecked.

## 4. Line count

`apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx`: **331 before, 331 after.**

## Notes for the operator

- The sibling contract-authoring page `the-data-contract.mdx` still uses `prisma/contract.prisma` (lines 13 and 61). It is another agent's page, so I did not touch it, but it needs the same `src/prisma/` correction.
- Two short PSL snippets on the page (the Relations and many-to-many examples) omit the `id` fields their `references: [id]` clauses point at. They are deliberate excerpts, consistent with the page's style, so I left them.