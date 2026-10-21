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
  CHOOSE_PRISMA,
  CHOOSE_VERCEL,
  COMPARE_ROWS,
  FAQ,
  PRICING,
  PRISMA_FITS,
  VERCEL_AUTHOR,
  VERCEL_FITS,
  VERCEL_NEON_DRIZZLE_COMPARE_PATH,
  VERCEL_TITLE,
  VERCEL_UPDATED,
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
    product: "Vercel",
    links: [
      { label: "Vercel pricing", href: "https://vercel.com/pricing" },
      { label: "Vercel Pro plan", href: "https://vercel.com/docs/plans/pro-plan" },
      { label: "Vercel plans", href: "https://vercel.com/docs/plans" },
      { label: "Vercel Marketplace", href: "https://vercel.com/marketplace" },
      {
        label: "Vercel deployment environments",
        href: "https://vercel.com/docs/deployments/environments",
      },
      { label: "Vercel CDN", href: "https://vercel.com/docs/cdn" },
      { label: "Next.js on Vercel", href: "https://vercel.com/docs/frameworks/nextjs" },
    ],
  },
  {
    product: "Prisma Compute, Prisma Postgres, and Prisma ORM",
    links: [
      { label: "Prisma Compute", href: "/docs/compute" },
      { label: "Prisma Postgres", href: "/docs/postgres" },
      { label: "Prisma ORM docs", href: "/docs/orm" },
      { label: "Prisma REST API", href: "/docs/rest-api" },
      { label: "Compute limitations", href: "/docs/compute/limitations" },
      { label: "Compute branching", href: "/docs/compute/branching" },
      { label: "Prisma vs Vercel + Neon + Drizzle", href: VERCEL_NEON_DRIZZLE_COMPARE_PATH },
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
function buildVercelPage(minutes: number) {
  return [
    <div key="intro">
      <h1 className="max-w-4xl text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
        {VERCEL_TITLE}
      </h1>
      <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground">
        Both host TypeScript apps.{" "}
        <a href="https://vercel.com" className={INLINE}>
          Vercel
        </a>{" "}
        connects application hosting to databases through Marketplace integrations.{" "}
        <Link href="/docs/compute" className={INLINE}>
          Prisma Compute
        </Link>{" "}
        runs the app next to{" "}
        <Link href="/docs/postgres" className={INLINE}>
          Prisma Postgres
        </Link>{" "}
        as one first-party platform, with{" "}
        <Link href="/docs/orm" className={INLINE}>
          Prisma ORM
        </Link>{" "}
        available on the same workflow. Pick Prisma when you want the app and database in one
        project, without a cross-vendor network hop. Pick Vercel when you want mature frontend
        hosting, a global CDN, and to choose the database from the Marketplace.
      </p>
      {comparisonHeroCtas("postgres", {
        secondary: false,
        primaryLabel: "Get started with Prisma",
      })}
      {comparisonByline({
        author: VERCEL_AUTHOR,
        updated: VERCEL_UPDATED,
        minutes,
      })}
      {comparisonDisclosure({
        competitor: "Vercel",
        checked: CHECKED,
        prismaProduct: "Prisma Compute, Prisma Postgres, and Prisma ORM",
      })}
    </div>,
    <div key="body" className={BODY}>
      <section className={SECTION}>
        <AnchorHeading level={2} id="choose">
          When should I choose Vercel or Prisma?
        </AnchorHeading>
        {comparisonChooseTable({
          competitor: "Vercel",
          prisma: "Prisma",
          competitorItems: CHOOSE_VERCEL,
          prismaItems: CHOOSE_PRISMA,
        })}
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="feature-table">
          How do Vercel and Prisma compare?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Both host TypeScript apps. Vercel connects hosting to database providers through
          integrations. Prisma Compute, Prisma Postgres, and Prisma ORM sit in one first-party
          platform.
        </p>
        <CompareTable
          labelledBy="feature-table"
          corner="Feature"
          columns={["Vercel", "Prisma"]}
          minWidth="40rem"
          rows={COMPARE_ROWS.map((row) => ({
            label: row.feature,
            cells: [renderFaqAnswer(row.vercel), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="where-each">
          Where does each one fit?
        </AnchorHeading>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Vercel</h3>
            <p>
              Vercel is a mature application platform with deep framework support, preview
              deployments, and a broad database marketplace. Teams can connect providers such as
              Neon, Supabase, and Prisma Postgres directly to Vercel projects.
            </p>
            <ul className={LIST}>
              {VERCEL_FITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Prisma</h3>
            <p>
              Prisma takes a first-party approach. Prisma Compute runs alongside Prisma Postgres, so
              the app and database can deploy and operate together without a cross-vendor network
              hop. Prisma ORM adds the typed data layer. It is optional.
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
          Where Prisma differs from Vercel
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
          How much do Vercel and Prisma cost?
        </AnchorHeading>
        <ComparisonPricingTable
          labelledBy="pricing"
          corner="Cost"
          columns={[
            { label: "Vercel", id: "pricing-vercel" },
            { label: "Prisma", id: "pricing-prisma" },
          ]}
          rows={PRICING.map((row) => ({
            label: row.label,
            cells: [renderFaqAnswer(row.vercel), renderFaqAnswer(row.prisma)],
          }))}
          note={
            <>
              Prisma Compute and Prisma Postgres share one set of plans. A database on Vercel is
              priced by the Marketplace provider. Prisma ORM is free and open source, and always
              will be. Prisma Free is $0 a month: 1M Compute requests, 200,000 Postgres operations,
              2 GB of storage, and 50 databases. No credit card required. The{" "}
              <Link href="/pricing" className={QUIET_LINK}>
                pricing page
              </Link>{" "}
              lists the paid plans. Vercel Hobby is $0 for personal use. Pro is $20 a month plus
              usage, with a $20 monthly credit (
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
          How do I switch from Vercel to Prisma?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Create a Prisma Postgres database if the app does not already use one. The{" "}
            <Link href="/docs/postgres/import-from-existing-database" className={INLINE}>
              import from an existing database
            </Link>{" "}
            guide uses <code>pg_dump</code> and <code>pg_restore</code> over the direct connection.
          </li>
          <li>
            Point the app at the Prisma Postgres connection string. Prisma ORM is optional; any
            Postgres client works.
          </li>
          <li>
            Host the HTTP app on{" "}
            <Link href="/docs/compute" className={INLINE}>
              Prisma Compute
            </Link>
            , or keep Vercel if that host still fits.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate-back">
          How do I switch from Prisma to Vercel?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>
            Deploy the app on Vercel. Preview deployments run for every Git push. See{" "}
            <a href="https://vercel.com/docs/deployments/environments" className={INLINE}>
              Vercel deployment environments
            </a>
            .
          </li>
          <li>
            Connect a Marketplace database, or keep Prisma Postgres and point the Vercel app at its
            connection string. Prisma Postgres works with any Postgres client.
          </li>
          <li>
            Pick an ORM if you want one. Prisma ORM stays optional. For the Vercel + Neon + Drizzle
            stack, see{" "}
            <Link href={VERCEL_NEON_DRIZZLE_COMPARE_PATH} className={INLINE}>
              Prisma vs Vercel + Neon + Drizzle
            </Link>
            .
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="proof">
          What do teams say about Prisma?
        </AnchorHeading>
        <p className="max-w-[68ch]">Two teams on what Prisma does for them.</p>
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
    comparisonClosingCta("postgres", {
      instantDatabase: false,
      secondary: false,
      firstCheck: "Get started with Prisma and start building in minutes",
    }),
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

const VERCEL_READING = articleReadingStats(buildVercelPage(1));

export function getVercelReadingStats() {
  return articleReadingStats(buildVercelPage(VERCEL_READING.minutes));
}

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getVercelPageContent() {
  return buildVercelPage(VERCEL_READING.minutes);
}

/** Render the comparison in the guide article frame. */
export function VercelPage() {
  return <CompareArticle slug="vercel">{getVercelPageContent()}</CompareArticle>;
}
