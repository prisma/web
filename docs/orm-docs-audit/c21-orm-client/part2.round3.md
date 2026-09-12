Read once, top to bottom, as a Prisma ORM 7 user.

## Sentences I could not restate after one reading

**1. Line 131 — "The accessor `orm(...)` returns has the same methods as `db.orm.public`. You keep the `postgres(...)` client as well, for `connect()` and for the `context` you pass to `orm(...)`."**
What stopped me: four things I have never seen (`postgres(...)`, `connect()`, `client.context`, `runtime`) in two sentences, none of them defined. Also the first sentence's grammar ("The accessor `orm(...)` returns has") made me re-read it three times.
Plainer: "`orm({ runtime, context, collections })` returns an accessor with the same methods as `db.orm`. Keep the client you got from `postgres(...)`: you need `client.connect()` for the runtime and `client.context` for the `context` argument."

**2. Line 130 — "`db.orm` cannot use your subclass. Build a second accessor by calling the `orm(...)` function with a `collections` object, and use that accessor for the models you subclassed."**
What stopped me: "second accessor" — second to what? And the whole rest of the page says `db.orm.public.User`, while this example makes `db` mean something different (`const db = orm({...}).public`, then `db.Task.bugs()`). Two different `db` variables on one page. I genuinely could not tell whether I now have one client or two, and whether my other queries still work.

**3. Line 121 — "For the throwing forms, `findUniqueOrThrow` and `findFirstOrThrow` map onto `all().firstOrThrow()`, which throws an error whose `code` is `RUNTIME.NO_ROWS`."**
What stopped me: `firstOrThrow()` appears here once and nowhere else — no section, no example. And line 18 just told me a result "can be used one way only", so calling a method on `all()` looked like the thing I was warned not to do. Plainer: show the line — `await db.orm.public.User.where({ email }).all().firstOrThrow()` — and say that `firstOrThrow()` is a method on the result.

**4. Line 419 — "On MongoDB, `updateAll()` is three database operations. First it collects the ids of the documents that match your filter. Then it updates every document that matches that filter, not only the ids it collected. Then it reads back the documents whose ids it collected."**
What stopped me: too many ideas at once, and the "not only the ids it collected" clause is a correction folded into the middle of a list. I needed line 420 to work out what line 419 meant.

**5. Line 344 — "A field declared on a variant, such as `duration` on `Tutorial`, is a TypeScript error even though it runs correctly."**
What stopped me: "is a TypeScript error" for a *field* — I had to guess it means "putting that field in the update object makes the compiler complain, but the update works". I also could not tell if this applies to `updateAll()` and `updateAndCount()` too.

**6. Line 347 — "On PostgreSQL it also returns `null` when what you pass has no fields to change."**
Could not resolve: does "no fields to change" mean an empty object `{}`, or an object whose values already match the row? Those are very different, and the difference decides whether a `null` return means "not found" or "nothing to do".

**7. Line 596 — "`conflictOn` takes one unique column with a value... The value is required by the type and is then ignored, so pass any value of the right type."**
I followed it, but only after the code comments. My question afterwards: what do I do when the unique constraint is on two columns together? The page never says.

**8. Line 602 — "That advice is the library's own. `createAll()` inserts rows and has no update half, so use it when the rows are new."**
What stopped me: the page is telling me its own error message gives bad advice, then does not tell me what to do instead. If I need upsert behaviour on a `Bug`, I finish this bullet knowing only that I cannot have it.

## Words and phrases I had to guess

- **"shorthand object"** (line 71, 79) — guessed: a plain `{ field: value }` object meaning equality, as opposed to the `(p) => p.x.eq(...)` callback. Never defined.
- **"terminals"** in the heading anchors `#read-terminals` and `#mutation-terminals` — guessed: internal jargon for "the method that ends the chain". The prose says "read method" and "write method", which is clear; the anchor uses a word the page never uses.
- **"child-owned relation" / "parent-owned relation"** (anchors on lines 226, 237) — guessed: which side stores the foreign key. The visible heading says it plainly; only the anchor uses the jargon.
- **"MTI variant"** (line 298) — the page does expand it, but only as "what the error message calls it". I guessed that a variant with its own `@@map` table is what "multi-table inheritance" means.
- **`@@map`** (line 297) — guessed: a schema attribute setting the table name. Not defined in this part.
- **"field operations" / "field-operations callback"** (line 343, 353) — guessed from the example `(p) => [p.content.set('Rewritten')]`: return an array of per-field set calls. The definition is promised at `#field-update-operations` and not given here.
- **`/runtime` and `/orm-client`** (line 140) — guessed: subpath imports of the package.
- **"`context`" and "`runtime`"** (line 155-162) — I could copy the code but I do not know what either is.
- **"variant stored in its own table"** — guessed it means a separate physical table, so a single INSERT cannot return a count.

## Places I asked "so what do I actually type?" and got no answer

1. **Counting on MongoDB** (line 5). "count with `db.query`, the pipeline builder. It is already on your client, so there is nothing extra to import." I still cannot write the line. Counting is the most ordinary thing I do; sending me to another page for it is the worst omission on the page. The PostgreSQL form is given inline — give the MongoDB one too.
2. **`firstOrThrow()`** (line 121). No example anywhere.
3. **The `@ts-expect-error` line** (line 344). "as shown under Field update operations" — I have to leave the page to see one comment-and-line snippet.
4. **Grouping MongoDB writes** (line 421). "share one `MongoClient` with the MongoDB driver and group the writes in a driver session" — no code. This is the fix for a correctness problem the page just told me I have.
5. **Building the client at all** (line 155-157). The subclass example is the only place `postgres(...)`, `connect()`, and `context` appear, and it presents them as things I already do. Every other example starts from a `db` that appeared from nowhere.
6. **Array vs object in nested relation calls.** `posts.create([{...}])` and `tag.disconnect([{...}])` take arrays; `user.connect({...})` takes an object. I guessed it follows to-many vs to-one. The page never says.
7. **Upserting a variant stored in its own table** (line 601-602). See above.
8. **Does `upsert()` count as one of the "six methods" that throw `ORM.WHERE_MISSING`?** The warning (line 175) says "all six methods" and is titled "Filter before you update or delete", but line 594 says MongoDB `upsert()` needs `where()` too. I cannot tell whether a missing `where()` on `upsert()` throws or silently upserts the wrong document.
9. **Omitting fields on PostgreSQL `create()`** (line 187). "leave out any field your contract gives a default, including the id" reads as an instruction. Must I omit them, or may I? If I pass an explicit id, does it error?

## Places that explain the internals when I only wanted to know what to do

- **Line 419** (the three MongoDB operations). The consequences on line 420 are what I need. The step-by-step mechanism is the implementation, and it is given first and at greater length.
- **Line 298** — telling me what the error message's wording is short for is describing the library's internal vocabulary. What I need is "you cannot use `createAndCount()` here; use `createAll()`", which line 296 already says.
- **Line 595-596, 613** — the fact that `conflictOn`'s value is ignored is a quirk I must know, but the page states it three separate times (bullet, table row, trailing sentence, plus two code comments). Once is enough.
- **Line 175** — "On PostgreSQL nothing checks at run time. TypeScript refuses to compile these methods without a `where()`, so the risk is code that escapes the type check, such as JavaScript or a cast to `any`." This is a description of how the safety check is implemented. What I need is: "on PostgreSQL you only get this protection from TypeScript."

## Could I do what the page is for, after one reading?

Mostly yes for plain CRUD. I could write `all()`, `first()`, `create()`, `createAll()`, `update()`, `delete()` and their `*All`/`*AndCount` forms on either database, and the ORM 7 diffs made the mapping from `findMany`/`findUnique`/`create`/`update`/`delete`/`upsert` easy. The warning about filtering before update or delete landed. The note that `deleteAll()` deletes everything before the first row reaches you is the single clearest sentence on the page.

What I would still not know:

- How to count rows on MongoDB.
- How to throw instead of getting `null`, beyond the name `firstOrThrow()`.
- How to construct the client at all — `postgres()`, `connect()`, `context`, `runtime` are used but never introduced, so the `Collection` subclass example is copy-paste only, and I would not know how to adapt it.
- Whether subclassing means I now have two accessors to keep straight, and what happens to my existing `db.orm.public.X` calls.
- What "field operations" are, or how to write the `@ts-expect-error` line I am told to write.
- How to upsert a variant that lives in its own table.
- Whether a missing `where()` on `upsert()` is checked.
- What `select()` and `include()` do beyond a code comment saying they "shape the row you get back".

One concrete inconsistency worth fixing regardless of the reader question: line 601 quotes the `upsert()` error as saying `Use createAll() instead.` and line 602 concedes that advice does not fit. If the message is really that, say what the reader should do; if it is not, the quote is wrong.