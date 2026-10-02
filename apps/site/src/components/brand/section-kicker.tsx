import { prismBands } from "@/components/brand/prism-ray";
import { cn } from "@/lib/utils";

const BANDS = prismBands();

// Section label above a homepage section heading. Same type as RoleKicker
// (sentence case, ink at 70%), but the mark is a small chip of the brand's
// triple-band ray instead of a single colored dot: a dot's color names a
// product (cyan ORM, yellow Postgres, red Compute), and a section label
// belongs to none of them.
export function SectionKicker({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn("flex items-center gap-2 text-sm font-semibold text-foreground/70", className)}
    >
      <span aria-hidden className="h-2.5 w-2 rounded-[2px]" style={{ background: BANDS }} />
      {children}
    </p>
  );
}
