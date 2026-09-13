## Page 1 — `index.mdx`

### Sentences I could not restate after one reading

**"It is not the same as `runtime.query()`, which runs a built query."**
Stopped me because I had no reason to confuse them yet. `db.query` and `runtime.query()` are different objects; the page warns me off a mistake before I know enough to make it, and then doesn't say what `runtime` is. Plainer: put this after the code example, as "`db.query` builds MongoDB pipelines. The separate `runtime.query()` method, below, is what runs any built query."

**"In the example below, the ORM client runs when you `await` it. The SQL query builder and the pipeline builder do not run on their own: each produces a built query with `.build()`, which you then run with `runtime.query(...)`."**
Three ideas in one place: that awaiting triggers execution, that builders are lazy, and that `.build()` plus `runtime.query()` is the two-step. I got it on the second read only. Splitting it into two sentences would have been enough.

**The whole of paragraph one (lines 9–11) is two unbroken walls of text.** Nine sentences with no list and no break, covering the v7 migration, three API surfaces, when to use each, raw queries, and transactions. As a reader I lost the thread at "The **pipeline builder** is at `db.query`." A bulleted list of the three builders would have been readable at a glance.

**"Prisma ORM gives you three ways to write a query."**
Then the next paragraph adds raw queries as a fourth, and the card list shows five pages. After one reading I did not know whether "three" was wrong or whether raw is a special case. Say "three typed ways, plus raw SQL when none of them fits."

**"The raw queries page is shorter and has fewer tables."**
I can't do anything with this. It tells me about the documentation's formatting, not about the product.

### Words and phrases I had to guess

- **"built query"** — guessed: an object holding the SQL and its values that hasn't been sent to the database yet. Never defined.
- **`plan`** — the code names the built query `plan`. I guessed "plan" and "built query" are the same thing. The page never connects the two words.
- **`.all()`** — guessed: "run it and give me every matching row." Never explained. This matters because the page's whole framing is "in v7 you wrote `findMany({ where, include })`" — so I immediately want to know what replaced `findMany`, and `.all()` is the answer, silently.
- **`runtime`** — guessed: a connection object. `db.runtime()` appears in the code with no sentence introducing it.
- **"aggregate over a join"** — fine, I know SQL.
- **"Options, Return type"** as section names — fine.

### "So what do I actually type?"

- **`findMany` has no stated replacement.** The migration sentence promises the mapping is elsewhere, but the one example on this page uses `.all()`, which isn't one of the arguments being mapped. I'd have to leave the page to learn the most basic thing.
- **`db.runtime()` — do I call it once per app, once per query, or once per request?** The code makes it a top-level `const` and says nothing.
- **Nothing shows the pipeline builder** even though it's one of the three headline APIs. The example covers the ORM client and the SQL query builder only.

### Internals where I only wanted to know what to do

Nothing serious. "each produces a built query with `.build()`" is mechanism, but it's mechanism I have to type, so it earns its place.

### Could I do what the page is for?

Yes, mostly. It's an index, and I'd know which of the five pages to click. I would still not know what `.all()` is, what `runtime` is or when to create it, or why `db.query` and `runtime.query()` needed a warning.

---

## Page 2 — `raw-queries.mdx`

### Sentences I could not restate after one reading

**"This page covers two of these ways out."**
"These" points backwards to a sentence that listed three *typed* APIs — the opposite of ways out. I re-read the previous paragraph looking for a list of ways out that isn't there. Plainer: "There are two kinds of raw query."

**"A type id (`codecId` in the code) such as `pg/text@1` says how to turn the database's bytes into a JavaScript value."**
Two names for one thing in the first eight words, and then bytes, which I did not ask about. I wanted to know which string to type. Plainer: "A type id such as `pg/text@1` tells Prisma what JavaScript type a column should become. In code, the property is called `codecId`."

**"A `numeric` column arrives as a string, and a date arrives as the driver's own value."**
"the driver's own value" is not a type. After one reading I do not know what variable type I will get for a date, so I cannot write the code that consumes it. Say the actual type.

**"There is no way to send a column name or a table name as a parameter, so never build one from user input with a template."**
"build one" — build *what*? A column name? A template? A query? I had to reconstruct it. Plainer: "Never put user input into the SQL text itself, because a column or table name cannot be a parameter."

**The CTE paragraph (line 170) — the worst on the page.** Seven sentences and roughly six separate rules:

> "Interpolate the object that `.returnsRow(spec)` gives you, before you call `.build()` on it, and its SQL and its values are put into the outer statement in order. Only the outer statement is built. The outer statement declares its own columns. For a column the inner query already declared, read it back from the inner object's `.returns` property, which is a record of the columns that query declared, rather than writing the type id out again. That property is a different thing from the `.returns(typeId)` method you call on a fragment."

I could not restate this after one reading. The hardest part is the last sentence: I now have `.returns()` the method, `.returns` the property, and `.returnsRow()` the method, and the page tells me they differ without giving me a way to keep them straight. "its SQL and its values are put into the outer statement in order" is also internals — I only need to know that it works.

**"Pass the built query to `runtime.execute(...)`, which resolves to an object, `{ affectedRows }`, whose `affectedRows` is the number of rows the statement changed."**
The sentence names `affectedRows` twice and circles back on itself. Plainer: "`runtime.execute(...)` resolves to `{ affectedRows }` — how many rows the statement changed."

**"Each entry is either a column taken from your contract, such as `db.sql.public.user.columns.id`, which brings its own conversion, nullability, and TypeScript type, or an explicit type id for a column your contract has no counterpart for."**
One sentence, two branches, four nouns in a subordinate clause, and "a column your contract has no counterpart for" is backwards English. Split it in two.

**"Every one of these methods goes through `query()`, including the writes."**
"Goes through" is vague. I guessed it means "you run all of them with `runtime.query()`, even the inserts and deletes." Say that.

### Words and phrases I had to guess

- **"`codecId`"** — guessed it's simply the code's name for a type id. Confirmed by the parenthetical, but the page then uses both names interchangeably for the rest of the page and I had to keep translating.
- **`@@map`** — "unless the model sets `@@map`" — guessed: a contract annotation that overrides the table name. Never explained, and I'm coming from v7 where the file was `schema.prisma`.
- **`pg/int8number@1`** — guessed: a 64-bit integer that comes back as a JavaScript `number` rather than a `bigint`. Nothing on the page says so, and it matters, because the `.returnsRow` example later uses `pg/int8@1` and the comment says "row.postCount is a bigint". So the two spellings do different things, and I worked that out by inference.
- **"raw fragment"** vs **"whole raw statement"** — the definitions are clear. No complaint.
- **"tagged template"** — assumed knowledge, fair for a JS developer.
- **"native BSON values"** — guessed: whatever the MongoDB driver hands back, unconverted.
- **"the driver"** — guessed: the `mongodb` / `pg` npm package underneath. Never introduced.

### "So what do I actually type?"

- **Where is the full list of type ids?** The page gives seven auto-assigned ones plus "four more you are likely to write", then says "Those are the common ones, not the whole set." It never says where the whole set is. I have a `date` column, an enum, and a `text[]`. I am stuck, and there is no link to follow.
- **The link text lies.** "See the [type ids](#binding-a-bare-value-with-param) for the ones you are most likely to write" — the anchor lands on a section titled "Binding a bare value with `param()`". I'd assume I clicked the wrong link.
- **How do I bind a `Date`?** The page tells me to three separate times — "such as a `Date`", "To bind a `Date`, or any value whose type is not in the list, wrap it in `param(value, { codecId })`" — and never once shows it. The only `param()` example is `param(15, { codecId: 'pg/int4@1' })`, a plain number that the table above says is bound automatically. So the single worked example demonstrates the one case where `param()` is unnecessary, and the case it was written for is missing.
- **`.select((f) => ({ id: f.id, serverNow }))`** — this object-returning callback form appears with no introduction. Earlier the page showed `select('id')` and `select('name', callback)`. This is a third shape, used once, unexplained.
- **`db.query.rawCommand(command)` is passed to `runtime.query()` with no `.build()`.** Line 205 told me flatly: "Call `.build()` on it, then run it with `runtime.query(built)`." Then line 306 and line 340 don't call `.build()`. I would have typed `.build()`, got an error, and not known why.
- **How do I compare an `ObjectId`?** The warning says "compare one with `String(...)`", and the only demonstration is inside a code comment. I'd want `String(row._id) === aliceId` in actual code.
- **`$redact` with `$$KEEP` / `$$PRUNE`** is named as one of the two reasons to use `rawCommand()` and never shown.
- **`db.query.rawCommand` under a MongoDB heading, but its own `##` section.** After one reading I could not tell whether `rawCommand` is part of the raw API or the pipeline builder. The page says it "runs ... through the pipeline builder" and then sends me to the pipeline builder page "for the full treatment" — so which page is authoritative?

### Contradictions I hit

- **`aggregate<Row>()` vs `rawCommand()` on `_id` matching.** Line 226: `aggregate` sends "stages ... as you wrote them, so a filter on `_id` with a real `ObjectId` matches." Line 345: `rawCommand()` is "the way out when the typed pipeline builder can't express a query. Two examples: filtering by `_id` equality". Both claim to be the answer for `_id` filtering. After one reading I do not know which one to use, or whether the second sentence means "the *typed* builder can't, but `aggregate` also can" — in which case `rawCommand` has no advantage over `aggregate<Row>()`, which at least gives me types.
- **Update result shape.** The warning box (line 208) says the write methods give you `{ matchedCount, modifiedCount }`. Line 251 says `updateOne()`/`updateMany()` return `{ matchedCount, modifiedCount, upsertedCount, upsertedId }`. Two different answers, ten lines apart.

### Internals where I only wanted to know what to do

- **"says how to turn the database's bytes into a JavaScript value"** — I don't care about bytes. Tell me which string to type and what I get back.
- **"its SQL and its values are put into the outer statement in order. Only the outer statement is built."** — this is how the composition is implemented. I just want "you can nest a `.returnsRow()` query inside another one; call `.build()` on the outer one only."
- **"MongoDB has no schema segment, which is why there is no `public` here and none on `db.orm`."** — the "which is why" is an explanation of the API's shape. "MongoDB has no schemas, so there is no `public` segment" would do.
- **"Every one of these methods goes through `query()`, including the writes. A write comes back as an array holding one result object, which is why the examples read it with `const [result] = ...`."** — the "which is why" again explains the plumbing. The actionable part is only the second half: "A write returns a one-element array, so destructure it."
- **"The **first** call to an upsert counter returns an **empty** result. The upsert creates a brand-new document, so there is no earlier version to return, the driver returns `null`, and the query yields no row."** — a four-step causal chain about driver behaviour. The fact I need is the first sentence. The rest is why, and I'd have accepted "because there is no earlier version."

### Other things that stopped me

- **The upsert counter example uses the `users` collection as a page-view counter, with `_id: 'pageViews'`.** The page admits this: "The example schema has no counter collection, so `users` stands in for one here." Reading it, I spent time working out whether a users collection really was supposed to hold a counter document. Then a further sentence explains that a string `_id` is legal. Two sentences of apology around a four-line example.
- **`new RawFindOneAndUpdateCommand('users', { _id: ... }, { $inc: ... }, true, { count: -1 }, 'after')`** — six positional arguments. The list above it is clear, but reading the call itself, `true` means nothing without scrolling back up.
- **The whole PostgreSQL half assumes I've read the SQL query builder page**, and the whole MongoDB half assumes I've read the pipeline builder page, for the example schemas. Fine for a reference, but it means I can't run a single example on this page without opening two others.

### Could I do what the page is for?

**PostgreSQL: partly.** I could write a `fns.raw` fragment in a `select()` or a `where()`, and I could write a whole `db.raw.sql` statement with `.returnsRow()` or `.affectedCount()` — the examples are close enough to copy. I would still not know: how to bind a `Date` (the thing the page tells me three times to use `param()` for), where the full list of type ids lives, when `pg/int8@1` versus `pg/int8number@1` applies, or what type a date column actually arrives as. The CTE section I would have to read three more times.

**MongoDB: partly, and I'd guess wrong at least once.** The nine collection methods are clear and copyable. But I would not know whether to use `aggregate<Row>()` or `rawCommand()`, because the page gives `_id` filtering as the reason for `rawCommand` and also says `aggregate` handles it. I would call `.build()` on a `rawCommand` because the page told me to, and it would break. And I'd have to pick one of the two conflicting answers about what `updateOne()` returns.