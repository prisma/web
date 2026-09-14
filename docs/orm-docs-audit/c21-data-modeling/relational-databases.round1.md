Read once, top to bottom, as a Prisma 6/7 user seeing version 8 for the first time.

## Sentences I could not restate after one reading

**Line 81** — "The foreign key it mirrors must be unique, or `npx prisma contract emit` rejects the field with an error whose `code` is `PSL_NON_UNIQUE_BACKRELATION`."
Stopped by: `npx prisma contract emit` (never introduced anywhere on the page — I know `prisma generate` and `prisma migrate`, not this), and `PSL`. Also the whole paragraph is six ideas in one block: declare on the FK side, you may add a mirror field, it needs no `@relation`, it must be optional, why it must be optional, and the error you get if the FK isn't unique.
Plainest wording I'd have understood: "You can also add `profile Profile?` to `User`. It must be optional, and the `userId` field it points at must be `@unique`."

**Line 46** — "it stores nothing in the database and is matched to the foreign key on `Post`."
Stopped by: matched *by whom*, and matched *how*? Passive voice hides the actor. If I have two relations between `User` and `Post` (author and editor), how does it know which is which? The page never says, and in the version I know that needed a named `@relation("...")`.

**Line 136** — "The list fields on `Post` and `Tag` name the far side (`Tag[]`, `Post[]`), and `npx prisma contract emit` connects them through `PostTag`, so queries read `post.tags` directly."
Stopped by: same "how does it know" problem, now harder. `Post.tags` is typed `Tag[]`, but there is no `@relation` on it and `PostTag` is never named. If two join models existed I'd have no idea what happens. Also the unexplained command again.

**Line 198** — "Variants appear as their own models in queries, `db.orm.public.Bug` alongside `db.orm.public.Task`. A query on the base model returns every variant. To write a variant, limit the query to one variant with `.variant(...)` and create through it."
Stopped by: it tells me `db.orm.public.Bug` exists, then the example never uses it and instead writes through `Task.variant("Bug")`. Can I call `db.orm.public.Bug.create(...)`? The page implies yes and then does the opposite. I could not restate what the rule is.

**Line 209** — "That table holds its extra columns plus the base model's primary key, which links it back to the base table. Its columns keep their constraints, at the cost of a join to read a full variant."
Stopped by: "keep their constraints" — constraints compared to what? I have to reconstruct it from the previous bullet's "have to be nullable there." Two bullets carrying an implicit contrast that's never stated as a contrast.

**Line 226** — "Referential actions: add `onDelete` and `onUpdate` to `@relation` with `Cascade`, `Restrict`, `SetNull`, `SetDefault`, or `NoAction`, as in `@relation(fields: [userId], references: [id], onDelete: Cascade)`. They become the foreign key's `ON DELETE` and `ON UPDATE` clauses."
Stopped by: five bare enum values with no hint of what any of them does, crammed into a bullet under "Next steps." I can't restate what `SetDefault` does. Either explain them or link out; a naked list teaches nothing.

## Words and phrases I had to guess

- **`npx prisma contract emit`** — guessed it's the version 8 replacement for `prisma generate`, i.e. it validates the schema and writes the typed client. The page uses it three times (lines 81, 136, 164) as the thing that reports schema errors and never once says what it is or when I run it.
- **`PSL`** in `PSL_NON_UNIQUE_BACKRELATION` / `PSL_ORPHANED_BACKRELATION` — guessed "Prisma Schema Language."
- **`db.orm.public`** — guessed `public` is the Postgres schema name and `orm` separates this from some other namespace. Pure guessing; it appears in every TypeScript example and is never explained.
- **"back-relation"** (line 46) vs **"the mirror field"** (line 81) vs **"list fields"** (line 136) — I guessed these are all the same concept: the field that has no column behind it. Three names for one thing in one page.
- **"the model for the join table"** (line 111) — guessed this is what used to be called an explicit many-to-many join model. The phrase is used five times and reads like a mouthful each time.
- **"dependent side"** (line 85) — guessed correctly from the bullets that follow, but the term arrives before the explanation.
- **"discriminator"** (line 171) — guessed: the column storing which variant a row is. The page does define it at line 196, one paragraph after first use.

## "So what do I actually type?"

1. **After I edit the schema, what command do I run to get the tables?** The page never mentions a migration step. `npx prisma contract emit` is presented only as the thing that *rejects* bad schemas. I've written a schema and have no idea what to run.
2. **`.variant("Bug")` — is that the model name or the discriminator value?** `@@base(Task, "bug")` declares the string `"bug"`, and then line 201 types `.variant("Bug")`. Two different strings, one capitalized, one not, and no statement of which one `.variant()` wants. This is the single worst spot on the page: I would type the wrong thing.
3. **Does `Bug` need its own `id`?** The `Bug` and `Feature` models have no `@id`. I assume it's inherited from `Task`, but nothing says so, and every other model on the page declares one.
4. **How do I make a relation optional?** A post with no author, `authorId Int?` — the single most common thing after the basic case, and it does not appear anywhere.
5. **Is the back-relation required?** `User` has `posts Post[]` in the one-to-many example. `User` has no `profile` field in the one-to-one example, and the prose says you "can" add it. So is the list field on the one-to-many side optional too, or required? Not stated.
6. **Two relations between the same two models.** Nothing on naming relations. In the version I know this was mandatory syntax; if version 8 changed it, I need to be told.
7. **Line 105: "put the key on the side you query from less often."** No reason given, so I can't judge whether the advice applies to me, and I don't know what "query from" means when both sides are readable.
8. **`tags: (t) => t.connect([{ id: tag.id }])`** — the arrow-function form is brand new to me and appears with no explanation. What else can `t` do? Is there a `disconnect`? Is the array required for one item?
9. **`Post.create({ title, authorId })`** — I expected `data: { ... }`. The wrapper is gone. The page shows it but never flags it as a change, so I'd assume I'd misread.

## Mechanism where I wanted instructions

- **Lines 206–209, the two storage layouts.** I asked "how do I add a variant" and got a lecture on table-per-hierarchy vs table-per-type. Worse, the switch between them is `@@map` — a directive that in the version I know just renames a table. Making a table name also decide the physical layout is surprising, and the page presents it as a fact to absorb rather than a choice with a recommendation. Tell me which one to use by default.
- **Line 136, "it is two one-to-many relations back to back."** That's how the tool thinks about it internally. What I needed was: here's the model, here's what you type to connect a pair.
- **Line 111, "A single foreign key cannot express this, because each side needs to point at many records."** Relational-database theory I already have. One sentence about needing a third model would do.
- **The error codes** (`PSL_NON_UNIQUE_BACKRELATION`, `PSL_ORPHANED_BACKRELATION`). Telling me the internal error identifier before telling me the rule inverts the order. State the rule; the code is noise unless I'm already staring at it.
- **Line 164** is the exception and is the best-written passage on the page: it names the thing I'd try from the old version, says it's gone, and says what to do instead. More of that.

## Could I do what the page is for, after one reading?

Partly. I could write a one-to-many and a one-to-one correctly, and I could write the many-to-many schema. Everything past the schema, I could not.

What I would still not know:

- What command turns my edited schema into actual database tables. The page never names a migration step.
- What `npx prisma contract emit` is, even though it is the page's authority for three separate rules.
- What `db.orm.public` means, so I couldn't adapt any TypeScript example to my own project with confidence.
- Which string `.variant()` takes. I'd get this wrong on the first try.
- How to make any relation optional.
- How to model two relations between the same pair of models.
- Whether to write a variant through `db.orm.public.Bug` or `Task.variant(...)`.
- What any of the five referential actions do.

The schema half of this page works. The "and then you use it" half assumes I already know the version 8 client, and I don't — that's the whole reason I'm reading a version 8 page.