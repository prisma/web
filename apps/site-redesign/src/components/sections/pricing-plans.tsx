import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { CheckBold } from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// V2 plan cards, copy verbatim. One post-V2 correction from the client
// answers (Gregory, 2026-07-24): Business has an overage rate — $0.0010 per
// 1,000 — where V2 listed none.
const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "No credit card required.",
    features: ["100,000 operations / month", "500 MB storage", "50 databases"],
    blurb:
      "Everything you need to build and explore with no clock running. No credit card, no expiry.",
    cta: "Start for free",
    href: "https://console.prisma.io",
    popular: false,
  },
  {
    name: "Starter",
    price: "$10",
    note: null,
    features: [
      "1,000,000 operations / month, then $0.0080 per 1,000",
      "10 GB storage, then $2.00 per GB",
      "1,000 databases",
      "7-day daily backups",
      "Spend limits",
    ],
    blurb:
      "Ship your first production app without worrying about the bill. Backups included, spend limits on by default.",
    cta: "Get started",
    href: "https://console.prisma.io",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    note: null,
    features: [
      "10,000,000 operations / month, then $0.0020 per 1,000",
      "50 GB storage, then $1.50 per GB",
      "1,000 databases",
      "7-day daily backups",
      "Spend limits",
      "GDPR, HIPAA",
    ],
    blurb:
      "For production apps with real traffic. More operations, lower overage rates, and headroom to grow without watching the meter.",
    cta: "Get started",
    href: "https://console.prisma.io",
    popular: true,
  },
  {
    name: "Business",
    price: "$129",
    note: null,
    features: [
      "50,000,000 operations / month, then $0.0010 per 1,000",
      "100 GB storage",
      "1,000 databases",
      "30-day backup retention",
      "Spend limits",
      "GDPR, HIPAA, SOC 2, ISO 27001",
    ],
    blurb: "Built for high-growth teams with compliance requirements and sustained high volume.",
    cta: "Get started",
    href: "https://console.prisma.io",
    popular: false,
  },
];

export function PricingPlans() {
  return (
    <section className="bg-white px-4 sm:px-8">
      {/* pt-20 = 80px from the row above; the cards continue that block rather
          than starting a new section. Full rhythm resumes below. */}
      <div className="mx-auto max-w-6xl pb-16 pt-20 sm:pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6",
                plan.popular
                  ? "spectrum-border spectrum-border-on border-transparent shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)]"
                  : "border-black/[0.06]",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <p className="text-sm font-semibold text-foreground">{plan.name}</p>
              <p className="mt-3 font-heading text-4xl font-medium tracking-tight text-foreground">
                {plan.price}
                <span className="ml-1 text-base font-normal text-muted-foreground">/ month</span>
              </p>
              {plan.note && <p className="mt-2 text-sm text-muted-foreground">{plan.note}</p>}
              <ul className="mt-6 space-y-2.5 border-t border-black/[0.06] pt-5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2.5 text-sm leading-relaxed text-foreground"
                  >
                    <CheckBold className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground">
                {plan.blurb}
              </p>
              <div className="mt-6 flex flex-1 items-end">
                {/* Brand CTAs, not the shadcn pair: the recommended plan gets
                    the prismatic fill, the rest the spectrum-on-hover outline,
                    so only one CTA in the row reads as primary. */}
                {plan.popular ? (
                  <PrismButton href={plan.href} fullWidth>
                    {plan.cta}
                  </PrismButton>
                ) : (
                  <PrismButtonOutline href={plan.href} className="w-full">
                    {plan.cta}
                  </PrismButtonOutline>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Need more? */}
        <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/[0.06] bg-card p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-heading text-lg font-medium text-foreground">Need more?</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Custom pricing is available for high-volume teams.
            </p>
          </div>
          <PrismButtonOutline href="/contact" className="shrink-0">
            Contact us
          </PrismButtonOutline>
        </div>
      </div>
    </section>
  );
}
