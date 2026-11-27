# Slice: close the gaps on the migration pages and the CLI reference

_(Parent project: the Prisma ORM 8 docs audit, `docs/orm-docs-audit/` on branch `docs/orm8-docs-audit-design`, open as prisma/web#8243. This slice closes section E of `changes.md` and removes a contract reference form that no command accepts.)_

## At a glance

One prisma/web pull request that fixes twelve small, verified gaps on the Prisma ORM 8 migration pages and CLI reference pages. Each gap is a place where a reader meets a symbol, token, term, or hash the page never explains, or a command the page tells them to run without showing it. The same pull request corrects the contract reference forms listed on five CLI pages: they advertise a `./path` form that no command accepts, and two of them omit `<dir>^` where it works. Every fact below was checked on 2026-09-28 by running `prisma@8.0.0-rc.17` with `@prisma/orm-postgres@8.0.0-rc.12` against PostgreSQL 15.

## Terms used in this spec

- **Contract state**: one version of the contract, identified by its storage hash (64 hex characters).
- **Contract reference**: the text a command accepts to name a contract state, for example a hash prefix or a ref name.
- **Marker**: the row in the database that records which contract state it matches. On PostgreSQL it lives in the `prisma_contract.marker` table.
- **Contract space**: a separate migration history with its own directory under `migrations/`. The app's is `migrations/app/`; an extension package that ships migrations, such as pgvector, has its own.
- **`<dir>^`**: a migration directory name followed by `^`, naming the contract state before that migration (its `from` hash). A bare directory name names the state after it (its `to` hash).

## Chosen design

All paths are under `apps/docs/content/docs/`. Change only the Prisma ORM 8 tree; never touch `orm/v6/`, `orm/v7/`, or any other `v7/` folder. Line numbers are from `main` at `142c18b4d` and are for orientation only; find each passage by its text.

### E1. Explain the lane lines in the migration graph drawing

File: `orm/migrations/the-migration-graph.mdx`, the paragraph right after the drawing in "A worked example" (it starts "Read it from the bottom up").

The CLI's `--legend` output explains `○`, `↑`, `↓`, `⟲`, `✓`, `⧗`, `∅`, the `@` markers, and ref labels. It does not explain the lane lines, and the page currently tells readers `--legend` covers "the other symbols". Add, after the sentence about `↑` rows: each column is a lane, one per branch of the history; a `│` carries a lane up past rows that belong to another lane; `╯` with `─` joins a lane to the state it starts from, so `│─╯` above `4437973` shows that the right-hand lane (Bob's migration) starts from the same state as the left-hand one (Alice's). Change "and `--legend` prints a key to the other symbols" to say that `--legend` prints a key to the row symbols (`○`, the arrows, `✓` and `⧗`, `∅`, and the labels).

### E2. Define `<dir>^` where The migration graph first uses it

File: `orm/migrations/the-migration-graph.mdx`, the paragraph starting "To say which state a ref should point at". At its first mention, say that `<dir>^` is a migration directory name followed by `^`, and names the contract state before that migration, while the directory name alone names the state after it. The later use in the "Common tasks" table then needs no change.

### E3. State the accepted contract reference forms once, in a table

File: `orm/migrations/the-migration-graph.mdx`, section "Name important states with refs". Replace the paragraph that starts "Not every command takes every token" with one sentence introducing a table, the table below, and then the existing `db migrate --show --from @contract --to prod` example sentence. Shorten the `ref set` sentence in the paragraph above it to the command's purpose plus "the table below lists the forms it accepts". In section "Adding a migration you write yourself", keep the explanation of what `migration new --from` takes, and add a link to the table.

| Command and option | Accepts |
| --- | --- |
| `migration plan --from`, `--to` | a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or `@empty` |
| `migration new --from` | a hash, or a prefix of one, that an existing migration ends at |
| `migration ref set <name> <contract>` | a hash, a hash prefix, a ref name, a migration directory name, or `<dir>^` |
| `migration status --from`, `--to` | a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or `@empty` |
| `db migrate --to` | a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or `@empty` |
| `db migrate --show --to` | the same, and `@contract` |
| `db migrate --show --from` | a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, `@contract`, `@db`, or `@empty` |
| `db update --to` | a hash, a hash prefix, a ref name, a migration directory name, or `<dir>^` |
| `db sign [contract]`, `--contract` | a hash, a hash prefix, a ref name, a migration directory name, or `<dir>^` |

A hash prefix is the first 6 or more characters, matching exactly one contract state. No command accepts a file path.

### E4. Show the commands that replace `migrate reset`

File: `orm/migrations/how-migrations-work.mdx`, the bullet that starts "`migrate reset` has no equivalent" in the list of Prisma ORM 7 commands. Prisma ORM 7's `migrate reset` was PostgreSQL-only, so this bullet covers PostgreSQL only. Keep "has no equivalent", then show the sequence as a code block, with `mydb` as the database name:

```bash
dropdb --if-exists mydb
createdb mydb
npx prisma db migrate --advance-ref db
```

Then state: `npx prisma db init` in place of the last line creates what the contract declares without running the migrations; `db migrate` does not run a seed script, so run yours afterwards; if you cannot drop the database, drop both the `public` schema and the `prisma_contract` schema, because dropping only `public` leaves the marker, and `db migrate` then reports `Already up to date` on an empty database while `db verify` fails.

### E5. Say what `db verify --schema-only` checks where it is used

Files: `orm/migrations/the-migration-graph.mdx` (section "History you can trust") and `orm/migrations/how-migrations-work.mdx` (the paragraph about a `phone` column of another type). At each use, say it compares the tables with the contract and skips the marker check, and link `/cli/db-verify`.

### E6. Say what `migrationHash` is, and that it is not a contract hash

File: `orm/migrations/how-migrations-work.mdx`.

- In the `migration.json` list, the item "its own hash, `migrationHash`, which `npx prisma migration check` reads" becomes: its own hash, `migrationHash`, computed from the rest of `migration.json` and from `ops.json`, so it changes when either file changes; `npx prisma migration check` recomputes it to find edited files.
- After the sentence that says `<target>` can be "the first 6 or more characters of its `migrationHash`", add that this is the migration's own hash, not a contract hash: `migration show` takes a `migrationHash` prefix, while `--from` and `--to` take contract hash prefixes.

### E7. Complete `cli/migration-status.mdx`

- Add a "Sample output" subsection at the start of "Reading the result", with output you capture yourself from `npx prisma migration status` against a database with one migration applied and one pending, in the same shape as this capture:

  ```text
  │  migrations:  migrations
  │  database:    postgresql://****@localhost:54329/gaps

  ○   3008325  @contract
  │↑  20260928T1034_add_user_phone  b5ae4e6 → 3008325  1 ops  ⧗ pending
  ○   b5ae4e6  @db (db)
  │↑  20260928T1033_baseline              ∅ → b5ae4e6  3 ops
  ○   ∅

  ⚠ 1 pending — run `{bin} db migrate --to 300832575ace`
  ```

  Then say it is read from the bottom up and link the reading guide in `/orm/migrations/applying-a-migration#check-before-preview-then-apply`. Say that `{bin}` is the CLI's placeholder for however you ran it, as `guides/database/schema-changes.mdx` already does.
- `--space <id>` row: the id is the contract space's directory name under `migrations/`, `app` for your own migrations; link the contract space definition (see E8).
- `--to` row: "Sets the target contract state. Accepts a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or `@empty`", linking the E3 table.
- `--from` row: keep the offline sentence, and say it accepts the same forms as `--to`.

### E8. Define "contract space" where readers first meet it

Use this definition, with a link to the Terms table on `orm/migrations/the-migration-graph.mdx`: "A contract space is a separate migration history. Your own migrations are in the `app` space, in `migrations/app/`, and each extension package that ships migrations, such as pgvector, has its own."

Add it, or a link to it, at: the first prose paragraph after the `db init` output on `(index)/prisma-orm/from-scratch.mdx`; the sentence about the summary line on `(index)/prisma-orm/quickstart/mongodb.mdx`, where the definition ends after "in `migrations/app/`" because pgvector is a PostgreSQL extension and that page is MongoDB-only; the `--space` row on `cli/migration-status.mdx`; the opening paragraph of `cli/db-migrate.mdx`, replacing "(app and extensions)"; and `cli/index.mdx`, wherever the page first uses the term.

### E9. Say how `init` differs from `orm init` on the GitHub Actions guide

File: `guides/integrations/github-actions.mdx`, in "Prompt your coding agent", where `npx prisma@latest init` is introduced. Add that `init` installs the Prisma agent skills and does not set up Prisma ORM, which `orm init` did in step 2.1, linking `/cli/init`.

### E10. Say that two codes describe the same situation

- `orm/migrations/rollbacks-and-recovery.mdx`, section "Drift", the paragraph about the first kind of drift: after the sentence naming `MIGRATION.MARKER_MISMATCH`, add that when `npx prisma migration status` warns with `MIGRATION.MARKER_NOT_IN_HISTORY`, it has found this same situation, and the next `db migrate` fails with `MIGRATION.MARKER_MISMATCH`.
- `cli/migration-status.mdx`, where `MIGRATION.MARKER_NOT_IN_HISTORY` is named: add the same link in the other direction, pointing at the Drift section.

Word both so they hold whether or not `migration status` warns in every such case: a fix in prisma/orm that makes it warn whenever the marker is outside the history is in review, and the site must stay true before and after it ships.

### E11. Point the ORM error reference at the right repository

The repository `prisma/prisma` was renamed `prisma/orm`; the old name works only through GitHub's redirect.

- `apps/docs/scripts/generate-error-reference.mjs`: the `orm` target's `sourceRepo` is `"prisma/prisma"`. Change it to `"prisma/orm"`, together with the comment at the top of the file and the intro sentence that names the repository.
- `.github/workflows/sync-error-reference-docs.yml` and `.github/workflows/error-reference-check.yml`: change `repository: prisma/prisma` to `repository: prisma/orm`, and `prisma/prisma` to `prisma/orm` in step names and comments. Keep `path: prisma-src`, so the scripts' `--source` paths do not change. Then regenerate `orm/reference/error-reference.mdx` with the script, the way `.github/workflows/sync-error-reference-docs.yml` runs it, and confirm the only change to that page is the repository name. The `cli` target (`prisma/prisma-cli`) is correct; leave it.

### E12. Remove links to examples in prisma/orm

`examples/` in prisma/orm exists for end-to-end tests, not for readers. Docs never link to it.

- `orm/extensions/using-extensions.mdx`: delete the "runnable example" link in the Supabase paragraph and the sentence that links a runnable example for pgvector, PostGIS, ParadeDB, and Supabase.
- `orm/migrations/editing-a-migration.mdx` and `orm/reference/migration-api.mdx`: delete the link to the retail-store `migration.ts`. If the surrounding text depends on seeing that file, show the relevant lines on the page instead, taken from the file at prisma/orm `main` and checked against the published `@prisma/orm-mongo`.
- `orm/migrations/the-migration-graph.mdx`: delete the section "Try it on real fixtures".

After the change, `git grep -nE "github.com/prisma/(orm|prisma)/(tree|blob)/[^ )]*examples" -- apps/docs/content/docs` returns nothing outside `v6/` and `v7/`.

### Contract reference forms on the CLI pages

Match each option row to the E3 table:

- `cli/db-migrate.mdx`: `--to` row, remove `./path`, add `@empty`, and say that with `--show` it also accepts `@contract`; `--from` row, list the forms from the E3 table.
- `cli/db-update.mdx`: `--to` row, remove `./path`, add `<dir>^`.
- `cli/db-sign.mdx`: the `[contract]` row and the `--contract` row both list the forms from the E3 table. Delete "Also accepts the `<dir>^` and `./path` forms that the positional argument does not"; the positional argument accepts `<dir>^` too.
- `cli/migration-plan.mdx`: `--from` row, remove `./path`.
- `cli/migration-status.mdx`: covered by E7.

## Coherence rationale

Every change is a sentence, a table, or a table row on the migration pages and the CLI reference, found by the same reader rounds and verified against the same release. One reviewer can check each against the CLI in one sitting, and the E3 table is the single source the other form lists defer to, so splitting it from the CLI page rows would leave the site contradicting itself between merges.

## Scope

**In:** the twelve gaps above and the contract reference rows on five CLI pages; the generator script and the two error reference workflows for E11, and regenerating `orm/reference/error-reference.mdx`.

**Out:** anything under `v6/` or `v7/`; the text of individual error entries on `orm/reference/error-reference.mdx`, which is generated from `docs/reference/error-reference.md` in prisma/orm and is fixed there (item D17 in `changes.md`); the CLI's help text and its handling of `@contract`, `@db`, and `@empty`, which prisma/orm#30475 fixes; the restructure (section A); new pages (section C); cross-linking the two error reference pages (item A8).

## Pre-investigated edge cases

| Edge case | Disposition | Notes |
| --- | --- | --- |
| `migration status` and `migration status --from` without a database | `--from` runs with no database; `--to` alone needs one | Verified with an unreachable `--db`: `--from <hash> --to <dir>` returned the pending count. |
| `@contract` and `@db` on `migration status` and on `db migrate --to` without `--show` | Do not list them there | Rejected today (`MIGRATION.REF_NOT_FOUND`) or mishandled (`--to @db` fails with `MIGRATION.PATH_UNREACHABLE`); prisma/orm#30475 fixes both, and the release sync that ships it updates the E3 table and the CLI rows. |
| `db update --to @empty` | Do not list `@` tokens for `db update` | Crashes with `CLI.UNEXPECTED` today; the prisma/orm fix rejects them with a structured error. |
| Dropping only the `public` schema | The E4 text must warn against it | Verified: the marker survives in `prisma_contract`, `db migrate` reports `Already up to date` on an empty database, and `db verify` fails with `CONTRACT.SCHEMA_VERIFICATION_FAILED`. |
| Hashes in sample output | Capture your own run; do not copy hashes from other pages | Hashes differ per contract; the E7 capture above is a shape reference only. |

## Slice-specific done conditions

- [ ] Every command, flag, token, and form named in the diff was run by the implementer against the published CLI (`prisma` npm `latest`) and PostgreSQL, and the pull request description lists the versions and what was run.
- [ ] No page under `apps/docs/content/docs/`, outside `v6/` and `v7/`, lists `./path` as a contract reference form.
- [ ] The changed pages pass `.claude/skills/docs-reader-review` (its three scripts and at least two cold reader rounds with `references/reader-persona.md`), `pnpm lint:links` in `apps/docs` after `npx -y pnpm@11.22.0 exec fumadocs-mdx`, and the prose checker CI runs.

## Open questions

None. Wording is the implementer's within the docs-reader-review rules; the facts above are fixed. A fact that does not hold when the implementer runs it is a stop condition: report it instead of rewording around it.

## References

- Parent project status and section E: [`../../changes.md`](../../changes.md)
- Plain-language rules: [`../../plain-language.md`](../../plain-language.md)
- Reader review: `.claude/skills/docs-reader-review/` on prisma/web `main`
