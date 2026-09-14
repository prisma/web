Fact re-check complete for `wip/c21/ca/fc2/psl-syntax.mdx`. Two corrections, everything else confirmed. Line count: 356 before, 356 after.

## Claim table

| Line | Claim | Deciding source | Verdict |
|---|---|---|---|
| 9 | `contract emit` writes `contract.json` and `contract.d.ts` beside the source | `packages/3-extensions/postgres/src/config/define-config.ts:28` (`deriveOutputPath`) | Confirmed |
| 11–15 | The five differences (named types, enums, value objects, base models, extension types) | as per rows below | Confirmed |
| 12 | "enums: unchanged, except that an enum can now say how its values are stored" | `framework-authoring.ts:330`; `interpreter.enum.test.ts:807` (enum lowers to a text or int column plus a membership check, not a database enum type; members carry values) | **Corrected** → "enums: an enum can now say how its values are stored, and what each member stores." |
| 17 | `datasource` and `generator` blocks are gone | `psl-parser/src/syntax/syntax-kind.ts:8` (reserved declarations are `model`/`namespace`/`type`/`types` only) | Confirmed |
| 17, 175 | `@db.` attributes are gone | `psl-named-type-resolution.ts:39` (`PSL_UNSUPPORTED_NAMED_TYPE_ATTRIBUTE` on any `db.` attribute) | Confirmed |
| 21 | `// use prisma-8` on line one | `language-server/src/schema-directive.ts:1`; `schema-directive.test.ts:39` (a directive after a model is not recognised) | Confirmed |
| 24–64 | PostgreSQL example (`types`, `type`, `enum`, `@id`, `@default(uuid())`, `@default(now())`, `@relation`, `@@map`) | `interpreter.types.test.ts:33`; `control-mutation-defaults.ts:70`; `ids/src/index.ts:62` (`uuidv4` applies to `pg/uuid@1`) | Confirmed |
| 67–103 | MongoDB example (`ObjectId`, `@map("_id")`, `mongo/string@1`, `@@index`) | `mongo-adapter/src/exports/control.ts:30`; `mongo-attribute-specs.ts:143` | Confirmed |
| 106 | `Uuid` is PostgreSQL's `uuid` type | `control-mutation-defaults.ts:272` | Confirmed |
| 106 | `db init` creates the tables | `cli/src/control-api/operations/db-init.ts:17` | Confirmed |
| 110 | `contract` takes one path; `.ts` means TypeScript, otherwise PSL | `postgres/src/config/define-config.ts:40` | Confirmed |
| 114 | `import { definePrismaConfig } from "prisma/config"` | `cli/src/commands/init/templates/code-templates.ts:304` and `quick-reference-postgres.md:43` both write `@prisma/cli-engine`; the published `prisma` package (`@internal/cli`) has no `./config` export | **Corrected** → `from "@prisma/cli-engine"` |
| 113–124 | `dotenv/config`, `db.connection`, `DATABASE_URL` | `code-templates.ts:303–315` | Confirmed |
| 127 | This is what `prisma orm init` writes | `cli/test/orm/init-scaffold.test.ts:232` (writes `prisma.config.ts`, `src/prisma/db.ts`, the contract file) | Confirmed |
| 127 | The import chooses the database | `postgres/src/config/define-config.ts:54`; `orm-mongo/package.json` exports `./config` | Confirmed |
| 131 | Scalar types `String`, `Int`, `Boolean`, `Decimal`, `DateTime`, `Json`, `Bytes` | `control-mutation-defaults.ts:163` | Confirmed |
| 131 | The 16 native PostgreSQL type names | `control-mutation-defaults.ts:206–316` (`postgresNativeAuthoringTypes`) — the list matches key for key | Confirmed |
| 131 | `DateString` and friends read back as text | `control-mutation-defaults.ts:283` (comment) | Confirmed |
| 131 | `String` is `text`, `Int` is `int4`, `DateTime` is `timestamptz` | `control-mutation-defaults.ts:164–190` | Confirmed |
| 133–137 | `@id`, `@@id`, `@unique`, `@@unique`, `@@index`, `@map`, `@@map` | `sql-attribute-specs.ts:154–254` | Confirmed |
| 136 | `now()` is a column default; `uuid()` comes from Prisma ORM, so raw SQL writes get no value | `control-mutation-defaults.ts:57` (storage) vs `:70` (execution generator) | Confirmed |
| 139 | `@updatedAt` is gone | `interpreter.defaults.test.ts:509` (`PSL_UNSUPPORTED_FIELD_ATTRIBUTE`) | Confirmed |
| 143 | `updatedAt temporal.updatedAt()` in the type position | `interpreter.defaults.test.ts:442` | Confirmed |
| 147 | Set on every create and update | `timestamp-now-generator.ts:66` (`onCreate` and `onUpdate`) | Confirmed |
| 147 | `temporal` needs no import | `postgres/src/core/authoring.ts:742` (the target contributes it) | Confirmed |
| 147 | The column is `timestamptz` | `postgres/src/core/authoring.ts:744` | Confirmed |
| 147 | You can still set the field on a write | `relational-core/src/query-lane-context.ts:124` ("caller-provided values always win") | Confirmed |
| 147 | `temporal.createdAt()` sets the field once, on create | `timestamp-now-generator.ts:61` (a `now()` column default) | Confirmed |
| 163 | PostgreSQL primary key is an ordinary column; MongoDB uses `_id` | `mongo-family/contract-psl/src/interpreter.ts:1323` | Confirmed |
| 167–175 | `types` block syntax and reuse | `interpreter.types.test.ts:33` | Confirmed |
| 175 | `String @db.VarChar(35)` becomes `VarChar(35)` | `psl-named-type-resolution.ts:39`; `postgresNativeAuthoringTypes.VarChar` | Confirmed |
| 175 | The `types` block is PostgreSQL only | The MongoDB PSL interpreter has no named-type handling (`2-mongo-family/2-authoring/contract-psl/src/interpreter.ts`, no `namedType` reference). Note: named types are a SQL-family feature, so SQLite would have them too; of the two databases the docs cover, the sentence holds | Confirmed |
| 190 | `pg/text@1` format; `@@type("pg/int4@1")` stores integers | `interpreter.enum.test.ts:807` (int-backed enum happy path) | Confirmed |
| 190 | A member with no value stores its own name | `framework-authoring.ts:293` | Confirmed |
| 192 | `@@type` optional; bare names and strings give text, integers give the integer type; a mix throws `PSL_ENUM_CANNOT_INFER_TYPE` | `framework-authoring.ts:290–347` | Confirmed |
| 192 | `@default(Low)` names the member | `interpreter.enum.test.ts:863` (`@default(Low)` emits `"low"`) | Confirmed |
| 194–207 | `native_enum` block, `pg.enum(Role)`, each member needs a value | `psl-native-enum-authoring.test.ts:265` (`PSL_NATIVE_ENUM_BARE_MEMBER`); `psl-pg-enum-column.test.ts:125`; `postgres/src/core/authoring.ts:88` | Confirmed |
| 207 | `pg` needs no import | `postgres/src/core/authoring.ts:88` (part of the target's own authoring types) | Confirmed |
| 207 | `migration plan` includes the `CREATE TYPE` | `postgres/src/core/migrations/postgres-migration.ts:187`; `test/migrations/native-enum-planner.test.ts:3` | Confirmed |
| 211–228 | Value objects: optional, lists, nesting, `jsonb` on PostgreSQL, embedded on MongoDB | `interpreter.value-objects.test.ts:112, 268, 323` (`nativeType: 'jsonb'`) | Confirmed |
| 228 | The two spellings, `types {}` versus `type X {}` | `psl-parser/src/syntax/syntax-kind.ts:8` | Confirmed |
| 232–243 | Relation shape, foreign-key side declares `fields`/`references` | `sql-attribute-specs.ts:427` | Confirmed |
| 245 | `onDelete` and `onUpdate` belong on the foreign-key side | `contract-psl/src/interpreter.ts:830` (the list side is rejected) | Confirmed |
| 245–252 | One-to-one needs `@unique` on the foreign-key field | `psl-relation-resolution.ts:456` (`PSL_NON_UNIQUE_BACKRELATION`) | Confirmed |
| 254 | No implicit many-to-many; you write the join model | `psl-relation-resolution.ts:432` | Confirmed |
| 254 | One foreign-key field per part of a composite key; `@@id` lists exactly the foreign-key fields | `psl-relation-resolution.ts:308` and `:316` | Confirmed |
| 277 | `post.tags` reads without naming `PostTag` | `psl-relation-resolution.ts:323` (`cardinality: 'N:M'`) | Confirmed |
| 277 | Emit reports which list field it could not match | `psl-relation-resolution.ts:299` (the message names the list field) | Confirmed |
| 277 | `PSL_AMBIGUOUS_BACKRELATION`, fixed with `@relation("name")` on both ends | `psl-relation-resolution.ts:417` | Confirmed |
| 283–304 | `@@discriminator(field)` bare, `@@base(Model, "value")` quoted | `sql-attribute-specs.ts:381` | Confirmed |
| 304 | A variant reuses the base model's fields | `sql-orm-client/src/types.ts:577` (the variant row is base row plus variant fields) | Confirmed |
| 304 | A variant takes the base model's primary key | `interpreter.polymorphism.test.ts:192` (the variant table gets the base key column and a foreign key back) | Confirmed |
| 306 | `db.orm.public.Task.variant('Bug')`, reads and writes | `sql-orm-client/src/collection.ts:396–409` | Confirmed |
| 308 | `@@map` picks the layout: own table, or nullable columns in the base table | `interpreter.polymorphism.test.ts:131` and `:161` | Confirmed |
| 310 | MongoDB variants declare `@@base` and no `@@map` | `mongo-family/contract-psl/test/interpreter.polymorphism.test.ts` | Confirmed |
| 314–338 | `npm install @prisma/orm-extension-pgvector`, `/control` import, `extensions:` line | `orm-extension-pgvector/package.json` exports | Confirmed |
| 338 | `pgvector` is a fixed name the pack declares | `pgvector/src/core/authoring.ts:4` | Confirmed |
| 338 | List the pack before using its types | `psl-column-resolution.ts` `checkUncomposedNamespace` | Confirmed |
| 342 | `contract infer` writes a starter `contract.prisma` | `cli/src/orm/contract/paths.ts:5`; `psl-printer/src/ast-to-print-document.ts:26` | Confirmed |
| 354 | `db` is in `src/prisma/db.ts`, written by `prisma orm init` | `code-templates.ts:317`; `init-scaffold.test.ts:232` | Confirmed |
| All links | 15 link targets and the anchors `#schema`, `#scalar-fields`, `#variant`, `#embed-or-reference`, `#polymorphic-relations`, `#available-skills-for-prisma-8`, `#not-available-yet` | files under `apps/docs/content/docs/` | Confirmed |

## The one item that needs your decision

The config import. The rc.10 source writes `import { definePrismaConfig } from '@prisma/cli-engine'` in both the `prisma orm init` template and the quick-reference it ships, and the published `prisma` package in this tree exports no `./config` subpath. So I changed the page. But the rest of the docs set uses `prisma/config`: `cli/configuration.mdx`, `cli/init.mdx`, and, I expect, the sibling contract-authoring pages. `cli/orm-init.mdx` already says both imports work and that `prisma orm init` writes the `@prisma/cli-engine` one. If you would rather keep one spelling across the section, revert my change and instead soften line 127 so it no longer claims the block is exactly what `prisma orm init` writes.

## Q list (nothing found for or against)

1. `npx prisma skills sync` (line 346). Searched `grep -rn "skills sync\|'skills'" packages/1-framework/3-tooling/cli/src`: no hit. The rc.10 tree has no `skills` command. Your conventions file says the published CLI at rc.13 has it, so I left the sentence alone.
2. "Projects created with `npm create prisma@latest -- my-app` include the Prisma ORM skills" (line 346). `create-prisma` lives in another repo, so this tree cannot decide it. Searched `grep -rn "create prisma@latest" wip/prisma-src`: no hit outside the docs conventions.
3. The `prisma-8` skill "covers PSL authoring" (line 346). Partly supported: `wip/prisma-src/skills/prisma-8/references/contract.md` exists and covers contract authoring. That is prose, which the brief ranks below code, so I am flagging rather than claiming it.

## No test covers

Nothing on this page rests on code without a test. The two facts I checked only in non-test code are "caller-provided values always win" (`query-lane-context.ts:124`, a documented interface contract) and the `pgvector` namespace name (`pgvector/src/core/authoring.ts`).