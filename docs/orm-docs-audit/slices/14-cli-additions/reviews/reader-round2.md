# Reader review: `orm init` exit codes, `migration ref`, `contract emit` JSON output

I read only the three sections you named, as a Prisma 7 user scripting CI. Findings are ranked: the ones that would stop me writing the scripts come first.

## A. Problems that would stop me writing the scripts

1. **"contract" is never defined, but everything depends on it.**
   - Examples: "emitted the contract", "the contract state an environment should match", "contract hash", "contract reference".
   - I guessed it is the Prisma 8 replacement for the schema, written out as a compiled file. My guess comes from `contract.prisma` / `contract.ts` and `contract.json` / `contract.d.ts`.
   - On `migration-ref.mdx` the first sentence already needs this word. One clause would fix it, for example: "the contract (your schema, compiled to `contract.json`)".

2. **I can't tell whether `ref set` accepts a hash that has no migration yet.**
   - `migration-ref.mdx` says: "The hash of your current contract is the `storageHash` that `contract emit --json` prints." So I'd write `ref set production "$hash"`.
   - The error table then lists `MIGRATION.HASH_NOT_IN_GRAPH`, and the subcommand row says the contract must be "a hash or the start of one, another ref name, a migration directory name…".
   - If I changed the schema but haven't created a migration, is the new `storageHash` accepted, or refused with `REF_NOT_FOUND` or `HASH_NOT_IN_GRAPH`? This decides whether my "emit, then set" script works at all.
   - Plainest fix: "The hash must belong to one of your migrations. A contract you have emitted but not yet planned a migration for is refused with …"

3. **The `orm init` section never says what values the required flags take.**
   - "pass `--yes` with `--target` and `--authoring`". The only value example is an invalid one: "such as `--target mysql`".
   - So what do I actually type? I guessed `--target postgres` and `--authoring prisma|ts`, from the two file names. A guess is not enough for CI.

4. **The `orm init` command line is never shown in the section.**
   - The section says `orm init`, but its fix steps say `npx prisma contract emit`. I guessed `npx prisma orm init --yes --target … --authoring …`.
   - One full example line would remove the guess.

5. **`CLI.CONSENT_REQUIRED`: "it needs `--confirm` with the name of the directory you run it in."**
   - Does it want the base name (`myapp`) or the full path (`/home/ci/work/myapp`)?
   - Does `--confirm` replace `--yes`, or go with it? In CI, would I write `--confirm "$(basename "$PWD")"`?
   - This also means a CI step that runs `orm init` twice fails the second time. That is worth stating as plain advice.

6. **Exit codes 1 and 3 are missing from the `orm init` table.**
   - The table lists 0, 2, 4 and 5. What do 1 and 3 mean, and can they happen?
   - `CLI.UNEXPECTED` is filed under exit `2` ("It wrote nothing"). An "unexpected" error that is guaranteed to have written nothing is surprising.
   - What exit code does a real crash give? My CI `case` statement needs a default branch, and I don't know what it should mean.

7. **"The error code is at the start of the message". Which message, and on which stream?**
   - Is it stderr? What format: `CLI.INIT_MISSING_FLAGS: …` or `[CLI.INIT_MISSING_FLAGS] …`? I can't write a `grep` for it.
   - The same sentence appears on `migration-ref.mdx`.

8. **`migration ref --json` output shape is unclear.**
   - The page says "with `--json` it is in `envelope.error.code`". It does not say whether the output is one line, or many lines filtered by `kind == "result"` as with `contract emit`.
   - It also does not say what `set --json` puts in `envelope.result`. Do I use `select(.kind=="result")` here too?

9. **Exit 4 says "Run the install command it prints". In CI, how do I get that command?**
   - Is it on stderr, or in `envelope.nextActions` with `--json`? Is there a flag to skip the install so I can run my own package manager?
   - After I fix it, should I rerun `orm init`? If I do, item 5 says it will refuse with `CONSENT_REQUIRED`. The text should say "do not rerun `orm init`".

## B. Sentences I could not restate after one reading

- **"`set` with `@db`, the database's current state | `MIGRATION.HASH_NOT_IN_GRAPH` | Pass a hash or a migration directory name. These commands do not read the database."**
  - `@db` appears here for the first time. It is not in the list of contract reference forms in the subcommand table.
  - It is also easy to confuse with the "`db` ref" (no `@`), which has its own section. Are `db` and `@db` different things? I guessed yes: `db` is a file and `@db` is the live database.
  - The error code name (`HASH_NOT_IN_GRAPH`) doesn't match the cause.
  - Plainer: "`@db` means the live database. `migration ref` never reads the database, so it refuses `@db`."

- **"`set` with `@empty`, or with `<dir>^` for your first migration, which both mean an empty database | … | Point the ref at a migration, or delete it."**
  - Again, `@empty` is new here.
  - "or delete it" makes no sense when I am creating a new ref.
  - The text gives no reason why a ref can't mean an empty database.

- **"When you run `migration plan` without `--from`, it plans from the `db` ref, so as long as the ref is up to date, each plan contains only your latest change."**
  - I had to read this twice. It explains how planning works inside, which I don't need on a refs page. See section D.

- **"`db init` and `db update` update it when they take the connection from `prisma.config.ts`. When you pass `--db`, they update it only if you also pass `--advance-ref db`."**
  - I understood the rule. I did not understand what it means for CI.
  - If CI runs `db update` with the connection taken from `prisma.config.ts`, it changes a file in my repository. Is that right? The `db migrate` line spells this out ("a deploy or CI run leaves your repository unchanged"); these lines don't.

- **"`invariants` lists the ids of the data operations that migrating to the ref must run"**
  - I could not restate it. What is a "data operation"? Is an id a migration name? Should my script do anything with this field?

- **The success example has `"ok": true` twice, once in `envelope` and once in `envelope.result`.**
  - Can `envelope.ok` be `true` while `result.ok` is `false`? Which one should I check?

- **"standard output gets one JSON object per line"**
  - The example right below it is pretty-printed over many lines. I understood it, but a "shown formatted for reading" note would help.

## C. Words and phrases I had to guess

| Phrase | My guess |
| --- | --- |
| "contract" | Compiled schema |
| "emit" | Compile and write `contract.json` / `contract.d.ts` |
| "contract state" | A version of the schema |
| `db sign` | Like `migrate resolve`: mark the database as being at a state without migrating it |
| `--advance-ref` | Move the ref to the state just applied |
| `migrations/app/refs/` | Unknown. Why `app`? And how does "by default" get changed? |
| `staging/eu` | Probably the file `refs/staging/eu.json` |
| "graph" (in `HASH_NOT_IN_GRAPH`) | The chain of migrations |
| "sentinel" (in `REF_SET_EMPTY_SENTINEL`) | A special stand-in value |
| `profileHash` | Some other hash. Don't use it? |
| `storageHash` | The hash of the database part of the contract. "storage" is unexplained |
| `diagnostics`, `nextActions` | Warnings, and suggested commands |
| `--no-interactive` | Same as `--yes`? It appears only in the error table, never in the instruction sentence |
| `prisma-8.md` | Some generated notes file. Unexplained, though `orm init` overwrites it |
| `REF_NOT_FOUND` vs `UNKNOWN_REF` | Near-identical names for "contract reference matches nothing" on `set` and "ref doesn't exist" on `delete`. I had to reread to tell them apart |
| "the start of one" (hash prefix) | Unknown minimum length. What happens when two hashes share the prefix? |

## D. Places that explain how the tool works inside when I only wanted to know what to do

- **The whole "The db ref" section.** For CI I need one sentence: "`db migrate` never changes ref files unless you pass `--advance-ref`; `db init` and `db update` change the `db` ref unless you pass `--db`." The `migration plan` reasoning is detail about how the tool works inside.
- **`invariants` / "data operations"**: internal detail, with no instruction about what to do with it.
- **"These commands do not read the database"**, given as the fix in the `@db` row. That is a design explanation, not an action.
- **The `HASH_NOT_IN_GRAPH` and `REF_SET_EMPTY_SENTINEL` error names** show internal vocabulary that the page never explains.

## E. Places where I'd ask "so what do I actually type?"

- The `orm init` command line and flag values (items A3 and A4).
- The `--confirm` value (item A5).
- After exit 4 in CI: the install command (item A9).
- Commit or not: should CI commit ref files after `--advance-ref`? After `contract emit` writes `contract.json`, should CI check it in or regenerate it?
- How to point `migration ref` at a migrations folder that is not the default.
- A safe "set only if absent" or "set only if it points at X". `set` "replaces its target without asking". There's no flag for this, and the page doesn't say to use the same `list` check pattern.

## Smaller points

- **The safe-delete script swallows errors.** If `ref list` itself fails (wrong folder, bad config), `grep -q` sees nothing, the delete is skipped, and the script continues silently. `set -o pipefail` doesn't help, because the failure is inside an `if`.
- **The page never says whether `list` prints a header line or any non-data text on stdout.** It delegates this to the Global flags page, which I wasn't allowed to read. My `cut -f1 | grep -qx` depends on it.
- **The emit script: what if `npx` prints its own text on stdout**, such as "Need to install…"? Then `jq` fails to parse. Probably fine with a lockfile, but unstated.
- **Exit codes for `contract emit` and `migration ref` failures other than refusals** (exit 2) are not given. For example: a file write fails.

## Could I write the scripts?

- **CI step handling every `orm init` exit code: partly.** I can write `case $? in 0) ;; 2) fail ;; 4) install, then emit ;; 5) fail ;; *) fail ;; esac`. I would still not know:
  - the flag values for `--target` and `--authoring`;
  - the exact command;
  - the `--confirm` format;
  - how to read the install command in CI;
  - whether 1 or 3 can happen;
  - how to match the error code in the text output.

  So I'd have to run it and see.

- **Script to set and delete refs safely: delete yes, set no.**
  - Delete: the `list` and `grep` example works, apart from the swallowed-error problem above.
  - Set: I don't know whether a freshly emitted `storageHash` with no migration behind it is accepted. I also don't know whether `--json` needs `kind` filtering. And nothing protects against silently overwriting an existing ref.

- **Script to read the contract hash: yes.** The `jq -er 'select(.kind == "result") | .envelope.result.storageHash'` line is exactly what I needed. I would still not know:
  - whether `contract emit` needs a database or network;
  - whether CI should commit the files it writes;
  - whether that hash can be passed straight to `ref set` (item A2).
