"use client";

import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PrismaticBurst from "@/components/brand/prismatic-burst";
import { observeAnimationActivity } from "@/lib/animation-activity";

const PRISM_COLORS = ["#01d7e4", "#f3c306", "#f37a03", "#f43531", "#f00e5c", "#ffffff"];

// The brand's signature hover fill: a prismatic burst erupting from the
// centre via a feathered radial reveal. Prepare visible buttons during idle
// time, so the first hover doesn't have to create and compile a GL program.
// The prepared canvas rests between hovers and is released when offscreen.
export function BurstFill({ on }: { on: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hoveredRef = useRef(on);
  const prepareRef = useRef<(() => void) | null>(null);
  const [present, setPresent] = useState(false);
  useEffect(() => {
    hoveredRef.current = on;
    if (on) prepareRef.current?.();
  }, [on]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let cancelPreparation = () => {};
    const stop = observeAnimationActivity(
      element,
      (active) => {
        cancelPreparation();
        prepareRef.current = null;
        if (!active) {
          setPresent(false);
          return;
        }
        const prepare = () => {
          cancelPreparation();
          cancelPreparation = () => {};
          prepareRef.current = null;
          setPresent(true);
        };
        prepareRef.current = prepare;
        // An early hover takes priority over idle warmup. Otherwise bound the
        // wait so a busy page still prepares its visible buttons.
        if (hoveredRef.current) {
          prepare();
          return;
        }
        if (typeof window.requestIdleCallback === "function") {
          const id = window.requestIdleCallback(prepare, { timeout: 500 });
          cancelPreparation = () => window.cancelIdleCallback(id);
        } else {
          const id = window.setTimeout(prepare, 0);
          cancelPreparation = () => window.clearTimeout(id);
        }
      },
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
    );
    return () => {
      cancelPreparation();
      prepareRef.current = null;
      stop();
    };
  }, []);

  // Drive the burst's radial reveal via a numeric motion value, fed into a
  // soft-edged radial-gradient mask (feathered, so no hard circle edge).
  const reveal = useMotionValue(0);
  const maskOuter = useTransform(reveal, (v) => v + 32);
  const maskImage = useMotionTemplate`radial-gradient(circle at 50% 50%, #000 ${reveal}%, rgba(0,0,0,0) ${maskOuter}%)`;
  useEffect(() => {
    if (!present) {
      reveal.set(0);
      return;
    }
    // Always restart the reveal from 0 on hover-in so the build-in plays every
    // time (otherwise a leftover value makes it pop in instantly).
    if (on) reveal.set(0);
    const controls = animate(reveal, on ? 100 : 0, {
      duration: on ? 2.0 : 0.6,
      ease: on ? [0.22, 1, 0.36, 1] : "easeIn",
    });
    return () => controls.stop();
  }, [on, present, reveal]);

  return (
    <motion.span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 block"
      style={{ maskImage, WebkitMaskImage: maskImage }}
      initial={{ opacity: 0 }}
      animate={{ opacity: on && present ? 0.5 : 0 }}
      transition={{ opacity: { duration: 0.12, ease: "easeOut" } }}
    >
      {present && (
        <PrismaticBurst
          animationType="rotate3d"
          intensity={3.2}
          speed={0.7}
          distort={1.4}
          rayCount={0}
          paused={!on}
          mixBlendMode="lighten"
          colors={PRISM_COLORS}
        />
      )}
    </motion.span>
  );
}
