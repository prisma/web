import { BrandStripe } from "@/components/brand/brand-stripe";
import { CheckBold } from "@/components/icons/forma";
import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { ConsoleIllustration } from "@/components/sections/console-illustration";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const CHECKS = [
  { label: "One platform, one stack, one bill", color: "text-prism-cyan-500" },
  { label: "A CLI and API your agent drives natively", color: "text-prism-yellow-400" },
  { label: "The ORM is free, always", color: "text-prism-red-500" },
];

// Shared with /contact's hero — see siteConfig.proof.
const PROOF = siteConfig.proof;

// Homepage hero: a wrapped prismatic panel — light enters as the brand's
// triple-band prism ray, disperses into a spectral wash behind the copy, and
// recombines into the product below. The page returns to plain white outside
// the panel.
export function HeroHome() {
  return (
    <section className="bg-background px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-border bg-paper">
        <div className="relative px-4 sm:px-8">
          <div className="mx-auto flex max-w-4xl animate-hero-rise flex-col items-start pt-24 text-left motion-reduce:animate-none md:items-center md:pt-36 md:text-center">
            <BrandStripe className="mb-6" />
            <h1 className="isolate max-w-[20ch] text-balance text-[clamp(2.125rem,4.5vw,3.875rem)] leading-[1.06]">
              Your TypeScript app, from <GlassGlide>prompt to production</GlassGlide>
            </h1>
            <p className="mt-6 max-w-[64ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              A type-safe ORM, managed Postgres, and app hosting. One connected stack for you and
              your coding agent to build, deploy, and iterate.
            </p>
            <ul className="mt-8 flex flex-wrap items-center justify-start gap-x-7 gap-y-3 md:justify-center">
              {CHECKS.map(({ label, color }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-[15px] font-semibold text-foreground"
                >
                  <CheckBold className={cn("size-4 shrink-0", color)} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center md:justify-center">
              <PrismButton href="https://console.prisma.io/sign-up">Get started free</PrismButton>
              <PrismButtonOutline href="/pricing">See pricing</PrismButtonOutline>
            </div>
            {/* social proof stays above the fold, right under the CTAs */}
            <p className="mt-8 flex flex-wrap items-center justify-start gap-x-2.5 gap-y-1 text-sm leading-relaxed text-muted-foreground md:justify-center">
              {PROOF.map(({ stat, label }, i) => (
                <span key={label} className="contents">
                  {i > 0 && (
                    <span aria-hidden className="text-foreground/20 max-sm:hidden">
                      ·
                    </span>
                  )}
                  <span className="whitespace-nowrap">
                    {i === 0 && "Trusted by "}
                    <span className="font-semibold text-foreground">{stat}</span> {label}
                  </span>
                </span>
              ))}
            </p>
          </div>

          {/* product: the crisp triple-band prism ray crosses the panel behind
              the console — light passing through the product. Masks in on load
              (see --animate-hero-ray-mask), progressively uncovered L→R. */}
          <div className="relative mx-auto mt-14 w-full max-w-4xl pb-16 max-md:mt-10 max-md:pb-10">
            <div className="relative animate-hero-rise-late motion-reduce:animate-none">
              <ConsoleIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
