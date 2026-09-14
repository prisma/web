Round three edits are done. 215 lines before, 214 after; plain-language check clean, no em-dashes, no clause-joining semicolons.

## What I did with each mark

**"which side that is is" (line 25).** Now: "The side that declares the `fields` argument owns the foreign key. Deciding which side declares `fields` is the main choice in each relation kind below."

**Migration paragraph crammed into "How relations are declared" (line 27).** The section keeps only the contract sentence and the emit sentence: "...It only updates your code, not the database." The migration commands moved to a Next steps bullet using `<name>`, not `add-posts`. The reader's "what is a contract, really" question stays unanswered by design (contract-authoring owns that term, per page-conventions).

**`PSL_RELATION_NULLABILITY_MISMATCH` and the PSL acronym sentence.** Cut. The rule remains: "The two fields have to agree. Making one optional and the other required is rejected."

**Mirror field vs back-relation (line 54).** Added one sentence: "Prisma ORM 7 called it the back-relation, and its error codes still use that word."

**"read it from the foreign key side only" with no query.** Added inline: `db.orm.public.Post.where({ authorId: user.id }).all()`, followed by the one-time `.all()` definition from conventions.md.

**`namespace` clause (line 56).** Cut.

**"Three rules" for the one-to-one mirror field (line 91).** Collapsed to: add `profile Profile?` on `User`, it has to be optional, and "The `@unique` already on `Profile.userId` is what allows the mirror field." `PSL_NON_UNIQUE_BACKRELATION` cut.

**One-to-one has no TypeScript.** Added `const users = await db.orm.public.User.include("profile").all();`

**"name the relation on both sides" (line 134).** Now names the two fields: the list field `Post.tags` and `PostTag.post`. Also cut "and Prisma ORM works out the join through `PostTag`".

**"If you leave it out" (line 148).** Now "If you skip that model". `PSL_ORPHANED_BACKRELATION` kept.

**Three quoting conventions in the polymorphic block.** One clause added: "`@@discriminator(type)` and the first argument of `@@base` take a field or model name without quotes, while the variant value is a string."

**Type-narrowing a polymorphic read.** Added: "In TypeScript those rows are a union with one member per variant, and each member's discriminator field is that variant's value, so switch on the discriminator field to reach a variant's own fields."

**Self-relations.** One sentence in one-to-many: "A model can also point at itself: a category with a parent category is an ordinary one-to-many whose relation field is typed as the same model."

**`NoAction` duplicates writing nothing.** Bullet now: "`NoAction` writes the clause out, which does the same thing as writing no clause at all."

**Referential actions filed under Next steps.** Moved into "How relations are declared", after the optional-relation paragraph, with a new opening sentence saying what they decide. The five-item list is unchanged apart from `NoAction`. Dropped from Next steps.

## Facts checked in the source

- Polymorphic rows are a discriminated union: `VariantRow` in `wip/prisma-src/packages/3-extensions/sql-orm-client/src/types.ts:526-546` maps each variant to `Omit<base, DiscField> & DefaultModelRow<variant> & Record<DiscField, value>` and unions them, so each member pins the discriminator to that variant's literal value. Matches `wip/prisma-src/test/integration/test/sql-orm-client/polymorphism.test.ts:74-128`.
- Self-relations: `wip/prisma-src/test/integration/test/sql-orm-client/self-relations.test.ts:12-40` shows `invitedById` as an ordinary foreign key on the same model with an `invitedUsers` list.
- `.include("profile")` from the mirror-field side: `wip/prisma-src/test/integration/test/sql-orm-client/include.test.ts:105-147` includes `profile` from `users` and returns the profile row or `null`.

## Cuts that paid for the additions

Merged the overview link into the opening paragraph; inlined the `.include("author")` call instead of a fenced block; dropped the closing "Placing the key on the dependent side..." paragraph, which restated the three bullets above it.

## Q list

- **Q1.** The reader asked whether polymorphic models need anything extra at migration time (two tables, one discriminator column, nullable extra columns). The CLI is not in the `wip/prisma-src/` export, and I found no test or doc stating what `npx prisma migration plan` does for a base model with variants. Nothing added.
- **Q2.** The reader asked whether `--name` is required on `npx prisma migration plan` and whether the `migration <verb>` vs `db <verb>` split follows a rule. No CLI argument definitions in the export. The page shows `--name <name>` as the brief specifies and says nothing about the split.