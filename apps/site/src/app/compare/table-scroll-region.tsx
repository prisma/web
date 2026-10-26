"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Keyboard-scrollable from `sm` up, where the table is wide and `overflow-x-auto`.
 * Below 640px rows stack, so a tabIndex would be an empty stop.
 */
export function TableScrollRegion({
  labelledBy,
  className,
  style,
  children,
}: {
  labelledBy: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const update = () => setWide(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div
      className={className}
      role="region"
      aria-labelledby={labelledBy}
      tabIndex={wide ? 0 : undefined}
      style={style}
    >
      {children}
    </div>
  );
}
