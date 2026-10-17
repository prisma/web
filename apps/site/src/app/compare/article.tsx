import { Children, isValidElement, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { COMPARISON_CTA } from "./_content";
import { COMPARISONS, type ComparisonSlug } from "./comparisons";

const PROSE =
  "answer-prose prose max-w-none text-foreground prose-headings:scroll-mt-28 prose-headings:font-heading prose-headings:font-medium prose-headings:text-balance prose-h2:mt-14 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-pretty prose-p:leading-[1.8] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-prism-cyan-700 prose-strong:font-semibold prose-li:leading-[1.8] prose-code:break-words prose-th:text-left";

const TOC: Record<ComparisonSlug, readonly { id: string; label: string }[]> = {
  kysely: [
    { id: "choose", label: "Choose Prisma ORM if" },
    { id: "choose-kysely", label: "Choose Kysely if" },
    { id: "feature-table", label: "What each one supports" },
    { id: "where-kysely", label: "Where Kysely works well" },
    { id: "where-prisma", label: "Where Prisma ORM fits better" },
    { id: "apart", label: "What sets Prisma ORM apart" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When Prisma ORM is the wrong choice" },
    { id: "migrate", label: "Move from Kysely to Prisma ORM" },
    { id: "migrate-back", label: "Move from Prisma ORM to Kysely" },
    { id: "proof", label: "What teams on Prisma say" },
    { id: "faq", label: "Frequently asked questions" },
    { id: "next", label: "Ready to build with Prisma?" },
  ],
  mongoose: [
    { id: "choose", label: "Choose Prisma ORM if" },
    { id: "choose-mongoose", label: "Choose Mongoose if" },
    { id: "feature-table", label: "What each one supports" },
    { id: "where-mongoose", label: "Where Mongoose works well" },
    { id: "where-prisma", label: "Where Prisma ORM fits better" },
    { id: "apart", label: "What sets Prisma ORM apart" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When Prisma ORM is the wrong choice" },
    { id: "migrate", label: "Move from Mongoose to Prisma ORM" },
    { id: "migrate-back", label: "Move from Prisma ORM to Mongoose" },
    { id: "proof", label: "What teams on Prisma say" },
    { id: "faq", label: "Frequently asked questions" },
    { id: "next", label: "Ready to build with Prisma?" },
  ],
  convex: [
    { id: "choose", label: "Choose Prisma Postgres if" },
    { id: "choose-convex", label: "Choose Convex if" },
    { id: "feature-table", label: "What each one supports" },
    { id: "where-convex", label: "Where Convex works well" },
    { id: "where-prisma", label: "Where Prisma Postgres fits better" },
    { id: "apart", label: "What sets Prisma Postgres apart" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "When Prisma Postgres is the wrong choice" },
    { id: "migrate", label: "Move from Convex to Prisma Postgres" },
    { id: "migrate-back", label: "Move from Prisma Postgres to Convex" },
    { id: "proof", label: "What teams on Prisma say" },
    { id: "faq", label: "Frequently asked questions" },
    { id: "next", label: "Ready to build with Prisma?" },
  ],
};

/** Buttons under the introduction, matching the comparison pages' opening actions. */
export function comparisonHeroCtas() {
  return (
    <p className="mt-8 flex flex-wrap items-center gap-3">
      <PrismButton href="https://console.prisma.io" ctaLocation="compare-intro">
        Get started free
      </PrismButton>{" "}
      <PrismButtonOutline href="/pricing" ctaLocation="compare-intro">
        See pricing
      </PrismButtonOutline>
    </p>
  );
}

/** Closing action from the comparison pages: the shared checks, console, and contact. */
export function comparisonClosingCta() {
  return (
    <section
      id="next"
      aria-labelledby="compare-cta-heading"
      className="mt-16 scroll-mt-28 rounded-xl bg-muted/60 p-7 sm:p-10"
    >
      <h2 id="compare-cta-heading" className="text-balance font-heading text-2xl font-medium">
        {COMPARISON_CTA.headline}
      </h2>
      <p className="mt-4 text-pretty leading-relaxed text-foreground">{COMPARISON_CTA.body}</p>
      <ul className="mt-4 list-disc pl-5">
        {COMPARISON_CTA.checks.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
      <p className="mt-7 flex flex-wrap items-center gap-3">
        <PrismButton href={COMPARISON_CTA.primaryCta.href} ctaLocation="compare-close">
          {COMPARISON_CTA.primaryCta.label}
        </PrismButton>{" "}
        <PrismButtonOutline href={COMPARISON_CTA.secondaryCta.href} ctaLocation="compare-close">
          {COMPARISON_CTA.secondaryCta.label}
        </PrismButtonOutline>
      </p>
    </section>
  );
}

function articleParts(children: ReactNode) {
  const parts = Children.toArray(children);
  if (parts.length !== 3 || parts.some((part) => !isValidElement(part))) {
    throw new Error("A comparison article needs an introduction, a body, and a closing action.");
  }
  return parts;
}

/**
 * The same article frame as the product guides: header card, heading list,
 * reading column, closing action, and related links. The directory stays separate.
 */
export function CompareArticle({ slug, children }: { slug: ComparisonSlug; children: ReactNode }) {
  const entry = COMPARISONS.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Unknown comparison: ${slug}`);
  const [intro, body, closing] = articleParts(children);
  const related = COMPARISONS.filter((item) => item.slug !== slug);

  return (
    <article className="bg-background pb-24 pt-32 sm:pt-40">
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
            <span className="text-foreground">{entry.competitor}</span>
          </nav>
          {intro}
        </div>
      </header>

      <div className="mx-auto mt-12 grid max-w-site gap-10 px-6 sm:px-8 lg:mt-16 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-14 xl:gap-20">
        <aside className="hidden lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3"
          >
            <p className="mb-4 text-sm font-semibold">On this page</p>
            <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              {TOC[slug].map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="transition-colors hover:text-foreground">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 max-w-3xl">
          <div className={PROSE}>{body}</div>
          {closing}
          <nav aria-labelledby="related-comparisons-heading" className="mt-14">
            <h2 id="related-comparisons-heading" className="font-heading text-xl font-medium">
              Related comparisons
            </h2>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/compare/${item.slug}`}
                    className="group flex items-center justify-between gap-4 py-4 text-sm hover:text-prism-cyan-700"
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
      </div>
    </article>
  );
}
