import {
  OPEN_STUDIO_COMMAND,
  QUICK_ACCESS,
  STUDIO_COMPARISON,
  STUDIO_EMBED,
  STUDIO_FAQ,
  STUDIO_HERO,
  STUDIO_TOUR,
  TRY_STUDIO_STEPS,
} from "@/app/studio/studio-content";
import { ctaList, heading, joinBlocks, paragraphs, table } from "./blocks";

export const STUDIO_H1 = STUDIO_HERO.headline;
export const STUDIO_SUBHEADLINE = STUDIO_HERO.subheadline;

/** Markdown rendition of /studio (src/app/studio/page.tsx). */
export function renderStudioMarkdown(): string {
  return joinBlocks([
    // Hero. The H1, the subheadline and the "Prisma Studio" role kicker are
    // the caller's job; the rendition starts at the hero CTAs. "Get started"
    // is an in-page jump to the next section, so only Console gets a line.
    ctaList([STUDIO_HERO.secondaryCta]),

    // Quick access: the two ways to open Studio.
    heading(2, QUICK_ACCESS.title),
    paragraphs(QUICK_ACCESS.intro),
    heading(3, QUICK_ACCESS.local.title),
    paragraphs(QUICK_ACCESS.local.description),
    paragraphs("New example:"),
    ["```bash", TRY_STUDIO_STEPS.join("\n"), "```"].join("\n"),
    paragraphs("Any database:"),
    ["```bash", OPEN_STUDIO_COMMAND, "```"].join("\n"),
    paragraphs(QUICK_ACCESS.local.note),
    heading(3, QUICK_ACCESS.console.title),
    paragraphs(QUICK_ACCESS.console.description),
    QUICK_ACCESS.console.points.map((point) => `- ${point}`).join("\n"),
    ctaList([QUICK_ACCESS.console.cta, QUICK_ACCESS.console.secondaryCta]),

    // Feature tour: every stop's title and description (the page keeps them
    // all in the DOM; only the screenshots swap).
    heading(2, STUDIO_TOUR.title),
    ...STUDIO_TOUR.stops.flatMap((stop) => [heading(3, stop.title), paragraphs(stop.description)]),

    // Embed: intro, use cases, facts, the snippet and both links.
    heading(2, STUDIO_EMBED.title),
    paragraphs(STUDIO_EMBED.intro),
    STUDIO_EMBED.useCases.map((useCase) => `- ${useCase}`).join("\n"),
    paragraphs(STUDIO_EMBED.facts),
    ["```tsx", STUDIO_EMBED.code, "```"].join("\n"),
    ctaList([STUDIO_EMBED.cta, STUDIO_EMBED.demo]),

    // Comparison table, then its date-and-sources note.
    heading(2, STUDIO_COMPARISON.title),
    paragraphs(STUDIO_COMPARISON.intro),
    table(
      [STUDIO_COMPARISON.corner, ...STUDIO_COMPARISON.columns],
      STUDIO_COMPARISON.rows.map((row) => [row.label, ...row.cells]),
    ),
    paragraphs(
      `${STUDIO_COMPARISON.note} Sources: ${STUDIO_COMPARISON.sources
        .map((source) => `[${source.label}](${source.href})`)
        .join(", ")}.`,
    ),

    // FAQ: the accordion's heading, then each question with its answer (the
    // answers' inline markup is already Markdown).
    heading(2, "Prisma Studio FAQ"),
    ...STUDIO_FAQ.flatMap((item) => [heading(3, item.question), paragraphs(item.answer)]),
  ]);
}
