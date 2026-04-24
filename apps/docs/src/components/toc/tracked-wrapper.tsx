"use client";

import * as Primitive from "fumadocs-core/toc";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import * as TocClerk from "./clerk";
import * as TocDefault from "./default";

function getInitialStepStorageKey(pathname: string) {
  return `stepTracking:${pathname}:initial_step`;
}

function getInitialStep(pathname: string, anchor: string) {
  try {
    const storageKey = getInitialStepStorageKey(pathname);
    const existingInitialStep = sessionStorage.getItem(storageKey);

    if (existingInitialStep) {
      return existingInitialStep;
    }

    sessionStorage.setItem(storageKey, anchor);
  } catch {
    // Ignore storage failures and fall back to the current anchor.
  }

  return anchor;
}

export function TrackedTOCWrapper({
  tocStyle = "default",
  stepTracking = false,
}: {
  tocStyle?: "default" | "clerk";
  stepTracking?: boolean;
}) {
  const active = Primitive.useActiveAnchors();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastEmittedRef = useRef<string>("");

  useEffect(() => {
    lastEmittedRef.current = "";

    return () => clearTimeout(timeoutRef.current);
  }, [pathname]);

  useOnChange(active, () => {
    if (!stepTracking) return;

    const anchor = active[0];
    if (!anchor) return;

    const eventKey = `${pathname}#${anchor}`;
    if (lastEmittedRef.current === eventKey) return;

    const initialStep = getInitialStep(pathname, anchor);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      posthog.capture("pageview_quickstart", {
        page: pathname,
        section: anchor,
        initial_step: initialStep,
      });
      lastEmittedRef.current = eventKey;
    }, 300);
  });

  const TOCComponent =
    tocStyle === "clerk" ? TocClerk.TOCItems : TocDefault.TOCItems;
  return <TOCComponent />;
}
