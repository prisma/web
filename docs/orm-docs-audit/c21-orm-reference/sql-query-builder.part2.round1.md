I read the file once, straight through, as the reader described. Here is what happened.

## Sentences I could not restate after one reading

**1. The aggregate note, line 38.** This is one sentence carrying six separate facts.

> "For `count()` and integer `sum()`, a value outside the safe-integer range, ±(2^53 − 1), raises `RUNTIME.DECODE_FAILED` rather than answering with a rounded value (`avg()` is computed as `float8` and has no such guard), so reach for the lossless form when the magnitude is real: `countBigInt()` returns a `bigint`, `sumBigInt(field)` returns a `bigint`, and `avgDecimal(field)` returns an exact decimal string."

What stopped me: the parenthetical about `avg()` interrupts the rule, `float8` is never explained, "reach for the lossless form when the magnitude is real" is a figure of speech I had to decode, and "answering with a rounded value" describes something that does *not* happen, so I had to hold a counterfactual in my head. Plainer: "If a `count()` or integer `sum()` result is larger than 2^53 − 1, the query fails with error code `RUNTIME.DECODE_FAILED`. Use `countBigInt()` or `sumBigInt()` instead when totals can get that large. `avg()` does not fail this way; it loses precision instead, so use `avgDecimal()` when you need an exact figure."

**2. Line 366.**

> "They come from the aggregate map in the contract written by `prisma contract emit`, which each target and extension contributes to, so which ones exist depends on your database."

"Aggregate map", "target", and "extension" are all undefined here, and `prisma contract emit` appears for the first and only time on the page. I could not resolve any of them. Plainer: "Which aggregate functions you get depends on your database. PostgreSQL gives you these eight."

**3. Line 379.**

> "Any further function is registered dynamically: `ilike` is registered by the Postgres adapter for textual columns, while functions like `cosineDistance` come from an extension pack (pgvector) registered for your contract; without the matching adapter or extension pack, those functions are absent."

Three unexplained terms ("registered dynamically", "adapter", "extension pack") and two ideas in one sentence. I do not know whether I have to do anything to get `ilike`, or whether it is just there.

**4. Line 398.**

> "A raw expression PostgreSQL computes as `numeric` still arrives as a string even when annotated `'pg/int4@1'`, because Prisma ORM does not convert the values a raw fragment returns."

I read this three times. The page is telling me `.returns()` is a lie I tell TypeScript. That is a genuinely important warning and it is buried in a subordinate clause. It needs to be blunt: "`.returns()` only tells TypeScript what type to expect. It does not change the value you actually get back. If the real value is a string, your typed `number` will be a string at runtime."

**5. Line 471, last sentence.**

> "Since `8.0.0-rc.10` a buffered query hands its pooled connection back before you read the rows, so a paused loop no longer blocks other queries; a cursor stream keeps its connection until it finishes."

"Buffered query" and "cursor stream" appear here for the first time. I do not know which one I get when I write `for await`, and the page never tells me how to ask for either. I could not restate this at all.

**6. Line 471, "Each result is read once, one way."** Read once by whom? Does the array version stop me from also iterating? Does iterating twice throw? I guessed it means "you can `await` it or `for await` it, not both," but I am guessing.

**7. Line 217.**

> "On an adapter for a database without it, TypeScript types `returning` as `never`, so the call does not compile; calling it anyway throws an error whose `code` is `ORM.CAPABILITY_MISSING`."

If it does not compile, how do I call it anyway? I could not work out the situation being described.

## Words and phrases I had to guess

- **`plan`** — every example names the variable `plan`, the prose calls it a "built query", and an anchor is `#executing-a-plan`. I guessed these are all the same thing. The page never says so.
- **`codecId`** — guessed: a string naming a database type. What `@1` means I have no idea; guessed a version number.
- **`'pg/int4@1'`, `'pg/text@1'`, `'pg/bool@1'`** — guessed these map to PostgreSQL `int4`, `text`, `boolean`. There is no list anywhere on the page, so I would not know what to write for a date, a UUID, or a numeric.
- **`1n`** (line 92) — guessed a JavaScript bigint literal. The page assumes I know, and it never explains why I would have reached for one.
- **"Gate the update with `where()`"** (lines 244, 289) — guessed "restrict which rows it touches". "Gate" is not a plain word for this.
- **"how it is stored and read comes from the target column"** (lines 182, 318) — guessed this means encoding and decoding. The phrase is repeated twice without ever being made concrete.
- **"function bag"** (line 352) — guessed "an object holding functions".
- **"family-agnostic utility"** (line 452) — guessed "works with more than just the SQL builder". "Family" is never defined.
- **"lossless form"** — guessed "the version that does not lose precision". Fine, but it appears before it is explained.
- **`distinctOn()`** (line 147) — appears once, in a list, never defined or shown. Guessed it is PostgreSQL `DISTINCT ON`.
- **"a `varchar` column widens to `text`"** (lines 376-377) — guessed this only matters for the TypeScript type.

## Places I asked "so what do I actually type?"

1. **Where does `runtime` come from?** Every single example calls `runtime.query(plan)`. I was told `db.runtime().query(...)` in the first half. No example on this page shows `const runtime = db.runtime()`. I would have copied an example and hit an undefined variable.
2. **Do I have to generate ids myself?** The schema says `id Uuid @id @default(uuid())`, but every insert example passes `crypto.randomUUID()` explicitly. So does `db.sql` apply the schema default or not? The page never says. This is the first thing I would try and the first thing that would break.
3. **What about insert conflicts?** No `ON CONFLICT`, no upsert, no mention that the topic exists. In ORM 7 I used upsert constantly. I do not know if it is unsupported, or somewhere else.
4. **Does `delete()` take arguments?** It is the only method with no Options section at all. I do not know if `delete()` is always bare.
5. **What happens if I `delete()` or `update()` without a `where()`?** Not stated. I would want that answered before I typed it.
6. **Which columns am I allowed to `select()` alongside a `groupBy()`?** SQL requires grouped or aggregated columns. The page never says what happens if I break that rule.
7. **Can I `groupBy` an alias?** In the computed-value example (lines 77-79) I have to retype the whole `EXTRACT(YEAR FROM ...)` expression in both `select()` and `groupBy()`. I would want to write `.groupBy('yearPlaced')`. The page does not say whether that works.
8. **`orderBy('totalAmount')` sorts by an aggregate alias** (line 158), but elsewhere `orderBy` takes column names. The page says "Sort by an aggregate alias to order groups" but does not say whether the alias must be one I selected, or what happens if it is not.
9. **When is `.returns()` not required?** The table says "Yes for a projected or compared value". I do not know what the third case is.
10. **Where do the imports come from?** `param` from `@prisma/orm-postgres/relational-core/expression`, `ResultType` from `@prisma/orm-postgres/components/runtime`. Two unrelated-looking subpaths of the same package, with no rule I can infer for a third import.
11. **How do I pick a `codecId` for a bare value?** Line 387 says "the builder picks the `codecId` from its JavaScript type" — but not which type maps to which codec, so I cannot predict when I need `param()`.
12. **`query` or `execute`?** Line 439 says `execute` is "for writes that return no rows". The insert-with-`returning` example uses `query`, the insert-without uses `execute`. So what do I call for an `update()` with no `returning()`, and what does `query` do if I use it on a write? Not stated.

## Places the page explains internals when I only wanted to know what to do

- **Line 366-379**, the whole explanation of contracts, targets, adapters, extension packs, and dynamic registration. I wanted a list of functions I can call. I got the tool's plugin architecture.
- **Line 176**: "Multiple rows are inserted in one `INSERT ... VALUES (...), (...)` statement, not one round-trip per row." This is the implementation. It happens to be reassuring, but it is not something I do.
- **Line 398**: "It does not cast the value in SQL or change how the driver decodes it." I wanted "you may get a string, check it." I got the mechanism.
- **Line 471**: pooled connections, paused loops, cursor streams. I wanted "use `for await` if the result set is big."
- **Line 92**: "PostgreSQL evaluates the comparison server-side." I wanted "pass a plain number." The reason why does not help me type anything.
- **Line 82-83**: the whole explanation of why `yearPlaced` is `'2024'` rather than `2024`. Correct and necessary, but delivered as a code comment about internals rather than as a warning I can act on.

## Could I do what the page is for, after one reading?

Partly. I could write a `groupBy` with a `count`, a `having` with a sum threshold, a multi-row insert, and an update with `returning`. Those four patterns are shown clearly enough to copy.

I could not:

- **Run any of it.** I do not have `runtime`. Every example uses it; none creates it.
- **Insert a row without guessing.** I do not know whether schema defaults apply, so I do not know whether `id` is mine to supply.
- **Write any `fns.raw` of my own beyond copy-paste.** I have three `codecId` strings from examples and no list, no naming rule, and no way to find one for a date or a numeric.
- **Predict what `.returns()` gets me.** After reading line 398 I know the annotation can be wrong, but I do not know which cases are safe, so I would have to test every raw expression by hand.
- **Handle insert conflicts at all.** The topic is absent.
- **Decide between `query` and `execute`, or between collecting and streaming**, with any confidence. The last section describes two internal modes I was never taught how to select.

The single biggest problem is the missing `runtime` definition. The second is that `codecId` is required in six places and defined in none.