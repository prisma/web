import { cn } from "@/lib/utils";

// Product role kicker — replaces the colored pills (pills are reserved for
// buttons): the product's color lives in a small dot, the label stays ink.
// Sentence case, never uppercase.
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
      className={cn("flex items-center gap-2 text-sm font-semibold text-foreground/70", className)}
    >
      <span aria-hidden className={cn("size-2 rounded-full", color)} />
      {children}
    </p>
  );
}
