# Slice: the Advanced PostgreSQL page

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/`. Item C7 of `changes.md`, decided by Will on 2026-09-28: documented as supported, with a Limitations section. Reader job J8 in `journeys.md`. Written 2026-10-22 by `seacole-52`.)_

## At a glance

Every construct J8 asks for is in the reference already: `@@rls` and the `policy_*` blocks, `@@index` with `expression:`, `where:`, `unique:`, and `type:`, `@@check`, `@@control`, and `createExtension` in a migration, each on `psl-syntax.mdx`, `typescript-schema-builder.mdx`, or `migration-api.mdx`. What is missing is the page a reader with a real PostgreSQL database opens first: one page that says what Prisma ORM 8 can express, shows each construct once in the reader's own situation, and lists what it cannot do yet. After this slice that page exists at `/orm/contract-authoring/advanced-postgresql`.

## Chosen design

All paths are under `apps/docs/content/docs/`. Do not touch `v6/` or `v7/` folders.

- New page `orm/contract-authoring/advanced-postgresql.mdx`, titled "Advanced PostgreSQL", in `orm/contract-authoring/meta.json` after `typescript-schema-builder`. Sections, each opening with the situation ("Your rows belong to users, and each user may read only their own"), then the PSL for it, then one sentence on what `migration plan` and `db verify` do with it, then the link to the reference section with the full options:
  1. Row-level security: `@@rls`, one `policy_select` and one `policy_update`, a `role` block, `namespace`. Link `psl-syntax.mdx#row-level-security` and the TypeScript builder's section.
  2. Expression and partial indexes: `@@index(expression:, name:)`, `@@index([field], where:)`, `unique:`, `type:`. Link `psl-syntax.mdx#indexes`.
  3. Check constraints: `@@check(expression:, name:)`, and the two checks Prisma ORM adds itself (enum columns, list columns). Link `psl-syntax.mdx#check-constraints`.
  4. Tables Prisma ORM should not manage: `@@control(observed | external | tolerated)`, with the table from the reference. Link `psl-syntax.mdx#control-policy`.
  5. Extensions a migration needs: `createExtension('pgcrypto')` in `operations`, and when `installExtension` applies instead. Link `migration-api.mdx#extensions`.
  6. Adopting these from an existing database: what `contract infer` reads back and what it does not, with `map:` for names that must match. Link `cli/contract-infer.mdx`.
  7. Limitations: only the items `wip/slice-08/limitations.md` confirms at rc.19, each with what the reader does instead, and the prisma/orm issue where one is open.
- Status: supported. The page says so once, in the opening paragraph, and names the Limitations section.
- `orm/data-modeling/relational-databases.mdx` Next steps links the page. `psl-syntax.mdx`'s Indexes, Check constraints, Control policy, and Row-level security sections each gain one sentence pointing at the page for the situations.

Wording rules: the C21 conventions, `plain-language.md`, no commentary about the docs. Every SQL string in an example is one PostgreSQL would accept. Each example is checked against the rc.19 test fixtures in prisma/orm before the PR.

## Checks before the PR

`check-plain.sh`, `check-ai-signs.sh`, `check-staccato.py`, `cspell`, `lint:links`, `lint:versions`; two cold reader rounds with `references/reader-persona.md`; a fact re-check of every claim and example against `v8.0.0-rc.19` of prisma/orm.
