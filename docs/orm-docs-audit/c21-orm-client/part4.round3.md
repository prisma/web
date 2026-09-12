I read the file once, straight through, as a Prisma ORM 7 user. Findings below.

# Sentences I could not restate after one reading

**Line 9:** "`of(field, operator, value)` takes the MongoDB operator written out as a quoted string, such as `'$regex'`."
"Written out" stopped me. Written out as opposed to what? There is no other form of the operator shown anywhere, so the contrast is with something I have never seen. Plainer: "Pass the MongoDB operator as a string, including the `$`, for example `'$regex'`."

**Line 21 (table):** "`isNull(field)` / `isNotNull(field)` | Field | Matches a `null` value and a missing field / neither of those."
"Neither of those" forced me to reconstruct the sentence twice. Plainer: "`isNull` matches a `null` value or a missing field. `isNotNull` matches everything else."

**Line 19 (table):** "Field + a value that can be compared, such as a number, a date, or a string"
I could not tell whether this is a real type constraint I will hit, or just prose. If TypeScript rejects some types here, say which. If not, say "a number, date, or string".

**Line 64:** "The plain object form, `.where({ 'address.city': 'San Francisco' })`, does the same thing when it runs, but it does not compile without a cast."
Two ideas jammed together — runtime behaviour and compile behaviour — before I know why either matters. Plainer: "You can also write `.where({ 'address.city': 'San Francisco' })`. It works, but TypeScript rejects it unless you add a cast, because `.where()` only accepts your model's top-level field names."

**Line 85:** the whole opening paragraph of "Field update operations."
This is six instructions in one block: which methods take a callback, that the callback takes one argument, that the argument name is free, that top-level fields are properties, that embedded fields use a function call, that you return an array, and that PostgreSQL is different. On one reading I retained "callback, array, MongoDB only" and lost the rest. It needs to be a short paragraph plus a two-line list.

**Line 87:** "All four methods require `.where()`."
I could not restate this because I do not believe I understood it. `upsert()` is one of the four. In Prisma 7 an upsert is keyed by a unique `where`, so maybe this is the same thing — but the page never says what `.where()` means for `upsert()`, and `upsert()` gets no example at all.

**Line 98:** "If the type error ever goes away, TypeScript reports the unused comment instead."
I understood the words, but not why I am being told. It reads like a warning about a future breakage I cannot act on today. What do I do when that happens — delete the comment? Say that.

**Line 147:** "The callback argument implements `set`, `unset`, `inc`, `mul`, `push`, `pull`, `addToSet`, and `pop` only."
This directly contradicts line 93, four paragraphs earlier: "`set()`, `unset()`, `inc()`, and `mul()` are available." On first reading I concluded the page disagreed with itself and had to scroll back to check. Line 93 needs to say "available" means "in this subsection", or list all eight.

**Line 182:** "There is no error class to test with `instanceof`: import `isRuntimeError` from the same module and check `error.code`."
"The same module" is ambiguous. The previous paragraph named two modules (`@prisma/orm-postgres/components/runtime` and `@prisma/orm-mongo/components/runtime`). I had to look at the code sample to resolve it. Name the module in the sentence.

**Line 206:** "[Grouped aggregates](#grouped-aggregates) documents `aggregate()`, `groupBy()` with more than one field, and every function `agg` gives you."
"Every function `agg` gives you" assumes I already know `agg` is the callback argument. Line 207 introduces it one line later. The order is backwards.

# Words and phrases I had to guess

- **"factories"** (lines 8, 11, 25). I guessed: static methods on `MongoFieldFilter` that build a filter object. The page never says what they return or whether I can hold one in a variable.
- **"It passes the operator string to MongoDB unchanged"** (line 9). I guessed: no validation, so a typo like `'$regexp'` fails at the database, not at compile time. Worth stating outright, because it changes how I debug.
- **"embedded value object"** (line 59). I guessed: a nested object stored inside the document, not a separate collection. A Prisma 7 user knows "embedded documents" from Mongo; "value object" is a different vocabulary and I was not sure it meant the same thing.
- **"the callback argument"** (lines 147, 154). I guessed this means the thing named `u` or `t`. It is called "one argument" at line 85, "the argument" at 85, "the callback argument" at 147. Three names for one thing.
- **"applied together, in one write"** (line 105). I guessed: atomic, one round trip to MongoDB.
- **"an error from MongoDB rather than a Prisma ORM error code"** (line 156). I guessed: the thrown thing has no `.code` I can match on, so `isRuntimeError` will not help. Not stated.
- **`pop(1)` / `pop(-1)`** (line 154). I guessed nothing — the page told me what each does. But I had to accept the numbers as magic; there is no hint they are MongoDB's own `$pop` values.

# Places I asked "so what do I actually type?"

1. **The function-call form for embedded fields in an update.** Line 85 says `u('address.city').set('San Francisco')`, and then no example in the entire section uses it. Every one of the eight code samples uses the property form. I wanted one sample showing a dotted update end to end.
2. **`upsert()`.** Line 133 gives a fragment inside prose: `upsert({ create: { ... }, update: (u) => [u.bio.unset()] })`. `create` is literally `{ ... }`. I do not know what goes in it, and there is no `.where()` on that fragment even though line 87 says all four methods require one.
3. **How to update an embedded field in an `upsert()`.** Line 133 tells me the dot path throws `ORM.OPERATION_UNSUPPORTED`. It never says what to do instead. That is the one place I would actually be stuck.
4. **What to catch when an array operation hits a non-array field.** Line 156 says the error comes "from MongoDB rather than a Prisma ORM error code". So what is in my `catch` block? No code, no error shape.
5. **`createAll()` and `deleteAll()`.** Line 170 lists them as returning `AsyncIterableResult`. Neither appears anywhere else in this part, so I do not know what they take.
6. **Does `updateAll()` exist on PostgreSQL?** Line 87 sits inside a MongoDB section but states `updateAll()` return behaviour as a general fact. Line 170 lists `updateAll()` with no database qualifier. I could not tell.
7. **`ORM.WHERE_MISSING` and `ORM.OPERATION_UNSUPPORTED`.** Both are named with no example of catching them, while `RUNTIME.ITERATOR_CONSUMED` gets a full `try/catch`. Inconsistent.
8. **Line 188:** `const result = db.orm.public.User.all();` — no `await`. Everywhere else in the file, `all()` is awaited inline. I could not tell if dropping `await` here is required for the example to work or just incidental.

# Places explaining internals when I wanted instructions

- **Line 64:** "The object you pass to `.where()` is typed against the model's own top-level field names, and a dotted key is not one of them." This is the type system's reasoning. I wanted: "use `MongoFieldFilter.eq()` for dotted paths."
- **Line 76:** "The cast goes through `unknown` because TypeScript refuses a direct cast between two types that do not overlap." A TypeScript lesson. The code sample already shows the cast; the explanation adds nothing I can act on.
- **Line 98:** "TypeScript still knows only the base model's fields, so `t.duration.inc(10)` is a type error even though it runs correctly." The "even though it runs correctly" part is the only bit I needed. The rest is how the type generator works.
- **Line 97:** "Applied to a missing field, MongoDB sets it to `0` regardless of the multiplier." Reasonable to state — but it is described as MongoDB's behaviour, which left me unsure whether Prisma might change it.

# Other things that stopped me

**Line 150:** the heading anchor is `[#array-operations-mongodb-unverified]`. The word "unverified" will be in the published URL and the copy-link button. As a reader I would take that as a signal the section is not trustworthy. This looks like an internal marker that escaped.

**Line 144 and 147 say the same thing twice.** The Remarks bullet and the warning box both list `min`, `max`, `rename`, `currentDate`. The warning adds "Do not use `min()`, `max()`, `rename()`, or `currentDate()`" — a third repetition inside itself.

**Line 157:** "The example schema has no array field, so these lines assume `tags String[]` on `User`." So the four code samples immediately below do not run against the schema the rest of the page uses. I would have copied them and got a failure. The note is above the code, which helps, but the samples should be marked.

# Could I do what the page is for, after one reading?

Partly.

**I could:** write MongoDB filters with `MongoFieldFilter`, including `of()` for uncovered operators, and filter into an embedded object with a dot path. Update top-level fields with `set`, `unset`, `inc`, `mul`. Push and pull array elements. Consume an `AsyncIterableResult` both ways and know not to switch.

**I would still not know:**

- What to type for an `upsert()` — no complete example, and no answer for the embedded-field case it explicitly forbids.
- How to write the `u('address.city')` function-call form in real code, because no example uses it.
- Whether `updateAll()`, `createAll()`, and `deleteAll()` exist on PostgreSQL.
- Whether `.where()` on `upsert()` means the same thing it means on `update()`.
- What the full operation list is, because two sections give different lists without reconciling them.
- What to catch when an array operation fails on a non-array field.

The filter half of this page is solid and I would ship code from it. The update half assumes I will read the opening paragraph three times, and it withholds the one example — `upsert()` — I would most likely need to look up.