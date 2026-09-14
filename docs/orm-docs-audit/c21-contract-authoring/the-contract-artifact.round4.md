Read once, top to bottom, as someone coming from `schema.prisma` in Prisma 7.

## Sentences I could not restate after one reading

1. **"`prisma db sign` records in the database which contract it matches."** (line 16)
   What stopped me: I cannot tell what "it" is — the database or the contract. Plainest wording I'd have understood: "`prisma db sign` writes the current contract's hashes into the database, so later commands can tell which contract that database was built for."

2. **"Each file starts with a notice that says exactly this."** (line 16)
   "This" points back at three sentences ("Both files are generated. Do not edit them. Change the source and re-run emit."). I had to guess which one is in the file header. Plainer: "Both files begin with a comment saying they are generated and must not be edited."

3. **"Applying a migration records which contract the database now matches, so you do not sign it yourself afterwards. … `npx prisma db verify` tells you whether anything recorded it."** (line 25)
   Two problems. "which contract the database now matches" is the same tangled phrasing as above. Then "whether anything recorded it" — "it" has no clear referent at all, and "anything" is so vague I had to invent a meaning ("whether any command has ever written the marker row"). Plainer: "`prisma db verify` reports whether any command has written that record yet."

4. **The whole of line 25 as one paragraph.** It names five commands (`db migrate`, `db init`, `db verify`, `db sign`, `contract infer`) and three separate rules in four sentences. I could not hold it after one pass. It needs to be a short list: normally signing happens for you; you only sign by hand after `contract infer`.

5. **"The key is the table name, and its value names the model that table stores."** (line 97)
   The example has key `"user"` and value `{"model": "User"}`. Table name and lowercased model name are identical here, so the example cannot tell me which rule is true. If my table were `users` I would not know what the key becomes.

6. **"Each scalar field in `domain` records whether it is nullable and its type id, such as `pg/text@1`, which is the PostgreSQL type plus a version."** (line 98)
   The JSON calls this field `codecId`, not "type id", and the same column also carries `"nativeType": "text"`. I could not work out how `codecId` and `nativeType` differ, or what the `@1` version belongs to — the PostgreSQL type, or Prisma's handling of it?

7. **"One type per hash, such as `StorageHash` and `ProfileHash`. The hash string is part of the type."** (line 106)
   "Part of the type" is doing a lot of work. From the excerpt I guessed it means the hash is a string literal type argument, so two mismatched files stop compiling. The page never says that, and never says why I should care.

8. **"Both files come from the one `npx prisma contract emit` run, so they only drift when someone commits one and not the other. When that happens, TypeScript catches it before `prisma db verify` has to."** (line 116)
   I cannot restate *how* TypeScript catches it. I had to connect it back to point 7 myself.

9. **"The client can only warn or skip this check."** (line 136)
   "Skip" how? By my choice or by itself? The link to `verifyMarker` suggests I control it, but this sentence reads as a statement about behaviour, not an option.

10. **"Keep the `.d` in the import path."** (line 134)
    No reason given. It looks like a typo, and my instinct on first read was to delete it. Tell me it will break otherwise.

## Words and phrases I had to guess

- **"PSL"** (line 9) — never expanded anywhere on the page. Guessed: Prisma Schema Language, the `schema.prisma` syntax I already know.
- **"contract"** as a noun — guessed: the new name for my schema. The page leans on a link rather than one sentence of definition, and "contract" also shows up as `prisma_contract.marker`, `CONTRACT.MARKER_MISMATCH`, `contract emit`, `contract infer`, so I was guessing whether these are the same thing.
- **"artifact"** (metaTitle, URL) — never used in the body. Guessed: the two generated files.
- **"codecId"** — guessed: an id for the code that converts a database value to a JavaScript value.
- **"profileHash" / "which database the contract targets"** — "profile" appears nowhere else. Guessed: a fingerprint of the target database and its feature set. I could not tell whether a "profile" is something I write.
- **"namespace"** — the page says "On PostgreSQL the namespace is the schema", which helped, but then `namespaceId` appears in the JSON and I guessed it is the same value again.
- **"the adapter for your database"** (line 99) — never introduced. Guessed: the `@prisma/orm-postgres` package in `db.ts`.
- **"roots"** — guessed from the sentence alone; the name itself gave me nothing.
- **"marker"** — guessed: the row recording which contract the database matches.
- **"extension types"** (line 99) — link text only, no clue what an extension type is.

## Places I asked "so what do I actually type?" and got no answer

- **Choosing PSL or TypeScript.** Line 9 offers both and never says how I pick, or whether `prisma orm init` asks me.
- **`prisma.config.ts`** (line 99). It appears once, holding an `extensions: [...]` array. It is not in the file table, not among the files `orm init` creates, and there is no example of its contents. I do not know whether I already have one.
- **Import attributes.** `import contractJson from "./contract.json" with { type: "json" };` requires particular `tsconfig` settings. The page shows the line but not the config that makes it compile. This is exactly where a Prisma 7 user will get stuck.
- **MongoDB.** Mentioned twice (lines 39, 96) but the only client example is `postgres<Contract>({...})`. If I am on MongoDB I do not know what to import.
- **Where the warnings go.** "it logs a warning whose `code` is `CONTRACT.MARKER_MISMATCH`" — to stdout? To a logger I configure? Nothing to type, nothing to grep for.
- **`FieldOutputTypes` / `FieldInputTypes`** (line 107). Listed as exports, with no example of importing or using them. Why are they in a "what you should know" list if I never type them?
- **Writing to another directory.** "To write the two files to another directory, see `prisma contract emit`." One flag name here would have saved a click.

## Places that explain the inside when I only wanted to know what to do

- **The whole "The same source always produces the same two files" section** (lines 27–29). Byte-for-byte determinism is a property of the tool. The only actionable part is the one clause about not reading env, clock, or random values, and that is itself deferred to another page.
- **"`npx prisma db sign` … records `storageHash` and `profileHash` in a table it creates called `prisma_contract.marker`."** (line 35) I am immediately told "You never write to that table yourself," which raises the question of why I was told the table name.
- **"Migration tooling compares `storage` between two contract versions."** (line 98) Internal mechanics.
- **Three separate "you never do this yourself" sentences** (lines 33, 35, 116). Each one describes machinery and then tells me to ignore it.

## Could I do what the page is for, after one reading?

Partly. I came away able to say what the two files are, that they are generated, that I commit them, and what my edit-emit-plan-migrate loop looks like. Lines 18–23 and the "Version control" section are the parts I could act on straight away.

What I would still not know:

- When I am supposed to run `prisma db sign` by hand. I read line 25 twice and still could not state the rule.
- What to do the first time I see `CONTRACT.MARKER_MISMATCH` locally, as opposed to "in production".
- Whether `contract.d.ts` being a `.d.ts` means I need any tsconfig change, and what makes `import ... with { type: "json" }` work in my project.
- What `prisma.config.ts` is, whether I have one, and what goes in it.
- Whether the `roots` key follows my table name or my model name.
- What a "codec" is, and why a column carries both `codecId` and `nativeType`.

One more thing: the page tells me the contract "replaces the `schema.prisma` of Prisma ORM 7" and then never returns to Prisma 7 again. Coming from two years of `schema.prisma`, the single biggest unanswered question is that `schema.prisma` was the file I edited *and* the file the tooling read, whereas here those are three different files. The page shows me that structure but never says it.