import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RoleKicker } from "@/components/brand/role-kicker";
import { PrismButton } from "@/components/brand/prism-button";
import { ChevronRight, Shield } from "@/components/icons/forma";
import { LegalSectionLink } from "@/components/sections/legal-section-link";

// Shared shell for the signable agreements under /legal (BAA, DPA): a sticky
// contents sidebar, a key-terms summary, the verbatim legal text with a
// plain-English note per section, and a closing panel that says how to get
// the agreement in place. Unlike LegalPage, the body is pre-rendered HTML
// generated from the committed agreement template.
export type AgreementSection = {
  roman: string;
  title: string;
  slug: string;
  // Verbatim legal text as pre-rendered HTML (safe: generated from a
  // committed source file, no user input).
  html: string;
};

export type AgreementKeyTerm = {
  label: string;
  value: ReactNode;
};

export const INLINE_LINK =
  "font-medium text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-black/60";

// Numbered step for the closing panel.
export function AgreementStep({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

type TocProps = {
  sections: AgreementSection[];
  closingId: string;
  closingLabel: string;
};

// The contents list itself, shared by the desktop sidebar and the mobile
// disclosure.
// `listClassName` sets the row spacing: tight in the sidebar, taller tap
// targets (padding on the links, not gaps between them) in the mobile list.
function TocLinks({
  sections,
  closingId,
  closingLabel,
  listClassName = "gap-1.5",
}: TocProps & { listClassName?: string }) {
  return (
    <>
      <ul className={cn("flex flex-col", listClassName)}>
        <li>
          <a href="#key-terms" className="block text-foreground/80 hover:text-foreground">
            Key terms
          </a>
        </li>
        {sections.map((s) => (
          <li key={s.slug}>
            <a
              href={`#${s.slug}`}
              className="flex items-baseline gap-2 text-foreground/80 hover:text-foreground"
            >
              <span className="w-6 shrink-0 text-right font-mono text-[0.7rem] text-muted-foreground">
                {s.roman}.
              </span>
              <span>{s.title}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Divider + plain text link. The only emphasis is a prism-rainbow
          gradient on the text itself (dark cyan -> dark red -> dark yellow
          from the prism-700 scales, so it stays readable on white). The
          same `bg-clip-text text-transparent` pattern is used in
          apps/docs/src/components/ai-elements/shimmer.tsx, adapted here to a
          static gradient from the --color-prism-*-700 tokens that
          packages/eclipse/src/styles/globals.css defines. */}
      <div className="mt-5 border-t border-black/[0.07] pt-5">
        <a
          href={`#${closingId}`}
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--color-prism-cyan-700) 0%, var(--color-prism-red-700) 50%, var(--color-prism-yellow-700) 100%)",
          }}
        >
          {closingLabel}
        </a>
      </div>
    </>
  );
}

function Toc(props: TocProps) {
  return (
    <nav aria-label="Contents" className="text-sm">
      <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Contents
      </p>
      <TocLinks {...props} />
    </nav>
  );
}

// Below md the sidebar is hidden, so the same list sits under the header in a
// native disclosure: collapsed by default so the key terms stay near the top,
// and no client JS. Only one of the two "Contents" navs is ever displayed.
function MobileToc(props: TocProps) {
  return (
    <details className="group mt-8 rounded-2xl border border-black/[0.08] md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-foreground [&::-webkit-details-marker]:hidden">
        Contents
        <ChevronRight
          className="size-4 text-muted-foreground transition-transform group-open:rotate-90"
          aria-hidden
        />
      </summary>
      <nav aria-label="Contents" className="border-t border-black/[0.07] px-5 pb-5 pt-4 text-sm">
        <TocLinks {...props} listClassName="[&_a]:py-2" />
      </nav>
    </details>
  );
}

function KeyTerms({ items }: { items: AgreementKeyTerm[] }) {
  return (
    <section
      id="key-terms"
      aria-labelledby="key-terms-heading"
      className="scroll-mt-28 rounded-2xl border border-black/[0.08] p-6 sm:p-7"
    >
      <div className="flex items-center gap-3">
        <Shield className="size-5 text-foreground/80" aria-hidden />
        <h2
          id="key-terms-heading"
          className="text-base font-semibold uppercase tracking-[0.08em] text-foreground"
        >
          Key terms
        </h2>
      </div>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-foreground/80">
        A short summary of the clauses most readers want up front. The full legal text below is the
        agreement itself.
      </p>
      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-[12rem_1fr]">
        {items.map(({ label, value }) => (
          <div key={label} className="contents">
            <dt className="text-[0.9375rem] font-semibold text-foreground">{label}</dt>
            <dd className="text-[0.9375rem] leading-relaxed text-foreground/80">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function PlainEnglish({ note }: { note?: ReactNode }) {
  if (!note) return null;
  return (
    <aside
      aria-label="Plain English summary"
      className="mt-5 rounded-xl border border-black/[0.08] p-5"
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        In plain English
      </p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/85">{note}</p>
    </aside>
  );
}

export function LegalAgreementPage({
  title,
  intro,
  lastUpdated,
  pdfHref,
  headerExtra,
  keyTerms,
  sections,
  plainEnglish,
  closingId,
  closingLabel,
  closing,
}: {
  title: string;
  intro: ReactNode;
  lastUpdated: string;
  pdfHref: string;
  // Optional link or note beside the header's PDF button.
  headerExtra?: ReactNode;
  keyTerms: AgreementKeyTerm[];
  sections: AgreementSection[];
  // Plain-English companion notes keyed by section slug. These are review
  // copy, not legal text; the notice above the body says the legal text
  // governs.
  plainEnglish: Record<string, ReactNode>;
  // The closing panel (how to get the agreement in place) and the gradient
  // sidebar link that jumps to it.
  closingId: string;
  closingLabel: string;
  closing: ReactNode;
}) {
  return (
    <article className="bg-white px-4 pb-24 pt-32 sm:px-8 sm:pb-32 md:pt-40">
      <div className="mx-auto max-w-6xl md:grid md:grid-cols-[14rem_minmax(0,1fr)] md:gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        {/* Sticky TOC on desktop. Hidden on small screens; sections remain
            anchor-navigable from in-page links. */}
        <aside className="hidden md:block">
          <div className="sticky top-28">
            <Toc sections={sections} closingId={closingId} closingLabel={closingLabel} />
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-black/[0.07] pb-10">
            <RoleKicker color="bg-prism-cyan-400">Legal</RoleKicker>
            <h1 className="mt-4 text-balance text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-[58ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              {intro}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong className="font-semibold text-foreground">Last updated:</strong> {lastUpdated}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PrismButton href={pdfHref}>Download as PDF</PrismButton>
              {headerExtra}
            </div>
          </header>

          <MobileToc sections={sections} closingId={closingId} closingLabel={closingLabel} />

          <div className="mt-8 md:mt-10">
            <KeyTerms items={keyTerms} />
          </div>

          <div className="mt-6 flex flex-col">
            {sections.map((section) => (
              <section
                key={section.slug}
                id={section.slug}
                className="scroll-mt-28 border-b border-black/[0.05] py-8 last:border-b-0"
              >
                <h2 className="group text-xl leading-snug sm:text-2xl">
                  <span className="mr-2 font-mono text-sm font-medium text-muted-foreground">
                    {section.roman}.
                  </span>
                  {section.title}
                  <LegalSectionLink slug={section.slug} title={section.title} />
                </h2>
                <PlainEnglish note={plainEnglish[section.slug]} />
                {/* The legal body is pre-rendered from a committed template
                    file. No user input flows into this HTML. */}
                <div
                  className="prose mt-6 max-w-none text-[0.9375rem] leading-relaxed prose-p:my-3 prose-a:text-prism-cyan-700"
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </section>
            ))}

            <section
              id={closingId}
              className="scroll-mt-28 mt-8 rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8"
            >
              {closing}
            </section>

            <p className="mt-8 text-sm text-muted-foreground">
              Plain English summaries are for convenience only. The legal text governs.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
