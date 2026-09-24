import {
  CONSOLE_URL,
  FEATURE_CARDS,
  FEATURE_ROWS,
  STUDIO_DOCS_URL,
  TRY_STUDIO_COMMAND,
} from "@/app/studio/studio-content";
import { ctaList, heading, joinBlocks, paragraphs } from "./blocks";

export const STUDIO_H1 = "Explore and understand your data";
export const STUDIO_SUBHEADLINE =
  "A visual browser and editor for the data in your Prisma project. Work locally or team up inside the Prisma Console.";

/** Markdown rendition of /studio (src/app/studio/page.tsx). */
export function renderStudioMarkdown(): string {
  return joinBlocks([
    // Hero. The H1, the subheadline and the "Prisma Studio" role kicker are
    // the caller's job; the rendition starts at the hero CTAs.
    ctaList([
      { label: "Explore Studio in Prisma Console", href: CONSOLE_URL },
      { label: "Try locally", href: STUDIO_DOCS_URL },
    ]),

    // The three intro cards title themselves with <h2>, so they keep that level.
    ...FEATURE_CARDS.flatMap((card) => [heading(2, card.title), paragraphs(card.description)]),

    // Feature tour. Each row's eyebrow (RoleKicker) is visible copy that the
    // heading alone would lose, so it stays as a bold lead-in above the prose.
    ...FEATURE_ROWS.flatMap((row) => [
      heading(2, row.title),
      `**${row.eyebrow}**`,
      paragraphs(row.description),
    ]),

    // Video walkthrough: the embed is dropped, the copy and its link stay.
    heading(2, "See how Studio works"),
    paragraphs(
      "Access Prisma Studio on your local machine during development, or in the Prisma Console to collaborate on data with your team.",
    ),
    ctaList([{ label: "Explore Studio in Console", href: CONSOLE_URL }]),

    heading(2, "Try it out"),
    paragraphs("Take Studio for a spin with a local pre-seeded database and example project."),
    ["```bash", TRY_STUDIO_COMMAND, "```"].join("\n"),
  ]);
}
