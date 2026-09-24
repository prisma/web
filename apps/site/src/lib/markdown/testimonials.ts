import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import { heading, joinBlocks } from "./blocks";

/**
 * Markdown for sections/testimonials-reveal.tsx, shared by every page that
 * renders it (/, /orm, /postgres, /pricing).
 *
 * The HTML shows the quotes in two marquee rows and duplicates each row's
 * half-track so the loop is seamless, so a naive transcription would repeat
 * every quote four times. Markdown has no marquee: each quote appears once, in
 * the order the array declares them.
 */
export function renderTestimonialsMarkdown(sectionHeading = "Real teams, real builds"): string {
  return joinBlocks([
    heading(2, sectionHeading),
    TESTIMONIALS.map(
      (testimonial) =>
        `- "${testimonial.quote}" — ${testimonial.name}, ${testimonial.role}, ${testimonial.company}`,
    ).join("\n"),
  ]);
}
