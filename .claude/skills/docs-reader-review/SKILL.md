---
name: docs-reader-review
description: Use when a docs page or section has been written or rewritten and is about to be handed over, when the operator says "reader review", "does this read like a human wrote it", "too much jargon", "plain language", or when a docs brief asks for a review before a pull request.
metadata:
  author: Prisma
  version: "2026.9.11"
---

# Docs Reader Review

Run a page through the eyes of the reader it is for, before anyone else sees it. The biggest complaint about the Prisma docs is that pages read as if a model wrote them: vocabulary from the source code, mechanism instead of action, several ideas per sentence. A fact review does not catch this, because every such sentence is true. This skill catches it.

Use it after `docs-writer` (or any other writing pass) and after the fact review. Nothing ships with an unresolved mark.

## Pre-conditions

1. The page exists on disk and every claim on it has already been checked against the source. This skill reviews comprehension, not truth. If facts are unverified, do that first.
2. You know who the reader is. Default: a developer who has used the previous major version for two years and has never seen this version's source code, release notes, or internal vocabulary. If the page targets someone else, write that reader down before starting.

## Workflow

### 1. Run the banned-term check

Run `scripts/check-plain.sh` on every changed page. It fails on words from `references/banned-terms.md`, which lists source-code vocabulary and the plain words to use instead. Replace every hit before going further. Do not argue that a term is fine in context; if the reader needs the term, the sentence that first uses it defines it in plain words, and that is not a hit.

### 2. Dispatch the reader

Hand the page to a fresh reviewer that has no memory of writing it, using `references/reader-persona.md` verbatim as its instructions. The reviewer reads the page once, top to bottom, with nothing else open, and reports:

- every sentence it could not restate in its own words, with what stopped it;
- every word or phrase it had to guess;
- every place it asked "so what do I type?" and the page did not say;
- every place the page explains how the tool works inside when the reader only needed what to do;
- whether it could complete the page's purpose after one reading, and what it would still not know.

The reviewer must not look anything up. Its confusion is the data.

### 3. Fix every mark

For each reported sentence:

| The reviewer said | Do this |
| --- | --- |
| a word it had to guess | replace with the plain words from `references/banned-terms.md`, or define it in that sentence |
| too many ideas in one sentence | one idea per sentence; a table cell with three ideas becomes a note under the table |
| "so what do I type?" | add the command or the code, or the link to the page that has it |
| mechanism instead of action | delete the mechanism, keep what the reader does and what they see |
| a reference it could not resolve ("the plan", "the ref", "spec") | show the thing, or name where it comes from |
| a term used before the page defines it | move the definition to the first use |

Do not add content the page's purpose does not need. Do not argue with the reviewer. If a mark seems wrong, the sentence still confused a reader; rewrite it anyway.

**Facts stay fixed.** A reader round changes wording, order, and examples. It never changes what the page claims. When a reviewer's confusion can only be resolved by a fact you do not have (which command to run, what a value is, what happens on failure), do not invent one to make the sentence smooth: look it up in the source, or mark it `Q1`, `Q2` for the operator and leave the sentence honest. Rewrites that read well and say something false are the worst outcome this skill can produce.

### 4. Repeat

Dispatch a fresh reviewer again on the fixed page. Repeat until a pass reports no sentence it could not restate and no word it had to guess. Two rounds is normal. One round is suspicious.

### 5. Re-check the facts

Reader rounds rewrite sentences, and rewriting drifts meaning. Before handing over, check every claim in the final text against the source again: each command, flag, file path, return value, and "what happens if". Anything the rounds introduced that the source does not support is reverted to what the source says, even if it reads worse.

### 6. Hand over

Only now does the page go to the operator or into a pull request. Say in the handover how many review rounds ran, what the last round still flagged, and any `Q` marks left for the operator. Remove all `Q` marks from the page itself before handover; carry them in the handover note.

## Rationalizations that do not hold

| Excuse | Reality |
| --- | --- |
| "The term is the correct name for the thing." | Correct for whom? If the reader has not met it, it is noise. Define it or drop it. |
| "The fact review passed, so the page is fine." | The fact review checks truth. Every jargon sentence is true. |
| "Reference pages are for experts; they can take the vocabulary." | The reader of a reference page is looking something up mid-task. They know their own code, not the tool's internals. |
| "Explaining the mechanism helps the reader understand." | Explain it only if the reader must know it to act. Otherwise it is the sentence they skip and the one that loses them. |
| "There is no time for a second review round." | The second round is where the remaining marks are. A page shipped after one round is the page that gets the complaint. |
| "I already know what a reader would say." | You wrote it. You cannot read it cold. Dispatch the reviewer. |
| "It is only a table cell." | Table cells are where three ideas get packed into one line. They are the first thing to check. |
| "The reviewer could not follow it, so I explained what must be happening." | You just invented a fact. If the source does not say it, the page does not say it. Mark it for the operator. |
| "After six rounds it reads perfectly." | Reads perfectly and says what? Run the fact check on the final text; smooth prose is where drift hides. |

## Output

The reviewed page, with no marks left, plus the count of review rounds. Do not carry the reviewer's report into the page.
