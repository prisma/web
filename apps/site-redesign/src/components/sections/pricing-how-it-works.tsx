import { Reveal } from "@/components/motion/reveal";
import { PricingIncludes } from "./pricing-includes";

// "How Prisma pricing works" — V2 copy verbatim on the left, the every-plan
// -includes list stacked on the right. The calculator lives in its own section
// after the plan cards (see pricing-calculator.tsx).
export function PricingHowItWorks() {
  return (
    <section className="bg-white">
      {/* No bottom padding — the plan cards sit 40px below this block and read
          as part of the same story, so the gap is owned by pricing-plans. */}
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-2 lg:gap-x-16">
          <div>
            <Reveal>
              <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
                How Prisma pricing works
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
                Prisma bills you for real work. Every query your app runs against your Prisma
                Postgres database counts as one operation, and operations are what you pay for.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
                The ceremony around shipping stays free: deploys, preview branches, idle time, and
                the number of people on your team never add to the bill. A request does the same
                work whether it comes from a person, a script, or an AI agent, so that work is all
                you&apos;re charged for.
              </p>
            </Reveal>
            {/* V2 sets this line in bold — it's the promise the whole section
                rests on, so it reads as emphasis in the run of copy rather
                than a boxed callout. */}
            <Reveal delay={0.2}>
              <p className="mt-5 text-pretty text-base font-semibold leading-relaxed text-foreground">
                Every paid plan also includes a hard spend limit, on by default, so usage-based
                pricing stays predictable and never becomes a surprise bill.
              </p>
            </Reveal>
          </div>

          <PricingIncludes />
        </div>
      </div>
    </section>
  );
}
