"use client";

import { useEffect, useRef, useState } from "react";

/**
 * #1 – IntersectionObserver pause/resume
 *
 * Returns `true` when the observed element is outside the viewport (i.e.
 * animations should pause). When the element re-enters, `onReEntry` fires
 * first so components can reset their state before resuming — this is what
 * makes every section feel "alive" each time the user scrolls to it.
 */
export function useIntersectionPause(
  ref: { current: Element | null },
  onReEntry?: () => void,
  options: IntersectionObserverInit = { threshold: 0.05 },
): boolean {
  const [paused, setPaused] = useState(false);
  // Track whether the element was previously outside the viewport so we
  // only fire onReEntry when it re-enters (not on the very first observe).
  const wasOutRef = useRef(false);
  // Keep the callback reference stable so the effect never re-runs on render.
  const onReEntryRef = useRef(onReEntry);
  useEffect(() => {
    onReEntryRef.current = onReEntry;
  });

  useEffect(() => {
    const el = ref.current;
    if (typeof IntersectionObserver === "undefined" || !el) return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (visible && wasOutRef.current) {
        // #2 – Reset on re-entry: fire before unpausing so state is fresh.
        onReEntryRef.current?.();
      }
      wasOutRef.current = !visible;
      setPaused(!visible);
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // `options` is a literal at the call-site so it's stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return paused;
}

/**
 * #5 – Tab Visibility API
 *
 * Returns `true` when the browser tab is backgrounded / hidden.
 * Costs ~10 lines and prevents any JS work when the user isn't looking.
 */
export function usePageVisibility(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => setHidden(document.hidden);
    handler(); // sync to current state immediately
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return hidden;
}

/**
 * Convenience: combines viewport + tab visibility.
 * Returns `true` whenever animations should pause — element is either outside
 * the viewport OR the tab is backgrounded.
 */
export function useShouldPause(ref: { current: Element | null }, onReEntry?: () => void): boolean {
  const outOfViewport = useIntersectionPause(ref, onReEntry);
  const tabHidden = usePageVisibility();
  return outOfViewport || tabHidden;
}
