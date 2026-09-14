Read once, top to bottom, as a Prisma 6 user who has never seen this version.

## Sentences I could not restate after one reading

**Line 22 vs line 241 — direct contradiction.**
> "All four apply to both databases Prisma ORM supports today, PostgreSQL and MongoDB."

then

> "[Relational data modeling](...) for PostgreSQL and other SQL databases"

Which is it? I have a MySQL app. Line 22 says the ORM supports exactly two databases now; line 241 says "other SQL databases" exist. I stopped reading to figure out whether my database was dropped. The page never says.

**Line 36.**
> "Every record of a model has its own identity and its own history."

"Its own history" stopped me cold. Does Prisma now store record history/versions? I re-read the following sentence and concluded it's a metaphor for "it's the same record over time," but I genuinely could not tell on first pass. Plainest version: "Two posts with the same title are still two different records, and a user who changes their email is still the same user." — i.e. delete the abstract sentence, keep the concrete one.

**Line 59.**
> "Leave `id` out of the `create` call and MongoDB assigns the `ObjectId` for you."

The model above it is `id ObjectId @id @map("_id")` — required, no `@default`. In Prisma 6 I wrote `@default(auto())`. So will the generated TypeScript type actually let me omit `id`? The schema as printed says it's required. I could not restate this without guessing that ObjectId gets special-cased.

**Line 65.**
> "A reference table, one that holds a fixed set of values the rest of your data points at, is the classic fit."

A definition wedged inside a sentence, followed by "is the classic fit" — fit for what? (Natural keys, three sentences back.) Plainer: "Natural keys fit reference tables best — tables holding a fixed set of values that other records point at."

**Line 66.** "A country is its ISO code, and the code never changes." A country is not its ISO code. You mean "identify a country by its ISO code."

**Line 155.**
> "The column names in the table are PostgreSQL columns."

The table's columns are "Type" and "Stores". I first read this as being about the table's own headers. I think you mean: "Where the table names a type like `numeric` or `jsonb`, that's the PostgreSQL column type Prisma uses."

**Line 157 — two problems.**
> "A `Decimal` value reaches your code as a decimal string, so binary floating point never loses digits."

The "so" is backwards. Binary floating point isn't involved at all; that's the point. Plainer: "Decimal values arrive as strings, so nothing is rounded through a JavaScript number."

> "Write `price Decimal` when any precision will do, and `price Numeric(10, 2)` when you want an explicit precision and scale."

`Numeric` is not in the type table directly above. Is it a type? A variant of `Decimal`? Where did it come from? This is the single most confusing line on the page.

**Line 159.**
> "[Raw queries](/orm/reference/raw-queries) says which Node.js versions have `Temporal` built in and how to add it to older ones."

I could not resolve why a raw-queries reference page would tell me about Node versions and Temporal polyfills. That's a runtime-requirements fact, and I'd never look there.

**Line 185.** Too many ideas in one sentence, and it argues against itself:
> "Store an integer number of the smallest unit instead. `Decimal` is exact as well, so use it when your amounts need more decimal places than the currency's smallest unit, and use `Int` otherwise because a plain JavaScript number is easier to work with than a decimal string"

First it tells me to use integer cents. Then it tells me `Decimal` is also exact. Then it gives a rule that requires me to hold "smallest unit," "decimal places," and "decimal string ergonomics" in my head at once. I read it three times. Plainer as two sentences: "Use `Int` and store cents for ordinary money — you get a plain JavaScript number. Use `Decimal` only when you need more decimal places than the currency has, like per-unit rates."

**Line 211.**
> "Two kinds of field describe a relation, and each model in it needs the fields for its own side."

Then the example gives `User` exactly one field (`posts Post[]`) and `Post` two. So "the fields" (plural) for its own side is wrong for `User`. I couldn't reconcile the rule with the example.

**Line 246.**
> "Projects created with `npm create prisma@latest` include the [Prisma ORM skills](...) for your coding agent."

"Skills" is used as an established noun and I don't know what it is. I guessed: some package of instructions an AI agent reads.

## Words and phrases I had to guess

- **"contract"** (line 13). I guessed: the new name for the schema file, and also a general noun for "the thing in that file." It's used both ways ("in your contract", "Every contract is built from") and I was never sure whether a contract is the file, the content, or a broader concept.
- **"PSL"** — never appears spelled out, but the link at line 170 is `/orm/contract-authoring/psl-syntax`. Guessed: Prisma Schema Language.
- **"emit"** (line 257, `npx prisma contract emit`). Guessed: the replacement for `prisma generate`. The page never says what it emits.
- **"surrogate key" / "natural key"** — these I know, but you define them, which is fine.
- **"Jsonb"** as a distinct Prisma type. In Prisma 6 there was only `Json`. Guessed: `Json` maps to `json`, `Jsonb` maps to `jsonb`, and I should almost always use `Jsonb`. The page never tells me which to choose, even though it says `Json` "offers no comparison at all" — so why would anyone pick it?
- **"polymorphic collections"** (line 242). Guessed: storing different shapes in one collection. Never defined.
- **"reference table"** — defined mid-sentence, see above.

## "So what do I actually type?"

1. **The whole file.** The page never shows a complete `contract.prisma`. Coming from Prisma 6 my first question is: are `datasource db { ... }` and `generator client { ... }` still in there? Do I still set `provider` and `url`? Not one word.
2. **Enums** (line 170). "A field can also hold one of a fixed set of values, which you declare as an [enum]." No syntax, not even a two-line block, in a page that shows a code block for everything else.
3. **`Numeric(10, 2)`** (line 157). Is that a type name I write literally? It's not in the table.
4. **MongoDB `id`.** Do I write `@default(auto())`, or truly nothing? See above.
5. **`uuid(7)`** (line 118). Is `uuid(4)` also valid? Is the bare `uuid()` the same as `uuid(4)`? Implied but not stated.
6. **Line 257.** "run `npx prisma contract emit` after every change to the contract, then plan and apply a migration." What are the plan and apply commands? You gave me one command and then described two more steps in prose without their commands. This is the last line of the page and the most actionable moment in it.
7. **`npx prisma skills sync`** (line 246) — fine, that one's concrete.
8. **Composite key example** (lines 126-133). `UserTag` has `userId` and `tagId` but no relation fields and no `@relation`. If I copy it, I have a model that links nothing. It's introduced as "a model that links two others" and then doesn't link them.
9. **One-to-one** (line 235). Listed as a kind of relation, no syntax shown, and the `@unique` that makes it one-to-one is never mentioned.
10. **What happens if I skip a primary key?** Line 42 says Prisma "needs" one. Error at emit time? Silent read-only model? Not said.
11. **`@@map("users")`** appears only in the MongoDB tab (line 55) with no explanation of why it's there and not in the PostgreSQL tab. Do I need it on Mongo? It's presented as part of the required MongoDB shape.

## Places explaining internals when I wanted to know what to do

- **Line 120.** "which MongoDB generates without asking any other server and which carries its own creation time." I don't get a choice here — you just told me the choice is made for me. The mechanism is trivia at that point.
- **Line 214 and again line 231.** "It stores nothing in the database." / "like `author` it stores nothing in the database." Said twice. The first time is useful. The second is padding.
- **Line 36.** "Every record of a model has its own identity and its own history." Philosophy, not a thing I can act on.
- **Line 108.** "It is also sequential, so it leaks row counts and invites guessing if you expose it in URLs." This one earns its place — it changes what I'd pick.

## Could I do what the page is for, after one reading?

Partly. I could write a model with a surrogate integer id, scalar fields, and a one-to-many relation. That's the core and it lands.

What I would still not know:

- Whether my MySQL database is still supported.
- What else goes in `contract.prisma` besides models — I've never seen a whole file.
- How to declare an enum, despite being told to use them.
- Whether `Numeric` is a type I can write.
- The commands to get my models into the database. "Plan and apply a migration" is not a command.
- How to write a one-to-one or many-to-many relation, or a working link model. The one link model shown is incomplete.
- When to use `Json` instead of `Jsonb`, given you told me `Json` can't be filtered at all.
- What to actually write for a MongoDB `id` field.

Two more things worth fixing. **"Every contract is built from four things"** (line 15) is then contradicted by the page itself — enums are a fifth, and datasource/generator presumably a sixth and seventh. Say "four building blocks" and don't claim completeness. And the title is **"Overview"** while `metaTitle` is "Data modeling in Prisma ORM"; as a reader landing on a page called "Overview" I have no idea what it overviews until line 9.