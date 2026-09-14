Fact re-check complete for `wip/c21/dm/fc2/relational-databases.mdx`. One correction made.

## Claims checked

| Line | Claim | Source that decides it | Verdict |
| --- | --- | --- | --- |
| 11 | `contract.prisma` is the contract source; `contract emit` checks it and regenerates TypeScript types; does not touch the database | `skills/prisma-8/references/quickstart.md:283,285,287`; `SKILL.md:34` | Confirmed |
| 11 | `db` created once in `src/prisma/db.ts`, written by `prisma orm init` | `skills/prisma-8/references/quickstart.md:36,107,133`; `references/contract.md:69`; `cli/src/commands/init/templates/readme-postgres.md:29` | Confirmed |
| 11 | `db.orm` holds models by model name; `public` is the PostgreSQL schema | `sql-orm-client/test/model-types.test-d.ts:23`; namespace fixtures in `sql-orm-client/test/orm-namespaced.test.ts` | Confirmed |
| 15-22 | FK side declares scalar + relation field with `@relation(fields:, references:)` | `contract-psl/src/sql-attribute-specs.ts:434`; `references/contract.md:97-110` | Confirmed |
| 27 | Both fields must agree in nullability, else emit reports an error | `contract-psl/src/interpreter.ts:702-716` (`PSL_RELATION_NULLABILITY_MISMATCH`) | Confirmed |
| 29 | `onDelete`/`onUpdate` become `ON DELETE`/`ON UPDATE`; write neither and neither clause is emitted | `postgres/test/migrations/planner.referential-actions.test.ts:120-124,165-173` | Confirmed |
| 31-35 | The five names `Cascade`, `Restrict`, `SetNull`, `SetDefault`, `NoAction` and their meanings | `contract-psl/src/psl-relation-resolution.ts:25-29`; `sql-attribute-specs.ts:420-424`; planner test `:165-173` | Confirmed |
| 35 | `NoAction` is the same as writing nothing | `2-sql/9-family/src/core/psl-contract-infer/relation-inference.ts:9-10,180-181` (`DEFAULT_ON_DELETE`/`DEFAULT_ON_UPDATE = 'noAction'`, omitted on round-trip) | Confirmed |
| 37 | Two relations between the same pair need a name on both sides, `@relation("Name")` form accepted | `psl-relation-resolution.ts:439-444` (`PSL_AMBIGUOUS_BACKRELATION`, message names both forms); `contract-psl/test/interpreter.relations.test.ts:467-494` | Confirmed |
| 43-56 | One-to-many model shapes, `Int @id @default(autoincrement())`, `String @unique` | `test/integration/test/authoring/side-by-side/postgres/contract.prisma:4` | Confirmed |
| 58 | Self-relation is an ordinary one-to-many; one relation between a model and itself needs no name | `psl-relation-resolution.ts:389-398` (matching is by model pair; a single match needs no name). No test covers exactly one unnamed self-relation — the two tests present (`interpreter.relations.test.ts:428,467`) use a name or two relations. Stated from the code. | Confirmed |
| 60 | Mirror field stores nothing and can be left out | `references/contract.md:97` ("Add the relation only on the owning side") | Confirmed |
| 60 | `db.orm.public.Post.where({ authorId: user.id }).all()`; `.all()` runs the query and returns every row | `test/integration/test/sql-orm-client/mn-nested-write.test.ts:291-296`; `include.test.ts:85` | Confirmed |
| 65-70 | `import { db } from "./prisma/db"`; `create` with no `data:` wrapper | `quickstart.md:84`; `mn-nested-write.test.ts:91-96` | Confirmed |
| 73 | `.include("author").all()` nests the related record | `include.test.ts:105-124` | Confirmed |
| 79-93 | One-to-one: `@unique` on the foreign key | `psl-relation-resolution.ts:452-462` (`PSL_NON_UNIQUE_BACKRELATION`) | Confirmed |
| 95 | Mirror field `profile Profile?` needs no `@relation`, must be optional, is singular because `userId` is unique; `.include("profile")` | `psl-relation-resolution.ts:452-473`; `include.test.ts:124` | Confirmed |
| 111-133 | Explicit join model, `@@id([postId, tagId])` | `fixtures/mn-psl/contract.prisma` (identical shape); `psl-relation-resolution.ts:232-289` | Confirmed |
| 136 | `Post.tags` typed `Tag[]` not `PostTag[]` | `fixtures/mn-psl/contract.prisma:25,33` | Confirmed |
| 136 | Second join table needs the name on `Post.tags` and on `PostTag.post` | `psl-relation-resolution.ts:237-239` ("A relation name on the list field pins the parent-side FK relation"); `:417-419` | Confirmed |
| 141-143 | `.where(...).update({ tags: (t) => t.connect([...]) })` | `mn-nested-write.test.ts:291-296` | Confirmed |
| 146 | `t.create` / `t.connect` / `t.disconnect`, each accepting an array | `mn-nested-write.test.ts:95,255,296` | Confirmed |
| 146 | Leave the list fields out and write `PostTag` rows yourself via `db.orm.public.PostTag.create(...)` | `sql-orm-client/test/model-types.test-d.ts:23` (junction is its own collection) | Confirmed |
| 146 | `addedAt DateTime @default(now())` on the join model | `postgres/test/scalar-type-parity.test.ts:98-127` (`DateTime` is a PostgreSQL scalar); `examples/prisma-8-demo/.../contract.prisma:31`; extra non-key columns do not break join-table recognition (`psl-relation-resolution.ts:255-289`) | Confirmed |
| 148 | Implicit many-to-many rejected with `PSL_ORPHANED_BACKRELATION` | `psl-relation-resolution.ts:430-435`; `references/contract.md:139` | Confirmed |
| 155-176 | `@@discriminator(type)` and `@@base(Task, "bug")` quoting; variant declares no `@id`; variant has every base field | `sql-attribute-specs.ts:381-389`; `fixtures/polymorphism/contract.prisma` | Confirmed |
| 180 | `.variant("Bug")` takes the model name; `"bug"` is a type error; create fills in the discriminator | `sql-orm-client/src/types.ts:553-562` (`VariantNames` = variant model-name keys); `src/collection.ts:394-412` | Confirmed |
| 186-195 | Base read returns every variant, each row carrying only its own variant's fields; `switch (task.type)` reaches `task.severity` / `task.targetRelease` | `sql-orm-client/src/types.ts:526-546` (`VariantRow` is a discriminated union over the discriminator literal); `test/integration/.../polymorphism.test.ts:74` | Confirmed |
| 197 | No `@@map` shares the base table with nullable columns; own `@@map` gives its own table named by the string, columns can be `NOT NULL`, a join to read | `contract-psl/src/interpreter.ts:1975-1990` and `:1895-1970`; `polymorphism.test.ts:29-50,53-56` | Confirmed |
| 197 | In Prisma ORM 7, `@@map` only renamed a table | Prisma ORM 7 behaviour, stated as a version contrast. Not in the rc.10 tree. | Q (see below) |
| 203 | Skills note, `npx prisma skills sync`, `prisma-8` skill covers relation modeling | `skills/prisma-8/SKILL.md:61`; conventions.md (rc.13 CLI) | Confirmed |
| 212-214 | Link targets and anchors | `apps/docs/content/docs/orm/fundamentals/relations-and-joins.mdx:47,98,162`; `orm/data-modeling/index.mdx`, `mongodb.mdx`; `orm/migrations/generating-a-migration.mdx`; `ai/tools/skills.mdx:100` | Confirmed |
| 213 | `migration plan --name <name>` then `db migrate` applies it | `quickstart.md:265`; `references/migrations.md:12,48,96` | **Corrected** |

## Correction made

Line 213: `migration plan` writes a migration package (a directory with `migration.ts`, `ops.json`, `migration.json` under `migrations/app/<timestamp>_<slug>/`), not a single file (`references/migrations.md:45,73,116`; `quickstart.md:57`). Text now reads "which writes the migration files".

## Q list

- **"In Prisma ORM 7, `@@map` only renamed a table."** Searched the rc.10 tree for any Prisma 7 comparison of `@@map`: `grep -rn "@@map" skills/prisma-8/references/contract.md`, `grep -rn -i "prisma 7" skills/prisma-8/`, `grep -rn "@@map" skills/prisma-8/upgrading/`. The tree documents rc.10's own `@@map` behaviour (variant storage choice, `references/contract.md:215`) but says nothing about Prisma ORM 7's. Left as written.

## Note for the operator

`skills/prisma-8/references/contract.md:117` says "the default is `Restrict`" for `onDelete`/`onUpdate`. The code contradicts it: no clause is emitted when neither is given (`planner.referential-actions.test.ts:120-124`) and the round-trip default is `noAction` (`relation-inference.ts:9-10`). The page follows the code. The skill prose looks stale.

Line count: 214 before, 214 after.