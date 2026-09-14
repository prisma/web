Read once, top to bottom, as a Prisma 6 user who has never seen this version.

## Sentences I could not restate after one reading

1. Line 9 (the whole opening paragraph). It carries six separate ideas in one block: contracts replaced `schema.prisma`; databases differ; `contract emit` writes two files; there is a `capabilities` section; you must not edit it; errors name a "key". By the third sentence I had lost the thread. Plainest version: split it. "Your contract file `contract.prisma` replaces `schema.prisma`. Running `npx prisma contract emit` produces `contract.json`. One part of that file, `capabilities`, lists the database features you can use. Prisma writes it; you never edit it."

2. Line 13: "Three things each say which features they support: your database, your database package, and any extension packages listed in `prisma.config.ts`." I read this as "emit connects to my database and asks it". Line 84 then says the opposite: "not read from the live database". I still do not know which is true. If the database's contribution is really "which database you named in config", say that.

3. Line 62: "The call throws as soon as you make it, so a test that calls it catches it." I cannot restate this. Throws as soon as you make it *instead of when?* I assume you mean it throws at the call and not when you await the query, but the page never says what the alternative was, so the sentence has no content for me.

4. Line 78: "PostgreSQL has all three `sql` keys above, and SQLite has none of them." Line 30 told me "Keys under `sql` are shared across SQL databases." SQLite is a SQL database. So either the group name does not mean what line 30 said, or this sentence is wrong. Plainest version: "The `sql` group holds keys that more than one SQL database may support. It does not mean every SQL database supports them."

5. Line 80: "The methods that need these keys exist only on the SQL query builder, and MongoDB does not have one, so nothing on MongoDB reads the `capabilities` section." This contradicts line 45, which says `contract emit` itself fails on a missing capability. Does emit skip that check on MongoDB? I cannot tell.

6. Line 84, first sentence: "The keys say what your installed software supports." "Installed software" is a new term for the same three things named in line 13. Third name for one concept.

## Words and phrases I had to guess

- **"your setup"** (lines 3, 9, 13, 78). Guessed: database + database package + extensions. Never defined, and it is the subject of the page's main claim.
- **"key"** (line 9, before any example). Guessed: a JSON property name. Confirmed only at line 15.
- **"target"** and **"adapter"** (error text, line 48). The page tells me both mean the database package, which is the fourth and fifth name for the same thing. I guessed right only because line 53 told me.
- **"query-builder method"** (line 55) and **"the SQL query builder"** (line 80). Guessed: some new API that is not `prisma.user.findMany()`. In Prisma 6 there was no query builder. The page assumes I know what this is and never links to it until the very end.
- **"/control"** in `@prisma/orm-extension-pgvector/control` (line 33). Guessed: a subpath export for config-time code. No idea why it is not the package root.
- **"built-in extension packages"** (line 68). Guessed: first-party packages that you nonetheless have to install. The phrase reads as self-contradictory.
- **"Checking the live database is a separate job"** (line 84). Guessed: "a different command does that".
- **"db"** (line 64). Guessed: the replacement for `PrismaClient`.

## "So what do I actually type?"

- **Line 13, "you choose it by the import in `prisma.config.ts`".** I am never shown `prisma.config.ts`. Not once, in full. The only two glimpses are a four-line fragment (lines 35–38) that starts mid-object with `orm: ormConfig({`, and a bare import path at line 53. I do not know what encloses `orm:`, so I do not know where to paste the pgvector lines.
- **Line 53, "switch to a database that supports list fields... change the import".** Changing one import does not move me from SQLite to PostgreSQL. I need a connection string, a running Postgres, and my data moved. The page implies a one-line fix. I would have tried it and been stuck.
- **Line 30, installing pgvector.** `npm install`, add two lines, re-emit. Nothing about the database side. pgvector is a PostgreSQL server extension. Do I need it installed in Postgres? Does `contract emit` fail or silently omit the key if it is not? This is the exact "so what do I actually type" gap that would cost me an afternoon.
- **Line 64, reading capabilities in my own code.** One expression, `db.contract.capabilities.sql?.lateral`, and no surrounding code. I wanted a small working example: check the key, run the fast query, otherwise fall back. Also, `?.` returns `undefined` when the group is missing, not `false`. The page says it "is `true` when lateral joins are available" and stops there, so I would have written `=== false` and got it wrong.
- **Line 55, the runtime error.** I am told `distinctOn()` throws. I am never shown how to call `distinctOn()` or where it lives. I cannot reproduce, and I cannot fix by example.
- **Line 88, the agent prompt** "Which keys does the `capabilities` section of our contract require". The `capabilities` section does not require keys; my code requires keys that the section may or may not list. The prompt as written asks a question that does not parse.

## Places that explain internals when I wanted instructions

- **The whole "Where the `capabilities` section comes from" section (lines 11–39).** The first half explains how the tool assembles a file I was just told I must never edit. As a reader my questions were "how do I know if I have a key" and "how do I get one I lack". The provenance story answers neither. The only actionable content is the pgvector install, which is buried at the end of a paragraph about key-naming.
- **Line 84, "so the same contract behaves the same way in every environment".** This is a design rationale. It does not tell me to do anything, and it arrives in the same paragraph as `db verify` and an extensions link, so three unrelated things share one paragraph.
- **Line 30, "A key is written group first."** A naming rule presented before I have any reason to write a key myself. I do not write keys; I read them in errors.

## Could I do what the page is for, after one reading?

Partly. If one of the two errors in the page landed in my terminal verbatim, I could act: remove the list field, or install the extension and re-emit. That is a real win and it is the page's strongest part.

What I still would not know:

- Whether `contract emit` talks to my live database. The page says both.
- What the SQL query builder is, or how to call `distinctOn()` / `lateralJoin()` at all. I cannot use, or avoid, a feature I do not know how to invoke.
- What a complete `prisma.config.ts` looks like, so I cannot apply the pgvector diff with confidence.
- Whether adding a pgvector key needs anything done inside PostgreSQL itself.
- What `db verify` actually checks, or whether it would catch a capability problem. The page says it is "a separate job" and links away.
- Whether any of this applies to MongoDB. Lines 45 and 80 disagree.

One more thing, blunt: the same concept is named five ways across this page — "your setup", "your database package", "target", "adapter", "installed software". Two of those come from error messages you do not control, but the prose adds three more on top.