import { CheckBold } from "@/components/icons/forma";
import { PrismButton } from "@/components/brand/prism-button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { CONSOLE_SIGNUP_URL, CTA_LABEL } from "./content";

// The plan ladder, with the Free plan lit: a visitor from an ad should see in
// one glance that the entry is $0 and what the next step costs. Figures are
// the /pricing plan cards (sections/pricing-plans.tsx), trimmed to one line
// per product; the Free plan's storage is 2 GB per the product team
// (2026-10-14). Keep in step with /pricing when the cards change.
const PLANS = [
  {
    name: "Free",
    price: "$0",
    tagline: "Free forever, no credit card",
    compute: "1M requests, 360 GB-hours memory, 4 active vCPU-hours a month",
    postgres: "200k operations a month, 2 GB storage, 50 databases",
    platform: "No usage billing",
    lit: true,
  },
  {
    name: "Starter",
    price: "$10",
    tagline: "Your first production app",
    compute: "5M requests a month, then metered",
    postgres: "1M operations a month, 10 GB storage, daily backups",
    platform: "Spend limits",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49",
    tagline: "Real traffic, lower overage rates",
    compute: "20M requests a month, then metered",
    postgres: "10M operations a month, 50 GB storage, daily backups",
    platform: "Spend limits, GDPR, HIPAA",
  },
  {
    name: "Business",
    price: "$129",
    tagline: "Sustained volume and compliance",
    compute: "100M requests a month, then metered",
    postgres: "50M operations a month, 100 GB storage, 30-day backups",
    platform: "Spend limits, SOC 2, ISO 27001",
  },
] as const;

const ROWS = [
  { key: "compute", label: "Prisma Compute", dot: "bg-prism-red-500" },
  { key: "postgres", label: "Prisma Postgres", dot: "bg-prism-yellow-400" },
  { key: "platform", label: "Platform", dot: "bg-prism-cyan-400" },
] as const;

export function LandingPlans({
  headline = "Start free. Pay when the app grows.",
  body = "Every plan covers both the app and the database. The Free plan has no time limit and no usage billing; paid plans meter the work your app does and let you cap the bill.",
}: {
  headline?: string;
  body?: string;
}) {
  return (
    <section className="bg-white px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <Reveal className="max-w-3xl">
          <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
            {headline}
          </h2>
          <p className="mt-5 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            {body}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PLANS.map((plan) => {
            const lit = "lit" in plan && plan.lit;
            const popular = "popular" in plan && plan.popular;
            return (
              <Reveal
                key={plan.name}
                delay={0.1}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6",
                  lit
                    ? "border-prism-cyan-300 shadow-[0_0_0_4px_rgba(1,215,228,0.08),0_24px_64px_-32px_rgba(21,21,21,0.2)]"
                    : "border-black/[0.08]",
                )}
              >
                {lit ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-60"
                    style={{
                      background:
                        "radial-gradient(60% 70% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 40%, transparent), transparent 70%)",
                    }}
                  />
                ) : null}
                <div className="relative flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold text-foreground">{plan.name}</p>
                    {popular ? (
                      <span className="rounded-full border border-black/[0.08] px-2.5 py-0.5 text-xs font-semibold text-foreground/70">
                        Most popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-heading text-[2.25rem] leading-none text-foreground">
                    {plan.price}
                    <span className="text-base text-muted-foreground"> / month</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
                  <dl className="mt-6 flex flex-col gap-4 border-t border-black/[0.07] pt-5">
                    {ROWS.map(({ key, label, dot }) => (
                      <div key={key}>
                        <dt className="flex items-center gap-2 text-xs font-semibold text-foreground/70">
                          <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
                          {label}
                        </dt>
                        <dd className="mt-1 flex items-start gap-2 text-[0.9375rem] leading-snug text-foreground">
                          <CheckBold
                            className={cn(
                              "mt-1 size-3.5 shrink-0",
                              lit ? "text-prism-cyan-600" : "text-foreground/40",
                            )}
                            aria-hidden
                          />
                          {plan[key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {lit ? (
                    <div className="mt-7">
                      <PrismButton href={CONSOLE_SIGNUP_URL} ctaLocation="lp_plans" fullWidth>
                        {CTA_LABEL}
                      </PrismButton>
                    </div>
                  ) : (
                    <p className="mt-7 text-sm text-muted-foreground">
                      Upgrade from the Console when you need it.
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
