Read it once, top to bottom, as a Prisma 7 user looking something up. Report below.

## Sentences I could not restate after one reading

**1.** "On **PostgreSQL** only `update()` and `delete()` are typed to require a prior `where()`, and even there it is a **type-only** guard with no runtime check. If you bypass the type system, `update()` and `delete()` do not throw and do not mass-mutate; they narrow to a single row by identity (a `SELECT ... LIMIT 1` over the current, possibly empty, filters, then act on that one row)."

What stopped me: four ideas jammed together, and "bypass the type system" is never explained (do I mean `as any`? plain JavaScript? a dynamic call?). "narrow to a single row by identity" is an invented phrase — identity of what? And "possibly empty filters" contradicts "narrow to a single row." Plainest wording I'd have understood: "On PostgreSQL, TypeScript will refuse to compile `update()` or `delete()` without `where()`, but nothing checks at runtime. If you call them from JavaScript with no filter, they pick one arbitrary row and change or delete that row."

**2.** "**Switching consumption mode** on a consumed result throws `RUNTIME.ITERATOR_CONSUMED` (`already been consumed`)."

"Consumption mode" is not defined anywhere on this part of the page. I *guess* it means: you awaited it, now you can't `for await` it, or vice versa. The page should just say that. Also two different strings are given — `RUNTIME.ITERATOR_CONSUMED` and `already been consumed` — and I don't know which one I'd see in a log or which one to match on.

**3.** "On PostgreSQL, `create()` supports nested `create()` on a child-owned relation and nested `connect()` on a parent-owned relation, all within one transaction."

"Child-owned relation" and "parent-owned relation" appear here for the first time with no definition. I tried to reverse-engineer them from the two examples: `User.create({ posts: ... })` is labeled child-owned, `Post.create({ user: ... })` is labeled parent-owned. So I *think* it means "which table holds the foreign key," but I'm guessing, and I can't tell from a schema I'm looking at which of my own relations is which. Plainest wording: "You can nest `create()` on a one-to-many side, and `connect()` on the side that holds the foreign key."

**4.** "These nested mutators are type-checked but their runtime behavior on MongoDB is unverified on the current test contract."

"Unverified on the current test contract" tells me about your test suite, not about my code. Does it work on MongoDB or not? Should I use it? The sentence leaves me with no decision. Say either "not supported on MongoDB" or "supported on MongoDB but untested — we recommend not relying on it."

**5.** "On PostgreSQL, `update()` accepts a data object only. It has **no** field-operations callback overload: passing a function is silently a no-op (it resolves to `null`), not an error. A bare function has no enumerable own properties, so no column is targeted."

The last sentence explains your implementation to justify a bug. I don't need to know about enumerable own properties. Also this contradicts the doc line above it: `update()` "Returns `null` when no row matches" — so if I get `null` back I cannot tell whether nothing matched or I passed the wrong shape.

**6.** "On MongoDB, `updateAll()` is **not atomic**. It (1) reads the matching `_id`s, (2) runs an update against the original filter, then (3) re-reads by those captured `_id`s. A concurrent write between these steps could change which documents match or their values; the result reflects the `_id` set from step 1, not one atomic snapshot."

I can follow the mechanics, but I cannot restate what it means for me. What is the bad outcome? Can a document be updated and not returned? Returned but not updated? Returned with someone else's newer values? And what should I do instead — a transaction? The page doesn't say.

**7.** "The base and variant rows live in separate tables, so a single `RETURNING`-less `INSERT` can't populate both."

Internals. I wanted to know "use `createAll()` instead", which the error message already says.

**8.** "On insert, `update` fields apply via `$set` and the remaining create-only fields via `$setOnInsert`, so `update` values win over `create` values on any overlapping field."

The `$set`/`$setOnInsert` detail is MongoDB-driver internals. The only part I needed is the clause after "so". Plainest wording: "If a field appears in both `create` and `update`, the `update` value is used, even on the insert path."

**9.** "Registering custom collections requires building the client with the `orm(...)` factory, not the `postgres()` client's built-in `.orm` facet. The `postgres()` client has no `collections` option, so its facet always resolves models to the base `Collection`."

"Facet" is undefined. "Resolves models to the base `Collection`" is implementation language. I think it means: "`db.orm` from `postgres()` can't use your subclasses. Build the client with `orm()` instead." That's all I needed.

## Words and phrases I had to guess at

- **"terminals"** — in the anchors `#read-terminals` and `#mutation-terminals`. Guessed: methods that end the chain and actually hit the database. The visible headings say "Read methods"/"Write methods", so the anchors leak a word the page otherwise avoided.
- **`AsyncIterableResult`** — guessed: a thing that is both a promise and an async iterator. The link goes to a section not in what I read, so I can't confirm.
- **`.toArray()`** — appears once, in a Remarks parenthetical for `all()`. Never listed in any return-type table, never shown in an example. Guessed it's an alternative to `await`.
- **"already-buffered"** — guessed: you already awaited it, so the rows are in memory.
- **`variant('Bug')`, `variant('Tutorial')`** — appears in six code samples and is never explained in this part. Guessed: filters to a subclass/subtype of the model.
- **"multi-table-inheritance variant" / "MTI"** — guessed: a subtype stored in its own table with a shared base table. The abbreviation MTI is used in the quoted error message without ever being spelled out next to it.
- **"discriminated variant"** — guessed: same idea, but stored as one document with a type field.
- **"materializing"** — in "Insert rows without materializing them". Guessed: without reading the inserted rows back.
- **"field-operations callback"** — guessed from the examples (`t.duration.inc(5)`). No list of available operations here; `inc`, `set`, `mul` appear in samples and that's all I know exists.
- **"conflict target"** — guessed: the unique index Postgres uses to decide insert vs update.
- **"contract"** — `Contract`, `contract.json`, `contract.d`, "test contract". Guessed: the generated schema types.
- **"facet"** — guessed: the `.orm` property on the client.
- **"atomic"** used three different ways: "atomic single-document update", "is a single `UPDATE ... RETURNING` statement, and is atomic", "not one atomic snapshot". I can't tell if these mean the same guarantee.

## "So what do I actually type?" — places the page doesn't say

1. **Do I have to supply `id` myself?** `Tag.create({ label: 'typescript-2' })` has no id. `User.create({ id: '00000000-...-099', ... })` has one. `Tag.upsert({ create: { id: '30000000-...', label } })` has one, and the ORM 7 migration diff quietly adds `id` to the new version (`create: { id, label: 'typescript' }`) with no note. I don't know when ids are generated for me.
2. **Do I have to pass every nullable field?** Every MongoDB create sample spells out `bio: null` and `address: null`. Can I omit them? The page never says.
3. **`conflictOn: { label: 'brand-new' }`** — why does the conflict target carry a *value*? In SQL, `ON CONFLICT` names columns. If it's just the column name, why not `conflictOn: ['label']`? If the value matters, what does it do? And does it have to match the `create` value? Both samples make it match, without saying whether that's required.
4. **`first()` on PostgreSQL with both `where()` and an inline filter** — do they AND together, or does the inline one replace the earlier filter? Never stated.
5. **PostgreSQL `upsert()` and `where()`** — the section warning says "Always call `where()` before ... or `upsert`", but the `upsert()` Remarks say "Requires a prior `where()` on **MongoDB**", and the PostgreSQL example calls `upsert()` with no `where()` at all. Three statements, and I can't tell what to type on PostgreSQL.
6. **Comparing a MongoDB `_id` after upsert** — "Compare it with `String(...)`." Show the line. Is it `String(user._id) === String(otherId)`? I'd like to copy it, not reconstruct it.
7. **What to do about non-atomic `updateAll()` on MongoDB.** No alternative is offered.
8. **How to get a count without writing.** The read methods are `all()`, `first()`, `aggregate()`, `groupBy()`. There's no `count()` or `exists()` in the list. Did they go away? For a `findMany`+`length` user, that's an unanswered question.
9. **`bugs()` returns what?** In the subclass example, `this.variant('Bug')` is returned and then `.all()` is called on it. The return type is never named, so I don't know what I can chain onto my own domain methods.
10. **`deleteAll()` returns the deleted rows as a stream.** If I `for await` over it, are rows deleted as I iterate or all up front? Matters if I abandon the loop halfway.
11. **The elided error strings** — `... Use createAll() instead.` and `upsert() is not supported for MTI variant "<Variant>" ...`. If I want to catch and match these, the `...` makes that impossible.
12. **`orm({ runtime, context, collections }).public`** — the `.public` at the end appears without comment, and `client.context` is never explained.

## Places the page explains internals when I only wanted instructions

- `SELECT ... LIMIT 1` in the warning block.
- "PostgreSQL's `RETURNING`-backed `create()`".
- "A bare function has no enumerable own properties, so no column is targeted."
- The three-step read/update/re-read breakdown of MongoDB `updateAll()`.
- "$set" / "$setOnInsert" in `upsert()`.
- "backed by `findOneAndUpdate`" / "backed by `findOneAndDelete`" (harmless, but it's implementation, and it is where the atomicity claim hides).
- "a single `RETURNING`-less `INSERT` can't populate both".
- "its facet always resolves models to the base `Collection`".
- "The callback groups operators into one `findOneAndUpdate`".

## Could I look up a method and use it correctly after one reading?

For the simple reads, yes. `all()` and `first()` are clear, the ORM 7 diffs are the most useful thing on the page, and I could write those calls immediately.

For the writes, no. Specifically, after one reading I still would not know:

- Whether I need to pass `id` on create, ever.
- What `conflictOn` actually takes, or whether PostgreSQL `upsert()` needs `where()` — the page says both.
- What `variant()` is, despite it appearing in six samples I'd be copying.
- Whether nested `create`/`connect` works on MongoDB.
- What the full set of field-update operations is (I've seen `inc`, `set`, `mul`, and have no idea if that's all).
- Whether `null` from a PostgreSQL `update()` means "no match" or "you passed the wrong argument shape".
- What the MongoDB `updateAll()` non-atomicity costs me in practice, or what to do instead.
- Whether a count-only read exists.

The single biggest problem is the warning block at the top of the write section. It is the most important paragraph on the page — it's about accidentally wiping a table — and it is the hardest one to read. It packs seven method names, two databases, a type-versus-runtime distinction, and a SQL implementation detail into one block, and I would have to read it three times to act on it. The one-line version I needed is: "Always call `where()` before an update or delete. On MongoDB you get an error if you forget. On PostgreSQL you do not, and `updateAll`/`deleteAll` will hit every row."

Path read: `/private/tmp/claude-502/-Users-will-Projects-prisma-web--claude-worktrees-prisma-orm-8-docs-audit-5bdfd9/7636eb55-44f8-408f-b81e-481bd0140ea6/scratchpad/c21/oc/part2.mdx`
