Read once, top to bottom, as a Prisma ORM 7 user.

## Sentences I could not restate after one reading

**Line 55** — "It also gives you `countBigInt`, `sumBigInt`, and `avgDecimal`, which answer with a `bigint` or an exact decimal instead of a `number`."
Stopped by: "answer with" (I think you mean "return"), and "an exact decimal" — is that a JS `Decimal` class? Whose? Do I have to import it? Also three names mapped onto two return types, so I cannot tell which is which. Plainer: "`agg.countBigInt()` returns a `bigint`. `agg.sumBigInt('amount')` returns a `bigint`. `agg.avgDecimal('amount')` returns a `Decimal` (imported from X)."

**Line 129** — "`orderBy(...)` on a grouped collection sorts the groups by a grouping field. You cannot sort them by an aggregate value here. For that, use the SQL query builder, described in [Advanced queries]."
Stopped by: "here" — here meaning in `orderBy`, or in grouped queries generally? And "the SQL query builder" is a thing I have never heard of; it is named as if I already know it. Plainer: "You can only sort groups by a field you grouped on. To sort by a computed total, drop down to raw SQL (link)."

**Line 234** — "Filters build the condition inside `where()`, and inside relation filters."
Stopped by: this defines filters using the word "filters". It also implies two contexts without showing the second yet.

**Line 237** — "MongoDB uses static factories on `MongoFieldFilter` imported from `@prisma/orm-mongo/query-ast/execution`, plus `.and()`/`.not()` instance methods and the standalone `MongoOrExpr.of(...)`."
Stopped by: too many ideas in one sentence (import path, static factories, instance methods, a third helper), plus "static factories" is library-author vocabulary. The import path `query-ast/execution` reads like an internal module I was not supposed to see.

**Line 245** — "`eq`/`neq`/`in`/`notIn` on any field that can be compared for equality; `gt`/`lt`/`gte`/`lte` on any field that can be ordered"
Stopped by: I cannot resolve "can be compared for equality" or "can be ordered" to actual Prisma types. Is `Json` orderable? Is `Bytes` equality-comparable? I have to guess and find out at compile time. Plainer: give the list of types, or say "if the method is missing from autocomplete, the type does not support it."

**Line 364** — "A to-one relation is filtered the same way, from either side: `p.user.some(...)`."
Stopped by: two things. `some` means "at least one of many" everywhere else on the page, so using it for a single related row is surprising and the sentence does not explain why. And "from either side" — either side of what? The relation? So `u.posts.some()` and `p.user.some()` are both fine, which I already assumed. This sentence is doing work I could not follow.

**Line 197** — "Each of those returns an object with `eq`, `neq`, `gt`, `lt`, `gte`, and `lte`."
Stopped by: "returns an object with" describes the library's internal shape when I only need "then call a comparison on it: `h.sum('amount').gt(1000)`".

## Words and phrases I had to guess

- **"pipeline builder"** (line 3) — guessed: some other API that exposes MongoDB's native aggregation pipeline. The page never shows a single line of it, so this is a pure guess.
- **"static factories"** (line 237) — guessed: methods you call on the class itself, `MongoFieldFilter.eq(...)`, not on an instance.
- **"selector"** (line 53) — guessed: the callback that names which aggregates to compute.
- **"output alias"** (line 53) — guessed: the object key becomes the property name in the result.
- **`GroupedCollection`** (line 127) — guessed: an unresolved, chainable thing that is not a promise yet. The page never says it is not awaitable, so I guessed that too.
- **`Uuid`** (schema, lines 13, 23) — guessed: a new scalar type replacing `String @db.Uuid`.
- **"exact decimal"** (line 55) — guessed: arbitrary-precision decimal, not a float.
- **`MongoAndExpr`** (line 298) — named once, never constructed, never shown. Guessed it exists but I would not know how to make one.
- **"the SQL query builder"** (line 129) — guessed: raw-SQL escape hatch.
- **`.desc()`** (line 178) — guessed: descending sort. Never defined on this page.
- **"to-many relation"** (line 359) — I know this from ORM 7, but the page uses it before defining it.

## Where I asked "so what do I actually type?" and got no answer

1. **`countBigInt` / `sumBigInt` / `avgDecimal`** (line 55). No example, no signature. Does `countBigInt` take a field? Do I need to import a `Decimal` type to hold the result? Nothing.
2. **MongoDB aggregation.** Line 3 tells me `aggregate()` and `groupBy()` throw a `TypeError` and sends me away. The whole Mongo half of "how do I count my documents" is a link. One three-line example would have answered it.
3. **MongoDB comparison methods.** PostgreSQL gets a full table (lines 251–257): `gt`, `like`, `in`, `isNull`, all of it. MongoDB gets exactly one method, `MongoFieldFilter.eq`, used in every example. How do I write "amount greater than 100" on Mongo? How do I write "name in this list"? The page does not say the methods exist or do not exist.
4. **`having()` with more than one condition.** Every example has exactly one comparison. Can I AND two? Does `and(...)` from `@prisma/orm-postgres/orm-client` work inside `having`? No answer.
5. **`having((h) => h.count(...))` with a field.** `aggregate` has both `count()` and `count('quantity')`, but line 197 lists only `count()` for `having`. Is `h.count('quantity')` legal? I cannot tell whether the omission is deliberate.
6. **Chain order.** Line 130 says `limit`/`offset` require `orderBy` first. But the example at line 177 goes `groupBy → orderBy → limit → aggregate`, while line 168 goes `where → groupBy → having → aggregate`. Where does `having` go relative to `orderBy`? Where does `limit` go relative to `having`? I would guess and recompile.
7. **Is `and()` variadic?** Line 309 shows `and(a, b)`. I need `and(a, b, c)` constantly. The page shows two arguments and says nothing.
8. **Chaining three Mongo filters.** `.and(other)` takes one argument. For three conditions do I write `a.and(b).and(c)`? Probably, but the page never shows it.
9. **Awaiting a `GroupedCollection`.** Line 142 says "resolved via `aggregate()`". So is `await ...groupBy('customerId')` an error, or does it return the groups without aggregates? Not said.
10. **`p.embedding.isNull()`** (line 287). `embedding` is not in either schema on this page. I cannot see its type, so I cannot tell what `isNull` means for it.
11. **Grouping-field types in the result.** Line 153 says each row is `{ customerId, orderCount, totalAmount }`. Are the grouping fields typed, or is this `Record<string, unknown>`? Matters immediately in TypeScript.

## Where the page explains internals when I only wanted to know what to do

- **Line 47** — "This is standard SQL: aggregating zero rows yields `NULL`. Their TypeScript return type carries `| null` for this reason." The rule ("`sum` can be `null`; handle it") is enough. The SQL-standard justification and the reasoning about why the type is what it is are backstory.
- **Line 359** — "they compile to SQL `EXISTS` subqueries." I do not need to know the generated SQL to filter users by their posts.
- **Lines 44, 125, 196** — "Calling `aggregate()` on a Mongo collection throws `TypeError`", repeated three times. Telling me the exception class is telling me how the library is built. "Not available on MongoDB" is the fact I need, and once is enough.
- **Line 237** — the import path `@prisma/orm-mongo/query-ast/execution`. "query-ast" is the library's internal architecture surfacing in something I have to type.
- **Line 197** — "returns an object with `eq`, `neq`, ..." as described above.
- **Lines 59–61, 138–142, 208–212** — the "Return type" tables. "Object of aggregate results" and "A grouped collection, resolved via `aggregate()`" restate the example rather than telling me anything I can act on.

## Two structural problems

**The `having()` example appears before `having()` is documented.** The heading at line 165 says "Filter rows, then group (PostgreSQL)", but the code at line 168 contains `.having((h) => h.count().gt(1))`. I hit an undefined method under a heading that does not mention it, and the explanation is 25 lines further down. Either drop `having` from that example or move the section.

**The `all` name collision.** Line 297 flags it honestly: "This `all()` is not the `.all()` you call at the end of a chain to run the query." I still had to read line 320, `where(() => all()).all()`, twice. The note does not rescue the design; it documents that the design will confuse me.

## Could I do what the page is for, after one reading?

**On PostgreSQL, mostly yes.** I could write `aggregate`, `groupBy`, `having`, the scalar comparisons, `and`/`or`/`not`, and `some`/`every`/`none`. The examples are concrete and I can copy them.

**On MongoDB, no.** I would be stuck as soon as I needed anything other than equality. The page gives me `MongoFieldFilter.eq` and nothing else, gives me no aggregation at all, and points me off the page for the part I actually came for.

What I would still not know after one reading:

- Any MongoDB comparison other than `eq`, and whether they exist.
- How to aggregate or group on MongoDB.
- How to call `countBigInt`, `sumBigInt`, or `avgDecimal`, or what type `avgDecimal` gives me.
- The legal order of `where`, `groupBy`, `having`, `orderBy`, `limit`, `aggregate` in a chain.
- Whether `and()` takes more than two conditions.
- Whether `having()` can hold more than one condition.
- Which field types support which comparison methods.
- How to sort groups by a computed total (I know I cannot do it here; I do not know how to do it at all).
- What `MongoAndExpr` is for or how to build one.