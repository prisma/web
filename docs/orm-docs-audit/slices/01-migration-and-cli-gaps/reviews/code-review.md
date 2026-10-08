# Code review: close the gaps on the migration pages and the CLI reference

Range: `origin/main...HEAD` on `claude/orm-migration-cli-gaps-c600ba` (commits e7f42b423, 21d519ef4, 6cdfdbe01). Lens: principal engineer. Truth source: `wip/gaps/facts.md` (prisma 8.0.0-rc.19).

## Summary

The pages match the verified CLI behaviour almost everywhere: every cell of the contract reference table and every option row agrees with the facts.md matrix, and the sample output is byte-identical to the capture. Six findings remain. The most important one is a sentence from the second fix round that replaced verified text with an unverified command form that has no way to pass a password. The checks that the done conditions require also ran before both fix commits.

## What looks solid

- The E3 table and the rows on the five CLI pages match the facts.md section 1 matrix cell by cell, including the amendment 3 cells (`migration plan --to` without `@empty`, `db migrate --to` without `@empty`, `db migrate --show --to` with `@contract` and `@empty`).
- The `migration status` sample output is byte-identical to the facts.md section 6 capture. I compared the two with a script.
- E11: I imported `transform` from the generator and ran it in memory on the current `prisma/orm` `main` source. The output is identical to the committed `error-reference.mdx`, so nobody edited the page by hand. `prisma/orm` is public. `docs/reference/error-reference.md` and `scripts/list-error-codes.mjs` exist on its `main`, so the `prisma-src` paths in both workflows still resolve. `sourceRepo` has three consumers: the fetch URL, the base for relative links (this is where the ADR link changes come from), and the header comment. All three now say `prisma/orm`.
- Nothing under `v6/` or `v7/` changed. No `./path` form remains. The spec's `examples/` grep returns nothing. No `github.com/prisma/prisma/` link remains outside `v6/` and `v7/`.
- Every new anchor resolves: `#contract-reference-forms`, `#contract-spaces`, `#contract-references` and `#mongodb-operations` are pinned on their headings, `#terms-used-on-this-page` is pinned on `## Terms`, and `#21-initialize-prisma-orm` follows the slug pattern that `#31-regenerate-the-lockfile` already uses on `guides/deployment/docker.mdx`. `#check-before-preview-then-apply` and the Drift anchor exist.
- Markdown: no added line is hard-wrapped. The code blocks nested in the E4 list item are indented 2 spaces under `- `, which is correct. The tables are well formed. No added prose has a bare `<`, `{`, or `}`.

## Findings

### F01. The `-h`, `-p`, `-U` sentence is unverified and gives no way to pass a password

- **Location:** apps/docs/content/docs/orm/migrations/how-migrations-work.mdx, line 173
- **Issue:** Round 2 (6cdfdbe01) replaced "such as the `PGHOST`, `PGPORT`, and `PGUSER` environment variables" with "pass them the host, port, and user with `-h`, `-p`, and `-U`". facts.md section 3 ran `dropdb` and `createdb` with the environment variables, not with the flags, so the new text is not backed by facts.md. The flags do exist in PostgreSQL. The real failure mode is the password: a `DATABASE_URL` usually carries one, and neither version of the text says how to pass it. In CI or any non-interactive shell, `dropdb` then fails authentication or waits at a prompt. Hosted databases, including the Prisma Postgres URL used on `from-scratch.mdx`, always need one.
- **Suggestion:** Name the connection values, including the password, and use the form that was run. For example: "They do not read `DATABASE_URL`, so give them the host, port, user, and password from it, for example with the `PGHOST`, `PGPORT`, `PGUSER`, and `PGPASSWORD` environment variables." If you keep `-h`/`-p`/`-U`, run them once and add the password route.

### F02. The lint and reader-review logs predate both fix commits

- **Location:** wip/review/*.log (all written 23:01 to 23:02); commits 21d519ef4 (23:07) and 6cdfdbe01 (23:15)
- **Issue:** Done condition 3 requires `pnpm lint:links` and the three scripts to pass on the changed pages. The logs come from before the fix rounds. The fix rounds added `#contract-spaces`, `#contract-references`, and `#21-initialize-prisma-orm`, rewrote E4, and added a heading. I checked those anchors by reading the targets, and I reran the three scripts at the branch tip (see F03). `lint:links` has not run at the tip.
- **Suggestion:** Rerun `npx -y pnpm@11.22.0 exec fumadocs-mdx`, then `pnpm lint:links` and the three scripts on every page in `wip/review/pages.txt`, at the tip. Keep the new logs.

### F03. Two changed pages fail the plain-language script at the tip

- **Location:** apps/docs/content/docs/cli/index.mdx, line 114 ("graph topology", on a line this branch edits); apps/docs/content/docs/cli/db-sign.mdx, lines 11 ("idempotent") and 66 ("brownfield")
- **Issue:** `check-plain.sh` exits 1 on both pages. The words were already there on `main`, but done condition 3 requires the changed pages to pass, and `cli/index.mdx` line 114 is a line this branch rewrote. `check-staccato.py` also reports read-aloud hits on unchanged lines: `cli/index.mdx` line 36, `cli/migration-plan.mdx` line 30, and `guides/integrations/github-actions.mdx` lines 424 and 744.
- **Suggestion:** Replace the words with the ones `banned-terms.md` gives: "topology" with "the chain of migrations", "idempotent" with "safe to run more than once", and "brownfield database" with "an existing database". Read the staccato hits aloud and fix any that read badly.

### F04. The `--legend` row on `migration status` contradicts E1 and uses a banned word

- **Location:** apps/docs/content/docs/cli/migration-status.mdx, line 27
- **Issue:** The row says "Prints a key for the tree glyphs and lane colors". facts.md section 6 shows the key lists `○`, the arrows, `⟲`, `✓`, `⧗`, `∅`, `@contract`/`@db`, ref labels, and the `aaaaaa → bbbbbb` notation. It lists no line glyphs and no colors. E1 on `the-migration-graph.mdx` now says the key covers the symbols in the rows, so the two pages disagree. Also, `plan.md` records that "lane" is banned by `plain-language.md`. The line itself is unchanged, but this branch rewrote the rows around it, and the E1 change makes it wrong.
- **Suggestion:** "Prints a key to the symbols in the rows (`○`, the arrows, `✓`, `⧗`, `∅`) and to the labels."

### F05. The new `### JSON output` heading puts the drift paragraph under JSON output

- **Location:** apps/docs/content/docs/cli/migration-status.mdx, lines 74 to 88
- **Issue:** Round 1 added `### JSON output` above the `--json` bullets. The E10 paragraph (line 84) and the two paragraphs after it (lines 86 and 88) now sit under that heading. But the `MIGRATION.MARKER_NOT_IN_HISTORY` warning is printed in human output too (facts.md section 7, case 2), so a reader who skips the JSON section misses the drift link that E10 exists to add.
- **Suggestion:** Move lines 84 to 88 above `### JSON output`, into "Reading the result". You could also give them their own heading, such as `### Warnings`.

### F06. "Write both helpers in the same `migration.ts`" is an instruction with no source

- **Location:** apps/docs/content/docs/orm/migrations/editing-a-migration.mdx, line 280; apps/docs/content/docs/orm/reference/migration-api.mdx, line 469
- **Issue:** Both pages now tell the reader where the helpers must go. Nothing in facts.md or the spec says they must share a file. `migration.ts` runs as an ordinary Node module (`node migration.ts`), so importing the helpers from another module is not known to fail. The removed retail-store link only showed the helpers in the same file. It did not require it.
- **Suggestion:** Describe the example, and do not state a rule: "In this example, both helpers are defined in the same `migration.ts` as the migration." Use the same wording on `migration-api.mdx`.

## Deferred (out of scope)

- `pnpm lint:versions` fails on `guides/upgrade-prisma-orm/postgresql.mdx` line 231 and `orm/release-status.mdx` line 42 (both say `8.0.0-rc.17`). Neither file is in this diff. The version bump belongs to the release sync.
- Five CLI pages repeat the same paragraph that defines "ref name" and `<dir>^`, next to option rows that list the forms in full. When prisma/orm#30475 ships, the E3 table and about 10 places need edits together. The spec chose rows that list the forms in full, and the spec's Scope section gives the #30475 update to the release sync that ships it.
- Reader marks left open in round 2: why `db update --to` takes a migration directory name, and why the status hint uses `--to`. These are about learnability (the devrel lens), not about correctness.
- `migration status --json` still prints `{bin}`, and `cli/init.mdx` does not mention the `prisma` dev dependency. Both are listed in `plan.md` as found outside the spec.

## Already addressed

| Item | Where it came from | Fixed in |
| --- | --- | --- |
| Status page did not say where the database URL comes from when `--db` is omitted | Round 2 reader, CLI | 6cdfdbe01 |
| `@empty` undefined on the status page | Round 2 reader, CLI | 6cdfdbe01 |
| `migration plan` gave offline as the reason for refusing `@contract` | Round 2 reader, CLI | 6cdfdbe01 |
| Marker and `@db` defined in one sentence on `db-migrate.mdx` | Round 2 reader, CLI | 6cdfdbe01 |
| `init` and `orm init` wording on GitHub Actions | Round 2 reader, CLI | 6cdfdbe01 |
| Long contract-space paragraph on `from-scratch.mdx` | Round 2 reader, CLI | 6cdfdbe01 |
| `db migrate --to <ref>` refuses a hand-edited migration (claim on `the-migration-graph.mdx`) | plan.md open fact | Verified in facts.md, no change needed |
| Recreating `public` after dropping both schemas | plan.md open fact | Verified in facts.md, no change needed |

## Acceptance-criteria verification

These are documentation changes, so there are no tests. For each item, "verify" means I read the changed text and traced every factual claim to a line in facts.md, the spec, `plan.md` amendments, or an existing docs page. PASS means every claim traces to one of these. WEAK means the item is present but at least one claim does not trace. FAIL means a requirement is not met. NOT VERIFIED means no evidence exists yet.

| AC | Verdict | Detail |
| --- | --- | --- |
| E1: explain the lines between the columns in the graph drawing | **PASS** | The text matches the page's drawing: Alice on the left, Bob on the right, `│─╯` above `4437973`. The claims about what the key covers match the facts.md section 2 legend. The key also covers `⟲` and the `→` notation, which "the arrows" loosely covers. F04 is the leftover conflict on the status page. |
| E2: define `<dir>^` at first use | **PASS** | Defined in the `ref set` paragraph. It matches the spec's terms section. |
| E3: table of accepted contract reference forms | **PASS** | All 10 rows match the facts.md section 1 matrix, following amendment 3. "No file path" matches. "Must match exactly one contract state" is listed under "Could not verify" in facts.md, and `migration new --from` accepts prefixes shorter than 6 characters. Amendment 3 accepted this: the docs are stricter than the CLI, which is safe for readers. |
| E4: commands that replace `migrate reset` | **WEAK** | The code block, `db init`, no seed, dropping both schemas, not having to recreate `public`, and the "drop only `public`" warning all match facts.md section 3 and the appended sections. The `-h`/`-p`/`-U` sentence is not backed by facts.md, and it has no way to pass a password (F01). |
| E5: say what `db verify --schema-only` checks | **PASS** | Both pages say it "compares the tables with your contract and skips the marker check" and link `/cli/db-verify`. This matches facts.md section 4. |
| E6: `migrationHash` is not a contract hash | **PASS** | The hash covers the rest of `migration.json` and `ops.json`. `migration check` detects edits. `migration show` prints it on the `hash:` line. `--from` and `--to` reject it. All of this matches facts.md section 5. |
| E7: complete `cli/migration-status.mdx` | **PASS** | The sample is byte-identical to the capture, and `{bin}` was dropped as amendment 2 requires. The `db.connection` fallback comes from the `CONFIG.DB_CONNECTION_REQUIRED` hint. The 12-character hash in the hint and "`db init` writes that file, and so does `db migrate --advance-ref db`" match facts.md sections 6, 3, and 9. The `--space`, `--to`, and `--from` rows match the matrix and the `SPACE_NOT_FOUND` text. |
| E8: define "contract space" at first meeting | **PASS** | All five places are present and link the Terms table. MongoDB's `migrations/app/` is not in facts.md (it covers PostgreSQL only), but the removed retail-store MongoDB example path had the same layout. |
| E9: `init` compared with `orm init` | **PASS** | Matches facts.md section 8. The `#21-initialize-prisma-orm` anchor resolves. |
| E10: two codes, one situation | **PASS** | The wording holds whether or not `migration status` warns ("can warn", "When the command warns"), as facts.md section 7 case 1 requires. "Called drift" matches the definition on the Drift page. F05 is about where the paragraph sits, not what it says. |
| E11: point the error reference at `prisma/orm` | **PASS** | Regenerated in memory, the page is identical to the committed file. The repository and paths exist. The `cli` target is unchanged. |
| E12: remove links to `examples/` | **PASS** | The grep is empty. "Try it on real fixtures" is deleted. `editing-a-migration.mdx` links to `#mongodb-operations`, which shows both helpers. F06 is about wording. |
| Contract reference forms on the five CLI pages | **PASS** | `db-migrate` `--to` and `--from`, `db-update` `--to`, `db-sign` `[contract]` and `--contract`, `migration-plan` `--from` and `--to`, and `migration-status` `--to` and `--from` all match the matrix cell by cell. The `db-sign` "does not accept `<dir>^`" sentence is gone. |
| DC1: the PR description lists versions and what was run | **NOT VERIFIED** | No pull request is open yet. facts.md has the content that the PR description needs. |
| DC2: no `./path` outside `v6/` and `v7/` | **PASS** | `git grep '\./path'` returns nothing. |
| DC3: reader-review scripts, two reader rounds, `lint:links`, prose CI | **FAIL** | Two reader rounds are done. The logs predate both fix commits (F02). At the tip, `check-plain.sh` fails on `cli/index.mdx` and `cli/db-sign.mdx` (F03). `lint:links` has not run at the tip. |

### Summary

| Result | Count | ACs |
| --- | --- | --- |
| PASS | 13 | E1, E2, E3, E5, E6, E7, E8, E9, E10, E11, E12, CLI forms, DC2 |
| FAIL | 1 | DC3 |
| NOT VERIFIED | 1 | DC1 |
| WEAK | 1 | E4 |
