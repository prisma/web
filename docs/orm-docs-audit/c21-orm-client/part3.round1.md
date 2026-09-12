Read once, top to bottom, as a Prisma 7 user looking something up.

## Sentences I could not restate after one reading

1. **"It is a Postgres-adapter-registered operation attached to any textual-trait field, not a core comparison method."** (line 219)
   Stopped by "Postgres-adapter-registered operation", "textual-trait field", and "core comparison method" — three invented-sounding terms in one sentence, none defined anywhere on this part of the page. I cannot tell whether this changes anything I type. Plainest version I'd have understood: "`ilike()` is available on text fields when you use the PostgreSQL adapter." And then say whether that's the same condition as `like()` or a different one, because right now `like` is described as being "on text fields" and `ilike` on "textual-trait field" — two different phrases for what I have to assume is the same set.

2. **"They build AST nodes directly and are independent of any model accessor."** (line 268)
   "AST nodes" is compiler vocabulary I do not need to read a filter. "Independent of any model accessor" — I cannot resolve "model accessor"; the term is not introduced. What I think this is trying to tell me is: "You import them; they are not methods on a field." That's already said by "standalone functions imported from...", so the sentence adds nothing I can act on.

3. **"A to-one relation is filtered from the child side with the same `some(...)` shape (the compiled SQL is a correlated subquery regardless of cardinality)."** (line 311)
   Too many ideas, and the parenthesis is about SQL generation, not about me. "From the child side" took a second read — I think it means: when the model I'm querying has one related parent (Post → User), I still use `some()`. Plainest version: "Use `some()` for to-one relations too — `post.user.some(...)`." Also: the example that follows passes an **object** `some({ email: 'alice@example.com' })`, while every other `some()` example passes a **callback**. The page never says both forms work. That is the single thing I most wanted stated plainly.

4. **"`every()` is vacuously true for a parent with zero related rows."** (line 310)
   I know what "vacuously true" means, but the sentence makes me translate. Plainest: "A user with no posts matches `every()`."

5. **"On PostgreSQL, `all()` takes no arguments and returns a constant-true predicate, useful wherever a predicate is structurally required."** (line 270)
   "Structurally required" is doing a lot of work and I can't cash it out. Required where? The page gives no example of `all()` at all. Worse, `.all()` is used on nearly every line of this page as the method that runs the query and returns an array — so the same name means two unrelated things and the page doesn't acknowledge the collision.

6. **"PostgreSQL and MongoDB use different filter surfaces."** (line 206)
   "Filter surfaces" — guessed it means "different APIs for filtering". Say that.

7. **"Filters build the predicate inside `where()` (and relation refinements)."** (line 206)
   "Relation refinements" is not defined on this part of the page and I can't map it to anything below — the relation section calls them "relation filters". If they're the same thing, use one name.

8. **"MongoDB. Runtime behavior is verified; the type surface does not declare embedded paths, so the object-shorthand form needs a cast."** (line 402)
   "Runtime behavior is verified" reads like a note from your test suite to yourselves. "Type surface" — guessed it means the TypeScript types. Plainest: "This works at runtime, but the TypeScript types don't know about nested paths, so the object form needs a cast."

9. **"each returning comparison methods (`eq`, `neq`, ...)"** (line 172)
   "Returning comparison methods" — an object with those methods, I assume, not literally returning methods. The example makes it clear; the sentence doesn't.

## Words/phrases I had to guess

- **`db.orm.public.Order`** — guessed `public` is the Postgres schema name. Never stated in this part.
- **`db.orm.users`** (lowercase, no `public`) for MongoDB — guessed the Mongo path is `db.orm.<collectionName>` with no schema level, and that the casing difference (`users` vs `User`) is intentional. Pure guess.
- **"model accessor"**, **"field accessor"** — guessed both mean the `u` in `where((u) => ...)` / the `db.orm.public.User` object. They may not mean the same thing.
- **"textual-trait field"** — guessed "a string column".
- **`GroupedCollection`** — guessed it's a lazy builder, not a result, because you must call `.aggregate()`.
- **`h.fn(field).cmp(value)`** in the `having()` Options table — guessed `fn` and `cmp` are placeholders, not real names. If a reader copies that line it does not compile.
- **`MongoFieldFilter.of`** — listed as one of the eleven factories and then never mentioned again. I have no guess. What does it do and what do I pass it?
- **`agg`, `h`** callback params — fine, but nothing tells me their types if I want to extract a helper function.
- **"Each key must support equality"** (shorthand object) — guessed "don't put a relation or a JSON column in there". Which fields fail? Not said.

## "So what do I actually type?" — unanswered

- **`MongoFieldFilter.of(...)`** — named as existing, zero signature, zero example.
- **`MongoExistsExpr`** — "There is a separate `MongoExistsExpr` class for `$exists`" (line 360). No import path, no method names, no example. I now know it exists and still can't use it.
- **`all()` (the combinator)** — no example anywhere. No signature beyond "takes no arguments".
- **`groupBy()` with more than one field** — the Options row says `...fields` / "The grouping key(s)", every example passes one. Is it `groupBy('a', 'b')` or `groupBy(['a','b'])`? The spread notation implies the former, but after coming from v7's `by: ['customerId']` I wanted it shown once.
- **Filtering rows before grouping** — `aggregate()` has a `.where(...).aggregate(...)` example. `groupBy()` never does. Can I write `.where(...).groupBy(...).having(...).aggregate(...)`? Presumably, but the page doesn't show the full chain.
- **Ordering/limiting grouped results** — "top 5 customers by spend" is the reason I'd open this section. Nothing about `orderBy` or `limit` on a `GroupedCollection`.
- **`having()` referring to an aggregate alias** — in both examples the same `sum('amount')` is written twice, once in `having` and once in `aggregate`. Can I reference the alias instead? Not said, so I'd assume no and keep duplicating.
- **Counting a specific column** — `count()` "needs no field argument". In v7 I used `_count: { bio: true }` to count non-nulls. Can I? The page implies not but never says.
- **What to use on MongoDB instead of `aggregate()`/`groupBy()`** — "calling them throws `TypeError`" and that's the end. No "drop to the driver", no link.
- **Combining Mongo combinators** — can `MongoOrExpr.of([...])` contain another `MongoOrExpr`? Can I call `.and()` on a `MongoOrExpr`, or only on a `MongoFieldFilter`? The remark says `.and()`/`.not()` are "instance methods on any `MongoFieldFilter`", which reads like `MongoOrExpr` does *not* have them. An AND-of-ORs is the most ordinary filter there is and I can't tell how to write it.
- **`not()` on Postgres combined with relation filters** — `not(p.posts.some(...))` vs `none(...)`: both plausible, neither confirmed.
- **The Mongo dot-notation object form mixing keys** — `{ 'address.city': 'SF' } as unknown as Record<string, unknown>`. If I cast the whole object, do my normal typed keys still get checked? Obviously not. So why would anyone use this form? The page shows it without saying "prefer `MongoFieldFilter.eq`" as a recommendation, even though its own remark implies exactly that.
- **`in()` with an empty array** — matches nothing, or throws? Unstated, and it's the classic bug.
- **`like()` escaping** — `%` and `_` in user input. Nothing.

## Where the page explains internals when I wanted instructions

- "They build **AST nodes** directly" (line 268).
- "It compiles to a SQL `HAVING` clause" (line 172) — harmless but not actionable.
- "compile to **correlated `EXISTS` / `NOT EXISTS` subqueries**" and "the compiled SQL is a correlated subquery **regardless of cardinality**" (lines 308, 311). The second one is pure implementation trivia inside a sentence that was supposed to tell me what to type.
- "It is a **Postgres-adapter-registered operation**" (line 219).
- "At runtime there is no such restriction: **the object key is used verbatim as the Mongo field path**" (line 403). The "verbatim" mechanism is fine as a one-liner, but it's explaining why the cast works rather than telling me which form to use.
- "**`MongoFieldFilter.ne` is `undefined`**" and "**Accessing `.or` is `undefined`** and calling it throws `TypeError`" (lines 358, 299). Telling me the property is `undefined` is describing your object's shape. "There is no `ne` — it's `neq`" is the whole message.
- "There is **no `$nor` combinator anywhere in the library**" (line 299) — repeated in the remark and the note box, and it's a statement about your codebase's contents.

## Could I look up a method and use it correctly after one reading?

Partly. The Postgres scalar comparisons and the flat `aggregate()` I could use immediately — the tables are good, the examples are complete and runnable, and the v7 diffs are the most useful thing on the page.

What I still couldn't do:

- Write any grouped query more complex than the two examples: no multi-field grouping, no filter-then-group, no sorting the groups, no reusing an alias in `having`.
- Write an AND-of-ORs on MongoDB. I don't know if `MongoOrExpr` has `.and()`.
- Use `MongoFieldFilter.of` or `MongoExistsExpr` at all, despite both being named.
- Use the combinator `all()`, and I'd probably misread `.all()` at the end of a chain as the same function the first time I hit it in someone else's code.
- Decide confidently whether `some()` takes a callback or an object, because the to-one example silently switches forms.
- Know what `public` and the lowercase Mongo collection names in `db.orm....` are. That may be in the omitted sections, but every code sample on this part depends on it.
