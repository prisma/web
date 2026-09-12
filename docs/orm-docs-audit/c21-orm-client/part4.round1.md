Read once, top to bottom, as a Prisma 7 user who has never seen ORM 8.

## Sentences I could not restate after one reading

**1.** Line 20: *"Each operation targets a field and produces a Mongo update operator."*
Stopped by: this tells me what happens inside the library, not what I get back. Does `u.bio.set('x')` return something I have to do anything with? I think the answer is "no, just put it in the array" — but the sentence made me stop and wonder. Plainer: delete it, or say "each call returns an update instruction; collect them in the array you return from the callback."

**2.** Line 32: *"The field accessor is typed against the collection's **base** model, even after `variant(...)`. Accessing a variant-only field (such as `Tutorial.duration`) inside a callback is a compile error, though it works correctly at runtime because the accessor is a `Proxy` that resolves any field name."*
Three things at once, and the conclusion is missing. It tells me my code will not compile and also that it works. So what do I actually do — `@ts-expect-error`? `as any`? Give up? The page immediately shows me the exact broken case as a worked example (`t.duration.inc(10)`, lines 47-55) without a single word saying "this example does not type-check." I would have copied it, hit a red squiggle, and assumed I'd made a mistake. Plainer: "TypeScript only knows the base model's fields, so `t.duration.inc(10)` is a type error even though it runs correctly. Work around it with X."

**3.** Line 68: *"These are library gaps, not contract limitations."*
Stopped by "contract." I do not know what a contract is here. I cannot tell what the distinction buys me as a reader — either way the method does not exist. Plainer: delete the sentence.

**4.** Line 78: *"they are **unverified** on the current test contract, which has no array (`many: true`) field to target."*
Stopped by "current test contract." This is a fact about Prisma's internal test suite, not about my code. It also makes "unverified" sound like a property of the API rather than a property of your testing. Plainer: "We have not tested these. Try them against a real array field before relying on them."

**5.** Line 95: *"Awaiting a result and then iterating it with `for await` (or the reverse) is the failure mode."*
"is the failure mode" is a phrase I had to re-read. It means "that is the thing that throws." Say that.

## Words and phrases I had to guess

- **"field accessor"** — guessed: the `u` / `t` object handed to the `update()` callback, and `u.bio` is the per-field thing. The page never defines it before using it four times, and defines it only obliquely via the Proxy remark.
- **"variant('Tutorial')"** — guessed: some subtype/discriminator of the `posts` collection. Possibly explained in an omitted section, but line 32 leans on it heavily.
- **"contract"** / **"test contract"** — guessed: your internal test schema. Still not sure.
- **"dual interface"** (line 85) — guessed: "you can use it two ways."
- **"`RUNTIME.ITERATOR_CONSUMED`"** — guessed: an error code string on a thrown error object. I do not know what property it is on, or what class the error is.
- **"`many: true`"** (line 78) — guessed: the schema syntax for an array field. Appears here with no other mention.
- **"base model"** (line 32) — guessed: the parent of a variant.

## "So what do I actually type?" — unanswered

- **`updateAndCount()` and `upsert()` callbacks.** Line 20 says field operations work in all three. Every example is `update()`. `upsert()` in particular — where does the callback go relative to the create branch? Not shown.
- **Why the callback returns an array.** Every example returns a one-element array, `[u.bio.unset()]`. The page never says I can put several operations in it, never shows two, and never says whether order matters. I inferred the point of the array from its shape alone.
- **What `update()` returns.** Every example writes `const updated = await ...` and then never uses `updated`. Is it the row? A count? The example names imply a row; nothing says so.
- **The workaround for the variant type error** (see above). This is the single biggest gap on the page.
- **The import for MongoDB users.** Line 85 gives `@prisma/orm-postgres/components/runtime`; line 108 says the behavior is shared by both. If I am on MongoDB, do I import `AsyncIterableResult` from the Postgres package? From a Mongo package? Not said.
- **How to catch `RUNTIME.ITERATOR_CONSUMED`.** I get an error code and a message substring. I do not get: what to `catch`, whether there is a typed error class, or whether I am meant to match on `.code`.
- **Two different client shapes, unreconciled.** Field-op examples use `db.orm.users` and `db.orm.posts`. The result-type example uses `db.orm.public.User.all()`. Same page, different accessors, different casing, no word about why. I would not know which one to type.
- **`aggregate((agg) => ({ ... }))`.** Line 112-113 tells me the result shape but never shows one real aggregate expression, so I do not know how `total`, `orderCount`, `totalAmount` were produced. I cannot write the call from this section.
- **`push`, `pull`, `addToSet`, `pop`.** Listed twice as existing, never shown once. I do not know their arguments — does `pull` take a value or a filter? Does `pop` take `1`/`-1` like Mongo, or nothing?
- **Line 71: *"Do not use these operations; they are not supported."*** The preceding sentence is about `rename`. For a second I read "these" as the eight operations in the same sentence's first clause.

## Places explaining the internals when I only wanted to know what to do

- Line 32 and line 71: the `Proxy` explanation, twice. I do not care that it is a Proxy. I care that (a) the type error is yours not mine, and (b) a typo'd operation fails at call time with `TypeError` instead of at compile time. Line 71 does at least land on the consequence; line 32 does not.
- Line 20: *"produces a Mongo update operator."*
- Line 68: *"The library never generates `$min`, `$max`, `$rename`, or `$currentDate`."* — I already know they do not exist from the previous sentence.
- Line 78: *"which has no array (`many: true`) field to target"* — your test suite's shape.
- Line 94: *"it returns the cached array, with no re-query and no throw."* — "no re-query" is implementation. "Safe, returns the same array" is what I need.

## Could I look up a method and use it correctly after one reading?

For `set`, `unset`, `inc`, `mul` on a non-variant field: yes. Those four are clear, and the missing-field behavior for `inc` and `mul` is genuinely useful and well stated.

For everything else, no. Specifically I would still not know:

- What to type to update a variant-only field without a compile error — and the page's own example is the broken case, unmarked.
- Which client shape is real: `db.orm.users` or `db.orm.public.User`.
- The signatures of `push`, `pull`, `addToSet`, `pop`.
- How to call `aggregate()` at all — only what comes back.
- Where a MongoDB user imports `AsyncIterableResult` from.
- How to catch the consumed-iterator error in code.
- Whether I can return more than one operation from the callback.

The `AsyncIterableResult` section is the strongest part of the page: the rule is stated, the safe case and the throwing case are both shown in one snippet, and the `count`/`sum`/`avg` null behavior on line 114 is exactly the kind of fact I would come to a reference for.
