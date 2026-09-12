# Reader review: `wip/c21/r2/part2.mdx`

I read it once, top to bottom, as a Prisma ORM 7 user.

## Sentences I could not restate after one reading

**1.** `"On MongoDB, count with the pipeline builder."` (line 5)
Stopped by: "the pipeline builder" is a proper noun I have never seen. It has no link and no definition anywhere on this part. The link that follows goes to a task page for both databases, so I cannot even tell whether I need an import.
Plainer: say what it is, or link the words "pipeline builder" itself.

**2.** `"To register a subclass, build the client with the `orm(...)` function and pass a `collections` object. The client's own `.orm` cannot do this: `postgres(...)` has no `collections` option, so `db.orm` always uses the plain `Collection`."` (line 128)
Stopped by: three ideas in one bullet, and it depends on my knowing that the `db.orm` I have used on every previous example came out of `postgres(...)`. Part 1 never told me that.
Plainer: "`db.orm` cannot use a subclass. Build a second accessor with `orm({ runtime, context, collections })` and use that instead."

**3.** `"Once the type check is bypassed, `update()` and `delete()` change one arbitrary row, and `updateAll()` and `deleteAll()` change every row."` (line 172)
Stopped by: "Once the type check is bypassed" — bypassed how? By me writing `as any`? By calling from JavaScript? The page never says, so I cannot tell whether this warning applies to me at all. "One arbitrary row" is frightening and unexplained: arbitrary by what rule?

**4.** `"It collects the matching ids, updates, then reads those documents back. A document someone else changes in between can come back with their values, and a document that starts matching only after the first step is updated but not returned."` (line 424)
Stopped by: the last clause contradicts the first. If step one collects ids, a document that only starts matching *later* is not in that id list, so how does it get updated? Either the update runs by filter rather than by id, or the sentence is wrong. I could not resolve it.

**5.** `"Only the column name is read: it names the unique constraint the database checks. The value is required by the type but is not used, so it does not have to match the value in `create`."` (line 603)
Stopped by: it tells me the value is ignored, then both examples pass a value that carefully matches. So what do I type? The text and the examples pull in opposite directions.

**6.** `"Every matching row is deleted before the first row reaches you. Stopping the loop early still leaves nothing behind."` (line 540)
Stopped by: "leaves nothing behind" is ambiguous on first read — nothing deleted, or nothing remaining? I had to read it twice to land on "no matching rows survive".

**7.** `"On MongoDB, the `_id` on the returned row is decoded the same way as on a read, so you get a hex string, not the driver's `ObjectId`."` (line 607)
Stopped by: "decoded" describes machinery. The fact I need is "`_id` comes back as a string".

## Words and phrases I had to guess

- **"shorthand object"** (lines 70, 79). Guessed: a plain object of field/value pairs meaning equality. Never defined.
- **"domain methods"** (line 123). Guessed: methods I write myself.
- **"multi-table inheritance variant, a variant stored in its own table"** (line 304). Guessed: some variants live in the base table and some get their own. Part 1 told me variants are "stored with its base model", so this is the opposite and nothing tells me how to declare or recognise which kind I have. "MTI" then appears only inside a quoted error message.
- **"field operations"** (lines 350, 361). Guessed from the example `p.content.set(...)` that these are per-field setter calls.
- **"Single consumption and mode switching"** (line 18). Guessed: awaiting versus `for await`.
- **`AsyncIterableResult`** (lines 16, 260). Guessed correctly from the bullet, but the type itself is never defined in this part.
- **`Collection<Contract, 'Task'>`** (line 141). Guessed the second parameter is the model name. Two unexplained type parameters.
- **`@prisma/orm-postgres/runtime` versus `@prisma/orm-postgres/orm-client`** (lines 136-137). Guessed which exports come from which only by reading the import lines.

## Places I asked "so what do I actually type?"

1. **Counting on MongoDB** (line 5). No snippet, no import, no method name.
2. **Updating a variant-only field on MongoDB.** Line 351 says `duration` on `Tutorial` "is not in it" and that "[Field update operations] shows the workaround" — but never says what the workaround is. That is the one thing I came to this bullet for.
3. **Safe bulk update on MongoDB** (line 425): `"run the writes yourself in a MongoDB driver session"`. No code, and no hint how to get a driver session out of this ORM. The link is to a page that may or may not answer it.
4. **The `data` option name.** Every Options table says the argument is named `data` (lines 194, 266, 312, 361, 431, 465). Every example passes the fields directly, and line 246 says the migration "drops the `data` wrapper". On the tables alone I would have typed `create({ data: { ... } })` and got a type error.
5. **Do I pass `id` on PostgreSQL creates or not?** Line 184 says leave out fields with a default "including the id". Then lines 226, 230, 239, 630, 637 all pass hand-written UUIDs. I cannot tell whether the id has a default, whether passing it is allowed, or whether I am expected to generate UUIDs myself.
6. **`conflictOn` value.** Per point 5 above: any value? The matching value? I would have to test.
7. **Calling `where()` before `upsert()` on PostgreSQL** (line 602): `"where() is not used"`. Does it throw, or is it silently ignored? I do not know whether my existing chain is safe.
8. **The `select`/`include` chain before `.update()`** (lines 400-405). It appears with no comment. I cannot tell whether it shapes the returned row, restricts what is written, or is decoration I can delete.
9. **Which value wins on insert in an upsert.** Line 605 says the `update` value wins "even when the row is inserted" — but that bullet is labelled MongoDB, and the PostgreSQL example at line 628 comments `"the create side is used"`. Opposite behaviours, and Postgres's is never stated as a rule.
10. **Two different `orderBy` syntaxes** appear side by side at lines 45 and 51 (`(u) => u.email.asc()` versus `{ createdAt: 1 }`) with no note that they differ by database.
11. **Coming from ORM 7, what replaces `findUniqueOrThrow` / `findFirstOrThrow` / `count()` / `deleteMany` return shape?** Line 114 maps `findUnique` and `findFirst` onto `first()` but says nothing about the throwing variants, and does not say whether `first()` still enforces uniqueness.
12. **Which `db` am I holding?** Line 154 builds `const db = orm({...}).public` and then calls `db.Task.bugs()`. Everywhere else it is `db.orm.public.User`. Nothing says the two are the same kind of thing or whether I now keep two clients.

## Places that explain the machinery when I only wanted the instruction

- Line 128: `"The client's own `.orm` cannot do this: `postgres(...)` has no `collections` option"` — internal reason for a restriction.
- Line 158 comment: `"client.context carries the contract, which orm() needs to build collections."` — I only need to know I must pass it.
- Line 186: `"It does not read the stored document back."`
- Line 354: `"On MongoDB, `update()` changes one document in a single database operation."` Floating fact with no consequence stated here.
- Line 355 with line 352: `"it also returns `null` when the data you pass has no fields to change, which is what happens if you pass a function by mistake."` This is a defect explained twice, in mechanism terms. The instruction is one line: on PostgreSQL, pass an object.
- Line 424: the three-step description of `updateAll()`.
- Line 603: `"it names the unique constraint the database checks"`.
- Line 607: `"is decoded the same way as on a read"`.

## Two things that read as errors

- Line 606: the `upsert()` failure message says `"Use createAll() instead."` `createAll()` does not upsert. Either the message is wrong or the page is quoting it wrong.
- Line 172 quotes a MongoDB error that names `updateAll()` specifically, but the warning covers `update`, `delete`, `updateAll`, and `deleteAll`. I cannot tell whether the runtime check exists for all four.

## Could I do what the page is for after one reading?

Partly.

I could confidently write: `all()`, `first()`, `create()`, `createAll()`, `createAndCount()`, `update()`, `delete()` and their `-All`/`-AndCount` forms on PostgreSQL, plus the plain MongoDB equivalents. The ORM 7 diff blocks are the most useful thing on the page and did most of that work.

I would still not know:

- How to count on MongoDB.
- How to update a field that only exists on a variant, on MongoDB.
- Whether my variant is the "multi-table inheritance" kind, so whether `createAndCount()` and `upsert()` work at all.
- Whether to pass `id` on PostgreSQL creates.
- What value to put in `conflictOn`, and which side wins on insert in a PostgreSQL upsert.
- How to register a `Collection` subclass without copying the example blind — specifically what `context` is, whether I now have two clients, and why my existing `db.orm` cannot be used.
- How to do a safe bulk update on MongoDB.
- What `AsyncIterableResult` is, beyond "await it or loop it".