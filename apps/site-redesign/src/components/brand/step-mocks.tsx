import { AppWindow, Bot, Check, Database, Server } from "@/components/icons/forma"
import { cn } from "@/lib/utils"

// The three abstracted UI mockups from the "Ship a production TypeScript app
// in three steps" section, extracted so both that section and the CTA
// showcase render the exact same cards. Skeleton lines stand in for supporting
// copy — key labels stay real, the rest is abstracted.

export function Bar({ className }: { className?: string }) {
  return <span className={cn("inline-block h-1.5 rounded-full bg-foreground/10", className)} />
}

const CARD =
  "w-full max-w-[15rem] rounded-lg border border-border bg-card shadow-[0_8px_24px_-12px_rgba(21,21,21,0.16)]"

// Step 1 — a schema file
export function DefineMock({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, className)}>
      <div className="flex items-center gap-1.5 border-b border-border/70 px-3 py-2">
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="ml-1 font-mono text-[0.625rem] text-muted-foreground">contract.prisma</span>
      </div>
      <div className="flex flex-col gap-2.5 px-3 py-3 font-mono text-[0.625rem] leading-none text-foreground/80">
        <p className="flex items-center gap-1.5">
          <span className="text-prism-cyan-600">model</span> User {"{"}
        </p>
        <p className="flex items-center gap-1.5 pl-3">
          <Bar className="w-12" />
          <Bar className="w-8 bg-prism-red-200" />
        </p>
        <p className="flex items-center gap-1.5 pl-3">
          <Bar className="w-16" />
          <Bar className="w-6" />
        </p>
        <p>{"}"}</p>
      </div>
    </div>
  )
}

// Step 2 — a deploy panel
export function DeployMock({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, className)}>
      <div className="flex items-center gap-1.5 border-b border-border/70 px-3 py-2">
        <Server className="size-3 text-muted-foreground" />
        <span className="font-mono text-[0.625rem] text-muted-foreground">us-west-1</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-prism-cyan-100 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-prism-cyan-800">
          <span className="size-1 rounded-full bg-prism-cyan-400" />
          Deployed
        </span>
      </div>
      <div className="relative px-3 py-2.5">
        <span className="absolute bottom-[1.3rem] left-[1.1875rem] top-[1.3rem] w-px bg-border" />
        <span className="flex items-center gap-2 py-1">
          <AppWindow className="size-3.5 shrink-0 bg-card text-muted-foreground" />
          <Bar className="w-16" />
        </span>
        <span className="flex items-center gap-2 py-1">
          <Database className="size-3.5 shrink-0 bg-card text-muted-foreground" />
          <Bar className="w-20" />
          <span className="ml-auto size-1.5 rounded-full bg-prism-cyan-400" />
        </span>
      </div>
    </div>
  )
}

// Step 3 — a CLI log
export function IterateMock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        CARD,
        "flex flex-col gap-2.5 px-3 py-3 font-mono text-[0.625rem] leading-none text-muted-foreground",
        className,
      )}
    >
      <p className="flex items-center gap-1.5">
        <span className="text-prism-cyan-600">$</span> prisma app logs
      </p>
      <p className="flex items-center gap-1.5 pl-3">
        <Bar className="w-24 bg-prism-red-200" />
      </p>
      <p className="flex items-center gap-1.5 pl-3">
        <Bot className="size-3 shrink-0 text-foreground/60" />
        <Bar className="w-20" />
      </p>
      <p className="flex items-center gap-1.5">
        <span className="text-prism-cyan-600">$</span> prisma app deploy
      </p>
      <p className="flex items-center gap-1.5 pl-3">
        <Check className="size-3 shrink-0 text-prism-cyan-500" strokeWidth={3} />
        <Bar className="w-10 bg-prism-cyan-200" />
      </p>
    </div>
  )
}
