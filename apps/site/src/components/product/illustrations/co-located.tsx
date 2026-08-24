import { AppWindow, Database, XCircle } from "@/components/icons/forma";
import { CardChrome, SectionLabel, SurfaceCard } from "./parts";

// "Microsecond queries, no code changes" — the round trip that disappears. Two
// vendors above with the network hop struck out, one machine below with the app
// and the database sitting next to each other. The only unit shown is µs, which
// the copy itself claims; no numbers are invented.

export function CoLocated() {
  return (
    <SurfaceCard label="Illustration comparing a cross-vendor network round trip with Prisma Compute running the app and Postgres on the same machine, where the round trip disappears">
      <CardChrome file="query path" />
      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 py-3 text-[0.625rem] leading-none">
        {/* two vendors: the hop you pay for */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-muted/30 p-2">
          <SectionLabel>Two vendors</SectionLabel>
          <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
            <span className="rounded border border-border bg-card px-1.5 py-0.5">app</span>
            <span aria-hidden className="h-px flex-1 bg-foreground/15" />
            <XCircle className="size-3 shrink-0 text-prism-red-500" />
            <span aria-hidden className="h-px flex-1 bg-foreground/15" />
            <span className="rounded border border-border bg-card px-1.5 py-0.5">db</span>
          </div>
          <p className="font-mono text-[0.5625rem] text-muted-foreground/80">network round trip</p>
        </div>

        {/* one machine: no hop at all */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-2">
          <SectionLabel>One machine</SectionLabel>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="flex items-center gap-1 rounded border border-prism-cyan-200 bg-card px-1.5 py-0.5 text-prism-cyan-800">
              <AppWindow className="size-2.5" />
              app
            </span>
            <span aria-hidden className="h-px flex-1 bg-prism-cyan-400" />
            <span className="font-semibold text-prism-cyan-700">µs</span>
            <span aria-hidden className="h-px flex-1 bg-prism-cyan-400" />
            <span className="flex items-center gap-1 rounded border border-prism-cyan-200 bg-card px-1.5 py-0.5 text-prism-cyan-800">
              <Database className="size-2.5" />
              db
            </span>
          </div>
          <p className="font-mono text-[0.5625rem] text-prism-cyan-700/80">no code changes</p>
        </div>
      </div>
    </SurfaceCard>
  );
}
