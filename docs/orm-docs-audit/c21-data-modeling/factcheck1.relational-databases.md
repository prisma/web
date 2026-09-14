Done. Both passes are complete; `check-plain.sh` prints **clean** and the page-conventions extra-word grep is empty.

## 1. Banned-term and wording replacements

No headings changed, so no anchors pinned. Line numbers are the final file.

| Line | Old | New |
|---|---|---|
| 11 | "This page shows how to model each relation shape and, for each one, where the foreign key belongs. If you are new to models and keys, start with the [data modeling overview]…" | "If you are new to models and keys, start with the [data modeling overview](/orm/data-modeling)." (docs-about-docs commentary cut) |
| 15 | "…carries two fields: a scalar field for the foreign key column, and a relation field that navigates it." | "…has two fields. One is a scalar field for the foreign key column. The other is a relation field, typed as the other model." ("carries" is banned as a verb) |
| 25 | "The side that carries the `fields` argument…" | "The side that declares the `fields` argument…" |
| 46 | "The foreign key lives on the "many" side" | "The foreign key is on the "many" side" ("lives on" banned) |
| 81 | "…a bare optional model-typed field is enough…; …or emit rejects the field with `PSL_NON_UNIQUE_BACKRELATION`." | semicolon split into sentences; "emit rejects" → "`npx prisma contract emit` rejects the field with an error whose `code` is `PSL_NON_UNIQUE_BACKRELATION`" |
| 87 | "So `Profile` carries `userId`" | "So `Profile` holds `userId`" |
| 111 | "The answer is a junction model" | "The answer is the model for the join table" |
| 136 | "…and the schema compiler connects them through `PostTag`" | "…and `npx prisma contract emit` connects them through `PostTag`" |
| 146 (comment) | "// Or, equivalently, create the junction record yourself" | "// Or create the join record yourself" |
| 150 | "The junction is an ordinary model, so it can carry data… add the field to the junction model." | "`PostTag` is an ordinary model, so it can hold data… add the field to `PostTag`." |
| 164 | "…with no junction model…: the schema compiler rejects it and asks for an explicit join model. Model the junction explicitly; [Relations and joins]… traverse it" | rewritten (see Corrected table); "junction" gone, error code named, semicolon removed |
| 168 | "each carries its own extra fields" | "each has its own extra fields" |
| 198 | "narrow the base collection with `.variant(...)`…; the discriminator is injected for you" | "limit the query to one variant with `.variant(...)`… The discriminator value is filled in for you" ("narrow" as a bare verb and "injected" banned) |
| 204 | "Chaining `.variant(...)` on a read narrows the same way, applying the discriminator filter and giving the collection the variant's row shape." | "On a read, `.variant(...)` works the same way. It limits the query to one variant by filtering on the discriminator, and the rows come back with that variant's fields." |
| 208 | "Its extra columns live alongside the base columns and must be nullable at the storage level" | "Its extra columns are added to the base table and have to be nullable there" |
| 211 | "Use polymorphism when…" | "Use a base model with variants when…" ("polymorphism" as a bare noun banned) |
| 215 | "Projects scaffolded with `create-prisma@latest` install [Prisma ORM skills]…; the `prisma-8` skill…" | "Projects created with `npm create prisma@latest` include the [Prisma ORM skills]… In an existing project, run `npx prisma skills sync`. The `prisma-8` skill…" (required first-sentence rule) |
| 219 | "an explicit junction model" | "an explicit model for the join table" |
| 224 | "relation predicates, and junction traversal" | "filters on relation data, and reads across the join table" |
| 226 | "the emitter lowers them to the foreign key's `ON DELETE` / `ON UPDATE` clause" | "They become the foreign key's `ON DELETE` and `ON UPDATE` clauses." |

Note on a conventions conflict: `page-conventions.md` says to write "the join model" after first use, but `references/banned-terms.md` bans "join model" and `check-plain.sh` fails on it. I used "the model for the join table", "the join table", and the model's own name `PostTag` instead, so the check passes.

## 2. Claims checked

All paths under `wip/prisma-src/`.

| Line | Claim | Deciding source | Verdict |
|---|---|---|---|
| 17–23, 31–44, 67–79, 89–95, 113–134, 152–162, 172–194 | PSL examples need no `// use prisma-8` line | `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:147,159,175,222,235,262` — fragment snippets carry no marker; only whole-file `title="prisma/contract.prisma"` blocks do (lines 15–16, 59–60) | Confirmed, no change |
| 9 | Model → table, scalar field → column | `packages/2-sql/2-authoring/contract-psl/src/interpreter.ts` (`buildModelNodeFromPsl`, `storage.table` / `storage.fields`) | Confirmed |
| 19, 33, 39, 69, 74, 91, 115, 121, 174 | `Int @id @default(autoincrement())` is valid PSL on PostgreSQL | `packages/3-targets/3-targets/postgres/src/core/psl-infer/infer-model-blocks.ts:283-290`, `core/migrations/planner-ddl-builders.ts:61,151` | Confirmed |
| 25 | "The side that declares the `fields` argument owns the foreign key" | `packages/1-framework/2-authoring/contract/src/relation-nullability.ts:20-31` (`ownsReference`), `psl-relation-resolution.ts:102-150` (`indexFkRelations` builds `N:1` from the declaring side) | Confirmed |
| 46 | `posts Post[]` is a back-relation, stores nothing, matched to the FK on `Post` | `psl-relation-resolution.ts:380-430` (`applyBackrelationCandidates` matches by `fkRelationPairKey`, emits `1:N` with no storage of its own) | Confirmed |
| 50 | (was) "Because the list field is virtual, you never write to it." | `test/integration/test/sql-orm-client/nested-mutations.test.ts:19-30` (`users.create({ posts: (posts) => … })`) and `mn-nested-write.test.ts:59,95` — list fields **do** accept nested writes, and this page itself shows one at line 142 | **Corrected** — sentence removed; the paragraph now reads "To connect a post to a user, set the foreign key when you create the post:" |
| 52–57 | `db.orm.public.Post.create({ title, authorId })` — `create` takes a foreign key scalar directly, and the page's `Post` has both fields | `test/integration/test/sql-orm-client/create.test.ts:187-190` (`createAll([{ id, name, email, invitedById: null }])` sets an FK scalar in a create input); page's `Post` (lines 38–43) declares `title` and `authorId` | Confirmed |
| 65, 76, 92 | `@unique` on the foreign key makes it one-to-one | `psl-relation-resolution.ts:352-366` (`fkColumnsAreUnique`: the FK columns must exactly match a unique column set) | Confirmed |
| 81 | Mirror field `profile Profile?` needs no `@relation` | `psl-relation-resolution.ts:487-525` (`validateBackrelationFieldAttributes` skips `relation` and rejects any other attribute; a bare field is accepted) | Confirmed |
| 81 | The mirror field must be optional | `packages/1-framework/2-authoring/psl-parser/src/relation-backrelations.ts:37-51` — a required singular back-relation gets `PSL_REQUIRED_ONE_TO_ONE_BACKRELATION`; `psl-relation-resolution.ts:461-474` calls it | **Corrected** (addition): the page now states "It has to be optional, because nothing in the database guarantees a matching profile row." |
| 81 | "emit rejects the field with `PSL_NON_UNIQUE_BACKRELATION`" — exact code and what it says | `psl-relation-resolution.ts:451-458`: code `PSL_NON_UNIQUE_BACKRELATION`, message "Backrelation field … is singular, but the matching FK on … is not unique… add @unique (or @@unique([…])) to the FK fields, or make … a list." | Confirmed (code exact); wording changed to the required "`npx prisma contract emit` rejects … with an error whose `code` is …" |
| (checked, not on page) | Required relation field over an optional FK rejected with `PSL_RELATION_NULLABILITY_MISMATCH` in rc.10 | `packages/2-sql/2-authoring/contract-psl/src/interpreter.ts:702-717` (code and both message directions), `relation-nullability.ts:26-33`; tests `contract-psl/test/interpreter.relations.test.ts:167,195,271` | Confirmed — the coming-from-prisma-orm-7 page is right, and every relation field on this page pairs a required relation field with a required FK scalar, so all examples are consistent |
| 113–136 | `Post.tags Tag[]` + `Tag.posts Post[]` + `PostTag` with `@@id([postId, tagId])` resolves to many-to-many in rc.10 (not `PSL_ORPHANED_BACKRELATION`) | `psl-relation-resolution.ts:225-275` (`findJunctionFkPairs`) and `:404-420` — a bare list back-relation with no direct FK match is resolved through a model whose `@@id` covers exactly the two FK columns and whose target-side FK references the target's full `@id`. Both hold here. Corroborated by `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:235-256` and `examples/retail-store/src/contract.prisma` (`Post.tags Tag[]` / `Tag.posts Post[]`) | Confirmed — the example is valid |
| 136 | `@@id([postId, tagId])` enforces one record per pair, and emit connects the list fields through `PostTag` so `post.tags` reads directly | `psl-relation-resolution.ts:155-175` (`idColumnsAreExactlyFkPair`), `:277-310` (`manyToManyRelationNode` emits `cardinality: 'N:M'` with `through`) | Confirmed |
| 138 | Both writes hit the same row; running both inserts the same composite key twice and the second fails | `test/integration/test/sql-orm-client/mn-nested-write.test.ts:145-170` — "connect to an already-linked tag rejects", `rejects.toThrow(/violated a unique constraint on junction "user_tags"/)` | Confirmed |
| 142–144 | `.where({ id }).update({ tags: (t) => t.connect([{ id }]) })` — `update` takes a relation callback and `connect` exists through a join model | `mn-nested-write.test.ts:124-130` (`users.where({ id: 1 }).…update({ tags: (t) => t.connect({ id: TAG_RUST }) })`); array form at `:95` | Confirmed |
| 147 | `db.orm.public.PostTag.create({ postId, tagId })` | join model is an ordinary model in `domain.namespaces.<ns>.models`; `packages/3-extensions/sql-orm-client/src/orm.ts:70-80` keys `db.orm.<ns>` by model name | Confirmed |
| 152–162 | `addedAt DateTime @default(now())` on the join model | `packages/3-targets/3-targets/postgres/src/core/default-normalizer.ts:12,33,41`; `examples/retail-store/src/contract.prisma` uses `createdAt DateTime @default(now())` | Confirmed |
| 164 | Implicit many-to-many is rejected, with an explicit join model asked for | `psl-relation-resolution.ts:428-436`: code `PSL_ORPHANED_BACKRELATION`, message "Backrelation field "X.y" has no matching FK-side relation on model "Z". Add @relation(fields: […], references: […]) on the FK-side relation **or use an explicit join model for many-to-many**." | **Corrected** — the page now names the code and drops "yet": "…is not supported. `npx prisma contract emit` rejects it with an error whose `code` is `PSL_ORPHANED_BACKRELATION`, and the message tells you to add an explicit model for the join table." Nothing in the source says "not supported *yet*"; `skills/prisma-8/references/contract.md:424` likewise states it is rejected |
| 178 | `@@discriminator(type)` | `packages/2-sql/2-authoring/contract-psl/src/sql-attribute-specs.ts:381-383` — `modelAttribute('discriminator', { positional: [{ key: 'field', type: fieldRef() }] })` | Confirmed |
| 184, 190 | `@@base(Task, "bug")` | `sql-attribute-specs.ts:384-389` — positional `entityRef()` then `str()` | Confirmed |
| 192 | `@@map("features")` on a variant | `interpreter.ts:1864-1875, 2562-2572` — an explicit `@@map` on a variant is the multi-table signal | Confirmed |
| 198 | `db.orm.public.Bug` exists alongside `db.orm.public.Task` | emitted fixture `test/integration/test/sql-orm-client/fixtures/polymorphism/generated/contract.json` lists `Bug`, `Epic`, `Feature`, `Task` as separate models in `domain.namespaces.public.models`; `orm.ts:70-80` | Confirmed |
| 198 | A query on the base model returns every variant | `test/integration/test/sql-orm-client/polymorphism.test.ts:74-128` — a bare `Task` query returns both bug and feature rows, each with its own variant field | Confirmed |
| 198, 201 | `.variant("Bug").create({...})` fills in the discriminator | `packages/3-extensions/sql-orm-client/src/collection.ts:394-449` (doc comment "Insert under a variant — discriminator is injected automatically", and `LiteralExpr.of(variantEntry.value)`) | Confirmed |
| 204 | `.variant(...)` on a read applies the discriminator filter and gives the variant's row shape | `collection.ts:394-470`; `polymorphism.test.ts:137-200` | Confirmed |
| 208 | Shared-table variant: extra columns in the base table, nullable | `interpreter.ts:1975-1995` (`materializeStiVariantStorageColumns`: "The materialised columns are always nullable in storage"); `polymorphism.test.ts:31-40` (`severity text` nullable in `tasks`) | Confirmed |
| 209 | Own-table variant: own table linked by the base primary key, constraints kept, at the cost of a join | `interpreter.ts:1890-1935` (`materializeMtiVariantStorageLinks`, "joins that table to the base on the shared primary key"); `polymorphism.test.ts:43-47` (`create table features (id integer primary key references tasks(id), priority integer not null, …)`) and `:179` ("INNER JOINs") | **Corrected** (precision) — "holding only its extra columns, linked back to the base table's primary key" became "That table holds its extra columns plus the base model's primary key, which links it back to the base table", because the variant table does carry the base PK column |
| 215 | `create-prisma@latest` / skills link | `skills/prisma-8/SKILL.md` exists; conventions fix the scaffold command to `npm create prisma@latest` | **Corrected** to the conventions wording |
| 215 | "the `prisma-8` skill covers relation modeling" | `skills/prisma-8/references/contract.md:95-142` ("Workflow — Edit a model / field / relation (PSL)"), `:213-245` (polymorphism) | Confirmed |
| 224 | `.include(...)` and filters on relation data exist | `test/integration/test/sql-orm-client/include.test.ts`, `mn-filter.test.ts` | Confirmed |
| 226 | `onDelete` / `onUpdate` accept `Cascade`, `Restrict`, `SetNull`, `SetDefault`, `NoAction` | `sql-attribute-specs.ts:418-425` (`referentialActionArgument`), `psl-relation-resolution.ts:24-34` (`REFERENTIAL_ACTION_MAP`) | Confirmed — exactly these five |
| 226 | They become the FK's `ON DELETE` / `ON UPDATE` clauses | `packages/3-targets/3-targets/postgres/src/core/migrations/operations/constraints.ts:22-45` — `sql += \`\nON DELETE ${action}\`` and the same for `ON UPDATE` | Confirmed |
| 11, 59, 81, 164, 215, 224, 225 | Every link target and anchor | `apps/docs/content/docs/orm/data-modeling/index.mdx` (`url: /orm/data-modeling`), `orm/data-modeling/mongodb.mdx`, `orm/fundamentals/relations-and-joins.mdx` headings `## One-to-one`, `## One-to-many`, `## Many-to-many`, `ai/tools/skills.mdx:100` `## Available skills for Prisma ORM 8 [#available-skills-for-prisma-8]` | Confirmed — all resolve |

## 3. Q list

None. Every claim on the page resolved for or against in the source.

Two notes rather than Qs:
- No test covers the `PSL_ORPHANED_BACKRELATION` implicit-many-to-many path specifically from a docs-shaped contract; the code at `psl-relation-resolution.ts:428-436` is what the page now states.
- `PSL_REQUIRED_ONE_TO_ONE_BACKRELATION` (the required-mirror-field rejection) is a different code from `PSL_NON_UNIQUE_BACKRELATION`. I stated the optionality requirement in plain words without naming the second code, to keep the page from growing.

## 4. Line count

226 before, 226 after.