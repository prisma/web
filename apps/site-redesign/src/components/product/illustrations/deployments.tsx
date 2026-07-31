import { AppWindow, CheckBold, Database, GitBranch } from "@/components/icons/forma";
import { ThreeDSlot } from "@/components/brand/three-d-slot";
import { cn } from "@/lib/utils";
import { Bar, CardChrome, SectionLabel } from "./parts";

// The /compute hero abstraction: the platform's core claim in one frame — a
// production deploy and a per-PR preview, each carrying an app and a database
// that were branched together. Real: the environment names, the preview
// hostname shape, and the deploy command. Abstracted: every commit subject and
// measured value.

function Pair({ accent }: { accent?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={cn(
          "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[0.5625rem] font-semibold",
          accent
            ? "border-prism-cyan-200 bg-prism-cyan-50 text-prism-cyan-800"
            : "border-border/80 bg-card text-muted-foreground",
        )}
      >
        <AppWindow className="size-2.5" />
        app
      </span>
      <span
        className={cn(
          "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[0.5625rem] font-semibold",
          accent
            ? "border-prism-cyan-200 bg-prism-cyan-50 text-prism-cyan-800"
            : "border-border/80 bg-card text-muted-foreground",
        )}
      >
        <Database className="size-2.5" />
        db
      </span>
    </span>
  );
}

export function Deployments() {
  return (
    <div
      role="img"
      aria-label="Illustration of Prisma Compute deployments: a production deploy and a per-PR preview deploy, each pairing an app with its own branched database, deployed with one command"
      className="pointer-events-none relative flex h-full select-none flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]"
    >
      <CardChrome
        file="deployments"
        right={
          <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
            <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
            live
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-5 px-5 py-5">
        {/* production */}
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Production</SectionLabel>
          <div className="flex items-center gap-2.5 rounded-lg border border-border/80 bg-card p-3">
            <span className="font-mono text-[0.6875rem] text-foreground">v14</span>
            <span className="flex items-center gap-1 font-mono text-[0.625rem] text-muted-foreground">
              <GitBranch className="size-2.5" />
              main
            </span>
            <span className="ml-auto">
              <Pair />
            </span>
          </div>
        </div>

        {/* the preview that branches both halves together */}
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Preview</SectionLabel>
          <div className="flex flex-col gap-2.5 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-3">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[0.6875rem] text-foreground">pr-214</span>
              <span className="flex items-center gap-1 text-[0.625rem] font-semibold text-prism-cyan-800">
                <GitBranch className="size-2.5" />
                branched together
              </span>
              <span className="ml-auto">
                <Pair accent />
              </span>
            </div>
            <span className="font-mono text-[0.625rem] text-muted-foreground">
              pr-214.preview.prisma.app
            </span>
          </div>
        </div>

        {/* older deploys, collapsed — gives the panel the depth of a real
            history instead of leaving the card top empty */}
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Recent</SectionLabel>
          <div className="flex flex-col gap-2.5">
            {["v13", "v12", "v11"].map((v) => (
              <div key={v} className="flex items-center gap-2.5">
                <span className="w-7 font-mono text-[0.625rem] text-muted-foreground">{v}</span>
                <Bar className="h-1 flex-1" />
                <Bar className="h-1 w-6" />
              </div>
            ))}
          </div>
        </div>

        {/* the command and the 3D element share the footer, each with its own
            lane, so the render can never land on top of the panel's content */}
        <div className="flex items-end gap-4 border-t border-border/60 pt-3.5">
          <p className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[0.6875rem]">
            <span className="text-prism-cyan-500">$</span>
            <span className="text-foreground">prisma deploy</span>
            <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
            <Bar className="w-10" />
          </p>
          <ThreeDSlot src="/brand/cpu-3d.png" className="h-28 w-28 shrink-0 max-md:hidden" />
        </div>
      </div>
    </div>
  );
}
