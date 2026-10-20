import { Code, Database, Server } from "@/components/icons/forma";
import { DefineMock, DeployMock } from "@/components/brand/step-mocks";
import { Texture } from "@/components/brand/texture";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { LandingContent } from "./content";

// "Build with Prisma ORM 8, use Prisma Postgres, deploy with Prisma Compute":
// the product story in one wrapped panel, in the canonical cyan → yellow → red
// order the homepage stack and the product pages use. One panel rather than
// three bordered cards: the page already opens on a panel, and the sections
// after this one are plain, so the rhythm is panel, plain, plain, panel.

const MOCK =
  "w-full max-w-[15rem] rounded-lg border border-border bg-card shadow-[0_8px_24px_-12px_rgba(21,21,21,0.16)]";

function PostgresMock({ className }: { className?: string }) {
  return (
    <div className={cn(MOCK, className)}>
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
    product: "Prisma ORM 8",
    title: "Type your queries",
    Icon: Code,
    body: "Write the data model once. Prisma generates a typed client, so a wrong field name fails in the editor, not in production.",
    wash: "from-prism-cyan-50 to-prism-cyan-100",
    dot: "bg-prism-cyan-400",
    Mock: DefineMock,
  },
  {
    product: "Prisma Postgres",
    title: "Store the data",
    Icon: Database,
    body: "A managed Postgres database in seconds. Standard Postgres underneath, so any client works and you can leave any time.",
    wash: "from-prism-yellow-50 to-prism-yellow-100",
    dot: "bg-prism-yellow-400",
    Mock: PostgresMock,
  },
  {
    product: "Prisma Compute",
    title: "Run the app next to it",
    Icon: Server,
    body: "One command deploys the app and its database and prints the live URL. Every feature branch can get its own preview.",
    wash: "from-prism-red-50 to-prism-red-100",
    dot: "bg-prism-red-500",
    Mock: DeployMock,
  },
] as const;

export function LandingFlow({ flow }: { flow: LandingContent["flow"] }) {
  return (
    <section className="bg-white px-3 py-4 sm:px-4 sm:py-6">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-card-wash">
        <Texture opacity={0.05} blend="multiply" />
        <div className="relative mx-auto max-w-site px-4 py-16 sm:px-8 sm:py-20">
          <Reveal className="mx-auto max-w-3xl text-center max-md:text-left">
            <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
              {flow.headline}
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {flow.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 grid gap-6 md:grid-cols-3 md:gap-5">
            {STEPS.map((step, i) => {
              const { Icon, Mock } = step;
              return (
                <article key={step.product} className="relative flex flex-col">
                  {/* the pipe into the next step, desktop only */}
                  {i < STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute right-[-1.25rem] top-[5.5rem] z-10 hidden h-1 w-5 rounded-full bg-gradient-to-r md:block",
                        i === 0
                          ? "from-prism-cyan-400 to-prism-yellow-400"
                          : "from-prism-yellow-400 to-prism-red-500",
                      )}
                    />
                  ) : null}
                  <div
                    aria-hidden
                    className={cn(
                      "flex h-44 select-none items-center justify-center rounded-2xl bg-gradient-to-br px-6",
                      step.wash,
                    )}
                  >
                    <Mock />
                  </div>
                  <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-foreground/70">
                    <span aria-hidden className={cn("size-2 rounded-full", step.dot)} />
                    {step.product}
                    <Icon className="ml-auto size-4 text-muted-foreground" aria-hidden />
                  </p>
                  <h3 className="mt-2 text-xl">{step.title}</h3>
                  <p className="mt-2 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </article>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
