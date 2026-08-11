import { CheckBold, GitBranch } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { CardChrome, RayFrame } from "./parts";

// The [graphic/image] for "Migrations your agent can run without breaking
// production". The copy's claim is that migrations are "tracked as a graph, like
// git", so this is a migration history read the way a git log is: newest at the
// bottom, a branch peeling off the trunk, and named refs pointing at the two
// environments they track. Migration names are real Prisma shape
// (<timestamp>_<name>) and TypeScript, per the copy.

// Lane centres inside the rail, in px.
const LANE_X = [10, 30];

type Row = {
  name: string;
  lane: number;
  ref?: string;
  verified?: boolean;
};

const ROWS: Row[] = [
  { name: "20260703091500_init", lane: 0 },
  { name: "20260709142233_add_users", lane: 0 },
  { name: "20260715103010_add_sessions", lane: 0 },
  { name: "20260721164512_add_posts", lane: 0 },
  { name: "20260726093214_add_indexes", lane: 0, ref: "production" },
  { name: "20260729111045_add_tags", lane: 1 },
  { name: "20260730093214_index_tags", lane: 1 },
  { name: "20260730101422_add_comments", lane: 1, ref: "preview", verified: true },
];

function RefPill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.625rem] font-semibold",
        accent
          ? "border-prism-cyan-200 bg-prism-cyan-50 text-prism-cyan-800"
          : "border-border/80 bg-card text-muted-foreground",
      )}
    >
      <GitBranch className="size-2.5" />
      {children}
    </span>
  );
}

export function MigrationGraph() {
  return (
    <RayFrame photo="bg-[url('/brand/feature-orm.jpg')] bg-[position:0%_65%]">
      <div
        role="img"
        aria-label="Illustration of a Prisma migration history tracked as a graph: a trunk of migrations with production tagged on its head, a branch peeling off it carrying three more migrations, and preview tagged on the newest — driven by the plan, apply and inspect commands"
        className="pointer-events-none relative flex min-w-0 flex-1 select-none flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-[0_12px_32px_-14px_rgba(21,21,21,0.18)]"
      >
        <CardChrome file="migrations" />

        {/* rows share the card's height equally, so the connectors between them
          stay continuous however tall the column gets */}
        <ul className="flex flex-1 flex-col px-4 py-4 sm:px-5">
          {ROWS.map((row, i) => {
            const prev = ROWS[i - 1];
            const next = ROWS[i + 1];
            const x = LANE_X[row.lane];
            const onBranch = row.lane > 0;
            const stroke = onBranch ? "bg-prism-cyan-400" : "bg-foreground/15";
            // a line up into this node, when the row above shares its lane
            const lineUp = prev && prev.lane === row.lane;
            // a line down out of this node, when anything follows in this lane or
            // branches off it
            const lineDown = next && next.lane >= row.lane;
            // the fork itself: the row above is on the trunk, this one is not
            const forks = prev && prev.lane < row.lane;

            return (
              <li key={row.name} className="flex min-h-8 flex-1 items-center gap-3">
                <span className="relative w-11 shrink-0 self-stretch">
                  {lineUp && (
                    <span className={cn("absolute top-0 h-1/2 w-px", stroke)} style={{ left: x }} />
                  )}
                  {lineDown && (
                    <span
                      className={cn(
                        "absolute top-1/2 h-1/2 w-px",
                        next.lane > row.lane ? "bg-foreground/15" : stroke,
                      )}
                      style={{ left: x }}
                    />
                  )}
                  {forks && (
                    <span
                      className="absolute top-0 h-1/2 rounded-bl-[0.5rem] border-b border-l border-prism-cyan-400"
                      style={{ left: LANE_X[prev.lane], width: x - LANE_X[prev.lane] }}
                    />
                  )}
                  <span
                    className={cn(
                      "absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                      onBranch ? "bg-prism-cyan-400" : "bg-foreground/25",
                    )}
                    style={{ left: x }}
                  />
                </span>

                <span
                  className={cn(
                    "min-w-0 truncate font-mono text-[0.6875rem]",
                    row.verified ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {row.name}
                </span>

                {/* refs sit right after the migration they point at, the way a
                    git log prints them */}
                {row.ref && <RefPill accent={onBranch}>{row.ref}</RefPill>}
                {row.verified && (
                  <CheckBold className="size-3 shrink-0 text-prism-cyan-500" aria-hidden />
                )}
              </li>
            );
          })}
        </ul>

        {/* the lifecycle the agent drives */}
        <div className="px-4 pb-5 sm:px-5">
          <div className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 font-mono text-[0.6875rem] text-primary-foreground/90">
            <span className="text-prism-cyan-400">$</span>
            <span>prisma migrate</span>
            <span className="flex flex-wrap items-center gap-1.5">
              {["plan", "apply", "inspect"].map((verb) => (
                <span
                  key={verb}
                  className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-primary-foreground"
                >
                  {verb}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </RayFrame>
  );
}
