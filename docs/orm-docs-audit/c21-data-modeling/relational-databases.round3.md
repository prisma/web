Read once, top to bottom, as a Prisma 7 user who has never seen v8.

## Sentences I could not restate after one reading

**Line 25** — "The side that declares the `fields` argument owns the foreign key. Deciding which side that is is the main choice in each of the relation kinds below."
"is is" made me re-read to check it wasn't a typo for something else. Plainer: "Deciding which side declares `fields` is the main choice in each relation kind below."

**Line 27** — the whole paragraph. "Your contract is the `contract.prisma` file that replaced `schema.prisma`. After every change to it, run `npx prisma contract emit`. That command checks the contract and regenerates your types. It only updates your code. To change the database, run `npx prisma migration plan --name add-posts`, which writes a migration file, and then `npx prisma db migrate`, which applies that file."
Four things at once: a renamed file, a new noun ("contract"), a codegen command, and a two-step migration flow — dropped mid-way through a section about how to declare a relation. I do not know what "contract" *means* beyond "the new name of schema.prisma," and the page never says. If that's all it means, say so; if it means more, say what. I would split this into its own short section or a callout, not bury it between two relation explanations.

**Line 29** — "Making one optional and the other required is rejected with an error whose `code` is `PSL_RELATION_NULLABILITY_MISMATCH`. `PSL` is the Prisma Schema Language, the language `contract.prisma` is written in."
The error code is internals. I wanted to know the rule: both fields optional or both required. The code tells me nothing I can act on, and then the page has to stop and define an acronym it only introduced in order to print the code. Cut the code, keep the rule.

**Line 54** — "`posts Post[]` on `User` is the mirror field, the field on the other side of the relation, which stores nothing in the database. Declaring it is optional. Prisma ORM 7 required this field; Prisma ORM 8 does not. Leave it out and the relation still works, and you read it from the foreign key side only."
The v7/v8 contrast is the most useful sentence on the page. But "you read it from the foreign key side only" is the part I couldn't turn into an action — see the "what do I type" list below.

**Line 56** — "`db` is the client you create once in `src/prisma/db.ts`, the file `npx prisma orm init` writes. `db.orm` holds your models by model name, and `public` is the PostgreSQL schema your tables live in, unless your contract puts the model in another schema with a `namespace` block."
Four new things (`db.ts`, `orm init`, `db.orm`, `public`, `namespace`) in two sentences, as an aside before an example about connecting a post to a user. The `namespace` exception is a detail I cannot use because no `namespace` block is ever shown. I'd cut the exception clause entirely here.

**Line 91** — "Three rules, in the order you apply them. First, add the field... Second, make it optional... Third, make the foreign key it mirrors `@unique`, or `npx prisma contract emit` reports an error..."
The third rule is the same `@unique` the code block sixteen lines above already has, and which line 75 already told me is what makes the relation one-to-one. Reading this, I genuinely could not tell whether the mirror field imposes a *new* `@unique` requirement or restates the existing one. Also "Three rules" is over-structure for what is really: add `profile Profile?`, that's it (the `@unique` is already there).

**Line 134** — "If a second join table connects the same two models, name the relation on both sides."
"Both sides" of *what*? `Post.tags` and `Tag.posts`, or `PostTag.post` and `PostTag.tag`? Four fields are in play and the sentence picks none. Earlier at line 31 "both sides" meant the two `@relation` attributes; here it can't mean the same thing, because `Post.tags` has no `@relation` at all.

**Line 148** — "An implicit many-to-many, with list fields on both sides and no join table, as in Prisma ORM 7, is not supported. Declare the model for the join table yourself. If you leave it out, `npx prisma contract emit` reports an error whose `code` is `PSL_ORPHANED_BACKRELATION`."
"If you leave it out" — leave out the join model, I assume, but "it" is three sentences from its antecedent and the nearest noun is "the model for the join table yourself."

**Lines 210 and 215** — "Write neither and the foreign key gets neither clause, so the database decides what happens." then "`NoAction` leaves the decision to the database."
Those are the same outcome in different words. After one reading I don't know why I'd ever type `NoAction` instead of nothing. Either say what differs or say they're equivalent.

## Words and phrases I had to guess

- **"contract"** (line 27, and "unless your contract puts the model…" line 56) — guessed: the new name for the schema file, nothing more. Never actually defined.
- **"mirror field"** (line 54) — guessed: what v7 called the back-relation field. The page's own error codes say `BACKRELATION` (`PSL_AMBIGUOUS_BACKRELATION`, `PSL_NON_UNIQUE_BACKRELATION`, `PSL_ORPHANED_BACKRELATION`) while the prose says "mirror field." Two names for one thing in the same document, never connected. If I search the docs for the error I hit, I won't find "mirror field."
- **"the model for the join table"** (lines 109, 148) — guessed: what v7 docs called an explicit many-to-many / join model. The phrasing is clumsy enough that I wasn't sure whether the model *is* the join table or merely describes one.
- **"variant"** / **"base model"** / **"discriminator"** (lines 154–180) — guessed from context, and the guesses held up. The discriminator explanation is the clearest part of the page.
- **"dependent side"** (line 95) — immediately defined in the same sentence. Fine.
- **`.all()`** (line 68) — guessed: v8's `findMany`. Never stated.
- **`add-posts`** (line 27) — guessed: an arbitrary migration name I choose, not a literal.

## Where I asked "so what do I actually type?" and got no answer

1. **Reading a user's posts when I skipped the mirror field.** Line 54 says "you read it from the foreign key side only" and then never shows that query. I'd want `db.orm.public.Post.where({ authorId: user.id }).all()` or whatever it actually is.
2. **Anything at all for one-to-one.** The one-to-one section has zero TypeScript. How do I create a profile for an existing user? How do I read a user with their profile — `.include("profile")` from `User`, or `.include("user")` from `Profile`? The section says "the relation reads from either side" and shows neither.
3. **Naming a relation when two join tables connect the same models** (line 134) — which of the four fields gets the name, and what does the syntax look like when `Post.tags` has no `@relation` to hang it on.
4. **Getting at variant fields after a base query.** Line 188: "each row carries the base fields plus only its own variant's fields." So after `await db.orm.public.Task.all()`, what is the TypeScript type, and how do I narrow a row to a `Bug` to reach `severity`? Switch on `type`? Some helper? This is the first thing I'd hit in real code and it isn't there.
5. **Whether polymorphic models need anything extra at migration time.** Two tables, one discriminator column, nullable extra columns — does `npx prisma migration plan` just handle it? Silence.
6. **`@@discriminator(type)` takes a bare identifier, `@@base(Task, "bug")` takes a bare identifier *and* a string, `@@map("features")` takes a string.** Three quoting conventions in one code block, unexplained. I would get this wrong on the first try.
7. **Self-relations.** A category with a parent category, a user who manages users. Very common, in v7's docs, absent here. I'd have to guess whether it's just a one-to-many pointed at the same model.
8. **`npx prisma migration plan` vs `npx prisma db migrate`** — one is `migration <verb>`, the other `db <verb>`. Is there a rule to the CLI shape, or do I memorize? Also, is `--name` required?

## Where it explains the internals when I only wanted to know what to do

- **Every `PSL_*` error code** (lines 29, 31, 91, 148). Four of them. I only need the rule; I'll read the error when I hit it. These also import the "PSL" acronym and the "backrelation" vocabulary for no reader benefit.
- **Line 134** — "you name the model at the other end, and Prisma ORM works out the join through `PostTag`." The "Prisma ORM works out the join" half is mechanism. The instruction is: type `Tag[]`, not `PostTag[]`.
- **Line 193** — "That table holds its extra columns plus the base model's primary key, which links it back to the base table." Table layout I don't act on. The next clause, "Those columns can be `NOT NULL`, and reading a full variant costs a join," is the part that drives my decision, and the paragraph does use it that way, so only the first half is surplus.
- **Line 27** — "That command checks the contract and regenerates your types. It only updates your code." Fine, actually — it stops me from expecting a database change. Keep.

## Could I do what the page is for after one reading?

One-to-many, yes. One-to-one schema, yes; one-to-one *queries*, no, because there aren't any. Many-to-many, mostly — I could write the three models and the `t.connect` call, but I'd be guessing the moment a second join table appeared. Polymorphic, I could write the schema and a `.variant("Bug").create(...)`, and then get stuck the first time I read a mixed list back and needed the variant fields in TypeScript.

What I'd still not know after one reading:
- What a "contract" is, beyond a renamed file.
- Whether "mirror field" and "backrelation" are the same thing (they clearly are, and the page never says).
- How to query a relation from the side without the mirror field.
- How to type-narrow a polymorphic read.
- How to model a self-relation.
- Why `NoAction` exists when omitting the clause does the same thing.

One more structural complaint: referential actions — `onDelete: Cascade`, the thing I reach for in nearly every real schema — are a single bullet in "Next steps," below the AI-prompt section. That's a main topic filed under links.