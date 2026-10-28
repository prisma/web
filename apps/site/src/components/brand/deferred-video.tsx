"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Autoplay overrides preload="none". Withhold the source until the video is
// near the viewport, and keep the existing background as the static fallback.
export function DeferredVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { once: true, margin: "300px" });
  const visible = useInView(ref);
  const reduce = useReducedMotion();
  const loaded = near && reduce === false;
  const active = visible && loaded;
  useEffect(() => {
    if (active) void ref.current?.play().catch(() => {});
    else {
      ref.current?.pause();
      if (!loaded) ref.current?.load();
    }
  }, [active, loaded]);
  return (
    <video
      ref={ref}
      aria-hidden
      src={loaded ? src : undefined}
      autoPlay={active}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
