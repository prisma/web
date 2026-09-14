Done. Page is at exactly 214 lines (unchanged budget), plain-language check clean, no em-dashes.

## What I changed, mark by mark

**Sentences the reader could not restate**

- **Line 25, "contract" arriving mid-section.** Moved into the intro, before the first heading: "You write your models in your contract, the `contract.prisma` file that replaced `schema.prisma`. After every change to it, run `npx prisma contract emit`, which checks the contract and regenerates your TypeScript types. It does not touch the database."
- **Line 29, two levels of indirection.** Now: "When a `User` row is deleted or its `id` changes, referential actions decide what happens to the `Post` rows that point at it."
- **Line 35, `NoAction`.** Cut to "`NoAction` is the same as writing nothing."
- **Line 93, "allows the mirror field".** Now: "Because `userId` is unique, the mirror field can be a single `Profile?` instead of a list."
- **Line 138, relation names contradicting line 37.** Reconciled: "If a second join table connects the same two models, the relation name goes on both sides again, which here means the list field, `Post.tags`, and `PostTag.post`, the field that points back at `Post`." Verified against `psl-relation-resolution.ts:417-418`.
- **Line 192, union type in prose.** Replaced with a `switch (task.type)` example returning `task.severity` / `task.targetRelease`, introduced by "Switch on `task.type` to reach a variant's own fields:".
- **Lines 196-197, `@@map` surprise.** Now one paragraph, one sentence each: no `@@map` means the variant is stored in the base model's table with nullable extra columns; its own `@@map` splits it into its own table named by the string you pass; "In Prisma ORM 7, `@@map` only renamed a table."

**Words guessed at**

- "contract" and "emit" defined in the intro (above). "mirror field", "discriminator", "variant"/"base" stay as defined; the Prisma ORM 7 "back-relation" history is cut.
- **"is rejected"** now names who rejects and when: "If one is optional and the other is required, `npx prisma contract emit` reports an error."
- **"the model for the join table"** appears once, on first use; every later mention is `PostTag` ("Declare `PostTag` yourself. If you skip it, ...").
- **`public`** explained in the intro before any use.

**"So what do I type?"**

1. **`db` import.** Added once, in the first TypeScript example: `import { db } from "./prisma/db";`.
2. **Command order.** Next steps bullet is now the ordered sequence: edit `contract.prisma`, `npx prisma contract emit`, `npx prisma migration plan --name <name>`, `npx prisma db migrate`. The duplicate emit sentence is gone from "How relations are declared".
3. **`public` off PostgreSQL.** `description` and `metaDescription` now say PostgreSQL only; MongoDB keeps its own Next steps link.
4. **Self-relations.** Added "One relation between a model and itself needs no relation name."
5. **Mirror fields in many-to-many.** Added: "`Post.tags` and `Tag.posts` are the mirror fields that `t.connect` goes through. Leave them out and you write the `PostTag` rows yourself, with `db.orm.public.PostTag.create({...})`."
6. **`SetDefault` with no column default.** Nothing added, see Q1.
7. **Naming a variant's table.** Covered by "split into its own table, named by the string you pass".

**Internals**

Cut: the Prisma ORM 7 back-relation history, the `NoAction` SQL trivia, and the "why `"bug"` is a TypeScript error" reasoning (now just "Pass the model name, `"Bug"`, with a capital letter. `"bug"` is a type error."). Kept the `ON DELETE` / `ON UPDATE` sentence because page-conventions.md mandates that wording.

**Ordering.** The `db` / `db.orm` / `public` explanation is now in the intro, ahead of every use.

## Facts looked up

- Self-relation needs no name when there is only one: `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/prisma-src/test/integration/test/sql-orm-client/fixtures/contract.ts:141-142` (`invitedUsers` / `invitedBy`, no relation name). The PSL fixture at `.../fixtures/self-relations/contract.prisma` does use names (`"Management"`, `"Partnership"`), but only because that model has several self-relations, which matches the page's existing rule.
- Join model with no list fields on the far models: `psl-relation-resolution.ts:225-275` and `:397-430` only run junction matching for backrelation list fields, and `PSL_ORPHANED_BACKRELATION` / `PSL_AMBIGUOUS_BACKRELATION` are raised from list-field candidates. With no list fields there are no candidates, so nothing rejects it.
- Many-to-many relation name placement: `psl-relation-resolution.ts:417-418` (the diagnostic tells you to add the name to the list field and to the join model's field pointing back).

## Q list

- **Q1** — Reader asked what happens with `SetDefault` when the column has no `@default`: error at emit or at runtime? Grepped `SetDefault` and `SET DEFAULT` under `wip/prisma-src/packages/3-targets/3-targets/postgres/src/core/migrations/` and `wip/prisma-src/packages/2-sql/`. The only hits are the attribute spec (`sql-attribute-specs.ts:424`), the two name mappings (`psl-relation-resolution.ts:29`, `relation-inference.ts:17`), and unrelated column-default DDL. No validation of a missing column default exists in the source, so the page says nothing about it.

Line count: 214 before, 214 after.