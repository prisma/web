Read once, top to bottom, as a Prisma 7 user. Findings below.

## Sentences I could not restate after one reading

1. Line 5: *"The examples below use a separate `order` schema, where `order.amount` is an integer column"* — "schema" collides with the meaning I was given in part 1, where `db.sql.public.user` is "schema then table" and `public` is the schema. So I read this as a PostgreSQL schema named `order`, then hit `db.sql.public.order` and had to reread. The word is used in three more senses on this page: "the aggregate example schema" (line 9, a `.prisma` model file) and "this page's main schema" (line 154, the example models). Plainest wording: "The examples below use an extra table, `order`, whose `amount` column is an integer."

2. Line 3: *"A grouped query supports `having()` for group-level filtering, the aggregate functions, and the same `orderBy()`, `limit()`, `offset()`, and `distinct()` methods as a `SelectQuery`."* — "supports the aggregate functions" does not match the example. In the example the aggregate is written inside `.select()` **before** `.groupBy()`, and the same line tells me to "Call `groupBy()` after all your `select()` calls". So the grouped query does not support aggregates; the selects that precede it do. Plainer: "Write your aggregates in `select()` first, then call `groupBy()`. After that you can add `having()`, `orderBy()`, `limit()`, `offset()`, and `distinct()`."

3. Line 75 / line 405, the `EXTRACT` comment: *"`.returns()` only tells TypeScript what type to expect. It does not convert the value, so yearPlaced is the string '2024'."* — I declared `'pg/int4@1'` and got a string. I could not work out what TypeScript now believes `row.yearPlaced` is. If `.returns('pg/int4@1')` types it as `number`, then the page's own advice, `Number(row.yearPlaced)`, is code TypeScript would flag, and the row is typed wrong at runtime. The page never says. This is the single sentence that cost me the most.

4. Line 87: *"TypeScript does let you name a selected alias on the `f` argument here, but PostgreSQL does not accept an alias in `HAVING`, and the query then fails when it runs."* — three ideas in one sentence, and the practical upshot (the types offer you something that is guaranteed to break) arrives last. Plainer: "Do not use a selected alias in `having()`. TypeScript will let you, but PostgreSQL rejects it and the query fails at run time. Write the aggregate again instead."

5. Line 163: *"`build()` generates default values once. Running the same built insert twice writes the same id twice, which fails on a unique column."* — This contradicts the sentence just before it, which says "the `@default(...)` in `contract.prisma` is applied". I could not tell who applies the default: PostgreSQL, or the builder on my machine. The answer matters and is only implied. Plainer: "Prisma generates `@default(uuid())` and `@default(now())` values when you call `build()`, not when the query runs. So the built query holds fixed values — reusing it inserts the same id twice. Call `.build()` again for each insert."

6. Line 171 vs line 164: *"The rows to insert. Every column is optional."* against *"Leave out a required column that has no default and PostgreSQL rejects the insert when the query runs."* — Read together, these say the opposite things. I assume the first means "optional to TypeScript", but the table does not say so.

7. Line 310 vs line 393: *"`param()` is for the values that have no such column"* against *"For a bare value, the builder picks the type id from its JavaScript type."* — If the builder already picks a type for a bare value in `fns.raw`, then the bare value *does* get a type without a column, and `param()`'s stated reason for existing disappears. After one reading I did not know when I actually need `param()`.

8. Line 469: *"It does not reduce memory on PostgreSQL, because both `await` and `for await` read the same result the client has already loaded."* — I can restate the words, but not the point. The section exists to offer me `for await`, then tells me it buys nothing on my database.

9. Line 471: *"You can `await` a result as many times as you like. You cannot mix `await` and `for await` on the same result."* — "a result" is a thing I never have. Every example on the page writes `await runtime.query(plan)` in one expression. Nothing shows the object you would hold and await twice.

## Words and phrases I had to guess

- **"plan"** — I guessed it is just the variable name the page chose for whatever `build()` returns, not a type. But line 434's anchor is `#executing-a-plan` while the heading reads "Running a built query", and line 456's anchor is `#recover-the-row-type-from-a-plan`. I guessed these are the same thing.
- **"contract"/"contract.prisma"** — carried over from part 1, fine. But line 389, *"so it is there only if your contract uses pgvector"*, made me guess that a contract can declare an extension. I do not know how.
- **`codecId`** (lines 311, 318, 400) — I guessed "codec" is Prisma's internal word for the thing that converts a database value to JavaScript. The page never says, it only apologises for the name.
- **`numeric`, `float8`, `varchar`, `int4`, `text`** (lines 382, 386, 405) — PostgreSQL type names. In my contract I write `Decimal`, `Float`, `String`, `Int`. I guessed at the mapping. The page never gives it, so I cannot tell which of *my* columns makes `sum()` return a string.
- **"relational-core"** in `@prisma/orm-postgres/relational-core/expression` (line 309) — I guessed it is an internal layer name I am not meant to think about.
- **"the version of `count` that does not overflow"** (line 381) — I guessed "overflow" means the 2^53 limit described at line 61, but those two places never point at each other.
- **`AsyncIterableResult`** (line 471) — guessed this is the type of the object `runtime.query()` returns, which would explain awaiting it twice. Only findable by following the link.

## Places I asked "so what do I actually type?" and got no answer

1. **Line 61**: *"To check for a code, catch the error and compare `error.code`."* No snippet. No `try { … } catch (e) { … }`. No word on whether `error.code` is typed, or whether I must narrow `unknown` first. This is the only error-handling instruction on the page and it has no code.
2. **Line 78**: *"You can also repeat the same `fns.raw` fragment inside `groupBy()`."* The Options table gives the signature `groupBy((f, fns) => expr)`, but there is no example. Do I have to call `.returns()` again on the repeated fragment? Do the two fragments have to match textually? Unanswered.
3. **Line 86**: `having()` rejects a `bigint` literal such as `1n`. But if my counts are big enough that I used `countBigInt()`, how do I filter on that count? No answer.
4. **Line 69**: nothing tells me which type id `EXTRACT(YEAR FROM …)` *should* have. The example passes `'pg/int4@1'` and then explains that the value is a string. Should I have written a `numeric` type id instead? I do not know what I am meant to type.
5. **Line 389**: *"it is there only if your contract uses pgvector"*. How do I make my contract use pgvector? No link, no line of schema.
6. **Line 204**: *"**Availability:** PostgreSQL and SQLite."* So on MySQL, what do I write instead of `returning()`? Not said, and not linked.
7. **Line 240**: can I mix the two `update()` forms — fixed values for some columns, expressions for others? Line 242 tells me to wrap a fixed value in `fns.raw` inside the callback, which implies no. It never says so plainly.
8. **Line 471**: what expression produces the "result" I can await repeatedly? `const result = runtime.query(plan)` with no `await`? Never shown.
9. **Line 333**: the one `param()` example binds a string with `'pg/text@1'` — exactly what line 393 says the builder infers on its own. So the example does not show a case where `param()` is needed. I finished the section without one.

## Places that explain the inside when I only wanted the instruction

- Line 173: *"Each value is sent as a query parameter, never pasted into the SQL. The column it goes into decides how it is stored and read."* I only needed the rule: "Never call `.returns()` or `param()` on an insert value." The mechanism is the whole first sentence.
- Line 469: *"because both `await` and `for await` read the same result the client has already loaded."* Driver-level detail. The instruction I wanted is "On PostgreSQL, use `await`."
- Line 309: *"`param` and `ResultType` are in different subpaths of the same package, so use the paths shown."* This explains the package layout to excuse itself. "Import each from the path shown" would do.
- Line 386–387: *"A `varchar` column is typed as `text`."* Both are `string` in JavaScript. I could not work out what this changes for me.
- Line 78: *"That failure comes back as PostgreSQL's own error, not a Prisma ORM code."* Useful only if the page then tells me what I *can* match on. It does not.

## Could I do what the page is for, after one reading?

Partly. I could write a grouped query with a count and a `having()` filter, an insert with `returning()`, an update with a values object, and a delete with a `where()`. Those four have clean, complete, copyable examples and I trust them.

What I still would not know:

- Whether `.returns()` makes TypeScript agree with the value I actually receive, and therefore whether my `Number(row.yearPlaced)` compiles.
- Which of my contract's column types (`Decimal`, `Float`, `Int`) make `sum()` and `avg()` hand back a string instead of a number. The table is written in PostgreSQL type names I do not use.
- How to catch and identify any of the six error codes the page names (`RUNTIME.DECODE_FAILED`, `ORM.COLUMN_UNKNOWN`, `RUNTIME.ENCODE_FAILED`, `ORM.MUTATION_DATA_MISSING`, `RUNTIME.ITERATOR_CONSUMED`), because there is no `try`/`catch` anywhere on the page.
- When `param()` is genuinely required, as opposed to redundant with the builder's own inference.
- How to group by a computed expression rather than by its alias, which the Options table offers and no example shows.
- How to insert repeatedly without rebuilding, or whether rebuilding is the only answer.

One more thing that would bite me the day after reading: line 231 and line 281 both say an `update()` or `delete()` with no `where()` hits every row and "nothing warns you". That is the most dangerous fact on the page and it sits mid-paragraph in the prose, not in a `:::warning`, while the far less costly aggregate-overflow note gets its own callout box.