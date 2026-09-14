Both pages are edited and the plain-language checker prints clean on each.

## 1. Banned-term and wording replacements

**the-data-contract.mdx**

| Line | Old | New |
| --- | --- | --- |
| 3, 6 | front matter: "single description", "typed, planned, and verified", "the same artifacts" | plain rewording, no "artifacts" |
| 9 | "That description is the data contract." | "…the data contract, the `contract.prisma` file that replaced `schema.prisma`." (section convention, first use) |
| 33 | "compiles this into a machine-readable artifact" | "`prisma contract emit` turns this source into two machine-readable files" |
| 45 | "Prisma ORM's current architecture" | "Prisma ORM 7" (now reads as a contrast) |
| 47 | "a canonical JSON description of models, storage, and capabilities"; "Both are deterministic … byte-identical output"; "the artifacts can be diffed" | "describes your models, how they are stored, and which database features the contract needs"; "The same source always produces the same two files, so you can read them in a code review…" |
| 49 | "records them in a small marker inside the database" | the section's mandated marker wording: "records which contract the database matches in a small table it creates in the database" |
| 68–72 | "Emitting turns the source into the artifacts"; `npx prisma@latest contract emit` | "Run `prisma contract emit` after every change… It writes `contract.json` and `contract.d.ts` beside the source"; `npx prisma contract emit` |
| 77 | "The runtime receives `contract.json`" | "`db` reads `contract.json`" ("runtime" as a noun is banned) |
| 80 | heading "## Two authoring modes, one artifact" | "## Two authoring modes, one \`contract.json\` [#two-authoring-modes-one-artifact]" (old anchor pinned) |
| 82 | "the preferred way … purpose-built for describing data"; "what `create-prisma` scaffolds"; "what the examples throughout these docs use" | "the usual way … a compact language for describing data"; "what `npm create prisma@latest` scaffolds"; docs-commentary clause cut |
| 86 | "emit the same `contract.json`"; "verification"; "exactly one source of truth" | "write the same `contract.json`"; "database checks"; "exactly one contract file, the one named by `contract` in the config" |
| 94–98 | "value objects"; "types and capabilities contributed by extension packs"; "committing … the emitted artifacts" | "`type` blocks, each a structured value stored inside its parent row with no table of its own"; "the types and database features that extension packs add"; "committing the source, `contract.json`, and `contract.d.ts`" |
| 102 | "Projects scaffolded with `create-prisma@latest` install…" | the mandated sentence, including `npx prisma skills sync` |
| 105 | "and emit it" | "and run prisma contract emit" |

**the-contract-artifact.mdx**

| Line | Old | New |
| --- | --- | --- |
| 3, 6 | "deterministic artifacts", "deterministic emission" | plain rewording |
| 9 | "This page explains what is in each, why they are deterministic…" | deleted (docs commentary) |
| 13 | "canonical, machine-readable contract … capabilities"; "The runtime, … verification" | "machine-readable contract: … which database features they need"; "`db`, the migration tooling, the database checks" |
| 18 | heading "## Deterministic emission" | "## The same source always produces the same two files [#deterministic-emission]" (old anchor pinned) |
| 20–22 | "Emission is deterministic"; "canonical order"; "the contract source must stay pure" | "Run `prisma contract emit` … byte-identical files"; "a fixed key order"; "must not read the environment, the clock, or random values" |
| 34 | "records the hashes in a marker inside the database"; "caught by verification rather than by a failing query" | mandated marker wording, plus the corrected behaviour (see below) |
| 105 | "the model it names is what `db.orm.public.User` hangs off" | "the model name is what `db.orm.public.User` uses" |
| 106–107 | "a `codecId` … which names the codec that encodes and decodes values"; "native type plus codec" | "its type id, such as `pg/text@1`, the PostgreSQL type plus a version, always `@1` today"; "a native type and a type id" |
| 109 | "Query APIs consult these before using gated features" | "The query APIs check these before building a query that needs one" |
| 129 | "type-incompatible with another version's artifacts"; "before verification has to" | "will not type-check against another version's files"; "before `prisma db verify` has to" |
| 151 | "without re-running emission"; "running the emit" | "without running `prisma contract emit` first"; "running the command" |
| 155, 158 | scaffold/skills sentence; "Re-emit the contract … in the artifact" | mandated sentence; "Run prisma contract emit and show me what changed in contract.json" |
| 162 | "how the contract's capabilities gate database features" | "which database features the contract needs, and how Prisma ORM checks that your database has them" |

Two lines carry `{/* plain-language:defined */}`: the pinned anchor `[#deterministic-emission]` and the Next-steps link whose **URL path** is `/orm/contract-authoring/capabilities`. Both trip the checker on a code-like string, not on prose jargon. I removed a second link to that URL rather than add a third marker.

## 2. Claims checked

| Line | Claim | Deciding source | Verdict |
| --- | --- | --- | --- |
| dc 31 | `// use prisma-8` is the first line; marks a Prisma 8 contract | `packages/1-framework/3-tooling/language-server/src/schema-directive.ts:1`; `CHANGELOG.md:33` | Confirmed |
| dc 31 | language server only diagnoses/completes/formats files carrying it | `document-diagnostics.ts:27`; `server.ts:384`; completion needs `project.artifacts.document(uri)` (`server.ts:452`) | Confirmed |
| dc 31 | "excludes unmarked files from its schema composition" | `schema-inputs.ts` — the input set comes only from `contract.source.inputs` in the config; no composition exclusion in rc.10 code | **Corrected**: clause deleted (it was an rc.9 release-note line) |
| dc 31 | completion covers field/model/block attribute names and argument keys from target and extensions | `completion-provider.ts:41-47`; `server.ts:464-479` | Confirmed |
| dc 31 | pre-rc.10 contracts use `// use prisma-next`; still accepted, replaced on format | `docs/releases/v8.0.0-rc.10.md:25`; `schema-directive.ts:9`; `server.ts:395` | Confirmed |
| dc 33 | "the database is verified against it before your code runs" | `packages/2-sql/5-runtime/src/sql-runtime.ts:897-928` — mismatch only logs `CONTRACT.MARKER_MISMATCH` | **Corrected**: now "`prisma db verify` checks a live database against it" |
| dc 35 | `package-lock.json` comparison | wording only | Confirmed (unchanged) |
| dc 45 | Prisma ORM 7 compiles the schema into generated client code | contrast claim about v7, not in this tree | **Q1** |
| dc 47 | same source produces the same two files | `packages/1-framework/0-foundation/contract/src/canonicalization.ts:179-209`, `emit.ts:31-48` | Confirmed |
| dc 49 | `db sign` records hashes in a table it creates | `packages/2-sql/9-family/src/core/control-instance.ts:825-895`; table is `prisma_contract.marker` (`3-targets/6-adapters/postgres/src/core/control-adapter.ts:98`) | Confirmed |
| dc 49 | client checks before its first query; **fails on mismatch** | `sql-runtime.ts:368-371, 897-928`; `docs/releases/v0.12.0.md:87` ("no longer throws … emits one warn-level log line") | **Corrected**: "logs a warning … To fail instead of warn … run `prisma db verify`" |
| dc 56 | `import { definePrismaConfig } from "prisma/config"` | `cli/src/commands/init/templates/code-templates.ts:304` | **Corrected**: `from "@prisma/cli-engine"` |
| dc 57 | `defineConfig as ormConfig` from `@prisma/orm-postgres/config` | same file + every `examples/*/prisma.config.ts` | Confirmed |
| dc 66 | file extension selects PSL vs TypeScript mode | `packages/3-extensions/postgres/src/config/define-config.ts:43-52` | Confirmed |
| dc 71 | `npx prisma@latest contract emit` | page conventions (existing project) | **Corrected**: `npx prisma contract emit` |
| dc 74 | emit writes both files beside the source | `cli/src/orm/contract/emit.ts:55,84`; `define-config.ts:25-33` | Confirmed |
| dc 76–78 | who reads which file | `emit.ts`, `sql-runtime.ts`, `cli/src/orm/db/verify.ts:81-155` | Confirmed, wording corrected on the middle bullet |
| dc 82 | PSL is the usual mode; `contract infer` writes PSL | `cli/src/orm/contract/infer.ts:132-201`; `templates/code-templates.ts:67` (`src/prisma/contract.prisma`) | Confirmed |
| dc 82 | `npm create prisma@latest` scaffolds PSL | `create-prisma` is not in this tree | **Q2** |
| dc 86 | identical `contract.json` for an equivalent schema | `contract-psl/test/ts-psl-parity.test.ts:342-870`; `psl-ts-namespace-parity.test.ts` | Confirmed |
| dc 92–96 | what the contract contains | real `contract.json` at `examples/prisma-8-demo/src/prisma/contract.json` | Confirmed |
| ar 11–14 | the table | `emit.ts`, `cli/src/orm/contract/emit.ts:73-85` | Confirmed after rewording |
| ar 16 | generated-file notice in both files | `emitter/src/emit.ts:39-44`; `examples/prisma-8-demo/src/prisma/contract.d.ts:1-3` | Confirmed |
| ar 20 | fixed key order | `canonicalization.ts:66 TOP_LEVEL_ORDER`, `:179-209 sortObjectKeys` | Confirmed |
| ar 30 | `storageHash` covers "models, fields, relations, and the full storage layout" | `contract/src/hashing.ts:72-83` hashes only `storage`; `build-contract.ts:1540-1547` | **Corrected**: now "the storage layout: tables, columns, primary keys, uniques, indexes, foreign keys, and the value sets behind enums" |
| ar 31 | `executionHash` covers pre-write defaults | `hashing.ts:85-92`; `build-contract.ts:1596-1602`; real `execution.mutations.defaults` | Confirmed |
| ar 32 | `profileHash` covers the target database and its family | `hashing.ts:94-101` plus `build-contract.ts:1591-1595`, which passes `capabilities: {}` in rc.10 | Confirmed |
| ar 34 | `db sign` checks then records; `db verify` and the client compare | `control-instance.ts:825-895`; `cli/src/orm/db/verify.ts:81-155` (marker + schema, exit code 4) | Confirmed |
| ar 34 | "caught by verification rather than by a failing query" | `sql-runtime.ts:897-928` | **Corrected**: `db verify` fails; `db` warns and carries on |
| ar 38 | domain/storage split, MongoDB collections, namespace = PostgreSQL schema | `examples/prisma-8-demo/src/prisma/contract.json`; `examples/mongo-demo/src/contract.json` (`entries.collection`) | Confirmed, sentence split |
| ar 44–99 | the abridged `contract.json` (section names, `roots`, `domain` field shape, `storage`, `execution`, `capabilities`, `extensions`) | `examples/prisma-8-demo/src/prisma/contract.json`; `contract-ts/src/data-contract-json-schema.ts` | Confirmed; **Corrected** key order inside objects to the emitted alphabetical order (`codecId` before `kind`, `model` before `namespace`, `namespaces` before `storageHash`, etc.) |
| ar 105 | `roots` shape and what it keys | `build-contract.ts:1421-1437` (keyed by bare storage table name) | Confirmed, reworded |
| ar 109 | capabilities "merged from the target, adapter, and extension packs" | `build-contract.ts:1577-1590`; values declared in `3-targets/6-adapters/postgres/src/core/descriptor-meta.ts:172-194` | **Corrected**: "collected from the adapter for your database and any extension packs" |
| ar 109 | query APIs check capabilities before use | `2-sql/4-lanes/sql-builder/src/runtime/builder-base.ts:62, 278-290` (`ORM.CAPABILITY_MISSING`) | Confirmed |
| ar 116–126 | `contract.d.ts` excerpt: `StorageHashBase`, `ProfileHashBase`, `CodecTypes[...]["output"]`, `AddressOutput` | `examples/prisma-8-demo/src/prisma/contract.d.ts:41-46, 264-269`; `emitter/src/generate-contract-dts.ts` | Confirmed, verbatim match |
| ar 134–143 | `src/prisma/db.ts` example | `examples/prisma-8-demo/src/prisma/db.ts:1-11`; `templates/code-templates.ts:318-331` | Confirmed |
| ar 131 | `prisma orm init` writes `src/prisma/db.ts` (added) | `cli/src/orm/init-scaffold.ts:188`; `1-core/config/src/config-types.ts:45` | Confirmed |
| ar 151 | version-control advice | no rows/credentials in the emitted files; `--output-path` flag exists | Confirmed |
| ar 160–163 | Next-steps CLI links | `apps/docs/content/docs/cli/` contains `contract-emit`, `contract-infer`, `db-sign`, `db-verify`, `db-init`, `migration-plan` | Confirmed |

No test covers the runtime warning path directly that I found; the behaviour above comes from `sql-runtime.ts` and the v0.12.0 release note.

## 3. Q list

- **Q1** (dc 45, "Prisma ORM 7 compiles your schema into generated client code"): nothing about Prisma ORM 7 exists in the rc.10 tree. Searches: `grep -rn "prisma-client-js\|generated client" wip/prisma-src/docs wip/prisma-src/skills`, `grep -rn "Prisma ORM 7" wip/prisma-src`. Left as written.
- **Q2** (dc 82, "`npm create prisma@latest` scaffolds PSL"): `create-prisma` is not in this checkout. Searches: `find wip/prisma-src -type d -name 'create-prisma*'`, `grep -rn "create-prisma" wip/prisma-src/packages`. I used the wording `conventions.md` mandates. The related fact that `prisma orm init` defaults to `src/prisma/contract.prisma` is confirmed.

## 4. Line counts

| Page | Before | After |
| --- | --- | --- |
| the-data-contract.mdx | 143 | 143 |
| the-contract-artifact.mdx | 165 | 163 |

## One thing for you to decide

The artifact page's front-matter `title` is still **"The emitted artifacts"**, which `page-conventions.md` bans as a phrase. I left it because three pages I must not touch link to it by that exact text (`orm/core-concepts.mdx:61`, `psl-syntax.mdx:329`, `typescript-schema-builder.mdx:281`) and `meta.json` orders the section by slug. Renaming it needs a coordinated pass across those pages.