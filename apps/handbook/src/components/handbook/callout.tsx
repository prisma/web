import type { ReactNode } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";

export type CalloutType = "note" | "tip" | "warning" | "example";

// One family, four moods. Colour comes from Eclipse tokens so the shell and
// the callouts track the same palette. `example` is the handbook's own: a
// worked example or a "here is how this actually went" beat, marked with
// the brand's triple-band ray down the left edge.
const STYLES: Record<CalloutType, { box: string; label: string; icon: string }> = {
  note: {
    box: "bg-background-ppg text-foreground-neutral border-l-prism-cyan-500",
    label: "Note",
    icon: "fa-regular fa-circle-info",
  },
  tip: {
    box: "bg-background-success text-foreground-neutral border-l-prism-cyan-600",
    label: "Tip",
    icon: "fa-regular fa-lightbulb",
  },
  warning: {
    box: "bg-background-warning text-foreground-neutral border-l-prism-yellow-500",
    label: "Watch out",
    icon: "fa-regular fa-triangle-exclamation",
  },
  example: {
    box: "bg-background-neutral-weak text-foreground-neutral hb-callout-ray",
    label: "Example",
    icon: "fa-regular fa-flask",
  },
};

export function Callout({
  type = "note",
  title,
  children,
  className,
}: {
  type?: CalloutType;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const style = STYLES[type] ?? STYLES.note;
  return (
    <aside
      role="note"
      data-callout={type}
      className={cn(
        "hb-callout my-6 rounded-square border-l-4 px-5 py-4 text-md leading-7",
        "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ol]:my-2",
        style.box,
        className,
      )}
    >
      <p className="hb-callout-title mt-0! mb-1! flex items-center gap-2 font-sans-display text-sm font-medium uppercase tracking-wide text-foreground-neutral-weak">
        <i className={cn(style.icon, "text-xs")} aria-hidden="true" />
        {title ?? style.label}
      </p>
      <div>{children}</div>
    </aside>
  );
}
