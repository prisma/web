# Reader report: `orm init` exit codes, `migration ref`, and `contract emit` JSON output

I read the three sections as a Prisma ORM 7 user who is writing Prisma 8 CI scripts. I read nothing else and edited nothing.

## 1. Sentences I could not restate after one reading

**migration-ref, intro paragraph 2**
> "The contract a ref points at must already be part of the on-disk migration graph, which is why `migration ref set` does not accept `@db`: that token stands for the live database's marker, and the offline commands never read one."

- This one sentence brings in four new terms: "on-disk migration graph", "`@db`", "token", and "the live database's marker".
- It explains why a value is refused before telling me the value exists.
- Plainer: "A ref can only point at a state that one of your migration folders produces. `migration ref set` does not connect to a database, so you cannot pass `@db` (the database's current state)."

**migration-ref, first sentence**
> "Use `migration ref` commands to manage named refs stored with your migration history."

- It defines "ref" with the word "ref". The next sentence helps ("maps a logical environment name … to a contract hash"), but "contract hash" is not defined on this page either.

**migration-ref, `db` ref bullet 1**
> "[`db init`] and [`db update`] update it when you run them without `--db`, so that the connection comes from `prisma.config.ts`. With `--db`, they leave it alone unless you also pass `--advance-ref db`."

- I had to read it twice.
- "so that the connection comes from" reads as if leaving out `--db` causes the connection to come from the config file. It actually describes the condition.
- Plainer: "If the connection comes from `prisma.config.ts` (no `--db` flag), these commands update the `db` ref. If you pass `--db`, they do not, unless you also pass `--advance-ref db`."

**migration-ref, `db` ref bullet 3**
> "updates it after an apply"

- "An apply" is used as a noun. Plainer: "after it applies migrations".

**migration-ref, subcommand table, `set` row**
> "`<dir>^` for that migration's source contract"

- I had to guess what "source contract" means. My guess is the state before that migration ran.
- Plainer: "the state the database was in before that migration".

**migration-ref, subcommand table, `list` row**
> "the invariants recorded against it"

- "Invariants" is never explained on this page. See section 2.

**migration-ref, "Data lines" section**
> "`invariants` lists, separated by commas, the ids of the data operations (their `invariantId`) that a migration to the ref must run."

- "Data operations", "invariantId", and "a migration to the ref" are all new.
- I cannot tell whether this field is something I must act on or just information.

**migration-ref, refusal table, `@db` row**
- The error code is `MIGRATION.HASH_NOT_IN_GRAPH`, but the cause given is "you passed `@db`".
- The code name and the cause do not match. When this code shows up in a CI log, I would not connect it to `@db`.

**migration-ref, refusal table, `@empty` row**
- `@empty` appears for the first time inside an error table. I learn that a value exists only by being told I cannot use it.

**contract-emit, JSON output section**
> "`storageHash` is the contract's hash, the value that migrations and refs name."

- "The value that migrations and refs name" is awkward.
- Plainer: "Refs and migrations identify a contract by this hash. Pass it to `migration ref set`."

**orm-init, row `5`**
> "Fix the contract where the output points"

- I don't know what "the contract" is as a file. Is it my schema file? The generated `contract.json`?
- "Where the output points" assumes a person is reading the output. In CI, nobody is.

## 2. Words and phrases I had to guess

| Phrase | My guess |
| --- | --- |
| "contract" (all three pages) | The Prisma 8 replacement for the generated client plus the schema snapshot. Never defined in what I read. |
| "contract emitted" / "emitting the contract" (orm-init) | Like `prisma generate` in Prisma 7. |
| "contract hash" | A hash of the schema state, like a migration checksum. |
| "a run without prompts" (orm-init, code 2) | A non-interactive run. I don't know if CI is detected automatically (no TTY, `CI=true`) or needs a flag. |
| "ref" | Like a git branch or tag: a name pointing at a schema state. |
| "migrations/app/refs/" | Is `app` a fixed folder name, my app's name, or something configurable? Unknown. |
| "on-disk migration graph" | The migration folders and the order between them. "Graph" suggests branches are possible, which Prisma 7 did not have. |
| "the live database's marker" | A table in the database recording which state it is at, like `_prisma_migrations`. |
| "`@db`", "`@empty`" | Special values standing for "what the database is at now" and "a blank database". |
| "sentinel" (in `REF_SET_EMPTY_SENTINEL`) | The same thing as `@empty`. |
| "`db sign`" / "a successful signature" | No idea. Maybe "mark the database as being at this state without running anything", like `migrate resolve --applied`. |
| "`--advance-ref <name>`" | Move the ref to whatever state the command just applied. |
| "invariants", "invariantId", "data operations" | Data migrations (not schema changes) that must run before a state counts as reached. |
| "data lines" | Machine-readable lines on standard output, as opposed to human messages (probably on standard error). |
| "logical environment name" | Just "environment name". The word "logical" adds nothing. |
| "envelope" (contract-emit) | A wrapper object around the result. |
| "`profileHash`" | No idea. Do I need it? Is it ever the hash I should store? |
| "step-started" / "step-finished" | Progress events I can ignore. |

## 3. "So what do I actually type?" and the text did not say

**orm-init**

- **How do I run it without prompts in CI?** Code 2 mentions "a run without prompts" but does not name the flag or say how it is detected.
- **Which flags are required in that mode?** Not listed in this section.
- **Code 4:** "Run the install command the output prints". In a script, which line is that, and on which stream? Is there `--json` with the command as a field? I can't hard-code `npm install` without knowing which package manager it picked.
- **Code 2 has three causes, and only two have an error code.** The "package.json or tsconfig.json cannot be read" case has none. Where does the error code appear: standard error, standard output, or JSON? Without that, I can't tell "fix your flags" apart from "your repo is broken".
- **Codes 1 and 3 are missing.** Does an unexpected crash exit 1? Can 3 happen?
- **What happens if I re-run `orm init` after a 4 or 5?** The files already exist. Does it overwrite them, refuse, or exit 2?
- **What happens in a project that is already set up?**

**migration-ref**

- **Where do I get `4cb4256` in the Usage example?** This page never says. I found out from the contract-emit page that `storageHash` is the value. Nothing links them.
- **How short can a hash prefix be?** What happens if a prefix matches two contracts?
- **Does `set` on an existing name overwrite it silently?** For a "safe" script, this is what I most need to know. Nothing says whether it refuses, warns, or overwrites. There is no "only if it currently points at X" option.
- **Exit codes for `delete`.** "Its exit code says whether the ref was deleted". Which codes? Only `2` is documented. I assume `0` means deleted.
- **Making `delete` idempotent in CI.** I need to treat "ref did not exist" as success. But `2` also covers other refusals, so I need the error code, and the `--json` output shape for `migration ref` is not shown anywhere ("`--json` carries the result" and nothing more).
- **`delete` with an invalid name.** Is that `INVALID_REF_NAME` too? The table only lists it for `set`.
- **Can I delete or overwrite the `db` ref?** What breaks if I do?
- **`list` with no refs.** Empty output and exit 0? Is an empty `invariants` field an empty string, so the line ends in a tab?
- **Commit after `set`/`delete`?** "Versioned with your migrations" implies I must commit the JSON file. It never says so directly.
- **Which commands take `--advance-ref`?** "A command that changes the database" leaves me to work out the list.

**contract-emit**

- **Which `ok` do I check?** There are two: `envelope.ok` and `envelope.result.ok`.
- **What does the result line look like on failure?** Is there still a `kind: "result"` line? Is `exitCode` non-zero? What is in `diagnostics`?
- **The `jq` one-liner hides failures.** Without `set -o pipefail` and `jq -e`, a failed emit makes `jq` print `null` and exit 0. My script would then run `migration ref set production null`. The page should show the safe version.
- **Can I read the hash without writing files, or without a database?** I want the hash in a CI check step that should not change the working tree.
- **Is every line on standard output JSON?** Could a warning or a package-manager message get mixed in? `jq` would choke on it.

## 4. Places that explain internals when I only wanted to know what to do

- **migration-ref, intro paragraph 2.** The whole "`@db` … marker … offline commands never read one" explanation. I only need to know that `@db` is not allowed here, and the table already says that.
- **Refusal table, "Why" column.** "The name is used as a file path under `migrations/app/refs/`" and "There is no file for it under `migrations/app/refs/`" describe how the tool is built. I'd rather have a "what to do" column: "Rename it", "Check `migration ref list`", "Pass a hash instead".
- **The `db` ref section.** It is the longest section and is mostly about which internal command moves which file when. My CI question is only "will `db migrate` in CI change my repo?" The answer ("Plain `db migrate` never touches it") is buried in the third bullet.
- **"Data lines", `invariants` field.** "The ids of the data operations (their `invariantId`)" describes the internal data model and gives me no action.
- **contract-emit.** The full example includes `timings`, `profileHash`, `nextActions`, and `commandId` twice, with no word on which fields matter. Only `storageHash`, `exitCode`, and `diagnostics` matter to a script.
- **Order of the migration-ref page.** The sentence that says why I'd use refs ("name the contract state an environment should match, instead of always applying up to the latest migration on disk") is the last paragraph. It should be the first.

## 5. Could I write the three scripts?

**A CI step that handles each `orm init` exit code: partly.**

- I can branch on 0, 2, 4, and 5.
- I would not know how to make the run non-interactive.
- I would not know what to do for exit 1 or 3, or for any other code.
- For 4, I would not know how to get the install command out of the output.
- For 2, I would not know where to read the error code to tell the three causes apart.
- I would not know whether re-running `init` after a 4 or 5 is safe.
- In practice, 4 and 5 would become "fail the job and let a human look".

**A script that sets and deletes refs safely: no, not safely.**

- I can call `set` and `delete` and fail on a non-zero exit.
- I would not know whether `set` overwrites an existing ref without warning, so I can't protect `production` from being moved by mistake.
- I can't make `delete` idempotent, because the refusal codes all share exit 2 and the `--json` shape for these commands is not documented.
- I would not know whether I must commit the changed `migrations/app/refs/*.json` files, though I'd guess yes.
- I would not know whether touching the `db` ref is safe.

**A script that reads the contract hash: yes, with my own fixes.**

- The `jq` line works when emit succeeds.
- I would add `set -o pipefail` and `jq -e`, and check that the hash is non-empty and 64 hex characters, because the page does not show the failure output.
- I would not know whether emit writes files or needs a database or network, so I can't safely run it in a read-only check step.
- I would not know what `profileHash` is, or whether I will ever need it instead of `storageHash`.
