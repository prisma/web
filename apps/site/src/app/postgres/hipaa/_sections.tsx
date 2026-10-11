import Link from "next/link";
import { Fragment } from "react";
import { FileText, Grid3x3, Lock, RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckBold, Shield } from "@/components/icons/forma";
import { GlassGlide } from "@/components/brand/glass-glide";
import { IconTile } from "@/components/brand/icon-tile";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CtaBurst } from "@/components/sections/cta-burst";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { cn } from "@/lib/utils";
import {
  BAA_SAMPLE_PDF,
  CONSOLE_SIGN_UP_URL,
  HIPAA_BAA_ANCHOR,
  HIPAA_FAQ,
  HIPAA_PLAN_COLUMNS,
  HIPAA_PLAN_ROWS,
  HIPAA_RESOURCES,
  TRUST_URL,
} from "./_content";

// Yellow review badge visible on every unconfirmed claim. The page is noindex
// behind a draft PR, so these are deliberately in production markup to help
// reviewers eyeball what still needs sign-off. Remove before launch.
export function PendingBadge({
  variant = "pending",
  size = "default",
}: {
  variant?: "pending" | "placeholder";
  // "sm" prints a quieter version — smaller, less saturated, lower-case label.
  // Use inside tightly-set type (e.g. the comparison table) where the
  // regular badge is too loud against the surrounding content.
  size?: "default" | "sm";
}) {
  const label = variant === "pending" ? "Pending confirmation" : "Placeholder";
  if (size === "sm") {
    return (
      <span
        className="ml-1 inline-flex items-center gap-1 whitespace-nowrap rounded-sm bg-[#FFF4A8] px-1.5 py-px align-middle text-[10px] font-semibold leading-none text-[#6B5A00]"
        title={label}
      >
        <span aria-hidden className="size-1 shrink-0 rounded-full bg-[#C9A800]" />
        {variant === "pending" ? "Pending" : "Placeholder"}
      </span>
    );
  }
  return (
    <span className="ml-1 inline-block whitespace-nowrap rounded-md bg-[#FFE34D] px-[7px] py-[5px] align-middle text-[10px] font-bold uppercase leading-none tracking-[0.06em] text-[#4a3d00]">
      {label}
    </span>
  );
}

const INLINE_LINK =
  "font-medium text-foreground underline underline-offset-4 decoration-black/20 transition-colors hover:decoration-black/60";

// Mirrors the hero shell from ProductHero: wrapped prismatic panel with the
// spectral bottom wash, PrismRay crossing behind the right-hand visual, and
// the same copy / CTA / benefits rhythm. Copy, CTA and visual are custom to
// this page, so the section is composed directly rather than squeezed into
// ProductHero's content contract.
export function HipaaHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* Spectral bottom — matches hero-home.tsx / product-hero.tsx exactly. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
                "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
              ].join(","),
            }}
          />
          <div className="absolute bottom-[-24rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
          <div className="absolute bottom-[-28rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto grid max-w-site items-center gap-12 pb-20 pt-36 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:pb-28 md:pt-48 lg:gap-16">
            <div className="flex flex-col items-start">
              <RoleKicker color="bg-prism-yellow-400">Prisma Postgres for healthcare</RoleKicker>
              <h1 className="isolate mt-4 max-w-[min(16ch,100%)] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                HIPAA compliant Postgres for <GlassGlide>healthcare apps</GlassGlide>
              </h1>
              <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Prisma Postgres comes with a signed Business Associate Agreement on the Business
                plan, encrypts your patient data, and runs your TypeScript app right next to it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Primary CTA goes to the same console sign-up URL the site
                    header's "Get Started" uses, keeping conversion tracking
                    on the single canonical destination. */}
                <PrismButton href={CONSOLE_SIGN_UP_URL} size="lg">
                  Get started
                </PrismButton>
                <PrismButtonOutline href={BAA_SAMPLE_PDF} size="lg">
                  Download the BAA
                </PrismButtonOutline>
              </div>
              {/* Microline carries the price (the one place in the top of the
                  page it's allowed to live) plus a discreet "sample" marker
                  on the BAA download. */}
              <p className="mt-3.5 text-sm text-muted-foreground">
                Available on the Business plan, $129 a month.{" "}
                <Link href="/pricing" className={INLINE_LINK}>
                  Compare plans
                </Link>{" "}
                <PendingBadge size="sm" />
                <span className="mx-2 text-muted-foreground/50" aria-hidden>
                  &bull;
                </span>
                Sample PDF, not for signature.
              </p>
              <ul className="mt-8 flex flex-col gap-2.5 border-t border-black/[0.07] pt-7">
                {[
                  {
                    label: "A signed Business Associate Agreement (BAA)",
                    color: "text-prism-cyan-500",
                  },
                  {
                    label: "Encrypted at rest and in transit, isolated per tenant",
                    color: "text-prism-yellow-400",
                  },
                  {
                    label: "SOC 2 Type II and ISO 27001 reports in the Trust Center",
                    color: "text-prism-red-500",
                  },
                ].map(({ label, color }) => (
                  <li
                    key={label}
                    className="flex items-start gap-2 text-[0.9375rem] font-semibold text-foreground"
                  >
                    <CheckBold className={cn("mt-0.5 size-4 shrink-0", color)} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hero visual: a compliance-settings panel, same card shell idiom
                as the /postgres hero tour. */}
            <div className="relative max-md:mt-4 md:self-stretch">
              <PrismRay
                className="left-[75%] top-1/2 h-12 w-[32rem] -translate-x-1/2 -translate-y-1/2 md:h-24 md:w-[64rem]"
                angle={-50}
                intensity="hero"
              />
              <div className="relative md:h-full">
                <ComplianceCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComplianceCard() {
  const rows = [
    { label: "Plan", value: "Business" },
    { label: "Encryption", value: "At rest and in transit" },
    { label: "Isolation", value: "Dedicated per tenant" },
    { label: "Region", value: "us-east-1", mono: true },
    { label: "Backups", value: "Daily, kept 30 days" },
  ];
  const badges = ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"];

  return (
    <div
      role="img"
      aria-label="Illustration of a Prisma Postgres workspace on the Business plan with a signed BAA, encryption, a US region and 30 day backups"
      className="pointer-events-none relative flex h-full w-full select-none flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]"
    >
      <div className="flex items-center gap-2 border-b border-border/70 px-5 py-3.5">
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="ml-1.5 font-mono text-xs text-foreground">
          acme-health / settings / compliance
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-black/[0.06] bg-prism-cyan-50">
            <Shield className="size-5 text-prism-cyan-800" aria-hidden />
          </span>
          <div>
            <p className="text-[0.9375rem] font-semibold text-foreground">HIPAA</p>
            <p className="text-[0.8125rem] text-muted-foreground">
              Business Associate Agreement signed
            </p>
          </div>
          <span className="ml-auto rounded-full border border-prism-cyan-300 bg-prism-cyan-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-prism-cyan-800">
            Active
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {rows.map(({ label, value, mono }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-border/80 bg-card px-3 py-2.5"
            >
              <span className="size-2 shrink-0 rounded-full bg-prism-cyan-500" />
              <span className="text-[0.8125rem] text-muted-foreground">{label}</span>
              <span
                className={cn(
                  "ml-auto text-right text-[0.8125rem] font-semibold text-foreground",
                  mono && "font-mono",
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[0.75rem] font-semibold text-foreground"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <p className="border-t border-border/70 bg-muted/40 px-5 py-3 text-[0.8125rem] text-muted-foreground">
        One BAA for the workspace. Encryption, isolation and backups are on by default.
      </p>
    </div>
  );
}

export function HipaaGlance() {
  const cards: {
    heading: string;
    body: React.ReactNode;
    badge?: "pending" | "placeholder";
  }[] = [
    {
      heading: "Does Prisma Postgres support HIPAA?",
      body: (
        <>
          Yes. Prisma Postgres supports HIPAA compliance on the Business plan, and Prisma signs a
          Business Associate Agreement (BAA) with Business customers before they store protected
          health information (PHI).
        </>
      ),
    },
    {
      heading: "Which plan includes HIPAA?",
      body: (
        <>
          HIPAA is included in the Business plan, which costs $129 a month plus usage. It is not
          available on the Free, Starter or Pro plans. Business also includes SOC 2 Type II and ISO
          27001.
        </>
      ),
      badge: "pending",
    },
    {
      heading: "How do I get a BAA?",
      body: (
        <>
          Sign up for Prisma, upgrade your workspace to Business, then open Settings, then
          Compliance in the Console and request your BAA from there. Prisma sends it for
          e-signature, usually within 2 business days.
        </>
      ),
      badge: "pending",
    },
    {
      heading: "What does the BAA cover?",
      body: (
        <>
          The BAA covers Prisma Postgres databases in a Business workspace. Whether Prisma Compute,
          Buckets and other products are covered is still being confirmed, so keep PHI in your
          database until they are listed.
        </>
      ),
      badge: "placeholder",
    },
  ];

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "HIPAA support", value: "Yes, with a signed BAA" },
    { label: "Plan", value: "Business only" },
    { label: "Price", value: "$129 a month plus usage" },
    { label: "Also on Business", value: "SOC 2 Type II, ISO 27001" },
    {
      label: "On every plan",
      value: "GDPR, encryption at rest and in transit, tenant isolation",
    },
    { label: "Backups", value: "Daily, kept 30 days on Business" },
    { label: "Regions", value: "6, including 2 in the US" },
    {
      label: "BAA liability cap",
      value: "USD 250,000 standard, higher coverage available for an additional fee",
    },
    {
      label: "Audit reports",
      value: (
        <a href={TRUST_URL} className={INLINE_LINK}>
          trust.prisma.io
        </a>
      ),
    },
  ];

  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32" aria-labelledby="hipaa-at-a-glance">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <h2
            id="hipaa-at-a-glance"
            className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            HIPAA at a glance
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            The short version, for your security review: what Prisma Postgres offers for HIPAA,
            which plan you need, and how the Business Associate Agreement works.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
          {cards.map(({ heading, body, badge }) => (
            <div
              key={heading}
              className="flex h-full flex-col gap-3 rounded-xl border border-black/[0.06] bg-white p-6 sm:p-7"
            >
              <h3 className="text-xl leading-snug">{heading}</h3>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {body}
                {badge ? (
                  <>
                    {" "}
                    <PendingBadge variant={badge} />
                  </>
                ) : null}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-4 max-w-5xl overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_64px_-32px_rgba(21,21,21,0.2)]">
          <div className="flex items-center gap-4 border-b border-black/[0.06] px-5 py-4 sm:px-7">
            <p className="text-[0.8125rem] font-semibold text-foreground">
              Prisma Postgres HIPAA facts{" "}
              <span className="font-normal text-muted-foreground">Updated October 2026</span>
            </p>
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {facts.map(({ label, value }) => (
                <tr key={label} className="border-b border-black/[0.06] last:border-b-0">
                  <th
                    scope="row"
                    className="w-[38%] px-5 py-3.5 text-left text-[0.9375rem] font-semibold text-foreground sm:px-7"
                  >
                    {label}
                  </th>
                  <td className="px-5 py-3.5 text-[0.9375rem] text-muted-foreground sm:px-7">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function HipaaFoundations() {
  const tiles = [
    {
      icon: <FileText className="size-5 text-foreground" strokeWidth={1.6} aria-hidden />,
      label: "A BAA signed before any PHI is stored",
    },
    {
      icon: <Lock className="size-5 text-foreground" strokeWidth={1.6} aria-hidden />,
      label: "Encryption at rest and in transit, on every database",
    },
    {
      icon: <Grid3x3 className="size-5 text-foreground" strokeWidth={1.6} aria-hidden />,
      label: "Each database isolated from other tenants",
    },
    {
      icon: <RotateCcw className="size-5 text-foreground" strokeWidth={1.6} aria-hidden />,
      label: "Daily backups you restore from the Console",
    },
  ];

  return (
    <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            What makes a database HIPAA compliant
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            HIPAA does not certify databases. A database is suitable for protected health
            information when the provider signs a BAA with you, protects the data with safeguards
            such as encryption, access controls and backups, and you configure and use it correctly.
          </p>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Prisma Postgres gives you the provider side of that on the Business plan, so your team
            can spend its time on the healthcare product instead of on database operations.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ icon, label }) => (
            <div
              key={label}
              className="flex h-full flex-col items-start gap-4 rounded-xl border border-black/[0.06] bg-white p-6"
            >
              <IconTile>{icon}</IconTile>
              <p className="font-semibold leading-snug text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HipaaFeatures() {
  const items: {
    title: string;
    body: React.ReactNode;
    href: string;
    linkLabel: string;
    panel: React.ReactNode;
    photo: string;
    photoPosition: string;
    badge?: "pending" | "placeholder";
  }[] = [
    {
      title: "Keep patient data in the region you choose",
      body: (
        <>
          Pick the region when you create a database: two US regions (North Virginia and San
          Francisco), two in the EU and two in Asia. US patient data can stay in a US region.
        </>
      ),
      badge: "pending",
      href: "/docs/postgres/faq#what-regions-is-prisma-postgres-available-in",
      linkLabel: "See all regions",
      photo: "/brand/feature-postgres.jpg",
      photoPosition: "50% 55%",
      panel: (
        <MiniPanel label="regions">
          <MiniRow active>us-east-1&nbsp;&nbsp;North Virginia</MiniRow>
          <MiniRow active>us-west-1&nbsp;&nbsp;San Francisco</MiniRow>
          <MiniRow>eu-central-1&nbsp;&nbsp;Frankfurt</MiniRow>
          <MiniRow>ap-northeast-1&nbsp;&nbsp;Tokyo</MiniRow>
        </MiniPanel>
      ),
    },
    {
      title: "Restore from daily backups",
      body: (
        <>
          Business keeps daily backups for 30 days. Restore one from the database's Backups tab in
          the Console, or take your own copy any time with pg_dump.
        </>
      ),
      href: "/docs/postgres/database/backups",
      linkLabel: "Read the backups docs",
      photo: "/brand/feature-orm.jpg",
      photoPosition: "0% 65%",
      panel: (
        <MiniPanel label="backups">
          <MiniRow active>today 03:00 UTC&nbsp;&nbsp;ready</MiniRow>
          <MiniRow>yesterday&nbsp;&nbsp;ready</MiniRow>
          <MiniRow>30 days retained</MiniRow>
          <MiniRow active>Restore to new database</MiniRow>
        </MiniPanel>
      ),
    },
    {
      title: "Run your app next to the data",
      body: (
        <>
          Host your Node.js, Bun or Next.js app on Prisma Compute in the same region as the
          database, on the same plan. Confirm Compute is covered by your BAA before it handles PHI.
        </>
      ),
      badge: "placeholder",
      href: "/compute",
      linkLabel: "Learn more about Compute",
      photo: "/brand/feature-compute.jpg",
      photoPosition: "20% 90%",
      panel: (
        <MiniPanel label="deploy">
          <MiniRow active>api&nbsp;&nbsp;Prisma Compute</MiniRow>
          <MiniRow active>db&nbsp;&nbsp;&nbsp;Prisma Postgres</MiniRow>
          <MiniRow>one plan, one region</MiniRow>
          <MiniRow>private connection</MiniRow>
        </MiniPanel>
      ),
    },
  ];

  return (
    <section className="bg-white px-3 py-3 sm:px-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
                "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
              ].join(","),
            }}
          />
          <div className="absolute bottom-[-24rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
          <div className="absolute bottom-[-28rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative mx-auto max-w-site px-4 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl text-center max-md:text-left">
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              Built for production healthcare workloads
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              The same managed{" "}
              <Link href="/postgres" className={INLINE_LINK}>
                Prisma Postgres
              </Link>{" "}
              thousands of teams run in production, with the controls a healthcare app needs.
              Connect with any Postgres client or with Prisma ORM, using{" "}
              <Link
                href="/docs/postgres/database/connecting-to-your-database"
                className={INLINE_LINK}
              >
                standard connection strings
              </Link>{" "}
              and{" "}
              <Link href="/docs/postgres/database/connection-pooling" className={INLINE_LINK}>
                built-in connection pooling
              </Link>
              .
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {items.map((item) => (
              <div key={item.title} className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-card">
                  <div className="relative flex h-64 select-none items-center justify-center overflow-hidden p-5">
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-cover [filter:saturate(1.45)_contrast(1.04)]"
                      style={{
                        backgroundImage: `url(${item.photo})`,
                        backgroundPosition: item.photoPosition,
                      }}
                    />
                    <div className="relative size-full">{item.panel}</div>
                  </div>
                  <div className="flex grow flex-col p-7">
                    <h3 className="text-xl">{item.title}</h3>
                    <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                      {item.body}
                      {item.badge ? (
                        <>
                          {" "}
                          <PendingBadge variant={item.badge} />
                        </>
                      ) : null}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-auto inline-flex items-center gap-1 pt-4 text-[0.9375rem] font-semibold text-foreground hover:underline"
                    >
                      {item.linkLabel}
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      role="img"
      aria-hidden
      className="pointer-events-none relative flex h-full w-full select-none flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-[0_12px_32px_-14px_rgba(21,21,21,0.18)]"
    >
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="ml-1.5 font-mono text-xs text-foreground">{label}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3 text-[0.6875rem] leading-none">
        {children}
      </div>
    </div>
  );
}

function MiniRow({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border/80 p-2",
        active ? "bg-card" : "bg-muted/30",
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", active ? "bg-prism-cyan-500" : "bg-border")}
      />
      <span className={cn("font-mono", active ? "text-foreground" : "text-muted-foreground")}>
        {children}
      </span>
    </div>
  );
}

export function HipaaResponsibility() {
  const prisma = [
    "Encryption of data at rest and in transit",
    "Isolation between tenants' databases",
    "Daily automatic backups, kept 30 days on Business",
    "An internal HIPAA program: policies, risk management and staff training",
    "Signing a BAA with Business customers",
  ];
  const you = [
    "Who can access your workspace, databases and connection strings",
    "Keeping PHI out of services and tools the BAA does not cover",
    "Securing your own application, its logs and its integrations",
    "Your own HIPAA policies, risk assessments and access reviews",
    "Keeping the workspace on the Business plan while it stores PHI",
  ];

  return (
    <section
      className="bg-white px-4 py-24 sm:px-8 sm:py-32"
      aria-labelledby="shared-responsibility"
    >
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <h2
            id="shared-responsibility"
            className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            Who is responsible for what under HIPAA?
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            HIPAA compliance is shared. Prisma secures the managed database platform, and you secure
            how your application and your team use it.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
          <ResponsibilityCard
            dot="bg-prism-cyan-500"
            check="text-prism-cyan-500"
            heading="Prisma handles"
            items={prisma}
          />
          <ResponsibilityCard
            dot="bg-prism-red-500"
            check="text-prism-red-500"
            heading="You handle"
            items={you}
          />
        </div>
        <div className="mx-auto mt-4 max-w-5xl rounded-2xl border-2 border-dashed border-[#E9C400] bg-[#FFFBE6] p-7">
          <p className="font-semibold text-foreground">
            Which products the BAA covers <PendingBadge variant="placeholder" />
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            This box will list exactly which services are in scope (for example Prisma Postgres,
            Prisma Compute, Buckets, Studio and Query insights) and which are not. Prisma's{" "}
            <Link href="/legal/terms" className={INLINE_LINK}>
              Terms
            </Link>{" "}
            already state that Embeddable Prisma Studio is not designed for regulated industries
            such as healthcare. Josh McLeod and Tyler Hogarth to confirm, including subprocessor
            BAAs.
          </p>
        </div>
      </div>
    </section>
  );
}

function ResponsibilityCard({
  dot,
  check,
  heading,
  items,
}: {
  dot: string;
  check: string;
  heading: string;
  items: readonly string[];
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-7">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
        <span className={cn("size-2 rounded-full", dot)} />
        {heading}
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((label) => (
          <li
            key={label}
            className="flex items-start gap-2 text-[0.9375rem] leading-relaxed text-foreground"
          >
            <CheckBold className={cn("mt-0.5 size-4 shrink-0", check)} aria-hidden />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HipaaPlans() {
  return (
    <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32" aria-labelledby="plans">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <h2
            id="plans"
            className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            Which Prisma Postgres plan includes HIPAA?
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            HIPAA is on the Business plan. Every plan encrypts and isolates your data; compliance
            coverage and backup retention grow with the plan. <PendingBadge />
          </p>
        </div>
        <div className="mx-auto mt-14 max-w-5xl overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_64px_-32px_rgba(21,21,21,0.2)]">
          <table className="w-full border-collapse" style={{ minWidth: "21rem" }}>
            <thead>
              <tr className="border-b border-black/[0.08]">
                <th className="px-4 sm:px-6">
                  <span className="sr-only">Feature</span>
                </th>
                {HIPAA_PLAN_COLUMNS.map((col) => (
                  <th
                    key={col.name}
                    scope="col"
                    className="px-2 py-4 text-center align-bottom"
                    style={col.highlight ? { background: "rgba(1,215,228,.06)" } : undefined}
                  >
                    <span className="block font-display text-[0.9375rem] font-semibold text-foreground sm:text-base">
                      {col.name}
                    </span>
                    <span className="mt-0.5 block text-[0.75rem] font-normal text-muted-foreground">
                      {col.price}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HIPAA_PLAN_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-black/[0.06] last:border-b-0">
                  <th
                    scope="row"
                    className="px-4 py-3.5 text-left text-[0.875rem] font-semibold text-foreground sm:px-6 sm:text-[0.9375rem]"
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, idx) => {
                    const highlight = HIPAA_PLAN_COLUMNS[idx]?.highlight;
                    return (
                      <td
                        key={idx}
                        className="px-2 py-3.5 text-center text-[0.8125rem] text-muted-foreground sm:text-[0.9375rem]"
                        style={highlight ? { background: "rgba(1,215,228,.06)" } : undefined}
                      >
                        {cell === true ? (
                          <CheckBold
                            className="mx-auto size-4 shrink-0 text-prism-cyan-500"
                            aria-label="Yes"
                          />
                        ) : cell === false ? (
                          <span className="text-[0.8125rem] text-muted-foreground/70">No</span>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-5 max-w-5xl text-center text-sm text-muted-foreground">
          Usage beyond what each plan includes is billed by operations and storage, and spend limits
          cap your bill.{" "}
          <Link href="/pricing" className={INLINE_LINK}>
            See full pricing
          </Link>
        </p>
      </div>
    </section>
  );
}

// Logos: Prisma uses the same /logo/full-color.svg asset the site header
// renders (see components/logo.tsx). Supabase and Render are the official
// black wordmarks shipped in their public brand kits, committed under
// /public/postgres/hipaa/logos/; the PR body carries the source URLs.
// Supabase SVG: 581x113. Render SVG: 2909x1200. Prisma SVG: 264x67.
const VENDOR_LOGOS = {
  prisma: { src: "/logo/full-color.svg", alt: "Prisma", aspect: 264 / 67 },
  supabase: {
    src: "/postgres/hipaa/logos/supabase-wordmark.svg",
    alt: "Supabase",
    aspect: 581 / 113,
  },
  render: {
    src: "/postgres/hipaa/logos/render-wordmark.svg",
    alt: "Render",
    // The viewBox is tightened to the mark + wordmark bbox (the brand kit
    // ships with ~400px safe-area padding on each side), so the aspect is
    // computed from the trimmed box, not the raw 2909x1200.
    aspect: 2112 / 410,
  },
} as const;

type StartupRow = {
  label: string;
  cells: readonly [React.ReactNode, React.ReactNode, React.ReactNode];
};

const STARTUP_ROWS: StartupRow[] = [
  { label: "Signed BAA", cells: ["Included", "Yes", "Yes"] },
  {
    label: "Plan required",
    cells: [
      <>
        Business <PendingBadge size="sm" />
      </>,
      "Team plus HIPAA add-on",
      "Scale",
    ],
  },
  { label: "Starting price per month", cells: ["$129", "$599", "$499"] },
  { label: "Extra HIPAA fees", cells: ["None", "HIPAA add-on", "Plus 20% on usage"] },
];

// Builds the "HIPAA without an enterprise budget" section. The structure
// mirrors the comparison table idiom used on /pricing (semantic <table>,
// row-label scope="row", muted-foreground on labels, foreground on values),
// with the Prisma column separated out as a visually emphasised column via
// a cyan top accent bar and a soft tinted background that stops at the panel
// edge.
export function HipaaStartups() {
  const vendors: {
    key: keyof typeof VENDOR_LOGOS;
    name: string;
    accent?: boolean;
  }[] = [
    { key: "prisma", name: "Prisma Postgres", accent: true },
    { key: "supabase", name: "Supabase" },
    { key: "render", name: "Render" },
  ];

  return (
    <section
      className="bg-white px-4 pb-24 sm:px-8 sm:pb-32"
      aria-labelledby="startups"
    >
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <h2
            id="startups"
            className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            HIPAA without an enterprise budget
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Most managed databases put HIPAA behind enterprise plans. Prisma Postgres includes a
            signed BAA on Business, so early stage healthcare startups can be compliant from day
            one.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_64px_-32px_rgba(21,21,21,0.2)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: "40rem" }}>
              <thead>
                <tr>
                  <th scope="col" className="w-[26%] px-5 py-7 text-left align-bottom sm:px-7">
                    <span className="sr-only">Feature</span>
                  </th>
                  {vendors.map((v) => {
                    const logo = VENDOR_LOGOS[v.key];
                    return (
                      <th
                        key={v.key}
                        scope="col"
                        className={cn(
                          "relative px-4 py-7 text-center align-bottom sm:px-6",
                          v.accent && "bg-prism-cyan-50/50",
                        )}
                      >
                        {v.accent ? (
                          <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-1"
                            style={{
                              background:
                                "linear-gradient(90deg, var(--color-prism-cyan-400), var(--color-prism-cyan-500))",
                            }}
                          />
                        ) : null}
                        <span className="mx-auto flex h-8 items-center justify-center">
                          {/* Plain <img>: these are brand wordmarks with
                              very different aspect ratios; next/image's
                              `width`/`height` constraints would scale them
                              inconsistently. The height is driven by CSS and
                              the width follows the file's intrinsic ratio. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logo.src}
                            alt={logo.alt}
                            style={{ height: 28, width: 28 * logo.aspect }}
                            className={cn(v.accent ? "" : "opacity-80 [filter:grayscale(1)]")}
                          />
                        </span>
                        <span
                          className={cn(
                            "mt-2 block text-[0.75rem] font-semibold uppercase tracking-[0.08em]",
                            v.accent ? "text-prism-cyan-800" : "text-muted-foreground",
                          )}
                        >
                          {v.name}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {STARTUP_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i === 0 ? "border-t border-black/[0.08]" : "border-t border-black/[0.06]"}
                  >
                    <th
                      scope="row"
                      className="px-5 py-5 text-left text-[0.9375rem] font-semibold text-foreground sm:px-7"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, j) => {
                      const vendor = vendors[j];
                      const accent = vendor?.accent;
                      return (
                        <td
                          key={j}
                          className={cn(
                            "px-4 py-5 text-center text-[0.9375rem] sm:px-6",
                            accent
                              ? "bg-prism-cyan-50/50 font-semibold text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-start gap-4 border-t border-black/[0.08] bg-white px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              Start on the Business plan, get your BAA and ship to patients, without an
              enterprise contract.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
              <PrismButton href={CONSOLE_SIGN_UP_URL}>Get started</PrismButton>
              <PrismButtonOutline href={BAA_SAMPLE_PDF}>Download the BAA</PrismButtonOutline>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HipaaBaaSteps() {
  // The BAA is requested inside Console (Settings, then Compliance), never
  // from a form on the marketing page. The steps are the real path a
  // customer walks today.
  const steps: {
    title: string;
    body: React.ReactNode;
    badge?: "pending" | "placeholder";
  }[] = [
    {
      title: "Download and review the sample",
      body: (
        <>
          Share the{" "}
          <a href={BAA_SAMPLE_PDF} className={INLINE_LINK}>
            sample BAA
          </a>{" "}
          with your legal and compliance team so you know what you are agreeing to before you
          sign.
        </>
      ),
    },
    {
      title: "Sign up for Prisma",
      body: "Create a Prisma account and workspace from the Console. It takes about a minute, no credit card.",
    },
    {
      title: "Upgrade to Business",
      body: (
        <>
          Upgrade the workspace to the Business plan from the Console. <PendingBadge size="sm" />
        </>
      ),
    },
    {
      title: "Request your BAA",
      body: (
        <>
          Open Settings, then Compliance in the Console and request your BAA. Prisma sends it
          for e-signature, usually within 2 business days. <PendingBadge size="sm" />
        </>
      ),
    },
  ];

  return (
    <section id={HIPAA_BAA_ANCHOR} className="bg-white px-3 py-3 sm:px-4">
      <div
        className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06]"
        style={{ background: "#F8F8F7" }}
      >
        <div className="relative mx-auto max-w-site px-4 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl text-center max-md:text-left">
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              How do I get a BAA from Prisma?
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              A Business Associate Agreement is the contract HIPAA requires before a vendor
              handles PHI for you. With Prisma it takes four steps and a few minutes of your
              time.
            </p>
          </div>

          {/* Callout: the single sentence that answers "where do I actually
              do this?" for a reader who skimmed the four cards. Styled as a
              quiet info bar rather than a card so it reads as orientation,
              not as a fifth step. */}
          <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-xl border border-prism-cyan-300/60 bg-prism-cyan-50/60 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-foreground sm:px-5">
            <Shield className="mt-0.5 size-4 shrink-0 text-prism-cyan-700" aria-hidden />
            <p>
              <span className="font-semibold">After you sign up, upgrade to Business,</span>{" "}
              then open Settings, then Compliance in the Console to request your BAA.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="h-full">
                <div className="flex h-full flex-col items-start gap-4 rounded-xl border border-black/[0.06] bg-white p-6">
                  <span className="flex size-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-lg leading-snug">{step.title}</h3>
                  <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-start gap-3 sm:justify-center">
            <PrismButton href={CONSOLE_SIGN_UP_URL}>Get started</PrismButton>
            <PrismButtonOutline href={BAA_SAMPLE_PDF}>Download the BAA</PrismButtonOutline>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HipaaResources() {
  return (
    <section className="bg-white px-4 pt-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Build your healthcare app with Prisma
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Guides for setting up, protecting and operating your database. For field-level
            encryption of the most sensitive columns, CipherStash works with Prisma ORM.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-3 md:grid-cols-2">
          {HIPAA_RESOURCES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex items-center gap-4 rounded-xl border border-black/[0.06] bg-white p-5 transition-colors hover:border-black/20"
            >
              <span className="rounded-full border border-black/[0.08] px-2.5 py-0.5 text-[0.75rem] font-semibold text-foreground/70">
                {r.kind}
              </span>
              <span className="font-semibold leading-snug text-foreground">{r.title}</span>
              <span
                aria-hidden
                className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HipaaFaq() {
  return (
    <section id="faq" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">FAQ</h2>
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          {/* Reused shared accordion so answers are present in the server HTML
              (forceMount + inert on closed items, see ui/accordion.tsx). */}
          <Accordion type="single" collapsible defaultValue="item-0">
            {HIPAA_FAQ.map((faq, i) => (
              <AccordionItem key={faq.question} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  <Fragment>
                    {renderFaqAnswer(faq.answer)}
                    {faq.confidence !== "confirmed" ? (
                      <>
                        {" "}
                        <PendingBadge
                          variant={faq.confidence === "placeholder" ? "placeholder" : "pending"}
                        />
                      </>
                    ) : null}
                  </Fragment>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export function HipaaTrustStrip() {
  return (
    <section className="bg-white px-4 pb-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 rounded-2xl border border-black/[0.06] bg-white p-7 sm:flex-row sm:items-center sm:p-9">
        <IconTile>
          <Shield className="size-5 text-foreground" aria-hidden />
        </IconTile>
        <div>
          <p
            className="text-xl font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            Audit reports in the Trust Center
          </p>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">
            SOC 2 Type II and ISO 27001 reports, policies and control details for your security
            review. Plan-by-plan coverage is also on the{" "}
            <Link href="/legal/security-and-compliance" className={INLINE_LINK}>
              Security and compliance
            </Link>{" "}
            page.
          </p>
        </div>
        <div className="sm:ml-auto">
          <PrismButtonOutline href={TRUST_URL}>Visit the Trust Center</PrismButtonOutline>
        </div>
      </div>
    </section>
  );
}

export function HipaaCloser() {
  return (
    <CtaBurst
      headline="Build your healthcare app on Prisma Postgres"
      headlineMaxWidth="max-w-[30ch]"
      body="Move to the Business plan, sign your BAA, and ship on managed Postgres that is ready for protected health information, with your app hosted right next to it."
      bodyMaxWidth="max-w-[78ch]"
      checks={[
        { label: "A signed BAA on the Business plan", color: "text-prism-cyan-500" },
        { label: "Encrypted, isolated, backed up daily", color: "text-prism-yellow-400" },
        { label: "Standard Postgres underneath, no lock-in", color: "text-prism-red-500" },
      ]}
      // Headline, body and primary CTA deliberately avoid the price — see the
      // SEO brief: price is kept out of the title, meta, H1 and closer.
      primaryCta={{ label: "Get started", href: CONSOLE_SIGN_UP_URL }}
      secondaryCta={{ label: "Download the BAA", href: BAA_SAMPLE_PDF }}
    />
  );
}
