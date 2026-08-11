import type { ReactNode } from "react";
import { RoleKicker } from "@/components/brand/role-kicker";

// Shared shell for the /legal/* pages, ported from the old site's legal pages
// (their section data moved to src/lib/legal/ unchanged). The old accordion
// became a plain stacked document — legal text should be scannable and
// printable, not collapsed.
export type LegalSection = {
  title: string;
  content: ReactNode;
};

export function LegalPage({
  title,
  lastUpdated,
  sections,
  intro,
}: {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  intro?: ReactNode;
}) {
  return (
    <article className="bg-white px-4 pb-24 pt-32 sm:px-8 sm:pb-32 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-black/[0.07] pb-10">
          <RoleKicker color="bg-prism-cyan-400">Legal</RoleKicker>
          <h1 className="mt-4 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-[58ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              {intro}
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            <strong className="font-semibold text-foreground">Last updated:</strong> {lastUpdated}
          </p>
        </header>

        <div className="mt-4 flex flex-col">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border-b border-black/[0.05] py-8 last:border-b-0"
            >
              <h2 className="text-xl leading-snug sm:text-2xl">{section.title}</h2>
              <div className="prose mt-4 max-w-none text-[0.9375rem] prose-a:text-prism-cyan-700 prose-p:leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
