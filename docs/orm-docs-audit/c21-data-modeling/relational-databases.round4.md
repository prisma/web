Read once, top to bottom, as someone coming off two years of Prisma 6/7.

## Sentences I could not restate after one reading

**Line 25** — "Your contract is the `contract.prisma` file that replaced `schema.prisma`. After every change to it, run `npx prisma contract emit`. That command checks the contract and regenerates your types."

This is the first time the word "contract" appears and it arrives mid-section, bolted onto a paragraph about `@relation`. I don't know what a "contract" *is* in this product — is it just the renamed schema file, or a new concept? "Emit" tells me nothing. I'd have understood: "In Prisma 8 the schema file is called `contract.prisma` instead of `schema.prisma`. After you edit it, run `npx prisma contract emit` to regenerate the TypeScript client. This does not touch the database."

**Line 29** — "Referential actions decide what the database does to the rows on the foreign key side when the row they point at is deleted or its key changes."

Two levels of indirection ("the rows on the foreign key side", "the row they point at") in one sentence. I had to re-read to work out which is which. Plainer: "When a `User` row is deleted or its `id` changes, referential actions decide what happens to the `Post` rows that reference it."

**Line 35** — "`NoAction` writes the clause out, which does the same thing as writing no clause at all."

Stopped me cold. If it does nothing different, why does it exist and why would I ever type it? The page gives me a menu item that it simultaneously says is pointless. Either say why it's there (I vaguely recall it differs from `Restrict` on some databases) or drop it.

**Line 93** — "The `@unique` already on `Profile.userId` is what allows the mirror field."

"Allows" is doing unexplained work. Allows it to exist at all? Allows it to be `Profile?` rather than `Profile[]`? I guessed the latter but the sentence doesn't say. Plainer: "Because `userId` is unique, the mirror field can be a single `Profile?` instead of a list."

**Line 138** — "If a second join table connects the same two models, put the relation name on the list field, `Post.tags`, and on `PostTag.post`, the field that points back at `Post`."

This contradicts what line 37 told me. Line 37 said names go on "both sides" of the relation, with `fields:` on one side. Here the name goes on a list field and on a *third* model's field. I cannot reconcile the two rules, and there's no code for this one, just prose describing where to put things.

**Line 192** — "In TypeScript those rows are a union with one member per variant, and each member's discriminator field is that variant's value, so switch on the discriminator field to reach a variant's own fields."

Three ideas in one sentence and zero code. I think I know what a discriminated union is, but the page is describing the shape of a result type entirely in words. Show me the five-line `switch (task.type)` block instead.

**Line 196–197** — `@@map` deciding whether a variant shares the base table or gets its own.

In every Prisma version I've used, `@@map` renames a table. Nothing more. Discovering it silently controls physical storage layout for variants is a genuine surprise, and the page states it as if it were obvious. I re-read it twice to check I hadn't misread.

## Words and phrases I had to guess at

- **"contract"** — guessed: the new name for the schema file. Still don't know if it means more than that.
- **"emit"** — guessed: generate the TypeScript client.
- **"mirror field"** (line 60) — guessed correctly from the definition given, but it's a brand-new coinage. You then tell me Prisma 7 called it "back-relation" and error codes still say that, so I now hold two names for one thing.
- **"is rejected"** (line 27) — guessed: `contract emit` errors. The page doesn't say who rejects it or when I'd find out.
- **"the model for the join table"** — guessed this is what used to be called an explicit many-to-many. The phrase is awkward and repeated four times; your own agent prompt at line 207 says "explicit model for the join table", so the word exists.
- **"discriminator"** — guessed: the column recording which variant a row is. The page does define it, but it's one sentence carrying a new keyword, a new concept, and a code example at once.
- **"variant"** vs **"base"** — guessed subclass/superclass. Works, but I only inferred it.
- **`public`** in `db.orm.public.Post` — told it's the PostgreSQL schema. See below.

## Where I asked "so what do I actually type?"

1. **`db` is never imported.** Line 62 says it lives in `src/prisma/db.ts`. Every code block then uses a bare `db`. I don't know the import line. Show `import { db } from "@/prisma/db"` once.

2. **Three setup commands, no order.** `npm create prisma@latest` (line 203), `npx prisma orm init` (line 62), `npx prisma contract emit` (line 25), `npx prisma migration plan --name <name>` and `npx prisma db migrate` (line 213). I cannot assemble the actual loop. The full sequence — edit `contract.prisma`, emit, plan, migrate — is never written down in one place, and it's the single thing I most need.

3. **What is `public` if I'm not on PostgreSQL?** The description says "PostgreSQL and other SQL databases". `db.orm.public.Post` appears in every query. On MySQL or SQLite, what do I type there? The page doesn't say, and this is in literally every example.

4. **Self-relations (line 58).** "A category with a parent category is an ordinary one-to-many whose relation field is typed as the same model." No code. And a self-relation has two fields on one model pointing at each other — by line 37's rule that looks like it needs a `@relation` name. Does it? I'd have to go try it and see if emit errors.

5. **Are mirror fields required for many-to-many?** Line 60 tells me mirror fields are optional in Prisma 8. The many-to-many example includes `Post.tags` and `Tag.posts`, and line 143's nested write goes through `tags`. So are they optional here too, and if I omit them do I lose `t.connect`? Not answered.

6. **`SetDefault` with no default.** "writes the foreign key's default value" — what happens if the column has no `@default`? Error at emit, or at runtime?

7. **How do I name a variant's own table something specific?** `@@map("features")` on `Feature` both splits it into its own table *and* names it `features`. If I want its own table named `Feature`, do I write `@@map("Feature")`? And what table does `Bug` map to — is it `Task`? Not stated.

## Where the page explains internals instead of what to do

- **Line 60**, the history lesson: "Prisma ORM 7 called it the back-relation, and its error codes still use that word. Prisma ORM 7 required this field. Prisma ORM 8 does not." Three sentences of version archaeology in the middle of learning one-to-many. The actionable part — "you can leave it out" — is buried.
- **Line 29**, "They become the foreign key's `ON DELETE` and `ON UPDATE` clauses. Write neither and the foreign key gets neither clause, so the database decides." Useful to some, but it's describing generated SQL when I only wanted to know which action to pick.
- **Line 35**, `NoAction` — pure implementation trivia about what SQL gets written, with no guidance attached.
- **Line 186**, the paragraph explaining that passing `"bug"` instead of `"Bug"` is a TypeScript error, *and why* ("the only names it accepts are the model names of the base model's variants"). That's the type system's reasoning. Just tell me: pass the model name, capital B.
- **Line 192**, the whole union-type paragraph, discussed above.

## Ordering problem

Line 60 uses `db.orm.public.Post.where(...).all()` in a sentence. Line 62 — the *next* paragraph — is where `db`, `db.orm`, and `public` are finally explained. I hit the code first and had no idea what I was looking at.

## Could I do what the page is for, after one reading?

Partly. I could write a one-to-many and a one-to-one schema — those sections are clear and the "which side owns the foreign key" list at line 103 is the best thing on the page. I could write the many-to-many models, though I'd be unsure whether the list fields are required.

I could not actually run any of it. I don't know the import for `db`, I don't know the command sequence from "I edited the file" to "the database has the table", and if I'm not on Postgres I don't know what replaces `public`. Polymorphic relations I could copy-paste but not adapt: I don't understand what `@@map` will do to my table layout well enough to choose, and I couldn't write the TypeScript that reads a mixed list of tasks because the page describes that result type only in prose.