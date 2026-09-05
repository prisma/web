import { cn } from "@/lib/utils";

// The brand icon tile: a white tile with the panel idiom in miniature — the
// spectral wash collecting along the tile's bottom edge and dispersing to
// white above, the glyph sitting on top. Size via className (size-12 default).
export function IconTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-foreground/[0.06] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-8px_rgba(21,21,21,0.1)]",
        className,
      )}
    >
      <span className="relative">{children}</span>
    </span>
  );
}
