import { CheckBold, Copy, Database, GitBranch, Swap } from "@/components/icons/forma";
import { ThreeDSlot } from "@/components/brand/three-d-slot";
import { Bar, CardChrome, SectionLabel } from "./parts";

// The /postgres hero abstraction: a managed database that is already wired to
// something. Real: the postgres:// connection-string shape, the region, and the
// branch names. Abstracted: the credentials and every measured value — no
// capacity or latency figures are invented.

const BRANCHES = [
  { name: "main", primary: true },
  { name: "pr-214", primary: false },
  { name: "pr-207", primary: false },
];

export function DatabasePanel() {
  return (
    <div
      role="img"
      aria-label="Illustration of a Prisma Postgres database: a primary database with autoscaling on, its connection string, and per-pull-request branches alongside the main branch"
      className="pointer-events-none relative flex h-full select-none flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]"
    >
      <CardChrome
        file="database"
        right={
          <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
            <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
            ready
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-5 px-5 py-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Database className="size-3.5 shrink-0 text-foreground" />
            <span className="text-[0.8125rem] font-semibold text-foreground">Primary database</span>
            <span className="ml-auto font-mono text-[0.625rem] text-muted-foreground">
              us-west-1
            </span>
          </div>

          {/* the connection string, credentials abstracted */}
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5">
            <span className="truncate font-mono text-[0.625rem] text-muted-foreground">
              postgres://
              <span className="text-foreground">…</span>@db.prisma.io:5432
            </span>
            <Copy className="ml-auto size-3 shrink-0 text-muted-foreground/60" />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 px-3 py-2">
            <Swap className="size-3 shrink-0 text-prism-cyan-700" />
            <span className="text-[0.625rem] font-semibold text-prism-cyan-800">
              Autoscaling on
            </span>
            <Bar className="ml-auto w-12" />
          </div>
        </div>

        {/* branches travelling with the app */}
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Branches</SectionLabel>
          {BRANCHES.map(({ name, primary }) => (
            <div key={name} className="flex items-center gap-2">
              <GitBranch
                className={
                  primary
                    ? "size-3 shrink-0 text-foreground/60"
                    : "size-3 shrink-0 text-prism-cyan-500"
                }
              />
              <span className="font-mono text-[0.625rem] text-muted-foreground">{name}</span>
              {primary ? (
                <span className="rounded border border-border/80 bg-card px-1.5 py-0.5 text-[0.5625rem] font-semibold text-muted-foreground">
                  primary
                </span>
              ) : (
                <span className="rounded border border-prism-cyan-200 bg-prism-cyan-50 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-prism-cyan-800">
                  isolated
                </span>
              )}
              <Bar className="ml-auto h-1 w-12" />
            </div>
          ))}
        </div>

        <div className="flex items-end gap-4 border-t border-border/60 pt-3.5">
          <p className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[0.6875rem]">
            <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
            <span className="text-foreground">daily backup</span>
            <Bar className="w-10" />
          </p>
          <ThreeDSlot className="h-24 w-28 shrink-0 max-md:hidden" label="3D element" />
        </div>
      </div>
    </div>
  );
}
