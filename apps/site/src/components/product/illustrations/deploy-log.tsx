import { AppWindow, CheckBold, Database } from "@/components/icons/forma";
import { CardChrome, HeroPanel, StatRow } from "./parts";

// Stop two of the /compute hero tour — "Deploy". The deploy itself, running:
// services detected, everything built, the database branched and migrated
// alongside the app, then a live URL. Real: the command, the step names, the
// service names and the hostname shape. The timings are this build's own — they
// are not a platform performance claim, and nothing here is a latency figure.

const STEPS = [
  { label: "detected 3 services", detail: "web · api · worker", time: "0.4s" },
  { label: "built services", detail: "3 of 3", time: "18.2s" },
  { label: "provisioned branched database", detail: "from main", time: "2.1s" },
  { label: "ran migrations", detail: "3 applied", time: "1.3s" },
  { label: "health check", detail: "200 OK", time: "0.9s" },
];

function Chip({ icon: Icon, label }: { icon: typeof AppWindow; label: string }) {
  return (
    <span className="flex items-center gap-1 rounded border border-prism-cyan-200 bg-prism-cyan-50 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-prism-cyan-800">
      <Icon className="size-2.5" />
      {label}
    </span>
  );
}

export function DeployLog() {
  return (
    <HeroPanel label="Illustration of a Prisma Compute deploy running: three detected services built, a branched database provisioned and migrated alongside the app, a passing health check, and the app live on its own URL">
      <CardChrome
        file="deploy"
        right={
          <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
            <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
            deploying
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-4 px-5 py-5">
        {/* the log */}
        <div className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 p-3 font-mono text-[0.625rem] leading-none">
          <p className="flex items-center gap-2 text-[0.6875rem]">
            <span className="text-prism-cyan-500">$</span>
            <span className="text-foreground">prisma deploy</span>
          </p>

          {STEPS.map(({ label, detail, time }) => (
            <p key={label} className="flex items-center gap-2">
              <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
              <span className="truncate text-foreground">{label}</span>
              <span className="truncate text-muted-foreground/70">{detail}</span>
              <span className="ml-auto shrink-0 text-muted-foreground">{time}</span>
            </p>
          ))}

          {/* the step still running, so the frame reads as a deploy in motion */}
          <p className="flex items-center gap-2">
            <span
              aria-hidden
              className="ml-0.5 size-2 shrink-0 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none"
            />
            <span className="ml-0.5 truncate text-foreground">streaming logs</span>
            <span
              aria-hidden
              className="inline-block h-2.5 w-[0.35rem] shrink-0 animate-caret-blink bg-prism-cyan-400 motion-reduce:animate-none"
            />
          </p>
        </div>

        {/* the outcome: app and database went out as one thing */}
        <div className="flex flex-col gap-3 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-3.5">
          <div className="flex items-center gap-2">
            <CheckBold className="size-3.5 shrink-0 text-prism-cyan-600" />
            <span className="text-[0.8125rem] font-semibold text-foreground">Deployed</span>
            <span className="ml-auto flex items-center gap-1.5">
              <Chip icon={AppWindow} label="app" />
              <Chip icon={Database} label="db" />
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border/80 bg-card px-3 py-2">
            <span className="truncate font-mono text-[0.6875rem] text-foreground">
              acme-dashboard.prisma.app
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
              <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
              live
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <StatRow label="deployed in" value="22.9s" />
          <StatRow label="app + database" value="shipped together" accent />
        </div>
      </div>
    </HeroPanel>
  );
}
