# Voice: a person explaining what changed

The entry is read by a developer who is deciding whether an update affects them. Write the way you would explain the change to a colleague at the next desk. A changelog built from pull request titles reads like a spec: every sentence is true, and the reader still has to work out what it means for them. The job of this pass is to do that work for the reader.

The house rules for prose are in the `docs-reader-review` skill, and they apply here in full:

- `.claude/skills/docs-reader-review/references/explain-not-state.md` describes the habit of stating facts without explaining them, and how to fix it.
- `.claude/skills/docs-reader-review/references/ai-writing-signs.md` lists the words and sentence shapes that make text read as machine-written.
- `.claude/skills/docs-reader-review/references/banned-terms.md` lists the source-code vocabulary that readers do not have.

Read all three before you write. The rest of this file is what is specific to the changelog.

## Explain, do not state

For each change, say what it means for the reader before you say how it works. Three habits do most of the work.

**Start from the reader's situation.** Open a headline section with what the reader does today and what was wrong with it, and only then say what is new. "When a coding agent works in Prisma today, it uses your CLI session. As far as Prisma can tell, the agent is you" tells a reader why enrollment matters. "Agents can now be enrolled with a credential and a policy" does not.

**Walk through it as a scenario.** Put the reader in the sentence: "When a deploy goes wrong, you can ask your AI tool to read the deployment's runtime logs, and then ask it to roll the app back." A list of tool names leaves the reader to imagine that for themselves.

**Keep the connectives.** When two facts are cause and effect, or condition and result, join them with "so", "because", "when", "if", or "which". "Because the credential belongs to the agent, you can pause or revoke it without affecting your own access" is one thought. Split into two short sentences, it becomes two facts the reader has to connect. A run of clipped sentences is the most common sign of a changelog written from a diff.

Say what was true before when it helps a reader recognize their own problem: "Your choice was dropped before, and the project deployed in US East."

## Prose for reasoning, lists for scanning

Use a paragraph when you are explaining why something matters or how the pieces fit together. Headline sections, and product sections with a handful of related changes, are paragraphs.

Use a list when the items are the same kind of thing and the reader will scan for the one that applies to them: the audiences under "What you need to do", breaking changes, a product's new features, fixes, and guides. In a list, each item is still one or more full sentences that explain the change.

Introduce a list by what its items have in common ("Connecting a repository takes fewer steps as well:"), never by how many there are ("Three smaller changes:").

## Words the reader does not have

A reader on the previous version does not know the new version's vocabulary. Replace a term from the source code or the release notes with what it means, or define it in the sentence that first uses it.

- "a migration snapshot" becomes "the copy of your schema that a migration stores"
- "buffered queries" becomes "a query whose results you have not finished reading"
- "a Composer project's topology" becomes "how the project's services connect to each other"
- "the upgrade recipe" becomes "the upgrade guide linked from each release"

Identifiers in backticks are not prose and stay as they are. Run `check-plain.sh` from `docs-reader-review` to catch the terms on the banned list.

## Name the product

The product name appears wherever a reader might land: the title, the opening paragraph, and the first sentence of each section. A reader who jumps to the middle of the entry should know which product a paragraph is about.

Use the names in the positioning doc, in full. Check two things against the docs before you write, because they change between entries:

- **The name.** Follow what the docs call the product today. For example, the docs say "Prisma ORM" and add a version number only when two versions are being contrasted, as in "Prisma ORM 8 can now read your Prisma 7 `schema.prisma` file".
- **The maturity.** Early Access, release candidate, and generally available mean different things to a reader. State a product's maturity once per entry, in the docs' wording, and do not repeat it in headings.

## Titles and headings

The title tells someone scanning the changelog index whether to open the entry.

- Lead with what the reader can do, and name the product: "Let your coding agent set up Prisma and ask before it touches production".
- Say what the reader gets, and leave out what the feature is made of. "Enroll your coding agent in Prisma with its own credential" names the mechanism. The version above names the two things the reader cares about.
- A launch is the exception, where the event is the news: "Prisma Compute is now generally available". The index page gives the featured treatment to titles that say "generally available", "now available", or "now in beta" or "preview", so use those phrases only for a real launch.
- One claim per title. When an entry covers several products, lead with the biggest change and let the opening carry the rest.
- No `Prisma:` prefix, no version number, and no verbs like "lands", "arrives", or "ships".

Headline section headings follow the same rules: an outcome or an action the reader can take, in sentence case.

## Emphasis

Bold is for three things: the first sentence of the entry, interface labels the reader will click (**Save changes**), and dates the reader must not miss. In a list the reader scans, the first sentence of an item can be bold when it names the change. Do not bold a phrase in every paragraph, and do not use italics to stress a word. If the sentence needs stress to be understood, rewrite the sentence.

## Sentence rules

- Use a number only when it appears in the source. Never estimate one.
- Put every exact identifier in backticks: packages, import paths, config files, API fields, routes, commands, and error codes. Product areas such as the Console and the REST API stay plain text.
- A link says what the reader gets there: "The [enrollment guide](url) explains the policy in detail." Never "Read more".
- Use the count of items there actually are. Lists of exactly three adjectives or three examples, again and again, read as generated.
- Avoid framing a change as a contrast the reader was not thinking about ("not just X, but Y"). Say what it does.

## From pull request to sentence

Take the mechanism out, keep the effect, and add what it means for the reader.

- "Use every key column in includes, nested writes and multi-table variants" becomes "Loading related records with `include()` across a composite foreign key now returns the right rows. It used to match on the first key column only, so it could return rows that belonged to other parents."
- "Schedule paid-to-paid downgrades for the end of the period" becomes "When you downgrade from one paid plan to another, the change now takes effect at the end of the billing period, and you keep your current plan until then."
- "Accept and return logicalId on services, databases, and buckets" becomes "Services, databases, and buckets now have an optional `logicalId`, an identifier you choose so that your own tooling can tell which resource is which."
- "Reduce included-result decoding overhead" has no effect a reader can observe without a number from the source, so it is excluded.

## The reader review

The checker scripts find words and sentence shapes. They cannot tell whether a paragraph explains anything. Before the entry goes into a pull request, give it to a fresh reviewer who has not seen the sources, using `.claude/skills/docs-reader-review/references/reader-persona.md` as its instructions. Describe the reader as someone who has used the previous version of the product for two years and is skimming to learn what changed and whether they have to act.

Rewrite every sentence the reviewer could not restate, then check the rewritten sentences against the sources again. A rewrite that reads well and says something the source does not is worse than the sentence it replaced.
