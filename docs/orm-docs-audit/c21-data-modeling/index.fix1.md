Done. Every mark fixed; page is 258 lines (was 252), budget met, `check-plain.sh` clean, no em-dashes.

**File:** `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/c21/dm/r1/index.mdx`

## Marks and what I did

**"contract" (line 13) / "the client's configuration"** — kept the conventions.md wording, added "You still describe your models in it", dropped the configuration clause (the source does not back it), and added the version-7 pointer: "If you are coming from Prisma ORM 7, [what changed](/orm/coming-from-prisma-orm-7) covers the rename and the rest of the differences." That also answers "so what do I type" item 1 (migrating an existing project) with a link rather than a new section.

**Databases other than PostgreSQL** — "All four apply to both databases Prisma ORM supports today, PostgreSQL and MongoDB." After the type table: "The column names in the table are PostgreSQL columns. MongoDB has no such mapping, and `ObjectId` is the only type in the table that is specific to it." No mention of MySQL or SQLite.

**MongoDB `_id`, and `@@map` unexplained** — one sentence added to the primary-keys paragraph: "`@map("_id")` gives the field that name in the database, and `@@map("users")` names the collection the model is stored in. Leave `id` out of the `create` call and MongoDB assigns the `ObjectId` for you."

**Reference / lookup tables** — defined at first use ("A reference table, one that holds a fixed set of values the rest of your data points at"), and the second term is now "other reference tables" instead of "lookup tables".

**Random UUIDs (line 119)** — index internals cut, the sortable option named: "`@default(uuid())` gives you a random UUID. Write `@default(uuid(7))` instead for a UUID that starts with the time it was created, so new ids sort after older ones."

**The four-fact paragraph (line 163)** — split into two paragraphs. The `field.json()` and value-objects sentence is gone. `Numeric` now has syntax: "Write `price Decimal` when any precision will do, and `price Numeric(10, 2)` when you want an explicit precision and scale. Both become a PostgreSQL `numeric` column." `Temporal.Instant` is named as "the standard JavaScript type for a point in time" with a clause linking `/orm/reference/raw-queries` for Node.js versions and the polyfill.

**Extensions (line 167)** — architecture claim cut, one linked sentence: "[Extensions](/orm/extensions) add more types, such as vectors or geometry."

**Enums** — one sentence after the modifiers: "A field can also hold one of a fixed set of values, which you declare as an [enum](/orm/contract-authoring/psl-syntax#enums)."

**Decimal versus integer cents** — reconciled in the money paragraph: use `Decimal` when amounts need more decimal places than the currency's smallest unit, `Int` otherwise, because a plain number is easier to work with than a decimal string.

**"The wider type today is free"** — replaced with the real cost: `BigInt` reaches your code as a JavaScript `bigint`, which `JSON.stringify` refuses to serialize, so convert it to a string first.

**The other side of a relation** — the example now shows `User` with `posts Post[]` above `Post`, the lead-in reads "each model in it needs the fields for its own side", and one sentence follows: "`posts Post[]` on `User` is the other end of the same relation, and like `author` it stores nothing in the database."

**After I write the models** — a Next steps bullet: "[Generate a migration](/orm/migrations/generating-a-migration) to get the models you wrote into the database: run `npx prisma contract emit` after every change to the contract, then plan and apply a migration." No flags restated.

**"skills" (line 241)** — unchanged; the reader accepted it and it is linked.

## Cuts to stay in budget

- The `ObjectId` code block in "Which surrogate type to pick" duplicated the MongoDB primary-key tab. It is now one prose sentence pointing at that tab.
- One comment line trimmed in the `Invoice` example.
- Also replaced "shape"/"shapes" for relations with "kinds" (banned unexplained), and "a field's shape" with "a field".

## Facts looked up

- `uuid()`, `uuid(4)`, `uuid(7)` accepted: `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/prisma-src/packages/3-targets/6-adapters/postgres/src/core/control-mutation-defaults.ts:141`. The generator table at `wip/prisma-src/packages/1-framework/2-authoring/ids/src/index.ts:57-64` names `uuidv7` and `uuidv4` but says nothing beyond storage width, so the page claims only that a version 7 value starts with its creation time and therefore sorts after older ids. It makes no indexing claim.
- Link targets verified to exist: `apps/docs/content/docs/orm/coming-from-prisma-orm-7.mdx`, `orm/extensions/index.mdx`, `orm/migrations/generating-a-migration.mdx`, and the `## Enums` heading in `orm/contract-authoring/psl-syntax.mdx`.

## Q list

None. Every mark was resolvable from the verified facts in the task or the source.

Line count: 252 before, 258 after.