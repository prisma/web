"use client";

import { useCallback, type MouseEvent, type ReactNode } from "react";

/**
 * Hovering or focusing a mapped line highlights its counterparts in the
 * open tab. Inactive tabs are not mounted, so the mapping is in-tab only.
 */
export function SameQueryHighlight({ children }: { children: ReactNode }) {
  const mark = useCallback((event: MouseEvent<HTMLDivElement> | { target: EventTarget }) => {
    const root = (event.target as HTMLElement | null)?.closest("[data-same-query]");
    if (!root) return;
    const group = (event.target as HTMLElement | null)
      ?.closest("[data-group]")
      ?.getAttribute("data-group");
    for (const line of root.querySelectorAll<HTMLElement>("[data-group]")) {
      line.classList.toggle("bg-prism-cyan-50", Boolean(group) && line.dataset.group === group);
    }
  }, []);

  const clear = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const root = event.currentTarget;
    for (const line of root.querySelectorAll<HTMLElement>("[data-group]")) {
      line.classList.remove("bg-prism-cyan-50");
    }
  }, []);

  return (
    <div
      data-same-query=""
      onMouseOver={mark}
      onMouseOut={clear}
      onFocusCapture={(event) => mark(event)}
    >
      {children}
    </div>
  );
}
