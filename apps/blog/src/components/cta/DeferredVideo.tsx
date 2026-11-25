"use client";

import { useEffect, useRef, useState } from "react";

// The site's DeferredVideo (apps/site/src/components/brand/deferred-video.tsx)
// without framer-motion, which the blog doesn't ship. The source is withheld
// until the video is near the viewport, it plays only while visible, and it
// neither loads nor plays while the reader prefers reduced motion: the panel's photograph
// behind it is the poster and the static fallback.
export function DeferredVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  // Follows the reader's motion preference live, not only at mount: turning
  // on reduced motion mid-play pauses the video, and the source loads only
  // while motion is allowed.
  const motionOkRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    motionOkRef.current = motion.matches;
    let nearViewport = false;

    const sync = () => {
      if (!motionOkRef.current) {
        video.pause();
        return;
      }
      if (nearViewport) setLoaded(true);
      if (video.getAttribute("src") && visibleRef.current) void video.play().catch(() => {});
    };

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          nearViewport = true;
          near.disconnect();
          sync();
        }
      },
      { rootMargin: "300px" },
    );
    const visible = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (!video.getAttribute("src")) return;
      if (entry.isIntersecting && motionOkRef.current) void video.play().catch(() => {});
      else video.pause();
    });
    const onMotionChange = () => {
      motionOkRef.current = motion.matches;
      sync();
    };

    near.observe(video);
    visible.observe(video);
    motion.addEventListener("change", onMotionChange);
    return () => {
      near.disconnect();
      visible.disconnect();
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  // The source arrives after the first visibility callback, so start playback
  // once it's attached if the panel is still on screen and motion is allowed.
  useEffect(() => {
    const video = ref.current;
    if (!loaded || !video) return;
    video.load();
    if (visibleRef.current && motionOkRef.current) void video.play().catch(() => {});
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
