Done. Edited only `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/c21/dm/r3/index.mdx`. 258 lines before, 257 after. `check-plain.sh` is clean, no em-dashes, no page-conventions banned words.

**Marks and fixes**

- "contract" undefined: kept the conventions wording and replaced "You still describe your models in it" with "It holds your models, as `schema.prisma` did."
- "both databases Prisma ORM supports today": now "Prisma ORM 8 supports PostgreSQL and MongoDB only. All four blocks apply to both."
- "Two posts with the same title..." sentence: cut.
- Primary key paragraph: "Prisma ORM accepts a model without one, but `update` and `delete` on that model fail at runtime, because they need a primary key or a unique field." The error code is gone, and `prisma contract emit` no longer appears before it is explained.
- "the `create` input type": "Omit `id` when you create a document. MongoDB assigns it."
- Composite key commentary: "The same model is shown with its relation fields under [many-to-many](/orm/data-modeling/relational-databases#many-to-many)."
- How to read the type table: one sentence pair, "Where a row names a PostgreSQL type such as `numeric`, that is the column type on PostgreSQL. `ObjectId` is the only MongoDB-only type."
- `Numeric(10, 2)`: now introduced in the table's `Decimal` row (`` `Decimal`, `Numeric(10, 2)` ``); the "`Numeric` is `Decimal` with the number of digits written out" sentence and the redundant "Both become a PostgreSQL `numeric` column" are cut.
- `Json` vs `Jsonb`: the paragraph opens "`Json` and `Jsonb` are two separate types."
- Enum: added the five-line block with `@@type("pg/text@1")` plus one clause, "says how the values are stored, here as PostgreSQL `text`", and the link for the rest.
- Relation field naming: named once as "the link field, the one that stores the other record's primary key", and `fields` is now explained as "names the link field". The lead-in names both kinds before the bullets. "It stores nothing in the database" became "You do not get a column for it." "the connecting field" later in the section became "the link field".
- One-to-one: "The model that holds the link gets `@unique` on its link field, and the field on `User` is `profile Profile?`, not a list."
- Many-to-many: added "List fields on both sides with no such model are rejected, so write the model out as [many-to-many](...) shows."
- `temporal-polyfill`: "install the `temporal-polyfill` package and add `import "temporal-polyfill/full/global"`."
- `BigInt`: "Call `.toString()` on it first."
- Next steps commands: each gets its own short sentence (emit checks the contract and regenerates your types; `migration plan --name <name>` writes a migration file; `db migrate` applies it).
- Skills sentence moved to the conventions wording; "The `prisma-8` skill covers contract authoring" cut for room.
- Not changed, as instructed: no `prisma.config.ts` snippet, no project-setup section; "polymorphic collections" still links to the MongoDB page rather than being redefined.

**Line budget paid for** by cutting the "two posts" sentence, folding the MongoDB surrogate-key sentence into the UUID paragraph, folding the Extensions sentence into the `Jsonb` paragraph, folding "`posts Post[]` is the other end" into the `@relation` paragraph, and collapsing the two modifier bullets into one line.

**Facts checked in-repo** (both already verified for me, confirmed against the docs source): enum block at `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:188-196`; polyfill import at `apps/docs/content/docs/orm/reference/raw-queries.mdx:94`.

**Q list:** none.