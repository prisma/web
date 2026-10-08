import { Database, GitBranch, XCircle } from "@/components/icons/forma";
import { CardChrome, SurfaceCard } from "./parts";

// "A database per preview" — the contrast the copy draws: with deploy on push,
// each pushed branch's preview gets its own new database, rather than every
// preview sharing one test DB. Production data is not copied into it
// (docs compute/deploy-on-push.mdx).

const PREVIEWS = ["pr-214", "pr-207"];

export function IsolatedBranches() {
  return (
    <SurfaceCard label="Illustration contrasting a shared test database with Prisma Postgres giving each pushed branch's preview its own new database beside production">
      <CardChrome file="previews" />
      <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-3 text-[0.625rem] leading-none">
        {/* what it replaces */}
        <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/30 p-2">
          <XCircle className="size-3 shrink-0 text-prism-red-500" />
          <span className="font-mono text-muted-foreground">shared test db</span>
        </div>

        {/* one isolated database per preview, beside production; its data is
            the preview's own, not a copy of production's */}
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
                own db
              </span>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
