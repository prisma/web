Round two edits are done on `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/c21/dm/r2/index.mdx`. Line count 258 before, 258 after. `check-plain.sh` clean, no em-dashes, no page-conventions banned words.

## Marks and fixes

**Contradiction, line 22 vs 241.** Removed "and other SQL databases" from the Next steps bullet and from the Relations bullet; the polymorphic bullet now says "on PostgreSQL". Only PostgreSQL and MongoDB are named anywhere.

**"identity and its own history".** Abstract sentence deleted. Now: "Two posts with the same title are still two different records, and a user who changes their email address is still the same user."

**MongoDB `id`.** "The `create` input type makes `id` optional, so leaving it out type-checks and MongoDB assigns the `ObjectId` for you." Same sentence now also covers `@@map`: "names the collection and is optional: without it, the collection is the model name with a lowercase first letter."

**Reference table / ISO code.** "Natural keys fit reference tables best: tables that hold a fixed set of values other records point at. You can identify a country by its ISO code, and the code never changes."

**"The column names in the table are PostgreSQL columns".** Now: "Where a row above names a PostgreSQL type such as `numeric` or `jsonb`, that is the column type Prisma ORM uses on PostgreSQL."

**`Decimal` "so" backwards, and `Numeric` unintroduced.** "A `Decimal` value reaches your code as a string, so nothing is rounded through a JavaScript number. Write `price Decimal` when any precision will do. Write `price Numeric(10, 2)` when you want an explicit precision and scale. `Numeric` is `Decimal` with the number of digits written out. Both become a PostgreSQL `numeric` column."

**Temporal / raw-queries pointer.** Replaced with "`Temporal` is built into Node.js 26.8.2 and later. On older versions, install the `temporal-polyfill` package."

**Money paragraph.** Two sentences: "For ordinary money, use `Int` and store the amount in the currency's smallest unit, such as cents, because you get a plain JavaScript number. Use `Decimal` only when you need more decimal places than the currency has, such as a per-unit rate."

**"each model needs the fields for its own side".** Now matches the example: "Two kinds of field describe a relation. The model that holds the link needs both of them. The model on the other end needs only a relation field."

**"Skills".** Now "the [Prisma ORM skills](/ai/tools/skills#available-skills-for-prisma-8), instruction files for coding agents."

**"four things" claimed completeness.** Now "A contract is built from four building blocks:".

**The whole file.** Added to the intro: "There is no `datasource` or `generator` block any more, and the connection string is in `prisma.config.ts` instead. [A complete contract](/orm/contract-authoring/psl-syntax#a-complete-contract) shows a whole file next to its config."

**Enums.** Kept as a sentence plus link rather than a block: the smallest valid enum needs `@@type("pg/text@1")`, and page-conventions bans type ids on these pages. Now: "You declare those values in an `enum` block that lists each member and says how the members are stored, and [enums](...) shows the block to copy."

**`uuid(7)`.** "`@default(uuid())` and `@default(uuid(4))` both give you a random UUID."

**Migration commands.** Next steps bullet now names all three: `npx prisma contract emit`, then `npx prisma migration plan --name <name>`, then `npx prisma db migrate`.

**No primary key.** "`npx prisma contract emit` accepts a model without a primary key. The ORM client does not: `update` and `delete` need a primary key or a unique field, and on a model with neither they fail with an error whose `code` is `ORM.ROW_IDENTITY_MISSING`."

**`Json` vs `Jsonb`.** "so use `Jsonb` unless you specifically need PostgreSQL's plain `json` column."

**`UserTag` links nothing.** Added the clause and link: "The two relation fields that point back at `User` and `Tag` are left out here to keep the key in view, and [many-to-many](/orm/data-modeling/relational-databases#many-to-many) shows the complete model."

**One-to-one and many-to-many.** One clause each in the list: one-to-one is a one-to-many with `@unique` on the field that stores the link; many-to-many needs a model for the join table.

**Mechanism cuts (to stay within budget).** Dropped "which MongoDB generates without asking any other server and which carries its own creation time", and the second "it stores nothing in the database" on `posts Post[]`. Kept the first one and kept the sequential-id warning the reader said earned its place.

**Not changed.** Title stays "Overview" (per your instruction). "contract", "PSL", "emit", "polymorphic collections" left to the pages that define them; the contract sentence already carries the standard first-use gloss, and polymorphic collections keep their link to the MongoDB page.

## Facts looked up

- No primary key: `wip/prisma-src/packages/3-extensions/sql-orm-client/src/collection.ts:2422` — `update()`/`delete()` throw `ORM.ROW_IDENTITY_MISSING` when the table has no primary key or unique constraint.
- Enum syntax requires `@@type`: `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:183-196`.
- Complete contract plus `prisma.config.ts`, no `datasource`/`generator`: `apps/docs/content/docs/orm/contract-authoring/psl-syntax.mdx:13-125`.
- `#many-to-many` anchor exists: `apps/docs/content/docs/orm/data-modeling/relational-databases.mdx:105`.

## Q list

None.