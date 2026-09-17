# Signs of AI writing

This list is adapted from Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), which Wikipedia editors maintain from thousands of caught edits, and cut down to what shows up in developer docs and blog posts. `docs-writer` and `content-write-blog` point here; `scripts/check-ai-signs.sh` enforces the rows a regex can catch.

The underlying cause is the same for every sign: a model produces the most statistically likely sentence, which is the one that could apply to the widest range of topics. Specific, unusual facts get smoothed into generic, positive ones. So the fix is never to swap one word for a synonym. The fix is to say the specific thing: the exact command, the exact number, what the reader sees.

None of these is proof on its own, and a page written by a person can contain any one of them. Their density is what gives a page a synthetic voice. Treat one hit as a sentence to reread and several hits as a page to rewrite.

## Vocabulary

Words that models use far more often than people do. Each row gives the plain replacement; if no replacement fits, the sentence usually had nothing to say and can go.

| Do not write | Write |
| --- | --- |
| Additionally, / Moreover, / Furthermore, (opening a sentence) | nothing, or "Also," if the link matters |
| crucial, pivotal, vital, essential, key (as an adjective) | say what breaks without it, or cut |
| robust, powerful, seamless, seamlessly | say what it does |
| leverage, utilize | use |
| enhance, bolster, foster, cultivate, empower | improve, speed up, let you; or the specific verb |
| showcase, highlight, underscore, emphasize (as verbs meaning "show") | show, or state the fact directly |
| delve, deep dive, explore (for "explain") | explain, describe, cover |
| landscape, ecosystem, tapestry, realm, journey (as abstract nouns) | name the actual set of things |
| testament to, a reminder of | cut; state the fact |
| valuable, invaluable, meaningful, significant (as filler praise) | cut, or give the number |
| vibrant, rich, comprehensive, intricate, nuanced, streamlined, cutting-edge, groundbreaking | cut |
| align with, resonate with | match, follow, fit |
| garner, boast (meaning "has") | get, has |
| interplay, synergy, paradigm | say what the relationship is |
| meticulous, meticulously, thoughtfully | cut |
| navigate (a system, a decision) | use, choose, work through |
| in today's world, in the modern era, in the ever-evolving landscape of | cut the whole phrase |
| authored, relocated, attempted, passed away, commenced, terminated | wrote, moved, tried, died, started, stopped |
| in order to, as a result of, the fact that, a part of, all of the | to, because, that, part of, all the |

Wikipedia notes that the over-used words change with each model generation, so this table is a snapshot. When a reviewer flags a word that reads as machine-made and it is not here, add it.

## Sentence shapes

**Copula avoidance.** Models replace "is" and "has" with "serves as", "acts as", "functions as", "stands as", "represents", "boasts", "features", "offers", "refers to". Write "Prisma Postgres is a managed database", not "Prisma Postgres serves as a managed database solution". The plain verb is the human one.

**Participle tails.** A sentence that states a fact and then adds an "-ing" clause that editorializes about it: "..., ensuring your queries stay fast", "..., making it easy to scale", "..., allowing teams to move faster", "..., highlighting the importance of migrations". The tail is the model's opinion attached to your fact. Delete the tail. If the consequence is real and specific, give it its own sentence with a concrete claim.

**Puffed significance.** Statements about how a thing "plays a crucial role", "marks a significant shift", "sets the stage for", "reflects broader trends", "contributes to the broader". In docs this appears as a feature described by its importance rather than its behavior. Replace with what the feature does.

**Negative parallelism.** "Not just X, but Y", "not only X but also Y", "it isn't X, it's Y", "X rather than Y", "no X, no Y, just Z". Every one of these frames a contrast the reader was not thinking about and then resolves it. State Y. One per page at most, and only where the reader would genuinely have assumed X.

**Rule of three.** Three adjectives, three noun phrases, three bullets, three examples, everywhere. Models reach for three by reflex. Use the number of items there actually are; two and four are allowed.

**Vague connection.** "associated with", "in connection with", "connected to", "related to", "tied to" in place of the actual relationship. Write "the `db` ref points at the last applied migration", not "the `db` ref is associated with migration state".

**Vague attribution.** "Many developers find", "it is widely considered", "experts recommend", "best practice suggests". Name who, or drop the appeal to authority and state the recommendation as ours.

**Didactic disclaimers.** "It's important to note that", "it's worth noting", "keep in mind that", "note that" as a sentence opener, "be sure to". Cut the opener; the sentence after it stands alone. Use a `:::note` or `:::warning` directive when the point really needs to stand out.

**Section summaries.** "In summary", "In conclusion", "Overall", "To recap", or a closing paragraph that restates the section. A docs section ends when its last step is done; a blog section ends on its last point.

**Challenges-and-outlook formula.** A "Limitations" or "Considerations" section that opens "Despite its advantages, X faces several challenges" and closes with a vague reassurance ("Despite these challenges, X remains a strong choice"). State each limitation as a plain fact where the reader will hit it, and stop.

**Elegant variation.** Calling the same thing by a different name each time (the client, the library, the ORM, the runtime, the tool) to avoid repeating a word. In docs this is a bug: the reader cannot tell if the names refer to one thing or several. Pick one name and repeat it.

**Superlatives and absolutes as decoration.** "the best", "the only", "the first", "never", "always", "every" used for emphasis rather than as verifiable facts. Keep the ones you can verify and the reader needs.

## Structure and formatting

**Bold-label lists.** Bullet after bullet of `**Label:** description`. Docs use this shape legitimately for option lists and parameters, but a page made of them has replaced paragraphs with a slide deck. Use it for items of the same kind that the reader will scan; use prose for reasoning.

**Boldface for emphasis.** Bolding a phrase in every paragraph, or every mention of a chosen term, in a "key takeaways" style. Bold is for UI labels and the rare warning the reader must not miss.

**Title Case Headings.** House style is sentence case: "Deploy a Prisma Compute app", not "Deploy A Prisma Compute App".

**Headings that hold only headings.** A `##` with no text of its own, straight into `###`. Either write the paragraph the heading promises or remove the level.

**Thematic breaks.** `---` between every section. Headings already separate sections.

**Small tables that should be prose.** A two-column table with three rows of "Metric / Figure", or a comparison table where a sentence would do. Tables are for data the reader will scan and compare across rows.

**Em dashes.** Use a comma, colon, or period.

**Curly quotes and apostrophes.** `“ ” ‘ ’` instead of straight `" '`. They break code samples and inline code, and they are a fingerprint.

**Emoji as bullets or heading decoration.** Never in docs or blog prose.

## Leaked chat

Text that was written to the operator, not to the reader, and pasted into the page anyway.

- "I hope this helps", "Let me know if", "Would you like me to", "Certainly!", "Here is a", "Here's a breakdown of", "Below is an overview".
- Placeholders never filled in: `[Your Name]`, `[link to docs]`, `INSERT_URL_HERE`, `2025-XX-XX`, `<!-- add if available -->`.
- Speculation dressed as a gap in sources: "While specific details are not widely documented, X likely...", "based on available information". The page either knows the fact or marks a `Q` for the operator. It never guesses and it never tells the reader that it guessed.
- Meta-commentary about the page itself: "In this section, we will", "As mentioned above", "This document aims to".

## What is not a sign

Wikipedia's list of indicators that do not work matters as much as the list that does. Do not rewrite a sentence for these reasons alone:

- Correct grammar and clean punctuation.
- Formal or precise vocabulary in general. The signal is the specific words in the table above, not formality.
- A transition word on its own. "However" and "so" are how people connect ideas; "Additionally" opening every third sentence is the pattern.
- Mixed register: a technical writer switching between casual and exact is normal.
- Short paragraphs, or a page that is well organized.

## Signs of a person writing

Wikipedia lists constructions that people use and models avoid. They are allowed and often preferred:

- Simple "is", "are", "has", "there is a".
- Plain verbs: wrote, moved, used, tried.
- Hedges and intensifiers where they carry meaning: "very", "perhaps", "usually", "tends to".
- A specific, unusual fact that could only be true of this one thing.
