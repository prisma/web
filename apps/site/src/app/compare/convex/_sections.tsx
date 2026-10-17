import Link from "next/link";
import { Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import { ArticleActions } from "../document-chrome";
import { renderFaqAnswer } from "@/lib/faq-answer";
import {
  APART,
  CHECKED,
  CHOOSE_CONVEX,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  CONVEX_FITS,
  CONVEX_TITLE,
  FAQ,
  PRISMA_FITS,
  WRONG_CHOICE,
} from "./_content";

const INLINE =
  "font-medium text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-black/60";

const PROOF = TESTIMONIALS.filter(
  (item) => item.name === "Martin Adams" || item.name === "Ron Cohen",
);

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getConvexPageContent() {
  return (
    <>
      <header className="border-b border-black/[0.06] pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]">
            {CONVEX_TITLE}
          </h1>
          <ArticleActions
            markdownPath="/compare/convex"
            sourcePath="apps/site/src/app/compare/convex/_content.ts"
          />
        </div>
        <p className="mt-6 max-w-[68ch] text-[1.0625rem] leading-relaxed text-foreground/80">
          Pick{" "}
          <Link href="/docs/postgres" className={INLINE}>
            Prisma Postgres
          </Link>{" "}
          when you want a standard SQL database. It is PostgreSQL,{" "}
          <Link href="/docs/orm" className={INLINE}>
            Prisma ORM
          </Link>{" "}
          is optional, and{" "}
          <Link href="/docs/compute" className={INLINE}>
            Prisma Compute
          </Link>{" "}
          hosts the app. Pick{" "}
          <a href="https://docs.convex.dev/understanding/" className={INLINE}>
            Convex
          </a>{" "}
          when you want a reactive database and TypeScript query functions, with the frontend on a
          host such as Vercel or Netlify. Prisma makes Prisma Postgres, Prisma ORM, and Prisma
          Compute. All{" "}
          <Link href="/compare" className={INLINE}>
            Prisma comparisons
          </Link>{" "}
          are listed in one place.
        </p>
        <aside className="mt-6 flex gap-3 rounded-xl border border-prism-cyan-200/70 bg-gradient-to-br from-prism-cyan-50 via-prism-cyan-50/40 to-card px-4 py-3.5 text-[0.9375rem] leading-7 text-foreground/80">
          <Info className="mt-1.5 size-4 shrink-0 text-prism-cyan-600" aria-hidden />
          <p>
            <strong className="font-semibold text-foreground">Note:</strong> Every competitor figure
            on this page has a source, listed under the table and checked {CHECKED}.
          </p>
        </aside>
        <p className="mt-6 flex max-w-[68ch] flex-wrap gap-x-4 gap-y-1 text-[0.9375rem] leading-7 text-foreground/80">
          <Link href="/docs/postgres" className={INLINE}>
            Read the Postgres docs
          </Link>{" "}
          <a href="#choose" className={INLINE}>
            See which fits
          </a>
        </p>
      </header>
      <div className="flex flex-col gap-12 pt-10">
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 id="choose" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Choose Prisma Postgres if
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {CHOOSE_PRISMA.map((item) => (
                  <li key={item} className="text-[0.9375rem] leading-7 text-foreground/80">
                    {renderFaqAnswer(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h2 id="choose-convex" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Choose Convex if
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {CHOOSE_CONVEX.map((item) => (
                  <li key={item} className="text-[0.9375rem] leading-7 text-foreground/80">
                    {renderFaqAnswer(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5" aria-labelledby="feature-table">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="feature-table" className="scroll-mt-28 text-balance text-2xl leading-tight">
              What each one supports
            </h2>
            <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
              Columns are alphabetical: Convex, then Prisma Postgres. Convex is a reactive database
              whose cloud offering stores data in MySQL. Prisma Postgres is managed PostgreSQL, with
              an optional ORM and separate app hosting.
            </p>
            <div className="overflow-x-auto rounded-xl border border-black/[0.06]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left" style={{ minWidth: "42rem" }}>
                  <thead>
                    <tr className="border-b border-black/[0.08]">
                      <th scope="col" className="w-[22%] px-5 py-4 text-sm font-semibold sm:px-6">
                        Feature
                      </th>
                      <th scope="col" className="w-[39%] px-5 py-4 text-sm font-semibold sm:px-6">
                        Convex
                      </th>
                      <th scope="col" className="w-[39%] px-5 py-4 text-sm font-semibold sm:px-6">
                        Prisma Postgres
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map((row) => (
                      <tr key={row.feature} className="border-t border-black/[0.06]">
                        <th
                          scope="row"
                          className="px-5 py-4 align-top text-sm font-semibold sm:px-6"
                        >
                          {row.feature}
                        </th>
                        <td className="px-5 py-4 align-top text-sm leading-7 text-foreground/80 sm:px-6">
                          {row.convex}
                        </td>
                        <td className="px-5 py-4 align-top text-sm leading-7 text-foreground sm:px-6">
                          {renderFaqAnswer(row.prisma)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="max-w-[68ch] text-sm leading-7 text-foreground/80">
              Convex cells: the{" "}
              <a href="https://docs.convex.dev/understanding/" className={INLINE}>
                Convex overview
              </a>
              ,{" "}
              <a href="https://docs.convex.dev/production/hosting" className={INLINE}>
                frontend hosting
              </a>
              , and{" "}
              <a href="https://www.convex.dev/pricing" className={INLINE}>
                pricing
              </a>
              , {CHECKED}. Prisma cells:{" "}
              <Link href="/docs/postgres" className={INLINE}>
                Prisma Postgres
              </Link>
              ,{" "}
              <Link href="/docs/orm" className={INLINE}>
                Prisma ORM
              </Link>
              ,{" "}
              <Link href="/docs/compute" className={INLINE}>
                Prisma Compute
              </Link>
              ,{" "}
              <Link href="/docs/compute/limitations" className={INLINE}>
                Compute limitations
              </Link>
              ,{" "}
              <Link href="/docs/composer/building-blocks" className={INLINE}>
                Composer building blocks
              </Link>
              , and the{" "}
              <Link href="/pricing" className={INLINE}>
                pricing page
              </Link>
              , {CHECKED}.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 id="where-convex" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Where Convex works well
              </h2>
              <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                Convex is a reactive database. Its{" "}
                <a href="https://docs.convex.dev/understanding/" className={INLINE}>
                  overview
                </a>{" "}
                describes TypeScript queries that rerun when their data changes, and a client
                library that subscribes over a WebSocket.
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {CONVEX_FITS.map((item) => (
                  <li key={item} className="text-[0.9375rem] leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h2 id="where-prisma" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Where Prisma Postgres fits better
              </h2>
              <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                Prisma Postgres fits a team that wants PostgreSQL.{" "}
                <Link href="/docs/orm" className={INLINE}>
                  Prisma ORM
                </Link>{" "}
                is optional.{" "}
                <Link href="/docs/compute" className={INLINE}>
                  Prisma Compute
                </Link>{" "}
                is separate app hosting.
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {PRISMA_FITS.map((item) => (
                  <li key={item} className="text-[0.9375rem] leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="apart" className="scroll-mt-28 text-balance text-2xl leading-tight">
              What sets Prisma Postgres apart
            </h2>
            <div className="flex flex-col gap-8">
              {APART.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 border-t border-black/[0.08] pt-5"
                >
                  <h3 className="text-lg leading-snug">{item.title}</h3>
                  <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5" aria-labelledby="pricing">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="pricing" className="scroll-mt-28 text-balance text-2xl leading-tight">
              Pricing
            </h2>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg leading-snug">Convex</h3>
                <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                  Free and Starter are $0, then pay as you go, and list 1 to 6 developers. The
                  resource table includes 0.5 GB of database storage. Professional is $25 per
                  developer per month. Business and Enterprise have a $2,500 monthly minimum (
                  <a href="https://www.convex.dev/pricing" className={INLINE}>
                    Convex pricing
                  </a>
                  , {CHECKED}).
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg leading-snug">Prisma Postgres and Prisma Compute</h3>
                <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                  Prisma Postgres Free is $0, with 200,000 operations a month, 2 GB of storage, and
                  50 databases. Starter is $10 a month. Prisma Compute is separate app hosting. The
                  page does not list a per-developer fee (
                  <Link href="/pricing" className={INLINE}>
                    pricing page
                  </Link>
                  , {CHECKED}). Prisma ORM is optional with Prisma Postgres, and it is free under
                  the Apache License 2.0.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="wrong-choice" className="scroll-mt-28 text-balance text-2xl leading-tight">
              When Prisma Postgres is the wrong choice
            </h2>
            <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5">
              {WRONG_CHOICE.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-7 text-foreground/80">
                  {renderFaqAnswer(item)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-5" aria-labelledby="migrate">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 id="migrate" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Move from Convex to Prisma Postgres
              </h2>
              <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
                <li>
                  Create the PostgreSQL database. Prisma ORM is optional. When the tables already
                  exist, the{" "}
                  <Link
                    href="/docs/prisma-orm/add-to-existing-project/postgresql"
                    className={INLINE}
                  >
                    existing-database guide
                  </Link>{" "}
                  shows <code className="text-foreground">contract infer</code>.
                </li>
                <li>
                  Export the data. Every Convex plan can download a snapshot export, a ZIP with one{" "}
                  <code className="text-foreground">documents.jsonl</code> file per table, from the
                  dashboard or with <code className="text-foreground">npx convex export</code>, as
                  the{" "}
                  <a href="https://docs.convex.dev/database/backup-restore" className={INLINE}>
                    backup and export guide
                  </a>{" "}
                  describes. Professional adds streaming data exports. Load the JSONL into
                  PostgreSQL yourself. This page does not include a converter.
                </li>
                <li>
                  Point the app at the Postgres connection string. Host the HTTP app on Prisma
                  Compute, or keep the frontend host you already use.
                </li>
              </ol>
            </div>
            <div className="flex flex-col gap-4">
              <h2 id="migrate-back" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Move from Prisma Postgres to Convex
              </h2>
              <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
                <li>
                  Define Convex tables and write query and mutation functions. The{" "}
                  <a href="https://docs.convex.dev/understanding/" className={INLINE}>
                    overview
                  </a>{" "}
                  shows <code className="text-foreground">ctx.db.query</code> and{" "}
                  <code className="text-foreground">ctx.db.patch</code>.
                </li>
                <li>
                  Subscribe from the client with <code className="text-foreground">useQuery</code>.
                  The client library uses a WebSocket.
                </li>
                <li>
                  Publish the frontend with a provider such as Vercel or Netlify, as the{" "}
                  <a href="https://docs.convex.dev/production/hosting" className={INLINE}>
                    hosting guide
                  </a>{" "}
                  describes. Prisma Postgres stays in place until you stop using it.
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5" aria-labelledby="proof">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="proof" className="scroll-mt-28 text-balance text-2xl leading-tight">
              What teams on Prisma say
            </h2>
            <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
              These two quotes are on prisma.io today. One is about Prisma Postgres, and one is
              about type safety in Prisma ORM.
            </p>
            <div className="flex flex-col gap-8">
              {PROOF.map((item) => (
                <figure key={item.name} className="border-t border-black/[0.08] pt-5">
                  <blockquote className="text-pretty text-lg leading-relaxed">
                    &quot;{item.quote}&quot;
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">
                    {item.name}, {item.role}, {item.company}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="faq" className="scroll-mt-28 text-balance text-2xl leading-tight">
              Frequently asked questions
            </h2>
            <div className="mt-8 max-w-3xl">
              <Accordion type="single" collapsible defaultValue="item-0">
                {FAQ.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-base hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                      {renderFaqAnswer(faq.answer)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 id="next" className="scroll-mt-28 text-balance text-2xl leading-tight">
            Start with the Free plan
          </h2>
          <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
            Free to start, no credit card required.
          </p>
          <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-7 text-foreground/80">
            <li>Prisma Postgres Free includes 200,000 operations a month</li>
            <li>Prisma ORM is optional with Prisma Postgres</li>
            <li>The pricing page does not list a per-developer fee</li>
          </ul>
          <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
            <a href="https://console.prisma.io" className={INLINE}>
              Get started free
            </a>
            <Link href="/contact" className={INLINE}>
              Talk to us
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}

/** Render the comparison using its shared content tree. */
export function ConvexPage() {
  return getConvexPageContent();
}
