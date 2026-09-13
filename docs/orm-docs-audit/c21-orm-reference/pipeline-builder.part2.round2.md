Read once, top to bottom, as an ORM 7 user.

## 1. Sentences I could not restate after one reading

**Line 132** — the `.node` rule. This is the worst sentence block on the page.
> "Every `fn.*` call returns a wrapper object. Its `.node` property is the raw expression inside that wrapper. `match()` takes the wrapper itself, through `expr(...)`. `fn.cond()` and the stages that take an options object take `.node`."

What stopped me: three ideas about three different call sites, plus an unresolvable reference. "the stages that take an options object" — which stages are those? I cannot name one. Is `project()` one? The example at line 151 passes a bare `fn.add(...)` into `project()`, with no `.node`, so apparently not — but I had to infer that from an example instead of from the rule. There are three cases (bare wrapper, `.node`, `expr(...)`) and the page states two.

Plainest wording I'd have understood: a table. "Pass the `fn.*` value as-is inside `project()`, `addFields()` and accumulators. Pass `.node` as the first argument of `fn.cond()` and inside `f.stage.set()`. Wrap it in `expr(...)` only inside `match()`."

**Line 137 vs the example at line 178** — these contradict each other.
> "**Inside `fn.cond()`, pass `.node`.** Write `fn.cond(fn.eq(a, b).node, thenExpr, elseExpr)`."

The example writes `fn.cond(fn.eq(...).node, fn.literal('is-tutorial'), fn.literal('not-tutorial'))`. Only the first argument gets `.node`; the other two do not. So "inside `fn.cond()`, pass `.node`" is false as written. I read it twice and still had to work the rule out from the code. Say: "The condition argument of `fn.cond()` takes `.node`. The then and else arguments do not."

**Line 117** —
> "Five have a different name because the plain one was taken"

Taken by what? `fn.first` does not appear anywhere. `acc.first` exists, but that is a different import on a different object. I cannot resolve "taken", so I cannot check my own guesses about names.

**Line 117, second half** —
> "Each helper is the camelCase name of the MongoDB aggregation operator without its `$` prefix, so `$toUpper` is `fn.toUpper`"

This only helps someone who already knows MongoDB's aggregation operators by name. I have used Prisma 7 for two years and have never written `$dateTrunc`. The table at 121–130 is names only, with no argument list, so for anything except the four or five obvious ones I still do not know what to type.

**Line 136** —
> "and the rest of the date, regex, replace, and object helpers."

I cannot restate this because it does not tell me anything. Which helpers, and what named arguments does each take? `fn.dateDiff` takes an object — with what keys? The page never says.

**Line 33** —
> "Wherever a signature takes `n`, wrap the number: write `n: fn.literal(2)`, not `n: 2`."

`fn` has not been introduced yet. It is defined 80 lines later, at line 111. Same problem at line 59, where `fn.year()` appears in an accumulator example before `fn` exists. Move the `fn` section above accumulators, or say "`fn.literal` comes from the expression helpers below".

**Line 235** —
> "Pipeline form calls `f.stage.*` and can read other fields of the same document."

`f.stage` is not explained until line 382. On first reading I did not know whether `stage` was a literal property name or a placeholder for something. It is literal, which I only learned later.

**Line 381** —
> "There are fourteen, listed under the bullets."

I looked for a bulleted list. There is a table. "Listed in the table below" is what I needed.

**Line 246** —
> "The builder does not check it against your contract, and each value is stored exactly as you pass it, with no conversion to the type your contract gives that field."

I understand the words. I do not understand the consequence, which is the only part I care about. My contract says a field is a date. What do I pass? A JS `Date`? An ISO string? If I pass the string, does the read side then break because "decoded" expects a real date? The page states the rule and stops exactly where my question starts. Same for line 246's tacked-on "`match()` filter values follow the same rule."

**Line 303** —
> "its `_id` is a raw `ObjectId` even though the TypeScript type says otherwise."

Says otherwise how? I guessed the type claims `string`. The page never says what the type claims, so I cannot predict what will break.

**Line 191** —
> "Dates and ids are raw driver values."

"Raw driver value" is not defined. I guessed: a `Date` object and an `ObjectId` object from the `mongodb` package. If that guess is right, say it in those words.

**Line 33, last sentence** —
> "`acc.first()` and `acc.last()` only mean something when a `sort()` comes before the `group()`."

What happens if I forget? An error? A silently arbitrary value? "Mean something" is doing a lot of work. I would have understood: "Without a `sort()` before the `group()`, the document MongoDB calls first is arbitrary and can change between runs."

## 2. Words and phrases I had to guess

- **`f.kind`** (lines 86, 178, 203) — guessed it is the field that says whether a `Post` is an `Article` or a `Tutorial`. Part 1 may have said so; the field just appears here.
- **`_id: null`** in every `group()` example — guessed it means "one group containing every document". Never stated on this page.
- **"the plain one was taken"** — guessed there is an internal name clash I cannot see.
- **"streams the pipeline output"** (line 436) — guessed "streams" means nothing operationally different from "writes", and is just describing `$merge`.
- **"result objects, not documents"** (line 245) — guessed that `runtime.query()` on a write returns a one-element array holding that object. I only worked this out because every example destructures with `const [result] =`. The page never says why a single write result comes back inside an array.
- **`acc.bottom`, "the reverse sort order"** (line 27) — guessed it means the reverse of the `sortBy` I supply. Could also have meant a fixed descending default.
- **`MongoFieldFilter.eq('kind', 'tutorial')`** (line 203) — guessed it builds a filter for a raw stage. Nothing on the page explains this class.
- **"Top `n` values by value"** for `maxN` (line 24) — "by value" reads like a typo or a tautology. Guessed it means the n largest.
- **"terminals"** in the anchors `#read-terminals` and `#pipeline-write-terminals-out-and-merge` — internal vocabulary that leaks into URLs. Readers will see these in a link.

## 3. Places I asked "so what do I actually type?" and got no answer

1. **`expr()` is never imported.** It is named at lines 111, 132, 137, 138 as the thing that makes `match()` work with computed values, and no example on the page uses it, imports it, or shows its shape. This is one of the page's three main rules and it has zero runnable code.
2. **Argument shapes for most `fn.*` helpers.** The table gives 70-odd names. Five get an argument shape at line 136. For `fn.dateDiff`, `fn.dateTrunc`, `fn.slice`, `fn.zip`, `fn.range`, `fn.getField`, `fn.convert`'s `to` values, and the rest, I have a name and nothing else.
3. **`insertOne` and required fields.** Line 255 passes `bio: null` and `address: null` explicitly. Must I list every field, including nullable ones? Must I pass `_id`? The page shows one shape and states no rule.
4. **Dates and ObjectIds on insert.** Following from line 246 — what literally goes in a date field or a relation id field? This is the first thing anyone hits.
5. **Building raw stages for `pipe()`.** Line 190 says "such as `new MongoMatchStage(...)`". If I want a raw `$lookup` or `$redact` stage, what class do I construct and with what arguments? The one example is the one stage I would never need `pipe()` for, since `match()` is typed.
6. **`pipe<NewShape>(stage)`** — what do I put in `NewShape`? An interface? No example.
7. **`fn.toObjectId()` on a real field.** Line 139 says to "give `fn.toObjectId()` an expression taken from the `f` argument instead". No example shows it. The only id example (line 488) sidesteps into `rawCommand()`.
8. **`whenMatched` as "an array of update stages"** (line 437) — what does one of those look like? Is it `f.stage.*`, or raw `$set` objects? Not shown.
9. **`acc.top` return shape.** The table says "Single document". The example comment says "output is what you get back" and names the variable `newestTitle`, so it returns a title string, not a document. Which is it? These two lines in the same page disagree.

## 4. Places the page explains internals when I only wanted to know what to do

- **Line 132, "Every `fn.*` call returns a wrapper object. Its `.node` property is the raw expression inside that wrapper."** I do not want to know the builder has wrapper objects with a raw expression inside. I want a rule for where to type `.node`. The internals are offered in place of the rule.
- **Line 139, "because a literal carries no field type to convert from."** This explains why the library cannot do it. It does not help me, and the sentence before it already told me it throws.
- **Line 437, "The builder passes both to MongoDB unchecked."** What I need is the consequence: a misspelled `whenMatched` value fails at the database, not in TypeScript.
- **Line 361, "the unknown key is ignored and the default `'after'` applies"** — this one earns its keep, because it tells me the failure is silent. Contrast with the two above.
- **Line 218, "`aggregate()` is an alias: it returns the identical query and runs identically."** Fine, but I am left asking why both exist and which one I should write. The page does not recommend one.

## 5. Structure problem

`### pipe()` (line 184) sits at heading level 3 under `## Expression helpers` (line 109). `pipe()` is a pipeline stage, not an expression helper. In a rendered sidebar it will appear nested under expression helpers. It belongs beside the other stages, which are in part 1.

Also, `## Accumulators` jumps straight to `#### Examples` at line 35, skipping level 3.

## After one reading, could I do what the page is for?

Partly. I could write a `group()` with `count`, `sum`, `avg`, `min`, `max`, `first`, `last`, `push`, `addToSet`. I could write a basic `updateMany`, `deleteMany`, `insertOne`, `out()`, and `merge()`, and copy the `rawCommand()` `_id` filter. Those have complete examples and I would type them correctly.

What I still would not know:

- Where `expr()` comes from, or how to write a single `match()` filter that uses a computed value. This is presented as core behaviour and has no code at all.
- Whether to write a bare `fn.*` value, `.node`, or `expr(...)` at any call site not shown in an example. The stated rule and the shown examples do not agree.
- What arguments any date, regex, array, set, or conversion helper takes. I have names only.
- What to pass for a date or an id when inserting, which is the first thing I would do.
- How to build any raw stage for `pipe()` other than the match stage shown.
- Whether `acc.top` gives me back a document or a single value.
- How to convert a string id from my own code without dropping to `rawCommand()`. The page says an expression from `f` works and never shows it.

The write-methods section (lines 227–457) is the strongest part: the array rule at 231–236 is stated once, firmly, with the error codes, and every method has a runnable example. The expression-helpers section is the weakest: it is a name list plus a rule I cannot apply.