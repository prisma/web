import { cn } from "@/lib/utils";

// Small status label — "Most popular", "Recommended", "Up to 5x less".
//
// Deliberately NOT a pill. prism-button.tsx owns `rounded-full` for both of its
// variants: the primary is a dark filled pill, the secondary a white pill with a
// hairline border. So a round badge reads as a button whichever way it's filled
// — a solid one looks like the primary CTA, an outlined one like the secondary.
// This uses a squared-off chip instead, and follows the role-kicker rule for
// colour: it lives in a dot, the label stays ink.
//
// The opaque background is load-bearing — the plan card's marker straddles the
// card's top border and has to mask it.
export function Marker({
  color = "bg-prism-cyan-400",
  className,
  children,
}: {
  /** Brand colour for the dot, as a bg-* class. */
  color?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-black/[0.09] bg-white px-2 py-1 text-xs font-semibold leading-none text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.05)]",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", color)} />
      {children}
    </span>
  );
}
