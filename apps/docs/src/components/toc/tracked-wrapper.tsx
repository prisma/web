"use client";

import * as Primitive from "fumadocs-core/toc";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import posthog from "posthog-js";
import * as TocClerk from "./clerk";
import * as TocDefault from "./default";

const TRACKED_PAGES = [{ id: "quickstart", path: "/prisma-orm/quickstart/" }];

export function TrackedTOCWrapper({
  tocStyle = "default",
}: {
  tocStyle?: "default" | "clerk";
}) {
  const active = Primitive.useActiveAnchors();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastEmittedRef = useRef<string>("");

  useOnChange(active, () => {
    const match = TRACKED_PAGES.find((p) => pathname.includes(p.path));
    if (!match) return;

    const anchor = active[0];
    if (!anchor) return;

    const eventKey = `${pathname}#${anchor}`;
    if (lastEmittedRef.current === eventKey) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      posthog.capture(`pageview_${match.id}`, {
        page: pathname,
        section: anchor,
      });
      lastEmittedRef.current = eventKey;
    }, 300);
  });

  const TOCComponent =
    tocStyle === "clerk" ? TocClerk.TOCItems : TocDefault.TOCItems;
  return <TOCComponent />;
}
