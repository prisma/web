import Link from "next/link";
import type { ReactNode } from "react";
import { Check, Info, Minus } from "lucide-react";
import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@prisma/eclipse";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import { COMPARISON_CTA } from "../_content";
import { AnchorHeading } from "../anchor-heading";
import { CompareArticle } from "../article";
import { highlight } from "./highlight";
import { QuoteCarousel } from "./quote-carousel";
import { renderFaqAnswer } from "@/lib/faq-answer";
import {
  APART,
  CHECKED,
  CHOOSE_KYSELY,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  FAQ,
  KYSELY_AUTHOR,
  KYSELY_FITS,
  KYSELY_TITLE,
  KYSELY_UPDATED,
  PRISMA_FITS,
  SAME_QUERY,
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
 * `renderFaqAnswer` share one treatment, and a span that wraps keeps its padding on both lines.
 */
const BODY =
  "flex flex-col gap-14 [&_:is(h2,h3)]:my-0 [&_:is(h2,h3)]:text-primary [&_:is(p,ul,ol,li,table,figure,img)]:my-0 [&_:is(p,li)]:text-base [&_:is(p,li)]:leading-7 [&_:is(p,li)]:text-foreground [&_code]:box-decoration-clone [&_code]:rounded [&_code]:border-0 [&_code]:bg-black/[0.045] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.875em] [&_code]:font-medium [&_code]:text-primary [&_code]:before:content-none [&_code]:after:content-none [&_blockquote]:my-0 [&_blockquote]:border-0 [&_blockquote]:pl-0 [&_blockquote]:font-normal [&_blockquote]:not-italic [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none";
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

/**
 * A quiet yes or no beside a cell's own wording. The icon is cap height and
 * centred on the first line; its label is an attribute, so Markdown keeps the text alone.
 */
function MarkedCell({ mark, children }: { mark?: "yes" | "no"; children: ReactNode }) {
  if (!mark) return children;
  const Icon = mark === "yes" ? Check : Minus;
  return (
    <span className="flex gap-2">
      <span
        role="img"
        aria-label={mark === "yes" ? "Yes" : "No"}
        className={`flex h-6 shrink-0 items-center ${mark === "yes" ? "text-emerald-700/55" : "text-black/30"}`}
      >
        <Icon className="size-2.5" strokeWidth={3} aria-hidden />
      </span>
      <span>{children}</span>
    </span>
  );
}

/**
 * The site does not build the eclipse tokens these components use
 * (`rounded-square`, `border-stroke-neutral`, `type-text-sm-strong`, the active
 * tab bar), so the same values are set with site utilities.
 */
const CODE_TABS = "my-0 rounded-[0.625rem] border-black/[0.08] bg-white";
const CODE_TAB_LIST = "flex flex-row overflow-x-auto px-2";
const CODE_TAB =
  "relative inline-flex items-center px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:text-primary data-[state=active]:[&>div]:bg-primary";
const CODE_BLOCK =
  "my-0 rounded-none border-black/[0.08] bg-white [&>div]:py-3.5 [&_button]:text-muted-foreground";

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
      { label: "Relations recipe", href: "https://kysely.dev/docs/recipes/relations" },
      { label: "MIT license", href: "https://github.com/kysely-org/kysely/blob/master/LICENSE" },
    ],
  },
  {
    product: "Prisma ORM and Prisma Postgres",
    links: [
      { label: "Prisma ORM docs", href: "/docs/orm" },
      { label: "Supported databases", href: "/docs/orm/supported-databases" },
      { label: "ORM client reference", href: "/docs/orm/reference/orm-client" },
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
      <div className="flex flex-col gap-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 !text-sm !leading-6 !text-muted-foreground">
          <img
            src={KYSELY_AUTHOR.image}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full bg-neutral-100 object-cover"
          />
          <span className="flex flex-col max-sm:leading-5 sm:flex-row sm:items-center sm:gap-x-3">
            <span>
              By{" "}
              <a
                href={KYSELY_AUTHOR.path}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {KYSELY_AUTHOR.name}
              </a>
            </span>{" "}
            <span className="hidden text-black/25 sm:inline">·</span>{" "}
            <span>
              Updated <time dateTime={KYSELY_UPDATED.iso}>{KYSELY_UPDATED.label}</time>
            </span>
          </span>
        </p>
        <aside
          aria-label="Disclosure"
          className="flex gap-2.5 rounded-xl border border-black/[0.08] bg-neutral-50 px-4 py-3"
        >
          <Info className="mt-1 size-4 shrink-0 text-black/35" aria-hidden />
          <p className="!text-sm !leading-6 !text-muted-foreground">
            Prisma makes Prisma ORM. Every Kysely figure links to its{" "}
            <a href="#sources" className={QUIET_LINK}>
              source
            </a>{" "}
            at the bottom of the page.
          </p>
        </aside>
      </div>
      <section className={SECTION}>
        <AnchorHeading level={2} id="choose">
          When should I choose Prisma ORM or Kysely
        </AnchorHeading>
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
        <AnchorHeading level={2} id="same-query">
          The same query in both
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Each snippet reads one user by email with their posts: Kysely nests the posts with its{" "}
          <code>jsonArrayFrom</code> helper, and Prisma ORM loads them with <code>include</code>.
        </p>
        <CodeBlockTabs defaultValue="kysely" className={CODE_TABS}>
          <CodeBlockTabsList className={CODE_TAB_LIST}>
            <CodeBlockTabsTrigger value="kysely" className={CODE_TAB}>
              Kysely
            </CodeBlockTabsTrigger>
            <CodeBlockTabsTrigger value="prisma" className={CODE_TAB}>
              Prisma ORM
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>
          {(["kysely", "prisma"] as const).map((tool) => (
            <CodeBlockTab
              key={tool}
              value={tool}
              forceMount
              className="data-[state=inactive]:hidden"
            >
              <CodeBlock className={CODE_BLOCK}>{highlight(SAME_QUERY[tool])}</CodeBlock>
            </CodeBlockTab>
          ))}
        </CodeBlockTabs>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="feature-table">
          What each one supports
        </AnchorHeading>
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
                  <td className={TD}>
                    <MarkedCell mark={row.marks?.kysely}>{renderFaqAnswer(row.kysely)}</MarkedCell>
                  </td>
                  <td className={TD}>
                    <MarkedCell mark={row.marks?.prisma}>{renderFaqAnswer(row.prisma)}</MarkedCell>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="where-kysely">
          Where Kysely works well
        </AnchorHeading>
        <p className="max-w-[68ch]">
          The Kysely{" "}
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
        <AnchorHeading level={2} id="where-prisma">
          Where Prisma ORM fits better
        </AnchorHeading>
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
        <AnchorHeading level={2} id="apart">
          What sets Prisma ORM apart
        </AnchorHeading>
        <div className={GROUPS}>
          {APART.map((item) => (
            <div key={item.title} className={GROUP}>
              <AnchorHeading level={3} className="text-lg leading-snug" id={item.id}>
                {item.title}
              </AnchorHeading>
              <p className="max-w-[68ch]">{renderFaqAnswer(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="pricing">
          Pricing
        </AnchorHeading>
        <div className={GROUPS}>
          <div className={GROUP}>
            <AnchorHeading level={3} className="text-lg leading-snug" id="pricing-kysely">
              Kysely
            </AnchorHeading>
            <p className="max-w-[68ch]">
              The library is free under the{" "}
              <a href="https://github.com/kysely-org/kysely/blob/master/LICENSE" className={INLINE}>
                MIT license
              </a>
              . There is no Kysely hosting plan: you bring the database.
            </p>
          </div>
          <div className={GROUP}>
            <AnchorHeading level={3} className="text-lg leading-snug" id="pricing-prisma">
              Prisma ORM and Prisma Postgres
            </AnchorHeading>
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
        <AnchorHeading level={2} id="wrong-choice">
          When Prisma ORM is the wrong choice
        </AnchorHeading>
        <ul className={LIST}>
          {WRONG_CHOICE.map((item) => (
            <li key={item}>{renderFaqAnswer(item)}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate">
          Move from Kysely to Prisma ORM
        </AnchorHeading>
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
        <AnchorHeading level={2} id="migrate-back">
          Move from Prisma ORM to Kysely
        </AnchorHeading>
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
        <AnchorHeading level={2} id="proof">
          What teams on Prisma say
        </AnchorHeading>
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
        <AnchorHeading level={2} id="faq">
          Frequently asked questions
        </AnchorHeading>
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
