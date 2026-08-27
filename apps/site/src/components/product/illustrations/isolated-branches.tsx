import { Database, GitBranch, XCircle } from "@/components/icons/forma";
import { CardChrome, SurfaceCard } from "./parts";

// "Branch with your app" — the contrast the copy draws: a dedicated,
// fully-isolated database per preview, rather than one shared test DB that
// "lies about how production behaves".

const PREVIEWS = ["pr-214", "pr-207"];

export function IsolatedBranches() {
  return (
    <SurfaceCard label="Illustration contrasting a shared test database with Prisma Postgres giving every preview environment its own fully-isolated database branched from production">
      <CardChrome file="branches" />
      <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3 text-[0.625rem] leading-none">
        {/* what it replaces */}
        <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/30 p-2">
          <XCircle className="size-3 shrink-0 text-prism-red-500" />
          <span className="font-mono text-muted-foreground">shared test db</span>
        </div>

        {/* one isolated database per preview, branched from production */}
        <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-card p-2">
          <Database className="size-3 shrink-0 text-foreground/60" />
          <span className="font-mono text-foreground">production</span>
        </div>

        {PREVIEWS.map((name) => (
          <div key={name} className="relative pl-5">
            <span
              aria-hidden
              className="absolute left-1.5 top-[-0.6rem] h-[1.35rem] w-2.5 rounded-bl-[0.4rem] border-b border-l border-prism-cyan-400"
            />
            <div className="flex items-center gap-2 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-2">
              <GitBranch className="size-3 shrink-0 text-prism-cyan-600" />
              <span className="font-mono text-prism-cyan-900">{name}</span>
              <span className="ml-auto rounded border border-prism-cyan-200 bg-card px-1.5 py-0.5 text-[0.5625rem] font-semibold text-prism-cyan-800">
                isolated
              </span>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
