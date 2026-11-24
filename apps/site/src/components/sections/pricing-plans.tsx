import { Marker } from "@/components/brand/marker";
import { PrismButton, PrismButtonOutline, PrismButtonPlain } from "@/components/brand/prism-button";
import { ArrowRightLeft, ArrowUpFromLine, Cpu, MemoryStick } from "lucide-react";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { cn } from "@/lib/utils";
import { PricingCalculatorLink } from "./pricing-calculator-link";

// The plans as two sections, Prisma Compute and Prisma Postgres, each stating
// its rule once (client and CEO review, 2026-11-24, mock-up 4C). The four
// cards it replaces made it "too hard to figure out what compute costs": the
// shared Compute rates sat in a band below, away from Compute. Here the table
// shows the pricing model itself:
//  - Compute: paid plans differ only in included requests, so the usage rates
//    are ONE cell spanning Starter, Pro and Business.
//  - Postgres: every plan includes more and charges less beyond it, so its
//    rows change in every column.
//
// Numbers are LOCKED IN, hand-entered by Shane (Compute GA, 2026-08-24, and
// the V2 corrections: Gregory 2026-07-24, Shane 2026-07-29). Keep the Prisma
// Compute and Prisma Postgres groups in pricing-spec-table.tsx, calc.ts,
// pricing-data.ts and markdown/pricing.ts in sync with these.
//
// Free has no usage billing: it includes fixed amounts of every meter. Its
// cells say so in the spec table's words ("No usage billing").
//
// Databases, backups and compliance used to sit on the cards. They are in the
// "Compare all features" table further down; this table carries only what
// sets the price.
//
// Paid buttons name their plan (client review with PostHog, 2026-11-21): all
// three said "Get started", so PostHog couldn't tell which plan anyone chose.

const SIGN_UP = "https://console.prisma.io/sign-up";
const NO_USAGE_BILLING = "No usage billing";

// `note` is one line under every plan's price, so the four headers have the
// same rhythm (client, 2026-11-24: with a line under Free only, the header
// "looks very unbalanced"). The paid lines are cut down from the approved V2
// plan blurbs.
type Plan = {
  name: string;
  price: string;
  note: string;
  cta: string;
  popular: boolean;
  requests: string;
  ops: string;
  opsRate: string | null;
  storage: string;
  storageRate: string | null;
  databases: string;
  /** null: Free has no backups (spec table: "Not available"). */
  backups: string | null;
  spendLimit: string;
  /** Markdown-style links allowed: rendered through renderFaqAnswer. */
  compliance: string;
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    note: "Free forever. No credit card required.",
    cta: "Start for free",
    popular: false,
    requests: "1M",
    ops: "200k",
    opsRate: null,
    storage: "2 GB",
    storageRate: null,
    databases: "50",
    backups: null,
    spendLimit: "Fixed at $0",
    compliance: "GDPR",
  },
  {
    name: "Starter",
    price: "$10",
    note: "For your first production app.",
    cta: "Start on Starter",
    popular: true,
    requests: "5M",
    ops: "1M",
    opsRate: "$8 per million",
    storage: "10 GB",
    storageRate: "$2.00 per GB",
    databases: "1,000",
    backups: "Daily, 7-day retention",
    spendLimit: "Included",
    compliance: "GDPR",
  },
  {
    name: "Pro",
    price: "$49",
    note: "For apps with real traffic.",
    cta: "Start on Pro",
    popular: false,
    requests: "20M",
    ops: "10M",
    opsRate: "$2 per million",
    storage: "50 GB",
    storageRate: "$1.50 per GB",
    databases: "1,000",
    backups: "Daily, 7-day retention",
    spendLimit: "Included",
    compliance: "GDPR",
  },
  {
    name: "Business",
    price: "$129",
    note: "For teams with compliance needs.",
    cta: "Start on Business",
    popular: false,
    requests: "100M",
    ops: "50M",
    opsRate: "$1 per million",
    storage: "100 GB",
    storageRate: "$1.00 per GB",
    databases: "1,000",
    backups: "Daily, 30-day retention",
    spendLimit: "Included",
    compliance: "GDPR, [HIPAA with a BAA](/postgres/hipaa), SOC 2, ISO 27001",
  },
];

/** The Compute usage rates: the same on every paid plan. */
export const COMPUTE_USAGE_RATES = [
  { icon: ArrowRightLeft, name: "Extra requests", rate: "$1 per million" },
  { icon: MemoryStick, name: "Memory", rate: "$0.006 per GB-hour" },
  { icon: Cpu, name: "Active CPU", rate: "$0.064 per vCPU-hour" },
  { icon: ArrowUpFromLine, name: "Outbound bandwidth", rate: "$0.025 per GB" },
];

/** What Free includes instead of usage billing. */
export const FREE_COMPUTE_NOTE = "360 GB-hours, 4 vCPU-hours and 10 GB included. No usage billing.";
/** The same note as the desktop table sets it: allowances, then the rule. */
/** Free's Compute allowances, as the desktop table sets them. */
const FREE_COMPUTE_ALLOWANCES = ["360 GB-hours", "4 vCPU-hours", "10 GB"];

export const PLAN_SECTIONS = {
  compute: {
    title: "Prisma Compute",
    rule: "Usage costs the same on every paid plan.",
  },
  postgres: {
    title: "Prisma Postgres",
    rule: "Extra usage costs less on higher plans.",
  },
  platform: {
    title: "Platform",
    rule: "Spend limits on every paid plan. Business adds HIPAA, SOC 2 and ISO 27001.",
  },
};

const NOT_AVAILABLE = "Not available";

// Jump links under the plans: most visitors never scroll past them, so the
// sections further down get a way in. Anchors live on each section.
// One footer line under the plans (client, 2026-11-24: a separate calculator
// row plus these links "looks messy"): the calculator, now on its own page,
// is one link among them.
const JUMP_LINKS = [
  { href: "/pricing/calculator", label: "Estimate your bill" },
  { href: "#compare-plans", label: "Compare all features" },
  { href: "#compare", label: "Prisma vs Netlify, Supabase and Railway" },
];

const LINE = "border-black/[0.06]";
const HAIR = "border-black/[0.045]";
const POPULAR_TINT = "bg-paper/60";

// Desktop table lines, one class per side so they can't override each other
// (a shared `border-black/…` colour let the row rule repaint the column line,
// so column lines changed shade from row to row).
//  - COL: the line between plan columns, the same in every row
//  - ROW: the faint rule between rows inside a section
//  - SECTION: the rule where a section starts
const COL = "border-l border-l-black/[0.07]";
const ROW = "border-t border-t-black/[0.05]";
const SECTION = "border-t border-t-black/[0.08]";
// The table's outer frame, drawn by its cells rather than a wrapper box, so
// the empty top-left corner above the row labels stays open to the page
// (client, 2026-11-24: an empty boxed corner read as a missing plan). The
// table is border-separate, so each cell owns its edges and rounds its corner.
const FRAME_L = "border-l border-l-black/[0.07]";
const FRAME_R = "border-r border-r-black/[0.07]";
const FRAME_T = "border-t border-t-black/[0.07]";
const FRAME_B = "border-b border-b-black/[0.07]";
const LAST = PLANS.length - 1;

function Cta({ plan, compact = false }: { plan: Plan; compact?: boolean }) {
  // Brand CTAs: the recommended plan is the filled pill, the rest outlined, so
  // only one reads as primary. `compact` is the desktop table's: the small
  // plain pill (no glow, burst or shadow), filling a fixed-width slot so all
  // four match, so it sits among the numbers without competing (client,
  // 2026-11-24: "remove the chrome from the buttons"). Phones keep the
  // full-width brand buttons, easier to tap.
  if (compact) {
    return (
      <PrismButtonPlain
        href={SIGN_UP}
        size="sm"
        fullWidth
        variant={plan.popular ? "solid" : "outline"}
      >
        {plan.cta}
      </PrismButtonPlain>
    );
  }
  return plan.popular ? (
    <PrismButton href={SIGN_UP} fullWidth>
      {plan.cta}
    </PrismButton>
  ) : (
    <PrismButtonOutline href={SIGN_UP} className="w-full">
      {plan.cta}
    </PrismButtonOutline>
  );
}

// After Vercel's pricing header (client, 2026-11-24: "take a page from
// Vercel's books"): a large price and a small, quiet monospace "/mo.", so the
// number carries the line.
export function Price({ plan, large = false }: { plan: Plan; large?: boolean }) {
  return (
    <span
      className={cn(
        "flex items-baseline gap-2 font-heading font-medium tracking-tight text-foreground",
        large ? "text-5xl" : "text-4xl",
      )}
    >
      {plan.price}
      <span className="font-mono text-xs font-normal tracking-normal text-muted-foreground">
        /mo.
      </span>
    </span>
  );
}

function Value({ value, strong = false }: { value: string | null; strong?: boolean }) {
  return value ? (
    <span className={cn("tabular-nums text-foreground", strong && "font-medium")}>{value}</span>
  ) : (
    <span className="text-muted-foreground">{NO_USAGE_BILLING}</span>
  );
}

function SectionHead({ section }: { section: keyof typeof PLAN_SECTIONS }) {
  const { title, rule } = PLAN_SECTIONS[section];
  return (
    <>
      <span className="text-base font-semibold text-foreground">{title}</span>
      <span className="text-sm text-muted-foreground">{rule}</span>
    </>
  );
}

/* ---------------------------------------------------------------- desktop */

const CELL = "px-4 py-3.5 text-left align-top text-sm font-normal xl:px-6";
// No tint on the popular column: the Compute rates cell spans it, so a tint
// could never run unbroken and read as a fault (client, 2026-11-24: "it looks
// broken"). Starter is marked by its chip and its filled button.
// Plan cells share the header's left edge, so each column reads down one
// clean line from name to button (Vercel's header, client, 2026-11-24).
const PLAN_CELL = CELL;

// Each section opens on a centred title band (see TableSection). Title only:
// on desktop the rows show the rules (Compute's shared rates are one shaded
// cell, Postgres's overage falls $8, $2, $1 per million). Both rules stay on
// phones and in the Markdown.
function TableSection({
  section,
  first = false,
  children,
}: {
  section: keyof typeof PLAN_SECTIONS;
  /** The first section's band starts the frame's left edge, so it rounds
      the corner where the open top-left meets the table. */
  first?: boolean;
  children: React.ReactNode;
}) {
  const { title } = PLAN_SECTIONS[section];
  return (
    // Room under each section comes from padding on its last row, not a
    // spacer row: a spacer with column lines left short stubs under the
    // Compute rates cell, which spans the paid columns (client, 2026-11-24).
    <tbody className="[&>tr:last-child>*]:pb-7">
      {/* The section's name, centred on a light band across the whole
          table (client, 2026-11-24: "move the Compute and Postgres titles to
          the middle and create a new section"). Each product reads as its
          own block; the column lines start again under it. */}
      <tr>
        <th
          scope="rowgroup"
          colSpan={PLANS.length + 1}
          className={cn(
            SECTION,
            FRAME_L,
            FRAME_R,
            // Opaque: the band now sits on the page's wash, not a white box.
            "border-b border-b-black/[0.06] bg-[color-mix(in_srgb,var(--color-foreground)_2%,white)] px-4 py-3 text-center font-normal",
            first && "rounded-tl-2xl",
          )}
        >
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </th>
      </tr>
      {children}
    </tbody>
  );
}

function PlanRow({
  label,
  first = false,
  cell,
}: {
  label: string;
  first?: boolean;
  cell: (plan: Plan) => React.ReactNode;
}) {
  const top = !first && ROW;
  return (
    <tr>
      <th
        scope="row"
        className={cn(CELL, FRAME_L, "whitespace-nowrap bg-white text-muted-foreground", top)}
      >
        {label}
      </th>
      {PLANS.map((plan, i) => (
        <td key={plan.name} className={cn(PLAN_CELL, COL, "bg-white", i === LAST && FRAME_R, top)}>
          {cell(plan)}
        </td>
      ))}
    </tr>
  );
}

// Free is the table's first column again (client, 2026-11-24, after ten
// placements outside it: a bar, a strip, a sentence or a card each read as
// bolted on). Shaped exactly like the paid plans, four columns balance; its
// "No usage billing" cells show the contrast with the paid plans' rates.
function PlansTable() {
  return (
    <div className="hidden lg:block">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <caption className="sr-only">
          Plans, with Prisma Compute and Prisma Postgres pricing
        </caption>
        <colgroup>
          <col className="w-[176px] xl:w-[200px]" />
          <col span={4} />
        </colgroup>
        <thead>
          <tr>
            <td />
            {PLANS.map((plan, i) => (
              <th
                key={plan.name}
                scope="col"
                className={cn(
                  COL,
                  FRAME_T,
                  "bg-white px-4 pb-7 pt-7 text-left align-top font-normal xl:px-6",
                  i === 0 && "rounded-tl-2xl",
                  i === LAST && cn(FRAME_R, "rounded-tr-2xl"),
                )}
              >
                {/* Left-aligned like Vercel's header: name with the chip
                    inline, a large price, then the description as body text.
                    One left edge per column, from name down to button. */}
                <span className="flex h-6 items-center gap-2 whitespace-nowrap text-sm font-medium text-foreground">
                  {plan.name}
                  {plan.popular && <Marker>Most popular</Marker>}
                </span>
                <span className="mt-3 block">
                  <Price plan={plan} large />
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
                  {plan.note}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <TableSection section="compute" first>
          {/* Included requests first, then the rates every plan pays
              (client, 2026-11-24). */}
          <PlanRow
            label="Requests included"
            first
            cell={(plan) => <Value value={plan.requests} strong />}
          />
          <tr>
            <th
              scope="row"
              className={cn(CELL, ROW, FRAME_L, "text-balance bg-white text-muted-foreground")}
            >
              {/* Says what the merged cell shows: the rates every paid plan
                  pays. Free's cell beside it says it has none. */}
              Usage rates for paid plans
            </th>
            <td className={cn(PLAN_CELL, COL, ROW, "bg-white text-muted-foreground")}>
              {/* Each allowance is unbreakable, so the line breaks only at a
                  dot, and balanced, so "10 GB" is never alone. */}
              <span className="block text-balance text-foreground">
                {FREE_COMPUTE_ALLOWANCES.map((item, i) => (
                  <span key={item}>
                    {i > 0 && " · "}
                    <span className="whitespace-nowrap">{item}</span>
                  </span>
                ))}
              </span>
              <span className="mt-0.5 block">included, {NO_USAGE_BILLING.toLowerCase()}</span>
            </td>
            {/* One cell across the three paid plans: the rates are the same
                on all of them, and the merged cell is what says so. */}
            <td colSpan={3} className={cn(PLAN_CELL, COL, ROW, FRAME_R, "bg-white")}>
              {/* No visible note (client, 2026-11-24): the shaded cell spanning
                  the paid plans says "the same on all of them" on its own. */}
              <span className="sr-only">The same on Starter, Pro and Business: </span>
              {/* Two by two until xl: at 1024px four in a row wrap mid-unit. */}
              <span className="grid grid-cols-2 gap-x-4 gap-y-3 xl:grid-cols-4 xl:gap-x-6">
                {COMPUTE_USAGE_RATES.map(({ icon: Icon, name, rate }) => (
                  <span key={name}>
                    {/* A small glyph per meter (client, 2026-11-24), so the
                        four rates read apart at a glance. */}
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon aria-hidden className="size-3.5 shrink-0 text-prism-red-500" />
                      {name}
                    </span>
                    {/* No tabular-nums: it widens the hyphen in "GB-hour". */}
                    <span className="mt-0.5 block whitespace-nowrap font-medium text-foreground">
                      {rate}
                    </span>
                  </span>
                ))}
              </span>
            </td>
          </tr>
        </TableSection>

        <TableSection section="postgres">
          <PlanRow
            label="Operations included"
            first
            cell={(plan) => <Value value={plan.ops} strong />}
          />
          <PlanRow label="Extra operations" cell={(plan) => <Value value={plan.opsRate} />} />
          <PlanRow
            label="Storage included"
            cell={(plan) => <Value value={plan.storage} strong />}
          />
          <PlanRow label="Extra storage" cell={(plan) => <Value value={plan.storageRate} />} />
          <PlanRow label="Databases" cell={(plan) => <Value value={plan.databases} />} />
          <PlanRow
            label="Backups"
            cell={(plan) =>
              plan.backups ?? <span className="text-muted-foreground">{NOT_AVAILABLE}</span>
            }
          />
        </TableSection>

        {/* Databases, backups, spend limits and compliance were on the cards
            this table replaced, and people choose plans on them (client,
            2026-11-24: "some information missing"). Worded as in the
            Compare plans table, so the two agree. */}
        <TableSection section="platform">
          <PlanRow label="Spend limits" first cell={(plan) => plan.spendLimit} />
          <PlanRow label="Compliance" cell={(plan) => renderFaqAnswer(plan.compliance)} />
        </TableSection>

        {/* Buttons at the bottom (client, 2026-11-24): read the pricing
            first, then choose. One width for all four: sized to their
            labels they made a ragged row. */}
        <tfoot>
          <tr>
            <td className={cn(FRAME_L, FRAME_B, "rounded-bl-2xl bg-white")} />
            {PLANS.map((plan, i) => (
              <td
                key={plan.name}
                className={cn(
                  COL,
                  FRAME_B,
                  "bg-white px-4 pb-7 pt-2 xl:px-6",
                  i === LAST && cn(FRAME_R, "rounded-br-2xl"),
                )}
              >
                <div className="w-full max-w-[10.5rem]">
                  <Cta plan={plan} compact />
                </div>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ----------------------------------------------------- phones and tablets */

// The same two sections, turned on their side: plans become rows, so nothing
// scrolls sideways. The plan list comes first with its buttons, then Compute
// (included requests per plan, the shared rates once), then Postgres.

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-black/[0.06] bg-white", className)}>
      {children}
    </div>
  );
}

const MINI_TH = "pb-2 text-left text-xs font-normal text-muted-foreground";
const MINI_TD = "py-3 align-top text-sm";

/** A plan-per-row table with two value columns, for the phone layout. */
function MiniTable({
  caption,
  columns,
  cells,
}: {
  caption: string;
  columns: [string, string];
  cells: (plan: Plan) => [React.ReactNode, React.ReactNode];
}) {
  return (
    <table className="mt-5 w-full table-fixed">
      <caption className="sr-only">{caption}</caption>
      <colgroup>
        <col className="w-[30%]" />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" className={MINI_TH}>
            Plan
          </th>
          {columns.map((c) => (
            <th key={c} scope="col" className={MINI_TH}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PLANS.map((plan) => (
          <tr key={plan.name} className={cn("border-t", HAIR)}>
            <th scope="row" className={cn(MINI_TD, "text-left font-normal text-muted-foreground")}>
              {plan.name}
            </th>
            {cells(plan).map((cell, i) => (
              <td key={i} className={cn(MINI_TD, i === 0 && "pr-3")}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PlansStacked() {
  return (
    <div className="space-y-4 lg:hidden">
      <Panel>
        <ul className={cn("divide-y", LINE)}>
          {PLANS.map((plan) => (
            <li
              key={plan.name}
              className={cn(
                "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
                plan.popular && POPULAR_TINT,
              )}
            >
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {plan.name}
                  {plan.popular && <Marker>Most popular</Marker>}
                </p>
                <div className="mt-1">
                  <Price plan={plan} large />
                </div>
                {plan.note && <p className="mt-1 text-xs text-muted-foreground">{plan.note}</p>}
              </div>
              {/* Full width on phones, so the buttons line up; a fixed
                  width beside the price from sm. */}
              <div className="sm:w-52 sm:shrink-0">
                <Cta plan={plan} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="p-5 sm:p-6">
        <p className="flex flex-col gap-1">
          <SectionHead section="compute" />
        </p>
        <table className="mt-5 w-full">
          <caption className="sr-only">Prisma Compute requests included per plan</caption>
          <thead>
            <tr>
              <th scope="col" className={MINI_TH}>
                Plan
              </th>
              <th scope="col" className={MINI_TH}>
                Requests included
              </th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map((plan) => (
              <tr key={plan.name} className={cn("border-t", HAIR)}>
                <th
                  scope="row"
                  className={cn(MINI_TD, "text-left font-normal text-muted-foreground")}
                >
                  {plan.name}
                </th>
                <td className={MINI_TD}>
                  <Value value={plan.requests} strong />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={cn("mt-2 border-t pt-4", LINE)}>
          <p className="text-xs font-semibold text-foreground">
            Usage rates, the same on Starter, Pro and Business
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
            {COMPUTE_USAGE_RATES.map(({ icon: Icon, name, rate }) => (
              <div key={name}>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon aria-hidden className="size-3.5 shrink-0 text-prism-red-500" />
                  {name}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">{rate}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">Free: {FREE_COMPUTE_NOTE}</p>
        </div>
      </Panel>

      <Panel className="p-5 sm:p-6">
        <p className="flex flex-col gap-1">
          <SectionHead section="postgres" />
        </p>
        <table className="mt-5 w-full table-fixed">
          <caption className="sr-only">Prisma Postgres operations and storage per plan</caption>
          <colgroup>
            <col className="w-[30%]" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={MINI_TH}>
                Plan
              </th>
              <th scope="col" className={MINI_TH}>
                Operations
              </th>
              <th scope="col" className={MINI_TH}>
                Storage
              </th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map((plan) => (
              <tr key={plan.name} className={cn("border-t", HAIR)}>
                <th
                  scope="row"
                  className={cn(MINI_TD, "text-left font-normal text-muted-foreground")}
                >
                  {plan.name}
                </th>
                <td className={cn(MINI_TD, "pr-3")}>
                  <Value value={plan.ops} strong />
                  <span className="block text-xs text-muted-foreground">
                    {plan.opsRate ? `then ${plan.opsRate}` : NO_USAGE_BILLING}
                  </span>
                </td>
                <td className={MINI_TD}>
                  <Value value={plan.storage} strong />
                  <span className="block text-xs text-muted-foreground">
                    {plan.storageRate ? `then ${plan.storageRate}` : NO_USAGE_BILLING}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <MiniTable
          caption="Prisma Postgres databases and backups per plan"
          columns={["Databases", "Backups"]}
          cells={(plan) => [plan.databases, plan.backups ?? NOT_AVAILABLE]}
        />
      </Panel>

      <Panel className="p-5 sm:p-6">
        <p className="flex flex-col gap-1">
          <SectionHead section="platform" />
        </p>
        <MiniTable
          caption="Spend limits and compliance per plan"
          columns={["Spend limits", "Compliance"]}
          cells={(plan) => [plan.spendLimit, renderFaqAnswer(plan.compliance)]}
        />
      </Panel>
    </div>
  );
}

// Renders bare: no <section>, no gutter, no max-width. The plans live inside
// the hero panel (PricingHero takes them as children), which provides all
// three.
export function PricingPlans() {
  return (
    <>
      <PlansTable />
      <PlansStacked />
      {/* Forwards estimates shared before the calculator moved, and keeps
          the old #estimate anchor; renders nothing visible. */}
      <PricingCalculatorLink />

      {/* One quiet footer line: where to go next on the left (most visitors
          never scroll past the plans), custom pricing on the right. */}
      <div className="mt-8 flex flex-col gap-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="More on this page">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {JUMP_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="rounded-sm text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted-foreground">
          Need more? Custom pricing is available for high-volume teams.{" "}
          <a
            href="/contact"
            className="whitespace-nowrap rounded-sm font-medium text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            Contact us
          </a>
        </p>
      </div>
    </>
  );
}
