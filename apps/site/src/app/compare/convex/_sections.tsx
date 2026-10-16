import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckBold } from "@/components/icons/forma";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CtaBurst } from "@/components/sections/cta-burst";
import { TESTIMONIALS } from "@/components/sections/testimonials-data";
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

export function ConvexPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background: [
                  "radial-gradient(42% 60% at 28% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 14%, transparent), transparent 70%)",
                  "radial-gradient(42% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 12%, transparent), transparent 70%)",
                  "radial-gradient(42% 60% at 72% 100%, color-mix(in srgb, var(--color-prism-red-400) 14%, transparent), transparent 70%)",
                ].join(","),
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto max-w-site pb-12 pt-24 md:pb-16 md:pt-28">
              <RoleKicker color="bg-prism-cyan-400">Compare</RoleKicker>
              <h1 className="isolate mt-3 max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]">
                {CONVEX_TITLE}
              </h1>
              <p className="mt-5 max-w-[68ch] text-pretty text-lg leading-relaxed text-muted-foreground">
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
                when you want a reactive database and TypeScript query functions, with the frontend
                on a host such as Vercel or Netlify. Prisma makes Prisma Postgres, Prisma ORM, and
                Prisma Compute. This page sits in the{" "}
                <Link href="/compare" className={INLINE}>
                  Prisma comparisons
                </Link>{" "}
                directory.
              </p>
              <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
                The table below links each figure to a source, checked {CHECKED}.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrismButton href="/docs/postgres" size="lg">
                  Read the Postgres docs
                </PrismButton>
                <PrismButtonOutline href="#choose" size="lg">
                  Choose a side
                </PrismButtonOutline>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="choose" className="scroll-mt-28 bg-white px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-site gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Choose Prisma Postgres if
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {CHOOSE_PRISMA.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed">
                  <CheckBold className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  <span>{renderFaqAnswer(item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Choose Convex if
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {CHOOSE_CONVEX.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed">
                  <CheckBold className="mt-0.5 size-4 shrink-0 text-prism-yellow-400" aria-hidden />
                  <span>{renderFaqAnswer(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24" aria-labelledby="feature-table">
        <div className="mx-auto max-w-site">
          <h2
            id="feature-table"
            className="max-w-[28ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            What each one supports
          </h2>
          <p className="mt-4 max-w-[68ch] text-pretty leading-relaxed text-muted-foreground">
            Columns are alphabetical: Convex, then Prisma Postgres. Convex is a reactive database
            whose cloud offering stores data in MySQL. Prisma Postgres is managed PostgreSQL, with
            an optional ORM and separate app hosting.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
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
                      <td className="px-5 py-4 align-top text-sm leading-relaxed text-muted-foreground sm:px-6">
                        {row.convex}
                      </td>
                      <td className="px-5 py-4 align-top text-sm leading-relaxed text-foreground sm:px-6">
                        {renderFaqAnswer(row.prisma)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 max-w-[75ch] text-sm leading-relaxed text-muted-foreground">
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

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto grid max-w-site gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Where Convex works well
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Convex is a reactive database. Its{" "}
              <a href="https://docs.convex.dev/understanding/" className={INLINE}>
                overview
              </a>{" "}
              describes TypeScript queries that rerun when their data changes, and a client library
              that subscribes over a WebSocket.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {CONVEX_FITS.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Where Prisma Postgres fits better
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
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
            <ul className="mt-6 flex flex-col gap-3">
              {PRISMA_FITS.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-site">
          <h2 className="max-w-[24ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            What sets Prisma Postgres apart
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {APART.map((item) => (
              <div key={item.title} className="border-t border-black/[0.08] pt-5">
                <h3 className="text-lg leading-snug">{item.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24" aria-labelledby="pricing">
        <div className="mx-auto max-w-site">
          <h2
            id="pricing"
            className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            Pricing
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-lg">Convex</h3>
              <p className="mt-3 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground">
                Free and Starter are $0, then pay as you go, and list 1 to 6 developers. The
                resource table includes 0.5 GB of database storage. Professional is $25 per
                developer per month. Business and Enterprise have a $2,500 monthly minimum (
                <a href="https://www.convex.dev/pricing" className={INLINE}>
                  Convex pricing
                </a>
                , {CHECKED}).
              </p>
            </div>
            <div>
              <h3 className="text-lg">Prisma Postgres and Prisma Compute</h3>
              <p className="mt-3 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground">
                Prisma Postgres Free is $0, with 200,000 operations a month, 2 GB of storage, and
                50 databases. Starter is $10 a month. Prisma Compute is separate app hosting. The
                page does not list a per-developer fee (
                <Link href="/pricing" className={INLINE}>
                  pricing page
                </Link>
                , {CHECKED}). Prisma ORM is optional with Prisma Postgres, and it is free under the
                Apache License 2.0.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-site">
          <h2 className="max-w-[22ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            When Prisma Postgres is the wrong choice
          </h2>
          <ul className="mt-8 flex max-w-[68ch] flex-col gap-4">
            {WRONG_CHOICE.map((item) => (
              <li key={item} className="text-pretty leading-relaxed text-muted-foreground">
                {renderFaqAnswer(item)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24" aria-labelledby="migrate">
        <div className="mx-auto grid max-w-site gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <h2
              id="migrate"
              className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]"
            >
              Move from Convex to Prisma Postgres
            </h2>
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
              <li>
                Create the PostgreSQL database. Prisma ORM is optional. When the tables already
                exist, the{" "}
                <Link href="/docs/prisma-orm/add-to-existing-project/postgresql" className={INLINE}>
                  existing-database guide
                </Link>{" "}
                shows <code className="text-foreground">contract infer</code>.
              </li>
              <li>
                Load the rows into PostgreSQL. Convex Professional includes streaming data exports.
                The Free and Starter column on the pricing page marks that export as unavailable.
                This page does not include a converter.
              </li>
              <li>
                Point the app at the Postgres connection string. Host the HTTP app on Prisma
                Compute, or keep the frontend host you already use.
              </li>
            </ol>
          </div>
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
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

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24" aria-labelledby="proof">
        <div className="mx-auto max-w-site">
          <h2
            id="proof"
            className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            What teams on Prisma say
          </h2>
          <p className="mt-4 max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            These two quotes are on prisma.io today. One is about Prisma Postgres, and one is about
            type safety in Prisma ORM.
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
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

      <section id="faq" className="bg-white px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-site">
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
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

      <CtaBurst
        headline="Start with the Free plan"
        headlineMaxWidth="max-w-[22ch]"
        body="Free to start, no credit card required."
        bodyMaxWidth="max-w-[44ch]"
        checks={[
          {
            label: "Prisma Postgres Free includes 200,000 operations a month",
            color: "text-prism-cyan-500",
          },
          {
            label: "Prisma ORM is optional with Prisma Postgres",
            color: "text-prism-yellow-400",
          },
          {
            label: "The pricing page does not list a per-developer fee",
            color: "text-prism-red-500",
          },
        ]}
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io" }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
