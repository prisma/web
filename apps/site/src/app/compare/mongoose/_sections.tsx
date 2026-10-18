import Link from "next/link";
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
import { comparisonByline } from "../byline";
import { articleReadingStats } from "../reading-time";
import { CompareTable } from "../compare-table";
import { ComparisonPricingTable } from "../pricing-table";
import { QUIET_LINK, QUIET_NOTE } from "../table-styles";
import { highlight, lineGroupMap } from "../kysely/highlight";
import { SameQueryHighlight } from "../kysely/same-query";
import { TabCodeCopy } from "../tab-code-copy";
import { renderFaqAnswer } from "@/lib/faq-answer";
import {
  APART,
  CHECKED,
  CHOOSE_MONGOOSE,
  CHOOSE_PRISMA,
  COMPARE_ROWS,
  FAQ,
  MONGOOSE_AUTHOR,
  MONGOOSE_TITLE,
  MONGOOSE_UPDATED,
  PRICING,
  SAME_QUERY,
  SAME_QUERY_LINE_GROUPS,
  SWITCH_COMMANDS,
  SWITCH_MONGOOSE_SCHEMA,
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
const CODE_TABS = "my-0 overflow-hidden rounded-[0.625rem] border border-border bg-white";
const CODE_TAB_LIST = "flex min-w-0 flex-1 flex-row overflow-x-auto px-2";
const CODE_TAB =
  "relative inline-flex min-h-11 items-center px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:text-primary data-[state=active]:[&>div]:bg-primary";
const CODE_BLOCK = "not-fumadocs-codeblock my-0 rounded-none border-0 bg-white [&>div]:py-3.5";
const CODE_BLOCK_WITH_COPY = `${CODE_BLOCK} rounded-[0.625rem] border border-border [&>[role=region]]:mr-11 [&_button]:relative [&_button]:text-muted-foreground [&_button]:after:absolute [&_button]:after:-inset-2.5 [&_button]:after:content-['']`;

const PROOF = TESTIMONIALS.filter(
  (item) => item.name === "Ron Cohen" || item.name === "Omar López",
);

const LOGOS: Record<string, { src: string; width: number }> = {
  Bucket: { src: "/logos/customers/bucket.png", width: 108 },
  "Cal.com": { src: "/logos/companies/cal.svg", width: 96 },
};

const SOURCES = [
  {
    product: "Mongoose",
    links: [
      { label: "Getting started", href: "https://mongoosejs.com/docs/" },
      { label: "mongoose on npm", href: "https://www.npmjs.com/package/mongoose" },
      { label: "Populate", href: "https://mongoosejs.com/docs/populate.html" },
      { label: "Middleware", href: "https://mongoosejs.com/docs/middleware.html" },
      { label: "README", href: "https://github.com/Automattic/mongoose/blob/master/README.md" },
      {
        label: "MIT license",
        href: "https://github.com/Automattic/mongoose/blob/master/LICENSE.md",
      },
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
      {
        label: "Migrate from Mongoose",
        href: "/docs/guides/switch-to-prisma-orm/from-mongoose",
      },
      {
        label: "Prisma ORM 7 migrate from Mongoose",
        href: "/docs/guides/v7/switch-to-prisma-orm/from-mongoose",
      },
      { label: "contract emit", href: "/docs/cli/contract-emit" },
      { label: "migration plan", href: "/docs/cli/migration-plan" },
      { label: "db migrate", href: "/docs/cli/db-migrate" },
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
function buildMongoosePage(minutes: number) {
  const mongooseGroups = lineGroupMap(SAME_QUERY_LINE_GROUPS, "mongoose");
  const prismaGroups = lineGroupMap(SAME_QUERY_LINE_GROUPS, "prisma");
  const mongoGroups = lineGroupMap(SAME_QUERY_LINE_GROUPS, "mongo");

  return [
    <div key="intro" className="max-w-3xl">
      <h1 className="text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
        {MONGOOSE_TITLE}
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground">
        Both give you typed MongoDB access in TypeScript, from opposite ends.{" "}
        <Link href="/docs/orm" className={INLINE}>
          Prisma ORM
        </Link>{" "}
        starts from a contract file: you describe your collections once, and typed queries and
        migrations follow from it.{" "}
        <a href="https://mongoosejs.com" className={INLINE}>
          Mongoose
        </a>{" "}
        starts from a Schema in application code: you compile it with <code>mongoose.model</code>{" "}
        and query with <code>find()</code> and <code>populate()</code>.
      </p>
      {comparisonHeroCtas("orm")}
      {comparisonByline({ author: MONGOOSE_AUTHOR, updated: MONGOOSE_UPDATED, minutes })}
      <p className="mt-3 max-w-[32rem] text-sm leading-6 text-muted-foreground">
        Prisma makes Prisma ORM. Mongoose figures come from the pages listed under{" "}
        <a href="#sources" className={QUIET_LINK}>
          Sources
        </a>
        , checked {CHECKED}.
      </p>
    </div>,
    <div key="body" className={BODY}>
      <section className={SECTION}>
        <AnchorHeading level={2} id="choose">
          When should I choose Mongoose or Prisma ORM?
        </AnchorHeading>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className={CHOOSE_LABEL}>Mongoose</h3>
            <ul className={LIST}>
              {CHOOSE_MONGOOSE.map((item) => (
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
          Each snippet reads published posts with their authors: Mongoose attaches the authors with{" "}
          <code>populate(&quot;author&quot;)</code>, and Prisma ORM loads them with{" "}
          <code>include(&quot;author&quot;)</code>. The MongoDB tab is representative of the
          commands both send, not captured from a live run.
        </p>
        <SameQueryHighlight>
          <CodeBlockTabs defaultValue="mongoose" className={CODE_TABS}>
            <div className="flex items-center">
              <CodeBlockTabsList aria-label="Code example" className={CODE_TAB_LIST}>
                <CodeBlockTabsTrigger value="mongoose" className={CODE_TAB}>
                  Mongoose
                </CodeBlockTabsTrigger>
                <CodeBlockTabsTrigger value="prisma" className={CODE_TAB}>
                  Prisma ORM
                </CodeBlockTabsTrigger>
                <CodeBlockTabsTrigger value="mongo" className={CODE_TAB}>
                  MongoDB sent
                </CodeBlockTabsTrigger>
              </CodeBlockTabsList>
              <TabCodeCopy label="Copy the open example" />
            </div>
            <CodeBlockTab value="mongoose">
              <CodeBlock allowCopy={false} className={CODE_BLOCK}>
                {highlight(SAME_QUERY.mongoose, "typescript", mongooseGroups)}
              </CodeBlock>
            </CodeBlockTab>
            <CodeBlockTab value="prisma">
              <CodeBlock allowCopy={false} className={CODE_BLOCK}>
                {highlight(SAME_QUERY.prisma, "typescript", prismaGroups)}
              </CodeBlock>
            </CodeBlockTab>
            <CodeBlockTab value="mongo">
              <CodeBlock allowCopy={false} className={CODE_BLOCK}>
                {highlight(SAME_QUERY.mongo, "typescript", mongoGroups)}
              </CodeBlock>
            </CodeBlockTab>
          </CodeBlockTabs>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-6 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm bg-prism-cyan-100 ring-1 ring-prism-cyan-400"
                aria-hidden
              />
              author include
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm bg-prism-yellow-100 ring-1 ring-prism-yellow-400"
                aria-hidden
              />
              published filter
            </span>
            <span>Tinted lines match across the open tab. Hover one to emphasize its pair.</span>
          </p>
        </SameQueryHighlight>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="feature-table">
          How do Prisma ORM and Mongoose compare feature by feature?
        </AnchorHeading>
        <p className="max-w-[68ch]">
          Mongoose models MongoDB documents in application code. Prisma ORM is a contract-based ORM.
          On MongoDB the PostgreSQL APIs (SQL query builder, relation filters) are absent. Columns
          are in alphabetical order.
        </p>
        <CompareTable
          labelledBy="feature-table"
          corner="Feature"
          columns={["Mongoose", "Prisma ORM"]}
          minWidth="40rem"
          rows={COMPARE_ROWS.map((row) => ({
            label: row.feature,
            cells: [renderFaqAnswer(row.mongoose), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="databases">
          Which databases do Prisma ORM and Mongoose support?
        </AnchorHeading>
        <p>
          Mongoose&apos;s MongoDB support next to the two Prisma ORM lines. Prisma ORM 7 is the
          generally available release. No means no support.
        </p>
        <CompareTable
          labelledBy="databases"
          corner="Database"
          columns={["Mongoose", "Prisma ORM 8", "Prisma ORM 7"]}
          minWidth="34rem"
          rows={DATABASE_MATRIX.map((row) => ({
            label: row.database,
            cells: [
              databaseStatus(row.mongoose),
              databaseStatus(row.orm8),
              databaseStatus(row.orm7),
            ],
          }))}
        />
        <p className={QUIET_NOTE}>
          MongoDB on Prisma ORM 7 is listed as supported on the ORM 7 databases page. The ORM 7{" "}
          <Link href="/docs/guides/v7/switch-to-prisma-orm/from-mongoose" className={QUIET_LINK}>
            migrate-from-Mongoose guide
          </Link>{" "}
          says Prisma ORM 7 has no MongoDB connector yet, and to stay on 6.19 until it ships. This
          table follows that guide for MongoDB. Sources:{" "}
          <a
            href="https://github.com/Automattic/mongoose/blob/master/README.md"
            className={QUIET_LINK}
          >
            Mongoose README
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
          {"What does Prisma ORM do that Mongoose doesn't?"}
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
          How much do Prisma ORM and Mongoose cost?
        </AnchorHeading>
        <ComparisonPricingTable
          labelledBy="pricing"
          corner="Cost"
          columns={[
            { label: "Mongoose", id: "pricing-mongoose" },
            { label: "Prisma ORM", id: "pricing-prisma" },
          ]}
          rows={PRICING.map((row) => ({
            label: row.label,
            cells: [renderFaqAnswer(row.mongoose), renderFaqAnswer(row.prisma)],
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
          How does each task look in Mongoose and Prisma ORM?
        </AnchorHeading>
        <p>
          What each step of the usual workflow looks like on each side, for a team moving in either
          direction.
        </p>
        <CompareTable
          labelledBy="same-job"
          corner="Task"
          columns={["Mongoose", "Prisma ORM"]}
          minWidth="40rem"
          rows={SAME_JOB.map((row) => ({
            label: row.task,
            cells: [renderFaqAnswer(row.mongoose), renderFaqAnswer(row.prisma)],
          }))}
        />
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate">
          How do I switch from Mongoose to Prisma ORM?
        </AnchorHeading>
        <p>
          The{" "}
          <Link href="/docs/guides/switch-to-prisma-orm/from-mongoose" className={INLINE}>
            migrate-from-Mongoose guide
          </Link>{" "}
          adds Prisma ORM beside the collections you already have.{" "}
          <code>orm init --target mongodb</code> writes the Prisma files.{" "}
          <code>contract infer</code> does not read a MongoDB database, so you write{" "}
          <code>contract.prisma</code> from the Mongoose schemas, then <code>contract emit</code>{" "}
          writes the types. The documents stay where they are.
        </p>
        <p>
          Representative models for the User and Post collections in the query above, then the two
          commands.
        </p>
        <CodeBlockTabs defaultValue="mongoose-schema" className={CODE_TABS}>
          <div className="flex items-center">
            <CodeBlockTabsList aria-label="Switching types" className={CODE_TAB_LIST}>
              <CodeBlockTabsTrigger value="mongoose-schema" className={CODE_TAB}>
                Mongoose schema
              </CodeBlockTabsTrigger>
              <CodeBlockTabsTrigger value="contract" className={CODE_TAB}>
                contract.prisma
              </CodeBlockTabsTrigger>
            </CodeBlockTabsList>
            <TabCodeCopy label="Copy the open types" />
          </div>
          <CodeBlockTab value="mongoose-schema">
            <CodeBlock allowCopy={false} className={CODE_BLOCK}>
              {highlight(SWITCH_MONGOOSE_SCHEMA)}
            </CodeBlock>
          </CodeBlockTab>
          <CodeBlockTab value="contract">
            <CodeBlock allowCopy={false} className={CODE_BLOCK}>
              {highlight(SWITCH_PRISMA_CONTRACT, "prisma")}
            </CodeBlock>
          </CodeBlockTab>
        </CodeBlockTabs>
        <CodeBlock className={CODE_BLOCK_WITH_COPY}>{highlight(SWITCH_COMMANDS, "bash")}</CodeBlock>
        <ol className={STEPS}>
          <li>
            Later changes go through{" "}
            <Link href="/docs/orm/migrations/generating-a-migration" className={INLINE}>
              contract emit and migration plan
            </Link>
            . On MongoDB you still write the contract by hand.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <AnchorHeading level={2} id="migrate-back">
          How do I switch from Prisma ORM to Mongoose?
        </AnchorHeading>
        <ol className={STEPS}>
          <li>Keep the MongoDB database and the connection string.</li>
          <li>
            Define a <code>Schema</code> and compile it with <code>mongoose.model</code> for each
            collection. The{" "}
            <a href="https://mongoosejs.com/docs/" className={INLINE}>
              getting started guide
            </a>{" "}
            is that path.
          </li>
          <li>
            Use <code>populate()</code> on stored ids. Prisma ORM&apos;s <code>include()</code> on
            MongoDB covers a single <code>@relation</code>; an array of ids uses <code>lookup</code>{" "}
            in the pipeline builder.
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

const MONGOOSE_READING = articleReadingStats(buildMongoosePage(1));

export function getMongooseReadingStats() {
  return articleReadingStats(buildMongoosePage(MONGOOSE_READING.minutes));
}

/** Build the shared content tree for the HTML page and its Markdown rendition. */
export function getMongoosePageContent() {
  return buildMongoosePage(MONGOOSE_READING.minutes);
}

/** Render the comparison in the guide article frame. */
export function MongoosePage() {
  return <CompareArticle slug="mongoose">{getMongoosePageContent()}</CompareArticle>;
}
