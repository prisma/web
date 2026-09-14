I read the page once, top to bottom, as someone who used Prisma 6 for two years and has never seen this version.

## Sentences I could not restate after one reading

**1. Line 9 (the opening paragraph).** Six ideas in one block, and it names four things I have never heard of before it explains any of them:

> "[`npx prisma contract emit`](/cli/contract-emit) writes `contract.json` and `contract.d.ts` beside your [contract](/orm/contract-authoring/the-data-contract) source file."

What stopped me: "contract" — I do not know what that is. In the version I know, I write `schema.prisma` and run `prisma generate`. Is the contract the schema renamed? Is it something extra? The link tells me to go read another page, which means this page does not stand on its own. Plainest wording I would have understood: one sentence saying "A contract is the new name for your schema file" or "A contract is X, and it replaces Y."

**2. Line 13.**

> "Three things each say which features they support: your database (PostgreSQL, SQLite, or MongoDB), its driver package, and any extension packages listed in `prisma.config.ts`."

What stopped me: "its driver package." I do not know what package that is or where I chose it. The config example below imports `@prisma/orm-postgres/config` — is that the driver package? The page never says. Plainest wording: "your driver package (for example `@prisma/orm-postgres`)".

**3. Line 13, second half.**

> "collects all of those answers into `contract.json`, grouped by prefix"

What stopped me: "grouped by prefix" does not match what I then see. The JSON shows a key `"pgvector.cosine"` nested inside `"postgres"`. The table later calls the same thing `postgres.pgvector.cosine`. Nobody tells me that the written form of a key joins the group and the key with a dot. I had to work that out by comparing two code blocks. Plainest wording: "Keys are written group-first: the `cosine` key inside `postgres` is written `postgres.pgvector.cosine`."

**4. Lines 49-51 (the error text).**

> "target "sqlite" does not support scalar lists (the adapter does not report the "scalarList" capability)."

Two words stopped me. "target" appears nowhere else on the page — everywhere else the page says "database." Is a target a thing I set somewhere? "adapter" also appears nowhere else. Is an adapter the driver package from line 13, or a third thing? I now have three possible names for what might be one thing: driver package, adapter, target.

**5. Line 63.**

> "The error is raised when your code builds the query, so a test that builds the query catches it."

What stopped me: I do not know what "builds the query" means as code I write. In the version I know, `db.user.findMany()` returns a promise and nothing happens until I await it. Does "builds" mean the call itself throws before I await? Does it mean there is a separate build step? The sentence tells me a test catches it but not what the test looks like.

**6. Line 85.**

> "[`db verify`](/cli/db-verify) compares the database against your contract, using the recorded hashes described in [contract.json and contract.d.ts](/orm/contract-authoring/the-contract-artifact#the-content-hashes)."

What stopped me: "recorded hashes." I did not ask how the comparison is implemented, and this clause does not change anything I would do. Cut it.

**7. Line 81.**

> "MongoDB has no keys at all, so none of these checks apply to it."

This contradicts the rule the page just taught me. The rule was: a missing key means the feature fails early. If MongoDB has no keys, then by that rule every feature should fail on MongoDB. Instead the page says the checks are skipped. I cannot tell from one reading what actually happens if I call `lateralJoin()` on MongoDB.

## Words and phrases I had to guess at

- **"contract"** — guessed: the new name for `schema.prisma`. Not confirmed anywhere on this page.
- **"vector distance operations"** (line 9) — guessed: similarity search for embeddings. Probably right, but it is the third item in a list where the first two are plain SQL, so it reads like I should already know it.
- **"driver package"** (line 13) — guessed: `@prisma/orm-postgres`.
- **"adapter"** (line 50) — guessed: the same thing as the driver package.
- **"target"** (line 49) — guessed: the database engine, set somewhere in the contract file.
- **`/control`** in `import pgvector from "@prisma/orm-extension-pgvector/control"` (line 34) — guessed: a required subpath for config-time imports. I would have typed the bare package name and got it wrong.
- **`defineConfig as ormConfig`** (line 35) — guessed: a rename to avoid clashing with the outer `definePrismaConfig`. The rename is never mentioned, so it looks like `ormConfig` is a real exported name.
- **`db`** (line 65) — guessed: my instantiated client. Never introduced on this page.
- **`?.`** in `db.contract.capabilities.sql?.lateral` — guessed: the whole `sql` group can be absent, not just the key. The page never says a group may be missing entirely.

## "So what do I actually type?"

**1. Line 54.**

> "remove the list field, or point the contract at a database that supports list fields, such as PostgreSQL."

How do I point the contract at a different database? Which file, which line, which field? The page shows me `contract: "./src/prisma/contract.prisma"` in the config but never shows the place where the database is chosen. This is the one action the page asks me to take and it does not show the edit.

**2. Line 30.**

> "then list it in `prisma.config.ts`"

The example below shows a complete config with `extensions: [pgvector]`. But my existing config almost certainly does not have an `extensions` key yet, and I have to reverse-engineer the diff from a full file. Show the two added lines, not a whole file.

**3. Line 63.**

> "Rewrite the query without it"

Rewrite it as what? For `lateralJoin()` and `distinctOn()` there is presumably a fallback shape. The page does not show one, so the advice is "do something else" with no second option.

**4. Line 63.**

> "a test that builds the query catches it"

No test is shown. I would want three lines of code.

**5. Line 79.**

> "Open your project's `contract.json` to see every key your setup supports."

No path given here. It is on line 15 in a code block title (`src/prisma/contract.json`), thirty lines earlier, and line 9 says "beside your contract source file," which is a different answer. Say the path once, here.

## Places the page explains internals when I wanted instructions

- **Line 44:** "Prisma ORM checks the keys twice, both times before any SQL reaches the database." The "twice" framing is about the tool's internal sequencing. What I need is: here are two errors you may see, here is what each means. The page does then give exactly that, so the framing sentence is the only part that is about the machine rather than about me.
- **Line 85, the whole section.** "The keys say what your installed software supports. They are recorded when you run `npx prisma contract emit`, not read from the live database, so the same contract behaves the same way in every environment." This is an explanation of a design decision. The only part I can act on is: if you want to check the real database, run `db verify`. The "recorded hashes" clause is pure internals.
- **Line 30:** "Keys under `sql` are shared across SQL databases. Keys under `postgres` belong to PostgreSQL only." This is taxonomy, not action. It is short enough to survive, but it is the answer to "how is the file organised," which I did not ask.

## Could I do what the page is for, after one reading?

No, because I cannot tell what the page is for.

Line 9 tells me "you never edit it." So the page is not a task. It appears to be a reference for two error messages. If that is the purpose, it is buried: the errors are in the middle, under a heading called "What the `capabilities` section controls," which does not say "errors."

What I would still not know after one reading:

1. **What a contract is.** Everything on this page hangs off that word and the page does not define it. I would have to leave and read another page before this one makes sense.
2. **How to change the database my contract targets** — the fix the page recommends on line 54.
3. **Whether "driver package," "adapter," and "target" are one thing or three.**
4. **What happens on MongoDB.** The page says checks do not apply, but the stated rule says they should all fail.
5. **What a query "building" is in code**, and therefore what the test on line 63 looks like.
6. **Where to find the full key list** for a database I am considering but have not installed. The page says to open my own `contract.json`, which only tells me about the setup I already have. If I am deciding whether to switch from SQLite to PostgreSQL, that does not help.

One thing that did work on first reading: the two error blocks on lines 48-52 and 58-61 are literal text I can paste into a search box, and the sentence "That message means the method is not available on the database you are connected to" is a plain restatement I understood immediately. That sentence is the model for how the rest of the page should read.