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
  CHOOSE_KYSELY,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  FAQ,
  KYSELY_FITS,
  KYSELY_TITLE,
  PRISMA_FITS,
  WRONG_CHOICE,
} from "./_content";

const INLINE =
  "font-medium text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-black/60";

const PROOF = TESTIMONIALS.filter(
  (item) => item.name === "Ron Cohen" || item.name === "Omar López",
);

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getKyselyPageContent() {
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
                {KYSELY_TITLE}
              </h1>
              <p className="mt-5 max-w-[68ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Pick{" "}
                <Link href="/docs/orm" className={INLINE}>
                  Prisma ORM
                </Link>{" "}
                when a contract file should drive typed queries and migrations. Prisma ORM 8 is a
                release candidate, and it is what{" "}
                <code className="text-foreground">npm install prisma</code> gives you. Pick{" "}
                <a href="https://kysely.dev" className={INLINE}>
                  Kysely
                </a>{" "}
                when you want a type-safe SQL query builder and table types you keep in TypeScript.
                Prisma makes Prisma ORM. Kysely is an independent open-source project. The other ORM
                comparison is{" "}
                <Link href="/compare/mongoose" className={INLINE}>
                  Prisma ORM vs Mongoose
                </Link>
                , and all{" "}
                <Link href="/compare" className={INLINE}>
                  Prisma comparisons
                </Link>{" "}
                are listed in one place.
              </p>
              <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
                Every competitor figure on this page has a source, listed under the table and
                checked {CHECKED}.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrismButton href="/docs/orm" size="lg">
                  Read the ORM docs
                </PrismButton>
                <PrismButtonOutline href="#choose" size="lg">
                  See which fits
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
              Choose Prisma ORM if
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {CHOOSE_PRISMA.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed"
                >
                  <CheckBold className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  <span>{renderFaqAnswer(item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Choose Kysely if
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {CHOOSE_KYSELY.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed"
                >
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
            Columns are alphabetical: Kysely, then Prisma ORM. One is a SQL query builder. The other
            is a contract-based ORM that also includes a SQL query builder on PostgreSQL and SQLite.
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
                      Kysely
                    </th>
                    <th scope="col" className="w-[39%] px-5 py-4 text-sm font-semibold sm:px-6">
                      Prisma ORM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.feature} className="border-t border-black/[0.06]">
                      <th scope="row" className="px-5 py-4 align-top text-sm font-semibold sm:px-6">
                        {row.feature}
                      </th>
                      <td className="px-5 py-4 align-top text-sm leading-relaxed text-muted-foreground sm:px-6">
                        {row.kysely}
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
            Kysely cells:{" "}
            <a href="https://kysely.dev/docs/getting-started" className={INLINE}>
              Getting started
            </a>
            ,{" "}
            <a href="https://www.npmjs.com/package/kysely" className={INLINE}>
              npm
            </a>
            ,{" "}
            <a href="https://kysely.dev/docs/migrations" className={INLINE}>
              Migrations
            </a>
            , and the{" "}
            <a href="https://github.com/kysely-org/kysely/blob/master/LICENSE" className={INLINE}>
              MIT license
            </a>
            , {CHECKED}. Prisma ORM cells:{" "}
            <Link href="/docs/orm" className={INLINE}>
              Prisma ORM
            </Link>
            ,{" "}
            <Link href="/docs/orm/supported-databases" className={INLINE}>
              supported databases
            </Link>
            ,{" "}
            <Link href="/docs/orm/migrations/how-migrations-work" className={INLINE}>
              migrations
            </Link>
            ,{" "}
            <Link href="/docs/orm/reference/sql-query-builder" className={INLINE}>
              the SQL query builder
            </Link>
            , and the{" "}
            <a href="https://github.com/prisma/prisma/blob/main/LICENSE" className={INLINE}>
              Apache License 2.0
            </a>
            , {CHECKED}. Hosting is on the{" "}
            <Link href="/pricing" className={INLINE}>
              pricing page
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto grid max-w-site gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Where Kysely works well
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Kysely is a SQL query builder. Its{" "}
              <a href="https://kysely.dev/docs/getting-started" className={INLINE}>
                getting started guide
              </a>{" "}
              shows <code className="text-foreground">selectFrom</code> and{" "}
              <code className="text-foreground">where</code>, and lists joins among the other SQL
              features. Each built-in dialect needs its driver.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {KYSELY_FITS.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Where Prisma ORM fits better
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Prisma ORM fits a team that wants the contract, the model queries, and the migrations
              to come from one file. The{" "}
              <Link href="/docs/orm" className={INLINE}>
                ORM docs
              </Link>{" "}
              describe that file as the contract.
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
            What sets Prisma ORM apart
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
              <h3 className="text-lg">Kysely</h3>
              <p className="mt-3 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground">
                The library is free under the{" "}
                <a
                  href="https://github.com/kysely-org/kysely/blob/master/LICENSE"
                  className={INLINE}
                >
                  MIT license
                </a>
                . There is no Kysely hosting plan. You bring the database. Checked {CHECKED}.
              </p>
            </div>
            <div>
              <h3 className="text-lg">Prisma ORM and Prisma Postgres</h3>
              <p className="mt-3 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground">
                Prisma ORM is free under the{" "}
                <a href="https://github.com/prisma/prisma/blob/main/LICENSE" className={INLINE}>
                  Apache License 2.0
                </a>
                . Prisma Postgres is optional, and Prisma ORM is optional with it. The Free plan is
                $0, with 200,000 operations a month, 2 GB of storage, and 50 databases (
                <Link href="/pricing" className={INLINE}>
                  pricing page
                </Link>
                , {CHECKED}). Prisma Compute is separate app hosting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-site">
          <h2 className="max-w-[22ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            When Prisma ORM is the wrong choice
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
              Move from Kysely to Prisma ORM
            </h2>
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
              <li>
                For PostgreSQL, run{" "}
                <code className="text-foreground">npx prisma@latest orm init</code> in the app. The{" "}
                <Link href="/docs/prisma-orm/add-to-existing-project/postgresql" className={INLINE}>
                  existing-database guide
                </Link>{" "}
                lists the Node.js versions it expects.
              </li>
              <li>
                Run <code className="text-foreground">npx prisma contract infer</code> to write{" "}
                <code className="text-foreground">contract.prisma</code> from the tables, then{" "}
                <code className="text-foreground">npx prisma contract emit</code> and{" "}
                <code className="text-foreground">npx prisma db sign</code>. Signing records that
                the database already matches the contract, so the first{" "}
                <code className="text-foreground">migration plan</code> starts from your tables
                instead of an empty database. The rows stay where they are.
              </li>
              <li>
                Later changes go through{" "}
                <Link href="/docs/orm/migrations/generating-a-migration" className={INLINE}>
                  contract emit and migration plan
                </Link>
                . On PostgreSQL, migration show prints the SQL.
              </li>
            </ol>
          </div>
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.15]">
              Move from Prisma ORM to Kysely
            </h2>
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
              <li>Keep the database and the connection string.</li>
              <li>
                Add a TypeScript <code className="text-foreground">Database</code> interface that
                matches the tables. A community generator can emit those types from a Prisma schema.
                Prisma documents it on the{" "}
                <Link href="/docs/orm/v7/prisma-schema/overview/generators" className={INLINE}>
                  Prisma ORM 7 generators
                </Link>{" "}
                page. It is not part of Prisma ORM.
              </li>
              <li>
                Create one Kysely instance with the dialect that matches the database, plus that
                dialect&apos;s driver. On PostgreSQL that is{" "}
                <code className="text-foreground">PostgresDialect</code> and{" "}
                <code className="text-foreground">pg</code>. On Prisma Postgres, follow the{" "}
                <Link href="/docs/prisma-postgres/quickstart/kysely" className={INLINE}>
                  Kysely quickstart
                </Link>
                . Prisma ORM is optional there.
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
            These two quotes are on prisma.io today, from teams using Prisma ORM for type safety.
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
        headline="Ready to build with Prisma?"
        headlineMaxWidth="max-w-[22ch]"
        body="Free to start, no credit card required."
        bodyMaxWidth="max-w-[44ch]"
        checks={[
          {
            label: "Prisma ORM is free under the Apache License 2.0",
            color: "text-prism-cyan-500",
          },
          {
            label: "Prisma Postgres Free includes 200,000 operations a month",
            color: "text-prism-yellow-400",
          },
          {
            label: "Prisma ORM is optional with Prisma Postgres",
            color: "text-prism-red-500",
          },
        ]}
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io" }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}

/** Render the comparison using its shared content tree. */
export function KyselyPage() {
  return getKyselyPageContent();
}
