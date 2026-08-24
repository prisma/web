import { Repeat, Search } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { CardChrome, HeroPanel, SectionLabel, StatRow } from "./parts";

// A /postgres hero stop: Query Insights — which of your queries are slow, and
// why. Real: the Prisma call shapes, the p95/call-count/total-time shape of an
// observability row, and the reasons a query is slow (a missing index, an n+1).
// The durations belong to the application's own queries, so plausible figures
// are fine here; nothing on this panel is a claim about Prisma's own speed.

// A day of p95, quiet until the window the slow query lands in. Heights are
// literal utilities so Tailwind sees them; the strip is 24px tall (h-6).
const SPARKLINE = [
  "h-2",
  "h-2",
  "h-2",
  "h-2",
  "h-2.5",
  "h-2",
  "h-2",
  "h-2",
  "h-2.5",
  "h-2",
  "h-2",
  "h-2",
  "h-2.5",
  "h-3",
  "h-2.5",
  "h-2",
  "h-2.5",
  "h-2",
  "h-2",
  "h-2",
  "h-2.5",
  "h-3",
  "h-3",
  "h-3.5",
  "h-4",
  "h-5",
  "h-6",
  "h-5",
  "h-4",
  "h-3",
  "h-2.5",
  "h-2",
  "h-2.5",
  "h-2",
  "h-2",
  "h-2",
];

/** The stretch of the strip the outlier query is responsible for. */
const SPIKE = [25, 26, 27, 28];

const QUERIES = [
  {
    call: "user.findMany",
    share: "w-full",
    p95: "412 ms",
    calls: "1.9k calls",
    reason: "no index",
    reasonIcon: Search,
    outlier: true,
  },
  {
    call: "post.findUnique",
    share: "w-[72%]",
    p95: "96 ms",
    calls: "12.4k calls",
    reason: "n+1",
    reasonIcon: Repeat,
    outlier: false,
  },
  {
    call: "comment.create",
    share: "w-[12%]",
    p95: "34 ms",
    calls: "3.1k calls",
    reason: null,
    reasonIcon: null,
    outlier: false,
  },
  {
    call: "user.update",
    share: "w-[4%]",
    p95: "21 ms",
    calls: "840 calls",
    reason: null,
    reasonIcon: null,
    outlier: false,
  },
];

/** One line of the query table — the header and every row share these tracks. */
const ROW = "grid grid-cols-[7rem_4.5rem_1fr_3rem_3.5rem] items-center gap-2 whitespace-nowrap";

export function QueryInsights() {
  return (
    <HeroPanel label="Illustration of Prisma Query Insights: the slowest queries ranked by total database time, each with a p95 duration and call count, with the outlier flagged as missing an index">
      <CardChrome
        file="insights"
        right={
          <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
            <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
            live
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-3 px-5 py-5">
        {/* the shape of the day, with the slow window standing out */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <SectionLabel>p95 latency</SectionLabel>
            <span className="ml-auto font-mono text-[0.5625rem] text-muted-foreground">
              last 24h
            </span>
          </div>
          <div className="flex h-6 items-end gap-[2px]">
            {SPARKLINE.map((height, i) => (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-[2px]",
                  height,
                  SPIKE.includes(i) ? "bg-prism-red-300" : "bg-prism-cyan-200",
                )}
              />
            ))}
          </div>
        </div>

        {/* the queries themselves, ranked by how much time they account for */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Top queries by total time</SectionLabel>
          {QUERIES.map(({ call, share, p95, calls, reason, reasonIcon: ReasonIcon, outlier }) => (
            <div
              key={call}
              className={cn(
                ROW,
                "rounded-lg border px-2.5 py-1",
                outlier ? "border-prism-red-200 bg-prism-red-50/40" : "border-border/80 bg-card",
              )}
            >
              <span className="truncate font-mono text-[0.6875rem] text-foreground">{call}</span>
              {reason && ReasonIcon ? (
                <span
                  className={cn(
                    "flex items-center gap-1 justify-self-start rounded border px-1.5 py-0.5 text-[0.5625rem] font-semibold",
                    outlier
                      ? "border-prism-red-200 bg-prism-red-50 text-prism-red-700"
                      : "border-prism-yellow-200 bg-prism-yellow-50 text-prism-yellow-700",
                  )}
                >
                  <ReasonIcon className="size-2.5" />
                  {reason}
                </span>
              ) : (
                <span />
              )}
              <span className="block h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.07]">
                <span
                  className={cn(
                    "block h-full rounded-full",
                    share,
                    outlier ? "bg-prism-red-400" : "bg-prism-cyan-400",
                  )}
                />
              </span>
              <span className="justify-self-end font-mono text-[0.625rem] font-semibold text-foreground">
                {p95}
              </span>
              <span className="justify-self-end font-mono text-[0.5625rem] text-muted-foreground">
                {calls}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <StatRow label="queries traced" value="18.2k" />
          <StatRow label="total db time" value="22.4 min" />
        </div>
      </div>
    </HeroPanel>
  );
}
