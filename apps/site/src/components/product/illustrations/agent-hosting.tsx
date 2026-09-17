import { Bot, Database, Repeat } from "@/components/icons/forma";
import { Bar, CardChrome, SurfaceCard } from "./parts";

// "Built for hosting AI agents" — the three things the copy says agents need,
// running in one place: a long-lived process, a streaming response, and durable
// memory. The streaming line ends in a caret so it reads as still arriving.

const NEEDS = [
  { icon: Repeat, label: "long-lived" },
  { icon: Bot, label: "streaming" },
  { icon: Database, label: "memory" },
];

export function AgentHosting() {
  return (
    <SurfaceCard label="Illustration of an agent hosted on Prisma Compute: a long-lived process streaming a response, with durable memory alongside it">
      <CardChrome file="agent" />
      <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-3 font-mono text-[0.625rem] leading-none text-foreground">
        <div className="flex flex-wrap items-center gap-1.5">
          {NEEDS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-muted-foreground"
            >
              <Icon className="size-2.5" />
              {label}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/40 p-3">
          <p className="flex items-center gap-1.5">
            <span className="size-1.5 shrink-0 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
            <span className="text-prism-cyan-700">stream</span>
            <span className="text-muted-foreground">open</span>
          </p>
          <Bar className="h-1 w-full" />
          <Bar className="h-1 w-4/5" />
          <p className="flex items-center gap-1">
            <Bar className="h-1 w-1/2" />
            <span
              aria-hidden
              className="inline-block h-2.5 w-[0.35rem] shrink-0 animate-caret-blink bg-prism-cyan-400 motion-reduce:animate-none"
            />
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}
