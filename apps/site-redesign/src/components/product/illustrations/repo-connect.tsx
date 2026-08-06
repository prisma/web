import { ChevronsUpDown, Console, Copy, GitBranch, Github } from "@/components/icons/forma";
import { CardChrome, HeroPanel, StatRow } from "./parts";

// Stop one of the /compute hero tour — "Connect". The console's get-started
// screen as an abstraction: point Compute at a repo, or run one command from
// your machine. Real: the CLI line, the GitHub App install step, the repo and
// branch shape. Abstracted: the project id and the account picker. The repo
// path is deliberately the loud one — that is the recommended route in product.

export function RepoConnect() {
  return (
    <HeroPanel label="Illustration of the first step of deploying on Prisma Compute: connecting a GitHub repository on the main branch, or deploying straight from your machine with one command, with the app's services auto-detected">
      <CardChrome
        file="get started"
        right={
          <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
            <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
            database ready
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-4 px-5 py-5">
        {/* the recommended route, carrying the weight: tinted, bordered, and the
            only filled button in the frame */}
        <div className="flex flex-col gap-3 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-3.5">
          <div className="flex items-center gap-2">
            <Github className="size-3.5 shrink-0 text-foreground" />
            <span className="text-[0.8125rem] font-semibold text-foreground">
              Connect a GitHub repo
            </span>
            <span className="ml-auto rounded border border-prism-cyan-200 bg-prism-cyan-50 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-prism-cyan-800">
              recommended
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border/80 bg-card px-3 py-2">
            <span className="truncate font-mono text-[0.6875rem] text-foreground">
              acme/dashboard
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-1 rounded border border-border/80 bg-muted/50 px-1.5 py-0.5 font-mono text-[0.5625rem] text-muted-foreground">
              <GitBranch className="size-2.5" />
              main
              <ChevronsUpDown className="size-2.5 text-muted-foreground/60" />
            </span>
          </div>

          {/* ink, not the console's teal. This panel sits in the hero right
              beside the page's real CTA, and a saturated fill on a depicted
              button pulled the eye off it — the exact problem the review
              raised about CTA prominence. */}
          <span className="flex items-center justify-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-[0.6875rem] font-semibold text-background">
            <Github className="size-3" />
            Install Prisma on GitHub
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-foreground/15" />
          <span className="text-[0.625rem] text-muted-foreground">or</span>
          <span aria-hidden className="h-px flex-1 bg-foreground/15" />
        </div>

        {/* the escape hatch: one command, no account wiring */}
        <div className="flex flex-col gap-3 rounded-lg border border-border/80 bg-card p-3.5">
          <div className="flex items-center gap-2">
            <Console className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-[0.8125rem] font-semibold text-foreground">
              Deploy from your machine
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border/80 bg-muted/40 px-3 py-2.5">
            <span className="truncate font-mono text-[0.625rem] text-muted-foreground">
              <span className="text-prism-cyan-500">$</span> bunx @prisma/cli@latest app deploy
            </span>
            <Copy className="ml-auto size-3 shrink-0 text-muted-foreground/60" />
          </div>
        </div>

        {/* what Compute already worked out before you deploy */}
        <div className="flex flex-col">
          <StatRow label="services auto-detected" value="web · api · worker" accent />
          <StatRow label="primary database" value="us-west-1" />
        </div>
      </div>
    </HeroPanel>
  );
}
