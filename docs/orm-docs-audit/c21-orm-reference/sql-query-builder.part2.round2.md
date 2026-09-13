Read once, top to bottom, as a Prisma 7 user seeing this version for the first time.

## Sentences I could not restate after one reading

**Line 38 (the aggregate note).** "`count()`, `sum()` over an integer column, and `avg()` over an integer column all return a JavaScript `number`. If a `count()` or integer `sum()` result is larger than 2^53 - 1, the query fails with an error whose `code` is `RUNTIME.DECODE_FAILED`. Use `countBigInt()` or `sumBigInt(field)` instead when totals can get that large. `avg()` does not fail this way. It is computed as a floating-point `number` and loses precision instead, so use `avgDecimal(field)` when you need an exact figure. `min()` and `max()` return the input column's own type."
Six rules in one paragraph before I have seen a single aggregate call. I stopped at "the exact form of" in the heading, "with exact variants beside them" — I did not know what a "variant" was until I hit the function table 300 lines later. Plainer: put this note *after* the first `count()` example, and split it into "these return `number`", "these overflow, use the BigInt version", "`avg` loses precision, use `avgDecimal`".

**Line 62.** "Every example from here on calls `runtime`, and names the built query `plan`."
Two things stopped me. You do not "call `runtime`" — you call `runtime.query()`. And why is the built query named `plan`? Nothing on the page calls it a plan; the page calls it "the built query" everywhere else, and then the anchors give the game away: `[#executing-a-plan]`, `[#recover-the-row-type-from-a-plan]`. I guessed "plan" is an older name for the same thing and that I am seeing a half-finished rename. Plainer: "Every example below assumes `const runtime = db.runtime()`."

**Line 86–87.** "`// rows === [{ yearPlaced: '2024', orderCount: 10 }]` / `// yearPlaced is the string '2024', not the number 2024. See `.returns()` below.`"
I annotated the expression `'pg/int4@1'` and got a string. I could restate the words but not the rule. Then line 403 confirms `.returns()` "does not change the value you actually get back" and points me *back* to this example. The two places point at each other and neither tells me how to get a number.

**Line 399.** "Required: Yes for a selected value, a compared value, or a fragment used on its own as a `where()` predicate".
That is a list of every use of `fns.raw` I can think of. So when is `.returns()` *not* required? The page never says. Plainer: say "always required, except X".

**Line 469.** "`postgres(...)` turns cursors off in the driver it builds, so every query loads every row into memory first."
`postgres(...)` never appears anywhere on this page. "turns cursors off in the driver it builds" is a sentence about the inside of the tool. I could not restate what I am supposed to *do* with it.

**Line 471.** "Each result is read once, one way. Re-awaiting a result you already awaited is safe and gives you the same array."
These contradict each other on first read. "Read once" then "re-awaiting is safe". Plainer: "You can `await` a result as many times as you like. You cannot mix `await` and `for await` on the same result, and you cannot `for await` it twice."

**Line 191.** "The column it goes into decides how it is stored and read, so you never annotate an insert value."
"Annotate" with what? I had not met `param()` or `.returns()` yet at this point in the page.

**Line 3.** "Grouping starts with `groupBy()`, which turns a query into a `GroupedQuery`."
But in every example `groupBy()` comes *after* two `.select()` calls. Does the order in the chain matter? Not said.

## Words and phrases I had to guess

- **`plan`** — guessed: the object `.build()` returns, same thing the page elsewhere calls "the built query". Two names for one thing.
- **"These are fixed:"** (line 361) — guessed: these functions exist no matter which database you use, unlike the aggregates below. The word "fixed" does not say that.
- **"in scope"** (line 90, "neither a column in scope nor an alias you selected") — guessed: a column of the table I started from.
- **`codecId`** (line 331) vs "type id" (part 1) vs `.returns(codecId)` — guessed these are all the same thing. The page uses two names and never joins them up.
- **"typed to resolve to the returned rows"** (line 236) — guessed: TypeScript now knows the query gives back rows, so I should use `query` not `execute`.
- **`relational-core`** and **`components/runtime`** in the two import paths — guessed these are just package subpaths with no meaning I need.
- **`db.orm.public.User`** (line 450, capital U) against `db.sql.public.user` (lowercase) everywhere else — guessed the ORM side keys by model name and the SQL side by table name. The page does not say so, and the capital letter looked like a typo.
- **"exact form of"** (`countBigInt`, `sumBigInt`, `avgDecimal`) — guessed: the version that does not lose precision.

## Places I asked "so what do I actually type?" and got no answer

1. **`exists` and `notExists`.** Listed in the table at line 368. No signature, no example, nothing. Do they take a subquery? Another builder? I cannot write one.
2. **`in` and `notIn`.** Same. Listed, never shown. Do I pass an array?
3. **`ilike`** (line 384). Named, never shown. Is it `fns.ilike(f.email, '%@example.com')`?
4. **Getting a number out of a raw expression.** I now know `.returns('pg/int4@1')` lies to TypeScript and I still get `'2024'`. The page never shows the fix. Do I write `CAST(... AS int4)` in the raw SQL? `Number(row.yearPlaced)`? Say it.
5. **Choosing a `codecId`.** `param()` requires one and its only example is `'pg/text@1'`. What do I pass for a date, a uuid, a boolean, an array? The list is linked from `fns.raw` at line 392 but not from the `param()` section, which is the section that forces me to pick one.
6. **`having()` with an alias.** `orderBy()` takes the alias `'totalAmount'` (line 164). `having()` re-writes the whole `fns.sum(f.amount)` (line 121). Can `having()` take the alias too? Not said, so I would have retyped the aggregate and hoped.
7. **`update()` mixing forms.** The table gives a values object *or* an expression callback. Can I set one column to a literal and another to an expression in the same callback? Not said.
8. **`distinct()` and `distinctOn()` on a grouped query** (line 153). I do not know what distinct means once rows are already one-per-group, and there is no example.
9. **`execute` appears at line 205** in the first insert example, with no explanation. It is defined at line 435, 230 lines later. On first read I did not know why insert used `execute` and the `returning()` example used `query`.
10. **`1n`** (line 98). "Do not pass a `bigint` literal such as `1n`." What happens if I do — a type error, a wrong result, a crash? I would want to know whether this is a compile-time safety net or a trap.
11. **`sum(field)` over a non-integer column** (line 377): "the type PostgreSQL's own `sum` produces for it". So for a `numeric` column I get… a string? A `Decimal`? I would have to go read PostgreSQL docs to use my own schema.
12. **`build()` and defaults** (line 182): "The value is generated when you call `build()`." So if I build once and run twice, do I insert the same uuid twice? That is a real question the sentence raises and does not answer.

## Places explaining the inside when I only wanted to know what to do

- **Line 469**, the whole "turns cursors off in the driver it builds" paragraph. I wanted to know whether `for await` saves memory. The answer is no. Say that in one sentence and drop the driver.
- **Line 182**, "The value is generated when you call `build()`." I wanted to know that leaving a column out applies its default.
- **Line 224**, "On a database without it, TypeScript rejects the call. If you get past the type check, for example by casting, the call throws an error whose `code` is `ORM.CAPABILITY_MISSING`." I wanted "works on PostgreSQL and SQLite". The part about defeating your own type check is a curiosity, not instruction. It also never names the database that lacks `RETURNING`.
- **Line 90**, "Prisma ORM does not check that every other selected column is grouped or aggregated. PostgreSQL rejects the query when it runs." Useful in effect, but framed as a division of labour between two systems. Plainer: "If you select a column you did not group or aggregate, the query fails when it runs, not when you build it."
- **Line 450**, "Since `8.0.0-rc.10` it also works on ORM queries". A release note in the middle of a reference entry.
- **Line 425**, "There is no `build({ params })` form." Answers a question I did not ask, unless it is aimed at people migrating from something.

## Two structural problems

**The schema switches back without telling me.** Line 5 says "The examples below use a separate `customer` / `order` schema". Every mutation example from line 204 on is back to `db.sql.public.tag` and `db.sql.public.user` from part 1. Nothing marks the switch back, and I spent a moment looking for a `tag` model in the `customer`/`order` schema.

**Line 147's comment describes code that is not there.** "`// avgAmount is 300, and avgDecimal(f.amount) would give the exact '300.0000000000000000'`" — the example uses `avg`, and the comment tells me about a function the example does not call.

## Could I do what the page is for, after one reading?

Partly.

I could write a grouped query with a count or a sum, filter it with `having()`, sort by an aggregate alias, and take the top row. I could insert rows, update with a values object, delete with a `where()`, and add `returning()`. I could pick `query` versus `execute`. That is the bulk of the page and it works.

What I still would not know how to do:

- Write an `exists`, `notExists`, `in`, `notIn`, or `ilike` call. The page names five functions it never shows.
- Get a usable number back from a computed expression. I know `.returns()` will not do it and the page stops there.
- Pick a `codecId` for anything that is not text or `int4`.
- Decide whether `having()` accepts an alias, or whether I must retype the aggregate.
- Mix fixed values and expressions in one `update()`.
- Say what `distinct()` means on a grouped query.
- Tell whether rebuilding versus reusing a built `insert()` gives me a new uuid.

And I would still be carrying the unexplained word "plan" through the whole page, including into two heading anchors.