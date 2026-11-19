import { createPageMetadata } from "@/lib/page-metadata";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { ArrowRight, CheckBold } from "@/components/icons/forma";
import { Faq } from "@/components/sections/faq";
import {
  createFaqStructuredData,
  createSoftwareApplicationStructuredData,
} from "@/lib/structured-data";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { cn } from "@/lib/utils";
import { CopyCommand } from "./_components/copy-command";
import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  CONSOLE_URL,
  FEATURE_ROWS,
  OPEN_STUDIO_WAYS,
  STACK_FIT,
  STUDIO_DEFINITION,
  STUDIO_DOCS_URL,
  STUDIO_EMBED_DEMO_URL,
  STUDIO_FAQ,
  STUDIO_PORT,
  STUDIO_SUBHEADLINE,
  SUPPORTED_DATABASES,
  TRY_STUDIO_COMMAND,
} from "./studio-content";

// Rebuilt in the November 2026 SEO pass: the old page ranked only for the
// brand term "prisma studio" and clicks were down 22 percent in 30 days. The
// new structure answers the search terms Studio never ranked for ("postgres
// gui", "visual database editor", "what is prisma studio", "npx prisma
// studio", "view and edit postgres data online"), on the new Prisma brand
// (prism stripes, yellow / cyan / red accents, paper surfaces, hairline
// borders). Design language carries over from the other product pages
// (/postgres, /compute, /orm): wrapped-panel hero, RoleKicker, PrismButton,
// Texture. The dark product mockups sit in ink frames like the old page; a
// claim in the PR description asks whether to replace them with real
// November 2026 screenshots.

const studioStructuredData = createSoftwareApplicationStructuredData({
  path: "/studio",
  name: "Prisma Studio",
  description:
    "Prisma Studio is a free visual database editor and Postgres GUI. Run `npx prisma studio` to view and edit PostgreSQL, MySQL and SQLite data in a spreadsheet-like interface, locally, in VS Code or in the Prisma Console. Works with or without Prisma ORM.",
  image: "/illustrations/studio/hero.svg",
});

const studioFaqStructuredData = createFaqStructuredData(
  "/studio",
  STUDIO_FAQ.map(({ question, answer }) => ({ question, answer })),
  "Prisma Studio FAQ",
);

export const metadata = createPageMetadata({
  title: "Prisma Studio | Free Postgres GUI to View and Edit Data",
  description:
    "Prisma Studio is a free Postgres GUI for viewing and editing database data. Open it locally with npx prisma studio, in VS Code, or in the Prisma Console. Works with PostgreSQL, MySQL and SQLite, with or without Prisma ORM.",
  path: "/studio",
  ogKicker: "Prisma Studio",
  ogAccent: "yellow",
});

/**
 * One cell in the comparison table. Prose stays short; longer context sits in
 * the surrounding paragraphs. `prisma` highlights the Prisma Studio column.
 */
function CompareCell({ text, prisma }: { text: React.ReactNode; prisma?: boolean }) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-top text-sm leading-6 text-foreground",
        prisma && "bg-prism-yellow-50/60 font-medium text-foreground",
      )}
    >
      {text}
    </td>
  );
}

/** Inline backtick -> <code> for the comparison copy. */
function renderInlineCode(text: string): React.ReactNode {
  if (!text.includes("`")) return text;
  const nodes: React.ReactNode[] = [];
  const parts = text.split(/(`[^`]+`)/g);
  parts.forEach((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={i}
          className="rounded bg-black/[0.045] px-1 py-0.5 font-mono text-[0.9em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part) {
      nodes.push(part);
    }
  });
  return <>{nodes}</>;
}

export default function StudioPage() {
  return (
    <>
      <JsonLd id="studio-software-application" data={studioStructuredData} />
      <JsonLd id="studio-faq" data={studioFaqStructuredData} />

      {/* Hero: wrapped-panel title band, yellow wash (one accent per page) */}
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[24rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background: [
                  "radial-gradient(50% 62% at 30% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 18%, transparent), transparent 70%)",
                  "radial-gradient(44% 54% at 56% 100%, color-mix(in srgb, var(--color-prism-yellow-100) 30%, transparent), transparent 68%)",
                  "radial-gradient(40% 48% at 78% 100%, color-mix(in srgb, var(--color-prism-yellow-400) 14%, transparent), transparent 70%)",
                ].join(","),
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />

          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-yellow-300" className="justify-center">
                Prisma Studio
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[22ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Prisma Studio: see and edit your database
              </h1>
              <p className="mt-6 max-w-[58ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                {STUDIO_SUBHEADLINE}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <PrismButton href={CONSOLE_URL} size="lg">
                  Open Studio in Prisma Console
                </PrismButton>
                <PrismButtonOutline href={STUDIO_DOCS_URL} size="lg">
                  Try locally with npx prisma studio
                </PrismButtonOutline>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Free. Works with PostgreSQL, MySQL and SQLite. No credit card.
              </p>

              {/* Dark product mockup in an ink frame — same treatment as the
                  old page while real November 2026 screenshots land. */}
              <div className="mt-14 w-full max-w-5xl rounded-2xl bg-[#151515] p-2 shadow-[0_16px_40px_-20px_rgba(21,21,21,0.35)] sm:p-3">
                <Image
                  src="/illustrations/studio/hero.svg"
                  alt="Prisma Studio showing a filterable table view of a PostgreSQL database with the schema sidebar on the left"
                  width={966}
                  height={270}
                  className="h-auto w-full rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Definition paragraph: a standalone, quotable answer directly under
          the hero, so featured snippets and AI answers can lift it whole. */}
      <section className="bg-white px-4 pt-14 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-balance text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
              What is Prisma Studio?
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground">
              {renderFaqAnswer(STUDIO_DEFINITION)}
            </p>
          </div>
        </div>
      </section>

      {/* Four surfaces: Local / VS Code / Console / Embedded. Card grid
          with accent top bars, same shape as the old /studio page. */}
      <section id="open-prisma-studio" className="bg-white px-4 pt-16 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-site">
          <div className="mx-auto max-w-2xl text-center">
            <RoleKicker color="bg-prism-yellow-300" className="justify-center">
              How to open Prisma Studio
            </RoleKicker>
            <h2 className="mt-3 text-balance text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.15]">
              Four ways to open Prisma Studio
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Use whichever surface fits where you are: your terminal, your editor, the Prisma
              Console, or inside your own app.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {OPEN_STUDIO_WAYS.map((way) => (
              <div
                key={way.title}
                className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
              >
                <span aria-hidden className={`absolute left-0 top-0 h-1 w-full ${way.accent}`} />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {way.eyebrow}
                </p>
                <h3 className="text-lg leading-snug text-foreground">
                  {renderInlineCode(way.title)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {renderFaqAnswer(way.description)}
                </p>
                <a
                  href={way.href}
                  className="group mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-yellow-700"
                >
                  {way.linkLabel}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try it out: ink terminal card with the one-liner for people who want
          to run Studio against a real database right now. */}
      <section className="bg-white px-4 pt-16 sm:px-8 sm:pt-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <div>
            <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
              Try `npx prisma studio` on port {STUDIO_PORT}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Take Studio for a spin with a pre-seeded local database and example project. The
              command bootstraps a Prisma project and opens Studio at{" "}
              <code className="rounded bg-black/[0.045] px-1 py-0.5 font-mono text-[0.9em]">
                http://localhost:{STUDIO_PORT}
              </code>
              .
            </p>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl bg-[#151515] p-6 text-left shadow-[0_16px_40px_-20px_rgba(21,21,21,0.4)] sm:p-7">
            <span aria-hidden className="absolute left-0 top-0 h-1 w-full bg-prism-yellow-300" />
            <CopyCommand text={TRY_STUDIO_COMMAND} />
            <pre className="overflow-x-auto pr-12 font-mono text-sm leading-7 text-[#f9faf5]">
              <code>{TRY_STUDIO_COMMAND}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Visual feature tour with screenshots: browse/filter, multiple tabs,
          embedded. Dark mockups sit in ink frames. */}
      <section className="bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-site flex-col gap-16 sm:gap-20">
          {FEATURE_ROWS.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
                index % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="max-w-[52ch]">
                <RoleKicker color="bg-prism-yellow-300">{feature.eyebrow}</RoleKicker>
                <h3 className="mt-3 text-balance text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {renderFaqAnswer(feature.description)}
                </p>
              </div>
              <div className="rounded-2xl bg-[#151515] p-2 shadow-[0_12px_32px_-18px_rgba(21,21,21,0.3)] sm:p-3">
                <Image
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  width={feature.imageWidth}
                  height={feature.imageHeight}
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported databases */}
      <section id="supported-databases" className="bg-white px-4 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-site">
          <div className="mx-auto max-w-2xl text-center">
            <RoleKicker color="bg-prism-yellow-300" className="justify-center">
              Databases
            </RoleKicker>
            <h2 className="mt-3 text-balance text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.15]">
              Which databases Prisma Studio works with
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Prisma Studio supports PostgreSQL, MySQL and SQLite across every surface: locally, in
              VS Code, in the Prisma Console (for Prisma Postgres) and through the embedded React
              component. CockroachDB and MongoDB are not supported yet.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {SUPPORTED_DATABASES.map((db) => (
              <div
                key={db.name}
                className="flex flex-col gap-2 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)]"
              >
                <div className="flex items-center gap-2">
                  <CheckBold className="size-4 shrink-0 text-prism-yellow-500" aria-hidden />
                  <h3 className="text-lg font-medium text-foreground">{db.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {renderFaqAnswer(db.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison with the GUIs Prisma Studio is searched alongside. The
          column for Prisma Studio is highlighted; the dedicated head-to-head
          comparison pages live under /compare. */}
      <section
        id="compare"
        className="bg-white px-4 pb-20 sm:px-8 sm:pb-24"
        aria-labelledby="studio-compare-heading"
      >
        <div className="mx-auto max-w-site">
          <div className="mx-auto max-w-2xl text-center">
            <RoleKicker color="bg-prism-yellow-300" className="justify-center">
              Compare
            </RoleKicker>
            <h2
              id="studio-compare-heading"
              className="mt-3 text-balance text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.15]"
            >
              Prisma Studio compared with pgAdmin, TablePlus, DBeaver and Drizzle Studio
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              A short, fair side-by-side with the Postgres and database GUIs people weigh against
              Prisma Studio. Each of these is a solid tool in its own right; pick the one whose
              strengths match how you work.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04)]">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/[0.06] bg-black/[0.02]">
                  <th
                    scope="col"
                    className="px-4 py-3 text-sm font-semibold leading-6 text-foreground"
                  >
                    Feature
                  </th>
                  {COMPARISON_COLUMNS.map((name) => (
                    <th
                      key={name}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-sm font-semibold leading-6 text-foreground",
                        name === "Prisma Studio" && "bg-prism-yellow-50/60",
                      )}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-t border-black/[0.06]">
                    <th
                      scope="row"
                      className="px-4 py-3 text-left align-top text-sm font-medium leading-6 text-foreground"
                    >
                      {row.feature}
                    </th>
                    <CompareCell text={renderInlineCode(row.prismaStudio.summary)} prisma />
                    <CompareCell text={renderInlineCode(row.pgadmin.summary)} />
                    <CompareCell text={renderInlineCode(row.tableplus.summary)} />
                    <CompareCell text={renderInlineCode(row.dbeaver.summary)} />
                    <CompareCell text={renderInlineCode(row.drizzleStudio.summary)} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Facts above checked against each tool's pricing or docs in November 2026. For a full
            side-by-side with one competitor, see the pages under{" "}
            <Link href="/compare" className="underline underline-offset-4 decoration-black/30">
              /compare
            </Link>
            .
          </p>
        </div>
      </section>

      {/* How Studio fits with the other Prisma products. Content directive:
          every product page tells the whole story across ORM, Postgres and
          Compute. */}
      <section id="prisma-stack" className="bg-white px-4 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-site">
          <div className="mx-auto max-w-2xl text-center">
            <RoleKicker color="bg-prism-yellow-300" className="justify-center">
              The Prisma stack
            </RoleKicker>
            <h2 className="mt-3 text-balance text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.15]">
              Prisma Studio across the Prisma stack
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Studio works on its own, with any of the three Prisma products, or with all of them at
              once. The more you use, the more Studio knows about your data.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STACK_FIT.map((item) => (
              <div
                key={item.product}
                className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)]"
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden className={cn("size-2 rounded-full", item.accent)} />
                  <h3 className="text-base font-semibold text-foreground">{item.product}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                <Link
                  href={item.href}
                  className="group mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-yellow-700"
                >
                  Learn about {item.product}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ: strings here feed both the visible accordion and the FAQPage
          JSON-LD, with inline markup stripped to plain text. */}
      <Faq heading="Frequently asked questions" items={STUDIO_FAQ} id="faq" />

      {/* Closer */}
      <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-balance text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.15]">
            Open your database, in your browser
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Run one command to open Studio on your own database, or sign in to the Prisma Console to
            open a shared Studio on a Prisma Postgres database with your team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PrismButton href={CONSOLE_URL} size="lg">
              Open Studio in Prisma Console
            </PrismButton>
            <PrismButtonOutline href={STUDIO_EMBED_DEMO_URL} size="lg">
              See the embed demo on GitHub
            </PrismButtonOutline>
          </div>
        </div>
      </section>
    </>
  );
}
