import { CheckBold, X } from "@/components/icons/forma"
import { Pattern } from "@/components/brand/pattern"
import { Reveal } from "@/components/motion/reveal"
import { BrokenCard, LiveCard } from "@/components/sections/comparison-cards"

const BEFORE = [
  "A database from Neon, an ORM from Drizzle, hosting from Vercel",
  "Your agent writes the code, you wire it up",
  "Per-branch databases that don't connect to your hosting previews",
  "Bandwidth bills that scale faster than your traffic",
  "Context-switching between a database dashboard, ORM CLI, hosting console, and data browser",
]

const AFTER = [
  "Your agent runs the full loop: build, deploy, debug, fix, redeploy",
  "One platform: hosting, database, and ORM built to work together natively",
  "Per-branch databases wired to your hosting previews automatically",
  "App and database co-located on the same host, at latency no two-vendor setup can match",
  "Spend limits on every paid tier, so your bill stops where you tell it to",
]

// Before/after: two columns, each led by a mini deploy card — the same
// moment, broken on the left, alive on the right. Card microcopy is
// decorative UI illustration (same idiom as ConsoleIllustration).
export function Comparison() {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
            The stack your agent has been waiting for
          </h2>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-2 lg:gap-12">
          {/* before */}
          <Reveal delay={0.05} className="flex flex-col p-6 sm:p-8">
            <h3 className="text-2xl text-muted-foreground sm:text-3xl">Before</h3>

            {/* broken deploy card — glass shatters into its current state */}
            <BrokenCard />

            <ul className="mt-10 flex flex-col gap-3">
              {BEFORE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground"
                >
                  <X className="mt-1 size-4 shrink-0 text-foreground/35" strokeWidth={3} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* after — lifted on white with the brand cube pattern, greyscaled */}
          <Reveal delay={0.15} className="spectrum-border spectrum-border-on relative flex flex-col overflow-hidden rounded-[1.25rem] border border-transparent bg-white p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.04] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
            >
              <Pattern className="h-full w-full" scale={2.5} />
            </div>
            <h3 className="text-2xl text-foreground sm:text-3xl">After</h3>

            {/* live deploy card — a cursor glides in and clicks Deploy preview */}
            <LiveCard />

            <ul className="mt-10 flex flex-col gap-3">
              {AFTER.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-pretty text-[0.9375rem] font-semibold leading-relaxed text-foreground"
                >
                  <CheckBold className="mt-1 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
