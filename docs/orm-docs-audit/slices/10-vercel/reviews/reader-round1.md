# Reader round 1 (2026-10-28, Opus, Prisma ORM 7 reader persona)

## `guides/deployment/vercel.mdx`

- "Contract files" never defined, and not connected to `schema.prisma` or `prisma generate`; whether to remove `prisma generate` from `postinstall` not said.
- "the client in `src/prisma/db.ts`" assumes the template's path.
- The paragraph saying the final deploy was not run reads like a test log and lowers trust.
- The Marketplace note packs several ideas; "point `db.ts` at it" gives no code.
- "contract space", "plan a migration" with no command, `--to` with no value, `$PRODUCTION_DIRECT_URL` never set.
- The reason not to migrate in the build takes two reads.
- No answer for databases other than Prisma Postgres.
- Step 5: when it is needed, how to keep the Prisma Compute code, and which "script" closes the client.
- "refs" in Next steps undefined.

## Docker guide 1.4 and the `close()` reference

- "a query names the schema": wrong subject.
- `db.close()` never said to replace `$disconnect()`.
- Only `SIGTERM` handled; Ctrl+C sends `SIGINT`.
- Whether `SIGTERM` reaches Node.js depends on how the container starts the process.
- "exits by itself" holds only if nothing else is open.
- Reference: "safe to call at any time" contradicts "never in a request handler"; "fails once" is unclear; that a closed client cannot be reused is hidden.
- Common gotchas: the lockfile sentence packs three ideas.

## What changed

Every point above was rewritten. Facts checked by running them: `prisma generate` fails with `CLI.UNKNOWN_COMMAND` on rc.27; `close()` twice succeeds; every query after `close()` fails with `DRIVER.NOT_CONNECTED` (`Postgres client is closed`); one handler on `SIGTERM` and `SIGINT` exits the process after a keep-alive request; `docker stop` on `CMD ["sh", "-c", "npm run pre && npm start"]` delivers `SIGTERM` to Node.js on `node:24-alpine`. The test-log paragraph moved to the pull request description. Not changed: Docker image size advice (outside this slice).
