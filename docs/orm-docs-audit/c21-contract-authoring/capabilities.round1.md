Read once, as a reader coming from Prisma 6 who has never seen this version.

## Sentences I could not restate after one reading

1. "The `capabilities` section of your contract, the `contract.prisma` file that replaced `schema.prisma`, records which features yours supports."
   Stopped me: the page then never shows `contract.prisma` again. Every example is `contract.json`. So is the `capabilities` section in the file I write, or the file the tool generates? Two paragraphs later the page says "You do not write this section yourself", which makes the `contract.prisma` mention look wrong. Plainer: "Prisma records the supported features in `contract.json`, a file the CLI generates."

2. "…while it does so it merges the declarations of every component composed in your project: the target (PostgreSQL, SQLite, MongoDB), its adapter, and any extension packs named in the config."
   Stopped me: four new nouns in one sentence — "declarations", "component", "composed", "target", "adapter", "extension packs" — plus "the config", which is not named until the following paragraph (`prisma.config.ts`). I cannot tell what a "component" is versus a "pack". Plainer: "Your database type, its driver, and any add-on packages each state which features they support. `prisma contract emit` collects all of those statements into `contract.json`."

3. "Because the packs declare the keys, adding or removing an extension in `prisma.config.ts` and running `npx prisma contract emit` again changes the set with no further work."
   Stopped me: "the set" of what — keys? packs? And "no further work" compared with what earlier workflow? I have no baseline.

4. "Query-builder methods that need a key read the contract's `capabilities` section and throw an error whose `code` is `ORM.CAPABILITY_MISSING`, naming the method and the key."
   Stopped me: one sentence carrying a mechanism, an error code, and the error's contents. Also "need a key" is odd phrasing — methods need a *feature*, not a key.

5. "MongoDB currently declares no keys: this mechanism mostly separates SQL targets and their extensions, and the MongoDB pipeline does not yet check features this way."
   Stopped me: "this mechanism mostly separates SQL targets and their extensions" — I cannot work out what "separates" means here. And "the MongoDB pipeline" is a piece of internal machinery I have never heard of. Plainer: "MongoDB declares no keys, so none of these checks apply to it."

6. "[`db verify`](/cli/db-verify) compares the database against the contract's schema and profile, using the hashes described in [the contract artifact](…#the-content-hashes)."
   Stopped me: "profile" appears here for the first and only time and is never explained. "the hashes" likewise. Plainer: "`db verify` checks the live database against your contract; capabilities are not part of that check."

7. "Projects created with `npm create prisma@latest` include the [Prisma ORM skills](…) for your coding agent; in an existing project, run `npx prisma skills sync`."
   Stopped me: three unexplained things (what a "skill" is, what it does, why my agent needs one) in a sentence appended to a page about database features.

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for the schema file, or maybe the whole set of generated files. Never actually defined on this page.
- **"target"** — guessed: the database engine. The parenthetical "(PostgreSQL, SQLite, MongoDB)" is the only reason I got there.
- **"adapter"** — guessed: the driver package, like `@prisma/adapter-pg` in v6.
- **"extension packs"** / "packs" / "extensions" — guessed: optional add-on npm packages. The page uses all three names for what I assume is one thing.
- **"composed" / "composing the pgvector pack"** — guessed: listed in config so it gets included.
- **"declarations" / "declares" / "reports"** — guessed: all mean "states that it supports". Three verbs, one idea.
- **"namespace"** — guessed: the top-level grouping key, `sql` or `postgres`.
- **"scalar list"** — guessed: a `String[]` field.
- **"profile"** — could not guess at all.
- **"the MongoDB pipeline"** — could not guess.
- **"diagnostic"** — guessed: a build error message. Why not say "error"?
- **"key"** — guessed: the name of one capability. But the page's title says "features", the section says "capabilities", and the table column says "Key". Three words for one thing, and I had to work that out myself.

## Where I asked "so what do I actually type?" and got nothing

1. **I hit `ORM.CAPABILITY_MISSING`. Now what?** The page shows the error and stops. Do I change the adapter, install a pack, rewrite the query, or edit something? This is the single most likely reason a reader lands here and the page does not answer it.
2. **I hit the `scalarList` build error on SQLite.** Same problem — the error text is shown, the fix is not. Remove the field? Switch targets?
3. **Can my own code check a capability before calling a method?** Nothing is shown. I do not know whether there is an API, or whether I am meant to read `contract.json` myself.
4. **How do I add pgvector?** The page says composing the pack "adds `pgvector.cosine`" and tells my *agent* to "Add pgvector to the project", but never shows me a line of `prisma.config.ts`, an install command, or a config key.
5. **Where does `contract.json` live?** "beside the source" — beside which source? The code block is captioned `prisma/contract.json`, but I had to infer that.
6. **`contract.d.ts` is emitted too.** Never mentioned again. What do I do with it?
7. **How do I see my full key list?** "Your project's emitted `contract.json` is the full list" — so, open the file? There is no `prisma contract` subcommand shown for printing it.

## Where the page explains the inside when I only wanted the outside

- "the keys are checked at two points" plus "Query-builder methods that need a key read the contract's `capabilities` section" — I wanted to know what breaks and how to fix it, not where the lookup happens.
- "They are recorded in the contract when you run `npx prisma contract emit` rather than read from the live database, so the same contract behaves identically in every environment." The last clause is useful. The mechanism before it is not what I asked.
- "using the hashes described in [the contract artifact]" — pure internals in a paragraph whose point is "verification is a different thing".
- "this mechanism mostly separates SQL targets and their extensions" — architecture, not instruction.
- The whole `sql` versus `postgres` namespace explanation is background. What I needed was: how do I find the key a failing method wants?

## Could I do what the page is for, after one reading?

Partly. I understand that Prisma now records supported features and fails early. That is the page's stated purpose, and it lands.

What I still could not do:

- Fix either of the two errors the page shows me. It tells me what the error means and not one word about what to change.
- Add or remove an extension pack, despite the page claiming that is easy. I have never seen the config syntax.
- Explain what a "contract" is, or reconcile `contract.prisma` with `contract.json`. The one sentence defining the contract contradicts the section right after it.
- Say what "profile" means, or what `db verify` actually compares.
- Tell whether `capabilities` is something I ever edit. I believe not, but the opening sentence says it is "of your contract, the `contract.prisma` file", which reads like it is mine.

Concrete gap, ranked: the page is a description of a mechanism, not a page a stuck reader can act on. Two error messages are quoted and neither has a remedy.