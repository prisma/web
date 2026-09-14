I read the page once, top to bottom, as someone coming from Prisma 6 with `schema.prisma`.

## Sentences I could not restate after one reading

1. "With TypeScript authoring you write your contract, the `contract.ts` file that replaced `schema.prisma`, in code rather than in a [`.prisma` file]."
   Stopped by: "your contract" is a brand-new term, and the definition is crammed in as an aside between the subject and the verb. I had to read it three times to see that "write ... in code" was the main clause. Plainer: "Prisma 8 replaces `schema.prisma` with a *contract*. You can write the contract either as a `.prisma` file or as TypeScript in `prisma/contract.ts`."

2. "the same two files a PSL contract produces."
   Stopped by: "PSL" is never spelled out anywhere on the page. It is only a link. Plainer: spell it out once — "PSL (Prisma Schema Language, the `.prisma` file format)".

3. "parts of the contract are assembled programmatically from other static definitions"
   Stopped by: "other static definitions" of what? Static as opposed to what? I cannot picture a case. Plainer: give one concrete example, e.g. "you generate models from a list of table names you already have in TypeScript".

4. "The database and its family are already fixed by the import: `@prisma/orm-postgres/contract-builder` produces PostgreSQL contracts, so you never name them yourself."
   Stopped by: "its family". I do not know what a database *family* is, and "them" has no clear antecedent. Plainer: "You never pass the database name. It comes from which package you import."

5. "The factory receives authoring helpers composed from your database and every extension pack you declared"
   Stopped by: "authoring helpers composed from" is three abstractions stacked. Plainer: "Which helpers you get depends on your database and the extensions you listed."

6. "The two builders share the same shape but differ where the databases do."
   Stopped by: this claims the two examples are the same shape, but they are not. The PostgreSQL tab calls `defineContract(options, factory)`; the MongoDB tab calls `defineContract({ models })` with no factory at all. They look like two different APIs. The sentence told me not to notice a difference I had already noticed.

7. "`prisma contract emit` writes it to JSON in a fixed key order and hashes it, so the same source always produces the same files."
   Stopped by: nothing here tells me what to do. See "internals" below.

8. "Both builders also accept the model name as a string."
   Stopped by: "both builders." Five paragraphs earlier "the two builders" meant PostgreSQL and MongoDB. Here it means `rel.hasMany` and `rel.belongsTo`. Plainer: "`rel.hasMany` and `rel.belongsTo` also accept the model name as a string."

## Words and phrases I had to guess

- **"contract"** — I guessed: the new name for the schema.
- **"PSL"** — I guessed: Prisma Schema Language.
- **"codecId: "pg/text@1""** — I guessed: some identifier for how a value is encoded to and from the column. I have no idea where the list of valid values lives. It appears twice in code and is never explained in prose.
- **"nativeType: "text""** — I guessed: the raw PostgreSQL type name.
- **"as const"** — I guessed it is required, not stylistic, but the page never says why.
- **"your database's target package"** — I guessed: the `@prisma/orm-*` package for your database.
- **"extension pack" / "pack"** — I guessed: a plugin. The contract imports `.../pack` and the config imports `/control`, with no explanation of why the same extension has two entry points.
- **"declared named types"** — I guessed: things like the pgvector `Vector(1536)` you put in the `types` map.
- **"emitted"** — I guessed: written into `contract.json`.
- **"contract infer"** — I guessed: reads an existing database and writes a `.prisma` file.
- **"the two files"** — used in Next steps without repeating which two.

## Places I asked "so what do I actually type?" and got no answer

1. **The full list of field helpers.** The page shows `field.text()`, `field.uuidString()`, `field.json()`, `field.id.uuidv4String()`, `field.temporal.*`, `field.namedType()`. I have integers, booleans, decimals, plain dates, and byte columns in my app. "The exact helper set comes from your database and the extension packs you compose" is not an answer and there is no link to the list. This is the single biggest gap.
2. **`.defaultSql(expression)`** — is the argument a string? `defaultSql("now()")`? No example.
3. **`rel.hasOne` and `rel.manyToMany`** — named and then dropped. Many-to-many was the hardest relation in v6. What are the options? Is there a join table, and do I name it?
4. **Indexes.** `.unique()` is covered. There is no way shown to add a plain, non-unique index, or a multi-column index. Meanwhile the agent-prompt section says "add a unique index to the email field", which mixes up index and constraint.
5. **Composite primary keys.** Both `field.id.uuidv4String()` and a chained `.id()` exist. Which do I use, and how do I mark two fields as the key together?
6. **Adding the extension to `prisma.config.ts`.** "Add the same pack to `prisma.config.ts` as `extensions: [pgvector]`, importing the pack's `/control` export." No code block. I do not know the import line, and I do not know whether `extensions` goes at the top level of `definePrismaConfig` or inside `ormConfig({ ... })`. The config example earlier shows only `contract`, so I cannot infer it.
7. **Do I have to declare foreign keys myself?** The PostgreSQL example has both `rel.belongsTo` *and* `constraints.foreignKey(...)` for the same relation. The prose says the callback form is "for foreign keys with explicit names", which suggests the constraint already exists and I am only naming it — but that is my guess, and the example reads as if both are required.
8. **Can I call `.sql()` without `.relations()`?** Every example is `Model.relations({...}).sql({...})`. A model with no relations is common. Is `Model.sql({ table })` legal?
9. **Postgres enums.** The enum is stored as `text`. In v6 I got a real Postgres `enum` type. Can I still have one? If so, what `codecId` and `nativeType`?
10. **What the emit step needs from my TypeScript setup.** Does `prisma contract emit` type-check the file? Does the file have to be inside my `tsconfig.json`? If I import a helper from another package, does emit resolve it?
11. **Converting an existing project.** "Keep the other form out of the project so the two can never disagree." Do I delete `schema.prisma`? Is there a command? The only conversion path offered is asking a coding agent.
12. **MongoDB primary keys.** `_id: field.objectId()` is never marked with `.id()`. I assume `_id` is special, but the page does not say so.

## Places that explain how the tool works when I only wanted to know what to do

- **The whole "How `defineContract` works" section.** The useful part is one sentence: MongoDB takes one object, PostgreSQL takes options plus a factory. The rest describes argument plumbing I would have learned from the example.
- **"`prisma contract emit` writes it to JSON in a fixed key order and hashes it, so the same source always produces the same files. That works only if the file holds plain data."** I do not need the key ordering or the hash. The rule I need is the three bullets that follow. Lead with the rule.
- **"`prisma contract emit` imports the file and reads its `default` or `contract` export, and nothing else."** Half internals, half the only place the page tells me my export must be named `contract` or be the default. That is a required instruction buried in a section about purity, six screens below the example that relies on it.
- **"The factory receives authoring helpers composed from ..."** — describes the mechanism. What I need is: "`field`, `model`, `rel` and `type` come from the factory's argument, not from imports."

## Contradictions between the two tabs that no prose resolves

Reading top to bottom, the MongoDB tab looks like a different product:

- PostgreSQL destructures `{ field, model, type }` from a factory; MongoDB imports `field, model, rel` at the top.
- PostgreSQL: `rel.hasMany(Post, { by: "userId" })`. MongoDB: `rel.hasMany("Post", { from: "_id", to: "authorId" })`. Different option names for the same idea, with no note that `by` and `from`/`to` differ per database.
- PostgreSQL: `User.refs.id` (property, plural). MongoDB: `User.ref("_id")` (method, singular). Never mentioned.
- PostgreSQL puts relations in a chained `.relations()`; MongoDB puts them inline in the model options. The prose mentions the `collection` difference but not this one.
- The MongoDB `rel` import is used, but the MongoDB list of helpers in the prose ("`field.string()`, `field.int32()` ...") omits `field.objectId()`, which the example actually uses for the key.

## Could I do what the page is for after one reading?

Partly. I could copy the PostgreSQL example, change the model and field names, point `prisma.config.ts` at it, and run `npx prisma contract emit`. That is real, and it is the page's main job.

I could not write a contract for my actual application. I would still not know:

- what to type for an integer, boolean, decimal, plain date, or binary field — the majority of my columns;
- how to write a many-to-many relation, which every app of mine has;
- how to add a non-unique or multi-column index;
- how to write a composite primary key;
- where `extensions` goes in `prisma.config.ts`, or what the `/control` import line is;
- whether I must declare foreign key constraints by hand or only when I want to name them;
- what a `codecId` is, or where to find valid values, even though I must type one for every enum;
- whether `.sql()` works on a model with no relations;
- how to move my existing `schema.prisma` over, other than asking an agent.

The page reads as a tour of the builder's design. It is not yet something I can write a real contract from without a second, longer reference next to it — and it does not link to one.