"use client";

import { useEffect, useRef, useState } from "react";
import { useShouldPause } from "@/lib/use-animation-pausing";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Action,
  Separator,
  ChartContainer,
  type ChartConfig,
} from "@prisma/eclipse";
import { BarChart, Bar, YAxis } from "recharts";
import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// StatefulExecutionCard
// ---------------------------------------------------------------------------

const TRAFFIC_DATA = [
  { v: 65 },
  { v: 45 },
  { v: 25 },
  { v: 55 },
  { v: 75 },
  { v: 40 },
  { v: 80 },
  { v: 65 },
  { v: 90 },
  { v: 50 },
  { v: 35 },
  { v: 55 },
  { v: 45 },
  { v: 25 },
  { v: 70 },
  { v: 60 },
  { v: 50 },
  { v: 85 },
  { v: 40 },
  { v: 65 },
  { v: 95 },
  { v: 75 },
  { v: 50 },
  { v: 60 },
  { v: 45 },
  { v: 80 },
  { v: 35 },
  { v: 90 },
  { v: 55 },
  { v: 70 },
];

const CHART_CONFIG: ChartConfig = { v: { color: "#2DD4BF" } };
const BASE_UPTIME_SECS = 6 * 86400 + 14 * 3600 + 22 * 60 + 2;

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 font-mono text-xs">
      <span className="text-foreground-neutral-weak">{label}</span>
      <span className="text-foreground-ppg-reverse-weak">{value}</span>
    </div>
  );
}

export function StatefulExecutionCard() {
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);
  // #1 + #5 — pause the 1 s uptime ticker when off-screen or tab hidden.
  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useShouldPause(containerRef);

  useEffect(() => {
    setMounted(true);
    if (paused) return;
    const start = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const t = BASE_UPTIME_SECS + elapsed;
  const uptime = `UP ${Math.floor(t / 86400)}d ${Math.floor((t % 86400) / 3600)}h ${Math.floor((t % 3600) / 60)}m ${String(t % 60).padStart(2, "0")}s`;

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-stroke-neutral bg-background-neutral-weak overflow-hidden w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 font-mono text-2xs">
          <div className="w-2 h-2 rounded-full bg-foreground-ppg-reverse-weak animate-pulse shrink-0" />
          <span className="text-foreground-neutral">api.ts</span>
          <span className="text-foreground-neutral">·</span>
          <span className="text-foreground-neutral">process #4f2a</span>
        </div>
        <span className="font-mono text-2xs text-foreground-neutral-weaker tabular-nums">
          {uptime}
        </span>
      </div>

      {/* Traffic chart */}
      <div className="px-6">
        {mounted ? (
          <ChartContainer config={CHART_CONFIG} className="h-32 w-full aspect-auto">
            <BarChart
              data={TRAFFIC_DATA}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              barCategoryGap="25%"
            >
              <YAxis domain={[0, 100]} hide />
              <Bar
                dataKey="v"
                fill="var(--color-v)"
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-32" />
        )}
      </div>

      {/* Metrics */}
      <div className="px-6 pb-8 pt-4 mt-1">
        <Separator />
        <MetricRow label="active connections" value="1,289 open" />
        <Separator />
        <MetricRow label="in-process cache" value="hot · 42 MB" />
        <Separator />
        <MetricRow label="p95 latency" value="42ms" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DeployTerminal — types & data
// ---------------------------------------------------------------------------

type TerminalLine =
  | { type: "command"; cmd: string }
  | { type: "step"; prefix: "├" | "└"; label: string; detail: string }
  | { type: "success"; text: string }
  | { type: "service"; name: string; value: string; isLink: boolean };

const LINES: TerminalLine[] = [
  { type: "command", cmd: "@prisma/cli@latest app deploy" },
  { type: "step", prefix: "├", label: "Detecting services", detail: "3 found" },
  {
    type: "step",
    prefix: "├",
    label: "Provisioning Postgres",
    detail: "iad1 · 12ms",
  },
  { type: "step", prefix: "├", label: "Building bun bundle", detail: "1.3 MB" },
  { type: "step", prefix: "├", label: "Uploading artifacts", detail: "" },
  { type: "step", prefix: "└", label: "Rolling out", detail: "3 replicas" },
  { type: "success", text: "Live in 4.2s" },
  {
    type: "service",
    name: "api",
    value: "https://api-h8e2.iad1.prisma.build",
    isLink: true,
  },
  {
    type: "service",
    name: "agent",
    value: "https://agent-h8e2.iad1.prisma.build",
    isLink: true,
  },
  {
    type: "service",
    name: "worker",
    value: "every 5 min · next at 14:35 UTC",
    isLink: false,
  },
];

// ms after mount each line appears
const DELAYS = [300, 750, 1200, 1750, 2250, 2800, 3500, 3800, 4100, 4400];
const LOOP_PAUSE = 6000; // ms after last line before restart

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Mounts invisible, then transitions to visible on next frame */
function AnimatedLine({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      className="transition-all duration-300 ease-out text-2xs"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
      }}
    >
      {children}
    </div>
  );
}

function BlinkingCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className="w-1.5 h-3.5 bg-foreground-ppg"
      style={{ opacity: on ? 1 : 0, transition: "none" }}
    />
  );
}

function renderLine(line: TerminalLine) {
  switch (line.type) {
    case "command":
      return (
        <div className="flex items-baseline gap-2">
          <span className="text-foreground-ppg select-none">$</span>
          <span className="text-foreground-neutral">{line.cmd}</span>
        </div>
      );
    case "step":
      return (
        <div className="flex items-baseline">
          <span className="text-gray-600 w-4 shrink-0 select-none">{line.prefix}</span>
          <span className="flex-1">
            <span className="text-foreground-neutral">{line.label}</span>
            {line.detail && <span className="text-gray-500"> {line.detail}</span>}
          </span>
          <span className="text-foreground-ppg text-xs ml-6 shrink-0">done</span>
        </div>
      );
    case "success":
      return (
        <div className="flex items-baseline gap-2">
          <span className="text-foreground-ppg select-none">✓</span>
          <span className="text-foreground-neutral font-medium">{line.text}</span>
        </div>
      );
    case "service":
      return (
        <div className="flex items-baseline gap-3 pl-4">
          <span className="text-foreground-neutral w-10 shrink-0">{line.name}</span>
          {line.isLink ? (
            <span className="text-foreground-ppg underline underline-offset-2">{line.value}</span>
          ) : (
            <span className="text-gray-500">{line.value}</span>
          )}
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// DeployTerminal
// ---------------------------------------------------------------------------

export function DeployTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // #1 + #2 + #5 — pause loop when off-screen/tab hidden; reset on re-entry.
  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useShouldPause(containerRef, () => {
    // Re-entry: cancel pending timeouts and reset so the animation restarts fresh.
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleCount(0);
  });

  useEffect(() => {
    if (paused) {
      // Pause: cancel all pending timeouts.
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      return;
    }

    function schedule() {
      // Clear any pending timeouts from previous run
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      setVisibleCount(0);

      DELAYS.forEach((delay, i) => {
        timeoutsRef.current.push(setTimeout(() => setVisibleCount(i + 1), delay));
      });

      // Loop: reset then restart
      const loopAt = DELAYS[DELAYS.length - 1] + LOOP_PAUSE;
      timeoutsRef.current.push(setTimeout(schedule, loopAt));
    }

    schedule();
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [paused]);

  function handleCopy() {
    void navigator.clipboard.writeText("@prisma/cli@latest app deploy");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl border border-stroke-neutral overflow-hidden bg-background-default font-mono leading-6 select-text"
    >
      {/* ── Tab bar ── */}
      <div className="flex items-stretch border-b border-stroke-neutral bg-background-neutral-weak">
        {/* Active tab */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background-default text-foreground-neutral">
          <i className="fa-regular fa-terminal text-foreground-ppg text-[11px]" />
          <span className="text-[10px]">~/my-app</span>
        </div>
        {/* Spacer */}
        <div className="flex-1" />
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="px-3 text-foreground-neutral-weak hover:text-foreground-neutral transition-colors"
          aria-label="Copy command"
        >
          {copied ? (
            <i className="fa-regular fa-check text-foreground-ppg-strong text-sm" />
          ) : (
            <i className="fa-regular fa-copy text-sm" />
          )}
        </button>
      </div>

      {/* ── Content ── */}
      <div className="p-5 space-y-1 min-h-70">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <AnimatedLine key={i}>{renderLine(line)}</AnimatedLine>
        ))}
        <div className="pt-0.5">
          <BlinkingCursor />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WbDeployReplay — Deploy tab art
// ---------------------------------------------------------------------------

const DEPLOY_STEPS: Array<{
  type: "cmd" | "dim" | "ok" | "url" | "done";
  text: string;
  delay: number;
  stage?: string;
}> = [
    { type: "cmd", text: "@prisma/cli@latest app deploy", delay: 250, stage: "frame" },
    {
      type: "dim",
      text: "→ detected prisma.config.ts · commit a7f3c11",
      delay: 650,
    },
    {
      type: "dim",
      text: "→ bundling ./src · 48 modules",
      delay: 700,
      stage: "shell",
    },
    { type: "ok", text: "compiled layout.tsx", delay: 550, stage: "header" },
    { type: "ok", text: "compiled nav.tsx", delay: 500, stage: "nav" },
    {
      type: "ok",
      text: "compiled dashboard/kpis.tsx",
      delay: 600,
      stage: "kpis",
    },
    {
      type: "ok",
      text: "compiled dashboard/chart.tsx",
      delay: 650,
      stage: "chart",
    },
    {
      type: "ok",
      text: "compiled dashboard/orders.tsx",
      delay: 600,
      stage: "table",
    },
    { type: "url", text: "api → https://your-app.iad1.prisma.build", delay: 600 },
    {
      type: "done",
      text: "deployed in 4.8s · app is live",
      delay: 500,
      stage: "live",
    },
  ];

const DEPLOY_STAGES = [
  "frame",
  "shell",
  "header",
  "nav",
  "kpis",
  "chart",
  "table",
  "live",
] as const;
type DeployStage = (typeof DEPLOY_STAGES)[number];

function WbDeployReplay() {
  const [n, setN] = useState(0);
  const [stage, setStage] = useState<DeployStage | null>(null);
  const [runKey, setRunKey] = useState(0);

  // #1 + #2 + #5 — pause step-chain when off-screen; reset on re-entry.
  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useShouldPause(containerRef, () => {
    setN(0);
    setStage(null);
    setRunKey((k) => k + 1);
  });

  const has = (s: DeployStage) =>
    stage !== null && DEPLOY_STAGES.indexOf(stage) >= DEPLOY_STAGES.indexOf(s);

  useEffect(() => {
    if (paused) return;
    if (n >= DEPLOY_STEPS.length) {
      const t = setTimeout(() => {
        setN(0);
        setStage(null);
        setRunKey((k) => k + 1);
      }, 3600);
      return () => clearTimeout(t);
    }
    const step = DEPLOY_STEPS[n];
    const t = setTimeout(() => {
      if (step.stage) setStage(step.stage as DeployStage);
      setN((prev) => prev + 1);
    }, step.delay);
    return () => clearTimeout(t);
  }, [n, runKey, paused]);

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row gap-3 font-mono min-h-72">
      {/* Terminal */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="rounded-lg border border-stroke-neutral overflow-hidden bg-background-default text-[11px] flex flex-col flex-1">
          <div className="flex items-stretch border-b border-stroke-neutral bg-background-neutral-weaker shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b-2 border-foreground-ppg bg-background-default">
              <i className="fa-regular fa-terminal text-foreground-ppg text-[10px]" />
              <span className="text-foreground-neutral text-[10px]">~/my-app · main</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3 px-3">
              <button
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide text-foreground-neutral-weak hover:text-foreground-neutral transition-colors"
                onClick={() => {
                  setN(0);
                  setStage(null);
                  setRunKey((k) => k + 1);
                }}
              >
                <i className="fa-regular fa-rotate-left text-[10px]" />
                REPLAY
              </button>
              <button className="text-foreground-neutral-weak hover:text-foreground-neutral transition-colors">
                <i className="fa-regular fa-copy text-[11px]" />
              </button>
            </div>
          </div>
          <div className="p-3 space-y-0.5 flex-1">
            {DEPLOY_STEPS.slice(0, n).map((step, i) => (
              <div key={`${runKey}-${i}`} className="flex items-start gap-1.5 leading-5">
                <span
                  className={cn(
                    "shrink-0 w-3 text-center",
                    step.type === "cmd"
                      ? "text-foreground-ppg"
                      : step.type === "ok"
                        ? "text-green-400"
                        : step.type === "done"
                          ? "text-foreground-ppg"
                          : "text-foreground-neutral-weaker",
                  )}
                >
                  {step.type === "cmd"
                    ? "$"
                    : step.type === "ok"
                      ? "✓"
                      : step.type === "done"
                        ? "●"
                        : "→"}
                </span>
                <span
                  className={cn(
                    "flex-1",
                    step.type === "cmd"
                      ? "text-foreground-neutral"
                      : step.type === "ok"
                        ? "text-foreground-neutral-weak"
                        : step.type === "done"
                          ? "text-foreground-ppg"
                          : step.type === "url"
                            ? "text-foreground-neutral-weak"
                            : "text-foreground-neutral-weaker",
                  )}
                >
                  {step.type === "url" ? (
                    <>
                      api {"      "}→{" "}
                      <span className="text-foreground-ppg">
                        https://your-app.iad1.prisma.build
                      </span>
                    </>
                  ) : (
                    step.text
                  )}
                </span>
              </div>
            ))}
            {n < DEPLOY_STEPS.length && (
              <span className="inline-block w-1.5 h-3 bg-foreground-ppg animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Mock app */}
      <div
        className={cn(
          "flex-1 min-w-0 rounded-lg border overflow-hidden flex flex-col transition-[border-color] duration-500",
          has("live") ? "border-foreground-ppg/40" : "border-stroke-neutral",
          "bg-background-neutral-weak",
        )}
      >
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-stroke-neutral bg-background-neutral-weaker shrink-0">
          <div className="flex-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background-neutral">
            {has("shell") ? (
              <>
                <i className="fa-regular fa-lock text-[8px] text-foreground-neutral-weaker" />
                <span className="font-mono text-[9px] text-foreground-neutral">
                  your-app.iad1.prisma.build
                </span>
                {has("live") && (
                  <span className="ml-auto flex items-center gap-0.5 font-mono text-[8px] text-foreground-ppg">
                    <span className="w-1 h-1 rounded-full bg-foreground-ppg animate-pulse" />
                    live
                  </span>
                )}
              </>
            ) : (
              <span className="font-mono text-[9px] text-foreground-neutral-weaker">
                connecting…
              </span>
            )}
          </div>
        </div>
        {/* viewport */}
        <div className="flex flex-1 overflow-hidden">
          {/* sidebar */}
          <div
            className={cn(
              "w-10 border-r border-stroke-neutral p-1.5 flex flex-col gap-1 transition-opacity duration-500 shrink-0",
              has("shell") ? "opacity-100" : "opacity-0",
            )}
          >
            {has("header") && (
              <div className="h-2 bg-foreground-neutral-weaker/25 rounded mb-0.5" />
            )}
            {has("nav") &&
              [80, 62, 70, 58, 66].map((w, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded",
                    i === 0 ? "bg-foreground-ppg/30" : "bg-foreground-neutral-weaker/20",
                  )}
                  style={{ width: `${w}%` }}
                />
              ))}
          </div>
          {/* main */}
          <div className="flex-1 p-1.5 flex flex-col gap-1.5 overflow-hidden min-w-0">
            {has("shell") && (
              <div
                className={cn(
                  "flex items-center justify-between transition-opacity duration-300",
                  has("header") ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="h-2 w-14 bg-foreground-neutral-weaker/20 rounded" />
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-foreground-neutral-weaker/20 rounded" />
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors duration-500",
                      has("live") ? "bg-foreground-ppg" : "bg-foreground-neutral-weaker/20",
                    )}
                  />
                </div>
              </div>
            )}
            {has("kpis") && (
              <div className="grid grid-cols-3 gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-background-default/60 rounded p-1 space-y-0.5">
                    <div className="h-1 w-6 bg-foreground-neutral-weaker/25 rounded" />
                    <div className="h-2 w-5 bg-foreground-neutral-weaker/30 rounded" />
                  </div>
                ))}
              </div>
            )}
            {has("chart") && (
              <div className="bg-background-default/40 rounded p-1.5 flex-1 flex flex-col gap-1">
                <div className="h-1 w-10 bg-foreground-neutral-weaker/20 rounded" />
                <div className="flex items-end gap-px flex-1 min-h-0">
                  {[45, 62, 38, 71, 55, 83, 49, 67, 58, 76, 42, 68].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-foreground-ppg/35"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {has("table") && (
              <div className="space-y-0.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground-neutral-weaker/20 shrink-0" />
                    <div className="flex-1 h-1.5 bg-foreground-neutral-weaker/15 rounded" />
                    <div
                      className={cn(
                        "h-1.5 w-3 rounded transition-colors duration-500",
                        has("live") && i === 0
                          ? "bg-foreground-ppg/40"
                          : "bg-foreground-neutral-weaker/15",
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* caption */}
        <div className="border-t border-stroke-neutral px-2 py-1 font-mono text-[9px] text-foreground-neutral-weaker shrink-0">
          {!stage ? (
            "waiting for push…"
          ) : stage === "frame" ? (
            "provisioning host…"
          ) : stage === "shell" ? (
            "bundling layout"
          ) : stage === "header" ? (
            "compiling header"
          ) : stage === "nav" ? (
            "compiling nav"
          ) : stage === "kpis" ? (
            "rendering kpis"
          ) : stage === "chart" ? (
            "rendering chart"
          ) : stage === "table" ? (
            "rendering data"
          ) : (
            <>
              <span className="text-foreground-ppg">● </span>live · your-app.iad1.prisma.build
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WbRuntimeMonitor — Runtime tab art
// ---------------------------------------------------------------------------

const RUNTIME_TASKS = [
  {
    icon: "fa-regular fa-bolt",
    kind: "Stream",
    code: "chat.stream",
    tag: "384 active",
    color: "#2DD4BF",
    pulse: true,
  },
  {
    icon: "fa-regular fa-arrows-left-arrow-right",
    kind: "HTTP",
    code: "POST /api/invoice",
    tag: "42ms",
    color: "#818cf8",
    pulse: false,
  },
  {
    icon: "fa-regular fa-arrows-left-arrow-right",
    kind: "HTTP",
    code: "GET /api/feed",
    tag: "in flight",
    color: "#facc15",
    pulse: true,
  },
  {
    icon: "fa-regular fa-stars",
    kind: "Agent",
    code: "llm.generate",
    tag: "running",
    color: "#6b7280",
    pulse: false,
  },
  {
    icon: "fa-regular fa-database",
    kind: "Retrieval",
    code: "vector.search",
    tag: "running",
    color: "#a78bfa",
    pulse: true,
  },
];

// #4 – requestIdleCallback polyfill: defer sparkline updates to idle time.
const rIC: (cb: () => void) => number =
  typeof requestIdleCallback !== "undefined"
    ? (cb) => requestIdleCallback(cb)
    : (cb) => window.setTimeout(cb, 16) as unknown as number;
const cIC: (id: number) => void =
  typeof cancelIdleCallback !== "undefined"
    ? (id) => cancelIdleCallback(id)
    : (id) => clearTimeout(id);

function WbRuntimeMonitor() {
  const [cpu, setCpu] = useState<number[]>(() => Array.from({ length: 40 }, () => 4));
  const [mem, setMem] = useState<number[]>(() => Array.from({ length: 40 }, () => 6));
  const [tick, setTick] = useState(0);

  // #1 + #5 — pause the 700 ms sparkline ticker when off-screen or tab hidden.
  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useShouldPause(containerRef);

  useEffect(() => {
    if (paused) return;
    let icHandle = 0;
    // #4 – schedule the heavy state update during browser idle time.
    const id = setInterval(() => {
      icHandle = rIC(() => {
        setCpu((p) => [...p.slice(1), 12 + Math.random() * 22 + (Math.random() < 0.12 ? 22 : 0)]);
        setMem((p) => [...p.slice(1), 26 + Math.random() * 14 + (Math.random() < 0.1 ? 10 : 0)]);
        setTick((t) => t + 1);
      });
    }, 700);
    return () => {
      clearInterval(id);
      cIC(icHandle);
    };
  }, [paused]);

  const W = 200,
    H = 42;
  const spark = (data: number[], maxY = 60) =>
    data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - (Math.min(v, maxY) / maxY) * H;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const m = String(22 + (Math.floor(tick / 60) % 38)).padStart(2, "0");
  const s = String(tick % 60).padStart(2, "0");

  return (
    <div ref={containerRef} className="flex flex-col gap-4 font-mono min-h-72">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground-ppg animate-pulse shrink-0" />
          <span className="text-xs text-foreground-neutral">bun · pid 4f2a · api.ts</span>
        </div>
        <span className="text-[10px] text-foreground-neutral-weaker tabular-nums">
          UP 6d 14h {m}m {s}s
        </span>
      </div>

      {/* Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-stroke-neutral bg-background-neutral-weak p-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] text-foreground-neutral-weaker tracking-wider">CPU</span>
            <span className="text-xs text-foreground-ppg tabular-nums">
              {Math.round(cpu[cpu.length - 1])}%
            </span>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            {Array.from({ length: 7 }).map((_, gi) => (
              <line
                key={gi}
                x1={((gi + 1) / 8) * W}
                y1="0"
                x2={((gi + 1) / 8) * W}
                y2={H}
                stroke="rgba(148,163,184,0.12)"
                strokeWidth="1"
              />
            ))}
            <polyline
              points={`0,${H} ${spark(cpu)} ${W},${H}`}
              fill="rgba(45,212,191,0.08)"
              stroke="none"
            />
            <polyline
              points={spark(cpu)}
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="rounded-lg border border-stroke-neutral bg-background-neutral-weak p-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] text-foreground-neutral-weaker tracking-wider">MEM</span>
            <span className="text-xs text-indigo-300 tabular-nums">
              {Math.round(mem[mem.length - 1] * 8)}MB
            </span>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            {Array.from({ length: 7 }).map((_, gi) => (
              <line
                key={gi}
                x1={((gi + 1) / 8) * W}
                y1="0"
                x2={((gi + 1) / 8) * W}
                y2={H}
                stroke="rgba(148,163,184,0.12)"
                strokeWidth="1"
              />
            ))}
            <polyline
              points={`0,${H} ${spark(mem)} ${W},${H}`}
              fill="rgba(165,180,252,0.10)"
              stroke="none"
            />
            <polyline
              points={spark(mem)}
              fill="none"
              stroke="#a5b4fc"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="h-px bg-stroke-neutral shrink-0" />

      {/* Tasks */}
      <div>
        <div className="text-[10px] text-foreground-neutral-weaker tracking-wider mb-2">
          CONCURRENT TASKS · {RUNTIME_TASKS.length}
        </div>
        <div>
          {RUNTIME_TASKS.map((task, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t border-stroke-neutral" />}
              <div className="flex items-center gap-2 py-2.5">
                <i className={cn(task.icon, "text-sm shrink-0")} style={{ color: task.color }} />
                <span className="text-[11px] text-foreground-neutral-weak">{task.kind} ·</span>
                <span
                  className="font-mono text-[9px] border px-1.5 py-0.5 rounded shrink-0"
                  style={{ borderColor: task.color + "60", color: task.color }}
                >
                  {task.code}
                </span>
                <span className="ml-auto text-[10px] text-foreground-neutral-weaker shrink-0">
                  {task.tag}
                </span>
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    task.pulse ? "animate-pulse" : "",
                  )}
                  style={{ backgroundColor: task.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ZeroConfigBYO — Co-located tab art
// ---------------------------------------------------------------------------

const DB_OPTIONS = [
  {
    id: "ppg",
    name: "Prisma Postgres",
    icon: "fa-regular fa-chart-pyramid",
    host: "db.prisma-data.com",
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: "fa-kit-duotone fa-supabase",
    host: "db.supabase.co",
  },
  {
    id: "neon",
    name: "Neon",
    icon: "fa-kit-duotone fa-neon",
    host: "ep-calm.neon.tech",
  },
  {
    id: "rds",
    name: "Amazon RDS",
    icon: "fa-brands fa-aws",
    host: "prod.rds.amazonaws.com",
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: "fa-regular fa-database",
    host: "mysql.internal",
  },
  {
    id: "self",
    name: "Self-hosted",
    icon: "fa-regular fa-server",
    host: "10.0.4.12",
  },
];

const ZC_BOOT_LINES = [
  {
    t: 0,
    showAt: 200,
    k: "boot",
    v: "prisma runtime · bun 1.1.x",
    tone: "dim",
  },
  { t: 120, showAt: 900, k: "env", v: "NODE_ENV=production", tone: "dim" },
  { t: 240, showAt: 1600, k: "env", v: "PORT=3000", tone: "dim" },
  { t: 360, showAt: 2500, k: "inject", v: "DATABASE_URL", tone: "hero" },
  {
    t: 480,
    showAt: 3400,
    k: "pool",
    v: "persistent pool ready · 8 conns",
    tone: "ok",
  },
  { t: 600, showAt: 4200, k: "ready", v: "listening on :3000", tone: "ok" },
] as const;

const ZC_BOOT_FINAL = 4200;

function ZeroConfigBYO() {
  const [selectedDb, setSelectedDb] = useState(0);
  const [bootTick, setBootTick] = useState(0);
  const [userPicked, setUserPicked] = useState(false);

  // #1 + #2 + #5 — pause boot/cycle when off-screen; reset fully on re-entry.
  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useShouldPause(containerRef, () => {
    setBootTick(0);
    setUserPicked(false);
    setSelectedDb(0);
  });

  const seated = DB_OPTIONS[selectedDb];

  useEffect(() => {
    if (bootTick >= ZC_BOOT_FINAL || paused) return;
    const id = setInterval(() => setBootTick((t) => Math.min(ZC_BOOT_FINAL, t + 80)), 80);
    return () => clearInterval(id);
  }, [bootTick, paused]);

  const injected = bootTick >= 2500;
  const ready = bootTick >= ZC_BOOT_FINAL;
  const visible = ZC_BOOT_LINES.filter((l) => l.showAt <= bootTick);

  useEffect(() => {
    if (userPicked || !ready || paused) return;
    const id = setInterval(() => setSelectedDb((i) => (i + 1) % DB_OPTIONS.length), 3600);
    return () => clearInterval(id);
  }, [userPicked, ready, paused]);

  const pick = (i: number) => {
    setUserPicked(true);
    setSelectedDb(i);
  };

  return (
    <div ref={containerRef} className="font-mono text-xs min-h-72">
      <div className="rounded-xl border border-stroke-neutral overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stroke-neutral bg-background-neutral-weaker">
          <span className="text-[10px] text-foreground-neutral-weak uppercase tracking-widest">
            Zero connection config
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 text-[9px] px-2.5 py-1 rounded-full border font-mono uppercase tracking-wide",
              ready
                ? "border-foreground-ppg bg-foreground-ppg text-background-default font-bold"
                : injected
                  ? "border-amber-400 text-amber-400"
                  : "border-stroke-neutral text-foreground-neutral-weaker",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                ready
                  ? "bg-background-default"
                  : injected
                    ? "bg-amber-400"
                    : "bg-foreground-neutral-weaker/40",
              )}
            />
            {ready ? "READY" : injected ? "WIRED" : "BOOTING"}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row">
          {/* Terminal column */}
          <div className="flex-1 min-w-0 p-4">
            <div className="rounded-lg border border-stroke-neutral overflow-hidden bg-background-default h-full flex flex-col">
              {/* Tab-style chrome */}
              <div className="flex items-stretch border-b border-stroke-neutral bg-background-neutral-weaker shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b-2 border-foreground-ppg bg-background-default">
                  <i className="fa-regular fa-terminal text-foreground-ppg text-[10px]" />
                  <span className="text-foreground-neutral text-[10px]">bun run start</span>
                </div>
                <div className="flex-1" />
                <button className="px-3 text-foreground-neutral-weak hover:text-foreground-neutral transition-colors">
                  <i className="fa-regular fa-copy text-[11px]" />
                </button>
              </div>
              {/* Boot lines */}
              <div className="p-3 space-y-0.5 flex-1">
                {visible.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-2 leading-5",
                      line.tone === "hero" &&
                      "bg-foreground-ppg/10 border-l-2 border-foreground-ppg -mx-3 px-3 py-1",
                    )}
                  >
                    <span className="text-foreground-neutral-weaker shrink-0 text-right tabular-nums">
                      {String(line.t).padStart(4, "0")}ms
                    </span>
                    <span
                      className={cn(
                        "w-10 shrink-0 uppercase",
                        line.tone === "hero"
                          ? "text-foreground-ppg"
                          : line.tone === "ok"
                            ? "text-green-400"
                            : "text-foreground-neutral-weaker",
                      )}
                    >
                      {line.k}
                    </span>
                    <span
                      className={cn(
                        "flex-1 min-w-0 break-all",
                        line.tone === "ok"
                          ? "text-foreground-neutral"
                          : line.tone === "hero"
                            ? "text-foreground-neutral"
                            : "text-foreground-neutral-weak",
                      )}
                    >
                      {line.tone === "hero" ? (
                        <>
                          <span className="text-foreground-ppg">DATABASE_URL</span>
                          <span className="text-foreground-neutral-weak">=</span>
                          postgres://
                          <span className="text-foreground-neutral-weaker">***:***</span>@
                          <span className="text-foreground-ppg font-bold">{seated.host}</span>
                          :5432/postgres
                          <span className="ml-2 text-[9px] border border-foreground-ppg text-foreground-ppg px-1 rounded uppercase">
                            injected
                          </span>
                        </>
                      ) : (
                        line.v
                      )}
                    </span>
                  </div>
                ))}
                {!ready && (
                  <span className="inline-block w-1.5 h-3 bg-foreground-ppg animate-pulse ml-20" />
                )}
              </div>
            </div>
          </div>

          {/* Runtime section */}
          <div className="w-full md:w-64 md:shrink-0 p-4 md:pl-0 flex flex-col gap-3 border-t border-stroke-neutral md:border-t-0 ">
            {/* RUNTIME header */}
            <div className="flex items-center gap-3">
              <i className="fa-regular fa-microchip text-foreground-ppg text-base shrink-0" />
              <div className="flex-1">
                <div className="text-[9px] text-foreground-ppg uppercase tracking-widest">
                  RUNTIME
                </div>
                <div className="text-[10px] text-foreground-neutral-weak">process.env</div>
              </div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full shrink-0 transition-colors duration-500",
                  ready
                    ? "bg-foreground-ppg"
                    : injected
                      ? "bg-amber-400"
                      : "bg-foreground-neutral-weaker/30",
                )}
              />
            </div>

            <div className="border-t border-stroke-neutral" />

            {/* DATABASE_URL box */}
            <div className="bg-background-neutral-weak rounded-lg p-3">
              <div className="text-[9px] text-foreground-ppg mb-1">DATABASE_URL</div>
              <div className="text-[9px] italic">
                {injected ? (
                  <>
                    <span className="text-foreground-neutral-weaker not-italic">
                      postgres://***@
                    </span>
                    <span className="text-foreground-ppg font-bold not-italic">{seated.host}</span>
                  </>
                ) : (
                  <span className="text-foreground-neutral-weaker">awaiting injection</span>
                )}
              </div>
            </div>

            {/* Footnote */}
            <div className="text-[9px] text-foreground-neutral-weaker uppercase tracking-wide leading-relaxed">
              NO .ENV FILE · NO SECRETS COMMITTED · ROTATED IN PLACE
            </div>

            <div className="border-t border-stroke-neutral" />

            {/* Accepts */}
            <div>
              <span className="text-[9px] text-foreground-ppg uppercase tracking-wider font-bold">
                ACCEPTS
              </span>{" "}
              <span className="text-[9px] text-foreground-neutral-weak">
                any Postgres-compatible connection string
              </span>
            </div>

            {/* 6-col DB picker */}
            <div className="grid grid-cols-6 gap-1">
              {DB_OPTIONS.map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => pick(i)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 px-1 rounded-lg border transition-all",
                    i === selectedDb
                      ? "border-foreground-ppg bg-background-ppg/20 text-foreground-ppg"
                      : "border-stroke-neutral bg-background-default text-foreground-neutral-weaker hover:border-stroke-neutral-strong",
                  )}
                >
                  <i className={cn(opt.icon, "text-sm")} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TABS = [
  {
    value: "deploy",
    label: "Deploy",
    icon: "fa-regular fa-rocket",
    title: "Push code, it runs",
    Visual: WbDeployReplay,
    description: (
      <>
        Run{" "}
        <code className="font-mono text-foreground-ppg">@prisma/cli@latest app deploy</code>, then connect a GitHub branch for push-to-deploy. Prisma
        Compute builds your application and brings it live with a URL attached.
        <br />
        <br />
        No build pipeline to configure, deployment scripts to maintain and dashboard state that
        drifts from what&apos;s in your repo.
      </>
    ),
  },
  {
    value: "runtime",
    label: "Runtime",
    icon: "fa-regular fa-microchip",
    title: "Long-lived by default.",
    Visual: WbRuntimeMonitor,
    description: (
      <>
        Standard TypeScript on Bun, running as long-lived processes. Long-running requests,
        in-process caches, and streaming responses work exactly as you&apos;d expect.
        <br />
        <br />
        Because your code stays running, so do your connections.
      </>
    ),
  },
  {
    value: "co-located",
    label: "Co-Located",
    icon: "fa-regular fa-database",
    title: "Database right next to your code.",
    Visual: ZeroConfigBYO,
    description: (
      <>
        Auto-wires Prisma Postgres and runs in the same environment. Built-in connection pooling for long-lived processes.
        <br />
        <br />
        Works with any database, no lock-in.
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HowItWorks() {
  // Track the active tab so we only mount the active visual.
  // All three visual components (WbDeployReplay, WbRuntimeMonitor, ZeroConfigBYO)
  // run timers and animation loops — there's no reason to have all three alive
  // simultaneously when only one is ever visible.
  const [activeTab, setActiveTab] = useState("deploy");

  return (
    <div className="w-full rounded-xl border border-stroke-neutral overflow-hidden">
      <Tabs
        defaultValue="deploy"
        onValueChange={setActiveTab}
        className="my-0 overflow-visible flex flex-col"
      >
        {/* Tab list */}
        <TabsList
          className={cn(
            "gap-px p-0 rounded-none w-full overflow-hidden",
            "bg-stroke-neutral", // 1px gap colour between tabs
          )}
        >
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                // Reset Eclipse defaults & build panel style
                "group flex items-center justify-left cursor-pointer",
                "sm:flex-1 flex-row gap-2",
                "px-5 py-3 sm:px-5 sm:py-5 h-auto rounded-none",
                // Backgrounds
                "bg-background-neutral-weaker data-[state=active]:bg-background-neutral-weak",
                // Border — bottom acts as active indicator
                "border-b border-stroke-neutral",
                "data-[state=active]:border-foreground-ppg data-[state=active]:max-sm:w-full",
                // Text colour handled per child
                "transition-all duration-150",
                // Mobile inactive: shrink to icon-only width
                "data-[state=inactive]:max-sm:shrink-0",
              )}
            >
              <Action color="ppg" size="lg" className="shrink-0 pointer-events-none">
                <i className={cn(tab.icon, "text-xs")} />
              </Action>

              {/* Label: always visible on sm+; only when active on mobile */}
              <span
                className={cn(
                  "type-title-lg",
                  "text-foreground-neutral-weak group-data-[state=active]:text-foreground-neutral",
                  // Hide on mobile unless active
                  "hidden group-data-[state=active]:inline sm:inline",
                )}
              >
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab content */}
        {TABS.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="m-0 mt-0 data-[state=inactive]:hidden"
          >
            <div className="flex flex-col lg:flex-row min-h-64">
              {/* Description pane */}
              <div className="bg-background-neutral-weaker flex-1">
                <div className="p-6 flex flex-col gap-4">
                  <h3 className=" text-foreground-neutral m-0 type-title-2xl">{tab.title}</h3>
                  <p className="text-sm text-foreground-neutral leading-relaxed m-0 text-pretty">
                    {tab.description}
                  </p>
                </div>
              </div>

              {/* Visual pane — only mount when this tab is active. */}
              <div
                className={cn(
                  "flex-3 p-6",
                  "bg-background-default min-h-72 lg:min-h-0",
                  "border-t border-stroke-neutral lg:border-t-0",
                )}
              >
                {activeTab === tab.value ? <tab.Visual /> : null}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
