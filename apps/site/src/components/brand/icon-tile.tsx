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
        "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-8px_rgba(21,21,21,0.1)]",
        className,
      )}
    >
      <span
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(80% 55% at 20% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 45%, transparent), transparent 70%)",
            "radial-gradient(70% 50% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 40%, transparent), transparent 68%)",
            "radial-gradient(75% 52% at 84% 100%, color-mix(in srgb, var(--color-prism-red-300) 42%, transparent), transparent 70%)",
          ].join(","),
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}
