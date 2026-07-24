"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Shield } from "@/components/icons/forma"
import { Reveal } from "@/components/motion/reveal"

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)"

// The items the copy names as never adding to the bill.
const FREE_ITEMS = ["Deploys", "Preview branches", "Idle time", "Seats"]

// The bill, visualized: an operations bar fills with the spectrum and stops
// hard at the spend-limit line — the illustration makes the copy's promise
// (usage-based, but capped) literal. Fires once on scroll into view.
function SpendMeter() {
  const reduce = useReducedMotion()
  return (
    <div className="relative rounded-2xl border border-black/[0.06] bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)] sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">Operations this month</p>
        <p className="font-mono text-xs text-muted-foreground">1 query = 1 operation</p>
      </div>

      {/* the meter: fill rises toward the cap and stops there — top margin
          leaves room for the floating spend-limit pill */}
      <div className="relative mt-14">
        <div className="relative h-4 overflow-hidden rounded-full bg-black/[0.05]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: SPECTRUM }}
            initial={{ width: reduce ? "82%" : "4%" }}
            whileInView={{ width: "82%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </div>
        {/* the hard cap */}
        <div aria-hidden className="absolute inset-y-[-8px] left-[82%] w-px bg-foreground" />
        <div className="absolute left-[82%] top-[-2.4rem] -translate-x-1/2">
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            <Shield className="size-3.5 text-prism-red-500" aria-hidden />
            Spend limit
          </span>
        </div>
      </div>
      <p className="mt-3 text-right font-mono text-xs text-muted-foreground">
        the bill can&apos;t pass the line
      </p>

      {/* what never bills — straight from the copy */}
      <div className="mt-6 border-t border-black/[0.06] pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Never on the bill
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FREE_ITEMS.map((label) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-sm font-semibold text-foreground"
            >
              {label}
              <span className="font-mono text-xs text-prism-cyan-600">$0</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// "How Prisma pricing works" — V2 copy verbatim. Plain white section after
// the wrapped hero; copy left, the spend meter arguing the promise on the
// right (design notes: make the bill clear, less noise, simple headings).
export function PricingHowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-8 sm:py-28 md:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              How Prisma pricing works
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Prisma bills you for real work. Every query your app runs against
              your Prisma Postgres database counts as one operation, and
              operations are what you pay for.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              The ceremony around shipping stays free: deploys, preview branches,
              idle time, and the number of people on your team never add to the
              bill. A request does the same work whether it comes from a person,
              a script, or an AI agent, so that work is all you&apos;re charged
              for.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-7 flex gap-3 rounded-xl border border-black/[0.06] bg-card p-5 text-pretty font-semibold leading-relaxed text-foreground">
              <Shield className="mt-1 size-5 shrink-0 text-prism-red-500" aria-hidden />
              Every paid plan also includes a hard spend limit, on by default,
              so usage-based pricing stays predictable and never becomes a
              surprise bill.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="md:justify-self-stretch">
          <SpendMeter />
        </Reveal>
      </div>
    </section>
  )
}
