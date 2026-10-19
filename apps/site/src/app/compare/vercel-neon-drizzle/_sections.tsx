import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import { AnchorHeading } from "../anchor-heading";
import {
  CompareArticle,
  comparisonChooseTable,
  comparisonClosingCta,
  comparisonDisclosure,
  comparisonHeroCtas,
} from "../article";
import { comparisonByline } from "../byline";
import { comparisonProofCards } from "../proof-cards";
import { articleReadingStats } from "../reading-time";
import { CompareTable } from "../compare-table";
import { ComparisonPricingTable } from "../pricing-table";
import { QUIET_LINK } from "../table-styles";
import { renderFaqAnswer } from "@/lib/faq-answer";
import {
  APART,
  CHECKED,
  CHOOSE_COMBO,
  CHOOSE_PRISMA,
  COMBO_FITS,
  COMPARE_ROWS,
  DRIZZLE_ORM_COMPARE_PATH,
  FAQ,
  PRICING,
  PRISMA_FITS,
  VERCEL_NEON_DRIZZLE_AUTHOR,
  VERCEL_NEON_DRIZZLE_TITLE,
  VERCEL_NEON_DRIZZLE_UPDATED,
  WRONG_CHOICE,
} from "./_content";

const INLINE =
  "font-medium text-foreground underline underline-offset-4 decoration-black/35 transition-colors hover:decoration-black/60";

/**
 * One rhythm for the whole body: 56px between sections and 20px under every h2.
 * Prose margins are zeroed so these gaps are the only spacing, and every
 * paragraph and list item shares one size, line height and colour. Code spans from prose and from
 * `renderFaqAnswer` share one treatment, and a span that wraps keeps its padding on both lines.
 */
const BODY =
  "flex flex-col gap-14 [&_:is(h2,h3)]:my-0 [&_:is(h2,h3)]:text-primary [&_:is(p,ul,ol,li,table,figure,img)]:my-0 [&_:is(p,li)]:text-base [&_:is(p,li)]:leading-7 [&_:is(p,li)]:text-foreground [&_code]:box-decoration-clone [&_code]:rounded [&_code]:border-0 [&_code]:bg-black/[0.045] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.875em] [&_code]:font-[family-name:var(--font-code)] [&_code]:font-medium [&_code]:text-primary [&_code]:before:content-none [&_code]:after:content-none [&_table_code]:text-[13px] [&_blockquote]:my-0 [&_blockquote]:border-0 [&_blockquote]:pl-0 [&_blockquote]:font-normal [&_blockquote]:not-italic [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none";
const SECTION = "flex flex-col gap-5";
const LIST = "list-disc space-y-2 pl-5 marker:text-black/25";
const STEPS = "list-decimal space-y-2 pl-5 marker:text-muted-foreground";
const CHOOSE_LABEL = "font-heading text-lg leading-snug font-medium";

const PROOF = TESTIMONIALS.filter(
  (item) => item.name === "Ron Cohen" || item.name === "Omar López",
);

const LOGOS: Record<string, { src: string; width: number }> = {
  Bucket: { src: "/logos/customers/bucket.png", width: 108 },
  "Cal.com": { src: "/logos/companies/cal.svg", width: 96 },
};

const SOURCES = [
  {
    product: "Vercel, Neon, and Drizzle",
    links: [
      { label: "Vercel pricing", href: "https://vercel.com/pricing" },
      { label: "Vercel Pro plan", href: "https://vercel.com/docs/plans/pro-plan" },
      { label: "Neon pricing", href: "https://neon.com/pricing" },
      { label: "Neon + Vercel", href: "https://neon.com/docs/guides/vercel-native-integration" },
      { label: "Drizzle", href: "https://orm.drizzle.team" },
      { label: "Drizzle on Neon", href: "https://orm.drizzle.team/docs/get-started/neon-new" },
      {
        label: "Drizzle schema",
        href: "https://orm.drizzle.team/docs/sql-schema-declaration",
      },
    ],
  },
  {
    product: "Prisma ORM, Prisma Postgres, and Prisma Compute",
    links: [
      { label: "Prisma ORM docs", href: "/docs/orm" },
      { label: "Prisma ORM vs Drizzle", href: DRIZZLE_ORM_COMPARE_PATH },
      { label: "Prisma Postgres", href: "/docs/postgres" },
      { label: "Prisma Compute", href: "/docs/compute" },
      { label: "Compute limitations", href: "/docs/compute/limitations" },
      { label: "Compute branching", href: "/docs/compute/branching" },
      { label: "Switch from Drizzle", href: "/docs/guides/switch-to-prisma-orm/from-drizzle" },
      {
        label: "Import from an existing database",
        href: "/docs/postgres/import-from-existing-database",
      },
      { label: "Apache License 2.0", href: "https://github.com/prisma/prisma/blob/main/LICENSE" },
      { label: "Prisma pricing", href: "/pricing" },
    ],
  },
] as const;

function SourceLink({ href, children }: { href: string; children: string }) {
  return href.startsWith("/") ? (
    <Link href={href} className={`${QUIET_LINK} inline-block py-1.5`}>
      {children}
    </Link>
  ) : (
    <a href={href} className={`${QUIET_LINK} inline-block py-1.5`}>
      {children}
    </a>
  );
}

/** Build the shared content tree for the HTML page and its Markdown rendition. */
function buildVercelNeonDrizzlePage(minutes: number) {
  return [
    <div key="intro">
      <h1 className="max-w-4xl text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
        {VERCEL_NEON_DRIZZLE_TITLE}
      </h1>
      <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground">
        Compare{" "}
        <Link href="/docs/orm" className={INLINE}>
          Prisma ORM
        </Link>
        ,{" "}
        <Link href="/docs/postgres" className={INLINE}>
          Prisma Postgres
        </Link>
        , and{" "}
        <Link href="/docs/compute" className={INLINE}>
          Prisma Compute
        </Link>{" "}
        with the Vercel, Neon, and Drizzle setup, where you combine a host, a database, and an ORM
        from three separate providers. Pick Prisma when you want the data model, managed Postgres,
        and app hosting in one platform, with shared schema context across deploys and previews.
        Pick Vercel + Neon + Drizzle when you want to connect those three products yourself.
      </p>
      {comparisonHeroCtas("postgres", {
        secondary: false,
        primaryLabel: "Get started with Prisma",
      })}
      {comparisonByline({
        author: VERCEL_NEON_DRIZZLE_AUTHOR,
        updated: VERCEL_NEON_DRIZZLE_UPDATED,
        minutes,
      })}
      {comparisonDisclosure({
        competitor: "Vercel, Neon, and Drizzle",
        checked: CHECKED,
        prismaProduct: "Prisma ORM, Prisma Postgres, and Prisma Compute",
      })}
    </div>,
    <div key="body" className={BODY}>
      <section className={SECTION}>
        <AnchorHeading level={2} id="choose">
          When should I choose Vercel + Neon + Drizzle or Prisma?
        </AnchorHeading>
        {comparisonChooseTable({
          competitor: "Vercel + Neon + Drizzle",
          prisma: "Prisma",
          competitorItems: CHOOSE_COMBO,
          prismaItems: CHOOSE_PRISMA,
        })}
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="feature-table">
          How do Vercel + Neon + Drizzle and Prisma compare?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Both cover a TypeScript backend: an ORM, managed Postgres, and a place to run the app.
          Vercel, Neon, and Drizzle are three products you wire together. Prisma ORM, Prisma
          Postgres, and Prisma Compute sit in one platform.
        </p>
        <CompareTable
          labelledBy="feature-table"
          corner="Backend need"
          columns={["Vercel + Neon + Drizzle", "Prisma"]}
          minWidth="40rem"
          rows={COMPARE_ROWS.map((row) => ({
            label: row.feature,
            cells: [renderFaqAnswer(row.combo), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="where-each">
          Where does each one fit?
        </AnchorHeading>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Vercel + Neon + Drizzle</h3>
            <p>
              This setup combines three products to cover the app, the database, and the data layer.
            </p>
            <p>
              <a href="https://orm.drizzle.team" className={INLINE}>
                Drizzle
              </a>{" "}
              is the data layer: a free, open-source, type-safe TypeScript ORM and query builder. It
              connects to a database you host somewhere else. Prisma ORM compares to Drizzle{" "}
              <Link href={DRIZZLE_ORM_COMPARE_PATH} className={INLINE}>
                here
              </Link>
              .
            </p>
            <p>
              <a href="https://neon.com" className={INLINE}>
                Neon
              </a>{" "}
              is the database: serverless Postgres with branching and scale-to-zero, billed by
              compute.
            </p>
            <p>
              <a href="https://vercel.com" className={INLINE}>
                Vercel
              </a>{" "}
              is the host. It runs your frontend and full-stack app with serverless functions.
            </p>
            <p>
              Each product handles its own layer. You connect them yourself, manage three accounts
              and three bills, and keep environments in sync across providers.
            </p>
            <ul className={LIST}>
              {COMBO_FITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Prisma</h3>
            <p>Prisma brings the same workflow into one platform.</p>
            <p>
              <Link href="/docs/orm" className={INLINE}>
                Prisma ORM
              </Link>{" "}
              is a type-safe data layer built around a declarative Prisma schema.
            </p>
            <p>
              <Link href="/docs/postgres" className={INLINE}>
                Prisma Postgres
              </Link>{" "}
              is managed Postgres connected to the Prisma workflow.
            </p>
            <p>
              <Link href="/docs/compute" className={INLINE}>
                Prisma Compute
              </Link>{" "}
              is TypeScript app hosting designed to work alongside Prisma Postgres.
            </p>
            <p>
              The CLI and Management API are structured interfaces developers and coding agents can
              use across the platform.
            </p>
            <p>
              Prisma is designed for TypeScript teams that want the data model, database, hosting,
              and development workflow to work together.
            </p>
            <ul className={LIST}>
              {PRISMA_FITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="apart">
          Where Prisma differs from Vercel + Neon + Drizzle
        </AnchorHeading>
        <div className="grid gap-8 sm:grid-cols-2">
          {APART.map((item) => (
            <div key={item.title} className="border-t border-border pt-5">
              <AnchorHeading
                level={3}
                id={item.id}
                className="text-base leading-snug font-semibold"
              >
                {item.title}
              </AnchorHeading>
              <p className="mt-2">{renderFaqAnswer(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="pricing">
          How much do Vercel + Neon + Drizzle and Prisma cost?
        </AnchorHeading>
        <ComparisonPricingTable
          labelledBy="pricing"
          corner="Cost"
          columns={[
            { label: "Vercel + Neon + Drizzle", id: "pricing-combo" },
            { label: "Prisma", id: "pricing-prisma" },
          ]}
          rows={PRICING.map((row) => ({
            label: row.label,
            cells: [renderFaqAnswer(row.combo), renderFaqAnswer(row.prisma)],
          }))}
          note={
            <>
              Prisma prices the whole stack through one platform. The alternative splits across
              three providers. Prisma ORM is free and open source, and always will be. Prisma
              Postgres Free is $0 a month for 200,000 operations, 2 GB of storage, and 50 databases.
              No credit card required. The{" "}
              <Link href="/pricing" className={QUIET_LINK}>
                pricing page
              </Link>{" "}
              lists the paid plans. Neon Launch compute is $0.106 per CU-hour (
              <a href="https://neon.com/pricing" className={QUIET_LINK}>
                Neon pricing
              </a>
              ). Vercel Pro is $20 a month plus usage (
              <a href="https://vercel.com/pricing" className={QUIET_LINK}>
                Vercel pricing
              </a>
              , {CHECKED}).
            </>
          }
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="wrong-choice">
          When is Prisma the wrong choice?
        </AnchorHeading>
        <ul className={LIST}>
          {WRONG_CHOICE.map((item) => (
            <li key={item}>{renderFaqAnswer(item)}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate">
          How do I switch from Vercel + Neon + Drizzle to Prisma?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Create a Prisma Postgres database. The{" "}
            <Link href="/docs/postgres/import-from-existing-database" className={INLINE}>
              import from an existing database
            </Link>{" "}
            guide uses <code>pg_dump</code> and <code>pg_restore</code> over the direct connection.
          </li>
          <li>
            Move the data layer with the{" "}
            <Link href="/docs/guides/switch-to-prisma-orm/from-drizzle" className={INLINE}>
              switch from Drizzle
            </Link>{" "}
            guide if you want Prisma ORM. Prisma ORM is optional; Prisma Postgres works with any
            Postgres client.
          </li>
          <li>
            Point the app at the Prisma Postgres connection string. Host the HTTP app on Prisma
            Compute, or keep Vercel if that host still fits.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate-back">
          How do I switch from Prisma to Vercel + Neon + Drizzle?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Create a Neon database and dump Prisma Postgres with <code>pg_dump</code> over the
            direct connection, then restore into Neon. Both sides are PostgreSQL.
          </li>
          <li>
            Point the app at the Neon connection string. Keep using SQL or an ORM; Drizzle is one
            option, documented on{" "}
            <a href="https://orm.drizzle.team/docs/get-started/neon-new" className={INLINE}>
              Drizzle + Neon
            </a>
            .
          </li>
          <li>Deploy the app on Vercel. Prisma Postgres stays in place until you stop using it.</li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="proof">
          What do teams say about Prisma?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Two teams on what Prisma ORM and Prisma Postgres do for them.
        </p>
        {comparisonProofCards(
          PROOF.map((item) => ({
            name: item.name,
            role: item.role,
            company: item.company,
            quote: item.quote,
            logo: LOGOS[item.company],
          })),
        )}
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="faq">
          Frequently asked questions
        </AnchorHeading>
        <Accordion type="single" collapsible className="border-t border-border">
          {FAQ.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-[36rem] text-base leading-7 text-foreground">
                {renderFaqAnswer(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>,
    comparisonClosingCta("postgres", { instantDatabase: false, secondary: false }),
    <section
      key="sources"
      id="sources"
      aria-labelledby="sources-heading"
      className="mt-14 scroll-mt-28"
    >
      <h2 id="sources-heading" className="font-heading text-[1.375rem] leading-[1.3] font-medium">
        Sources
      </h2>
      <p className="mt-5 max-w-[32rem] text-sm leading-6 text-muted-foreground">
        Every competitor figure on this page comes from these pages, checked {CHECKED}.
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        {SOURCES.map((group) => (
          <div key={group.product}>
            <h3 className="text-sm font-medium">{group.product}</h3>
            <ul className="mt-2 space-y-0 text-sm leading-6 text-muted-foreground">
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

const VERCEL_NEON_DRIZZLE_READING = articleReadingStats(buildVercelNeonDrizzlePage(1));

export function getVercelNeonDrizzleReadingStats() {
  return articleReadingStats(buildVercelNeonDrizzlePage(VERCEL_NEON_DRIZZLE_READING.minutes));
}

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getVercelNeonDrizzlePageContent() {
  return buildVercelNeonDrizzlePage(VERCEL_NEON_DRIZZLE_READING.minutes);
}

/** Render the comparison in the guide article frame. */
export function VercelNeonDrizzlePage() {
  return (
    <CompareArticle slug="vercel-neon-drizzle">{getVercelNeonDrizzlePageContent()}</CompareArticle>
  );
}
