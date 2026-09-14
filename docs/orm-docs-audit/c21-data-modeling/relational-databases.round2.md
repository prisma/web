Read once, top to bottom, as a Prisma 7 user.

## Sentences I could not restate after one reading

**Line 27** — "Run `npx prisma contract emit` after every change to your contract, the `contract.prisma` file that replaced `schema.prisma`. It checks the contract and writes `contract.json` and `contract.d.ts` beside it. To create the tables themselves, run `npx prisma migration plan --name add-posts` and then `npx prisma db migrate`, as described in [Generating a migration](...)."

What stopped me: four new things at once. "Contract" is never defined — it's used as both the file and some abstract thing ("your contract"). I don't know what `contract.json` and `contract.d.ts` are for, or whether `contract emit` is the new `prisma generate`. And I don't know why creating tables takes two commands instead of one, or what `migration plan` produces that `db migrate` then consumes. Plainest version I'd have understood: "`contract.prisma` is the new name for `schema.prisma`. After editing it run `npx prisma contract emit`, which checks it and regenerates the client types. That only updates your code — to change the database, run X, which writes a migration file, then Y, which applies it."

**Line 15** — "The model that stores the connection has two fields." I read "stores the connection" as some new storage concept before working out you just mean the table with the foreign key column in it. Say that: "The model whose table gets the foreign key column declares two fields."

**Line 25** — "Which side that should be is the main decision in the shapes below." Two problems. "Which side that should be" is a garbled clause I had to re-read. "The shapes below" — I didn't know "shape" was going to be your word for relation kinds until line 35. Plainer: "Deciding which side that is is the main choice in each of the relation types below."

**Line 54** — "`posts Post[]` on `User` is the mirror field: the field on the other model, which stores nothing in the database." I stalled on "mirror field" — it's a term I've never seen (in Prisma 7 this was just the other side of the relation, or the back-relation). The definition that follows is fine, but the term arrives before I know I need one. Also "Mirror fields are optional to declare" contradicted my whole mental model from v7, where leaving it off was an error, and the page doesn't flag that this changed.

**Line 91** — "A bare field typed as the other model is enough, and it needs no `@relation` of its own." "Bare field" is doing work I had to guess at. And this paragraph stacks five separate rules (add it, no `@relation`, must be optional, the FK must be `@unique`, error code if not) into five short sentences with no ordering. I could restate each one but not the paragraph.

**Line 109** — "you add a third model, the model for the join table, which holds one record per connected pair." "The model for the join table" is a clumsy phrase you then repeat three more times (lines 134, 152, 209). In v7 I called this the relation table or join model. Pick one short name and use it.

**Line 134** — "The mirror fields on `Post` and `Tag` name the far side (`Tag[]`, `Post[]`), and `npx prisma contract emit` matches them to the two relations on `PostTag`." "Name the far side" — I guessed this means the field's type is the model at the other end of the relation, not `PostTag`. That's the surprising part and it's buried. Say it outright: "Note that `Post.tags` is typed `Tag[]`, not `PostTag[]` — you name the model at the other end, and Prisma works out the join through `PostTag`."

**Line 136** — "Both write the same row, so pick one per pair: running both inserts the same composite key twice, and the second fails." Fine mechanically, but I had no idea why I'd ever be tempted to run both, so the warning read as a puzzle.

**Line 148** — "`t` is the argument of the nested write callback, and it offers `t.create([...])`, `t.connect([...])`, and `t.disconnect([...])`, each taking an array." This explains the syntax of an API I've never seen by naming its parts. I wanted to know why it's a callback at all and what the difference between `create` and `connect` is. The v7 equivalent was a plain object; this is a real change and gets one sentence.

**Line 184** — "A variant has every field of its base plus the ones it declares, and it needs no `@id` of its own, because it uses the base model's primary key." Restatable, but note `Bug` and `Feature` in the code block above have no `@id` and I'd already flagged that as a typo before reaching this line.

**Line 186** — "`.variant(...)` limits the query to one variant, and it takes the variant's model name, `"Bug"`, not the discriminator value `"bug"`." I understand the words. I do not understand why two nearly identical strings exist, or what happens if I pass the wrong one. This looks like a trap and the page just points at it.

**Line 216** — "Referential actions: add `onDelete` and `onUpdate` to `@relation`, as in `...`. `Cascade` deletes or updates the matching rows, `Restrict` blocks the change, `SetNull` clears the foreign key, `SetDefault` writes its default value, and `NoAction` leaves the decision to the database. They become the foreign key's `ON DELETE` and `ON UPDATE` clauses." Five options defined in one sentence, inside a bullet in "Next steps". I can't hold five definitions from one comma-separated run. Also it doesn't say what the default is when I write neither — that's the only thing I actually needed.

## Words and phrases I had to guess

- **"contract"** — guessed it's the new word for schema, and `contract emit` is the new `prisma generate`. Never confirmed.
- **"PSL"** in `PSL_RELATION_NULLABILITY_MISMATCH` etc. — guessed "Prisma Schema Language". Never expanded anywhere on the page.
- **"mirror field"** — guessed: what v7 called the back-relation / the other side.
- **"shapes"** (lines 25, 35) — guessed: kinds of relation.
- **"far side"** (134) — guessed: the model at the other end of the relation.
- **"bare field"** (91) — guessed: a field with a type and nothing else, no attributes.
- **"discriminator"** (158) — the page does define it, but only after using it in the heading sentence. I guessed correctly from the SQL sense.
- **"variant models"** (158) — guessed: subtypes. The page never says whether this is inheritance in the TypeScript sense.
- **"the `data:` wrapper from Prisma ORM 7 is gone"** (58) — I knew what this meant only because I'd used v7. Fine for me, meaningless to anyone else.
- **"ORPHANED_BACKRELATION"** (152) — the error name has nothing to do with "you used an implicit many-to-many". I'd have no idea why I got this error if I hit it in the wild.

## Where I asked "so what do I actually type?"

1. **Where does `db` come from?** Line 61 is `await db.orm.public.Post.create(...)` with no import, no construction, no file. This is the first line of runtime code on the page and I cannot run it. `user` in `authorId: user.id` is also undefined.
2. **What is `public` and how do I change it?** Line 58 says it "is `public` unless you set another one" — set it where? In `contract.prisma`? In the connection URL? Circular and unactionable.
3. **What's the actual command sequence for a schema change?** Line 27 lists three commands but never as an ordered "do this every time" list, and never again for one-to-one, many-to-many, or polymorphic. By the polymorphic section I no longer knew whether adding `@@base` needs a migration.
4. **How do I read a relation?** Every read is deferred to `/orm/fundamentals/relations-and-joins`. That's four separate punts. At minimum I wanted one `include`-style example on a page about modeling relations, because how I read it is half of how I decide who owns the key.
5. **How do I query a variant's own model?** "Read and write variants through the base model" implies `db.orm.public.Bug` doesn't exist, but the page never says so. I'd try it and find out.
6. **What do `t.create` and `t.disconnect` look like?** Named at line 148, never shown. Only `connect` has an example.
7. **What does a query on `Task` with no `.variant()` return in TypeScript?** Line 192 says "returns every variant" — as what type? A union? Base fields only? This decides whether the feature is usable.
8. **`npx prisma skills sync`** — run where, and does it need anything else?
9. **What's the default `onDelete`?** See above.

## Places explaining internals when I wanted instructions

- **Line 27** — "It checks the contract and writes `contract.json` and `contract.d.ts` beside it." I don't care what files it writes. Tell me to run it after every schema edit.
- **Line 54** — "`npx prisma contract emit` matches it to the foreign key on `Post`." Also line 134, same move. The matching step is the tool's business. What I need to know is: declare it or don't, and here's what changes for me if you do.
- **Line 152** — "`npx prisma contract emit` rejects it with an error whose `code` is `PSL_ORPHANED_BACKRELATION`, and the message tells you to add an explicit model for the join table." Three clauses about the error to deliver one instruction: implicit many-to-many is gone, write the join model yourself.
- **Line 197** — "That table holds its extra columns plus the base model's primary key, which links it back to the base table." This one earns its place, because it explains the join cost in the next clause. The rest of the error-code and file-writing detail does not.

Four separate error codes (lines 29, 31, 91, 152) are presented as page content. They read as reference material bolted into a tutorial. None of them is something I'd look up here.

## Could I do what the page is for, after one reading?

I could write the `.prisma` models. The four schema examples are clear, the foreign-key ownership rule at line 25 is stated once and correctly, and the one-to-one "which side" section (93–103) is the best-written part of the page — three concrete signals, all pointing the same way.

I could not run any of it. I don't know how to get a `db` object, I don't know the full command sequence to get from an edited `contract.prisma` to tables in Postgres, and I don't know what `contract emit` is actually for beyond "run it". I'd also be stuck the first time I wanted to read a relation back, since every read is a link to another page.

The polymorphic section I'd have to reread. I understand `@@discriminator` and `@@base` in isolation, but not what the TypeScript side looks like — what comes back from an un-filtered `Task` query, whether variant models exist as their own entry points, or why `.variant("Bug")` and the `"bug"` discriminator value are spelled differently.

Path: `/Users/will/Projects/prisma/web/.claude/worktrees/pr-conflicts-review-fb93f7/wip/c21/dm/r2/relational-databases.mdx`