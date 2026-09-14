Fact re-check complete. `wip/c21/dm/fc2/index.mdx`: 252 lines before, 252 after. `check-plain.sh` prints "clean"; the extra banned-word grep hits only "surro**gate**", a substring false positive.

## Claims checked

| Line | Claim | Source | Verdict |
| --- | --- | --- | --- |
| 13 | Contract derives TypeScript types and migrations | `skills/prisma-8/SKILL.md:34` (`contract.json` + `contract.d.ts`), `references/migrations.md:95` | Confirmed |
| 15 | No `datasource`/`generator` block; connection string in `prisma.config.ts` | `examples/prisma-8-demo/prisma.config.ts` (`db: { connection: … }`); no `datasource`/`generator` keyword anywhere in `packages/1-framework/2-authoring/psl-parser/src` | Confirmed |
| 15 | `#a-complete-contract` shows a whole file and the config file | `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:13`, and `prisma.config.ts` blocks at lines 108/119 | Confirmed |
| 15 | Link covers a Prisma ORM 6 reader | `apps/docs/content/docs/orm/coming-from-prisma-orm-7.mdx` — the page never mentions version 6 | **Corrected** → "If you are [coming from Prisma ORM 7](/orm/coming-from-prisma-orm-7), that page covers the rename and the rest of the differences." |
| 17 | Prisma ORM 8 supports PostgreSQL and MongoDB **only** | `wip/prisma-src/README.md:98-101` lists SQLite under "Supported databases" as "planned next, a proof of concept today"; `scorecard.md` has a SQLite column throughout; `packages/3-extensions/sqlite` ships at `8.0.0-rc.10` | **Corrected** → "Prisma ORM 8 supports PostgreSQL and MongoDB, and SQLite is still a proof of concept." |
| 32, 46, 86, 99 | `@id`, `@default(autoincrement())` | `packages/3-targets/6-adapters/postgres/src/core/control-mutation-defaults.ts:126-131`; `sql-attribute-specs.ts:212,236` | Confirmed |
| 38 | Model becomes a table / a collection | `packages/2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:1342` (`storage: { collection }`) | Confirmed |
| 42 | `update`/`delete` fail at runtime without a primary key or unique field | `packages/3-extensions/sql-orm-client/src/collection.ts:2413-2425` throws `ORM.ROW_IDENTITY_MISSING`, reached from `update()` (2015) and `delete()` (2191). No emit-time `@id` requirement exists for SQL (no `PSL_MISSING_ID_FIELD` under `packages/2-sql`), so runtime really is where it fails | Confirmed |
| 53, 59 | MongoDB `_id` mandatory and must be `ObjectId`; `@map("_id")` | `packages/2-mongo-family/2-authoring/contract-psl/src/interpreter.ts:1320-1340` (`PSL_MONGO_ID_REQUIRED`, example spelled `id ObjectId @id @map("_id")`) | Confirmed |
| 59 | The field takes no `@default` | `packages/2-mongo-family/2-authoring/contract-psl/src/mongo-attribute-specs.ts:247-261` — the MongoDB field attributes are `id`, `unique`, `map`, `relation`; there is no `default` | Confirmed |
| 59 | Omit `id` on create and MongoDB assigns it | `packages/2-mongo-family/5-query-builders/orm/src/collection.ts:113,369-374` ("server-assigned `_id`") | Confirmed |
| 59 | `@@map` optional; default collection is the model name with a lowercase first letter | `interpreter.ts:334-335` (`?? lowerFirst(model.name)`), `psl-helpers.ts:8` | Confirmed |
| 103 | Auto-increment value known only after the insert | `control-mutation-defaults.ts:48-55` — `autoincrement()` is a storage default, not an execution generator | Confirmed |
| 106 | UUID generated before the insert | `control-mutation-defaults.ts:70-77` returns `executionGenerator('uuidv7'/'uuidv4')`, i.e. client-side | Confirmed |
| 109, 113 | `@default(uuid())` random, `@default(uuid(7))` sorts by creation time | `control-mutation-defaults.ts:73-80` maps `uuid(7)` → `uuidv7` and bare `uuid()` → `uuidv4`; `packages/1-framework/2-authoring/ids/src/generators.ts:5-6` uses `uniku/uuid/v4` and `uniku/uuid/v7`. v7 is time-ordered and v4 random by RFC 9562; the tree states the versions, not the ordering property | Confirmed |
| 109 | `id String @default(uuid())` is valid | `ids/src/index.ts:57-64` — `uuidv4`/`uuidv7` `applicableCodecIds` include `pg/text@1`, which is what `String` maps to | Confirmed |
| 113 | `@default(uuid(7))` and `@default(uuid())` are both accepted spellings | `control-mutation-defaults.ts:141` `usageSignatures: ['uuid()', 'uuid(4)', 'uuid(7)']` | Confirmed |
| 124 | `@@id([userId, tagId])` composite key | `packages/2-sql/2-authoring/contract-psl/src/sql-attribute-specs.ts:236,472` | Confirmed |
| 128 | "The same model" is shown under many-to-many | `apps/docs/content/docs/orm/data-modeling/relational-databases.mdx:127-133` shows `PostTag` with `postId`/`tagId`, not `UserTag` | **Corrected** → "[Many-to-many](…#many-to-many) writes a model like this one out with its relation fields." |
| 136-146 | Scalar table: `String`→text, `Int`→int4, `BigInt`→int8, `Float`→float8, `Decimal`→numeric, `Boolean`→bool, `DateTime`→timestamptz, `Bytes`→bytea, `Json`→json, `Jsonb`→jsonb | `packages/3-targets/6-adapters/postgres/src/core/control-mutation-defaults.ts:157-196` (`postgresScalarAuthoringTypes`) | Confirmed |
| 140 | `Numeric(10, 2)` takes a precision and scale | same file, `postgresNativeAuthoringTypes.Numeric`, args `precision` and `scale` | Confirmed |
| 146, 148 | `ObjectId` is the only MongoDB-only type | `packages/3-mongo-target/2-mongo-adapter/src/exports/control.ts:25-36` — MongoDB scalars are `String`, `Int`, `Boolean`, `DateTime`, `ObjectId`, `Float`; `ObjectId` is the only one absent from the PostgreSQL set | Confirmed |
| 150 | `Decimal` reaches your code as a string | `packages/3-targets/3-targets/postgres/src/core/codecs.ts:896-905` — `PgNumericCodec.decode` returns `string` | Confirmed |
| 150 | `DateTime` arrives as `Temporal.Instant` | `postgresScalarAuthoringTypes.DateTime` → `pg/timestamptz-temporal@1`; `temporal-codecs.ts:143-155` decodes to `Temporal.Instant` | Confirmed |
| 150 | `Temporal` built into Node.js 26.8.2 and later | `skills/prisma-8/references/contract.md:118` | Confirmed |
| 150 | `temporal-polyfill` package, `import "temporal-polyfill/full/global"` before any query | `contract.md:118`, `docs/reference/error-reference.md:779`, `test/integration/test/setup-temporal.ts:1` | Confirmed |
| 150 | `Bytes` arrives as `Uint8Array` | `codecs.ts:1167-1177` | Confirmed |
| 152 | `Json` and `Jsonb` are two separate types | `control-mutation-defaults.ts:186-193` — separate entries, `pg/json@1` / `pg/jsonb@1` | Confirmed |
| 152 | `.where()` on `Jsonb` is whole-value only; `Json` not comparable at all | `codecs.ts:1401` `PgJsonDescriptor.traits = []`; `codecs.ts:1445` `PgJsonbDescriptor.traits = ['equality']` | Confirmed |
| 152 | Raw SQL for a path query | `scorecard/09-filtering.md:34` — JSON-path filtering is `❌` on PostgreSQL | Confirmed |
| 152 | Extensions add vectors or geometry | `README.md:87-88` (pgvector, postgis) | Confirmed |
| 154 | `name String?`, `tags String[]` | `test/integration/test/sql-orm-client/fixtures/scalar-lists/contract.prisma:11-15` has `tags String[]` verbatim | Confirmed |
| 158-163 | Enum block syntax, `@@type("pg/text@1")`, `Low = "low"` | `skills/prisma-8/references/contract.md:274-287`; `examples/prisma-8-cloudflare-worker/src/prisma/contract.prisma:9` | Confirmed |
| 166 | "`@@type` is required on every enum" | `packages/1-framework/1-core/framework-components/src/shared/framework-authoring.ts:326-348` — when `@@type` is absent, `resolveEnumCodecId` infers the type from the members via `classifyEnumMemberType` (all-string → text, all-integer → int), using each target's `enumInferenceCodecs`. Only an un-inferable member set raises `PSL_ENUM_CANNOT_INFER_TYPE` | **Corrected** → "`@@type` says how the values are stored, here as PostgreSQL `text`. Leave it out and Prisma ORM takes the storage from the members, text for string values and an integer for whole numbers." |
| 166 | `pg/text@1` is the type plus a version, always `@1` today | grep over every `'(pg\|sql\|mongo)/…@N'` literal in `packages/` returns only `@1` | Confirmed |
| 166 | `@@type("mongo/string@1")` on MongoDB | `examples/mongo-demo/src/contract.prisma:4`, `examples/retail-store/src/contract.prisma:4` | Confirmed |
| 199 | `BigInt` arrives as a JavaScript `bigint` | `codecs.ts:645-656` — `PgInt8Codec.decode` returns `bigint` (`JSON.stringify` refusing `bigint` is a JavaScript language fact) | Confirmed |
| 209 | Prisma ORM 7 called the link field the relation scalar field | `apps/docs/content/docs/orm/v7/prisma-schema/data-model/relations/index.mdx:126,132` uses that exact term. Attributed to Prisma ORM 7, not claimed of rc.10 | Confirmed |
| 212, 215-225 | `@relation(fields:, references:)`; `User`/`Post` with `posts Post[]` back-relation | `sql-attribute-specs.ts` `relationFieldSpec`; back-relation matching in `psl-relation-resolution.ts:448-480` | Confirmed |
| 229 | One-to-one: `@unique` on the link field, `profile Profile?` not a list | `psl-relation-resolution.ts:452-475` — a singular back-relation with a non-unique FK raises `PSL_NON_UNIQUE_BACKRELATION`, and a required singular back-relation raises `requiredOneToOneBackrelationDiagnostic` | Confirmed |
| 231 | Implicit many-to-many is gone and `npx prisma contract emit` rejects it | `psl-relation-resolution.ts:431-433` — `PSL_ORPHANED_BACKRELATION` for a list back-relation with no join model | Confirmed |
| 240 | `npm create prisma@latest`, `npx prisma skills sync`, `prisma-8` skill | `skills/prisma-8/SKILL.md` exists; `skills sync` kept per `conventions.md` (published CLI has it, this tree does not) | Confirmed |
| 251 | `contract emit` → `migration plan --name` → `db migrate`; emit replaces `prisma generate` | `skills/prisma-8/references/migrations.md:95` (`contract emit && migration plan --name add_feature`), `quickstart.md:265`, `packages/1-framework/3-tooling/cli/src/migration-cli.ts:6` (`prisma db migrate`), `docs/architecture docs/adrs/ADR 032:150` ("Replaces `prisma generate`") | Confirmed |
| all | Every link target and anchor | `#models`/`#primary-keys`/`#scalar-fields`/`#relations` exist on the page; `psl-syntax.mdx:13` `## A complete contract` and `:183` `## Enums`; `relational-databases.mdx:75` `## One-to-one` and `:107` `## Many-to-many`; `url:` front matter matches for `/orm/extensions`, `/orm/migrations/generating-a-migration`, `/orm/coming-from-prisma-orm-7`, `/orm/reference/raw-queries`, `/orm/fundamentals/reading-data`; `ai/tools/skills.mdx:100` pins `[#available-skills-for-prisma-8]` | Confirmed |

## Q list

None. Every claim resolved for or against.

## Note not acted on

`page-conventions.md` says type ids such as `pg/text@1` do not belong in prose on these pages. Line 166 explains `pg/text@1` in prose. That is a convention question, not a fact question, so I left it for the operator.