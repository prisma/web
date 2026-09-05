import { BrandStripe } from "@/components/brand/brand-stripe";
import { CheckBold } from "@/components/icons/forma";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const CHECKS = [
  { label: "Built for how your agent ships now", color: "text-prism-cyan-500" },
  { label: "Postgres and hosting when you need them", color: "text-prism-yellow-400" },
  { label: "Type-safe ORM, free and always will be", color: "text-prism-red-500" },
] as const;

type Cta = { label: string; href: string };

type CtaBurstProps = {
  headline?: React.ReactNode;
  /** Override the headline measure (default max-w-[20ch]) when custom copy needs longer lines. */
  headlineMaxWidth?: string;
  /** Override the body measure (default max-w-[52ch]). */
  bodyMaxWidth?: string;
  body?: string;
  checks?: readonly { label: string; color: string }[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

export function CtaBurst({
  headline = "Ready to let your agent run the full loop?",
  headlineMaxWidth = "max-w-[20ch]",
  bodyMaxWidth = "max-w-[52ch]",
  body = "The TypeScript stack 500K+ developers trust. Start with the free ORM, and add the rest of the platform when you need it.",
  checks = CHECKS,
  primaryCta = { label: "Get started free", href: "https://console.prisma.io/sign-up" },
  secondaryCta = { label: "See pricing", href: "/pricing" },
}: CtaBurstProps = {}) {
  return (
    <section className="bg-card px-3 py-24 sm:px-4 sm:py-32">
      <div className="mx-auto max-w-[96rem]">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-paper p-2 sm:p-6">
          <div className="relative rounded-2xl border border-border bg-card">
            {/* centered on desktop; left-aligned on mobile like the rest of
                the page */}
            <div className="relative flex flex-col items-start px-6 py-16 text-left sm:items-center sm:px-10 sm:py-20 sm:text-center">
              <BrandStripe className="mb-7" />
              <Reveal>
                <h2
                  className={cn(
                    headlineMaxWidth,
                    "text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]",
                  )}
                >
                  {headline}
                </h2>
              </Reveal>

              <Reveal delay={0.08}>
                <p
                  className={cn(
                    "mt-5 text-pretty leading-relaxed text-muted-foreground",
                    bodyMaxWidth,
                  )}
                >
                  {body}
                </p>
              </Reveal>

              <Reveal delay={0.16}>
                <ul className="mt-7 flex flex-wrap items-center justify-start gap-x-7 gap-y-3 sm:justify-center">
                  {checks.map(({ label, color }, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-left text-[15px] font-semibold text-foreground"
                    >
                      <CheckBold className={cn("mt-0.5 size-4 shrink-0", color)} aria-hidden />
                      {label}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal
                delay={0.24}
                className="mt-9 flex flex-wrap items-center justify-start gap-3 sm:justify-center"
              >
                <PrismButton href={primaryCta.href}>{primaryCta.label}</PrismButton>
                <PrismButtonOutline href={secondaryCta.href}>
                  {secondaryCta.label}
                </PrismButtonOutline>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
