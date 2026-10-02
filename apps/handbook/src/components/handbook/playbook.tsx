import type { ReactNode } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";

// Numbered, bounded actions with a time estimate each. This is the "do this
// now" spine of a chapter, so it is deliberately plainer than the prose
// around it: one action per step, no nested lists of lists.
export function Playbook({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={cn("hb-playbook", className)}>{children}</ol>;
}

export function Step({
  title,
  time,
  children,
}: {
  title: ReactNode;
  /** Free text, e.g. "~20 min" or "an evening". */
  time?: string;
  children?: ReactNode;
}) {
  return (
    <li className="hb-step">
      <div className="hb-step-head">
        <span className="hb-step-title">{title}</span>
        {time && (
          <span className="hb-step-time" aria-label={`Time estimate: ${time}`}>
            {time}
          </span>
        )}
      </div>
      {children && <div className="hb-step-body">{children}</div>}
    </li>
  );
}
