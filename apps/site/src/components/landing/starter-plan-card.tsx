import { CheckBold } from "@/components/icons/forma";
import { PrismButton } from "@/components/brand/prism-button";
import { CONSOLE_SIGNUP_URL } from "./content";

// The Starter plan as the hero visual of /lp/1000-databases: the same card
// the ad shows, so the page opens on the promise the click was made on.
// Figures are the Starter column of prisma.io/pricing, read 2026-10-21.
// The card carries no CTA of its own on desktop (the hero's button is
// beside it); on phones, where the card follows the copy, the CTA at the
// bottom of the card is the one the ad's "Subscribe" button maps to.
const LINES = [
  "5M app requests a month",
  "10 GB database storage",
  "1,000 databases included",
  "1M database operations a month",
  "Daily backups, 7-day retention",
  "Spend limit on by default",
] as const;

export function StarterPlanCard({ ctaLabel }: { ctaLabel: string }) {
  return (
    <div className="spectrum-border spectrum-border-on relative flex h-full flex-col rounded-2xl border border-transparent bg-white p-6 text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)] sm:p-8">
      <p className="text-base font-semibold text-foreground">Starter</p>
      <p className="mt-3 font-heading text-[3rem] leading-none text-foreground">
        $10
        <span className="ml-2 text-lg font-normal text-muted-foreground">/ month</span>
      </p>
      <ul className="mt-7 flex flex-col gap-3.5 border-t border-black/[0.07] pt-7">
        {LINES.map((line) => (
          <li
            key={line}
            className="flex items-start gap-3 text-[1.0625rem] leading-snug text-foreground"
          >
            <CheckBold className="mt-1 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-8 md:hidden">
        <PrismButton href={CONSOLE_SIGNUP_URL} ctaLocation="lp_plan_card" fullWidth>
          {ctaLabel}
        </PrismButton>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:mt-auto md:pt-6">
        Usage beyond the allowances is metered at the plan&rsquo;s rates: $8 per million operations
        and $2 per GB of storage, under the limit you set.
      </p>
    </div>
  );
}
