# Reader review — `wip/c21/r4/part4.mdx`

I have used Prisma ORM 7 for two years. Here is what happened on one read.

## Sentences I could not restate after one reading

**1.** "You can also write `.where({ 'address.city': 'San Francisco' })`. It works, but TypeScript rejects it unless you add a cast, because `.where()` only accepts your model's top-level field names."

"It works, but TypeScript rejects it" reads as a contradiction until you work out that "works" means "at runtime". Plainer: "That object form runs correctly, but it does not type-check: `.where()` only knows your model's top-level field names, so you must cast."

**2.** "After `variant(...)`, `t.duration.inc(10)` is a type error even though it runs correctly. Put `// @ts-expect-error` on the line directly above the `.update(...)` line, as the example below shows. If that type error ever goes away, TypeScript reports the comment as unused, and you delete the comment then."

Three ideas in one bullet and the last sentence is backwards. I could not tell whether this is a known bug I should report, a permanent design, or something I did wrong. The example also contradicts the instruction: the comment sits above the `.update(...)` line in the example, but the prose in the second example block says "each line that touches it needs `// @ts-expect-error`" — those are different rules.

**3.** The whole paragraph under the heading `##### unset() (MongoDB)`:

"`updateAndCount()` takes the callback in the same place. `upsert()` takes it as its `update` key, beside `create`, and [`upsert()`](#upsert) shows a full call. That callback cannot use a dot path. Given one, `upsert()` throws an error whose `code` is `ORM.OPERATION_UNSUPPORTED`."

Nothing here is about `unset()`. It is filed under the wrong heading. And "That callback" has two candidates in the preceding sentence (`updateAndCount`'s and `upsert`'s); I had to guess it means `upsert`'s only.

**4.** "Applied to any other field, the write fails with an error raised by MongoDB, not by Prisma ORM. In a `catch` block, `isRuntimeError(error)` is `false` for it and there is no `error.code` to match, so read the message."

`isRuntimeError` has not been introduced at this point in the page — it is first explained 25 lines later. And "read the message" tells me to read something the page never shows. Read it and match on what?

**5.** "`pop(1)` removes the last element, and `pop(-1)` removes the first. Those are MongoDB's own `$pop` values."

Fine until the second sentence, which is trivia about where the numbers come from. It does not tell me anything I can act on.

**6.** "// all() returns the result object straight away and `await` is what runs the query, so this example holds it in a variable."

I had to read this twice. It is the only place the page tells me `all()` is lazy — a fact that changes how I write code — and it is buried in a code comment.

## Words and phrases I had to guess

- **`updateAndCount()`** — never defined anywhere on this page. It appears first in the "Field update operations" intro as if I already know it. I guessed it is like `updateAll()` but returns a count instead of the rows. The page later half-confirms that, but never says whether it exists on PostgreSQL.
- **"Field + a value of any type"** in the `gt`/`lt` table row, versus plain "Field + value" for `eq`. I guessed the difference is meaningless. If it is meaningless, make both rows say the same thing. If it means "no type-checking against the field's declared type", say that.
- **"the callback's argument"** — used about ten times. I guessed it means the `u` / `t` object. Naming it once ("the update builder, `u` in these examples") and then using that name would have saved me.
- **`variant('Tutorial')`** vs the base `Post` — I could follow this from the prompt context, but the sentence "`duration` is declared on `Tutorial`, not on the base `Post` model" is the only place this page explains why a type error is expected, and it sits under one heading while the rule sits under another.
- **"mutation terminals"** — the link `[Write methods](#mutation-terminals)`. The visible text says "Write methods"; the URL says something else. I guessed they are the same thing. Internal vocabulary leaking into a URL.
- **`[#array-operations-mongodb-unverified]`** — the literal word "unverified" in the heading id. I guessed this section has not been tested and I should not trust it. If that is true, say it. If it is not true, this should never have shipped.
- **`_id: '6650f1c2a1b2c3d4e5f60002'`** — a plain string. In Prisma 7 I passed ObjectId-ish values. I guessed a hex string is accepted and converted. The page never says.

## Places I asked "so what do I actually type?"

**1. Combining two `MongoFieldFilter`s.** The opening paragraph says "To join two conditions with AND or OR, see Combinators." It never shows whether I can just pass two filters to `.where()`, or whether `.where(a).where(b)` chains as AND. That is the first thing I would try.

**2. Atomic increment on PostgreSQL.** "PostgreSQL has no callback form: pass an object to `update()` instead." So how do I increment a counter on PostgreSQL without a read-modify-write race? Prisma 7 had `{ increment: 1 }`. The page does not say whether that still exists, or points me nowhere.

**3. Array operations on PostgreSQL.** Same gap. `push`, `pull`, `addToSet`, `pop` are all marked MongoDB. Postgres has arrays. The page is silent.

**4. The array examples do not run.** "The example schema has no array field, so these four lines assume `tags String[]` on `User` and will not run against the schema on this page." So I cannot copy anything. Add `tags String[]` to the example schema, or show the contract line beside the code.

**5. The cast.** `as unknown as Record<string, unknown>` throws away the typing of every other key in that object. The page does not warn me, and does not say whether this is the recommended route or the one I should avoid in favour of `MongoFieldFilter.eq`.

**6. Reading the raw MongoDB error.** Told to "read the message", shown no message and no example `catch`.

**7. Does `.where({})` satisfy the "all four methods require `.where()`" rule?** If I want to update every document, what do I type? The page says only that the absence of `.where()` throws `ORM.WHERE_MISSING`.

**8. Reusing an `AsyncIterableResult`.** I know awaiting twice is safe and switching modes throws. I do not know whether looping twice is safe. That is the case I would actually hit.

## Places explaining internals when I only wanted the instruction

- "`of` does no checking of its own, so a misspelled operator such as `'$regexp'` fails at the database, not in TypeScript." The useful half is "typos are not caught until the query runs". Where the check does not happen is internals.
- "Those are MongoDB's own `$pop` values."
- "an error raised by MongoDB, not by Prisma ORM" — I care that `error.code` is absent, not whose code threw.
- "There is no error class to test with `instanceof`." Then just tell me what to do: import `isRuntimeError` and check `error.code`.
- "`sum()`, `avg()`, `min()`, and `max()` resolve to `null`, not `0`, over an empty result set, so their TypeScript type includes `null`." The trailing clause restates the first clause in compiler terms.

## Formatting bug

Line 105 ("These examples use the MongoDB accessors from…") is immediately followed by the `##### set() (MongoDB)` heading with no blank line between them.

## Could I do what the page is for, after one read?

Partly.

**Yes:** I could write MongoDB filters with `eq`/`gt`/`in`/`isNull`, reach into an embedded object with a dot path, run `set`/`unset`/`inc`/`mul` on MongoDB, and read a `groupBy().aggregate()` result shape correctly.

**Still would not know:**

- How to do an atomic increment or an array push on PostgreSQL, or whether it is possible at all.
- Whether `updateAndCount()` exists outside MongoDB, and what it actually returns beyond "a number".
- How to AND or OR two `MongoFieldFilter`s without leaving the page.
- What the raw MongoDB error looks like when I `pull` on a non-array, so I cannot write the `catch`.
- Whether the `// @ts-expect-error` workaround is a bug I should expect to be fixed, and whether I need one comment per line or one per call.
- Whether the array-operations section is trustworthy, given the word "unverified" is in its own heading id and its examples admittedly do not run.