# Structure: the MDX file and the pull request

The entry is one file at `apps/site/content/changelog/{YYYY-MM-DD}.mdx`. The two newest entries in that directory are the working samples. When they and this document disagree, follow the entries and update this document in the same pull request.

## Frontmatter

```yaml
---
title: "Let your coding agent set up Prisma and ask before it touches production"
date: "2026-10-02"
version: "2026-10-02"
slug: "2026-10-02"
headline: "Let your coding agent set up Prisma and ask before it touches production"
tags:
  - "Prisma"
  - "Prisma Compute"
  - "Prisma ORM"
canonical: "/changelog#log2026-10-02"
metaDescription: "Coding agents can now work in Prisma with their own credential and ask before they change production. Also new: ..."
share:
  active: true
  content: "Look at this page: "
---
```

- `date` is the day the entry lands, and `slug` and `version` repeat it. `version` is never a product version.
- `headline` repeats `title`.
- `metaDescription` is one or two sentences that name the biggest change and the next two.
- `tags` start with `"Prisma"`, then list each product the entry covers.

The index page at `/changelog` derives a single category for the entry from its tags, in `apps/site/src/lib/changelog-meta.ts`. The first match wins, in this order: a tag containing "Studio", then "Compute", then "Postgres" or "Accelerate", then "ORM". So tag a product only when the entry has real content for it, or the entry lands under the wrong filter.

## Body, in this order

Leave out any block that has no content. Do not repeat the title as a heading, because the page renders it from the frontmatter.

1. **Opening.** The first sentence is the biggest change, in bold, and it has to stand alone because the index page shows only the start of the entry. The other headline changes follow in a sentence each. If the reader must act by a date, a second short paragraph names each date in bold and points to "What you need to do".

2. **Up to three headline sections, the most impactful first.** Each is an `##` heading that states the outcome, either as a sentence (`## Coding agents get their own credential and ask before production changes`) or as an action the reader can take (`## Try Prisma ORM 8 on the schema you already have`). A heading that names only the feature, such as "Agent enrollment", tells a skimmer nothing. A change earns a headline section when it changes what a reader can do and can be explained in a few short paragraphs. A fix never does. Inside each section:
   - paragraphs, not bullets: what the reader does today and what was wrong with it, then what is new, then how to start
   - one screenshot when the change is visual
   - one code block when the change is something the reader types
   - a row of one or two buttons that lead to the product and to the docs
   
   Order them by impact: how many readers the change reaches and how much it changes what they can do. Lead with the commercial products only when two changes are of similar weight.

3. **`## What you need to do`.** Include it whenever a reader has to act. One bullet per audience, opening with a bold condition that lets readers find themselves: `- **If you are on Prisma ORM 7**, you do not need to change anything.` Each bullet states the action, the deadline in bold, the reason, and the guide to follow. Put the nearest deadline and the largest loss first, so a bullet about data that will be deleted comes before one about a connection string. Say so when a group has nothing to do.

4. **`## Breaking changes`.** One line saying which versions they apply to, then one bullet per change. The bullet opens with what changed in bold, then explains what the reader will see and what to write instead, then links the pull request. When a release has more breaking changes than most apps will hit, list the common ones and link the full release notes.

5. **`## Deprecations`.** One bullet per deprecation, in full sentences: the product, what is deprecated, what replaces it, the date, and whether the old form still works. When the action is already under "What you need to do", link the guide and do not repeat the steps.

6. **One `##` section per product**, headed with the exact product name. The section opens with its biggest change, explained in a short paragraph. Related smaller changes follow as further paragraphs, or as a list when there are several of the same kind, introduced by a sentence that says what they have in common. Put the most impactful first. Order the sections by how much changed for users.

7. **`## Fixes`.** Always visible and grouped by product under bold labels. Within a product, wrong results and data loss come first, then failures, then cosmetic fixes. Each fix is a full sentence, and it says what went wrong before when that helps a reader recognize the bug.

8. **`## Guides and articles`.** One bullet per new post or guide. Link the published page, and follow it with a colon and one sentence about what the reader gets.

9. **Around Prisma.** Events and community news, each under its own `##` heading, and only when there is something a reader can attend or use.

10. **The closing line.** A thematic break, then this line and nothing else:

    ```mdx
    ---

    *Need help applying these changes in production? [Prisma Enterprise Support](/enterprise) can help with schema design, performance, security, and compliance.*
    ```

## Short windows

A week with a few fixes gets the opening paragraph, the product sections that have content, and the fixes. Do not promote a small change to a headline section to fill space.

## Links

- Docs links are absolute: `https://www.prisma.io/docs/...`. Site pages are relative: `/pricing`, `/extensions`, `/enterprise`.
- Link the docs page wherever a documented feature is mentioned. Use only paths you have checked against production.
- Pull request references trail the sentence in parentheses. For the ORM repository write `([#30365](https://github.com/prisma/orm/pull/30365))`. For any other public repository add its name: `([prisma-engines#5851](url))`. Changes from private repositories get no reference.
- A button that leads to the Console carries UTM parameters, as in `?utm_source=changelog&utm_medium=cta&utm_campaign=agent-enrollment`.

## Components

Buttons go in a wrapper that opts out of prose styling. Use the filled button for the main action and the outline button for the second one. `ctaLocation` is `changelog-` followed by a short name for the section.

```mdx
<div className="not-prose flex flex-wrap gap-3">
  <PrismButton href="https://www.prisma.io/docs/ai/tools/mcp-server" ctaLocation="changelog-mcp-compute">Connect the Prisma MCP server</PrismButton>
  <PrismButtonOutline href="https://www.prisma.io/docs/ai/mcp-tools" ctaLocation="changelog-mcp-compute">See every tool</PrismButtonOutline>
</div>
```

Code blocks take a language and a title, and stay small enough to read at a glance:

````mdx
```bash title="Terminal"
npx prisma@latest orm init --from-prisma7-schema prisma/schema.prisma
```
````

Take every identifier in a snippet from the release notes or the docs. If you had to guess an import path or an option name, say so in the triage note.

To show inline code that itself contains a backtick, wrap it in double backticks: ``` ``@default(sql`gen_random_uuid()`)`` ```.

## Images

Images live in `apps/site/public/changelog/` and are named `{YYYY-MM-DD}-{short-name}.png`. Reference them as `/changelog/{file}`. The alt text describes what the screenshot shows, in one sentence, for a reader who cannot see it.

## The pull request

Branch `changelog/{YYYY-MM-DD}`, commit `docs(site): add changelog entry {YYYY-MM-DD}`, and put one paragraph in the commit body that states the window and the headline changes.

The pull request body leads with the conclusion and is short enough to skim:

```markdown
## What

Adds the changelog entry for {window} at `apps/site/content/changelog/{date}.mdx`.

**The headline is {biggest change}.** {The other headline changes, in one sentence.}

## Dates readers must act on

- **{date}:** {what happens}

## Review focus

- {Naming or maturity wording a reviewer should confirm.}
- {Items sourced from private repositories that are worth a look in the product.}

## Triage notes

**Held back, needs confirmation that it is public**

- {item}: {reason}

**Held for the next entry, not released yet**

- {item}: {reason}

**Excluded**

- {item or group}: {reason}

## Checks

- {What you ran and what it reported.}
```

Leave out "Dates readers must act on" when there are none. The triage notes describe held and excluded work in the same public-safe terms as the entry, because the pull request is public too.
