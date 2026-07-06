import { Card, CardHeader, CardFooter, Action } from "@prisma/eclipse";
import { cn } from "@/lib/cn";
import { CopyCommand } from "./copy-command";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

interface ServiceRow {
  icon: string;
  label: string;
  status: string;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ServiceChip {
  icon: string;
  label: string;
  isDanger?: boolean;
  hasCost?: boolean;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const THEM_CHIPS: ServiceChip[] = [
  { icon: "fa-regular fa-snowflake", label: "cold start", isDanger: true },
  { icon: "fa-regular fa-microchip", label: "compute", hasCost: true },
  { icon: "fa-regular fa-hourglass-clock", label: "timeout", isDanger: true },
  { icon: "fa-regular fa-globe", label: "edge", hasCost: true },
  { icon: "fa-regular fa-image", label: "images", hasCost: true },
  { icon: "fa-regular fa-signal-stream", label: "bandwidth", hasCost: true },
  { icon: "fa-regular fa-plug", label: "conn cap", isDanger: true },
  { icon: "fa-regular fa-layer-group", label: "cache", hasCost: true },
  { icon: "fa-regular fa-shapes", label: "+ more", hasCost: true },
];

const THEM_DRAWBACKS = [
  "Each surface has its own limits, its own price",
  "Cold starts & timeouts break long work",
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Chip({ icon, label, isDanger, hasCost }: ServiceChip) {
  return (
    <div
      className={cn(
        "flex border items-center gap-2 px-3 py-2.5 rounded-md bg-background-default",
        isDanger ? "border-foreground-error-strong/25" : "border-stroke-neutral",
      )}
    >
      <i
        className={cn(
          icon,
          "text-[10px] shrink-0",
          isDanger ? "text-foreground-error-strong" : "text-foreground-neutral-weaker",
        )}
      />
      <span className="font-mono text-[11px] text-foreground-neutral-weak flex-1 leading-none truncate">
        {label}
      </span>
      {hasCost && (
        <span className="font-mono text-[10px] text-foreground-neutral-weaker shrink-0">$$</span>
      )}
    </div>
  );
}

function CostBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-foreground-error/60 text-foreground-error-strong">
      <i className={cn(icon, "text-[10px]")} />
      <span className="whitespace-nowrap font-mono text-[11px] font-semibold leading-none">
        {label}
      </span>
    </div>
  );
}

function DrawbackItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[13.5px]">
      <i className="fa-regular  fa-xmark text-background-error-reverse-strong" />
      <span className="leading-5 text-foreground-neutral-weaker">{text}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TemplateCards
// ---------------------------------------------------------------------------

const TEMPLATES = [
  {
    title: "Next.js",
    subtitle: "A full-stack Next.js app paired with Prisma Postgres.",
    command: "bunx create-prisma@latest --template next",
  },
  {
    title: "TanStack Start",
    subtitle: "Modern full-stack TypeScript with Router & Query, paired with Prisma Postgres.",
    command: "bunx create-prisma@latest --template tanstack-start",
  },
  {
    title: "Hono API",
    subtitle: "Lightweight API backend. A good starting point for TypeScript APIs.",
    command: "bunx create-prisma@latest --template hono",
  },
];

// ---------------------------------------------------------------------------
// WorkloadCards
// ---------------------------------------------------------------------------

const WORKLOAD_TYPES = [
  {
    icon: "fa-regular fa-globe",
    title: "REST API",
    subtitle: "http · long-lived",
  },
  {
    icon: "fa-regular fa-rocket",
    title: "GraphQL",
    subtitle: "https · flexible",
  },
  {
    icon: "fa-regular fa-stars",
    title: "AI Agent",
    subtitle: "sse · streaming",
  },
  {
    icon: "fa-regular fa-bolt",
    title: "Streaming",
    subtitle: "http · long-running",
  },
  { icon: "fa-regular fa-cloud", title: "Full-stack", subtitle: "ssr · spa" },
  { icon: "fa-regular fa-lock", title: "gRPC", subtitle: "http2 · efficient" },
];

export function WorkloadCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
      {WORKLOAD_TYPES.map((item) => (
        <div
          key={item.title}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl",
            "border border-stroke-neutral shadow-box-low",
            "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]",
          )}
        >
          <Action color="ppg" size="2xl" className="shrink-0">
            <i className={cn(item.icon, "text-sm")} />
          </Action>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-sans-display [font-variation-settings:'wght'_800,'wdth'_110] text-sm text-foreground-neutral leading-5 truncate">
              {item.title}
            </span>
            <span className="font-mono text-xs text-foreground-neutral-weak truncate">
              {item.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TemplateCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {TEMPLATES.map((template) => (
        <Card
          key={template.title}
          className={cn(
            "gap-0 overflow-hidden justify-between",
            "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_100%)] pb-0",
          )}
        >
          <CardHeader className="space-y-2 border-b-0">
            <h3 className="type-title-xl text-foreground-neutral m-0 mb-2">{template.title}</h3>
            <p className="text-sm text-foreground-neutral-weak m-0 font-normal">
              {template.subtitle}
            </p>
          </CardHeader>
          <CardFooter className="bg-background-default border-t-0 flex-col items-stretch gap-3 pb-4">
            <code className="block w-full overflow-x-auto whitespace-nowrap rounded-md border border-stroke-neutral bg-background-neutral-weak px-3 py-2 font-mono text-xs text-foreground-neutral-weak">
              <span className="text-foreground-ppg-strong">$</span> {template.command}
            </code>
            <div className="self-end">
              <CopyCommand command={template.command} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ThemFragmentedCard
// ---------------------------------------------------------------------------

export function ThemFragmentedCard() {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border border-stroke-neutral bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] shadow-box-low h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <span className="type-title-xl text-foreground-neutral">Most TypeScript platforms</span>
        <span className="font-mono text-[11px] text-foreground-neutral-weaker tracking-wide shrink-0">
          SERVERLESS · FRAGMENTED
        </span>
      </div>

      {/* Services panel */}
      <div className="flex flex-1 flex-col justify-between gap-6 border border-stroke-neutral rounded-md p-4">
        {/* 3×3 chip grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {THEM_CHIPS.map((chip) => (
            <Chip key={chip.label} {...chip} />
          ))}
        </div>

        {/* Total cost row */}
        <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
          <span className="font-mono text-[11px] text-foreground-neutral-weaker uppercase tracking-wide">
            TOTAL COST
          </span>
          <div className="flex items-center gap-2">
            <CostBadge icon="fa-regular fa-laptop" label="9 Services" />
            <CostBadge icon="fa-regular fa-receipt" label="4 bills" />
          </div>
        </div>
      </div>

      {/* Drawbacks list */}
      <div className="flex flex-col gap-2">
        {THEM_DRAWBACKS.map((text) => (
          <DrawbackItem key={text} text={text} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UsUnifiedCard data
// ---------------------------------------------------------------------------

const US_SERVICES: ServiceRow[] = [
  {
    icon: "fa-regular fa-globe",
    label: "api · long-lived process",
    status: "live",
  },
  {
    icon: "fa-regular fa-image",
    label: "static assets · in-process",
    status: "live",
  },
  {
    icon: "fa-regular fa-layer-group",
    label: "cache headers · your rules",
    status: "live",
  },
  {
    icon: "fa-regular fa-clock-rotate-left",
    label: "background workers",
    status: "soon",
  },
];

const US_BENEFITS = [
  "Long-lived processes, long-running requests, persistent connections",
  "Self-hosting, without the painful parts",
];

// ---------------------------------------------------------------------------
// UsUnifiedCard sub-components
// ---------------------------------------------------------------------------

function UnifiedServiceRow({ icon, label, status }: ServiceRow) {
  const isSoon = status === "soon";
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-background-default border border-stroke-neutral">
      <i
        className={cn(
          icon,
          "text-[10px] shrink-0",
          isSoon ? "text-foreground-neutral-weaker" : "text-foreground-success",
        )}
      />
      <span className="font-mono text-[11px] text-foreground-neutral flex-1 leading-none">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-[10px] shrink-0",
          isSoon ? "text-foreground-neutral-weaker" : "text-foreground-success",
        )}
      >
        {status}
      </span>
    </div>
  );
}

function TealBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-stroke-ppg text-foreground-ppg">
      <i className={cn(icon, "text-[10px]")} />
      <span className="font-mono text-[11px] font-semibold leading-none">{label}</span>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[13.5px]">
      <i className="fa-regular fa-check text-foreground-ppg shrink-0" />
      <span className="leading-5 text-foreground-neutral-weaker">{text}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UsUnifiedCard
// ---------------------------------------------------------------------------

export function UsUnifiedCard() {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border border-stroke-ppg bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg-strong)_262.5%)] shadow-box-low h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="type-title-xl text-foreground-neutral">Prisma Compute</span>
        <span className="font-mono text-[11px] text-foreground-ppg tracking-wide shrink-0">
          LONG-LIVED · UNIFIED
        </span>
      </div>

      {/* Services panel */}
      <div className="flex flex-1 flex-col justify-between gap-4 border border-stroke-ppg-weak rounded-md bg-background-default p-4">
        {/* Service rows */}
        <div className="flex flex-col gap-2">
          {US_SERVICES.map((row) => (
            <UnifiedServiceRow key={row.label} {...row} />
          ))}
        </div>

        {/* Total cost row */}
        <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-stroke-neutral">
          <span className="font-mono text-[11px] text-foreground-neutral-weaker uppercase tracking-wide">
            TOTAL COST
          </span>
          <div className="flex items-center gap-2">
            <TealBadge icon="fa-regular fa-laptop" label="1 VM" />
            <TealBadge icon="fa-regular fa-receipt" label="1 Bill" />
          </div>
        </div>
      </div>

      {/* Benefits list */}
      <div className="flex flex-col gap-2">
        {US_BENEFITS.map((text) => (
          <BenefitItem key={text} text={text} />
        ))}
      </div>
    </div>
  );
}
