import {
  AppWindow,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Copy,
  Database,
  GitBranch,
  Github,
  Layers,
  LayoutGrid,
  Plus,
  Rocket,
  Search,
  Settings,
} from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// Skeleton line standing in for supporting copy — real labels and actions stay,
// so the card reads as a representation of the Console, not a screenshot. Each
// line carries a loading shimmer: a light highlight sweeping across, clipped to
// the rounded bar.
function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block h-1.5 overflow-hidden rounded-full bg-foreground/10",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-line-shimmer bg-prism-cyan-400 motion-reduce:hidden"
      />
    </span>
  );
}

const NAV = [
  { icon: LayoutGrid, bar: "w-16", active: true },
  { icon: GitBranch, bar: "w-8", active: false },
  { icon: Layers, bar: "w-20", active: false },
  { icon: Settings, bar: "w-12", active: false },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
      {children}
    </span>
  );
}

// Hand-built abstraction of the Prisma Console — the shape of the platform
// (workspace, app, database, two ways to deploy), half real, half abstracted.
export function ConsoleIllustration() {
  return (
    <div
      role="img"
      aria-label="Illustration of the Prisma Console: a workspace with an app and a database, ready to deploy from a GitHub repo or straight from your coding agent"
      className="pointer-events-none relative mx-auto w-full max-w-4xl select-none text-left"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]">
        {/* window chrome */}
        <div className="flex items-center border-b border-border/70 px-4 py-2.5">
          <div className="flex w-16 gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="mx-auto rounded-full border border-border/70 bg-card px-3 py-1 text-[0.625rem] leading-none text-muted-foreground">
            console.prisma.io
          </span>
          <span className="w-16" />
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="hidden w-52 shrink-0 flex-col border-r border-border/70 bg-muted/50 px-3 pb-3 pt-4 md:flex">
            <div className="flex items-center gap-2 px-1.5">
              <span className="size-4 rounded bg-prism-cyan-400" />
              <Bar className="w-14 bg-foreground/20" />
              <span className="h-3 w-7 rounded-sm bg-prism-cyan-100" />
              <ChevronsUpDown className="ml-auto size-3 text-muted-foreground/60" />
            </div>

            <nav className="mt-4 flex flex-col gap-0.5">
              {NAV.map(({ icon: Icon, bar, active }, i) => (
                <span
                  key={i}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-1.5 py-2",
                    active && "bg-muted",
                  )}
                >
                  <Icon
                    className={cn("size-3.5", active ? "text-foreground" : "text-muted-foreground")}
                  />
                  <Bar className={cn(bar, active && "bg-foreground/25")} />
                </span>
              ))}
            </nav>

            <div className="mt-5 flex items-center gap-2 px-1.5">
              <SectionLabel>Branch</SectionLabel>
              <span className="flex items-center gap-1.5 rounded-md border border-border/80 bg-card px-1.5 py-1">
                <GitBranch className="size-2.5 text-muted-foreground" />
                <Bar className="w-7" />
                <ChevronsUpDown className="size-2.5 text-muted-foreground/60" />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between px-1.5">
              <SectionLabel>Apps</SectionLabel>
              <Plus className="size-3 text-muted-foreground/60" />
            </div>
            <span className="mt-1 flex items-center gap-2 rounded-md px-1.5 py-1 text-[0.6875rem] text-muted-foreground">
              <AppWindow className="size-3.5" />
              storefront
            </span>

            <div className="mt-3 flex items-center justify-between px-1.5">
              <SectionLabel>Databases</SectionLabel>
              <Plus className="size-3 text-muted-foreground/60" />
            </div>
            <span className="mt-1 flex items-center gap-2 rounded-md px-1.5 py-1 text-[0.6875rem] text-muted-foreground">
              <Database className="size-3.5" />
              Primary database
              <span className="ml-auto size-1.5 rounded-full bg-prism-cyan-400 animate-status-pulse motion-reduce:animate-none" />
            </span>

            <div className="mt-auto flex items-center gap-2 border-t border-border/70 px-1.5 pt-3">
              <span className="size-5 rounded-full bg-primary/80" />
              <Bar className="h-1 w-20" />
            </div>
          </aside>

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
              <span className="flex items-center gap-1.5">
                <Bar className="w-10" />
                <ChevronRight className="size-2.5 text-muted-foreground/50" />
                <Bar className="w-14 bg-foreground/20" />
              </span>
              <span className="flex items-center gap-1.5 rounded-md border border-border/80 px-2 py-1.5">
                <Search className="size-2.5 text-muted-foreground/70" />
                <Bar className="h-1 w-10" />
              </span>
            </div>

            <div className="mx-auto flex w-full max-w-sm flex-col items-center px-4 py-9 text-center max-md:max-w-none">
              <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-prism-cyan-600">
                <Rocket className="size-3 origin-center animate-rocket-bob motion-reduce:animate-none" />
                Get started
              </span>
              <span className="mt-2 font-heading text-[0.9375rem] text-foreground">
                How would you like to start?
              </span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-prism-cyan-400 animate-status-pulse motion-reduce:animate-none" />
                Primary database ready in us-west-1
              </span>

              <div className="mt-5 w-full rounded-lg border border-border/80 bg-card p-3.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold">
                    <Github className="size-3.5" />
                    Connect a GitHub repo
                  </span>
                  <span className="h-3 w-14 rounded-sm bg-prism-cyan-100" />
                </div>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  <Bar className="h-1 w-full" />
                  <Bar className="h-1 w-3/4" />
                </div>
                <span className="mt-3 flex h-7 items-center justify-center gap-1.5 rounded-md bg-primary text-[0.6875rem] font-semibold text-primary-foreground">
                  <Github className="size-3" />
                  Install Prisma on GitHub
                </span>
              </div>

              <div className="my-3 flex w-full items-center gap-3 text-[0.625rem] text-muted-foreground/60">
                <span className="h-px flex-1 bg-border/70" />
                or
                <span className="h-px flex-1 bg-border/70" />
              </div>

              <div className="w-full rounded-lg border border-border/80 bg-card p-3.5 text-left">
                <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold">
                  <Bot className="size-3.5" />
                  Deploy with your agent
                </span>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  <Bar className="h-1 w-full" />
                  <Bar className="h-1 w-2/3" />
                </div>
                <span className="mt-3 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[0.6875rem] text-primary-foreground/90">
                  <span className="text-prism-cyan-400">$</span>
                  <span className="flex min-w-0 items-center">
                    bunx @prisma/cli app deploy
                    <span
                      aria-hidden
                      className="ml-1 inline-block h-3 w-[0.4rem] shrink-0 bg-prism-cyan-400 animate-caret-blink motion-reduce:animate-none"
                    />
                  </span>
                  <Copy className="ml-auto size-3 text-primary-foreground/50" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
