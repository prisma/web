# Reader report: `orm/contract-authoring/psl-syntax.mdx`

Background I brought: two years of Prisma 7. I have never seen Prisma 8.

## Sentences I could not restate after one reading

**1.** "base models and variants: one model reusing another model's fields and rows." (line 16)

What stopped me: "and rows." Fields I understand. A model reusing another model's *rows* means nothing to me at this point — models don't have rows, tables do. I only half-understood it four sections later.

Plainer: "base models and variants: several models that share one table, told apart by the value of one field."

**2.** "`@updatedAt` no longer exists. Write `updatedAt temporal.updatedAt()`, with the call where the type would go." (line 153)

What stopped me: `temporal`. I don't know what it is, where it comes from, or whether I have to declare or import it. And "with the call where the type would go" is a clue that the syntax is strange, but it's a description of a code sample instead of a code sample. Every other feature on this page gets a code block; this one gets a sentence.

Plainer: show it.
```prisma
model Post {
  updatedAt temporal.updatedAt()
}
```
And say in one clause what `temporal` is (built in? a namespace I get for free?).

**3.** "In Prisma ORM 8 the native type is the field's type, so `String @db.VarChar(35)` from Prisma ORM 7 becomes `VarChar(35)`. The `@db.` attributes are gone." (line 197)

What stopped me: the examples above this use `String`, `DateTime`, and `Uuid`. So sometimes the type is a native PostgreSQL type and sometimes it is a Prisma scalar. The page never says both sets exist side by side, never says which is which, and never links to a list of either. After one reading I do not know whether `String` is still legal, or whether it is a preferred spelling of `text`.

**4.** "Prisma ORM matches the two list fields to the model that holds a foreign key to each side and whose primary key is exactly those two foreign keys" (line 255)

What stopped me: three conditions welded into one sentence, and it's written from the tool's point of view ("Prisma ORM matches"), not mine. I had to read it twice to work out that it's telling me the rules my join model must satisfy.

Plainer: "For Prisma ORM to connect `Post.tags` and `Tag.posts`, the join model must (a) hold a foreign key to each side, and (b) use exactly those two foreign keys as its primary key."

And then: what happens if I get it wrong? Silent? An error at `emit`? The page doesn't say.

**5.** "`@@type("pg/text@1")` stores the values as `text` on PostgreSQL. That name is the PostgreSQL type plus a version, always `@1` today." (line 212)

What stopped me: "always `@1` today" tells me a version exists but gives me no reason to care and no rule for what to write when it isn't 1. If it is always `@1`, why am I typing it? I could not restate the purpose of the version because the page doesn't give one.

**6.** "If your database already has a PostgreSQL `enum` type, declare it in a `native_enum` block and type the field `pg.enum(Role)`." (line 216)

What stopped me: two new pieces of syntax (`native_enum`, `pg.enum(...)`) described in prose only, and `pg.` appears here for the first and only time with no explanation. I cannot write this after reading it.

**7.** "With its own `@@map`, as `Bug` has here, they are in a table of their own that shares the base model's primary key. Without one, they are nullable columns in the base table." (line 307)

What stopped me: it's not hard, but it's backwards for a reader. It tells me the consequence of a choice before telling me a choice exists. I had to reconstruct: "omitting `@@map` on a variant is a real design decision, not a default."

## Words and phrases I had to guess

- **"storage details"** (lines 13, 187). Guessed: the database column type and its size, e.g. `varchar(35)`. Confirmed later by example, but I guessed first.
- **`Uuid`** (line 45). Guessed: the PostgreSQL `uuid` column type, now spelled as a Prisma type. Not stated until line 197.
- **"named types"** vs **"extension types"** vs **"value objects"** (lines 13-17). Guessed all three from the one-line glosses; the value-object gloss ("a structured value stored inside its parent row, with no table of its own") is the only one that actually landed.
- **`pg/` and `mongo/` prefixes** in `@@type` (lines 38, 78). Guessed: the database family. Never stated.
- **`@1`** (line 38). Guessed: a format version for how values are encoded. Never stated.
- **`/control`** in `import pgvector from "@prisma/orm-extension-pgvector/control"` (line 317). Guessed: a subpath export meant for config files, as opposed to a runtime one. Never mentioned.
- **`public`** in `db.orm.public.Task.variant('Bug')` (line 305). Guessed: the PostgreSQL schema name. Nothing on this page introduces schemas, so it reads like a typo the first time.
- **`@@discriminator(type)`** (line 292). Guessed: `type` is the unquoted field name. Jarring, because `@@map("task")` two lines below quotes its argument and `@@base(Task, "bug")` mixes both styles in one call. I guessed the rule is "identifiers bare, strings quoted" and moved on.
- **`temporal`** (line 153). Guessed: a built-in namespace of time-related function types. Pure guess.
- **"emit"** (line 9). Guessed: generate. Fine, but it is a new verb replacing `generate`, and the page doesn't say that.

## Places I asked "so what do I actually type?" and got no answer

1. **The connection URL.** "The connection URL goes in this file too, in a `db` key beside `contract`." (line 140) The config example directly above it is complete except for the one thing every project needs. Adding two lines to the sample would cost nothing; instead I'm sent to the migration page.
2. **`updatedAt`.** Line 153, above. Described, never shown.
3. **`native_enum` and `pg.enum(Role)`.** Line 216. Described, never shown.
4. **The type list.** I have `String`, `DateTime`, `Uuid`, `VarChar(n)`, `ObjectId`, `Timestamptz`. What about integers, booleans, decimals, JSON, arrays of scalars, `Bytes`? No list, no link to one. For a page whose job is "here is how you write the schema", this is the biggest hole.
5. **Value objects, beyond the one shape.** Can I write `addresses Address[]`? Can a `type` contain another `type`? Can a `type` field have `@map` or a default? Not answered.
6. **Extension type names.** "The `pgvector` part … is a fixed name the pack declares." (line 341) Good to know it isn't the import name — but for any pack other than pgvector, how do I find out what its fixed name is? Its README? `contract emit` output? Not said.
7. **Enum defaults.** `priority Priority @default(Low)` (line 58) uses the member name while the member stores `"low"`. I guessed that's always right, but the Enums section never mentions defaults.
8. **The variant's missing `@id`.** `model Bug` (line 296) has no `@id` and no `id` field, unlike every other model on the page. I assume `@@base` supplies it. The page doesn't confirm it, so I don't know whether I may add one, must not add one, or should.
9. **Creating `db`.** "`db`, the client you create in `src/prisma/db.ts`, reads both." (line 359) I create it — how? That's the only sentence on the page that tells me to write a file and it has no link and no snippet.
10. **`Json`.** Value objects are stored "in a single `jsonb` column" (line 236). So is there still a plain `Json` field type for data I don't want to give a shape to? Unanswered.

## Places the page explains internals when I only wanted to know what to do

- **Line 236:** "On PostgreSQL a value object field is stored in a single `jsonb` column. On MongoDB it is an embedded document." I can live with this — it does affect what I can query — but it arrives before I've been told anything about *using* value objects.
- **Line 255:** the join-model matching rule, written as what the tool does rather than what my schema must look like. See above.
- **Line 341:** "It is not the name you gave the import in `prisma.config.ts`, so renaming that import does not change what you write here." This is a paragraph about a mistake I hadn't made yet, explaining a resolution mechanism, in place of telling me where to find the name I need.
- **Line 110:** "The first line, `// use prisma-8`, tells the Prisma editor extension that the file is a Prisma ORM 8 contract. It is not required: the contract works without it. `prisma orm init` writes it, so keep it." Three sentences that cancel each other out — it does nothing, it isn't required, keep it anyway. One sentence would do: "Leave the `// use prisma-8` comment in place; the editor extension uses it."
- **Line 151:** the split between database defaults and Prisma-generated defaults is genuinely useful — that one earns its place. Noting it so the list above isn't read as "cut all mechanism."

## Could I do what the page is for, after one reading?

Partly. I could write a plausible PostgreSQL contract with models, fields, `@id`, `@unique`, `@@map`, relations, an enum, and a value object, and I could point `prisma.config.ts` at it. The complete example at the top is the most useful thing on the page and carries most of that.

What I would still not know:

- **Which field types exist.** This is the failure that matters. I can copy `String`, `Uuid`, `DateTime`, `ObjectId` from the example and I can write `VarChar(35)`. For an integer, a boolean, a decimal, a date-only column, or a string array, I would be guessing, and the page gives me nowhere to look.
- **How to connect to my database**, because the `db` key is named but never shown.
- **How to write `updatedAt`**, `native_enum`, or `pg.enum(...)` — three features the page tells me about but does not show.
- **How to create `db`**, the client I'm told in the last section that I create.
- **Whether my many-to-many join model is correct**, or what I'll see if it isn't.
- **What `public` is** in `db.orm.public.Task`, and therefore whether schemas are something I need to declare in the contract.

The page reads like it was written for someone who already knows Prisma 8 and needs the deltas listed. As someone arriving from 7, I got a good tour of the five new things and lost the ordinary ground under them — the type list, the connection string, and the client file.