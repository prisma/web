import { Children, isValidElement, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import {
  COMPARISON_CTA,
  CREATE_DB_NEW_TAB,
  CREATE_DB_WEB,
  ORM_COMPARISON_CTA,
  ORM_HERO_CTAS,
  POSTGRES_HERO_CTAS,
} from "./_content";
import { ArticleToc, ArticleTocDisclosure, type TocItem } from "./article-toc";
import { COMPARISONS, type ComparisonSlug } from "./comparisons";
import { CompareTable } from "./compare-table";
import { QUIET_LINK } from "./table-styles";
import { renderFaqAnswer } from "@/lib/faq-answer";

const PROSE =
  "answer-prose prose max-w-none text-foreground selection:bg-prism-cyan-100 prose-headings:scroll-mt-28 prose-headings:font-heading prose-headings:font-medium prose-headings:text-balance prose-h2:mt-14 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-pretty prose-p:leading-[1.8] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-a:hover:text-prism-cyan-700 prose-strong:font-semibold prose-li:leading-[1.8] prose-code:break-words prose-th:text-left [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-foreground/70";

const SECTION_H2 = "font-heading text-2xl font-medium";

/**
 * Short labels for the heading list, set apart from the headings themselves.
 * An item can stand for several consecutive sections; it stays marked while
 * any of them is being read.
 */
const AI_MARKDOWN: Partial<Record<ComparisonSlug, string>> = {
  kysely: "/compare/kysely.md",
  mongoose: "/compare/mongoose.md",
  convex: "/compare/convex.md",
  neon: "/compare/neon.md",
  planetscale: "/compare/planetscale.md",
  supabase: "/compare/supabase.md",
};

const TOC: Record<ComparisonSlug, readonly TocItem[]> = {
  kysely: [
    { id: "choose", label: "When to choose" },
    { id: "same-query", label: "Same query" },
    { id: "feature-table", label: "Features" },
    { id: "databases", label: "Databases" },
    { id: "apart", label: "Why Prisma ORM" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When it is the wrong choice" },
    { id: "same-job", label: "Each task" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
    { id: "sources", label: "Sources" },
  ],
  mongoose: [
    { id: "choose", label: "When to choose" },
    { id: "same-query", label: "Same query" },
    { id: "feature-table", label: "Features" },
    { id: "databases", label: "Databases" },
    { id: "apart", label: "Why Prisma ORM" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When it is the wrong choice" },
    { id: "same-job", label: "Each task" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
    { id: "sources", label: "Sources" },
  ],
  convex: [
    { id: "choose", label: "When to choose" },
    { id: "feature-table", label: "Features" },
    { id: "where-each", label: "Where each fits" },
    { id: "apart", label: "Why Prisma Postgres" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When it is the wrong choice" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
    { id: "sources", label: "Sources" },
  ],
  neon: [
    { id: "choose", label: "When to choose" },
    { id: "feature-table", label: "Features" },
    { id: "where-each", label: "Where each fits" },
    { id: "apart", label: "Why Prisma Postgres" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When it is the wrong choice" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
    { id: "sources", label: "Sources" },
  ],
  planetscale: [
    { id: "choose", label: "When to choose" },
    { id: "feature-table", label: "Features" },
    { id: "where-each", label: "Where each fits" },
    { id: "apart", label: "Why Prisma Postgres" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When it is the wrong choice" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
    { id: "sources", label: "Sources" },
  ],
  supabase: [
    { id: "choose", label: "When to choose" },
    { id: "feature-table", label: "Features" },
    { id: "where-each", label: "Where each fits" },
    { id: "apart", label: "Why Prisma Postgres" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When it is the wrong choice" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
    { id: "sources", label: "Sources" },
  ],
};

/**
 * Who-makes-this line under the byline. Full width of the hero card so it
 * reads as one line on desktop; wraps at 390 without overflowing.
 */
export function comparisonDisclosure({
  competitor,
  checked,
  prismaProduct = "Prisma ORM",
}: {
  competitor: string;
  checked: string;
  prismaProduct?: string;
}) {
  return (
    <p className="mt-6 w-full min-w-0 text-sm leading-6 text-muted-foreground">
      Prisma makes {prismaProduct}. {competitor} figures come from the pages listed under{" "}
      <a href="#sources" className={QUIET_LINK}>
        Sources
      </a>
      , checked {checked}.
    </p>
  );
}

/**
 * First body section: one row per choose contrast, competitor | Prisma.
 * Same CompareTable chrome and stacked-card phone layout as Features.
 */
export function comparisonChooseTable({
  competitor,
  prisma,
  competitorItems,
  prismaItems,
  labelledBy = "choose",
}: {
  competitor: string;
  prisma: string;
  competitorItems: readonly string[];
  prismaItems: readonly string[];
  labelledBy?: string;
}) {
  return (
    <CompareTable
      labelledBy={labelledBy}
      columns={[competitor, prisma]}
      minWidth="40rem"
      rows={competitorItems.map((item, index) => ({
        cells: [renderFaqAnswer(item), renderFaqAnswer(prismaItems[index] ?? "")],
      }))}
    />
  );
}

/** Buttons under the introduction. ORM pages lead with the ORM quickstart. */
export function comparisonHeroCtas(kind: "orm" | "postgres" = "postgres") {
  const primary = kind === "orm" ? ORM_HERO_CTAS.primary : POSTGRES_HERO_CTAS.primary;
  const secondary = kind === "orm" ? ORM_HERO_CTAS.secondary : POSTGRES_HERO_CTAS.secondary;
  return (
    <p className="mt-8 flex flex-wrap items-center gap-3">
      <PrismButton href={primary.href} ctaLocation="compare-intro">
        {primary.label}
      </PrismButton>{" "}
      <PrismButtonOutline
        href={secondary.href}
        ctaLocation="compare-intro"
        {...(secondary.href === CREATE_DB_WEB ? CREATE_DB_NEW_TAB : {})}
      >
        {secondary.label}
      </PrismButtonOutline>
    </p>
  );
}

/** Closing action. ORM pages keep the 500K+ Prisma ORM figure and ORM-specific buttons. */
export function comparisonClosingCta(kind: "orm" | "postgres" = "postgres") {
  const cta = kind === "orm" ? ORM_COMPARISON_CTA : COMPARISON_CTA;
  return (
    <section
      key="next"
      id="next"
      aria-labelledby="compare-cta-heading"
      className="mt-16 scroll-mt-28 rounded-xl bg-muted/60 p-7 sm:p-10"
    >
      <h2 id="compare-cta-heading" className={`text-balance ${SECTION_H2}`}>
        {cta.headline}
      </h2>
      <p className="mt-4 max-w-[36rem] text-pretty leading-relaxed text-foreground">{cta.body}</p>
      {kind === "postgres" ? (
        <p className="mt-3 max-w-[36rem] text-sm leading-6 text-muted-foreground">
          {ORM_COMPARISON_CTA.body}
        </p>
      ) : null}
      <ul className="mt-4 max-w-[36rem] list-disc pl-5">
        {cta.checks.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
      <p className="mt-3 max-w-[36rem] text-sm leading-6 text-muted-foreground">
        Need a database?{" "}
        <a
          href={CREATE_DB_WEB}
          target={CREATE_DB_NEW_TAB.target}
          rel={CREATE_DB_NEW_TAB.rel}
          className="underline underline-offset-4 decoration-black/35 transition-colors hover:text-foreground hover:decoration-black/50"
        >
          Create an instant database
        </a>
        .
      </p>
      <p className="mt-7 flex flex-wrap items-center gap-3">
        <PrismButton href={cta.primaryCta.href} ctaLocation="compare-close">
          {cta.primaryCta.label}
        </PrismButton>{" "}
        <PrismButtonOutline href={cta.secondaryCta.href} ctaLocation="compare-close">
          {cta.secondaryCta.label}
        </PrismButtonOutline>
      </p>
    </section>
  );
}

function articleParts(children: ReactNode) {
  const parts = Children.toArray(children);
  if ((parts.length !== 3 && parts.length !== 4) || parts.some((part) => !isValidElement(part))) {
    throw new Error("A comparison article needs an introduction, a body, and a closing action.");
  }
  return parts;
}

/**
 * The same article frame as the product guides: a rounded muted hero card
 * at the Codex guide width (`max-w-site` + `px-6 sm:px-8`), heading list,
 * 760px reading column, closing action, and related links. Hero type matches
 * that guide: `max-w-4xl` title, `max-w-3xl` dek. TOC stays on the right.
 * The column + rail center as one unit, like `/blog/serverless-postgres`.
 * The directory stays separate.
 */
export function CompareArticle({ slug, children }: { slug: ComparisonSlug; children: ReactNode }) {
  const entry = COMPARISONS.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Unknown comparison: ${slug}`);
  const [intro, body, closing, footnote] = articleParts(children);
  const related = COMPARISONS.filter((item) => item.slug !== slug);

  return (
    <article className="overflow-x-clip bg-background pb-24 pt-32 sm:pt-40">
      <header className="mx-auto max-w-site px-6 sm:px-8">
        <div className="rounded-2xl bg-muted/50 px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/compare" className="hover:text-foreground">
              Compare
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <span aria-current="page" className="text-foreground">
              {entry.competitor}
            </span>
          </nav>
          {intro}
        </div>
      </header>

      <div className="mx-auto max-w-site px-6 sm:px-8">
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,760px)_220px] lg:justify-center lg:gap-14 xl:gap-20">
          <div className="min-w-0 max-w-3xl">
            <div className="mb-10 lg:hidden">
              <ArticleTocDisclosure items={TOC[slug]} markdownPath={AI_MARKDOWN[slug]} />
            </div>
            <div className={PROSE}>{body}</div>
            {closing}
            {footnote}
            <nav aria-labelledby="related-comparisons-heading" className="mt-14">
              <h2 id="related-comparisons-heading" className={SECTION_H2}>
                Related comparisons
              </h2>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/compare/${item.slug}`}
                      className="group flex min-h-11 items-center justify-between gap-4 py-4 text-sm hover:text-prism-cyan-700"
                    >
                      {item.title}
                      <ArrowRight
                        className="size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <aside className="hidden lg:block">
            <ArticleToc items={TOC[slug]} markdownPath={AI_MARKDOWN[slug]} />
          </aside>
        </div>
      </div>
    </article>
  );
}
