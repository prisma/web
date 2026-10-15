import type { Metadata } from "next"
import Link from "next/link"
import { GlassGlide } from "@/components/brand/glass-glide"
import { Texture } from "@/components/brand/texture"
import { ArrowRightBold } from "@/components/icons/forma"
import { CtaBurst } from "@/components/sections/cta-burst"
import { COMPARISONS } from "./comparisons"

export const metadata: Metadata = {
  title: "Prisma Postgres comparisons",
  description:
    "Head-to-head pages for Prisma Postgres versus Neon, PlanetScale, and Supabase, listed alphabetically. Prisma makes Prisma Postgres.",
  alternates: { canonical: "/compare" },
}

export default function ComparePage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
              style={{
                background: [
                  "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
                  "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
                  "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
                ].join(","),
              }}
            />
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />

          <div className="relative px-4 sm:px-8">
            <div className="mx-auto max-w-site pb-16 pt-32 md:pb-20 md:pt-44">
              <div className="mx-auto flex max-w-3xl animate-hero-rise flex-col items-center text-center motion-reduce:animate-none">
                <h1 className="isolate max-w-[min(18ch,100%)] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                  Prisma Postgres <GlassGlide>comparisons</GlassGlide>
                </h1>
                <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                  Three pages compare Prisma Postgres with another database: Neon,
                  PlanetScale, and Supabase. Each page says which situation fits
                  which product. Prisma makes Prisma Postgres, one of the products
                  compared. The list is alphabetical by the other product.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-8 sm:py-28" aria-labelledby="comparison-list-heading">
        <div className="mx-auto max-w-site">
          <h2
            id="comparison-list-heading"
            className="max-w-[22ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]"
          >
            Alphabetical by the other product
          </h2>

          <ol className="mt-10 border-t border-black/[0.09]">
            {COMPARISONS.map((entry) => (
              <li key={entry.slug} className="border-b border-black/[0.09]">
                <Link
                  href={`/compare/${entry.slug}`}
                  className="group grid gap-4 py-9 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-center md:gap-x-16 md:py-11"
                >
                  <span className="text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1] font-medium text-foreground">
                    {entry.competitor}
                  </span>
                  <span className="max-w-[68ch]">
                    <span className="block text-base font-semibold text-foreground group-hover:underline">
                      {entry.title}
                    </span>
                    <span className="mt-2 block text-pretty text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </span>
                  </span>
                  <ArrowRightBold
                    className="size-5 text-foreground/70 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBurst
        headline="Ready to build with Prisma?"
        headlineMaxWidth="max-w-[22ch]"
        body="Free to start, no credit card required."
        bodyMaxWidth="max-w-[44ch]"
        checks={[
          {
            label: "Create a database and start building in minutes",
            color: "text-prism-cyan-500",
          },
          {
            label: "Read the docs for guides and API reference",
            color: "text-prism-yellow-400",
          },
          { label: "Trusted by 500K+ developers globally", color: "text-prism-red-500" },
        ]}
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io" }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  )
}
