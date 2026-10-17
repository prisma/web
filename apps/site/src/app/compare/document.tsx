import type { ReactNode } from "react";
import { Texture } from "@/components/brand/texture";
import { cn } from "@/lib/utils";
import { COMPARISONS, type ComparisonSlug } from "./comparisons";
import {
  ArticlePager,
  CompareHeader,
  CompareNav,
  CompareToc,
  type CompareSlug,
} from "./document-chrome";

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
    { id: "next", label: "Start with the Free plan" },
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
    { id: "next", label: "Start with the Free plan" },
  ],
};

const ORDER = ["index", ...COMPARISONS.map((entry) => entry.slug)] as const;

function neighbor(slug: CompareSlug, direction: -1 | 1) {
  const index = ORDER.indexOf(slug);
  const next = ORDER[index + direction];
  if (!next) return undefined;
  if (next === "index") return { href: "/compare", label: "All comparisons" };
  const entry = COMPARISONS.find((item) => item.slug === next);
  return entry ? { href: `/compare/${entry.slug}`, label: entry.competitor } : undefined;
}

/**
 * Document page for /compare, matching the docs template: textured ground,
 * section header, sidebar, reading card, and a table of contents on articles.
 */
export function CompareDocument({ slug, children }: { slug: CompareSlug; children: ReactNode }) {
  const toc = slug === "index" ? undefined : TOC[slug];

  return (
    <div className="relative bg-muted selection:bg-prism-cyan-100">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Texture opacity={0.06} blend="multiply" />
      </div>
      <CompareHeader current={slug} />
      <div className="relative mx-auto max-w-[90rem] px-3 pb-16 pt-4 sm:px-5 sm:pt-8 lg:px-6">
        <div
          className={cn(
            "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8",
            toc && "xl:grid-cols-[15rem_minmax(0,1fr)_13rem]",
          )}
        >
          <aside className="hidden lg:block">
            <nav
              aria-label="Comparisons"
              className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-10 pr-2 text-sm [scrollbar-width:thin]"
            >
              <CompareNav current={slug} />
            </nav>
          </aside>
          <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-4 py-8 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_30px_60px_-40px_rgba(21,21,21,0.28)] sm:px-10 sm:py-12 lg:px-14 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:text-foreground">
            <article>
              {children}
              <ArticlePager previous={neighbor(slug, -1)} next={neighbor(slug, 1)} />
            </article>
          </div>
          {toc ? <CompareToc items={toc} /> : null}
        </div>
      </div>
    </div>
  );
}
