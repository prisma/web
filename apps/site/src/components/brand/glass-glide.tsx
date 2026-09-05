import { cn } from "@/lib/utils";

/** Quiet brand emphasis that remains legible in either theme. */
export function GlassGlide({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "decoration-prism-cyan-400 underline decoration-2 underline-offset-[0.15em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
