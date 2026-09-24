import {
  Bot,
  CheckBold,
  CheckCircle,
  Code,
  Console,
  Database,
  Shield,
  Table,
  XCircle,
} from "@/components/icons/forma";
import { AgentRobot } from "@/components/brand/agent-robot";
import { cn } from "@/lib/utils";
import { Bar, SectionLabel } from "./parts";

// The centrepiece for "Fast feedback makes your agent faster, and more
// reliable": the loop itself. The agent plans a migration, the guardrail
// rejects it up front with a reason, the agent edits the schema and re-plans,
// and the second pass verifies — which is what "iterate to success without
// human intervention" looks like in one frame.
//
// Real: the CLI verbs, the filenames, and the rejection reason (schema drift,
// straight from the approved copy). Abstracted: every prose string, because the
// point is the shape of the loop, not the wording of one error.

// The project the agent is working in.
const FILES = [
  { icon: Table, label: "schema.prisma", active: true },
  { icon: Database, label: "migrations", active: false },
  { icon: Code, label: "app.ts", active: false },
];

// When each kind of feedback reaches the agent — the four blocks under this
// card, in the order they fire. Icons match those blocks.
const MOMENTS = [
  { icon: Bot, label: "Before it writes" },
  { icon: CheckCircle, label: "At type-check" },
  { icon: Console, label: "At runtime" },
  { icon: Shield, label: "Before execution" },
];

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[0.5rem] font-semibold text-muted-foreground">
        {n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}

function Command({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-foreground">
      <span className="text-prism-cyan-500">$</span>
      {children}
    </p>
  );
}

export function FeedbackLoop() {
  return (
    <div
      role="img"
      aria-label="Illustration of an agent's feedback loop with Prisma: a planned migration is rejected up front for schema drift with a reason, the agent edits the schema and re-plans, and the second pass is verified"
      className="pointer-events-none relative select-none overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]"
    >
      {/* window chrome */}
      <div className="flex items-center border-b border-border/70 px-4 py-2.5">
        <div className="flex w-16 gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </div>
        <span className="mx-auto rounded-md border border-border/70 bg-card px-3 py-1 font-mono text-[0.625rem] leading-none text-muted-foreground">
          prisma dev
        </span>
        <span className="flex w-16 items-center justify-end gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
          <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
          watching
        </span>
      </div>

      <div className="flex">
        <aside className="hidden w-52 shrink-0 flex-col border-r border-border/70 bg-muted/40 px-3 pb-4 pt-4 md:flex">
          <SectionLabel>Project</SectionLabel>
          <nav className="mt-3 flex flex-col gap-0.5">
            {FILES.map(({ icon: Icon, label, active }) => (
              <span
                key={label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-1.5 py-1.5 font-mono text-[0.6875rem]",
                  active ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                {label}
              </span>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-2 rounded-lg border border-border/80 bg-card p-2.5">
            <SectionLabel>Verified</SectionLabel>
            <span className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-foreground">
              <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
              schema in sync
            </span>
            <Bar className="h-1 w-full" />
          </div>

          {/* who is running the loop — the homepage's agent character and its
              "Your agent" card, compacted to the sidebar. Its head breaks the
              card's top edge exactly as it does on the homepage. */}
          <div className="relative mt-12 flex flex-col items-center rounded-xl border border-border bg-card px-3 pb-3.5 pt-11">
            <AgentRobot className="absolute -top-10 left-1/2 w-20 -translate-x-1/2" />
            <p className="font-heading text-[0.8125rem] leading-none text-foreground">Your agent</p>
          </div>
        </aside>

        {/* the loop */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2.5">
            <span className="text-[0.6875rem] font-semibold text-foreground">agent run</span>
            <span className="ml-auto flex items-center gap-1.5 rounded-md border border-prism-cyan-200 bg-prism-cyan-50 px-2 py-0.5 text-[0.625rem] font-semibold text-prism-cyan-800">
              <CheckBold className="size-2.5" />
              verified
            </span>
          </div>

          <div className="flex flex-col gap-4 px-4 py-5 sm:px-5">
            {/* rejected up front, with the reason */}
            <Step n={1}>
              <Command>prisma migrate plan</Command>
              <div className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/40 p-3">
                <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-foreground">
                  <XCircle className="size-3 shrink-0 text-prism-red-500" />
                  schema drift detected
                  <span className="ml-auto text-[0.625rem] font-semibold text-muted-foreground">
                    rejected
                  </span>
                </p>
                <Bar className="h-1 w-4/5" />
                <Bar className="h-1 w-1/2" />
              </div>
            </Step>

            {/* the agent reads the reason and fixes the schema */}
            <Step n={2}>
              <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-muted-foreground">
                <Code className="size-3 shrink-0" />
                <span className="text-foreground">schema.prisma</span>
                edited
              </p>
              <div className="flex flex-col gap-1.5">
                <Bar className="h-1 w-2/3 bg-prism-cyan-100" />
                <Bar className="h-1 w-2/5" />
              </div>
            </Step>

            {/* second pass clears */}
            <Step n={3}>
              <Command>prisma migrate plan</Command>
              <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-foreground">
                <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
                verified
                <span className="text-muted-foreground">· schema in sync</span>
              </p>
            </Step>
          </div>

          {/* when the feedback arrives — the four blocks below, in order */}
          <div className="border-t border-border/70 px-4 pb-4 pt-3 sm:px-5">
            <SectionLabel>Feedback arrives</SectionLabel>
            <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-4">
              {MOMENTS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 text-[0.6875rem] font-semibold text-muted-foreground"
                >
                  <Icon className="size-3.5 shrink-0 text-foreground/70" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
