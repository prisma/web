# Explain, do not state

## The problem

Pages written by an agent, and pages that went through word budgets, drift into prose that states facts without explaining them. Each sentence is true, short, and correct, and the reader still has to work out what it means for them. The habit shows up as:

- **Fragment openers.** A two-to-five word sentence that announces the next one: "One name is special." "Recompile." "Drift shows up in two ways." The announcement carries no information, and the sentence after it has to start over.
- **Counting lead-ins.** A list introduced by how many items it has instead of what the items are for: "Four things change it:", "Two things cause this:", "Three things make a failure easy to recover from:", "'Baseline' means three things:". The count is the writer's bookkeeping. The reader wants to know what kind of thing is coming and why it matters.
- **Mechanism before meaning.** The sentence says what the system does and never says what that means for the reader: "A ref called `db` is what `migration plan` starts from when you do not pass `--from`." True, and the reader still does not know what the `db` ref is for.
- **Facts side by side.** Two sentences that are cause and effect, or condition and result, sit next to each other with no "so", "because", "when", or "if" between them. The reader has to infer the link.
- **Lists doing the explaining.** Reasoning that belongs in a paragraph is chopped into bullets with bold labels, so the connective tissue is gone and each bullet is a spec line.
- **Sentences trimmed to the fact.** Every clause that would have said "which means", "in other words", or "you would notice this when" was cut to meet a budget.

Word budgets cause the last two directly, and make all the others worse. A budget is for cutting repetition, never for cutting explanation.

## The model

The `migration ref` page said:

> One name is special. A ref called `db` is what `migration plan` starts from when you do not pass `--from`, so keeping it current is what keeps plans incremental.
>
> Four things change it:

Will rewrote it as:

> The `db` ref has a special meaning in Prisma 8: it tells the system where you expect your local database to be. When you run a command like `prisma migrate`, if you don't explicitly say `--from`, Prisma will assume you mean from the `db` ref.
>
> The `db` ref will be automatically updated in the following situations:

What changed:

1. **Meaning first.** The first sentence says what the thing is for, from the reader's side: it records what you expect about your own database. The mechanism comes second.
2. **Conditions as scenarios.** "When you run X, if you don't say Y, Prisma will assume Z." The reader can picture themselves doing it. Compare "is what X starts from when you do not pass Y", which describes the system from outside.
3. **The lead-in says what the list is.** "will be automatically updated in the following situations" tells the reader what kind of items follow and what they have in common. The count is gone.
4. **Longer, and connected.** Every sentence has a "when", "if", or "so". Nothing is left for the reader to infer.
5. **Plain words at the moments that matter.** "has a special meaning", "tells the system", "will assume you mean". These are how a colleague talks, not how a spec reads.

## The rules

1. **Say what it means before you say how it works.** For every term, command, file, or flag a page introduces, the first sentence about it answers "what is this for, from my side of the screen?" The mechanism follows.
2. **Walk conditions as scenarios.** Write "When you run X without Y, Prisma ORM does Z", not "Z happens unless Y is passed to X". Put the reader in the sentence.
3. **Connect adjacent facts.** If two sentences are cause and effect, condition and result, or contrast, join them with "so", "because", "when", "if", "but", or "which means". If they are separate ideas, leave them apart, and check that the paragraph still says why they are next to each other.
4. **Introduce a list by what it is, not how long it is.** Never count the items in the lead-in. Say what the items have in common and why the reader is about to read them: "The `db` ref is updated automatically in the following situations:", "A failure is easy to recover from because:".
5. **No fragment openers.** Fold a two-to-five word announcing sentence into the sentence it announces, or cut it.
6. **Explain in prose, list to enumerate.** A bulleted list is for items of the same kind that the reader will scan. Reasoning, trade-offs, and "this happens because" go in paragraphs.
7. **Budgets cut repetition, not explanation.** A sentence that explains what something means may be 25 words. A page may grow when it gains explanation. A definition repeated three times is still cut.
8. **The desk test.** Read the paragraph aloud as if explaining it to a colleague at the next desk. Wherever you would say "basically, what this means is...", the page needs that sentence. Wherever you would never say the sentence aloud ("Four things change it."), rewrite it.

## What the checker catches

`scripts/check-staccato.py` flags runs of short sentences, counting lead-ins, and fragment openers. It cannot judge whether a sentence explains or only states. The reader review and the desk test do that.
