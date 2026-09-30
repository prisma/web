# Authoring the Builders Handbook

This file is the binding content spec. If a chapter contradicts it, the chapter is wrong.

## The one rule

**Shane writes the handbook. Claude structures it.** Every claim, opinion, example, number, and recommendation on a page came out of Shane's head first. Claude's job is to turn a raw brain-dump into readable chapters: order the thoughts, cut repetition, tighten sentences, apply the component vocabulary below, and flag gaps. Claude never fills a gap with invented content. A gap becomes a `TODO(shane):` comment in the MDX and a bullet in the review notes.

Claude is allowed to have ideas. Shane asked for them. They go in the chapter's private outline comment under a "Claude's suggestions" heading, clearly separate from "From your notes". A suggestion becomes content only when Shane says so, in his words. Names, numbers, quotes, and anecdotes are never suggested: those are asked for as questions.

The previous attempt at this book (`buildaproduct`) failed because the content was generated. Every rule below exists to stop that happening again.

## Workflow, chapter by chapter

1. **Dictate.** Shane brain-dumps into `notes/<part>/<chapter>.md`. Voice transcript, bullet spew, half sentences, all fine. Tangents welcome; they get cut later. Nothing in `notes/` is ever published or linted.
2. **Structure.** Claude reads the note and writes `content/handbook/<part>/<chapter>.mdx` with `status: structured`. Rules:
   - Keep Shane's claims, order of importance, and voice. Rephrase for clarity; do not rephrase for smoothness.
   - Keep his examples and numbers exactly. If a number is missing, `TODO(shane): number?`, not a plausible guess.
   - Use only the components in this file.
   - At the end of the MDX, add a private review-notes comment listing: what was cut, what was reordered, every TODO, and any place Claude was unsure it understood the point.

Private comments (outlines, review notes) use MDX comment syntax, wrapped so Prettier leaves them alone. Shane's editors format on save with Prettier, which rewrites a bare multi-line `{/* */}` into invalid MDX and takes every page down with a 500. HTML comments (`<!-- -->`) are not valid MDX at all. The blank lines around the markers are required:

```mdx
{/* prettier-ignore-start */}

{/*
OUTLINE (private, never published)

FROM YOUR NOTES
- ...

CLAUDE'S SUGGESTIONS
- ...

QUESTIONS FOR YOU
- ...
*/}

{/* prettier-ignore-end */}
```

A chapter that has been scoped but not written carries an outline comment in this shape and a one-line visible placeholder.
3. **Review.** Shane reads the diff, fixes what Claude got wrong, resolves TODOs, and flips `status: reviewed`.
4. **Publish.** Remove the `status` field. The badge disappears.

Chapter frontmatter:

```yaml
---
title: "3. Name of the chapter"        # number in the title; the sidebar shows titles verbatim
description: One or two sentences. The chapter's promise, plainly.
status: stub | dictated | structured | reviewed   # omit once published
readingTime: 12                          # minutes, hand-set
---
```

Chapter numbering is manual and global across Parts. Renumber by hand when a chapter moves.

## Voice

- Light and easy reading. Not a textbook. `content/handbook/index.mdx` is the reference for tone: Shane wrote it himself.
- Talk to the reader as "you". "We" is fine for the handbook and the reader going through it together ("we'll step through..."). Warm is fine. An exclamation mark now and then is fine.
- Where one of Shane's own sentences breaks a rule in this file, Shane's sentence wins. The rules exist to stop Claude's defaults, not to edit Shane.
- Opinions stated as opinions. "Do X" beats "you may want to consider X." The book has a point of view because Shane does.
- Plain words. A tired non-native-English reader gets every sentence on first pass.
- Concrete over abstract. A number, a filename, a quote from a real person beats "many builders find."
- Short paragraphs. Three to five sentences. One idea each.
- Technical and non-technical readers share the text. Where they need different instructions, say so in one line and give both. Do not write two books.

## Banned on sight

Text that reads frictionless-smooth is a bug. Specifically banned in all prose, headings, captions, and code comments:

1. **Negation pivots.** "Not just X, it's Y." "This isn't about X, it's about Y." State it positively. One deliberate, load-bearing contrast per chapter at most.
2. **Rule-of-three cadence.** "Clear, concise, and compelling" as the default list shape. Vary: two items, four items, one flat statement. Three is fine when three is the count.
3. **Empty intensifiers.** delve, crucial, robust, seamless, leverage (verb), unlock, elevate, landscape, journey, game-changer, empower, supercharge, transformative, harness, navigate (metaphorical), tapestry. Say what the thing does.
4. **Reflexive hedging.** "It's important to note", "it's worth considering", both-sidesing where the book holds an opinion.
5. **Perfect parallelism in prose.** Every bullet opening with a bolded label and colon; uniform paragraph lengths; symmetric section shapes. Structured components (Playbook, Checklist) are UI and exempt. Running prose must be lumpier than the components.
6. **Grand openers and closers.** Throat-clearing intros, inspirational wrap-ups, "ultimately", "at the end of the day", any closing paragraph that restates the chapter.
7. **Em dashes.** Banned everywhere, including code comments and captions. Use a period, comma, colon, or parentheses. En dashes only for numeric ranges (10–15 min).
8. **Ceremonial metaphors.** "A testament to", "cornerstone", "the data tells a story", personified abstractions.
9. **Cryptic wordplay.** Headings or sentences that tease the point instead of stating it. "The menu changed" as a heading is out; "Pricing changed after month three" is in. Vivid is fine when the meaning is fully on the page.
10. **Invented specifics.** Any name, number, quote, or anecdote that is not in Shane's notes. This is the one that matters most.

## Chapter anatomy

Not every chapter has every part, and the order flexes. Playbooks and checklists are optional: use one only when the chapter has real steps or a real output. The fuller shape is:

1. **Title + description.** The description is the promise: what the reader can do after this chapter.
2. **Opening paragraphs.** Straight into the point. No "in this chapter we will."
3. **Body sections** under `##` headings. Readers skim; headings should make sense as a list on their own (that list is the right-hand TOC).
4. **One worked example**, threaded through as `:::example` callouts placed right after the concept they illustrate. Real, from Shane's experience, awkward parts included.
5. **Playbook**, if the chapter has actions. Numbered steps, one bounded action each, time estimate on every step.
6. **Checklist** at the end: what must be true before the next chapter is worth reading. Three to six items.

Target length: 600 to 900 words of prose. Components do not count toward the budget. A chapter that wants to run longer gets split into two pages.

## Component vocabulary

Callouts, directive syntax (preferred in source):

```mdx
:::note
Context the reader might want. Skipping it costs nothing.
:::

:::tip
A shortcut. Skipping it costs time.
:::

:::warning
Something that fails silently. Skipping it costs an afternoon.
:::

:::example
A beat from a real build. How it actually went.
:::
```

Custom title: `<Callout type="tip" title="Your label">...</Callout>`.

Code blocks: fenced, with a language. Add `title="path/to/file.ts"` for a filename tab. The copy button is automatic.

Playbook:

```mdx
<Playbook>
  <Step title="One bounded action" time="~20 min">
    Optional body. Prose, a code block, a short list.
  </Step>
  <Step title="Another action" time="an evening" />
</Playbook>
```

Checklist (interactive, persists per browser; `id` must be unique across the whole handbook and stable, or readers' ticks reset):

```mdx
<Checklist id="ch3-before-you-move-on" title="Before you move on">
  <Check>Something that must be true.</Check>
  <Check>Something else.</Check>
</Checklist>
```

Margin note (side commentary; floats to the gutter on wide screens, inset card elsewhere):

```mdx
<Aside label="Why">
  One or two sentences. Must be skippable.
</Aside>
```

Footnotes: GitHub-style `[^1]` with the definition at the bottom of the file.

Tables: GitHub-style pipes. Keep them narrow; the reading column is 44rem.

## Files

```
apps/handbook/
├── AUTHORING.md              # this file
├── notes/                    # raw dictation, never published
│   └── <part>/<chapter>.md
├── content/handbook/         # published MDX
│   ├── meta.json             # Part order
│   ├── index.mdx             # landing / table of contents
│   └── <part>/
│       ├── meta.json         # Part title + chapter order
│       └── <chapter>.mdx
└── src/components/handbook/  # Callout, Aside, Playbook, Checklist, ChapterMeta
```

Parts are folders. A Part's title lives in its `meta.json`. Chapter order within a Part is the `pages` array. Slugs are filenames; pick them once and do not rename (URLs are forever).
