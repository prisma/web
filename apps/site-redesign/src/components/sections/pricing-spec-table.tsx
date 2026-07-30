import { CheckBold } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

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
const PENDING = "TBC";

const YES = "yes";

type Row = { label: string; values: [string, string, string, string] };

const GROUPS: { label: string; rows: Row[] }[] = [
  {
    label: "Usage",
    rows: [
      { label: "Monthly price", values: ["$0", "$10", "$49", "$129"] },
      {
        label: "Operations included",
        values: ["100,000", "1,000,000", "10,000,000", "50,000,000"],
      },
      {
        label: "Operation overage",
        values: ["—", "$0.0080 per 1,000", "$0.0020 per 1,000", "$0.0010 per 1,000"],
      },
      { label: "Storage included", values: ["500 MB", "10 GB", "50 GB", "100 GB"] },
      { label: "Storage overage", values: ["—", "$2.00 per GB", "$1.50 per GB", "$1.00 per GB"] },
      { label: "Databases", values: ["50", "1,000", "1,000", "1,000"] },
      { label: "Data transfer", values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
      { label: "Spend limits", values: ["—", YES, YES, YES] },
    ],
  },
  {
    label: "Managed connection pool",
    rows: [
      { label: "Connection limit (pooled)", values: ["10", "100", "500", "1,000"] },
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
    rows: [
      // Live values are $0.0020 / $0.0010 per 1,000 and 5/5/10/20 purges per
      // hour, but Gregory said Accelerate is being deprecated — so whether
      // this group belongs on the page at all is unresolved. Placeholder.
      { label: "Cache tag invalidations", values: [PENDING, PENDING, PENDING, PENDING] },
      { label: "Cache purge requests", values: [PENDING, PENDING, PENDING, PENDING] },
    ],
  },
  {
    label: "Data",
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

export function PricingSpecTable() {
  return (
    <section className="bg-white px-4 sm:px-8">
      <div className="mx-auto max-w-6xl py-16 sm:py-24">
        <Reveal>
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Compare plans
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            All of the features below are included with Prisma Postgres.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-black/[0.06]">
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
                    <th key={name} scope="col" className="px-5 pb-4 pt-5">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          i === HIGHLIGHT ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {GROUPS.map((group) => (
                <tbody key={group.label}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={5}
                      className="border-t border-black/[0.06] bg-card px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {group.label}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-t border-black/[0.06]">
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
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-4 text-sm text-muted-foreground/70">
            <span className="font-medium">TBC</span> — awaiting confirmation: Free-tier backup
            retention, support tiers, and whether the global cache rows stay now that Accelerate is
            being deprecated. An em dash (—) means not included on that plan.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
