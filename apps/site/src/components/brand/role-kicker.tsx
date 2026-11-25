import { cn } from "@/lib/utils";

// Product role kicker — replaces the colored pills (pills are reserved for
// buttons): the product's color lives in a small dot, the label stays ink.
// Sentence case, never uppercase. Ink at /75, not /70: /70 measured 4.42:1 on
// the cream `bg-paper` panels, under WCAG AA's 4.5:1 for 14px text.
export function RoleKicker({
  color,
  className,
  children,
}: {
  color: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn("flex items-center gap-2 text-sm font-semibold text-foreground/75", className)}
    >
      <span aria-hidden className={cn("size-2 rounded-full", color)} />
      {children}
    </p>
  );
}
