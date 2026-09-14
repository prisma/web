Done. Page rewritten at `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/c21/dm/r1/relational-databases.mdx`. 226 lines before, 216 after (budget 232). `check-plain.sh` reports clean, no em-dashes, no semicolons in prose.

## Marks and what I did

**Sentences the reader could not restate**

- **Line 81, one-to-one paragraph (six ideas, unexplained command and `PSL`).** Split into one-idea sentences with the rule before the error code: "It has to be optional, because nothing in the database guarantees a matching profile row. The foreign key it mirrors has to be `@unique`. If it is not, `npx prisma contract emit` reports an error whose `code` is `PSL_NON_UNIQUE_BACKRELATION`."
- **Line 46, "matched to the foreign key" (passive, actor hidden).** Now: "`npx prisma contract emit` matches it to the foreign key on `Post`." The two-relations case is answered in a new paragraph under "How relations are declared".
- **Line 136, how the list fields find `PostTag`.** Now names the actor and the target: "`npx prisma contract emit` matches them to the two relations on `PostTag`, so queries read `post.tags` directly. If a second join table connects the same two models, name the relation on both sides."
- **Line 198, `db.orm.public.Bug` vs `Task.variant("Bug")`.** The contradiction is gone. The page now says "Read and write variants through the base model", which is what the source shows.
- **Line 209, "keep their constraints" with an unstated contrast.** Now stated directly: shared-table columns "are nullable there"; own-table columns "can be `NOT NULL`, and reading a full variant costs a join".
- **Line 226, five bare referential-action names.** Each now has a short gloss (`Cascade` deletes or updates the matching rows, `Restrict` blocks the change, `SetNull` clears the foreign key, `SetDefault` writes its default value, `NoAction` leaves the decision to the database).

**Words the reader had to guess**

- `npx prisma contract emit`: introduced on first use with the conventions wording, plus the contract definition, in "How relations are declared".
- `db.orm.public`: explained at the first TypeScript example with the conventions wording, and the missing `data:` wrapper is flagged in the same sentence.
- Three names for one field: everything is "the mirror field" now, defined once as "the field on the other model, which stores nothing in the database". "Back-relation" no longer appears in prose (only inside error-code names).
- "the model for the join table": kept on first use, then `PostTag` or "the join table".
- "dependent side": the definition now arrives in the same sentence as the term.
- "discriminator": defined at first use ("One field on the base model, the discriminator, records which variant each row is").

**"So what do I type?"**

1. Migration command added: `npx prisma migration plan --name add-posts` then `npx prisma db migrate`, with a link to `/orm/migrations/generating-a-migration`.
2. `.variant(...)` now says it takes the variant's model name, `"Bug"`, not the discriminator value `"bug"`.
3. Variant `@id`: "it needs no `@id` of its own, because it uses the base model's primary key".
4. Optional relations: new sentence pair with `authorId Int?` / `author User?` and the mismatch error code.
5. Mirror field optional to declare: stated in the one-to-many section.
6. Two relations between the same models: new paragraph with `@relation("Authored", ...)` and `PSL_AMBIGUOUS_BACKRELATION`.
7. "query from less often": cut.
8. The `(t) => ...` callback: "`t` is the argument of the nested write callback, and it offers `t.create([...])`, `t.connect([...])`, and `t.disconnect([...])`, each taking an array", with the link out.
9. `data:` wrapper: covered above.

**Mechanism the reader did not need**

- Storage layouts now end with a recommendation: "Start with the shared table. Give a variant its own table when its columns have to be `NOT NULL` in the database, or when the variant has many columns of its own." This follows from the two bullets above it; nothing in the source declares a default.
- "two one-to-many relations back to back": cut.
- The relational-theory sentence at line 111: cut to one sentence about needing a third model.
- Error codes now come after the rule everywhere.

**Cuts that paid for the additions:** the repeated `Profile` code block under "Which side owns the foreign key", the second `PostTag` code block (the `addedAt` example is one prose sentence now), and the mechanism sentences listed above.

## Facts looked up (rc.10 at `wip/prisma-src/`)

- `.variant(...)` takes the variant model name: `VariantNames` resolves to the keys of the model's `variants` record (`packages/3-extensions/sql-orm-client/src/types.ts:554`), and the interpreter keys that record by model name (`packages/2-sql/2-authoring/contract-psl/src/interpreter.ts:1816`). Tests use `.variant('Bug')` / `.variant('Feature')` against `@@base(Task, "bug")` (`test/integration/test/sql-orm-client/polymorphism.test.ts:148,191`).
- Variant has base fields plus its own, and no own `@id`: `stripStorageOnlyDomainFields` with `syntheticPkFieldsByVariant` drops the link column from the variant's create/read input (`interpreter.ts:1878-1884`, comment at `interpreter.ts:1891-1905`); the test rows carry base fields plus the variant field (`polymorphism.test.ts:153-171`).
- `db.orm.public.Bug` vs `Task.variant("Bug")`: `OrmNamespace` exposes every model in the namespace by name (`packages/3-extensions/sql-orm-client/src/orm.ts:70-80`), and variant models stay in the contract, so the accessor type exists. Nothing in `collection.ts` or the integration tests reads or writes a variant through its own accessor: every case goes through the base collection with `.variant(...)`, and `collection.ts:1538` restricts some mutations on a variant-limited collection. So the page states only what the source shows.
- Ambiguous relations: `PSL_AMBIGUOUS_BACKRELATION`, fix is `@relation(name: "...")` or `@relation("...")` on both sides (`psl-relation-resolution.ts:417-441`).
- Nullability: `PSL_RELATION_NULLABILITY_MISMATCH` when the relation field and its foreign key fields disagree (`interpreter.ts:702-717`).
- Mirror field optional to declare: relations are built from the foreign-key side, and there is no missing-back-relation diagnostic anywhere in `contract-psl/src` (grep for `MISSING_BACKRELATION` / `NO_BACKRELATION` returns nothing).
- Shared-table columns are nullable in the table while the variant's own field keeps its declared nullability (`materializeStiVariantStorageColumns`, `interpreter.ts:1975-2030`); own-table variants get the base primary key as a link column with a foreign key back (`materializeMtiVariantStorageLinks`, `interpreter.ts:1890-1970`).

## Q list

None. Every fact the reader needed was in the source.