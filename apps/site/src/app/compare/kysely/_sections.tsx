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
      <header className="border-b border-black/[0.06] pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]">
            {KYSELY_TITLE}
          </h1>
          <ArticleActions
            markdownPath="/compare/kysely"
            sourcePath="apps/site/src/app/compare/kysely/_content.ts"
          />
        </div>
        <p className="mt-6 max-w-[68ch] text-[1.0625rem] leading-relaxed text-foreground/80">
          Pick{" "}
          <Link href="/docs/orm" className={INLINE}>
            Prisma ORM
          </Link>{" "}
          when a contract file should drive typed queries and migrations. Prisma ORM 8 is a release
          candidate, and it is what <code className="text-foreground">npm install prisma</code>{" "}
          gives you. Pick{" "}
          <a href="https://kysely.dev" className={INLINE}>
            Kysely
          </a>{" "}
          when you want a type-safe SQL query builder and table types you keep in TypeScript. Prisma
          makes Prisma ORM. Kysely is an independent open-source project. The other ORM comparison
          is{" "}
          <Link href="/compare/mongoose" className={INLINE}>
            Prisma ORM vs Mongoose
          </Link>
          , and all{" "}
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
          <Link href="/docs/orm" className={INLINE}>
            Read the ORM docs
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
                Choose Prisma ORM if
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
              <h2 id="choose-kysely" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Choose Kysely if
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {CHOOSE_KYSELY.map((item) => (
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
              Columns are alphabetical: Kysely, then Prisma ORM. One is a SQL query builder. The
              other is a contract-based ORM that also includes a SQL query builder on PostgreSQL and
              SQLite.
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
                        <th
                          scope="row"
                          className="px-5 py-4 align-top text-sm font-semibold sm:px-6"
                        >
                          {row.feature}
                        </th>
                        <td className="px-5 py-4 align-top text-sm leading-7 text-foreground/80 sm:px-6">
                          {row.kysely}
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

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 id="where-kysely" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Where Kysely works well
              </h2>
              <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                Kysely is a SQL query builder. Its{" "}
                <a href="https://kysely.dev/docs/getting-started" className={INLINE}>
                  getting started guide
                </a>{" "}
                shows <code className="text-foreground">selectFrom</code> and{" "}
                <code className="text-foreground">where</code>, and lists joins among the other SQL
                features. Each built-in dialect needs its driver.
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {KYSELY_FITS.map((item) => (
                  <li key={item} className="text-[0.9375rem] leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h2 id="where-prisma" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Where Prisma ORM fits better
              </h2>
              <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                Prisma ORM fits a team that wants the contract, the model queries, and the
                migrations to come from one file. The{" "}
                <Link href="/docs/orm" className={INLINE}>
                  ORM docs
                </Link>{" "}
                describe that file as the contract.
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
              What sets Prisma ORM apart
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
                <h3 className="text-lg leading-snug">Kysely</h3>
                <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
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
              <div className="flex flex-col gap-4">
                <h3 className="text-lg leading-snug">Prisma ORM and Prisma Postgres</h3>
                <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                  Prisma ORM is free under the{" "}
                  <a href="https://github.com/prisma/prisma/blob/main/LICENSE" className={INLINE}>
                    Apache License 2.0
                  </a>
                  . Prisma Postgres is optional, and Prisma ORM is optional with it. The Free plan
                  is $0, with 200,000 operations a month, 2 GB of storage, and 50 databases (
                  <Link href="/pricing" className={INLINE}>
                    pricing page
                  </Link>
                  , {CHECKED}). Prisma Compute is separate app hosting.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="wrong-choice" className="scroll-mt-28 text-balance text-2xl leading-tight">
              When Prisma ORM is the wrong choice
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
                Move from Kysely to Prisma ORM
              </h2>
              <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
                <li>
                  For PostgreSQL, run{" "}
                  <code className="text-foreground">npx prisma@latest orm init</code> in the app.
                  The{" "}
                  <Link
                    href="/docs/prisma-orm/add-to-existing-project/postgresql"
                    className={INLINE}
                  >
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
            <div className="flex flex-col gap-4">
              <h2 id="migrate-back" className="scroll-mt-28 text-balance text-2xl leading-tight">
                Move from Prisma ORM to Kysely
              </h2>
              <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
                <li>Keep the database and the connection string.</li>
                <li>
                  Add a TypeScript <code className="text-foreground">Database</code> interface that
                  matches the tables. A community generator can emit those types from a Prisma
                  schema. Prisma documents it on the{" "}
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

        <section className="flex flex-col gap-5" aria-labelledby="proof">
          <div className="mx-auto flex max-w-site flex-col gap-5">
            <h2 id="proof" className="scroll-mt-28 text-balance text-2xl leading-tight">
              What teams on Prisma say
            </h2>
            <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
              These two quotes are on prisma.io today, from teams using Prisma ORM for type safety.
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
            Ready to build with Prisma?
          </h2>
          <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
            Free to start, no credit card required.
          </p>
          <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-7 text-foreground/80">
            <li>Prisma ORM is free under the Apache License 2.0</li>
            <li>Prisma Postgres Free includes 200,000 operations a month</li>
            <li>Prisma ORM is optional with Prisma Postgres</li>
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
export function KyselyPage() {
  return getKyselyPageContent();
}
