# Fact check

I made one correction, in `migration-ref.mdx`. Every other claim in the three sections matched what `prisma@latest` (8.0.0-rc.28) actually does, except `orm init` exit code `0`, which I could not reproduce.

## Corrected

| Claim | Source | New text |
| --- | --- | --- |
| `migration-ref.mdx`, "Ref names": the allowed characters plus "no `.` or `..` segment" make a valid name. | Running `migration ref set` with each name. `/x`, `x/`, `a//b`, `x-`, `a-/b` and `a/-b` all fail with `MIGRATION.INVALID_REF_NAME`, exit 2. `-- -x` fails the same way; without the `--`, `-x` is read as a flag. `1x` and `a--b` are accepted. | Added after the existing sentence: "Each part between slashes must also start and end with a letter or digit, so `/x`, `x-`, and `a//b` are refused." |

## Confirmed

**`orm init` exit codes.** Each run used a new folder under `wip/slice-14/`.
- **Exit 2, no flags:** `--yes` alone gave `CLI.INIT_MISSING_FLAGS` and wrote nothing.
- **Exit 2, bad target:** `--target mysql` gave `CLI.INIT_INVALID_FLAG_VALUE` and wrote nothing.
- **Exit 2, unreadable files:** each case wrote nothing and left the bad file unchanged.
  - A `package.json` that is not valid JSON gave `CLI.INIT_INVALID_MANIFEST`.
  - A `package.json` with no read permission gave `CLI.UNEXPECTED` (EACCES).
  - A `tsconfig.json` that is not valid JSON gave `CLI.INIT_INVALID_TSCONFIG`.
  - A `tsconfig.json` with no read permission gave `CLI.UNEXPECTED` (EACCES).
- **Exit 4:** with an unreachable registry, init wrote the files and gave `CLI.INIT_INSTALL_FAILED`. It printed the install command, then a step to emit the contract. I had to run the cached `prisma` binary directly here, because `npx` cannot resolve `@latest` when the registry is down.
- **Exit 5:** with `--authoring psl`, init wrote the files, installed the dependencies, then gave `CLI.INIT_EMIT_FAILED`.

**`migration ref`.** I ran it in `wip/slice-13/search`.
- `staging`, `prod-2` and `staging/eu` are accepted. `Prod`, `prod_2`, `release.1`, `a/../b`, `./x` and `a/./b` are refused.
- Each refusal in the table returned the documented code and exit 2: `nomatch` gives `REF_NOT_FOUND`, `@db` gives `HASH_NOT_IN_GRAPH`, `@empty` gives `REF_SET_EMPTY_SENTINEL`, and deleting a missing ref gives `UNKNOWN_REF`.
- Refusals changed nothing. An existing ref kept its hash, and no new file was created.
- `@db` resolves to an empty hash, which matches "never read".
- `nomatch^` also gives `REF_NOT_FOUND`. The table's "Why" column does not mention the `<dir>^` form, but it is not wrong, so I left it.

**`contract emit --json`.**
- The output has `step-started` and `step-finished` lines, then a `result` line. Its fields match the sample exactly.
- `storageHash` equals the hash in `refs/db.json`.
- The `jq` command prints that hash.

**Error reference.** Every linked anchor exists in `orm/reference/error-reference.mdx`, and each entry agrees with the exit code the page gives.

**Cleanup.** I deleted every folder and output file I created. `migrations/app/refs/` again holds only `db.json`. Running emit rewrote `search/src/prisma/contract.*`, but the hash is unchanged. Other agents' folders in `wip/slice-14/` were not touched.

## Q

- **`orm init` exit `0`** ("The project was set up and the contract emitted"): I could not produce it. Both `--authoring psl` and `--authoring typescript` end in exit 5 today, because of the known starter-contract problem. The TypeScript starter fails with `CONTRACT.FIELD_HELPER_UNKNOWN` (`field.id.uuidv7String`), so the problem also affects that starter. I left the row as written.
