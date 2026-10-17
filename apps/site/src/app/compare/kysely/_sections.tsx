import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import { COMPARISON_CTA } from "../_content";
import { CompareArticle } from "../article";
import { QuoteCarousel } from "./quote-carousel";
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

const QUIET_LINK =
  "underline underline-offset-4 decoration-black/15 transition-colors hover:text-foreground hover:decoration-black/50";

/**
 * One rhythm for the whole body: 56px between sections, 20px under every h2,
 * 32px between h3 groups and 8px under each h3. Prose margins are zeroed so
 * these gaps are the only spacing, and every paragraph and list item shares
 * one size, line height and colour. Code spans from prose and from
 * `renderFaqAnswer` share one treatment and never break inside a command.
 */
const BODY =
  "flex flex-col gap-14 [&_:is(h2,h3)]:my-0 [&_:is(h2,h3)]:text-primary [&_:is(p,ul,ol,li,table,figure,img)]:my-0 [&_:is(p,li)]:text-base [&_:is(p,li)]:leading-7 [&_:is(p,li)]:text-foreground [&_code]:whitespace-nowrap [&_code]:rounded [&_code]:border-0 [&_code]:bg-black/[0.045] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.875em] [&_code]:font-medium [&_code]:text-primary [&_code]:before:content-none [&_code]:after:content-none [&_blockquote]:my-0 [&_blockquote]:border-0 [&_blockquote]:pl-0 [&_blockquote]:font-normal [&_blockquote]:not-italic [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none";
const SECTION = "flex flex-col gap-5";
const GROUPS = "flex flex-col gap-8";
const GROUP = "flex flex-col gap-2";
const LIST = "list-disc space-y-2 pl-5 marker:text-black/25";
const STEPS = "list-decimal space-y-2 pl-5 marker:text-muted-foreground";

/** Table cell padding comes from `.answer-prose`; these set the frame, type and column widths. */
const TABLE_FRAME =
  "overflow-x-auto rounded-xl border border-black/[0.08] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
const TH_COL = "bg-neutral-50 text-sm font-semibold text-primary";
const TH_ROW = "bg-background text-sm font-semibold text-primary";
/**
 * A shadow at the right edge while more columns sit off-screen. The `local`
 * cover scrolls with the table and hides the shadow once the last column is in view.
 */
const SCROLL_HINT = {
  background:
    "linear-gradient(to right, transparent, var(--background) 70%) 100% 0 / 2.5rem 100% no-repeat local, radial-gradient(farthest-side at 100% 50%, rgb(0 0 0 / 0.12), transparent) 100% 0 / 0.875rem 100% no-repeat scroll, var(--background)",
};

/** Keeps each feature row's label in view while the table scrolls sideways on phones. */
const STICKY =
  "sticky left-0 z-10 before:absolute before:inset-y-0 before:-left-1 before:w-1 before:bg-inherit after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-black/[0.06]";
const TD = "text-sm leading-6 text-foreground";

const PROOF = TESTIMONIALS.filter(
  (item) => item.name === "Ron Cohen" || item.name === "Omar López",
);

const LOGOS: Record<string, { src: string; width: number }> = {
  Bucket: { src: "/logos/customers/bucket.png", width: 108 },
  "Cal.com": { src: "/logos/companies/cal.svg", width: 96 },
};

const SOURCES = [
  {
    product: "Kysely",
    links: [
      { label: "Getting started", href: "https://kysely.dev/docs/getting-started" },
      { label: "kysely on npm", href: "https://www.npmjs.com/package/kysely" },
      { label: "Migrations", href: "https://kysely.dev/docs/migrations" },
      { label: "MIT license", href: "https://github.com/kysely-org/kysely/blob/master/LICENSE" },
    ],
  },
  {
    product: "Prisma ORM and Prisma Postgres",
    links: [
      { label: "Prisma ORM docs", href: "/docs/orm" },
      { label: "Supported databases", href: "/docs/orm/supported-databases" },
      { label: "How migrations work", href: "/docs/orm/migrations/how-migrations-work" },
      { label: "SQL query builder", href: "/docs/orm/reference/sql-query-builder" },
      { label: "Apache License 2.0", href: "https://github.com/prisma/prisma/blob/main/LICENSE" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
] as const;

function SourceLink({ href, children }: { href: string; children: string }) {
  return href.startsWith("/") ? (
    <Link href={href} className={QUIET_LINK}>
      {children}
    </Link>
  ) : (
    <a href={href} className={QUIET_LINK}>
      {children}
    </a>
  );
}

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getKyselyPageContent() {
  return [
    <div key="intro" className="max-w-3xl">
      <h1 className="text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
        {KYSELY_TITLE}
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground">
        Both give you type-safe database access in TypeScript, from opposite ends.{" "}
        <Link href="/docs/orm" className={INLINE}>
          Prisma ORM
        </Link>{" "}
        starts from a contract file: you describe your models once, and typed queries and migrations
        follow from it.{" "}
        <a href="https://kysely.dev" className={INLINE}>
          Kysely
        </a>{" "}
        starts from SQL: you write each query as a fluent TypeScript builder over table types you
        keep yourself.
      </p>
      <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
        Prisma makes Prisma ORM; Kysely is an independent open-source project. Figures about Kysely
        come from its own pages, listed under{" "}
        <a href="#sources" className={QUIET_LINK}>
          Sources
        </a>{" "}
        and checked {CHECKED}.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <PrismButton href="https://console.prisma.io" ctaLocation="compare-intro">
          Get started free
        </PrismButton>{" "}
        <PrismButtonOutline href="/pricing" ctaLocation="compare-intro">
          See pricing
        </PrismButtonOutline>
      </div>
    </div>,
    <div key="body" className={BODY}>
      <section className={SECTION}>
        <h2 id="choose">When should I choose Prisma ORM or Kysely</h2>
        <div className={TABLE_FRAME}>
          <table className="w-full border-collapse text-left" style={{ minWidth: 0 }}>
            <thead>
              <tr>
                <th scope="col" className={TH_COL} style={{ width: "50%" }}>
                  Kysely
                </th>
                <th scope="col" className={TH_COL} style={{ width: "50%" }}>
                  Prisma ORM
                </th>
              </tr>
            </thead>
            <tbody>
              {CHOOSE_KYSELY.map((kysely, index) => (
                <tr key={kysely} className="border-t border-black/[0.06]">
                  <td className={TD}>{renderFaqAnswer(kysely)}</td>
                  <td className={TD}>{renderFaqAnswer(CHOOSE_PRISMA[index])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={SECTION}>
        <h2 id="feature-table">What each one supports</h2>
        <p className="max-w-[68ch]">
          Kysely is a SQL query builder. Prisma ORM is a contract-based ORM that also includes a SQL
          query builder on PostgreSQL and SQLite. Columns are in alphabetical order.
        </p>
        <div
          className={TABLE_FRAME}
          role="region"
          aria-labelledby="feature-table"
          tabIndex={0}
          style={SCROLL_HINT}
        >
          <table
            className="w-full border-collapse text-left"
            style={{ minWidth: "40rem", overflow: "visible" }}
          >
            <thead>
              <tr>
                <th scope="col" className={`${TH_COL} ${STICKY}`} style={{ width: "22%" }}>
                  Feature
                </th>
                <th scope="col" className={TH_COL} style={{ width: "39%" }}>
                  Kysely
                </th>
                <th scope="col" className={TH_COL} style={{ width: "39%" }}>
                  Prisma ORM
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature} className="border-t border-black/[0.06]">
                  <th scope="row" className={`${TH_ROW} ${STICKY}`}>
                    {row.feature}
                  </th>
                  <td className={TD}>{renderFaqAnswer(row.kysely)}</td>
                  <td className={TD}>{renderFaqAnswer(row.prisma)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={SECTION}>
        <h2 id="where-kysely">Where Kysely works well</h2>
        <p className="max-w-[68ch]">
          Kysely is a SQL query builder. Its{" "}
          <a href="https://kysely.dev/docs/getting-started" className={INLINE}>
            getting started guide
          </a>{" "}
          shows <code>selectFrom</code> and <code>where</code>, and lists joins among the other SQL
          features. Each built-in dialect needs its driver.
        </p>
        <ul className={LIST}>
          {KYSELY_FITS.map((item) => (
            <li key={item}>{renderFaqAnswer(item)}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <h2 id="where-prisma">Where Prisma ORM fits better</h2>
        <p className="max-w-[68ch]">
          Prisma ORM fits a team that wants the contract, the model queries, and the migrations to
          come from one file. The{" "}
          <Link href="/docs/orm" className={INLINE}>
            ORM docs
          </Link>{" "}
          describe that file as the contract.
        </p>
        <ul className={LIST}>
          {PRISMA_FITS.map((item) => (
            <li key={item}>{renderFaqAnswer(item)}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <h2 id="apart">What sets Prisma ORM apart</h2>
        <div className={GROUPS}>
          {APART.map((item) => (
            <div key={item.title} className={GROUP}>
              <h3 className="text-lg leading-snug">{item.title}</h3>
              <p className="max-w-[68ch]">{renderFaqAnswer(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <h2 id="pricing">Pricing</h2>
        <div className={GROUPS}>
          <div className={GROUP}>
            <h3 className="text-lg leading-snug">Kysely</h3>
            <p className="max-w-[68ch]">
              The library is free under the{" "}
              <a href="https://github.com/kysely-org/kysely/blob/master/LICENSE" className={INLINE}>
                MIT license
              </a>
              . There is no Kysely hosting plan: you bring the database.
            </p>
          </div>
          <div className={GROUP}>
            <h3 className="text-lg leading-snug">Prisma ORM and Prisma Postgres</h3>
            <p className="max-w-[68ch]">
              Prisma ORM is free under the{" "}
              <a href="https://github.com/prisma/prisma/blob/main/LICENSE" className={INLINE}>
                Apache License 2.0
              </a>
              . Prisma Postgres is optional, and it works with any Postgres client, so Prisma ORM is
              optional with it. Its{" "}
              <Link href="/pricing" className={INLINE}>
                Free plan
              </Link>{" "}
              is $0, with 200,000 operations a month, 2 GB of storage, and 50 databases. Prisma
              Compute is separate app hosting.
            </p>
          </div>
        </div>
      </section>

      <section className={SECTION}>
        <h2 id="wrong-choice">When Prisma ORM is the wrong choice</h2>
        <ul className={LIST}>
          {WRONG_CHOICE.map((item) => (
            <li key={item}>{renderFaqAnswer(item)}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <h2 id="migrate">Move from Kysely to Prisma ORM</h2>
        <ol className={STEPS}>
          <li>
            For PostgreSQL, run <code>npx prisma@latest orm init</code> in the app. The{" "}
            <Link href="/docs/prisma-orm/add-to-existing-project/postgresql" className={INLINE}>
              existing-database guide
            </Link>{" "}
            lists the Node.js versions it expects.
          </li>
          <li>
            Run <code>npx prisma contract infer</code> to write <code>contract.prisma</code> from
            the tables, then <code>npx prisma contract emit</code> and{" "}
            <code>npx prisma db sign</code>. Signing records that the database already matches the
            contract, so the first <code>migration plan</code> starts from your tables instead of an
            empty database. The rows stay where they are.
          </li>
          <li>
            Later changes go through{" "}
            <Link href="/docs/orm/migrations/generating-a-migration" className={INLINE}>
              contract emit and migration plan
            </Link>
            . On PostgreSQL, <code>migration show</code> prints the SQL.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <h2 id="migrate-back">Move from Prisma ORM to Kysely</h2>
        <ol className={STEPS}>
          <li>Keep the database and the connection string.</li>
          <li>
            Add a TypeScript <code>Database</code> interface that matches the tables. A community
            generator can emit those types from a Prisma schema. Prisma documents it on the{" "}
            <Link href="/docs/orm/v7/prisma-schema/overview/generators" className={INLINE}>
              Prisma ORM 7 generators
            </Link>{" "}
            page. It is not part of Prisma ORM.
          </li>
          <li>
            Create one Kysely instance with the dialect that matches the database, plus that
            dialect&apos;s driver. On PostgreSQL that is <code>PostgresDialect</code> and{" "}
            <code>pg</code>. On Prisma Postgres, follow the{" "}
            <Link href="/docs/prisma-postgres/quickstart/kysely" className={INLINE}>
              Kysely quickstart
            </Link>
            . Prisma ORM is optional there.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <h2 id="proof">What teams on Prisma say</h2>
        <p className="max-w-[68ch]">Two teams on what type safety in Prisma ORM does for them.</p>
        <QuoteCarousel>
          {PROOF.map((item) => (
            <figure key={item.name} className="flex flex-col gap-5">
              <img
                src={LOGOS[item.company].src}
                alt=""
                width={LOGOS[item.company].width}
                height={20}
                className="h-5 w-auto self-start"
              />
              <blockquote className="text-pretty text-lg leading-8 text-primary">
                &quot;{item.quote}&quot;
              </blockquote>
              <figcaption className="text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">{item.name}</span>, {item.role},{" "}
                {item.company}
              </figcaption>
            </figure>
          ))}
        </QuoteCarousel>
      </section>

      <section className={SECTION}>
        <h2 id="faq">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="border-t border-black/[0.08]">
          {FAQ.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-7 text-foreground">
                {renderFaqAnswer(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>,
    <section
      key="next"
      id="next"
      aria-labelledby="compare-cta-heading"
      className="mt-14 scroll-mt-28 rounded-xl bg-muted/60 p-7 sm:p-10"
    >
      <h2 id="compare-cta-heading" className="text-balance font-heading text-2xl font-medium">
        {COMPARISON_CTA.headline}
      </h2>
      <p className="mt-4 text-pretty leading-7 text-foreground">{COMPARISON_CTA.body}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 leading-7 marker:text-black/25">
        {COMPARISON_CTA.checks.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <PrismButton href={COMPARISON_CTA.primaryCta.href} ctaLocation="compare-close">
          {COMPARISON_CTA.primaryCta.label}
        </PrismButton>{" "}
        <PrismButtonOutline href={COMPARISON_CTA.secondaryCta.href} ctaLocation="compare-close">
          {COMPARISON_CTA.secondaryCta.label}
        </PrismButtonOutline>
      </div>
    </section>,
    <section
      key="sources"
      id="sources"
      aria-labelledby="sources-heading"
      className="mt-14 scroll-mt-28"
    >
      <h2 id="sources-heading" className="font-heading text-xl font-medium">
        Sources
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Every competitor figure on this page comes from these pages, checked {CHECKED}.
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        {SOURCES.map((group) => (
          <div key={group.product}>
            <h3 className="text-sm font-medium">{group.product}</h3>
            <ul className="mt-2 space-y-1.5 text-sm leading-6 text-muted-foreground">
              {group.links.map((link) => (
                <li key={link.href}>
                  <SourceLink href={link.href}>{link.label}</SourceLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>,
  ];
}

/** Render the comparison in the guide article frame. */
export function KyselyPage() {
  return <CompareArticle slug="kysely">{getKyselyPageContent()}</CompareArticle>;
}
