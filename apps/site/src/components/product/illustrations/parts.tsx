import { cn } from "@/lib/utils";

// Shared pieces for the product-page abstractions. Same idiom as the homepage
// illustrations (console-illustration.tsx, orm-illustration.tsx): real labels,
// filenames and commands stay, supporting content collapses to skeleton lines,
// so each card reads as a representation of the product rather than a
// screenshot.

/** Skeleton line standing in for code or copy that isn't the point. */
export function Bar({ className }: { className?: string }) {
  return <span className={cn("inline-block h-1.5 rounded-full bg-foreground/10", className)} />;
}

/** Window chrome with a real filename. */
export function CardChrome({ file, right }: { file: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
      <span className="size-2 rounded-full bg-border" />
      <span className="size-2 rounded-full bg-border" />
      <span className="ml-1.5 font-mono text-xs text-foreground">{file}</span>
      {right ? <span className="ml-auto flex items-center">{right}</span> : null}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
      {children}
    </span>
  );
}

/**
 * The prism-ray frame the homepage abstractions sit in (stack-bento's
 * illustration columns, orm-illustration.tsx): a saturated brand ray photo
 * behind a floating white surface. The filter sits on its own layer so it never
 * touches the content above it.
 */
export function RayFrame({
  photo,
  className,
  children,
}: {
  /**
   * Background utilities selecting one of /brand/feature-*.jpg and its crop —
   * a background-image url utility plus a background-position one.
   *
   * Keep arbitrary-value background utilities out of this comment: Tailwind
   * scans raw source text, so writing one here emits a rule with an empty
   * asset reference, which then fails to resolve and breaks the build.
   */
  photo: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full overflow-hidden rounded-2xl border border-black/[0.06] p-5 sm:p-6",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn("absolute inset-0 bg-cover [filter:saturate(1.45)_contrast(1.04)]", photo)}
      />
      <div className="relative flex min-w-0 flex-1">{children}</div>
    </div>
  );
}

/**
 * The full-size surface a hero abstraction fills.
 *
 * Deliberately flush — no border, radius or shadow. These panels are only ever
 * rendered as stops inside ProductTour, and the tour is one card whose chrome
 * (the tab strip, the frame, the caption bar) belongs to the tour rather than
 * to each stop. A panel carrying its own frame would nest a card in a card.
 */
export function HeroPanel({
  className,
  label,
  children,
}: {
  className?: string;
  /** Describes the illustration for assistive tech. */
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "pointer-events-none relative flex h-full select-none flex-col overflow-hidden bg-card text-left",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A metric or status row: a label on the left, a real value on the right. The
 * hero panels lean on these to read as a product surface rather than a diagram.
 */
export function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 border-t border-border/60 py-2 font-mono text-[0.625rem] first:border-t-0">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn("ml-auto font-semibold", accent ? "text-prism-cyan-700" : "text-foreground")}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * The white surface each illustration sits on, floating over the ray photo its
 * container provides (matching stack-bento's illustration columns). The photo
 * and its saturation filter stay in the container so they never touch content.
 */
export function SurfaceCard({
  className,
  label,
  children,
}: {
  className?: string;
  /** Describes the illustration for assistive tech. */
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "pointer-events-none relative flex h-full w-full select-none flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-[0_12px_32px_-14px_rgba(21,21,21,0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
