import { COMPARISON_CTA } from "./_content";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createCollectionPageStructuredData } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/page-metadata";
import { COMPARISONS, COMPARISON_CATEGORIES, COMPARISON_INDEX } from "./comparisons";
import Link from "next/link";
import { CompareDocument } from "./document";
import { ArticleActions } from "./document-chrome";

export const metadata = createPageMetadata(COMPARISON_INDEX);

const INLINE =
  "font-medium text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-foreground/50";

/** Render the comparison directory with its complete, unfiltered collection schema. */
export default function ComparePage() {
  return (
    <>
      <JsonLd
        id="comparison-directory"
        data={createCollectionPageStructuredData({
          ...COMPARISON_INDEX,
          name: COMPARISON_INDEX.title,
          items: COMPARISONS.map((entry) => ({
            name: entry.title,
            description: entry.description,
            url: `/compare/${entry.slug}`,
          })),
        })}
      />
      <CompareDocument slug="index">
        <header className="border-b border-black/[0.06] pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]">
              Prisma comparisons
            </h1>
            <ArticleActions
              markdownPath="/compare"
              sourcePath="apps/site/src/app/compare/page.tsx"
            />
          </div>
          <p className="mt-6 max-w-[68ch] text-[1.0625rem] leading-relaxed text-foreground/80">
            {COMPARISON_INDEX.description}
          </p>
        </header>
        <div className="flex flex-col gap-12 pt-10">
          <ol className="border-t border-black/[0.08]">
            {COMPARISONS.map((entry) => {
              const category = COMPARISON_CATEGORIES.find((item) => item.id === entry.category);
              return (
                <li key={entry.slug} className="border-b border-black/[0.08]">
                  <Link
                    href={`/compare/${entry.slug}`}
                    className="group block py-5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {category ? (
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {category.label}
                      </p>
                    ) : null}
                    <h2 className="mt-1 text-xl leading-snug group-hover:underline group-hover:underline-offset-4">
                      {entry.competitor}
                    </h2>
                    <p className="mt-2 max-w-[68ch] text-[0.9375rem] font-semibold leading-7 text-foreground">
                      {entry.title}
                    </p>
                    <p className="mt-1 max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                      {entry.description}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ol>
          <section className="flex flex-col gap-5">
            <h2 className="scroll-mt-28 text-balance text-2xl leading-tight">
              Ready to build with Prisma?
            </h2>
            <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
              {COMPARISON_CTA.body}
            </p>
            <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-7 text-foreground/80">
              {COMPARISON_CTA.checks.map((item) => (
                <li key={item.label}>{item.label}</li>
              ))}
            </ul>
            <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
              <a href={COMPARISON_CTA.primaryCta.href} className={INLINE}>
                {COMPARISON_CTA.primaryCta.label}
              </a>
              <Link href={COMPARISON_CTA.secondaryCta.href} className={INLINE}>
                {COMPARISON_CTA.secondaryCta.label}
              </Link>
            </p>
          </section>
        </div>
      </CompareDocument>
    </>
  );
}
