import { Children, isValidElement, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { COMPARISON_CTA } from "./_content";
import { ArticleToc, ArticleTocDisclosure, type TocItem } from "./article-toc";
import { COMPARISONS, type ComparisonSlug } from "./comparisons";

const PROSE =
  "answer-prose prose max-w-none text-foreground prose-headings:scroll-mt-28 prose-headings:font-heading prose-headings:font-medium prose-headings:text-balance prose-h2:mt-14 prose-h2:text-[1.375rem] prose-h2:leading-[1.3] prose-h2:tracking-[-0.01em] prose-h3:mt-8 prose-h3:text-lg [&_:is(p,ul,ol):not(:is(td,th,blockquote)_*)]:max-w-[36rem] prose-p:text-pretty prose-p:leading-[1.8] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-prism-cyan-700 prose-strong:font-semibold prose-li:leading-[1.8] prose-code:break-words prose-th:text-left";

/**
 * Short labels for the heading list, set apart from the headings themselves.
 * An item can stand for several consecutive sections; it stays marked while
 * any of them is being read.
 */
const TOC: Record<ComparisonSlug, readonly TocItem[]> = {
  kysely: [
    { id: "choose", label: "When to choose" },
    { id: "same-query", label: "Same query" },
    { id: "feature-table", label: "Features" },
    { id: "where-kysely", label: "Where each fits", also: ["where-prisma"] },
    { id: "apart", label: "Why Prisma ORM" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "Trade-offs" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
    { id: "sources", label: "Sources" },
  ],
  mongoose: [
    { id: "choose", label: "When to choose", also: ["choose-mongoose"] },
    { id: "feature-table", label: "Features" },
    { id: "where-mongoose", label: "Where each fits", also: ["where-prisma"] },
    { id: "apart", label: "Why Prisma ORM" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "Trade-offs" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
  ],
  convex: [
    { id: "choose", label: "When to choose", also: ["choose-convex"] },
    { id: "feature-table", label: "Features" },
    { id: "where-convex", label: "Where each fits", also: ["where-prisma"] },
    { id: "apart", label: "Why Prisma Postgres" },
    { id: "pricing", label: "Pricing" },
    { id: "wrong-choice", label: "Trade-offs" },
    { id: "migrate", label: "Switching", also: ["migrate-back"] },
    { id: "proof", label: "What teams say" },
    { id: "faq", label: "FAQ", also: ["next"] },
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
  if ((parts.length !== 3 && parts.length !== 4) || parts.some((part) => !isValidElement(part))) {
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
  const [intro, body, closing, footnote] = articleParts(children);
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

      <div className="mx-auto mt-10 max-w-site px-6 sm:px-8 lg:mt-14">
        <div className="sm:px-12 lg:px-16 xl:grid xl:grid-cols-[minmax(0,1fr)_11rem] xl:gap-16">
          <div className="min-w-0 max-w-[54rem]">
            <div className="mb-10 xl:hidden">
              <ArticleTocDisclosure items={TOC[slug]} />
            </div>
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
            {footnote}
          </div>
          <aside className="hidden xl:block">
            <ArticleToc items={TOC[slug]} />
          </aside>
        </div>
      </div>
    </article>
  );
}
