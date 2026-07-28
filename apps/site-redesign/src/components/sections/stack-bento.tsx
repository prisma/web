import { Console, Table } from "@/components/icons/forma";
import { IconTile } from "@/components/brand/icon-tile";
import { LearnMore } from "@/components/brand/learn-more";
import { ConnectorStrip } from "@/components/sections/connector-strip";
import { OrmIllustration } from "@/components/sections/orm-illustration";
import { PostgresIllustration } from "@/components/sections/postgres-illustration";
import { ComputeIllustration } from "@/components/sections/compute-illustration";
import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { Pattern } from "@/components/brand/pattern";
import { Texture } from "@/components/brand/texture";
import { Reveal } from "@/components/motion/reveal";
import { RoleKicker } from "@/components/brand/role-kicker";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// TODO: /orm, /postgres, /compute and /docs are Phase 1 sitemap routes not
// built yet (see design-ref/sitemap.md).

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-pretty text-sm font-medium leading-relaxed text-foreground/75">
      <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-foreground/40" />
      <span>{children}</span>
    </li>
  );
}

// Icon tile for the cross-stack tools: a white tile with a soft prismatic
// bloom behind the glyph — light dispersing through frosted glass.
// The TypeScript stack as a bento: three products as three-steps-style cards
// (wash illustration + content), joined by the files that integrate them,
// closed by the cross-stack tools. Wrapped panel with the hero's prismatic
// backdrop and grain.
export function StackBento() {
  return (
    <section className="bg-white px-3 py-3 sm:px-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* prismatic backdrop — the hero's treatment with the wash spread
            wider across the panel: broad spectral blooms along the bottom
            edge, beam fan rising from below, dispersing to white above */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[44rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(72% 58% at 14% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 30%, transparent), transparent 72%)",
                "radial-gradient(64% 52% at 50% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 24%, transparent), transparent 70%)",
                "radial-gradient(68% 54% at 88% 100%, color-mix(in srgb, var(--color-prism-red-400) 26%, transparent), transparent 72%)",
              ].join(","),
            }}
          />
          <div className="absolute bottom-[-24rem] left-[6%] h-[60rem] w-56 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[96px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-64 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[104px]" />
          <div className="absolute bottom-[-28rem] right-[4%] h-[60rem] w-56 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[96px]" />
          <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        {/* the glass triangle — the classic prism — rising out of the corner
            where the spectrum concentrates behind it */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute bottom-[-14rem] right-[-10rem] h-[34rem] w-[52rem] rounded-full opacity-30 blur-[90px]"
            style={{ backgroundImage: SPECTRUM }}
          />
          <GlassPrismSpin
            shape="triangle"
            tint="ink"
            className="bottom-[-2rem] left-[-9rem] w-[34rem] max-md:bottom-[-1rem] max-md:left-[-6rem] max-md:w-[18rem]"
          />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 py-20 sm:px-8 sm:py-24">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-start text-left md:items-center md:text-center">
            <h2 className="max-w-[24ch] text-balance text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
              The TypeScript stack, integrated by design
            </h2>
            <p className="mt-5 max-w-[64ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              ORM, database, and hosting designed to work together, so your agent can build, deploy,
              and iterate without coordinating between vendors.
            </p>
          </Reveal>

          <div className="mx-auto mt-16 flex max-w-6xl flex-col">
            {/* Prisma ORM — the foundation, full width */}
            <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06] bg-card">
              <div className="grid lg:grid-cols-2">
                <OrmIllustration />
                <div className="p-7 max-lg:order-last sm:p-9 lg:order-first">
                  <RoleKicker color="bg-prism-cyan-400">Type-safe data layer</RoleKicker>
                  <h3 className="mt-3 text-2xl">Prisma ORM</h3>
                  <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    A declarative, type-safe schema rebuilt in native TypeScript, the shared
                    contract your whole stack and your agent are built around.
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    <Bullet>Schema-as-LLM-context: small, dense, machine-readable</Bullet>
                    <Bullet>
                      Errors structured for agent consumption, not just human-readable
                    </Bullet>
                    <Bullet>
                      Rebuilt in native TypeScript for the fastest type-checking at scale
                    </Bullet>
                    <Bullet>
                      Free, open-source, the foundation 500K+ developers already trust
                    </Bullet>
                  </ul>
                  <LearnMore href="/orm" product="Prisma ORM" />
                </div>
              </div>
            </Reveal>

            <ConnectorStrip
              file="contract.prisma"
              caption="The shared contract across your stack"
              gradient="from-prism-cyan-400 to-prism-yellow-400"
            />

            {/* Prisma Postgres — full-width row, illustration left */}
            <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06] bg-card">
              <div className="grid lg:grid-cols-2">
                <PostgresIllustration />
                <div className="p-7 sm:p-9">
                  <RoleKicker color="bg-prism-yellow-400">Managed database</RoleKicker>
                  <h3 className="mt-3 text-2xl">Prisma Postgres</h3>
                  <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    Managed Postgres already wired to your schema and co-located with your app
                    hosting, on infrastructure built for single-digit ms boot times.
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    <Bullet>Unikernel microVMs on bare metal, single-digit ms boot</Bullet>
                    <Bullet>Operation-based pricing with spend limits, no bill shock</Bullet>
                    <Bullet>Free per-branch databases, integrated with hosting previews</Bullet>
                    <Bullet>Works with any ORM if you&apos;re not using Prisma&apos;s</Bullet>
                    <Bullet>
                      Query Insights built in: spot slow queries and get an agent-ready prompt to
                      fix them
                    </Bullet>
                  </ul>
                  <LearnMore href="/postgres" product="Prisma Postgres" />
                </div>
              </div>
            </Reveal>

            <ConnectorStrip
              file="prisma.config.ts"
              caption="One config, both products"
              gradient="from-prism-yellow-400 to-prism-red-500"
            />

            {/* Prisma Compute — full-width row, illustration right */}
            <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06] bg-card">
              <div className="grid lg:grid-cols-2">
                <ComputeIllustration />
                <div className="flex flex-col p-7 max-lg:order-last sm:p-9 lg:order-first">
                  <RoleKicker color="bg-prism-red-500">App hosting</RoleKicker>
                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <h3 className="text-2xl">Prisma Compute</h3>
                    <span className="flex items-center gap-1.5 rounded-md border border-prism-cyan-200 bg-prism-cyan-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-prism-cyan-800">
                      <span
                        aria-hidden
                        className="size-1.5 animate-pulse rounded-full bg-prism-cyan-400"
                      />
                      Public Beta
                    </span>
                  </div>
                  <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    TypeScript app hosting that runs on the same host as your database, so your
                    agent can deploy, debug, and redeploy end-to-end.
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    <Bullet>Bun runtime on bare metal</Bullet>
                    <Bullet>Co-located with Prisma Postgres, single-digit ms query latency</Bullet>
                    <Bullet>
                      Long-running workloads: WebSockets, cron, background jobs{" "}
                      <em>(coming soon)</em>
                    </Bullet>
                    <Bullet>
                      Versioned deployments with preview URLs, deploy by git push or CLI
                    </Bullet>
                  </ul>
                  <LearnMore href="/compute" product="Prisma Compute" className="mt-auto pt-5" />
                </div>
              </div>
            </Reveal>

            {/* Working across the stack — half the connector-strip gap: close
                enough to read as part of the stack, distinct from the wired
                product rows */}
            <Reveal className="relative mt-20 overflow-hidden rounded-2xl border border-black/[0.06] bg-card p-7 sm:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
              >
                <Pattern className="h-full w-full" scale={2.5} />
              </div>
              <h3 className="text-2xl">Working across the stack</h3>
              <div className="mt-7 grid gap-10 lg:grid-cols-2">
                <div>
                  <IconTile className="size-14">
                    <Table className="size-6 text-foreground" />
                  </IconTile>
                  <h4 className="mt-5 text-xl">Prisma Studio</h4>
                  <em className="mt-0.5 block text-sm text-muted-foreground">
                    to inspect your data
                  </em>
                  <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    Visual data browser and editor built into the Console. See what your agent did
                    to your database, collaborate with teammates without SQL, embeddable in your own
                    apps.
                  </p>
                  <LearnMore href="/postgres" product="Prisma Studio" />
                </div>
                <div>
                  <IconTile className="size-14">
                    <Console className="size-6 text-foreground" />
                  </IconTile>
                  <h4 className="mt-5 text-xl">CLI + Management API</h4>
                  <em className="mt-0.5 block text-sm text-muted-foreground">
                    to stay in the loop
                  </em>
                  <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    The agent interface for the full platform. Structured output and{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8125em]">
                      --json
                    </code>{" "}
                    modes everywhere, with full parity between CLI and API so anything your agent
                    can run, it can also call programmatically.
                  </p>
                  <LearnMore href="/docs" product="the CLI and Management API" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
