"use client";

import { useEffect, useRef } from "react";

// The hero's prismatic backdrop, cursor-reactive: the washes and beam fan
// lean toward the pointer (damped, transform-only), the beams travelling
// further than the washes — the differential between the layers (and the
// static veil, console, and monument) is what makes the light feel physical.
// Blooms in on load (hero-bloom). Pointer tracking is skipped for touch
// devices and reduced motion; the dispersion veil stays static so the
// panel's top edge never shifts.
export function HeroBackdrop() {
  const washes = useRef<HTMLDivElement>(null);
  const beams = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const washEl = washes.current;
    const beamEl = beams.current;
    if (!washEl || !beamEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const tick = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      washEl.style.transform = `translate3d(${(x * 48).toFixed(1)}px, ${(y * 20).toFixed(1)}px, 0)`;
      beamEl.style.transform = `translate3d(${(x * 110).toFixed(1)}px, ${(y * 44).toFixed(1)}px, 0)`;
      raf = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 … 1
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[40rem] animate-hero-bloom overflow-hidden motion-reduce:animate-none"
    >
      {/* cursor-damped layers — washes drift, beams travel further */}
      <div ref={washes} className="absolute inset-0">
        {/* spectral wash along the bottom edge */}
        <div
          className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
          style={{
            background: "var(--paper)",
          }}
        />
      </div>
      <div ref={beams} className="absolute inset-0">
        {/* beam fan rising from below */}
      </div>
      {/* dispersion back to white above — static, outside the damped layers */}
      <div className="absolute inset-x-0 top-0 h-80 bg-transparent" />
    </div>
  );
}
