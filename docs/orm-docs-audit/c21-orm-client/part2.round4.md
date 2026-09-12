Read once, straight through, as a Prisma ORM 7 user. Findings below. All line numbers are from `/Users/wmadden/Projects/prisma/web/.claude/worktrees/error-reference-follow-ups-81a8e7/wip/c21/r4/part2.mdx`.

## Sentences I could not restate after one reading

**Line 5–10, the MongoDB count example.**
> "On MongoDB, count with `db.query`, the [pipeline builder](...)"
> ```
> const built = db.query.from('posts').count('total').build();
> const [counted] = await (await db.runtime()).query(built);
> ```
Three unexplained things in two lines. `db.query` is a builder, but `(await db.runtime()).query(...)` is a different `query` that runs things — same word, two meanings, no explanation. `db.runtime()` has never appeared; part 1 only showed `db` being made by `postgres(...)`/`mongo(...)`. And `await (await ...)` looks like a typo until I stare at it. Plainest version I'd have understood: "Counting on MongoDB takes two steps. Build the pipeline with `db.query`, then run it with the runtime: `const runtime = await db.runtime(); const [counted] = await runtime.query(built);`"

**Line 118, the whole paragraph.** Five separate rules in one block:
> "`first()` returns `null` on no match and does not check that only one row matched. `findUniqueOrThrow` and `findFirstOrThrow` both map onto `all().firstOrThrow()`, as the last line above shows. `firstOrThrow()` is a method on the result that `all()` gives you, and calling it does not count as using the result a second time."
The middle clause fights what I read 90 lines earlier at line 25: "Each result can be used one way only." I stopped and re-read to work out whether `all().firstOrThrow()` was legal. Also: `all()` loads every row and then throws away all but the first? That's what it looks like, and the page never says whether it actually fetches everything. Split this into a bulleted list and say plainly whether `firstOrThrow()` fetches one row or all of them.

**Line 127.**
> "`db.orm` cannot use your subclass. Call the `orm(...)` function with a `collections` object to get a second accessor with the same methods as `db.orm.public`. You now have two accessors, both of them work, and your existing `db.orm.public.X` calls are unaffected."
I could not tell what I am supposed to do going forward. Do I keep both accessors in my app forever? Do I replace every `db.orm.public.X` with `tasks.X`? The sentence reassures me nothing breaks but never tells me which one to use.

**Line 172.**
> "On PostgreSQL you only get this protection from TypeScript."
I do not know what that means concretely. Does my code fail to compile without `where()`? Is it a red squiggle I can ignore? Is it only in strict mode? Say the literal thing: "On PostgreSQL, `updateAll()` without `where()` does not compile" — or whatever actually happens.

**Line 295 and 597, the error messages.**
> `createAndCount() is not supported for MTI variant "Bug" on model "Task".`
"MTI" is never defined anywhere on this page. I guessed it means the multiple-table storage the surrounding prose describes, but the page uses "variant stored in its own table" in prose and "MTI variant" in the error, and never connects them. Worse, line 597 says `upsert()` is unsupported and the error tells me `Use createAll() instead.` — `createAll()` is not an upsert. Either the error text is wrong or the page copied it wrong. Line 598 then gives me the real answer (`first()` then `create()`/`update()`), which contradicts the quoted message directly above it.

**Line 341.**
> "Putting a field declared on a variant in the update, such as `duration` on `Tutorial`, makes TypeScript complain even though the update runs correctly. Put `// @ts-expect-error` on the line directly above `.update(...)`."
Two ideas fighting: this is a known defect and the fix is to silence the compiler. I understood the words. What I could not work out is the consequence: `@ts-expect-error` itself becomes an error once the underlying problem is fixed, so my build breaks on upgrade. The page does not warn me.

**Line 348.**
> "On PostgreSQL, `update()` takes an object of field values only. Passing a function changes nothing and returns `null`."
So a function argument fails silently and I get the same `null` I'd get from "no row matched"? I re-read this three times to be sure it says what it says. If that is real, say it as a warning, not a remark.

**Lines 422–424.**
> "On MongoDB, `updateAll()` is not a single operation, and two things follow. A document that starts matching your filter only once the call is under way is updated but not returned to you. A document that someone else changes during the call comes back carrying their values, not yours."
I got there eventually, but it took two passes. "starts matching your filter only once the call is under way" is a lot of clause. Plainer: "If a document begins matching your filter while the call is running, it is updated but not included in the returned rows. If someone else changes a matched document while the call is running, you get their version back, not yours."

**Line 591.**
> "Only the column name is used. The value is required by the type and is then ignored, so pass any value of the right type."
I understood each sentence and still did not believe it. The example writes `conflictOn: { label: 'ignored' }`. As a reader I would want one line saying why — is this a temporary limitation or the intended design? Right now it reads like a bug I am being told to live with.

## Words and phrases I had to guess

- **"read terminals" / "mutation terminals"** (anchors on lines 1 and 165). Guessed: the method that ends the chain. Never used in the visible text, so the anchor is the only place the word appears — a reader who lands on that URL gets a word the page never defines.
- **`AsyncIterableResult`** (lines 23, 36, 257, 269, 436, 538). Linked to `#asynciterableresult`, which is not in this part. Guessed: an object you can `await` or `for await`. The table on line 36 says as much, so I coped, but I never learned whether streaming actually keeps memory down or just looks different.
- **`Row`** (lines 36, 92, 202, 365). Guessed: the generated TypeScript type for that model. The page never says where it comes from or how I import it if I want to name it.
- **"contract type"** (line 129, `Collection<Contract, 'Task'>`). Guessed: the type exported by the generated `contract.d.ts`. The import on line 140 says `from './contract.d'`, which looks wrong to me — I would normally write `'./contract'`. I would have to try it.
- **`select()` and `include()`** (lines 351, 400). Used in a full example with no definition anywhere I can see. Guessed from Prisma 7 habit: choose fields, choose relations. The callback form `include('tags', (tag) => tag.select(...).orderBy(...))` is new and unexplained.
- **`orderBy({ createdAt: 1 })`** (line 59). Guessed `1` means ascending. The PostgreSQL tab right above uses `u.email.asc()`, so the two tabs look like different products. Line 26 tells me they differ but the page never says what `1` and `-1` mean.
- **"to-many" / "to-one"** (line 196). Guessed: relation cardinality. Fine, but they appear once with no anchor.
- **"driver session"** (line 424). Guessed: MongoDB's own transaction session object.
- **`client.context`** (lines 128, 157). Guessed: some bundle of state the ORM needs. The page tells me where to get it but not what it is.

## "So what do I actually type?"

1. **Reading an error code.** The page names five codes — `RUNTIME.ITERATOR_CONSUMED`, `RUNTIME.NO_ROWS`, `ORM.WHERE_MISSING`, `ORM.OPERATION_UNSUPPORTED` — and never shows one line of code that catches one. Do I write `catch (e) { if (e.code === 'ORM.NO_ROWS') }`? Is there an error class to `instanceof`? Is `code` typed? Nothing.
2. **The MongoDB `updateAll()` workaround (line 424).** The whole point of the remark is that my writes are unsafe. The fix is a cross-reference and one sentence of prose. I have no code to copy.
3. **The MongoDB count (line 8).** I do not know where `db.runtime()` comes from or whether I should cache the runtime rather than awaiting it per query.
4. **Streaming vs awaiting on writes.** Line 257 says `createAll()` returns something streamable. If I `for await` over `createAll()`, have the rows already been inserted, like `deleteAll()` on line 528? The page answers this for deletes and not for creates.
5. **`firstOrThrow()` has no entry.** It has no heading, no signature, no options table, and no return-type row — just a mention inside a paragraph on line 118. Every other method here gets a full section.
6. **The custom `Collection` subclass.** I have `tasks` at line 155 and `db` from part 1. Do I now call `postgres(...)` twice, or is `client` on line 152 meant to be the same `client` part 1 showed? The example builds a whole new client, so I cannot tell whether I am replacing my setup or adding to it.
7. **`conflictOn` for a multi-column unique constraint (line 592).** The rule is stated; no example is shown. I would have to guess `conflictOn: { orgId: 0, email: '' }`.
8. **Prisma 7 mappings I did not get.** The page maps `findMany`, `findUnique`, `findFirst`, `create`, `update`, `delete`, `upsert`. It never maps `createMany`, `updateMany`, `deleteMany`, or `count`. Those are the four I use most after `findMany`, and `createAll` vs `createAndCount` vs `createMany`'s `skipDuplicates` is exactly the kind of thing I would search this page for.

## Places that explain the inside when I wanted the outside

- **Line 423:** "That happens because the update runs by filter, while the read-back runs by the ids collected before the update." This is the implementation. I wanted to know what to do about it, which is the next line, and that line only links elsewhere.
- **Line 294:** "A variant is stored in its own table when its `@@map` names a different table than its base model does. `Bug` ... maps to `bug` while `Task` maps to `task`." Useful, but it arrives as storage-layout trivia before I am told the practical rule. The practical rule — "if your variant has its own `@@map`, `createAndCount()` and `upsert()` do not work" — should come first.
- **Line 186:** "On MongoDB, `create()` returns the values you passed plus the `_id` the server assigned, not the stored document. On PostgreSQL the returned row is read from the database." I understand why this matters (database defaults won't show up on Mongo) but the page makes me infer that consequence myself.
- **Line 128:** "`orm(...)` takes two things from the client that `postgres(...)` created ... `client.connect()` gives you the `runtime` argument, and `client.context` is the `context` argument." This is wiring narration. The code example on lines 152–159 already shows it more clearly than the prose does.

## Could I do what the page is for, after one reading?

Partly. For the plain cases — yes. I could write `all()`, `first()`, `create()`, `update()`, `delete()`, and their `All`/`AndCount` variants on PostgreSQL, and translate my Prisma 7 `findMany`/`create`/`update`/`delete` calls with confidence. The diff blocks are the most useful thing on the page and I would have gone straight to them.

What I would still not know:

- How to catch and check any of the errors the page keeps naming.
- What `AsyncIterableResult` really costs me — whether `for await` streams from the database or just iterates an array it already fetched.
- Whether `all().firstOrThrow()` fetches one row or the whole table. I would avoid it for that reason alone.
- What `MTI` means, and whether the `upsert()` error message telling me to "Use createAll() instead" is a typo I should ignore.
- What `select()` and `include()` do, or how to write the `include` callback for anything other than the one example.
- How to translate `createMany`, `updateMany`, `deleteMany`, or `count` from my existing code.
- How to make MongoDB `updateAll()` safe. I would leave the page knowing my code has a race condition and not knowing how to fix it.
- Whether I should restructure my client setup to use a custom `Collection`, or leave it alone.

The biggest single blocker is the error handling. The page mentions error codes eight times and never once shows me the `catch`.