# PostgreSQL limitations: checked against prisma/orm v8.0.0-rc.19

Sources: prisma/orm at tag `v8.0.0-rc.19` (1e98c69e1b), release notes `docs/releases/v8.0.0-rc.*.md` at `origin/main` (6af54250f1), and GitHub issues and pull requests. `origin/main` is 9 commits ahead of rc.19. One of them (#30829) moves packages to new folders, for example `packages/3-targets/3-targets/postgres/` becomes `packages/3-targets/postgres/1-target/`. None of the 9 changes any finding below. Paths in this file are rc.19 paths unless marked.

## Summary

| # | Claim | Status at rc.19 | Evidence |
|---|---|---|---|
| 1 | Policy ordering bug, fixed by #30232 | Fixed in rc.13, so in rc.19. The claim describes the bug wrongly. | #30232 merged 2026-09-25; rc.13 release note line 119; `postgres/src/core/migrations/planner.ts:443` and `:816` |
| 2 | `contract infer` refuses policies that span several schemas | True in code, but not the limit a user meets. `contract infer` reads only the `public` schema. | `postgres/src/core/psl-infer/infer-psl-contract.ts:190-205`; `cli/src/control-api/client.ts:553-566`; adapter `control-adapter.ts:688`; open #30573, #29923 |
| 3 | No way to author `GRANT` | True | No grant code in the target or PSL interpreter; `skills/prisma-8/references/supabase.md:30,213` |
| 4 | `FORCE ROW LEVEL SECURITY` not modelled | True | No reference to `FORCE` or `relforcerowsecurity` anywhere in `packages/`; introspection reads only `relrowsecurity` (`6-adapters/postgres/src/core/control-adapter.ts:1452`) |
| 5 | `@@index([field(sort: Desc)])` fails with "Expected a field name" | True on PostgreSQL. #30270 is open. | `contract-psl/src/sql-attribute-specs.ts:528`; `psl-parser/src/attribute-spec/combinators/field-ref.ts:19,23` |
| 6 | FK, `@@unique`, `@@index` on a single-table variant are silently dropped | True. #30445 is open. | `contract-ts/src/describe-model.ts:128-136`; `contract-psl/src/interpreter.ts:1984-2037` |
| 7 | Adopted expression index with `map:` reports drift | Mostly false as written. True only for SQL written by hand. | `skills/prisma-8/references/contract.md:129,363`; `contract-psl/README.md:121`; `psl-infer/infer-sql-text.ts:5-35`; comment on #30294 |
| 8 | `@@control` on `external` tables with relations or enums is partly handled | Cannot verify as written. No issue, note or code says this. Related facts below. | Searches listed in note 8 |
| 9 | `@noCheck` | Removed in rc.19. It exists on no attribute. | rc.19 release note line 64; #30741 merged 2026-10-16; `sql/1-core/contract/src/validators.ts:248-257` |
| 10 | `createExtension(name)` and `this.installExtension({ extensionName, invariantId, id, label? })` | True | `postgres/src/core/migrations/operations/dependencies.ts:7,38-46`; `postgres-migration.ts:749-755`; `postgres/src/exports/migration.ts:27` |

## Notes

### 1. Policy ordering

The bug was about drops, not creates. When one change removed a column and a policy that used it, the plan dropped the column first, and PostgreSQL refused (error 2BP01). #30232 moves every policy drop to just before the first statement a policy can block: dropping a column, changing a column's type, dropping a table that another table's policy uses, dropping a native enum, or a destructive type change. Policy creates still run after the structural changes, which is correct. See `planner.ts:443-460` and the comment at `planner.ts:806-817`.

Release note, rc.13 line 119: "A Postgres migration that removes a column and a row-level security policy that references it drops the policy first, so the migration applies."

Merge commit `35f262d10c` is an ancestor of rc.19 and not of rc.12. Docs should not list this as a limitation.

### 2. Policies across several schemas

The refusal exists. `infer-psl-contract.ts:190-205` throws `CONTRACT.INFER_UNSUPPORTED` when native enums or RLS policies exist and the tables and enums come from more than one schema. The same file refuses a table name that occurs in two schemas (`:135-142`). It also refuses a column typed by a native enum that an extension pack already describes (`:144-160`).

But the CLI cannot reach the first refusal. `contract infer` calls `client.introspect()` with no contract (`cli/src/orm/contract/infer.ts:133`). The client drops the `schema` option (`client.ts:553`: "TODO: Pass schema option to familyInstance.introspect when schema filtering is implemented"). The adapter then reads only `public` (`control-adapter.ts:682,688`). So the limit a user meets is wider: `contract infer` reads only the `public` schema, and ignores tables, enums and policies in every other schema. Open issues: #30573 ("`contract infer` does not run against schemas outside the public schema") and #29923. Pull request #29944 is open. `origin/main` is the same.

Suggested wording: "`contract infer` reads only the `public` schema."

### 3. GRANT

No code in `postgres/src` or `contract-psl/src` authors grants. The skill says so in plain words: "Prisma 8 authors and migrates the policies; it does not author grants" (`supabase.md:30`), and lists "`GRANT` authoring" under "What Prisma 8 doesn't do yet" (`supabase.md:213`).

### 4. FORCE ROW LEVEL SECURITY

`git grep` for `FORCE ROW`, `forceRowLevel` and `relforcerowsecurity` finds nothing in `packages/` at rc.19 or at `origin/main`. The migration operations are only `enableRowLevelSecurity` and `disableRowLevelSecurity` (`migrations.md:404`). Introspection selects `relrowsecurity` only (`control-adapter.ts:1452`). So a contract cannot turn FORCE on, `contract infer` does not read it, and `db verify` does not see it.

### 5. Sort order in `@@index`

`@@index` takes its field list as `list(fieldRef())` (`sql-attribute-specs.ts:528`). `fieldRef` accepts only a bare name and otherwise reports "Expected a field name" (`field-ref.ts:19,23`). #30270 is open. Two pull requests that only improve the message, #30277 and #30303, are open and not merged. `origin/main` is the same (`packages/2-sql-family/2-authoring/contract-psl/src/sql-attribute-specs.ts:555`).

rc.17 (#30636) gave MongoDB a new form, `@@index([sort(createdAt, Desc)])`. That change is for MongoDB only. PostgreSQL has no sort syntax in a field list.

Workaround that the code supports: an expression index. `expression:` holds the whole index element list (`contract-psl/README.md:116`), for example ``@@index(expression: sql`"createdAt" DESC`, name: "post_created_desc")``. I did not run this against a database.

### 6. Single-table variants

`describeModelStorage` returns only the columns for a variant that shares its base table. It throws for a `@@check` (`CONTRACT.CHECK_ON_STI_VARIANT`), but drops the variant's uniques, indexes and foreign keys without a message (`describe-model.ts:128-136`). `materializeStiVariantStorageColumns` copies only columns to the base table (`interpreter.ts:1984-2037`). #30445 is open. `origin/main` is the same.

Issue #30445 also mentions a companion bug: a required relation on a single-table variant is refused.

### 7. Expression index adopted with `map:`

For an index that `contract infer` adopts, the claim is false. With `map:`, Prisma compares the stored SQL text with PostgreSQL's reprint, byte for byte. `contract infer` writes PostgreSQL's own reprint into the contract, so both sides match. The skill says the comparison "is still sound because both sides are Postgres's own reprint" (`contract.md:363`).

Two cases still go wrong:

- **Hand-written SQL with `map:`.** If you write the SQL yourself and use `map:`, your text rarely matches PostgreSQL's reprint, and `db verify` and `migration plan` report a difference. `contract emit` warns about every `map:` with a SQL body (`PN_EXACT_NAME_BODY_COMPARISON`, `sql/1-core/contract/src/index-naming.ts:106`; `contract-psl/README.md:121`). The fix is to use `name:`. Issue #30294 (open) shows this for a check constraint: `NOT IN (...)` against PostgreSQL's `<> ALL (ARRAY[...])`. The maintainer comment on that issue gives the same diagnosis and the same fix.
- **SQL that a `sql` literal cannot hold unchanged.** `contract infer` leaves such an index, check or policy out of the contract and writes a comment. The next `migration plan` would then drop it (`psl-infer/infer-sql-text.ts:5-6`, `printableIndex` at `:19-35`).

Suggested wording: "Use `map:` only for SQL that `contract infer` wrote. For SQL you write, use `name:`."

### 8. `@@control` on external tables with relations or enums

I found no source for this claim. Searches: `gh issue list` and `gh pr list` in prisma/orm for "@@control", "control policy", "external enum", "control external" and "external table foreign key"; `git grep` for `external` with `control` or `policy` in `contract-psl/src`, `postgres/src` and `sql/9-family/src`; the rc.13 to rc.19 release notes; and the skill references. The 2026-09-28 note that lists the claim (`wip/design/docs/orm-docs-audit/changes.md:102`) cites no source.

What the code does show:

- `external` and `observed` tables get no DDL at all (`sql/9-family/src/core/migrations/control-policy.ts:71-86`). That includes foreign keys, indexes and checks declared on them. This is by design.
- Enum columns on a table that is not `managed` get no generated membership check. That is by design: "Checks are derived only for tables Prisma 8 owns" (`contract-ts/src/lower-table.ts:57-65`; `derived-checks.ts:42-44,160`). A `@@check` you write yourself is kept.
- A foreign key from your managed table to an `external` table works. The Supabase pack does this with `auth.users` (`supabase.md:55`).
- PSL sets a control policy only on a model. A native enum or a column with its own control policy "cannot be written in Prisma 8 PSL" (`postgres/src/core/psl-print/refusals.ts:415-417,829-831`). The TypeScript builder can do it.

Recommendation: drop the claim, or replace it with the precise facts above.

### 9. `@noCheck`

At rc.19 `@noCheck` does not exist on any attribute. rc.19 removed it (#30741, merged 2026-10-16). rc.19 release note, line 64: "`@noCheck` is removed, and a list that allows null elements is written `T?[]`."

Before rc.19, `@noCheck` sat on a field. It switched off the CHECK constraints Prisma generates for that column: `@noCheck` alone switched off all of them, `@noCheck(membership)` the enum membership check, `@noCheck(elementNotNull)` the no-NULL-elements check on a list (rc.2 release note line 122; rc.18 `contract-psl/src/psl-field-resolution.ts:154-157,334-369`). The TypeScript builder had `.noCheck(...)`.

At rc.19:

- `T[] @noCheck(elementNotNull)` becomes `T?[]`. In TypeScript, use `.many({ elementsNullable: true })`.
- `@noCheck(membership)` is deleted, with no replacement. On a managed table every enum column gets a membership check, and you cannot turn it off. Skill: "Generated checks cannot be waived" (`contract.md:342`).
- A stored contract that still has a `noCheck` key no longer loads (`sql/1-core/contract/src/validators.ts:248-257`). The upgrade recipe has a script that rewrites stored contracts and migration snapshots. Then run `prisma db sign`.
- A Prisma 7 schema's lists now load as `T?[]`, which changes the storage hash.

So the blog post (prisma/web#8520) understates it. All of `@noCheck` is gone, not only the enum form.

### 10. Extension helpers

- `createExtension(extensionName: string)` is a free function exported from the migration entry point (`postgres/src/exports/migration.ts:27`, which `@prisma/orm-postgres/migration` re-exports from `3-extensions/postgres/src/exports/migration.ts:1`). It runs `CREATE EXTENSION IF NOT EXISTS "<name>"` with no prechecks or postchecks (`dependencies.ts:7-22`).
- `this.installExtension({ extensionName, invariantId, id, label? })` is a protected method on the PostgreSQL migration class (`postgres-migration.ts:749-755`). The four options match the docs. It returns a Promise. `label` defaults to `Enable extension "<name>"`. It adds a precheck and a postcheck against `pg_extension` and records `invariantId` (`dependencies.ts:38-76`).
- One detail: `installExtension` does not quote the extension name in its SQL (`CREATE EXTENSION IF NOT EXISTS ${extensionName}`, `dependencies.ts:68`), but `createExtension` does. A name that needs quotes, for example one with a hyphen such as `uuid-ossp`, works with `createExtension` and fails with `installExtension`. I did not run this.

## Other limitations found

These are in rc.19's code, its skill reference or open issues, and are not in the list above.

Row-level security:

- A policy block must be in the same namespace as its target model, and the model must have `@@rls`, or emit fails with `PSL_EXTENSION_TARGET_MODEL_MISSING_ATTRIBUTE` (`supabase.md:55,98`).
- `contract infer` skips a policy, and writes a comment, when one of its roles is not a valid PSL identifier, or when its SQL cannot be written as a `sql` literal that reads back unchanged (`psl-infer/infer-policy-blocks.ts:72-88`).
- Triggers and functions are not part of the contract. For example, a trigger that creates a profile row on sign-up is written as raw SQL (`supabase.md:215`).

Indexes:

- An `expression:` index needs `name:` or `map:` (`PSL_INDEX_EXPRESSION_REQUIRES_NAME`).
- An index takes exactly one of a field list or `expression:` (`PSL_INDEX_FIELDS_XOR_EXPRESSION`). See `sql-attribute-specs.ts:557-578`.

Check constraints:

- `@@check` on a single-table variant is refused (`PSL_CHECK_ON_STI_VARIANT`, `CONTRACT.CHECK_ON_STI_VARIANT`). Declare the check on the base model.
- Prisma does not check the SQL syntax of a `@@check` expression (`contract.md:360`).
- `@@check` with `map:` and SQL written by hand reports false drift. Issue #30294 is open. See note 7.

`contract infer`:

- It reads only the `public` schema (note 2, #30573).
- It refuses a table name that occurs in two schemas, and a column typed by a native enum that an extension pack describes (`infer-psl-contract.ts:135-160`).

Not about these features, but close: #30510 (open). `db verify` ignores foreign key names, so a planned drop of a foreign key that has a different name is skipped and the key stays.
