Both pages are done. Here is the report.

## 1. Banned-term and wording replacements

**typescript-schema-builder.mdx**

| Line | Old | New |
| --- | --- | --- |
| 3, 6 | "Same models, same artifacts" / "Learn how to define…" | "Same models, same emitted files" / "How to define…" |
| 9 | "you define the Prisma ORM data contract in code… produces exactly the same `contract.json` and `contract.d.ts`" | first-use convention: "your contract, the `contract.ts` file that replaced `schema.prisma`"; "`npx prisma contract emit` then writes `contract.json` and `contract.d.ts` beside the source" |
| 13 | "Both modes emit identical artifacts… The TypeScript builder is an **escape hatch**" | "Both forms produce the same two files… Use the TypeScript builder for the cases PSL does not cover" |
| 16 | "(the **purity rules** still apply)" parenthetical caveat | cut |
| 22 | "names the **source of truth**" | "names the one file Prisma ORM reads" |
| 157 | "refresh the **artifacts**" | "refresh the two files" |
| 163 | — | "takes two arguments" → "takes an options object, and optionally a factory function after it" (both overloads exist) |
| 183–184 | semicolons joining clauses | split into sentences |
| 185 | "sets the **physical** column name" | "sets the column name in the database" |
| 189 | "with an explicit storage **codec**" | "an enum, the type its values are stored as, and its members" |
| 256 | "the CLI and **runtime** agree" + mid-sentence parenthetical | "Add the same pack to `prisma.config.ts` as `extensions: [pgvector]`, importing the pack's `/control` export. The CLI and your app then compose the same set the contract was built with." |
| 258 | heading "Keep the contract file **pure**" | "## Keep the contract file free of changing values `[#keep-the-contract-file-pure]`" — anchor pinned; `the-contract-artifact.mdx:22` links to it and still resolves |
| 260 | "Prisma ORM **canonicalizes** it to JSON… the file is **pure** data" | "writes it to JSON in a fixed key order and hashes it, so the same source always produces the same files… only if the file holds plain data" |
| 264 | "**Emission** evaluates it" | "`prisma contract emit` imports the file and reads its `default` or `contract` export" |
| 270 | "the same **canonical artifact**… exactly one **source of truth**" | "the same `contract.json` and `contract.d.ts`… A project names exactly one contract file in its config" |
| 274 | "Projects scaffolded with `create-prisma@latest` install…" | the required sentence, including `npx prisma skills sync` |
| 281 | "**Emit** and inspect the **artifacts**" | "Inspect the two files" |

**capabilities.mdx**

Prose use of "capability/capabilities" replaced throughout with "keys", "the `capabilities` section", "which database features your setup supports". Other replacements:

| Line | Old | New |
| --- | --- | --- |
| 11 | "instead of **surfacing** as a database error mid-query" | "instead of reaching the database and failing there"; first-use "contract" convention added |
| 15 | "You do not write capabilities yourself. When `contract emit` runs…" | "You do not write this section yourself. `npx prisma contract emit` writes `contract.json` and `contract.d.ts` beside the source, and while it does so it merges…" |
| 43 | heading "What capabilities **gate**" | "## What capabilities control `[#what-capabilities-gate]`" — anchor pinned |
| 64 | "to give a sense of the granularity" (docs commentary) | cut |
| 67 | table column "Gates" | "What it covers" |
| 77 | "is the **authoritative** list" | "is the full list" |
| 79 | "does not yet **gate** features this way" | "does not yet check features this way" |
| 90 | scaffold sentence | required wording |

The four headings containing "Capabilities", plus `title:`, `url:` and `metaTitle:`, were left alone as instructed.

## 2. Claims checked

**typescript-schema-builder.mdx**

| Line | Claim | Deciding source | Verdict |
| --- | --- | --- | --- |
| 9 | emit writes `contract.json` + `.d.ts` beside the source | `contract-ts/src/config-types.ts:90-125` (`defaultOutputFromContractPath`) | Confirmed |
| 13 | PSL is the preferred form | `skills/prisma-8/references/contract.md:6,46` (secondary prose) | Confirmed |
| 15–16 | TS is for composed/programmatic definitions | same, line 46 | Confirmed |
| 18 | "what `create-prisma` scaffolds and `contract infer` writes" | `cli/src/orm/init-inputs.ts:98-103`; `cli/src/orm/contract/paths.ts:5` | **Corrected** — `prisma orm init` prompts for PSL or TypeScript and writes either, so the scaffold half was dropped. Now: "It is more compact, and it is what `contract infer` writes." |
| 22 | `.ts` extension selects TypeScript authoring | `3-extensions/postgres/src/config/define-config.ts:44-49` | Confirmed |
| 25, 36 | `import { definePrismaConfig } from "prisma/config"` | `cli/src/commands/init/templates/code-templates.ts:304`; `docs/releases/v8.0.0-rc.4.md:25` | **Corrected** — it is `@prisma/cli-engine`. No `prisma/config` specifier exists anywhere in the tree. |
| 26, 37 | `defineConfig as ormConfig` from `@prisma/orm-postgres/config` / `@prisma/orm-mongo/config` | `9-public/@prisma/orm-postgres/package.json` exports, `…/orm-mongo/package.json` | Confirmed |
| 48 | builders at `/contract-builder` on both packages | both package.json exports maps | Confirmed |
| 51 | `@prisma/orm-extension-pgvector/pack` | `…/orm-extension-pgvector/package.json` exports | Confirmed |
| 52 | `defineContract, enumType, member, rel` exported | `3-extensions/postgres/src/exports/contract-builder.ts` | Confirmed |
| 54, 194 | `{ codecId: "pg/text@1", nativeType: "text" }` | `3-targets/3-targets/postgres/src/core/authoring.ts:677` | Confirmed |
| 56–62, 192 | `enumType(name, codec, member(...))` | `1-framework/2-authoring/contract/src/enum-type.ts:153-183` | Confirmed |
| 64–67 | `defineContract(options, factory)` with `extensions` | `3-extensions/postgres/src/contract/define-contract.ts:89-102` | Confirmed |
| 68 | factory receives `{ field, model, type }` | `contract-ts/src/composed-authoring-helpers.ts:133-152` | Confirmed (`rel` also present) |
| 70, 249 | `type.pgvector.Vector(1536)` | `3-extensions/pgvector/src/core/authoring.ts:4-19` | Confirmed |
| 75, 85 | `field.id.uuidv4String()` | `2-sql/9-family/src/core/authoring-field-presets.ts:99` | Confirmed |
| 76, 86 | `field.text()` | `postgres/src/core/authoring.ts:678` | Confirmed |
| 77–78 | `field.temporal.createdAt()` / `.updatedAt()` | `2-sql/9-family/src/core/timestamp-now-generator.ts:61,69` | Confirmed |
| 79 | `field.json().optional()` | `authoring.ts:719`; `contract-dsl.ts:183` | Confirmed |
| 87 | `field.uuidString()` | `authoring-field-presets.ts:42` | Confirmed |
| 88 | `field.namedType(Priority).default(Priority.members.Low)` | `contract-dsl.ts:2105,313`; `enum-type.ts:219,233` (`members` maps name → stored value) | Confirmed |
| 100, 208 | `rel.hasMany(Post, { by })` | `contract-dsl.ts:2001-2021` | Confirmed |
| 105, 212 | `rel.belongsTo(User, { from, to })` | `contract-dsl.ts:1948-1999` | Confirmed |
| 101, 223 | `.sql({ table })` | `contract-dsl.ts:1574` | Confirmed |
| 106, 229 | `.sql(({ cols, constraints }) => …)` | `contract-dsl.ts:1624-1632`, `SqlContext` at 1246-1253 | Confirmed |
| 109, 232 | `constraints.foreignKey(cols.x, Model.refs.y, { name })` | `contract-dsl.ts:1121-1155` | Confirmed |
| 95–115 | returned `{ enums, types, models }` | `define-contract.ts:96-101` | Confirmed |
| 121–154 | whole MongoDB example | `cli/src/commands/init/templates/code-templates.ts:258-292` writes the same shapes; `field.objectId/string/date` at `2-mongo-family/…/contract-builder.ts:1008-1025`; `collection` at 1362; `rel.hasMany(target,{from,to})` at 1277-1296; `rel.belongsTo` at 1299-1322; `User.ref("_id")` at 1443; `defineContract({models})` at `3-extensions/mongo/src/contract/define-contract.ts` overload 1 | Confirmed |
| 157 | `npx prisma@latest contract emit` | page-conventions | **Corrected** to `npx prisma contract emit` |
| 159 | Mongo scalars `int32`, `double`, `bool` | `2-mongo-family/…/contract-builder.ts:1014-1025` | Confirmed |
| 163 | "takes two arguments" | `define-contract.ts` two overloads | **Corrected** — "takes an options object, and optionally a factory function after it" |
| 165 | target and family bound by the import | `define-contract.ts:113-121` (`buildBoundContract`) | Confirmed |
| 167 | helpers "composed from the target and every extension pack" | `composed-authoring-helpers.ts:270-277` composes family + target + extensions | **Corrected** — "composed from your database and every extension pack"; `rel` added to the list |
| 169 | Mongo `defineContract` "takes a single definition object" | `mongo/src/contract/define-contract.ts` also has a factory overload | **Corrected** — "accepts a single definition object holding the `models`" |
| 175–178 | field helper bullets | as above | Confirmed |
| 180 | helper set comes from target + packs | `composed-authoring-helpers.ts:270` | **Corrected** — "from your database and the extension packs you compose" (`uuidString` comes from the SQL family, not the target) |
| 182–185 | `.optional()`, `.default()`, `.defaultSql()`, `.unique()`, `.id()`, `.column()` | `contract-dsl.ts:183, 313, 320, 379, 327, 217` | Confirmed |
| 200 | enum must be in the returned `enums` map | `build-contract.ts:1463` registers only `definition.enums` | Confirmed |
| 216 | `rel.hasOne` and `rel.manyToMany` | `contract-dsl.ts:2023, 2045` | Confirmed |
| 216 | "a typo is a compile error either way" | `contract-dsl.ts:1948-2012` string overloads accept any string; `contract-lowering.ts:344` reports "references unknown model" at build time; `contract-warnings.ts:127-131` warns on string fallbacks | **Corrected** — now: model object gives a compile error, a string is caught when `prisma contract emit` builds the contract |
| 237 | `Model.refs` typed against the model | `contract-dsl.ts:1456, 1478, 1279-1302` | Confirmed |
| 256 | pack must also be in `prisma.config.ts` via `/control` | `postgres/src/config/define-config.ts:22` (`ControlExtensionDescriptor`); pgvector exports `./control` | Confirmed |
| 260 | fixed key order + hashing | `1-framework/0-foundation/contract/src/hashing.ts:1-60` (`canonicalizeContract` + sha256) | Confirmed |
| 264 | emit evaluates the file and nothing else | `contract-ts/src/config-types.ts:105-113` (dynamic import, reads `default ?? contract`) | Confirmed |
| 270 | PSL and TS produce the same output | `contract-psl/test/ts-psl-parity.test.ts`, `psl-ts-namespace-parity.test.ts:141` | Confirmed |
| 281–282 | links `/cli/db-init`, `/cli/migration-plan`, artifact page | pages exist in the repo | Confirmed |

**capabilities.mdx**

| Line | Claim | Deciding source | Verdict |
| --- | --- | --- | --- |
| 11 | error names the missing key before the database is reached | `sql-builder/src/runtime/builder-base.ts:278-292` | Confirmed |
| 15 | "you do not write them yourself" | `cli/src/control-api/operations/contract-emit.ts:252-268`; `contract-enrichment.ts:66` | Confirmed |
| 15 | merged from "target, its adapter **and driver**, and extension packs" | `contract-emit.ts:252` merges `[target, adapter, ...extensions]`; `control-stack.ts:662` the same | **Corrected** — "the target …, its adapter, and any extension packs named in the config" |
| 20–28 | `postgres.*` keys and their values | `3-targets/6-adapters/postgres/src/core/descriptor-meta.ts:179-186` | Confirmed |
| 26 | `pgvector.cosine` sits under `postgres` | `3-extensions/pgvector/src/core/descriptor-meta.ts:66-69` | Confirmed |
| 29–35 | `sql.*` keys | `postgres/…/descriptor-meta.ts:187-194` | Confirmed; added the real `checkConstraint: true` so the excerpt matches an emitted file |
| 41 | packs contribute keys; re-emitting changes the set | `capabilities.ts:70-87`; `contract-emit.ts:252` | Confirmed |
| 47–51 | SQLite scalar-list diagnostic text | `contract-psl/src/psl-field-resolution.ts:497-503` | Confirmed (quote is the first sentence of the message verbatim; the message continues "Remove the list or author it against a target that supports scalar lists.") |
| 54 | error code | `builder-base.ts:287`; `sql-orm-client/src/collection-contract.ts:583,599` | **Corrected** by addition — the page now names `ORM.CAPABILITY_MISSING` |
| 56–58 | both quoted messages | `builder-base.ts:288`; `collection-contract.ts:600` | Confirmed verbatim |
| 61 | error raised while the query is constructed | `builder-base.ts:56-64` (`_gate` wraps the method call) | Confirmed |
| 69 | `sql.lateral`; "SQLite does not declare it" | `6-adapters/sqlite/src/core/descriptor-meta.ts:23` declares `lateral: false` | **Corrected** — "PostgreSQL reports `true`, SQLite reports `false`" |
| 70 | `sql.returning` | `collection-contract.ts:578-585` | Confirmed |
| 71 | `sql.enums`; "SQLite does not declare it" | `sqlite/…/descriptor-meta.ts:27` declares `enums: false` | **Corrected** — "SQLite reports `false`" |
| 72 | `sql.defaultInInsert` for multi-row inserts | `sql-orm-client/src/collection.ts:1483` | Confirmed |
| 73 | `sql.scalarList` | `psl-field-resolution.ts:497` | Confirmed |
| 74 | `postgres.distinctOn` | `collection-contract.ts:587-602` | Confirmed |
| 75 | `postgres.jsonAgg` "JSON aggregation for nested reads" | declared only | **Q** (see below) |
| 76 | `postgres.pgvector.cosine` "cosine distance operations" | declared only; the operations are `cosineDistance` / `cosineSimilarity` | **Corrected** — "Contributed by the pgvector pack, alongside its cosine operations" |
| 80 | MongoDB declares no keys | `3-mongo-target/1-mongo-target/src/core/descriptor-meta.ts:15` (`capabilities: {}`); driver control at `3-mongo-driver/src/exports/control.ts:27` | Confirmed |
| 84 | recorded at emit time, not probed | static declarations on the descriptors; merged in `contract-enrichment.ts:66` | Confirmed |
| 84 | `db verify` compares schema and profile using the hashes | `cli/src/control-api/operations/db-verify.ts:287-305`; `cli/src/orm/db/verify.ts:149` | Confirmed |
| 86, 97, 98 | links to `/orm/extensions/using-extensions`, the artifact page, `/cli/configuration` | pages exist | Confirmed |

## 3. Q list (unverifiable, page text left alone)

1. **`postgres.jsonAgg` "JSON aggregation for nested reads"** — the key is declared by the PostgreSQL and SQLite adapters but nothing in `src` reads it in rc.10. Searches: `grep -rn "jsonAgg" --include='*.ts' packages` (only `descriptor-meta.ts`, `adapter.ts`, generated `contract.d.ts` files, and tests); `grep -rn "capabilities\['sql'\]\|capabilities\['postgres'\]"` across `packages`.
2. **`sql.enums` "Enum value sets enforced in the database"** — same situation: declared by both adapters, read nowhere. Searches: `grep -rn "'enums'" --include='*.ts' packages/2-sql packages/3-targets | grep -i capab` (no hits); the `capabilities['sql']` grep above returned only `checkConstraint` and `scalarList`.
3. **Purity bullets 2 and 3 on the TypeScript page** ("Functions, class instances, and `Date` objects do not serialize") — no code in the tree rejects such values or states the rule. Searches: `grep -rn "process.env\|Date\b\|non-serializable\|NOT_SERIALIZABLE" --include='*.ts' packages/2-sql/2-authoring/contract-ts/src/` (no hits); `grep -rn "throw\|error" .../is-plain-record.ts` (no hits). Bullet 1 is a fair reading of `hashing.ts`, which hashes the built contract, but the source does not state the rule either.

Also worth flagging, not on the page: `CONFIG.MISSING_EXTENSION_PACKS` exists as an error factory in `1-framework/1-core/errors/src/control.ts:356` but has **no caller** in rc.10 outside its own unit test. I therefore did not add the "emit fails with…" sentence that would have made the extension-pack paragraph sharper.

## 4. Line counts

| Page | Before | After |
| --- | --- | --- |
| `typescript-schema-builder.mdx` | 282 | 282 |
| `capabilities.mdx` | 97 | 98 |

The one added line on the capabilities page is the real `"checkConstraint": true` entry in the `contract.json` excerpt.

## 5. Checker status

- `typescript-schema-builder.mdx` — `check-plain.sh` prints **clean**; the extra page-conventions grep is clean (only `codecId` inside code, and the pinned `[#keep-the-contract-file-pure]` anchor).
- `capabilities.mdx` — the extra page-conventions grep is clean. `check-plain.sh` still reports seven lines, all of which you told me to keep: `title: Capabilities`, `url: /orm/contract-authoring/capabilities`, `metaTitle: Capabilities in Prisma ORM`, and the four headings. Every prose sentence is clean. Tell me if you want the headings and title reworded with pinned anchors instead, and I will do that in one pass.