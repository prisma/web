import { CheckBold } from "@/components/icons/forma";
import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { BuildingBlocks } from "@/components/april-fools";
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

// Original homepage copy, proof, actions, and console illustration in the
// April Fools presentation. Only the decorative treatment changes.
export function HeroHome() {
  return (
    <section className="playtime-hero">
      <div className="playtime-container playtime-hero-grid">
        <div className="playtime-hero-copy">
          <h1 className="isolate max-w-[20ch] text-balance text-[clamp(2.5rem,4.5vw,3.875rem)] leading-[1.06]">
            Your TypeScript app, from <GlassGlide>prompt to production</GlassGlide>
          </h1>
          <p className="mt-6 max-w-[64ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            Give your coding agent a type-safe ORM, managed Postgres, and app hosting that work
            together natively. One shared context across your stack is all your agent needs to
            build, deploy, and iterate without coordinating between vendors.
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
          <div className="mt-10 flex flex-wrap items-center justify-start gap-4 md:justify-center">
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
        <BuildingBlocks />
      </div>
      <div className="playtime-container playtime-console">
        <ConsoleIllustration />
      </div>
    </section>
  );
}
