import type { ReactNode } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";

// A margin note. Side commentary that is worth reading but must not break
// the paragraph it sits next to. On a wide enough screen it floats into the
// gutter beside the article (see .hb-aside in global.css); everywhere else
// it renders as a compact inset card so nothing is lost on a phone.
export function Aside({
  label,
  children,
  className,
}: {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn("hb-aside", className)}>
      {label && <span className="hb-aside-label">{label}</span>}
      <div className="hb-aside-body">{children}</div>
    </aside>
  );
}
