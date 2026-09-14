Read once, top to bottom, as a Prisma 6 user who has never seen this version.

## Sentences I could not restate after one reading

**Line 9:** "Your contract, [the one description of your data and how it is stored](/orm/contract-authoring/the-data-contract), is one source file"

"the one description" stopped me. I could not tell if "one" means "single" or is the start of a phrase like "the one that...". Plainest version: "Your contract is a single file that describes your data and how it is stored."

**Line 25:** "Applying a migration records which contract the database now matches, so you do not sign it yourself afterwards."

Two problems. "Records" where? Nothing has told me yet that there is a table anywhere. And "sign" has not been defined at this point — it first appears as a bare command name in the table on line 13. I only learned what signing is twelve lines later, on line 37. Plainest version, if it moved after the hashes section: "Migrations write the marker row for you. Only run `prisma db sign` when the database already matches the contract but no marker row exists."

**Line 35:** "`executionHash` covers the defaults Prisma ORM applies before a write."

I can restate the words but not the point. Line 37 then says signing records `storageHash` and `profileHash`. So `executionHash` is described and never used. I finished the page not knowing what reads it or what breaks when it changes.

**Line 110:** "This is the section the migration tooling compares between versions and `prisma db verify` checks the live schema against."

Two subjects, two verbs, and a dangling "against" at the end. I had to re-read to work out that `db verify` compares this section to the live schema. Plainest version: "Migration tooling compares this section between two contract versions. `prisma db verify` compares it to the live database."

**Line 120 and 137:** "One type per hash, such as `StorageHash` and `ProfileHash`. The hash string is part of the type." / "If you regenerate `contract.json` and not `contract.d.ts`, TypeScript catches it before `prisma db verify` has to."

I cannot picture how this works. Both files come out of one command. How do I ever end up with one regenerated and not the other? And what does TypeScript actually compare the hash type against, given the `.json` is plain data? The page states the outcome and skips the only part I would need to believe it.

**Line 155:** "The import path `./contract.d` is written that way on purpose. It is not a typo, and TypeScript resolves it to `contract.d.ts`."

I believe you, but "on purpose" for what purpose? The sentence defends the spelling without saying why the ordinary `./contract` does not work. If I tidy it up later, I will not know what I broke.

## Words and phrases I had to guess

- **"contract"** — guessed: the new name for `schema.prisma`. The page never says so plainly, and I am a reader coming from the old version who needs that one line.
- **"profile"** in `profileHash` — guessed: the database target, from "covers which database the contract targets". But "profile" appears nowhere else, so I do not know what the noun refers to.
- **"codecId"**, `pg/text@1` — guessed: an identifier for the type-conversion code, with a version number. Line 109 says "the PostgreSQL type plus a version", which does not explain the word "codec".
- **"marker"**, `prisma_contract.marker` — guessed: a one-row bookkeeping table recording which contract the database matches.
- **"sign"** — guessed: write that marker row. Confirmed only at line 37, long after first use.
- **"extension pack"** (line 112, 113) — guessed: an npm package that adds database types. Never defined here, and the link is labelled "extension types", which is a different phrase.
- **"roots"** — guessed: the entry points of the client API. The key/value direction ("Each key is the table name, and its value names the model") took two readings against the JSON.
- **`StorageHashBase`, `ProfileHashBase`, `CodecTypes`** (lines 126–131) — appear in the example code and are not in the list of exports above them. I guessed they are internal types I never touch.
- **`prisma contract infer`** (line 25) — guessed: the replacement for `prisma db pull`.
- **"targetFamily": "sql"** — guessed from the bullet, fine.

## Places I asked "so what do I actually type?"

1. **How do I get a `contract.prisma` at all?** Line 9 assumes it exists. Line 9 says `prisma orm init` writes `db.ts`. Line 168 says `npm create prisma@latest`. Line 168 also says `npx prisma skills sync`. Three commands, no statement of which one starts a project.
2. **`DATABASE_URL`** (line 155): "The connection string comes from the `DATABASE_URL` environment variable." The code imports `dotenv/config`, so presumably a `.env` file. The page never says to create one or what goes in it.
3. **The JSON import** (line 147): `import contractJson from "./contract.json" with { type: "json" }`. That syntax needs specific `tsconfig.json` and Node settings. If it fails to compile, this page gives me nothing. It is generated code, but the page is the one showing it to me.
4. **`namespace auth { }`** (line 41): mentioned in a subordinate clause with no example and no link to a fuller example.
5. **`extensions: [...]` in `prisma.config.ts`** (line 112): named twice, never shown.
6. **"Run `npx prisma db sign` only when the database already matches the contract and nothing recorded it"** (line 25): how do I check whether anything recorded it? `db verify`, presumably, but the page does not say to run it first.
7. **Making the startup check fail instead of warn** (line 155): "Run `prisma db verify` when you need the check to fail instead." That is a separate CLI command, not something my app can do at boot. Is there an option on `postgres<Contract>({...})` for this? Not said either way.
8. **`AddressInput` / `AddressOutput` and `FieldInputTypes` / `FieldOutputTypes`** (lines 121–122): I am told they exist and what they hold. Not one line of code using them.

## Places that explain the internals when I only wanted to know what to do

- **The whole "Inside `contract.json`" section** (lines 39–113), about 75 lines, for a file that line 16 tells me never to edit. I read a field-by-field walkthrough of a generated file before I was told anything about writing one.
- **"The same source always produces the same two files"** (lines 27–31). Byte-for-byte reproducibility is a property of the tool. The one thing here I can act on — do not read env vars, the clock, or randomness in your contract file — is a single sentence buried in the middle, and it is punted to another page.
- **"The content hashes"** (lines 33–37) opens with "You never compute or compare them yourself" and then spends three sentences describing what each one covers. If I never touch them, tell me the one fact I need: a mismatch means the database and the contract disagree, and here is how to fix it.
- **`schemaVersion`, `codecId`, `roots`, the `domain`/`storage` split** — all file-format internals.
- **Line 108** drops two entire query APIs (`db.sql.public.user` and `db.orm.public.User`) inside a bullet about a JSON key. That is a major thing to learn about, introduced as a footnote to something I do not need.

## Could I do what the page is for after one reading?

Partly.

I can do the loop on lines 18–23: edit the source, run `npx prisma contract emit`, run `migration plan`, read it, `db migrate`, and `db verify` in CI. I can commit both files and add the two-line CI check on lines 162–163. That part is clear and I would get it right.

What I would still not know:

- What a contract actually is compared to the `schema.prisma` I have used for two years. The page assumes I already know.
- When I need `prisma db sign` in real life. The one example given is "after `prisma contract infer`", and I do not know what that command does either.
- What `executionHash` is for.
- How to write anything in the source files. This page is entirely about the output.
- What to do when `CONTRACT.MARKER_MISMATCH` shows up in my production logs. The page tells me it warns and keeps going, which sounds like something I should act on, and then sends me to a CLI command I cannot run from inside my app.
- Whether `contract.d.ts` can ever actually get out of sync with `contract.json`, given one command writes both.