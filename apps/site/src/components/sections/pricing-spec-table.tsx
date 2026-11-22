import Link from "next/link";
import { Marker } from "@/components/brand/marker";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import {
  AppWindow,
  CheckBold,
  Database,
  Layers,
  Server,
  Shield,
  Table,
} from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// The site's prismatic halo, lifted verbatim from hero-home.tsx. Conic rather
// than linear is the whole point: it wraps the perimeter, so a single layer
// gives an even glow on all four sides. An earlier attempt here stacked ten
// radial gradients to fake that and read as separate coloured blobs.
const HALO =
  "conic-gradient(var(--color-prism-yellow-300), var(--color-prism-red-500) 32%, var(--color-prism-cyan-400) 64%, var(--color-prism-yellow-300))";

// Detailed spec table — Shane (2026-07-29): "we'd need to bring back the
// detailed spec tables further down the page, these tend to be quite
// important for our users". Also the "full limits table lower on the page"
// Ankur asked for.
//
// Rows and values are taken from the live "Compare plans" table
// (https://www.prisma.io/pricing, read 2026-07-29) so the structure matches
// what their users already know.
//
// Every cell carries a real figure — there are no placeholders. The four rows
// that once read "TBC" (cache tag invalidations, cache purge requests, Free
// backups, support tiers) were restored from the pre-rebrand pricing table at
// apps/site/src/app/pricing/pricing-data.ts (commit 528ab05fc^), which is the
// same live table this one was modelled on. If a figure genuinely moves, edit
// it — don't reintroduce a placeholder, since the page has no legend
// explaining one (that note was pulled on the client's instruction 2026-07-30).
//
// The Accelerate open question was resolved 2026-08-25: the limits come back,
// but only in this table — deliberately NOT in the plan cards, so they are
// documented without being highlighted. The 60,000-operation allowance,
// operation overage, and per-query egress figures are the last ones the old
// site published, from the plan cards' acceleratePoints in pricing-data.ts at
// b41116959; the invalidation and purge rows were already restored from its
// comparison table.
const YES = "yes";

// Words instead of a bare em dash (critique 2026-11-22: one dash meant three
// different things, and at 2.1:1 it barely showed). Wording is the docs' own
// (docs compute/pricing.mdx "Included usage by plan", checked 2026-11-22), so
// the page and the docs say the same thing:
//  - HARD_LIMIT ("No usage billing"): Free has monthly limits and no usage
//    billing, so there is no overage price. (Postgres: queries stop at the
//    Free allowance, docs postgres/faq.mdx. Compute: the docs don't say what
//    happens at the limit, so the cell says only what they do say.)
//  - NOT_AVAILABLE: the feature isn't on that plan (Free backups, cache tag
//    invalidations on Free and Starter).
const HARD_LIMIT = "No usage billing";
const NOT_AVAILABLE = "Not available";
const QUIET_VALUES = new Set([HARD_LIMIT, NOT_AVAILABLE, "—"]);

type CellLink = { token: string; href: string };
type Row = {
  label: string;
  values: [string, string, string, string];
  /** Optional per-column list of inline link spans. Keyed by column index
      (0-3), each entry splices a next/link in for the first match of each
      token inside the plain cell string. */
  cellLinks?: Partial<Record<0 | 1 | 2 | 3, CellLink[]>>;
};

type Group = {
  label: string;
  /** Glyph + brand colour, cycling the prism trio down the table so the group
      bands give a long table some rhythm to navigate by. */
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  rows: Row[];
  /** An optional link shown at the right of the group header, for a group
      whose label alone leaves the reader with nowhere to go next. */
  note?: { text: string; href: string };
};

// Monthly price is plan-level, not a Postgres feature, so it sits above the
// product groups rather than inside one — hoisted when "Database usage" was
// renamed "Prisma Postgres" to mirror the plan cards' group labels (Shane,
// 2026-08-24).
const PLAN_ROW: Row = {
  label: "Monthly price",
  values: ["$0", "$10", "$49", "$129"],
};

export const GROUPS: Group[] = [
  {
    label: "Prisma Postgres",
    icon: Database,
    color: "text-prism-cyan-500",
    rows: [
      {
        label: "Operations included",
        values: ["200k", "1M", "10M", "50M"],
      },
      {
        label: "Operation overage",
        values: ["No usage billing", "$8 per million", "$2 per million", "$1 per million"],
      },
      {
        label: "Storage included",
        values: ["2 GB", "10 GB", "50 GB", "100 GB"],
      },
      {
        label: "Storage overage",
        values: ["No usage billing", "$2.00 per GB", "$1.50 per GB", "$1.00 per GB"],
      },
      { label: "Databases", values: ["50", "1,000", "1,000", "1,000"] },
      {
        label: "Data transfer",
        values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      },
      // The Console's spending limit is a paid-plan setting (docs
      // console/more/billing.mdx). Free has no usage billing and its queries
      // stop at the allowance, so its spending is capped at $0 in effect:
      // "Fixed at $0" is true and is the fair reading (client, 2026-11-22).
      // Pinned by pricing-claims.test.tsx.
      { label: "Spend limits", values: ["Fixed at $0, no card required", YES, YES, YES] },
    ],
  },
  {
    // Compute GA (Shane, 2026-08-24): Compute pricing goes in this table, not
    // its own section. Numbers are LOCKED IN, hand-entered by Shane, and must
    // match the plan cards (pricing-plans.tsx). Free has hard monthly limits
    // for every meter and no usage billing. Paid plans include requests and
    // bill memory, CPU, and bandwidth by use.
    label: "Prisma Compute",
    icon: AppWindow,
    // -500 rather than -400: at 16px on white the lighter amber reads as washed
    // out next to the cyan and red glyphs.
    color: "text-prism-yellow-500",
    rows: [
      {
        label: "Requests included",
        values: ["1M", "5M", "20M", "100M"],
      },
      {
        label: "Request price",
        values: ["No usage billing", "$1 per million", "$1 per million", "$1 per million"],
      },
      // One row per meter (client, 2026-11-22: "clear and honest, but not
      // unnecessarily unfair to us"). Free shows its monthly allowance; paid
      // plans show the rate they bill per use from the first unit (docs
      // compute/pricing.mdx: paid plans include no memory, CPU or bandwidth).
      // The earlier "included" + "price" pair put "Billed per use" under an
      // "…included" label beside Free's allowance, which read as upgrading
      // taking something away. Same facts, without the false downgrade.
      {
        label: "Provisioned memory",
        values: [
          "360 GB-hours / month",
          "$0.006 per GB-hour",
          "$0.006 per GB-hour",
          "$0.006 per GB-hour",
        ],
      },
      {
        label: "Active CPU",
        values: [
          "4 vCPU-hours / month",
          "$0.064 per vCPU-hour",
          "$0.064 per vCPU-hour",
          "$0.064 per vCPU-hour",
        ],
      },
      {
        label: "Outbound bandwidth",
        values: ["10 GB / month", "$0.025 per GB", "$0.025 per GB", "$0.025 per GB"],
      },
      { label: "Scale to zero when idle", values: [YES, YES, YES, YES] },
    ],
  },
  {
    label: "Managed connection pool",
    icon: Server,
    color: "text-prism-red-500",
    rows: [
      {
        label: "Connection limit (pooled)",
        values: ["10", "100", "500", "1,000"],
      },
      { label: "Connection limit (direct)", values: ["10", "10", "50", "100"] },
      {
        label: "Connection idle timeout",
        values: ["60 minutes", "60 minutes", "60 minutes", "60 minutes"],
      },
      // Was "Auto-scaling: Included", carried over from the Accelerate
      // connection pool. The Prisma Postgres pool has fixed per-plan limits
      // and runs PgBouncer "in transactional pool mode"
      // (docs/postgres/database/connection-pooling, checked 2026-10-22).
      {
        label: "Pool mode",
        values: ["Transaction", "Transaction", "Transaction", "Transaction"],
      },
      {
        label: "Operation response size",
        values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      },
      // "Pooled connections enforce a 10-minute query timeout ... a direct
      // connection where no timeout is enforced"
      // (docs/postgres/database/connection-pooling, checked 2026-10-22).
      {
        label: "Operation duration (db queries)",
        values: [
          "10 min pooled, unlimited direct",
          "10 min pooled, unlimited direct",
          "10 min pooled, unlimited direct",
          "10 min pooled, unlimited direct",
        ],
      },
      {
        label: "Operation duration (interactive)",
        values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      },
    ],
  },
  {
    // Accelerate limits restored 2026-08-25 — table only, not the plan cards
    // (see the header note). Values are the old site's last published figures.
    // Accelerate retires on December 1, 2026 and bills until then, so the rows
    // stay, the label carries the date, and the header links to the switch
    // guide at /docs/postgres/database/switch-from-accelerate.
    label: "Accelerate cache (retires December 1, 2026)",
    icon: Layers,
    color: "text-prism-cyan-500",
    note: { text: "How to switch", href: "/docs/postgres/database/switch-from-accelerate" },
    rows: [
      {
        label: "Operations included",
        values: ["60,000", "60,000", "60,000", "60,000"],
      },
      {
        label: "Operation overage",
        values: ["No usage billing", "$0.018 per 1,000", "$0.008 per 1,000", "$0.006 per 1,000"],
      },
      {
        label: "Egress included",
        values: ["1 KiB per query", "1 KiB per query", "1 KiB per query", "2 KiB per query"],
      },
      {
        label: "Egress overage",
        values: ["No usage billing", "$0.09 per GiB", "$0.09 per GiB", "$0.08 per GiB"],
      },
      // Live-page values, restored from the pre-rebrand table
      // (apps/site/src/app/pricing/pricing-data.ts at 528ab05fc^). Free and
      // Starter get no tag invalidations at all, hence the em dash.
      {
        label: "Cache tag invalidations",
        values: [
          "Not available",
          "Not available",
          "$0.002 per 1,000, max 10,000 per day",
          "$0.001 per 1,000, max 100,000 per day",
        ],
      },
      {
        label: "Cache purge requests",
        values: ["5 per hour", "5 per hour", "10 per hour", "20 per hour"],
      },
    ],
  },
  {
    label: "Data",
    icon: Table,
    // -500 rather than -400: at 16px on white the lighter amber reads as washed
    // out next to the cyan and red glyphs.
    color: "text-prism-yellow-500",
    rows: [
      { label: "Query insights", values: [YES, YES, YES, YES] },
      { label: "View and edit your data", values: [YES, YES, YES, YES] },
      // Free has no backups: /postgres/database/backups says snapshots are a
      // Starter, Pro, and Business feature, so the em dash is the right cell.
      {
        label: "Backups",
        values: [
          "Not available",
          "Daily, 7-day retention",
          "Daily, 7-day retention",
          "Daily, 30-day retention",
        ],
      },
    ],
  },
  {
    label: "Platform",
    icon: Shield,
    color: "text-prism-red-500",
    rows: [
      // Live page: Community / Community / Standard / Premium. Gregory's May
      // notes said Community / Community / 24h / 2h; the live page wins, as
      // with every other figure in this table.
      {
        label: "Support",
        values: ["Community", "Community", "Standard", "Premium"],
      },
      {
        label: "Compliance",
        values: ["GDPR", "GDPR", "GDPR", "GDPR, HIPAA, SOC 2, ISO 27001"],
        // Business-column HIPAA deep-links to /postgres/hipaa; the Cell
        // renderer swaps the plain string for a mix of text and a next/link
        // for the HIPAA token (the only cell on this page that opts in).
        cellLinks: {
          3: [{ token: "HIPAA", href: "/postgres/hipaa" }],
        },
      },
      { label: "Prisma ORM", values: ["Free", "Free", "Free", "Free"] },
    ],
  },
];

const PLAN_NAMES = ["Free", "Starter", "Pro", "Business"];

const SIGN_UP = "https://console.prisma.io/sign-up";
// Same labels as the plan cards (pricing-plans.tsx), so the CTA reads the
// same wherever someone decides. `short` is for the phone's 2×2 grid, where
// "Start on Business" doesn't fit half a 343px column.
const PLAN_CTAS = [
  { plan: "free", label: "Start for free", short: "Start free" },
  { plan: "starter", label: "Start on Starter", short: "Starter" },
  { plan: "pro", label: "Start on Pro", short: "Pro" },
  { plan: "business", label: "Start on Business", short: "Business" },
];
// Starter carries "Most popular" on the cards, so it reads as the lit column here too.
const HIGHLIGHT = 1;

function Cell({
  value,
  highlight,
  links,
}: {
  value: string;
  highlight: boolean;
  links?: CellLink[];
}) {
  if (value === YES) {
    // cyan-700, not -500: the lighter tick was 2.3:1 on white, under the 3:1
    // a meaningful icon needs (WCAG 1.4.11).
    return <CheckBold role="img" className="size-4 text-prism-cyan-700" aria-label="Included" />;
  }
  return (
    <span
      className={cn(
        "text-sm leading-relaxed",
        QUIET_VALUES.has(value)
          ? "text-muted-foreground"
          : highlight
            ? "font-semibold text-foreground"
            : "text-foreground",
      )}
    >
      {links && links.length > 0 ? renderCellWithLinks(value, links) : value}
    </span>
  );
}

// Splice next/link spans into a plain cell string for the first occurrence of
// each token, in token order. The pricing cells are static strings and only
// the Business Compliance cell opts in today, so a left-to-right pass is
// enough.
function renderCellWithLinks(value: string, links: CellLink[]) {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  links.forEach(({ token, href }, i) => {
    const index = value.indexOf(token, cursor);
    if (index === -1) return;
    if (index > cursor) nodes.push(value.slice(cursor, index));
    nodes.push(
      <Link key={`${href}-${i}`} href={href} className="underline-offset-4 hover:underline">
        {token}
      </Link>,
    );
    cursor = index + token.length;
  });
  if (cursor < value.length) nodes.push(value.slice(cursor));
  return <>{nodes}</>;
}

// One row of the mobile feature-first pivot — uniform rows collapse to a
// single line, differing rows fan out into the 2x2 plan grid (see the layout
// note in PricingSpecTable). Shared by the group rows and the hoisted
// Monthly price row so the two can't drift apart.
function MobileRow({ row }: { row: Row }) {
  const uniform = row.values.every((v) => v === row.values[0]);
  return (
    <div className="border-t border-black/[0.06] px-5 py-3.5 first:border-t-0">
      {uniform ? (
        <div className="flex items-start justify-between gap-4">
          <dt className="text-sm leading-relaxed text-muted-foreground">{row.label}</dt>
          <dd className="shrink-0 text-right">
            <Cell value={row.values[0]} highlight links={row.cellLinks?.[0]} />
          </dd>
        </div>
      ) : (
        <>
          <dt className="text-sm leading-relaxed text-muted-foreground">{row.label}</dt>
          <dd className="mt-2.5 grid grid-cols-2 gap-2">
            {row.values.map((v, i) => (
              <div
                key={PLAN_NAMES[i]}
                className={cn(
                  "rounded-lg px-3 py-2",
                  // Recommended plan lifted on white, the rest recessed — the
                  // site's before/after language from pricing-comparison.tsx.
                  i === HIGHLIGHT ? "bg-white ring-1 ring-black/[0.09]" : "bg-foreground/[0.03]",
                )}
              >
                <p className="text-[0.6875rem] font-medium text-muted-foreground">
                  {PLAN_NAMES[i]}
                </p>
                <div className="mt-1">
                  <Cell
                    value={v}
                    highlight={i === HIGHLIGHT}
                    links={row.cellLinks?.[i as 0 | 1 | 2 | 3]}
                  />
                </div>
              </div>
            ))}
          </dd>
        </>
      )}
    </div>
  );
}

// One row of the desktop table, same sharing rationale as MobileRow.
function DesktopRow({ row }: { row: Row }) {
  return (
    <tr className="border-t border-black/[0.06]">
      <th
        scope="row"
        className="px-5 py-3.5 text-sm font-normal leading-relaxed text-muted-foreground"
      >
        {row.label}
      </th>
      {row.values.map((v, i) => (
        <td key={i} className="px-5 py-3.5 align-top">
          <Cell value={v} highlight={i === HIGHLIGHT} links={row.cellLinks?.[i as 0 | 1 | 2 | 3]} />
        </td>
      ))}
    </tr>
  );
}

// overflow-x-clip on the section contains the glow's horizontal bleed:
// -inset-x-10 is wider than the mobile gutter and pushed the document 24px
// sideways. `clip` rather than `hidden` so it doesn't become a scroll container.
export function PricingSpecTable() {
  return (
    <section id="compare-plans" className="scroll-mt-24 overflow-x-clip bg-white px-4 sm:px-8">
      <div className="mx-auto max-w-site py-16 sm:py-24">
        <Reveal>
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Compare plans
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            Everything below is included with your plan, across Prisma Postgres and Prisma Compute.
          </p>
        </Reveal>

        {/* The table was the only block on the page with no brand presence at
            all — bare white, while every other section sits in a panel with the
            spectral wash. */}
        <Reveal delay={0.15} className="relative mt-10">
          {/* The hero's prismatic halo — same two layers and geometry: a tight
              inner edge plus a soft outer bloom, hugging the table rather than
              spreading into the copy around it.
              Opacity is a third of the hero's 60/40. The hero's card is the
              focal point of the page and earns a bright halo; this is a dense
              data table where the glow should only suggest the brand, so at the
              hero's values it competed with the content. Dialled down twice on
              the client's eye — don't "resync" it with the hero. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-20 blur-[20px]"
            style={{ background: HALO }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 rounded-3xl opacity-10 blur-[56px]"
            style={{ background: HALO }}
          />
          {/* Mobile and tablet: every plan visible at once, nothing to open.
              The table is 832px wide against a ~356px viewport, so Pro and
              Business sat outside a horizontal scroller with nothing to signal
              they were there, and values clipped mid-word. Four columns of spec
              text cannot fit that width, so the data is pivoted feature-first
              instead of plan-first: each feature states its four values
              together, which keeps the comparison the table exists to make.
              The uniform-row collapse is what makes that affordable. Roughly
              half the rows are identical across all four plans (every
              "Unlimited", every all-plans check, every flat per-unit price), so
              those render as one line instead of a four-cell grid. Without it the pivot would be roughly twice as
              long for no added information — and it has the side effect of
              making the rows where plans actually DIFFER the visually
              prominent ones.
              The crossover is lg, not md: the table needs its 832px min-width
              plus the section's 64px of gutter, so at md (768px) it still hid
              130px inside the scroller. It fits cleanly from ~900px, and lg is
              the first standard breakpoint past that. */}
          {/* overflow-clip, not -hidden: clip doesn't create a scroll
              container, so the sticky group headings below stick to the
              viewport rather than to this box. */}
          <div className="relative overflow-clip rounded-2xl border border-black/[0.06] bg-white lg:hidden">
            {/* Monthly price sits above the product groups, ungrouped — it's
                the plan's price, not a Postgres or Compute feature. */}
            <div className="border-b border-black/[0.06]">
              <dl>
                <MobileRow row={PLAN_ROW} />
              </dl>
            </div>
            {GROUPS.map((group) => (
              <div key={group.label} className="border-b border-black/[0.06] last:border-b-0">
                {/* Sticky just under the floating nav (its pill ends at 68px on
                    phones), so seven screens in you still
                    know which group a row belongs to. A heading, so screen
                    readers can jump between groups. Opaque paper rather than
                    the old 3% wash, which showed rows through it once stuck. */}
                <h3 className="sticky top-[4.5rem] z-10 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-[4.5rem] before:bg-white flex items-center gap-2.5 border-b border-black/[0.06] bg-paper px-5 py-3 text-sm font-semibold text-foreground">
                  <group.icon aria-hidden className={cn("size-4 shrink-0", group.color)} />
                  {group.label}
                  {group.note && (
                    <Link
                      href={group.note.href}
                      className="ml-auto inline-flex min-h-6 shrink-0 items-center text-xs font-normal text-muted-foreground underline underline-offset-2"
                    >
                      {group.note.text}
                    </Link>
                  )}
                </h3>
                <dl>
                  {group.rows.map((row) => (
                    <MobileRow key={row.label} row={row} />
                  ))}
                </dl>
              </div>
            ))}
            {/* The table ends on a next step, not on the last row. */}
            <div className="border-t border-black/[0.06] bg-paper px-5 py-5">
              <p className="text-sm font-semibold text-foreground">Get started</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {PLAN_CTAS.map((cta, i) =>
                  i === HIGHLIGHT ? (
                    <PrismButton
                      key={cta.plan}
                      href={SIGN_UP}
                      fullWidth
                      ctaLocation="pricing_compare_plans"
                      className="text-[15px]"
                    >
                      {cta.short}
                    </PrismButton>
                  ) : (
                    <PrismButtonOutline
                      key={cta.plan}
                      href={SIGN_UP}
                      ctaLocation="pricing_compare_plans"
                      className="w-full text-[15px]"
                    >
                      {cta.short}
                    </PrismButtonOutline>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* No overflow-x-auto here any more: a scroll container would make
              the sticky header stick to this box instead of the viewport.
              The table only renders from lg, where it fits (see above), and
              overflow-clip keeps the rounded corners without scrolling. */}
          <div className="relative hidden overflow-clip rounded-2xl border border-black/[0.06] bg-white lg:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Feature and limit comparison across the Free, Starter, Pro and Business plans
              </caption>
              <colgroup>
                <col />
                <col />
                <col className="bg-paper" />
                <col />
                <col />
              </colgroup>
              <thead>
                {/* Sticky under the floating nav (its pill ends at 100px), so
                    the plan names and prices stay in view for the whole
                    2,000px of rows. Each cell is opaque so rows scroll under
                    it cleanly; the inset shadow is the header's bottom rule.
                    The ::before band whites out the strip above the stuck
                    header, where rows otherwise show around the floating nav
                    pill; overflow-clip on the wrapper hides it until the
                    header is actually stuck. */}
                <tr>
                  <th
                    scope="col"
                    className="sticky top-[6.25rem] z-10 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-[6.25rem] before:bg-white bg-white px-5 pb-4 pt-5 shadow-[inset_0_-1px_0_rgba(21,21,21,0.08)]"
                  >
                    <span className="sr-only">Feature</span>
                  </th>
                  {PLAN_NAMES.map((name, i) => (
                    <th
                      key={name}
                      scope="col"
                      className={cn(
                        "sticky top-[6.25rem] z-10 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-[6.25rem] before:bg-white px-5 pb-4 pt-5 shadow-[inset_0_-1px_0_rgba(21,21,21,0.08)]",
                        i === HIGHLIGHT ? "bg-paper" : "bg-white",
                      )}
                    >
                      {/* The lit column gets a spectrum cap rather than relying
                          on the paper tint alone, which was almost invisible. */}
                      {i === HIGHLIGHT && (
                        <span
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-[3px]"
                          style={{ backgroundImage: SPECTRUM }}
                        />
                      )}
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            i === HIGHLIGHT ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {name}
                        </span>
                        {i === HIGHLIGHT && <Marker>Most popular</Marker>}
                      </span>
                      {/* The price lives in the header now, so it stays in
                          view; it replaces the old "Monthly price" row. */}
                      <span className="mt-1 block font-heading text-xl font-medium tabular-nums text-foreground">
                        {PLAN_ROW.values[i]}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          / month
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {GROUPS.map((group) => (
                <tbody key={group.label}>
                  <tr>
                    {/* Sentence case with the group's glyph in a brand colour.
                        Not uppercase or letter-spaced: role-kicker.tsx sets that
                        rule for the site's labels, and this table was the one
                        place still breaking it. */}
                    <th
                      scope="rowgroup"
                      colSpan={5}
                      className="border-t border-black/[0.06] bg-card px-5 py-3"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                        <group.icon aria-hidden className={cn("size-4 shrink-0", group.color)} />
                        {group.label}
                        {group.note && (
                          <Link
                            href={group.note.href}
                            className="ml-auto shrink-0 text-xs font-normal text-muted-foreground underline underline-offset-2"
                          >
                            {group.note.text}
                          </Link>
                        )}
                      </span>
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <DesktopRow key={row.label} row={row} />
                  ))}
                </tbody>
              ))}
              {/* The table ends on a next step: one button per plan, under its
                  column, the same labels as the plan cards. */}
              <tfoot>
                <tr className="border-t border-black/[0.06]">
                  <td className="px-5 py-6 text-sm text-muted-foreground">Get started</td>
                  {PLAN_CTAS.map((cta, i) => (
                    <td key={cta.plan} className="px-5 py-6">
                      {i === HIGHLIGHT ? (
                        <PrismButton href={SIGN_UP} fullWidth ctaLocation="pricing_compare_plans">
                          {cta.label}
                        </PrismButton>
                      ) : (
                        <PrismButtonOutline
                          href={SIGN_UP}
                          ctaLocation="pricing_compare_plans"
                          className="w-full"
                        >
                          {cta.label}
                        </PrismButtonOutline>
                      )}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
