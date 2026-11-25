"use client";

import { useEffect, useRef, useState } from "react";

// The site's DeferredVideo (apps/site/src/components/brand/deferred-video.tsx)
// without framer-motion, which the blog doesn't ship. The source is withheld
// until the video is near the viewport, it plays only while visible, and it
// never loads for readers who prefer reduced motion: the panel's photograph
// behind it is the poster and the static fallback.
export function DeferredVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!motion.matches) return;

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          near.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    const visible = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (!video.getAttribute("src")) return;
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    });
    near.observe(video);
    visible.observe(video);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, []);

  // The source arrives after the first visibility callback, so start playback
  // once it's attached if the panel is still on screen.
  useEffect(() => {
    const video = ref.current;
    if (!loaded || !video) return;
    video.load();
    if (visibleRef.current) void video.play().catch(() => {});
  }, [loaded]);

  return (
    <video
      ref={ref}
      aria-hidden
      src={loaded ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
