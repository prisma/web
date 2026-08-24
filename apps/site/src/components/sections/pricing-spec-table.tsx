import { Marker } from "@/components/brand/marker";
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
// what their users already know. Two items still need a ruling:
//
//  - BACKUPS is not in their live table at all. Starter/Pro/Business come from
//    the approved V2 plan cards; Free's retention has never been supplied, so
//    it is left as PENDING rather than guessed.
//  - GLOBAL CACHE rows are published under "included with Prisma Postgres",
//    but Gregory said Accelerate is being deprecated and should come off the
//    page. Confirm whether the cache rows stay.
//  - SUPPORT reads Community / Community / Standard / Premium on the live
//    page, where Gregory's May notes said Community / Community / 24h / 2h.
//    The live page wins here, as with every other figure.
//
// The reader-facing legend under this table ("TBC — awaiting confirmation…, an
// em dash means not included") was removed on the client's instruction
// (2026-07-30). It was half internal note anyway and shouldn't ship to Prisma's
// users. Consequence: nothing on the page now spells out the TBC-vs-em-dash
// distinction, so the badge's title tooltip is the only affordance left. The
// three open questions above are tracked here and in the project's open-items
// list — they are NOT resolved just because the note is gone.
const PENDING = "TBC";

const YES = "yes";

type Row = { label: string; values: [string, string, string, string] };

type Group = {
  label: string;
  /** Glyph + brand colour, cycling the prism trio down the table so the group
      bands give a long table some rhythm to navigate by. */
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  rows: Row[];
};

// Monthly price is plan-level, not a Postgres feature, so it sits above the
// product groups rather than inside one — hoisted when "Database usage" was
// renamed "Prisma Postgres" to mirror the plan cards' group labels (Shane,
// 2026-08-24).
const PLAN_ROW: Row = {
  label: "Monthly price",
  values: ["$0", "$10", "$49", "$129"],
};

const GROUPS: Group[] = [
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
        values: ["—", "$8 per million", "$2 per million", "$1 per million"],
      },
      {
        label: "Storage included",
        values: ["500 MB", "10 GB", "50 GB", "100 GB"],
      },
      {
        label: "Storage overage",
        values: ["—", "$2.00 per GB", "$1.50 per GB", "$1.00 per GB"],
      },
      { label: "Databases", values: ["50", "1,000", "1,000", "1,000"] },
      {
        label: "Data transfer",
        values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      },
      { label: "Spend limits", values: ["—", YES, YES, YES] },
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
        values: ["—", "$1 per million", "$1 per million", "$1 per million"],
      },
      {
        label: "Provisioned memory included",
        values: ["360 GB-hours", "—", "—", "—"],
      },
      {
        label: "Provisioned memory price",
        values: ["—", "$0.006 per GB-hour", "$0.006 per GB-hour", "$0.006 per GB-hour"],
      },
      {
        label: "Active CPU included",
        values: ["4 vCPU-hours", "—", "—", "—"],
      },
      {
        label: "Active CPU price",
        values: ["—", "$0.064 per vCPU-hour", "$0.064 per vCPU-hour", "$0.064 per vCPU-hour"],
      },
      {
        label: "Outbound bandwidth included",
        values: ["10 GB", "—", "—", "—"],
      },
      {
        label: "Outbound bandwidth price",
        values: ["—", "$0.025 per GB", "$0.025 per GB", "$0.025 per GB"],
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
      { label: "Auto-scaling", values: [YES, YES, YES, YES] },
      {
        label: "Operation response size",
        values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      },
      {
        label: "Operation duration (db queries)",
        values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      },
      {
        label: "Operation duration (interactive)",
        values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      },
    ],
  },
  {
    label: "Global cache",
    icon: Layers,
    color: "text-prism-cyan-500",
    rows: [
      // Live values are $0.0020 / $0.0010 per 1,000 and 5/5/10/20 purges per
      // hour, but Gregory said Accelerate is being deprecated — so whether
      // this group belongs on the page at all is unresolved. Placeholder.
      {
        label: "Cache tag invalidations",
        values: [PENDING, PENDING, PENDING, PENDING],
      },
      {
        label: "Cache purge requests",
        values: [PENDING, PENDING, PENDING, PENDING],
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
      {
        label: "Backups",
        values: [
          PENDING,
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
      // live page: Community / Community / Standard / Premium
      // Gregory (May): Community / Community / 24h / 2h — unresolved, so placeholder
      { label: "Support", values: [PENDING, PENDING, PENDING, PENDING] },
      {
        label: "Compliance",
        values: ["GDPR", "GDPR", "GDPR, HIPAA", "GDPR, HIPAA, SOC 2, ISO 27001"],
      },
      { label: "Prisma ORM", values: ["Free", "Free", "Free", "Free"] },
    ],
  },
];

const PLAN_NAMES = ["Free", "Starter", "Pro", "Business"];
// Starter carries "Most popular" on the cards, so it reads as the lit column here too.
const HIGHLIGHT = 1;

function Cell({ value, highlight }: { value: string; highlight: boolean }) {
  if (value === YES) {
    return <CheckBold className="size-4 text-prism-cyan-500" aria-label="Included" />;
  }
  // A placeholder means "we have not been given this" — it must never read as
  // "not included", which is what the em-dash means.
  if (value === PENDING) {
    return (
      <span
        title="Awaiting confirmation from Prisma"
        className="inline-flex rounded border border-dashed border-black/20 px-1.5 py-0.5 text-xs font-medium text-muted-foreground/70"
      >
        {PENDING}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "text-sm leading-relaxed",
        value === "—"
          ? "text-muted-foreground/50"
          : highlight
            ? "font-semibold text-foreground"
            : "text-foreground",
      )}
    >
      {value}
    </span>
  );
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
            <Cell value={row.values[0]} highlight />
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
                  <Cell value={v} highlight={i === HIGHLIGHT} />
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
          <Cell value={v} highlight={i === HIGHLIGHT} />
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
    <section className="overflow-x-clip bg-white px-4 sm:px-8">
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
              "Unlimited", every all-plans check, every four-way TBC), so
              those render as one line instead of a four-cell grid. Without it the pivot would be roughly twice as
              long for no added information — and it has the side effect of
              making the rows where plans actually DIFFER the visually
              prominent ones.
              The crossover is lg, not md: the table needs its 832px min-width
              plus the section's 64px of gutter, so at md (768px) it still hid
              130px inside the scroller. It fits cleanly from ~900px, and lg is
              the first standard breakpoint past that. */}
          <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white lg:hidden">
            {/* Monthly price sits above the product groups, ungrouped — it's
                the plan's price, not a Postgres or Compute feature. */}
            <div className="border-b border-black/[0.06]">
              <dl>
                <MobileRow row={PLAN_ROW} />
              </dl>
            </div>
            {GROUPS.map((group) => (
              <div key={group.label} className="border-b border-black/[0.06] last:border-b-0">
                <p className="flex items-center gap-2.5 bg-foreground/[0.03] px-5 py-3 text-sm font-semibold text-foreground">
                  <group.icon className={cn("size-4 shrink-0", group.color)} />
                  {group.label}
                </p>
                <dl>
                  {group.rows.map((row) => (
                    <MobileRow key={row.label} row={row} />
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="relative hidden overflow-x-auto rounded-2xl border border-black/[0.06] bg-white lg:block">
            <table className="w-full min-w-[52rem] border-collapse text-left">
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
                <tr>
                  <th scope="col" className="px-5 pb-4 pt-5">
                    <span className="sr-only">Feature</span>
                  </th>
                  {PLAN_NAMES.map((name, i) => (
                    <th key={name} scope="col" className="relative px-5 pb-4 pt-5">
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
                    </th>
                  ))}
                </tr>
              </thead>
              {/* Monthly price sits above the product groups, ungrouped — it's
                  the plan's price, not a Postgres or Compute feature. */}
              <tbody>
                <DesktopRow row={PLAN_ROW} />
              </tbody>
              {GROUPS.map((group) => (
                <tbody key={group.label}>
                  <tr>
                    {/* Sentence case with the group's glyph in a brand colour.
                        Not uppercase or letter-spaced: role-kicker.tsx sets that
                        rule for the site's labels, and this table was the one
                        place still breaking it. */}
                    <th
                      scope="colgroup"
                      colSpan={5}
                      className="border-t border-black/[0.06] bg-card px-5 py-3"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                        <group.icon className={cn("size-4 shrink-0", group.color)} />
                        {group.label}
                      </span>
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <DesktopRow key={row.label} row={row} />
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
