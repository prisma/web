Read once, top to bottom, as a Prisma 7 user who has never seen this API.

## Sentences I could not restate after one reading

**Line 150** — "On a grouped query, `distinct()` and `distinctOn()` drop repeated rows from the groups you already have, which only matters when you select fewer columns than you grouped by."
Stopped by: I cannot picture the case. Grouping already makes one row per group, so "repeated rows" sounds impossible. "Select fewer columns than you grouped by" is a condition I have to reason out myself, and there is no example. Plainer: give the two-column group / one-column select example, or cut the sentence.

**Line 179** — "The value is generated when you call `build()`, so build once and run once. Running the same built insert twice inserts the same generated value twice. Build it again for a new one."
Stopped by: three ideas and an apparent contradiction. If the id is `@default(uuid())` and it is the primary key, running twice would fail, not "insert the same value twice." I could not tell whether this is a warning about a crash or about duplicate data. Plainer: "`build()` generates default values once and freezes them. If you run the same built insert twice you write the same id twice, which fails on a unique column. Call `.build()` again for each run."

**Line 256** — "Every value the callback returns must be an expression, so you cannot put a plain JavaScript value beside a computed one."
Stopped by: "beside" — beside in the same object? In the same statement? And the fix given ("write it as a `fns.raw` fragment with `.returns(...)`") has no example, so I do not know what that looks like.

**Line 322** — "`codecId` is the type id, the name this page uses everywhere else."
Stopped by: I read this three times. It parses as "codecId is what the rest of the page calls type id," but the wording makes "the name" point at nothing clear. Plainer: "The option is called `codecId`, but it takes the same type id used everywhere else on this page."

**Line 363 vs 365** — "`in(expr, values)`, `notIn(expr, values)`, where `values` is an array or a built subquery" against "`exists(subquery)`, `notExists(subquery)`, taking a select query you do not call `build()` on".
Stopped by: `in()` wants a **built** subquery, `exists()` wants an **unbuilt** one. That is a real trap and the page states it in passing, in two table cells, with no example of `in()` with a subquery. I would have got this wrong.

**Line 408** — "A `fns.raw` fragment only becomes an expression once you call it, so there is nowhere in the builder you can use a fragment without it."
Stopped by: "once you call it" — call what? The fragment or `.returns()`? Two "it"s in one clause pointing at different things. Also this is an internal reason for a rule I already accepted from the bold sentence before it. Plainer: "Always call `.returns()`. Nothing in the builder accepts a fragment without it."

**Line 409** — the whole `.returns()` remark.
Stopped by: it is one paragraph carrying five claims (it is TypeScript-only; `EXTRACT` gives `numeric`; `numeric` arrives as a string; `CAST` does not help; three separate workarounds). One of the workarounds, "or select a real column of that type," is not a workaround at all for a computed value — I cannot select a real column that holds `EXTRACT(YEAR ...)`. That broke my reading of the list.

**Line 440** — the whole "Running a built query" paragraph.
Stopped by: six facts jammed together (query vs execute, the rule, `AsyncIterableResult`, `await` gives `Row[]`, `for await` gives one row, `execute` gives `{ affectedRows }`). This is the most important paragraph on the page for "how do I run it," and it is the least broken up. It needs a short table.

**Line 469** — "`for await` does not save memory on PostgreSQL: the client loads every row first, and both `await` and `for await` read that same in-memory result. The connection goes back to the pool before you read the rows."
Stopped by: this tells me how the client works internally and then leaves me with the obvious question unanswered — if it saves nothing, why would I ever use `for await`? The connection-pool sentence is unconnected to anything I have to decide.

## Words and phrases I had to guess

- **"plan"** (line 55 and everywhere). I guessed "the object `.build()` returns." The page never says the word means that; line 55 says the examples "name the built query `plan`," which reads as a naming convention, but then the anchor `#executing-a-plan` and the phrase "Running a built query" use it as if it were a defined term.
- **`runtime.execute`** (line 202). First appears inside a code comment. I guessed it is the sibling of `query` for writes. It has no entry of its own anywhere on the page — only prose at line 440.
- **`AsyncIterableResult`** (line 440). Guessed: a thing you can both `await` and `for await`. The page links it to a different page instead of saying so.
- **`codecId` / "codec"** (line 329). Guessed: codec = the thing that encodes and decodes a value, so `codecId` = the type id. Never stated.
- **pgvector** (line 393). Guessed: a PostgreSQL extension for vector columns. Not explained, and `cosineDistance` is named with no signature at all — I do not know if it takes one argument or two.
- **"the contract's default"** (line 179). Guessed: the `@default(...)` in `contract.prisma`.
- **"per-row type is recoverable"** (line 436). Guessed: "you can get the TypeScript type of one row."
- **`ORM.COLUMN_UNKNOWN`, `RUNTIME.DECODE_FAILED`, `RUNTIME.ENCODE_FAILED`, `ORM.MUTATION_DATA_MISSING`, `RUNTIME.ITERATOR_CONSUMED`**. I guessed these are the `code` property on a thrown error object. The page never shows one error being caught, so I do not know what I actually write to check for them.

## "So what do I actually type?"

1. **Line 256** — setting a fixed value inside the `update()` callback form. Told to "write it as a `fns.raw` fragment with `.returns(...)`". No example. This is the only place on the page that names a workaround and then does not show it.
2. **Line 363** — `in()` with a built subquery. Stated in a table cell, never shown.
3. **Line 393** — `cosineDistance`. No arguments, no example, no return type.
4. **Line 366** — the `raw` row of the built-in table gives no signature, unlike every other row.
5. **Line 186** — "Every column is optional." So what happens if I leave out a required column that has no default? Not said. I would have to try it.
6. **`returning()`** — can I write `returning('*')`? Can I return a computed expression? Only "Column names (`string`)" is given, and I do not know whether that is a restriction or just the common case.
7. **Line 94** — "You can also group by an alias you gave a selected value, such as `.groupBy('yearPlaced')`." The example directly above (lines 85–87) writes the same eight-token raw fragment twice instead. The page shows me the worse way and mentions the better one afterwards, so I do not know which one I am supposed to type.
8. **Any error code** — I never see `try { ... } catch (e) { if (e.code === ...) }`. Five codes are named and none is shown in use.
9. **Line 94** — "If you select a column you did not group or aggregate, the query fails when it runs." Fails with what? Every other failure on the page comes with a code. This one does not.

## Places explaining the inside when I wanted the outside

- **Line 188, 321, 397** — "Each value is sent as a query parameter, never pasted into the SQL" appears three times. Once, near the top, is enough. What I need to know is only the consequence: do not call `.returns()` on insert values.
- **Line 408** — "A `fns.raw` fragment only becomes an expression once you call it." The rule ("always call `.returns()`") is all I need.
- **Line 469** — "the client loads every row first," "the connection goes back to the pool before you read the rows." Pure internals. Neither changes anything I type.
- **Line 219** — "PostgreSQL and SQLite, the two databases the builder supports today. Both support SQL's `RETURNING`." Telling me *why* it is available on both is not something I asked.
- **Line 3** — "Call it after your `select()` calls, because a grouped query has no `select()` of its own." The reason is implementation trivia; "call `groupBy()` after all your `select()` calls" is the instruction.

## Other things that tripped me

- **Line 55 against line 58.** "Every example below assumes `const runtime = db.runtime();`" and then the very next line writes `const runtime = db.runtime();` anyway. On first read I assumed the assumption did not hold and looked for the difference.
- **Line 66** — `// e.g. { customerId: ..., orderCount: 5 }` shows a bare object, but `rows` is an array. Line 90 shows it correctly as `[{ ... }]`. Inconsistent within four lines of code.
- **Line 203** — a markdown link inside a code comment: `// see [Running a built query](#executing-a-plan)`. In a code block that renders as literal brackets. It is also where `execute` is introduced for the first time, buried in a comment.
- **`param()` is filed under "Mutations."** It has nothing to do with mutations — its own example (line 345) is a `select` with a `where`. I would never have found it looking for it.
- **Line 91** — "yearPlaced is the string '2024'" immediately after I was told to write `.returns('pg/int4@1')`. The explanation is 300 lines later at line 409, reached by "See `.returns()` below." On first read this looks like a bug in the example.
- **Line 404** — "A fragment used as a `where()` predicate declares `'pg/bool@1'`." "Declares" reads as something the tool does. I want "write `.returns('pg/bool@1')`."
- **Two different deep import paths** (`@prisma/orm-postgres/relational-core/expression` and `@prisma/orm-postgres/components/runtime`) with no hint why they differ. I would guess wrong when reaching for a third import.

## Could I do what the page is for, after one reading?

Mostly yes for the plain cases: group by a column with a count, filter with `having()`, insert, update, delete, and get rows back with `returning()`. Those examples are complete and I could copy them.

What I still would not know:

- How to set a fixed value alongside a computed one in `update()`. The page tells me it is possible and does not show it.
- Whether to pass `in()` a built or unbuilt subquery — I would have got this backwards from the `exists()` example.
- What `execute` is, in full. It is never given its own entry, and I met it in a code comment.
- What to actually type to check for any of the five error codes.
- Whether my number is going to come back as a string. I would have shipped `yearPlaced` as a string and found out in production, because the explanation is far from the example that hits it.
- When `for await` is worth using. The page tells me it saves no memory and then leaves the choice to me.
- What `cosineDistance` takes.