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
  CHOOSE_CONVEX,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  CONVEX_AUTHOR,
  CONVEX_FITS,
  CONVEX_TITLE,
  CONVEX_UPDATED,
  FAQ,
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
    product: "Convex",
    links: [
      { label: "Convex overview", href: "https://docs.convex.dev/understanding/" },
      { label: "convex on npm", href: "https://www.npmjs.com/package/convex" },
      { label: "Frontend hosting", href: "https://docs.convex.dev/production/hosting" },
      { label: "Backup and export", href: "https://docs.convex.dev/database/backup-restore" },
      { label: "Convex pricing", href: "https://www.convex.dev/pricing" },
      {
        label: "Apache License 2.0",
        href: "https://github.com/get-convex/convex-backend/blob/main/LICENSE",
      },
    ],
  },
  {
    product: "Prisma Postgres, Prisma ORM, and Prisma Compute",
    links: [
      { label: "Prisma Postgres", href: "/docs/postgres" },
      { label: "Prisma ORM docs", href: "/docs/orm" },
      { label: "Supported databases", href: "/docs/orm/supported-databases" },
      { label: "Prisma Compute", href: "/docs/compute" },
      { label: "Compute limitations", href: "/docs/compute/limitations" },
      { label: "Composer building blocks", href: "/docs/composer/building-blocks" },
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
function buildConvexPage(minutes: number) {
  return [
    <div key="intro">
      <h1 className="max-w-4xl text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
        {CONVEX_TITLE}
      </h1>
      <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground">
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
        hosts the TypeScript app as HTTP services. Pick{" "}
        <a href="https://docs.convex.dev/understanding/" className={INLINE}>
          Convex
        </a>{" "}
        when you want a reactive database and TypeScript query functions, with the frontend on a
        host such as Vercel or Netlify.
      </p>
      {comparisonHeroCtas("postgres")}
      {comparisonByline({ author: CONVEX_AUTHOR, updated: CONVEX_UPDATED, minutes })}
      {comparisonDisclosure({
        competitor: "Convex",
        checked: CHECKED,
        prismaProduct: "Prisma Postgres",
      })}
    </div>,
    <div key="body" className={BODY}>
      <section className={SECTION}>
        <AnchorHeading level={2} id="choose">
          When should I choose Convex or Prisma Postgres?
        </AnchorHeading>
        {comparisonChooseTable({
          competitor: "Convex",
          prisma: "Prisma Postgres",
          competitorItems: CHOOSE_CONVEX,
          prismaItems: CHOOSE_PRISMA,
        })}
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="feature-table">
          How do Convex and Prisma Postgres compare?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Convex is a reactive database. Application queries are TypeScript functions. Convex cloud
          stores data in MySQL on PlanetScale. Prisma Postgres is managed PostgreSQL, with an
          optional ORM and separate app hosting. Columns are in alphabetical order.
        </p>
        <CompareTable
          labelledBy="feature-table"
          corner="Feature"
          columns={["Convex", "Prisma Postgres"]}
          minWidth="40rem"
          rows={COMPARE_ROWS.map((row) => ({
            label: row.feature,
            cells: [renderFaqAnswer(row.convex), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="where-each">
          Where does each one fit?
        </AnchorHeading>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Convex</h3>
            <p>
              Convex is a reactive database. Its{" "}
              <a href="https://docs.convex.dev/understanding/" className={INLINE}>
                overview
              </a>{" "}
              describes TypeScript queries that rerun when their data changes, and a client library
              that subscribes over a WebSocket.
            </p>
            <ul className={LIST}>
              {CONVEX_FITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Prisma Postgres</h3>
            <p>
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
          {"What does Prisma Postgres do that Convex doesn't?"}
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
          How much do Convex and Prisma Postgres cost?
        </AnchorHeading>
        <ComparisonPricingTable
          labelledBy="pricing"
          corner="Cost"
          columns={[
            { label: "Convex", id: "pricing-convex" },
            { label: "Prisma Postgres", id: "pricing-prisma" },
          ]}
          rows={PRICING.map((row) => ({
            label: row.label,
            cells: [renderFaqAnswer(row.convex), renderFaqAnswer(row.prisma)],
          }))}
          note={
            <>
              Prisma Postgres has a Free plan: $0 a month for 200,000 operations, 2 GB of storage,
              and 50 databases. The{" "}
              <Link href="/pricing" className={QUIET_LINK}>
                pricing page
              </Link>{" "}
              lists the paid plans. Convex Free includes 0.5 GB of database storage and 1 million
              function calls (
              <a href="https://www.convex.dev/pricing" className={QUIET_LINK}>
                Convex pricing
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
          How do I switch from Convex to Prisma Postgres?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Create the PostgreSQL database. Prisma ORM is optional. When the tables already exist,
            the{" "}
            <Link href="/docs/prisma-orm/add-to-existing-project/postgresql" className={INLINE}>
              existing-database guide
            </Link>{" "}
            shows <code>contract infer</code>.
          </li>
          <li>
            Export the data. Every Convex plan can download a snapshot export, a ZIP with one{" "}
            <code>documents.jsonl</code> file per table, from the dashboard or with{" "}
            <code>npx convex export</code>, as the{" "}
            <a href="https://docs.convex.dev/database/backup-restore" className={INLINE}>
              backup and export guide
            </a>{" "}
            describes. Professional adds streaming data exports. Load the JSONL into PostgreSQL
            yourself. This page does not include a converter.
          </li>
          <li>
            Point the app at the Postgres connection string. Host the HTTP app on Prisma Compute, or
            keep the frontend host you already use.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate-back">
          How do I switch from Prisma Postgres to Convex?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Define Convex tables and write query and mutation functions. The{" "}
            <a href="https://docs.convex.dev/understanding/" className={INLINE}>
              overview
            </a>{" "}
            shows <code>ctx.db.query</code> and <code>ctx.db.patch</code>.
          </li>
          <li>
            Subscribe from the client with <code>useQuery</code>. The client library uses a
            WebSocket.
          </li>
          <li>
            Publish the frontend with a provider such as Vercel or Netlify, as the{" "}
            <a href="https://docs.convex.dev/production/hosting" className={INLINE}>
              hosting guide
            </a>{" "}
            describes. Prisma Postgres stays in place until you stop using it.
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

const CONVEX_READING = articleReadingStats(buildConvexPage(1));

export function getConvexReadingStats() {
  return articleReadingStats(buildConvexPage(CONVEX_READING.minutes));
}

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getConvexPageContent() {
  return buildConvexPage(CONVEX_READING.minutes);
}

/** Render the comparison in the guide article frame. */
export function ConvexPage() {
  return <CompareArticle slug="convex">{getConvexPageContent()}</CompareArticle>;
}
