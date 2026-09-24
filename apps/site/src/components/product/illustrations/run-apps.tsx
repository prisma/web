import {
  AppWindow,
  ArrowRight,
  Bot,
  Code,
  Layers,
  Repeat,
  Rocket,
  Server,
  Swap,
} from "@/components/icons/forma";
import { CardChrome, HeroPanel, SectionLabel } from "./parts";

// Stop four of the /compute hero tour — "Apps". Answers the two questions the
// abstraction otherwise leaves open: what you start from, and what actually
// runs here. Real: the framework and workload names. No logos — we hold no
// marks for these projects, so every framework is a text label and a shared
// icon. Nothing here claims a performance characteristic.

const STARTERS = [
  { icon: Code, name: "Hono", descriptor: "lightweight" },
  { icon: Server, name: "Express", descriptor: "classic" },
  { icon: Layers, name: "tRPC API", descriptor: "typed" },
  { icon: Bot, name: "AI agent", descriptor: "streaming" },
];

const WORKLOADS = [
  { icon: Server, label: "long-lived HTTP" },
  { icon: ArrowRight, label: "streaming responses" },
  { icon: Repeat, label: "cron + background jobs" },
  { icon: Bot, label: "AI agents" },
  { icon: Swap, label: "WebSockets" },
];

export function RunApps() {
  return (
    <HeroPanel label="Illustration of Prisma Compute starter apps: a recommended Next.js starter ready to deploy alongside Hono, Express, tRPC API and AI agent starters, over a strip naming the workloads Compute runs — long-lived HTTP, streaming responses, cron and background jobs, AI agents and WebSockets">
      <CardChrome
        file="apps"
        right={<span className="font-mono text-[0.625rem] text-muted-foreground">5 starters</span>}
      />

      <div className="flex flex-1 flex-col justify-between gap-4 px-5 py-5">
        <div className="flex flex-col gap-3">
          <SectionLabel>Start from an app</SectionLabel>

          {/* the pick most people want, already one click from being deployed */}
          <div className="flex items-center gap-2.5 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-3">
            <AppWindow className="size-3.5 shrink-0 text-prism-cyan-700" />
            <span className="text-[0.8125rem] font-semibold text-foreground">Next.js</span>
            <span className="font-mono text-[0.625rem] text-muted-foreground">fullstack</span>
            <span className="rounded border border-prism-cyan-200 bg-prism-cyan-50 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-prism-cyan-800">
              popular
            </span>
            {/* ink rather than the console's teal, for the same reason as
                repo-connect.tsx: no depicted button should out-shout the
                hero's real CTA beside it */}
            <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-[0.625rem] font-semibold text-background">
              <Rocket className="size-2.5" />
              Deploy
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {STARTERS.map(({ icon: Icon, name, descriptor }) => (
              <div
                key={name}
                className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-card p-2.5"
              >
                <Icon className="size-3.5 text-muted-foreground" />
                <span className="text-[0.6875rem] font-semibold text-foreground">{name}</span>
                <span className="font-mono text-[0.5625rem] text-muted-foreground">
                  {descriptor}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* what the runtime is actually for */}
        <div className="flex flex-col gap-2.5 rounded-lg border border-border/80 bg-muted/30 p-3.5">
          <SectionLabel>Runs on Compute</SectionLabel>
          <div className="flex flex-wrap items-center gap-1.5">
            {WORKLOADS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[0.5625rem] font-semibold text-muted-foreground"
              >
                <Icon className="size-2.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </HeroPanel>
  );
}
