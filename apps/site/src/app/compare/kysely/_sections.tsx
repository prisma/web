import Link from "next/link";
import { Info } from "lucide-react";
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
import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import { AnchorHeading } from "../anchor-heading";
import { CompareArticle, comparisonClosingCta, comparisonHeroCtas } from "../article";
import { CompareTable } from "../compare-table";
import { ComparisonPricingTable } from "../pricing-table";
import { QUIET_LINK, QUIET_NOTE } from "../table-styles";
import { highlight, lineGroupMap } from "./highlight";
import { SameQueryHighlight } from "./same-query";
import { renderFaqAnswer } from "@/lib/faq-answer";
import {
  APART,
  CHECKED,
  CHOOSE_KYSELY,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  FAQ,
  KYSELY_AUTHOR,
  KYSELY_TITLE,
  KYSELY_UPDATED,
  PRICING,
  SAME_QUERY,
  SAME_QUERY_LINE_GROUPS,
  SWITCH_COMMANDS,
  SWITCH_KYSELY_TYPES,
  SWITCH_PRISMA_CONTRACT,
  WRONG_CHOICE,
  DATABASE_MATRIX,
  type DatabaseStatus,
  FULL_SUPPORT,
  SAME_JOB,
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

/**
 * Full support reads as body text; preview and ORM 7 labels are muted; No is
 * no support. Called as a function so the Markdown walker sees the elements.
 */
function databaseStatus(status: DatabaseStatus) {
  if (status === null) {
    return <span className="text-muted-foreground">No</span>;
  }
  return (
    <span className={FULL_SUPPORT.includes(status) ? undefined : "text-muted-foreground"}>
      {status}
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
  "relative inline-flex min-h-11 items-center px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:text-primary data-[state=active]:[&>div]:bg-primary";
const CODE_BLOCK =
  "my-0 rounded-none border-black/[0.08] bg-white [&>div]:py-3.5 [&_.line]:pr-12 [&_button]:relative [&_button]:text-muted-foreground [&_button]:after:absolute [&_button]:after:-inset-2.5 [&_button]:after:content-['']";

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
      { label: "Dialects", href: "https://kysely.dev/docs/dialects" },
      { label: "Generating types", href: "https://kysely.dev/docs/generating-types" },
      { label: "Migrations", href: "https://kysely.dev/docs/migrations" },
      {
        label: "Splitting query building and execution",
        href: "https://kysely.dev/docs/recipes/splitting-query-building-and-execution",
      },
      { label: "kysely-ctl", href: "https://github.com/kysely-org/kysely-ctl" },
      { label: "kysely-codegen", href: "https://github.com/RobinBlomberg/kysely-codegen" },
      { label: "Relations recipe", href: "https://kysely.dev/docs/recipes/relations" },
      { label: "MIT license", href: "https://github.com/kysely-org/kysely/blob/master/LICENSE" },
    ],
  },
  {
    product: "Prisma ORM and Prisma Postgres",
    links: [
      { label: "Prisma ORM docs", href: "/docs/orm" },
      { label: "Supported databases", href: "/docs/orm/supported-databases" },
      {
        label: "Prisma ORM 7 supported databases",
        href: "/docs/orm/v7/reference/supported-databases",
      },
      { label: "contract emit", href: "/docs/cli/contract-emit" },
      { label: "contract infer", href: "/docs/cli/contract-infer" },
      { label: "migration plan", href: "/docs/cli/migration-plan" },
      { label: "migration show", href: "/docs/cli/migration-show" },
      { label: "db migrate", href: "/docs/cli/db-migrate" },
      { label: "ORM client reference", href: "/docs/orm/reference/orm-client" },
      { label: "How migrations work", href: "/docs/orm/migrations/how-migrations-work" },
      { label: "SQL query builder", href: "/docs/orm/reference/sql-query-builder" },
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
export function getKyselyPageContent() {
  const kyselyGroups = lineGroupMap(SAME_QUERY_LINE_GROUPS, "kysely");
  const prismaGroups = lineGroupMap(SAME_QUERY_LINE_GROUPS, "prisma");
  const sqlGroups = lineGroupMap(SAME_QUERY_LINE_GROUPS, "sql");

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
      {comparisonHeroCtas("orm")}
      <p className="mt-8 flex items-center gap-3 text-sm leading-5 text-muted-foreground">
        <img
          src={KYSELY_AUTHOR.image}
          alt=""
          width={28}
          height={28}
          className="size-7 shrink-0 rounded-full bg-neutral-200 object-cover"
        />
        <span className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2">
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
        className="mt-3 flex gap-2.5 rounded-xl border border-black/[0.08] bg-neutral-50 px-4 py-3"
      >
        <Info className="mt-1 size-4 shrink-0 text-black/35" aria-hidden />
        <p className="max-w-[32rem] text-sm leading-6 text-muted-foreground">
          Prisma makes Prisma ORM. Kysely figures come from the pages listed under{" "}
          <a href="#sources" className={QUIET_LINK}>
            Sources
          </a>
          , checked {CHECKED}.
        </p>
      </aside>
    </div>,
    <div key="body" className={BODY}>
      <section className={SECTION}>
        <AnchorHeading level={2} id="choose">
          When should I choose Kysely or Prisma ORM?
        </AnchorHeading>
        <p className="max-w-[36rem]">
          A contract is the <code>contract.prisma</code> file that describes your models. A dialect
          is Kysely&apos;s adapter for one database. <code>db sign</code> records that your
          database already matches the contract. Reasons are independent lists, in alphabetical
          order by product.
        </p>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Kysely</h3>
            <ul className={LIST}>
              {CHOOSE_KYSELY.map((item) => (
                <li key={item}>{renderFaqAnswer(item)}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Prisma ORM</h3>
            <ul className={LIST}>
              {CHOOSE_PRISMA.map((item) => (
                <li key={item}>{renderFaqAnswer(item)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="same-query">
          What does the same query look like in each?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Each snippet reads one user by email with their posts: Kysely nests the posts with its{" "}
          <code>jsonArrayFrom</code> helper, and Prisma ORM loads them with <code>include</code>.
          The SQL tab is representative of the statements both send, not captured from a live run.
        </p>
        <SameQueryHighlight>
          <CodeBlockTabs defaultValue="kysely" className={CODE_TABS}>
            <CodeBlockTabsList aria-label="Code example" className={CODE_TAB_LIST}>
              <CodeBlockTabsTrigger value="kysely" className={CODE_TAB}>
                Kysely
              </CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="prisma" className={CODE_TAB}>
                Prisma ORM
              </CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="sql" className={CODE_TAB}>
                SQL sent
              </CodeBlockTabsTrigger>
            </CodeBlockTabsList>
            <CodeBlockTab value="kysely" forceMount className="data-[state=inactive]:hidden">
              <CodeBlock className={CODE_BLOCK}>
                {highlight(SAME_QUERY.kysely, "typescript", kyselyGroups)}
              </CodeBlock>
            </CodeBlockTab>
            <CodeBlockTab value="prisma" forceMount className="data-[state=inactive]:hidden">
              <CodeBlock className={CODE_BLOCK}>
                {highlight(SAME_QUERY.prisma, "typescript", prismaGroups)}
              </CodeBlock>
            </CodeBlockTab>
            <CodeBlockTab value="sql" forceMount className="data-[state=inactive]:hidden">
              <CodeBlock className={CODE_BLOCK}>
                {highlight(SAME_QUERY.sql, "sql", sqlGroups)}
              </CodeBlock>
            </CodeBlockTab>
          </CodeBlockTabs>
        </SameQueryHighlight>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="feature-table">
          How do Prisma ORM and Kysely compare feature by feature?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Kysely is a SQL query builder. Prisma ORM is a contract-based ORM that also includes a SQL
          query builder on PostgreSQL and SQLite. Columns are in alphabetical order.
        </p>
        <CompareTable
          labelledBy="feature-table"
          corner="Feature"
          columns={["Kysely", "Prisma ORM"]}
          minWidth="40rem"
          rows={COMPARE_ROWS.map((row) => ({
            label: row.feature,
            cells: [renderFaqAnswer(row.kysely), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="databases">
          Which databases do Prisma ORM and Kysely support?
        </AnchorHeading>
        <p>
          Kysely&apos;s dialects next to the two Prisma ORM lines. Prisma ORM 7 is the generally
          available release, and it supports every database here except PGlite. No means no support.
        </p>
        <CompareTable
          labelledBy="databases"
          corner="Database"
          columns={["Kysely", "Prisma ORM 8", "Prisma ORM 7"]}
          minWidth="34rem"
          rows={DATABASE_MATRIX.map((row) => ({
            label: row.database,
            cells: [
              databaseStatus(row.kysely),
              databaseStatus(row.orm8),
              databaseStatus(row.orm7),
            ],
          }))}
        />
        <p className={QUIET_NOTE}>
          MariaDB on Kysely is the community{" "}
          <a href="https://github.com/awaludinar/kysely-mariadb" className={QUIET_LINK}>
            kysely-mariadb
          </a>{" "}
          dialect. Sources:{" "}
          <a href="https://kysely.dev/docs/dialects" className={QUIET_LINK}>
            Kysely dialects
          </a>
          ,{" "}
          <Link href="/docs/orm/supported-databases" className={QUIET_LINK}>
            Prisma ORM 8 supported databases
          </Link>
          , and{" "}
          <Link href="/docs/orm/v7/reference/supported-databases" className={QUIET_LINK}>
            Prisma ORM 7 supported databases
          </Link>
          , {CHECKED}.
        </p>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="apart">
          {"What does Prisma ORM do that Kysely doesn't?"}
        </AnchorHeading>
        <div className="grid gap-8 sm:grid-cols-2">
          {APART.map((item) => (
            <div key={item.title} className="border-t border-black/[0.08] pt-5">
              <AnchorHeading level={3} id={item.id} className="text-base leading-snug font-semibold">
                {item.title}
              </AnchorHeading>
              <p className="mt-2">{renderFaqAnswer(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="pricing">
          How much do Prisma ORM and Kysely cost?
        </AnchorHeading>
        <ComparisonPricingTable
          labelledBy="pricing"
          corner="Cost"
          columns={[
            { label: "Kysely", id: "pricing-kysely" },
            { label: "Prisma ORM", id: "pricing-prisma" },
          ]}
          rows={PRICING.map((row) => ({
            label: row.label,
            cells: [renderFaqAnswer(row.kysely), renderFaqAnswer(row.prisma)],
          }))}
          note={
            <>
              Prisma Postgres has a Free plan: $0 a month for 200,000 operations, 2 GB of storage,
              and 50 databases. The{" "}
              <Link href="/pricing" className={QUIET_LINK}>
                pricing page
              </Link>{" "}
              lists the paid plans.
            </>
          }
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="wrong-choice">
          When is Prisma ORM the wrong choice?
        </AnchorHeading>
        <ul className={LIST}>
          {WRONG_CHOICE.map((item) => (
            <li key={item}>{renderFaqAnswer(item)}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="same-job">
          How does each task look in Kysely and Prisma ORM?
        </AnchorHeading>
        <p>
          What each step of the usual workflow looks like on each side, for a team moving in either
          direction.
        </p>
        <CompareTable
          labelledBy="same-job"
          corner="Task"
          columns={["Kysely", "Prisma ORM"]}
          minWidth="40rem"
          rows={SAME_JOB.map((row) => ({
            label: row.task,
            cells: [renderFaqAnswer(row.kysely), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate">
          How do I switch from Kysely to Prisma ORM?
        </AnchorHeading>
        <p>
          For PostgreSQL, these four commands from the{" "}
          <Link href="/docs/prisma-orm/add-to-existing-project/postgresql" className={INLINE}>
            existing-database guide
          </Link>{" "}
          add Prisma ORM beside the tables you already have. The Node.js versions that guide
          expects still apply. Signing records that the database already matches the contract, so
          the first <code>migration plan</code> starts from your tables instead of an empty
          database. The rows stay where they are.
        </p>
        <p>Representative types for the User and Post tables in the query above, then the four commands.</p>
        <CodeBlockTabs defaultValue="kysely-types" className={CODE_TABS}>
          <CodeBlockTabsList aria-label="Switching types" className={CODE_TAB_LIST}>
            <CodeBlockTabsTrigger value="kysely-types" className={CODE_TAB}>
              Kysely types
            </CodeBlockTabsTrigger>
            <CodeBlockTabsTrigger value="contract" className={CODE_TAB}>
              contract.prisma
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>
          <CodeBlockTab value="kysely-types" forceMount className="data-[state=inactive]:hidden">
            <CodeBlock className={CODE_BLOCK}>{highlight(SWITCH_KYSELY_TYPES)}</CodeBlock>
          </CodeBlockTab>
          <CodeBlockTab value="contract" forceMount className="data-[state=inactive]:hidden">
            <CodeBlock className={CODE_BLOCK}>
              {highlight(SWITCH_PRISMA_CONTRACT, "prisma")}
            </CodeBlock>
          </CodeBlockTab>
        </CodeBlockTabs>
        <CodeBlock className={CODE_BLOCK}>{highlight(SWITCH_COMMANDS, "bash")}</CodeBlock>
        <ol className={STEPS}>
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
          How do I switch from Prisma ORM to Kysely?
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
          What do teams say about Prisma ORM?
        </AnchorHeading>
        <p className="max-w-[68ch]">Two teams on what type safety in Prisma ORM does for them.</p>
        <div className="grid gap-8 sm:grid-cols-2">
          {PROOF.map((item) => (
            <figure key={item.name} className="flex flex-col gap-5">
              <img
                src={LOGOS[item.company].src}
                alt=""
                width={LOGOS[item.company].width}
                height={20}
                className="h-5 w-auto self-start"
              />
              <blockquote className="max-w-[34rem] text-pretty text-lg leading-8 text-primary">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">{item.name}</span>, {item.role},{" "}
                {item.company}
              </figcaption>
            </figure>
          ))}
        </div>
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
              <AccordionContent className="max-w-[36rem] text-base leading-7 text-foreground">
                {renderFaqAnswer(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>,
    comparisonClosingCta("orm"),
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

/** Render the comparison in the guide article frame. */
export function KyselyPage() {
  return <CompareArticle slug="kysely">{getKyselyPageContent()}</CompareArticle>;
}
