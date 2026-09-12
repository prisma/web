Read once, top to bottom, as a Prisma ORM 7 user. Findings below.

## Sentences I could not restate after one reading

**Line 3** — "Static factories that build MongoDB filter expressions."
Stopped by: "static factories" and "filter expressions." I know what a static method is, but I do not know what a "filter expression" is in this product, or why I would build one instead of passing a plain object to `.where()`. The page never says what problem these solve. Plainest wording I would have understood: "Helpers for filters you cannot write as a plain object, such as comparisons, `in`, and paths into embedded objects."

**Line 7** — "Imported from `@prisma/orm-mongo/query-ast/execution`."
Stopped by: `query-ast`. That is your internal module layout. I have to type it, so I accept it, but nothing tells me what it means or whether there are other things in it I should know about.

**Line 10** — "`isNull` / `isNotNull` are shorthand for equals-null and not-equals-null, not a `$exists` check."
Stopped by: this assumes I already know that in MongoDB a field set to `null` and a field that is absent are different things, and that equals-null matches both. The sentence tells me the two are not the same but not what the difference does to my results. Plainer: "`isNull` matches documents where the field is `null` and documents where the field is missing. To test only whether the field is present, use `MongoExistsExpr`."

**Line 12** — "The factories `exists`, `regex`, `elemMatch`, `all`, and `size` do **not** exist on `MongoFieldFilter`."
Stopped by: it lists `exists` as missing one line after line 11 told me to use `MongoExistsExpr.exists`. On one reading those two lines fight each other. Also I do not know what `elemMatch` is, so "does not exist" tells me nothing I can act on.

**Line 20** — "`gt` / `lt` / `gte` / `lte` `(field, value)` | Field + ordered value | Ordered comparisons."
Stopped by: "ordered value" and "ordered comparisons" say the same vague thing twice and neither says what types are allowed. The row is also mangled: the argument list sits outside the code span for three of the four names. Plainer: "A value that can be compared, such as a number, a date, or a string."

**Line 65** — "`MongoWhereFilter` is typed against the model's own top-level field names. `{ 'address.city': ... }` is therefore a compile error without a cast."
Stopped by: `MongoWhereFilter` appears here for the first time and is never defined. I guessed it is the type of the plain object I pass to `.where()`. Two ideas in one sentence: what the type allows, and what breaks because of it.

**Line 86** — the whole paragraph. Too many ideas in one block:
- "The callback receives one argument, written `u` or `t` below" — I stopped to work out whether `u` and `t` mean different things. They do not; they are just variable names in different examples. Saying it this way made me look for a distinction.
- "The argument is also a function, so `u('address.city').set('San Francisco')` reaches a field inside an embedded object." — one value being both an object with properties and a callable function is surprising. The page states it and moves on. I would have understood: "Call the argument as a function when the field is inside an embedded object: `u('address.city').set(...)`. Use the property form for top-level fields: `u.bio.set(...)`."
- "Each call returns an update instruction; collect them in the array you return." — "update instruction" is your internal name for the thing. As a reader I only need "return an array of the calls you made."

**Line 88** — "`updateAll()` returns the changed documents."
Stopped by: line 172 later says `updateAll()` returns an `AsyncIterableResult`. On first reading these look like two different answers. Line 88 should say what the result type is, or say nothing.

**Line 100** — "The callback argument is typed against the collection's base model, even after `variant(...)`. TypeScript only knows the base model's fields, so `t.duration.inc(10)` is a type error even though it runs correctly. Put `// @ts-expect-error` on that line to accept it."
Stopped by: this is an explanation of a limitation in your type generation, told from the inside. I only wanted to know what to type. Also "on that line" is ambiguous — the error is inside the callback but the example puts the comment above `.update(`. I could not have guessed that placement from the sentence.

**Line 135** — "That callback cannot use a dot path, and `upsert()` rejects one."
Stopped by: "rejects" — at compile time or at runtime? If at runtime, what error do I catch? The page gives an error code elsewhere (`RUNTIME.ITERATOR_CONSUMED`) so I expected one here.

**Line 156** — "`addToSet()` and `pop()` are covered only by unit tests that check the operator they build."
Stopped by: this is about your test suite, not about my code. I do not know what I am supposed to do with it. Am I being told not to trust them?

**Line 159** — "One update cannot touch the same field twice, so the lines below are four separate writes."
Stopped by: I read the first half as a rule I need to obey, then the second half revealed it is an excuse for how the example is formatted. Plainer: "These four lines are separate calls because a single update cannot apply two operations to the same field."

**Line 209** — "`sum()`, `avg()`, `min()`, and `max()` carry `| null`."
Stopped by: "carry `| null`" is shorthand for "their TypeScript type includes `null`." I worked it out, but it reads like notation, not a sentence.

## Words and phrases I had to guess

- **"static factories"** (line 3) — guessed: methods on the class you call without creating an instance.
- **"filter expressions"** (line 3) — guessed: the object the query builder actually sends to MongoDB.
- **"query-ast"** (line 7) — guessed: abstract syntax tree, your internal query representation.
- **"raw MongoDB operator string"** (line 9) — guessed: a literal like `'$regex'`, quoted, dollar sign included. The example confirmed it, the sentence did not.
- **"ordered value"** (line 20) — guessed: a number, date, or string.
- **`MongoWhereFilter`** (line 65) — guessed: the type of the plain object form of `.where()`.
- **"update instruction"** (line 86) — guessed: whatever `u.bio.set('x')` returns; an opaque value I just put in the array.
- **"the collection's base model"** (line 100) — guessed: the model named by `@@base`, from the earlier part of the page.
- **"the group key field or fields"** (line 208) — guessed: you can pass more than one field to `groupBy`, though nothing shows that.
- **"Options"** (line 14, heading) — guessed: this is a methods table, not options. The heading is wrong.

## Places I asked "so what do I actually type?" and got no answer

1. **How do I combine two filters?** This is the largest gap. Every example has exactly one condition. I cannot find out how to write "name is Alice AND createdAt after X" with `MongoFieldFilter`. Do I pass an array? Call `.where()` twice? Is there an `and`/`or` factory? The page does not say, and I need this in almost every real query.
2. **Can I mix a plain object and a `MongoFieldFilter` in the same `.where()`?** Never addressed.
3. **`MongoExistsExpr`** — line 11 names two methods. Does it have others? Does it combine with `MongoFieldFilter`? No `#### Options` table for it, unlike `MongoFieldFilter`.
4. **Regex options.** `of('title', '$regex', '^Hello')` is shown. How do I pass case-insensitivity (`$options: 'i'`)? The `of` signature takes one value, so I cannot see where it goes.
5. **`pull(match)`** — line 157 says it removes "every element matching a partial object." No example of the partial-object form. I do not know what to type.
6. **What happens if I omit `.where()`?** Line 88 says all four methods "require" it. Compile error or runtime throw? Not said.
7. **PostgreSQL increment.** Line 86 tells me PostgreSQL has no callback form and links to `update()`. It never says what I do instead. If I am on PostgreSQL, I have just read a long section that does not apply and got no replacement.
8. **Two casts.** Line 81 is `as unknown as Record<string, unknown>`. Why two? A reader who tries the single cast first will fail and not know why.
9. **`@ts-expect-error` placement.** The example shows the comment above `.update(`, but line 100 says "on that line." Which line, when the call is chained across four lines? And this comment fails the build if you ever fix the type, which the page does not warn about.
10. **Catching the consumed-iterator error.** Line 197 does `error instanceof Error && 'code' in error && error.code === ...`. Is there an exported error class I could `instanceof` instead? That is the first thing I would ask, and the page does not say.
11. **Aggregate functions.** Line 207 uses `agg.count()` and `agg.sum('amount')`. There is no list of what `agg` offers; `avg`, `min`, `max` only appear incidentally in line 209. No signature for any of them.
12. **`groupBy` with more than one field.** Line 208 implies it is possible ("field or fields") but every example passes one string.
13. **Array ops in one call.** Line 159 says one update cannot touch the same field twice. Can I push to `tags` and set `bio` in one call? Presumably yes, but after that warning I would not risk it without an example.

## Places that explain the internals when I only wanted to know what to do

- **Line 8** — "Exactly eleven factories exist... There is no `ne`; use `neq`." The count is an inventory note for whoever audited the API. I only need the list and the correction.
- **Line 12** — reciting five factories that do not exist, three of which (`elemMatch`, `all`, `size`) I had not heard of.
- **Line 64** — "the TypeScript types do not know nested paths, so the object form needs a cast." This is why your types are limited. The instruction is the last clause: use `MongoFieldFilter.eq`. Lead with it.
- **Line 100** — an explanation of how `variant()` interacts with generated types. What I need is the one line about `@ts-expect-error`.
- **Line 156** — your unit-test coverage.
- **Line 158** — "MongoDB rejects the write with its own error, not a Prisma ORM error." Telling me whose error it is, without showing me the error, does not help me handle it.
- **Line 152** — the heading anchor is `[#array-operations-mongodb-unverified]`. The word "unverified" is an internal status note and it will show up in the page URL. A reader who lands on that link will wonder what is unverified.

## Could I do what the page is for, after one reading?

Partly. I could write a single-condition MongoDB filter (`MongoFieldFilter.eq`, `gt`, `in`, `isNull`) and I could write a single-field update (`set`, `inc`, `push`). Those parts have complete examples I can copy.

What I still would not know:

- How to write a filter with more than one condition. This alone blocks most real work.
- What `MongoFieldFilter` is for at all, versus just passing `.where({ name: 'Alice' })`. The page never compares them, so I do not know when to reach for it.
- How to do any of this on PostgreSQL. Roughly half the page is marked "MongoDB" and the PostgreSQL path is a link.
- What `agg` supports, and how to group by more than one field.
- Whether `addToSet` and `pop` are safe to use, because line 156 raised a doubt and did not resolve it.
- What to catch when `upsert()` "rejects" a dot path, or when MongoDB rejects an array operation on a non-array field.

One more structural note: the table under `#### Options` is a list of methods, and the same heading pattern (`Remarks` / `Options` / `Examples`) is applied to sections that are not API members at all, such as "Dot-notation into an embedded object." Reading top to bottom, I expected `Options` to mean configuration and kept being wrong.