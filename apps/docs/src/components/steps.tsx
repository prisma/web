"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * An opt-in step sequence for setup pages. Wrap the page's step headings in
 * <Steps> in MDX:
 *
 *   <Steps>
 *   ### Get a database [#1-get-a-database]
 *   ...
 *   ### Set the database connection [#2-set-the-database-connection]
 *   ...
 *   </Steps>
 *
 * Each direct h3 becomes a step: CSS numbers it in a small outlined marker on
 * a hairline rail (global.css, `.docs-steps`), so the heading text carries no
 * "1." of its own. Pin the old anchor with `[#…]` when converting a page that
 * used numbered headings, so existing links keep working.
 *
 * Light as a state (prisma.io/brand): the step being read gets a darker
 * marker, and its stretch of the rail a faint spectrum. Only that one segment
 * lights; nothing animates on its own. The .md / llms output numbers the
 * headings instead (llm-markdown.ts).
 */
export function Steps({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [segment, setSegment] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>(":scope > h3"));
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // The step whose heading has passed the upper third of the screen.
      const line = window.innerHeight * 0.35;
      let active = 0;
      headings.forEach((heading, i) => {
        if (heading.getBoundingClientRect().top < line) active = i;
      });
      headings.forEach((heading, i) => {
        if (i === active) heading.setAttribute("data-step-active", "");
        else heading.removeAttribute("data-step-active");
      });
      // From just under this step's marker to just above the next one.
      const start = headings[active].offsetTop + 34;
      const end = (headings[active + 1]?.offsetTop ?? root.offsetHeight) - 4;
      setSegment({ top: start, height: Math.max(0, end - start) });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="docs-steps">
      {children}
      <span
        aria-hidden="true"
        className="docs-steps-active"
        style={segment ? { top: segment.top, height: segment.height } : { display: "none" }}
      />
    </div>
  );
}
