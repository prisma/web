# Slice 14: CLI page additions (C17, part)

## Scope

The parts of C17 that no other open pull request touches:

- `cli/orm-init.mdx`: an "Exit codes" table (0, 2, 4, 5), each linked to the error reference.
- `cli/migration-ref.mdx`: the rules for ref names, and a table of each refusal with its code, exit code, and reason.
- `cli/contract-emit.mdx`: a "JSON output" section showing the result line and how to read the storage hash in a script.

## Out of scope

- `configuration.mdx`, `db-migrate.mdx`, and `db-update.mdx`: #8583 (another session's rc.21 sync) rewrites them. Their C17 items wait until it merges.
- `cli/index.mdx` (`@prisma/orm-toolchain`, `@prisma/orm-framework`): these packages are internal building blocks that users do not install, so the item is dropped.

## Done when

- Every exit code and refusal on the pages was produced with `prisma` 8.0.0-rc.28.
- A cold reader round and a fact re-check are recorded in `reviews/`.
- The checks (`check-plain.sh`, `check-ai-signs.sh`, `check-staccato.py`, cspell, `lint:links`) are clean on the changed text.
