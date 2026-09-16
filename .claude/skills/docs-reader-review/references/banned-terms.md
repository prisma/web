# Banned terms and their replacements

These words come from the source code and the release notes. Readers do not have them. Do not use them in prose. Where the reader needs the idea, the replacement is the idea. Code identifiers (`db.orm.public.User`, `contractJson`, an error code) are not prose and are not banned.

`scripts/check-plain.sh` enforces every row below except the ones marked "(unexplained)", which are allowed when the sentence that first uses them says what they mean; the reader review judges those. If a sentence genuinely defines a checked term in plain words, add `{/* plain-language:defined */}` to that line and the checker skips it. Use that marker rarely; if you reach for it twice on one page, the page is teaching internals.

| Do not write | Write |
| --- | --- |
| terminal, terminal call, terminal method | the call that runs the query (`.all()`, `.first()`, `.create(...)`) |
| codec | how the value is stored and read; or name the type |
| envelope, structured envelope, structured error | an error with a code (`RUNTIME.NO_ROWS`) |
| type position, "in type position" | written as the type (`VarChar(255)` instead of `@db.VarChar(255)`) |
| runtime (as a noun for the library) | the library your app imports; or `db` |
| release line, release cycle, runs ahead | released separately, on its own schedule |
| lane (SQL lane, raw lane) | the raw SQL API; the query builder |
| facade | the client; `postgres(...)` |
| junction model, join model | the model for the join table |
| plan, query plan | the query, before it runs; the built query |
| emit, emitted artifacts (unexplained) | `prisma contract emit` writes `contract.json` and `contract.d.ts` |
| signature, marker (unexplained) | the record in the database of which contract it matches |
| ref (unexplained) | a named pointer to a migration state; define on first use |
| capability | which database features the contract needs |
| buffers, buffered, materializes | loads every row into memory first |
| surface, API surface | the methods; the commands |
| lowered, lowering | turned into SQL |
| namespace-qualified, namespace coordinate | `db.orm.public.User` (`public` is the PostgreSQL schema) |
| reducer, refinement callback | a way to count or sum related records; a way to filter related records |
| dotted codes | a code such as `RUNTIME.NO_ROWS` |
| envelope config, CLI envelope | the config file |
| dev loop | while you are iterating |
| brownfield, greenfield | an existing database; a new project |
| deterministic | the same input always produces the same output |
| idempotent | safe to run more than once |
| topology, graph (for migrations, unexplained) | the chain of migrations |

Also banned as verbs and phrases: "unblocks", "surfaces", "carries", "wires up", "sits", "lives at" (write "is at"), "spells", "hands back", "rides on", "routes on", "keys on", "the shape" (unexplained), "story" (as in "the `DATABASE_URL` story").

## Migration vocabulary

Migrations invite movement metaphors: the database travels, the ref moves, the run goes forward. Readers do not picture a database moving. Say what changes, and what it ends up matching. The metaphor is fine where it carries meaning a literal sentence loses, such as a path through the migration graph, or "roll back", which is the name of the thing.

| Do not write | Write | Why |
| --- | --- | --- |
| `db migrate` moves your database from where it is to where you want it | `db migrate` applies the migrations you planned, until your database matches your contract | `db migrate` runs migration files. Only `db update` reconciles a database against the contract with no migration |
| moves the database to the contract state | applies migrations until the database matches the contract state | |
| move the database back to an earlier state | the database needs an earlier version of your contract | "roll back" stays: it is the name of the operation |
| the marker moves | `db migrate` updates the marker; the marker still records the last contract state applied | The marker is a record in the database, not a position |
| moves the `db` ref | points the `db` ref at that state; updates the `db` ref | A ref is a name for one contract state |
| the database is behind and has to catch up | the database is several contract states out of date | |
| it takes the shortest path to the contract state | it runs the fewest migrations that end at that state | Keep "path" where the page is about the graph itself |

`from` and `to` are field names in `migration.json`, so "starts `from`" and "ends at, `to`" are literal, not metaphors.

`scripts/check-plain.sh` enforces the database, marker and ref rows. "Database schema" is the ordinary term for the tables, columns and constraints, and stays allowed. It does not enforce "path", because the graph page uses that word correctly, or "the database is behind", because sample prompts quote a user's own words. The reader review judges those two.

## Sentence shapes to avoid

- A noun with three or more modifiers: "per-request cursor-enabled serverless facade".
- Three claims chained with "so" and "which"; split them.
- A caveat in parentheses in the middle of a sentence; make it its own sentence or cut it.
- Passive voice for what the reader does: "the version is pinned" becomes "lock the version".
- Starting with the mechanism: "Because emit is deterministic, hashing..." becomes what the reader sees happen.
- A table cell carrying more than one idea; move the extra ideas to a note under the table.

## Adding to this list

When a reader review reports a word it had to guess, add the word and its replacement here.
