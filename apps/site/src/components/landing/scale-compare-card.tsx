import { CheckBold, X } from "@/components/icons/forma";
import { Marker } from "@/components/brand/marker";
import {
  ALTERNATIVES,
  PRISMA,
  SAVINGS_MULTIPLE,
  WIDEST,
} from "@/components/sections/pricing-comparison";
import { cn } from "@/lib/utils";

// The "See how Prisma compares at scale" comparison as the hero visual of
// /lp/providers: the three monthly figures the ad shows, taken from the same
// constants the pricing page renders, so the page and the ad can never
// disagree with prisma.io/pricing. Static text rather than the pricing
// page's count-up, so the figures are there for a reader (or an ad reviewer)
// the moment the page paints. The three rows under each figure are the
// pricing page's, verbatim.
export function ScaleCompareCard() {
  return (
    <div className="flex h-full flex-col gap-3 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        {ALTERNATIVES.map((alt) => (
          <div
            key={alt.id}
            className="flex flex-col rounded-2xl border border-black/[0.06] bg-white/70 p-5 backdrop-blur-[2px]"
          >
            <p className="text-sm font-semibold text-foreground/70">{alt.name}</p>
            <p className="mt-3 font-heading text-[2rem] leading-none text-muted-foreground">
              {alt.cost}
              <span className="ml-1.5 text-sm font-normal">/month</span>
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">at ~50K MAU</p>
            <ul className="mt-4 flex flex-col gap-2 border-t border-black/[0.06] pt-4">
              {alt.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-start gap-2 text-[0.8125rem] leading-snug text-muted-foreground"
                >
                  <X
                    className="mt-0.5 size-3.5 shrink-0 text-foreground/35"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <span>
                    <span className="font-semibold text-foreground/70">{row.label}:</span>{" "}
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "spectrum-border spectrum-border-on relative flex flex-col rounded-2xl border border-transparent bg-white p-5 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)] sm:p-6",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{PRISMA.name}</p>
          {SAVINGS_MULTIPLE !== null ? (
            <Marker className="-mt-0.5 shrink-0">
              Up to {SAVINGS_MULTIPLE}x less vs {WIDEST.shortName}
            </Marker>
          ) : null}
        </div>
        <p className="mt-3 font-heading text-[2.5rem] leading-none text-foreground">
          {PRISMA.cost}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">/month</span>
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">at ~50K MAU</p>
        <ul className="mt-4 grid gap-2 border-t border-black/[0.06] pt-4 sm:grid-cols-3">
          {PRISMA.rows.map((row) => (
            <li
              key={row.label}
              className="flex items-start gap-2 text-[0.875rem] font-semibold leading-snug text-foreground"
            >
              <CheckBold className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
              <span>
                <span className="font-normal text-muted-foreground">{row.label}:</span> {row.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
