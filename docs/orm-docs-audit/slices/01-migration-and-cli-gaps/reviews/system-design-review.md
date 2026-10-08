# System-design review: close the gaps on the migration pages and the CLI reference

Branch `claude/orm-migration-cli-gaps-c600ba`, range `origin/main...HEAD`. Lens: architect, applied to information design. Sources: `spec.md` and `plan.md` (amendments 1 to 3), `plain-language.md`, `apps/docs/CLAUDE.md`, `wip/gaps/facts.md` (rc.19).

## What the change does

It adds one new concept to the site's structure: a single table of the contract reference forms each command accepts, at `orm/migrations/the-migration-graph.mdx#contract-reference-forms`. Five CLI reference pages now list the same forms in their option rows and link to that table. It also defines existing terms (contract space, `<dir>^`, `migrationHash`, the `MARKER_NOT_IN_HISTORY` / `MARKER_MISMATCH` pair) where readers meet them, removes links to `examples/` in prisma/orm, and renames the ORM error reference source from `prisma/prisma` to `prisma/orm`.

The facts in the table match `facts.md` on every row, including the three cells amendment 3 changed. No current page lists `./path` any more. The E11 rename is complete: the script's `sourceRepo`, its header comment and intro sentence, both workflows' `repository:` and step names, the `docs-prose.yml` comment, and the regenerated page all say `prisma/orm`; `path: prisma-src` is unchanged, so no `--source` path moved. No `prisma/prisma` reference remains in `.github/` or `apps/docs/scripts/`.

## Findings caused by this branch

### D01. "Contract reference" is used as a term but never defined

- Location: `apps/docs/content/docs/cli/db-migrate.mdx:26`, `cli/db-sign.mdx:25`, `cli/db-update.mdx:25`, `cli/migration-plan.mdx:43-44`, `cli/migration-status.mdx:25,36`; target `orm/migrations/the-migration-graph.mdx:33-45,136`.
- Issue: Every changed CLI row says "Accepts a [contract reference]" and links to `#contract-reference-forms`. The target heading is "Which forms each command accepts", and neither that section nor the Terms table uses or defines "contract reference". A reader who follows the link to learn the term does not find it. `migration-status.mdx` adds a heading "Contract references" that also does not define it.
- Suggestion: Add a Terms row: "**Contract reference**: text you pass to a command to name a contract state: a hash, a hash prefix, a ref name, a migration directory name, `<dir>^`, or an `@` token." Add a `<dir>^` row there too, since it is now used on six pages. Keep the anchor `contract-reference-forms` and consider the heading "Contract references each command accepts".

### D02. The same definitions are copied onto five CLI pages

- Location: identical paragraph at `cli/db-migrate.mdx:35`, `cli/db-sign.mdx:33`, `cli/db-update.mdx:30`, `cli/migration-plan.mdx:48`, `cli/migration-status.mdx:38`, and a variant at `orm/migrations/the-migration-graph.mdx:128`. `@contract`, `@db`, `@empty` are defined again at `cli/db-migrate.mdx:33`, `cli/migration-status.mdx:38,68`. Contract space is defined again at `cli/db-migrate.mdx:11` and `cli/migration-status.mdx:34`, beside the Terms row and `orm/migrations/how-migrations-work.mdx:50`.
- Issue: The spec makes the E3 table the single source and has CLI rows repeat only the form list. The branch adds a second copy of the definitions of ref name and `<dir>^` on every CLI page, which the spec did not ask for. There are now six copies of the `<dir>^` definition and five of contract space, each worded slightly differently. When prisma/orm#30475 ships, the release sync must edit the table, five rows, and these paragraphs.
- Suggestion: Define ref name, `<dir>^`, the `@` tokens, and contract space once, in the Terms table and the `@` bullet list on `the-migration-graph.mdx`. On each CLI page, keep the row's form list (the spec asks for it) and replace the paragraph with nothing, or with one sentence that links the Terms table. If the reader rounds showed that CLI readers need the definition in place, record that as a deliberate exception in the PR description; the devrel lens owns that trade-off.

### D03. `db migrate` links "contract space" and then defines it again

- Location: `cli/db-migrate.mdx:9-11`.
- Issue: The opening paragraph links "contract space" to the Terms table, and the next paragraph defines it in full and ends "Each of these histories is a contract space." Two treatments of one term, back to back.
- Suggestion: Keep one. The spec asked to replace "(app and extensions)"; the link alone, or the definition alone, does that.

### D04. The five CLI pages use two different patterns for the same thing

- Location: `cli/migration-status.mdx:24-38` against `cli/db-migrate.mdx:26-35`, `cli/db-sign.mdx:25-33`, `cli/db-update.mdx:25-30`, `cli/migration-plan.mdx:43-48`; also `cli/db-migrate.mdx:29`.
- Issue: `migration-status` puts its definitions under two `###` headings inside `## Options` and links cells to them (`#contract-spaces`, `#contract-references`). The other four pages use an unheaded paragraph after the table and no in-row links. On `db-migrate`, the `--to` row links "contract reference" and the `--from` row does not.
- Suggestion: Choose one pattern for all five pages. If D02 is applied, this goes away. Otherwise use the unheaded paragraph everywhere, and give `db-migrate --from` the same link as `--to`.

### D05. `migration plan --to` says "contract reference" where its sibling says "contract state"

- Location: `cli/migration-plan.mdx:44`.
- Issue: `--from` "Uses a specific starting contract state"; `--to` "Sets the destination contract reference". The reference is the text; the destination is the state it names. Every other changed row uses "contract state".
- Suggestion: "Sets the destination contract state."

### D06. `how-migrations-work` says `--from` and `--to` take a contract hash

- Location: `orm/migrations/how-migrations-work.mdx:151`.
- Issue: "you cannot pass it to `--from` or `--to`, which take a contract hash." They take any contract reference, and this sentence is a place that describes what those options accept without pointing at the single source.
- Suggestion: "…which take a contract reference, such as a contract hash. [Which forms each command accepts](/orm/migrations/the-migration-graph#contract-reference-forms) lists them."

### D07. `migration status` calls one kind of drift "drift"

- Location: `cli/migration-status.mdx:84`.
- Issue: "This situation is called drift." The Drift section it links defines drift as any mismatch and splits it into two kinds; this is the first kind. Read cold, the sentence narrows the term.
- Suggestion: "This is one kind of drift, where the marker itself is out of step."

### D08. `migration ref` and `migration new` still list forms without deferring to the table

- Location: `cli/migration-ref.mdx:37`, `cli/migration-new.mdx:24,28`.
- Issue: The branch makes the table the single source, and the table has rows for `migration ref set` and `migration new --from`, but these two CLI pages were not linked to it. Their text agrees with the table today. They were outside the spec's list of five pages, so this is a coverage gap in the new structure, not a factual error.
- Suggestion: Add the same "[contract reference](…#contract-reference-forms)" link to the `set` row and the `--from` row.

### D09. The `migration status` sample output re-explains the graph labels

- Location: `cli/migration-status.mdx:68`.
- Issue: Spec E7 asks to say the drawing reads from the bottom up and link the reading guide. The added paragraph also defines `∅`, `@contract`, `@db`, the `db` ref and its file, and which commands write it. Those are defined on `the-migration-graph.mdx` and explained in the linked `applying-a-migration` section. A reference page now carries a third explanation of the graph labels.
- Suggestion: Keep the bottom-up sentence, the `@db (db)` same-row note (it is specific to this output), and the link. Drop the rest.

### D10 (informational). The hash-prefix note under the table is stricter than `migration new`

- Location: `orm/migrations/the-migration-graph.mdx:144,153`.
- Issue: The note says a hash prefix is 6 or more characters. `facts.md` item 3: `migration new --from` accepts 1 to 5 characters too. The note is a safe understatement, and amendment 3 kept the spec's row wording, so no reader is misled into a failing command.
- Suggestion: None needed. If the CLI later enforces 6 there, nothing changes; if not, leave it.

## Spec-level design tension (not a branch defect)

### S01. The single source of a reference fact lives on a concept page

- Location: `orm/migrations/the-migration-graph.mdx:136-157`.
- Issue: `apps/docs/CLAUDE.md` placement rule 1 says reference material (flags, parameters) lives under `cli/` and concept pages link to it. The spec puts the table of accepted option values on a concept page, and five `cli/` pages link into it. Reference now depends on concept, which is the reverse of the documented direction. The spec chose this deliberately and new pages are out of scope (section C).
- Suggestion: Leave it for this slice. In the section A restructure, move the table to a `cli/` location (for example a "Contract references" section on `cli/migration-ref.mdx`) and have the concept page link to it. Record this in `deferred.md`.

## Pre-existing issues (not caused by this branch)

- P01. `cli/migration-status.mdx:27`: `--legend` "Prints a key for the tree glyphs and lane colors." The graph page now calls these "columns". Say "column colors" for one term.
- P02. `prisma/prisma` outside E11's scope still relies on GitHub's redirect: `apps/docs/content/docs/ai/tools/skills.mdx:118`, `apps/docs/src/lib/agent-skill.ts:175`, `apps/site/src/lib/agent-skills.ts:318` (`npx skills add prisma/prisma/skills`), `packages/ui/src/hooks/use-star-count.ts:3` (GitHub API URL), `apps/docs/next.config.mjs:589` (comment). Decide whether the skills command should name `prisma/orm`.
- P03. `orm/reference/error-reference.mdx:1215` (generated upstream) says "migration reference" for a directory name or hash prefix, a different term from the docs' "contract reference". Fix upstream in prisma/orm (item D17).

## Out of scope for this lens

Wording and readability of each sentence (plain-language and devrel lenses); whether every command ran as stated (principal-engineer and fact check); CI and link checks.
