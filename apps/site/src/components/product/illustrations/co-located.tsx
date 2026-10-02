import { AppWindow, CheckBold, Database, XCircle } from "@/components/icons/forma";
import { CardChrome, SectionLabel, SurfaceCard } from "./parts";

// "App and database on one platform": two vendors above, with the hop between
// them struck out, and one platform below with the app and the database side
// by side. No unit and no figure is shown. The docs state no latency number,
// so the illustration claims none.

export function CoLocated() {
  return (
    <SurfaceCard label="Illustration comparing an app and a database at two separate vendors with Prisma Compute running the app next to Prisma Postgres on one platform, in one project and on one plan">
      <CardChrome file="query path" />
      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 py-3 text-[0.625rem] leading-none">
        {/* two vendors: two dashboards, two bills, a network hop between them */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-muted/30 p-2">
          <SectionLabel>Two vendors</SectionLabel>
          <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
            <span className="rounded border border-border bg-card px-1.5 py-0.5">app</span>
            <span aria-hidden className="h-px flex-1 bg-foreground/15" />
            <XCircle className="size-3 shrink-0 text-prism-red-500" />
            <span aria-hidden className="h-px flex-1 bg-foreground/15" />
            <span className="rounded border border-border bg-card px-1.5 py-0.5">db</span>
          </div>
          <p className="font-mono text-[0.5625rem] text-muted-foreground/80">
            two dashboards, two bills
          </p>
        </div>

        {/* one platform: the same project and plan */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-2">
          <SectionLabel>One platform</SectionLabel>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="flex items-center gap-1 rounded border border-prism-cyan-200 bg-card px-1.5 py-0.5 text-prism-cyan-800">
              <AppWindow className="size-2.5" />
              app
            </span>
            <span aria-hidden className="h-px flex-1 bg-prism-cyan-400" />
            <CheckBold className="size-3 shrink-0 text-prism-cyan-600" />
            <span aria-hidden className="h-px flex-1 bg-prism-cyan-400" />
            <span className="flex items-center gap-1 rounded border border-prism-cyan-200 bg-card px-1.5 py-0.5 text-prism-cyan-800">
              <Database className="size-2.5" />
              db
            </span>
          </div>
          <p className="font-mono text-[0.5625rem] text-prism-cyan-700/80">
            one project, one plan
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}
