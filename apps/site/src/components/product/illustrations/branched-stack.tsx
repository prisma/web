import { AppWindow, Database, GitBranch } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { Bar, CardChrome, SurfaceCard } from "./parts";

// "Branch your stack per PR" — production above, a PR branch below, and both
// halves of the stack peeling off together. The pairing is the point, so app and
// database always appear as one row, never as two independent things.

function StackRow({ label, accent }: { label: string; accent?: boolean }) {
  const chip = cn(
    "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[0.5625rem] font-semibold",
    accent
      ? "border-prism-cyan-200 bg-prism-cyan-50 text-prism-cyan-800"
      : "border-border/80 bg-card text-muted-foreground",
  );
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[0.625rem] text-foreground">{label}</span>
      <span className="ml-auto flex items-center gap-1.5">
        <span className={chip}>
          <AppWindow className="size-2.5" />
          app
        </span>
        <span className={chip}>
          <Database className="size-2.5" />
          db
        </span>
      </span>
    </div>
  );
}

export function BranchedStack() {
  return (
    <SurfaceCard label="Illustration of per-PR branching on Prisma Compute: a production stack and a pull request stack, each pairing an app with its own database branched from production">
      <CardChrome file="environments" />
      <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-3 text-[0.625rem] leading-none">
        <div className="rounded-lg border border-border/80 bg-card p-3">
          <StackRow label="production" />
        </div>

        {/* the branch peels off, carrying both halves */}
        <div className="relative pl-5">
          <span
            aria-hidden
            className="absolute left-1.5 top-[-0.75rem] h-[1.6rem] w-2.5 rounded-bl-[0.4rem] border-b border-l border-prism-cyan-400"
          />
          <div className="rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-3">
            <StackRow label="pr-214" accent />
          </div>
        </div>

        <p className="flex items-center gap-1.5 font-mono text-[0.625rem] text-prism-cyan-700">
          <GitBranch className="size-2.5 shrink-0" />
          branched from production
          <Bar className="ml-auto w-10" />
        </p>
      </div>
    </SurfaceCard>
  );
}
