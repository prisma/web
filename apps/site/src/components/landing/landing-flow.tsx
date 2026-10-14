import { Code, Database, Server } from "@/components/icons/forma";
import { DefineMock, DeployMock } from "@/components/brand/step-mocks";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { LandingContent } from "./content";

// "Build with Prisma ORM 8, use Prisma Postgres, deploy with Prisma Compute":
// the whole product story in one row, in the canonical cyan → yellow → red
// order the homepage stack and the product pages use. Each card carries the
// same abstracted mock the homepage's three-step section shows, so a visitor
// who continues to prisma.io later recognises the pieces.

const CARD =
  "w-full max-w-[15rem] rounded-lg border border-border bg-card shadow-[0_8px_24px_-12px_rgba(21,21,21,0.16)]";

// The middle step's mock: a provisioned database panel with real labels and
// skeleton rows, the idiom of brand/step-mocks.tsx.
function PostgresMock({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, className)}>
      <div className="flex items-center gap-1.5 border-b border-border/70 px-3 py-2">
        <Database className="size-3 text-muted-foreground" />
        <span className="font-mono text-[0.625rem] text-muted-foreground">postgres · database</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-prism-yellow-100 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-prism-yellow-800">
          <span className="size-1 rounded-full bg-prism-yellow-400" />
          Ready
        </span>
      </div>
      <div className="flex flex-col gap-2 px-3 py-2.5 font-mono text-[0.625rem] leading-none text-foreground/80">
        <p className="flex items-center justify-between">
          <span>users</span>
          <span className="text-muted-foreground">3 rows</span>
        </p>
        <p className="flex items-center justify-between">
          <span>posts</span>
          <span className="text-muted-foreground">12 rows</span>
        </p>
        <p className="flex items-center justify-between border-t border-border/70 pt-2 text-muted-foreground">
          <span>pooled</span>
          <span>us-east-1</span>
        </p>
      </div>
    </div>
  );
}

const STEPS = [
  {
    number: "1",
    product: "Prisma ORM 8",
    title: "Build",
    Icon: Code,
    body: "Write your data model once. Prisma generates a typed client, so every query is checked against your schema before it runs.",
    wash: "from-prism-cyan-50 to-prism-cyan-100",
    dot: "bg-prism-cyan-400",
    Mock: DefineMock,
  },
  {
    number: "2",
    product: "Prisma Postgres",
    title: "Store",
    Icon: Database,
    body: "A managed Postgres database, provisioned in seconds. Standard Postgres underneath, so any client works and you can leave any time.",
    wash: "from-prism-yellow-50 to-prism-yellow-100",
    dot: "bg-prism-yellow-400",
    Mock: PostgresMock,
  },
  {
    number: "3",
    product: "Prisma Compute",
    title: "Deploy",
    Icon: Server,
    body: "One command deploys the app next to its database and prints the live URL. Every feature branch can get its own preview.",
    wash: "from-prism-red-50 to-prism-red-100",
    dot: "bg-prism-red-500",
    Mock: DeployMock,
  },
] as const;

function Pipe({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "hidden h-1 w-8 shrink-0 self-center rounded-full bg-gradient-to-r lg:block",
        className,
      )}
    />
  );
}

export function LandingFlow({ flow }: { flow: LandingContent["flow"] }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
              {flow.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {flow.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-0">
          {STEPS.map((step, i) => {
            const { Icon, Mock } = step;
            return [
              <Reveal
                key={step.product}
                delay={i * 0.1}
                className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-black/[0.06] bg-card"
              >
                <article className="flex h-full flex-col">
                  <div
                    aria-hidden
                    className={cn(
                      "relative flex h-48 select-none items-center justify-center bg-gradient-to-br px-6",
                      step.wash,
                    )}
                  >
                    <Mock className="relative z-10" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                      <span aria-hidden className={cn("size-2 rounded-full", step.dot)} />
                      {step.product}
                    </p>
                    <h3 className="mt-3 flex items-center gap-3 text-xl">
                      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-card-wash text-[0.8125rem] font-semibold text-foreground">
                        {step.number}
                      </span>
                      {step.title}
                      <Icon className="ml-auto size-4 text-muted-foreground" aria-hidden />
                    </h3>
                    <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </article>
              </Reveal>,
              i < STEPS.length - 1 ? (
                <Pipe
                  key={`${step.product}-pipe`}
                  className={
                    i === 0
                      ? "from-prism-cyan-400 to-prism-yellow-400"
                      : "from-prism-yellow-400 to-prism-red-500"
                  }
                />
              ) : null,
            ];
          })}
        </div>
      </div>
    </section>
  );
}
