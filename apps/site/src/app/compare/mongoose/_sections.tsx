import Link from "next/link";
import { Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import { CompareArticle, comparisonClosingCta, comparisonHeroCtas } from "../article";
import { renderFaqAnswer } from "@/lib/faq-answer";
import {
  APART,
  CHECKED,
  CHOOSE_MONGOOSE,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  FAQ,
  MONGOOSE_FITS,
  MONGOOSE_TITLE,
  PRISMA_FITS,
  WRONG_CHOICE,
} from "./_content";

const INLINE =
  "font-medium text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-black/60";

const PROOF = TESTIMONIALS.filter(
  (item) => item.name === "Ron Cohen" || item.name === "Omar López",
);

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getMongoosePageContent() {
  return [
    <div key="intro">
      <h1 className="max-w-4xl text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
        {MONGOOSE_TITLE}
      </h1>
      <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground">
        Pick{" "}
        <Link href="/docs/orm" className={INLINE}>
          Prisma ORM
        </Link>{" "}
        when a contract file should drive typed queries and migrations, on PostgreSQL or on MongoDB.
        Pick{" "}
        <a href="https://mongoosejs.com/docs/" className={INLINE}>
          Mongoose
        </a>{" "}
        when the app runs on MongoDB and the schema, populate, and middleware should live in
        application code. Prisma makes Prisma ORM. Mongoose is an independent open-source project.
        The other ORM comparison is{" "}
        <Link href="/compare/kysely" className={INLINE}>
          Prisma ORM vs Kysely
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
      {comparisonHeroCtas("orm")}
    </div>,
    <div key="body">
      <section className="mt-14">
        <div>
          <div>
            <h2 id="choose" className="scroll-mt-28">
              Choose Prisma ORM if
            </h2>
            <ul className="list-disc pl-5">
              {CHOOSE_PRISMA.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-7 text-foreground/80">
                  {renderFaqAnswer(item)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 id="choose-mongoose" className="scroll-mt-28">
              Choose Mongoose if
            </h2>
            <ul className="list-disc pl-5">
              {CHOOSE_MONGOOSE.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-7 text-foreground/80">
                  {renderFaqAnswer(item)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="feature-table">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <h2 id="feature-table" className="scroll-mt-28">
            What each one supports
          </h2>
          <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
            Columns are alphabetical: Mongoose, then Prisma ORM. One is a MongoDB object modeling
            library. The other is a contract-based ORM with a PostgreSQL release candidate and an
            early-access MongoDB library.
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
                      Mongoose
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
                      <td className="px-5 py-4 align-top text-sm leading-7 text-foreground/80 sm:px-6">
                        {row.mongoose}
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
            Mongoose cells:{" "}
            <a href="https://mongoosejs.com/docs/" className={INLINE}>
              Getting started
            </a>{" "}
            (v9.11.2),{" "}
            <a href="https://mongoosejs.com/docs/populate.html" className={INLINE}>
              populate
            </a>
            ,{" "}
            <a href="https://mongoosejs.com/docs/middleware.html" className={INLINE}>
              middleware
            </a>
            , the{" "}
            <a
              href="https://github.com/Automattic/mongoose/blob/master/README.md"
              className={INLINE}
            >
              README
            </a>
            , and the{" "}
            <a
              href="https://github.com/Automattic/mongoose/blob/master/LICENSE.md"
              className={INLINE}
            >
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
            <Link href="/docs/orm/fundamentals/relations-and-joins" className={INLINE}>
              relations
            </Link>
            ,{" "}
            <Link href="/docs/orm/fundamentals/reading-data" className={INLINE}>
              reading data
            </Link>
            ,{" "}
            <Link href="/docs/guides/switch-to-prisma-orm/from-mongoose" className={INLINE}>
              migrate from Mongoose
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

      <section className="mt-14">
        <div>
          <div>
            <h2 id="where-mongoose" className="scroll-mt-28">
              Where Mongoose works well
            </h2>
            <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
              Mongoose is a MongoDB object modeling library. Its{" "}
              <a href="https://mongoosejs.com/docs/" className={INLINE}>
                getting started guide
              </a>{" "}
              builds a schema, compiles a model, and queries with{" "}
              <code className="text-foreground">find()</code>.{" "}
              <a href="https://mongoosejs.com/docs/populate.html" className={INLINE}>
                populate()
              </a>{" "}
              loads documents from another collection.
            </p>
            <ul className="list-disc pl-5">
              {MONGOOSE_FITS.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 id="where-prisma" className="scroll-mt-28">
              Where Prisma ORM fits better
            </h2>
            <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
              Prisma ORM fits a team that wants the contract, the model queries, and the migrations
              to come from one file. The{" "}
              <Link href="/docs/orm" className={INLINE}>
                ORM docs
              </Link>{" "}
              describe that file as the contract. MongoDB support is early access, and the limits
              are in the table above.
            </p>
            <ul className="list-disc pl-5">
              {PRISMA_FITS.map((item) => (
                <li key={item} className="text-[0.9375rem] leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <h2 id="apart" className="scroll-mt-28">
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

      <section className="mt-14" aria-labelledby="pricing">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <h2 id="pricing" className="scroll-mt-28">
            Pricing
          </h2>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-lg leading-snug">Mongoose</h3>
              <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
                The library is free under the{" "}
                <a
                  href="https://github.com/Automattic/mongoose/blob/master/LICENSE.md"
                  className={INLINE}
                >
                  MIT license
                </a>
                . There is no Mongoose hosting plan. You bring MongoDB. Checked {CHECKED}.
              </p>
            </div>
            <div>
              <h3 className="text-lg leading-snug">Prisma ORM and Prisma Postgres</h3>
              <p className="max-w-[68ch] text-[0.9375rem] leading-7 text-foreground/80">
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

      <section className="mt-14">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <h2 id="wrong-choice" className="scroll-mt-28">
            When Prisma ORM is the wrong choice
          </h2>
          <ul className="list-disc pl-5">
            {WRONG_CHOICE.map((item) => (
              <li key={item} className="text-[0.9375rem] leading-7 text-foreground/80">
                {renderFaqAnswer(item)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="migrate">
        <div>
          <div>
            <h2 id="migrate" className="scroll-mt-28">
              Move from Mongoose to Prisma ORM
            </h2>
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
              <li>
                Keep the MongoDB database. The{" "}
                <Link href="/docs/guides/switch-to-prisma-orm/from-mongoose" className={INLINE}>
                  migrate from Mongoose
                </Link>{" "}
                guide adds Prisma ORM beside the existing models. The documents stay put.
              </li>
              <li>
                Run{" "}
                <code className="text-foreground">npx prisma@latest orm init --target mongodb</code>
                . Write <code className="text-foreground">contract.prisma</code> yourself.{" "}
                <code className="text-foreground">contract infer</code> does not read MongoDB.
              </li>
              <li>
                Run <code className="text-foreground">npx prisma contract emit</code>. Replace a
                single-reference <code className="text-foreground">populate()</code> with{" "}
                <code className="text-foreground">include()</code>. For an array of stored ids, the
                guide uses <code className="text-foreground">lookup</code> in the pipeline builder.
              </li>
            </ol>
          </div>
          <div>
            <h2 id="migrate-back" className="scroll-mt-28">
              Move from Prisma ORM to Mongoose
            </h2>
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-pretty leading-relaxed text-muted-foreground">
              <li>Keep the MongoDB database and the connection string.</li>
              <li>
                Define a <code className="text-foreground">mongoose.Schema</code> and compile it
                with <code className="text-foreground">mongoose.model</code> for each collection you
                still query. The{" "}
                <a href="https://mongoosejs.com/docs/" className={INLINE}>
                  getting started guide
                </a>{" "}
                shows that sequence.
              </li>
              <li>
                Connect with <code className="text-foreground">mongoose.connect</code> and the same
                MongoDB URL. Mongoose does not connect to Prisma Postgres.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="proof">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <h2 id="proof" className="scroll-mt-28">
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

      <section className="mt-14">
        <div className="mx-auto flex max-w-site flex-col gap-5">
          <h2 id="faq" className="scroll-mt-28">
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
    </div>,
    comparisonClosingCta("orm"),
  ];
}

/** Render the comparison in the guide article frame. */
export function MongoosePage() {
  return <CompareArticle slug="mongoose">{getMongoosePageContent()}</CompareArticle>;
}
