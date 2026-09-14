import { BENEFITS, CONTACT_URL, DATABASES } from "@/app/enterprise/enterprise-content";
import { bulletList, ctaList, definitionList, heading, joinBlocks, paragraphs } from "./blocks";

export const ENTERPRISE_H1 = "Prisma at enterprise scale";
export const ENTERPRISE_SUBHEADLINE =
  "By integrating Prisma into your development workflow, you build adaptable applications with less code and fewer errors, and as you grow, your data layer scales without sacrificing performance or security.";

/** Markdown rendition of /enterprise (src/app/enterprise/page.tsx). */
export function renderEnterpriseMarkdown(): string {
  return joinBlocks([
    // The H1, the subheadline and the "Enterprise" role kicker come from the
    // caller; this starts at the hero CTA.
    ctaList([{ label: "Talk to the Prisma team", href: CONTACT_URL }]),

    heading(2, "What an enterprise engagement includes"),
    // The nine benefit cards are <h3>s inside a grid, so they read as a list.
    definitionList(
      BENEFITS.map((benefit) => ({ name: benefit.title, description: benefit.description })),
    ),

    // "Bring your own database" is a <p> label over the logo strip rather than
    // a heading, so it stays a paragraph; the logos go, the names stay.
    paragraphs("Bring your own database"),
    bulletList(DATABASES.map((database) => database.name)),

    heading(2, "Connect with us"),
    paragraphs(
      "Tell us about your team, and we'll show you how our support options fit your agency or enterprise's work with Prisma.",
    ),
    ctaList([{ label: "Contact enterprise sales", href: CONTACT_URL }]),
  ]);
}
