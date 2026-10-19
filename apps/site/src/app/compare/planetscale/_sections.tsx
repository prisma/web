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
  CHOOSE_PLANETSCALE,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  FAQ,
  PLANETSCALE_AUTHOR,
  PLANETSCALE_FITS,
  PLANETSCALE_TITLE,
  PLANETSCALE_UPDATED,
  PRICING,
  PRISMA_FITS,
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
    product: "PlanetScale",
    links: [
      { label: "PlanetScale pricing", href: "https://planetscale.com/pricing" },
      { label: "Postgres branching", href: "https://planetscale.com/docs/postgres/branching" },
      {
        label: "Neki is now available in platform preview",
        href: "https://planetscale.com/changelog/neki",
      },
      { label: "Introducing Neki", href: "https://planetscale.com/blog/introducing-neki" },
      {
        label: "Neki platform preview limitations",
        href: "https://planetscale.com/docs/neki/platform-preview-limitations",
      },
      { label: "Site terms", href: "https://planetscale.com/legal/siteterms" },
    ],
  },
  {
    product: "Prisma Postgres, Prisma ORM, and Prisma Compute",
    links: [
      { label: "Prisma Postgres", href: "/docs/postgres" },
      { label: "Prisma ORM docs", href: "/docs/orm" },
      { label: "Prisma Compute", href: "/docs/compute" },
      { label: "Compute limitations", href: "/docs/compute/limitations" },
      { label: "Compute branching", href: "/docs/compute/branching" },
      {
        label: "Import from an existing database",
        href: "/docs/postgres/import-from-existing-database",
      },
      {
        label: "existing-database guide",
        href: "/docs/prisma-orm/add-to-existing-project/postgresql",
      },
      { label: "Apache License 2.0", href: "https://github.com/prisma/prisma/blob/main/LICENSE" },
      { label: "Prisma Postgres pricing", href: "/pricing" },
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
function buildPlanetScalePage(minutes: number) {
  return [
    <div key="intro">
      <h1 className="max-w-4xl text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
        {PLANETSCALE_TITLE}
      </h1>
      <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground">
        Pick{" "}
        <Link href="/docs/postgres" className={INLINE}>
          Prisma Postgres
        </Link>{" "}
        when you want managed PostgreSQL with{" "}
        <Link href="/docs/orm" className={INLINE}>
          Prisma ORM
        </Link>{" "}
        optional, and{" "}
        <Link href="/docs/compute" className={INLINE}>
          Prisma Compute
        </Link>{" "}
        hosting the TypeScript app as HTTP services in the same Prisma project. Pick{" "}
        <a href="https://planetscale.com/pricing" className={INLINE}>
          PlanetScale
        </a>{" "}
        when you want database-first Postgres SKUs, Metal, high availability, or Neki, with
        application hosting on another provider.
      </p>
      {comparisonHeroCtas("postgres")}
      {comparisonByline({ author: PLANETSCALE_AUTHOR, updated: PLANETSCALE_UPDATED, minutes })}
      {comparisonDisclosure({
        competitor: "PlanetScale",
        checked: CHECKED,
        prismaProduct: "Prisma Postgres",
      })}
    </div>,
    <div key="body" className={BODY}>
      <section className={SECTION}>
        <AnchorHeading level={2} id="choose">
          When should I choose PlanetScale or Prisma Postgres?
        </AnchorHeading>
        {comparisonChooseTable({
          competitor: "PlanetScale",
          prisma: "Prisma Postgres",
          competitorItems: CHOOSE_PLANETSCALE,
          prismaItems: CHOOSE_PRISMA,
        })}
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="feature-table">
          How do PlanetScale and Prisma Postgres compare?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          PlanetScale and Prisma Postgres are both managed PostgreSQL. PlanetScale sells
          database-first cluster SKUs, including Metal and Neki. Prisma Postgres sits next to an
          optional ORM and Prisma Compute. Columns are in alphabetical order.
        </p>
        <CompareTable
          labelledBy="feature-table"
          corner="Feature"
          columns={["PlanetScale", "Prisma Postgres"]}
          minWidth="40rem"
          rows={COMPARE_ROWS.map((row) => ({
            label: row.feature,
            cells: [renderFaqAnswer(row.planetscale), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="where-each">
          Where does each one fit?
        </AnchorHeading>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>PlanetScale</h3>
            <p>
              PlanetScale is a database-first Postgres platform. Its{" "}
              <a href="https://planetscale.com/pricing" className={INLINE}>
                pricing page
              </a>{" "}
              lists single-node, high-availability, and Metal SKUs, plus Neki for horizontally
              sharded Postgres. Application hosting stays with another provider.
            </p>
            <ul className={LIST}>
              {PLANETSCALE_FITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Prisma Postgres</h3>
            <p>
              Prisma Postgres fits a team that wants PostgreSQL next to the TypeScript app.{" "}
              <Link href="/docs/orm" className={INLINE}>
                Prisma ORM
              </Link>{" "}
              is optional.{" "}
              <Link href="/docs/compute" className={INLINE}>
                Prisma Compute
              </Link>{" "}
              is separate app hosting in the same Prisma project.
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
          {"What does Prisma Postgres do that PlanetScale doesn't?"}
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
          How much do PlanetScale and Prisma Postgres cost?
        </AnchorHeading>
        <ComparisonPricingTable
          labelledBy="pricing"
          corner="Cost"
          columns={[
            { label: "PlanetScale", id: "pricing-planetscale" },
            { label: "Prisma Postgres", id: "pricing-prisma" },
          ]}
          rows={PRICING.map((row) => ({
            label: row.label,
            cells: [renderFaqAnswer(row.planetscale), renderFaqAnswer(row.prisma)],
          }))}
          note={
            <>
              Prisma Postgres has a Free plan: $0 a month for 200,000 operations, 2 GB of storage,
              and 50 databases. No credit card required. The{" "}
              <Link href="/pricing" className={QUIET_LINK}>
                pricing page
              </Link>{" "}
              lists the paid plans. PlanetScale single-node Postgres starts at $5 a month on AWS
              us-east-1. There is no $0 Postgres SKU (
              <a href="https://planetscale.com/pricing" className={QUIET_LINK}>
                PlanetScale pricing
              </a>
              , {CHECKED}).
            </>
          }
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="wrong-choice">
          When is Prisma Postgres the wrong choice?
        </AnchorHeading>
        <ul className={LIST}>
          {WRONG_CHOICE.map((item) => (
            <li key={item}>{renderFaqAnswer(item)}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate">
          How do I switch from PlanetScale to Prisma Postgres?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Create an empty Prisma Postgres database. Prisma ORM is optional. The{" "}
            <Link href="/docs/postgres/import-from-existing-database" className={INLINE}>
              import from an existing database
            </Link>{" "}
            guide uses <code>pg_dump</code> and <code>pg_restore</code> over the direct connection.
          </li>
          <li>
            Dump PlanetScale Postgres with a direct (non-PgBouncer) connection string, then restore
            into Prisma Postgres. The dump copies PostgreSQL schemas and data. It does not reproduce
            PlanetScale branch history, Metal SKUs, or a Neki shard topology.
          </li>
          <li>
            Point the app at the Prisma Postgres connection string. Host the HTTP app on Prisma
            Compute, or keep the host you already use.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate-back">
          How do I switch from Prisma Postgres to PlanetScale?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Create a PlanetScale Postgres cluster and dump Prisma Postgres with <code>pg_dump</code>{" "}
            over the direct connection, then restore into PlanetScale. Both sides are PostgreSQL.
          </li>
          <li>
            Point the app at the PlanetScale connection string. Keep using SQL or an ORM;
            PlanetScale has no first-party ORM.
          </li>
          <li>
            Keep application hosting on a separate provider. Prisma Postgres stays in place until
            you stop using it.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="proof">
          What do teams say about Prisma Postgres?
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
    comparisonClosingCta("postgres"),
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

const PLANETSCALE_READING = articleReadingStats(buildPlanetScalePage(1));

export function getPlanetScaleReadingStats() {
  return articleReadingStats(buildPlanetScalePage(PLANETSCALE_READING.minutes));
}

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getPlanetScalePageContent() {
  return buildPlanetScalePage(PLANETSCALE_READING.minutes);
}

/** Render the comparison in the guide article frame. */
export function PlanetScalePage() {
  return <CompareArticle slug="planetscale">{getPlanetScalePageContent()}</CompareArticle>;
}
