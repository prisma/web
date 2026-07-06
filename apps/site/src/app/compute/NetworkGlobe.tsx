"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useTheme } from "@prisma-docs/ui/components/theme-provider";
import { COBE_MARKER_DOT_RGB, cobeGlobe, hexToRgb01, light } from "./tokens";
import { cn } from "@/lib/cn";
import { Separator } from "@prisma/eclipse";

// ─── Region Data ──────────────────────────────────────────────────────────────

const REGIONS = {
  SF01: {
    location: [37.37, -121.92] as [number, number],
    city: "San Francisco",
    zone: "US West",
  },
  IAD1: {
    location: [39.04, -77.49] as [number, number],
    city: "Washington",
    zone: "US East",
  },
  FRA1: {
    location: [50.11, 8.68] as [number, number],
    city: "Frankfurt",
    zone: "Europe",
  },
  SIN1: {
    location: [1.35, 103.82] as [number, number],
    city: "Singapore",
    zone: "SE Asia",
  },
} as const;

type RegionKey = keyof typeof REGIONS;
const REGION_KEYS = Object.keys(REGIONS) as RegionKey[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function locationToAngles(lat: number, long: number): [number, number] {
  return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}

/** Find the equivalent target phi closest to current to avoid long-way-around spins. */
function nearestPhi(target: number, current: number): number {
  const TWO_PI = Math.PI * 2;
  return target + Math.round((current - target) / TWO_PI) * TWO_PI;
}

function getArcs(focused: RegionKey) {
  return REGION_KEYS.filter((k) => k !== focused).map((k) => ({
    from: REGIONS[focused].location,
    to: REGIONS[k].location,
  }));
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAP_SAMPLES = 16000;
const MAP_BASE_BRIGHTNESS = 0.025;
const MARKER_SIZE = 0.025;
const MARKER_ELEVATION = 0;
const ARC_HEIGHT = 0.5;
const ARC_WIDTH = 0.4;
const EASE = 0.08;
const AUTO_ROTATE_SPEED = 0.003;
const FOCUS_PAUSE_MS = 3000;

// ─── Colors ───────────────────────────────────────────────────────────────────

// Computed once so cobeGlobe() is not called 4× per theme preset.
const _lightGlobe = cobeGlobe(true);
const _darkGlobe = cobeGlobe(false);

const LIGHT_COLORS = {
  dark: -2 as number,
  diffuse: 0.6,
  mapBrightness: 12,
  mapBaseBrightness: MAP_BASE_BRIGHTNESS,
  baseColor: _lightGlobe.baseColor as [number, number, number],
  markerColor: _lightGlobe.markerColor as [number, number, number],
  glowColor: _lightGlobe.glowColor as [number, number, number],
  arcColor: _lightGlobe.arcColor as [number, number, number],
  markerDotRgb: COBE_MARKER_DOT_RGB(true),
};

const DARK_COLORS = {
  dark: 1 as number,
  diffuse: 0.6,
  mapBrightness: 12,
  mapBaseBrightness: MAP_BASE_BRIGHTNESS,
  baseColor: _darkGlobe.baseColor as [number, number, number],
  markerColor: _darkGlobe.markerColor as [number, number, number],
  glowColor: _darkGlobe.glowColor as [number, number, number],
  arcColor: _darkGlobe.arcColor as [number, number, number],
  markerDotRgb: COBE_MARKER_DOT_RGB(false),
};

// Start centred on SF01
const [INIT_PHI, INIT_THETA] = locationToAngles(...REGIONS.SF01.location);

// ─── Component ────────────────────────────────────────────────────────────────

export function NetworkGlobe() {
  const { resolvedTheme } = useTheme();
  const [isRevealed, setIsRevealed] = useState(false);
  const [focused, setFocused] = useState<RegionKey>("SF01");

  const isDarkRef = useRef(resolvedTheme === "dark");
  const containerRef = useRef<HTMLDivElement>(null);

  // Rendered angles — updated every frame by the easing loop.
  const phiRef = useRef(INIT_PHI);
  const thetaRef = useRef(INIT_THETA);

  // Target angles — written by button clicks, read by the RAF tick.
  const targetPhiRef = useRef(INIT_PHI);
  const targetThetaRef = useRef(INIT_THETA);

  // Arcs for the currently-focused region — written by button clicks.
  const arcsRef = useRef(getArcs("SF01"));

  // Auto-rotation state — true by default, paused briefly after a click.
  const autoRotatingRef = useRef(true);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const state = { label: "Live", color: "ppg" };

  useEffect(() => {
    isDarkRef.current = resolvedTheme === "dark";
  }, [resolvedTheme]);

  const handleFocus = useCallback((key: RegionKey) => {
    setFocused(key);
    arcsRef.current = getArcs(key);
    const [rawPhi, rawTheta] = locationToAngles(...REGIONS[key].location);
    // Snap to the nearest equivalent angle so the globe takes the short path.
    targetPhiRef.current = nearestPhi(rawPhi, phiRef.current);
    targetThetaRef.current = rawTheta;

    // Pause auto-rotation while the globe travels to and dwells on the region.
    autoRotatingRef.current = false;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      // Sync the target to where the globe actually is so rotation resumes
      // smoothly from the current position instead of jumping.
      targetPhiRef.current = phiRef.current;
      autoRotatingRef.current = true;
    }, FOCUS_PAUSE_MS);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Canvas is created imperatively — keeps it out of React's reconciler and
    // safe from COBE v2's own canvas-wrapping behaviour.
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block;";
    container.appendChild(canvas);

    let animationId = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;

    // ── Pause / resume helpers (É #1 IntersectionObserver + #5 Tab Visibility) ──
    let isInView = false;
    let isTabVisible = typeof document !== "undefined" ? !document.hidden : true;

    const maybePause = () => {
      if (animationId !== 0) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const maybeResume = () => {
      if (isInView && isTabVisible && animationId === 0 && globe) {
        animationId = requestAnimationFrame(tick);
      }
    };
    // ─────────────────────────────────────────────────────────────────────

    const tick = () => {
      if (!globe) return;
      const colors = isDarkRef.current ? DARK_COLORS : LIGHT_COLORS;

      // Advance the target while auto-rotating so the globe drifts continuously.
      if (autoRotatingRef.current) {
        targetPhiRef.current += AUTO_ROTATE_SPEED;
      }

      // Ease phi and theta toward their targets each frame.
      phiRef.current += (targetPhiRef.current - phiRef.current) * EASE;
      thetaRef.current += (targetThetaRef.current - thetaRef.current) * EASE;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globe as any).update({
        phi: phiRef.current,
        theta: thetaRef.current,
        width: canvas.offsetWidth,
        height: canvas.offsetWidth,
        dark: colors.dark,
        diffuse: colors.diffuse,
        mapBrightness: colors.mapBrightness,
        mapBaseBrightness: colors.mapBaseBrightness,
        baseColor: colors.baseColor,
        markerColor: colors.markerColor,
        glowColor: colors.glowColor,
        arcColor: colors.arcColor,
        // Arcs are updated here each frame so switching regions is instant.
        arcs: arcsRef.current,
      });

      animationId = requestAnimationFrame(tick);
    };

    const mountGlobe = () => {
      if (globe) return;
      const canvasWidth = canvas.offsetWidth;
      if (canvasWidth < 1) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const colors = isDarkRef.current ? DARK_COLORS : LIGHT_COLORS;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      globe = (createGlobe as any)(canvas, {
        devicePixelRatio: dpr,
        width: canvasWidth,
        height: canvasWidth,
        phi: INIT_PHI,
        theta: INIT_THETA,
        dark: colors.dark,
        diffuse: colors.diffuse,
        mapSamples: MAP_SAMPLES,
        mapBrightness: colors.mapBrightness,
        mapBaseBrightness: colors.mapBaseBrightness,
        baseColor: colors.baseColor,
        markerColor: colors.markerColor,
        glowColor: colors.glowColor,
        scale: 1,
        offset: [0, 0],
        markers: REGION_KEYS.map((key) => ({
          id: key.toLowerCase(),
          location: REGIONS[key].location,
          size: MARKER_SIZE,
          color: colors.markerDotRgb,
        })),
        arcs: arcsRef.current,
        arcColor: colors.arcColor,
        arcWidth: ARC_WIDTH,
        arcHeight: ARC_HEIGHT,
        markerElevation: MARKER_ELEVATION,
      });

      animationId = requestAnimationFrame(tick);
      // Reveal after two frames so the globe has painted before fading in.
      requestAnimationFrame(() => requestAnimationFrame(() => setIsRevealed(true)));
    };

    mountGlobe();

    const ro = new ResizeObserver(() => {
      if (!globe) mountGlobe();
    });
    ro.observe(container);

    // #1 – IntersectionObserver: halt the RAF when the globe is off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        isInView ? maybeResume() : maybePause();
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    // #5 – Tab Visibility API.
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      isTabVisible ? maybeResume() : maybePause();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      const g = globe;
      globe = null;
      cancelAnimationFrame(animationId);
      canvas.remove();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      g?.destroy();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-stroke-neutral bg-background-default">
      <div className="header uppercase font-mono text-foreground-neutral-weaker text-xs p-4 flex justify-between border-b border-stroke-neutral">
        <span>Compute + Prisma Postgres · co-located</span>
        <div className="flex gap-2 text-foreground-ppg items-center">
          <span
            className={cn(
              `after:bg-foreground-ppg before:bg-foreground-ppg animate-pulse`,
              "h-3.5 w-3.5 block rounded-full relative",
              "before:content-'' before:absolute before:inset-0 before:rounded-full before:blur-[1px]",
              "after:content-'' after:absolute after:inset- after:rounded-full after:overflow-hidden",
            )}
          ></span>
          <span>{state.label}</span>
        </div>
      </div>
      {/* Globe canvas */}
      <div
        className="content"
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          maxHeight: "400px",
          position: "relative",
          opacity: isRevealed ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        <div
          ref={containerRef}
          role="img"
          className="max-w-[400px] mx-auto w-full"
          aria-label="Interactive globe showing Prisma Compute data center locations"
        />
        <div className="text-[10px] font-mono absolute max-w-[150px] bottom-4 right-4 text-foreground-neutral w-full">
          <div className="flex justify-between pb-3 mb-3 border-b border-dashed border-stroke-neutral">
            <span className="uppercase text-foreground-neutral-weaker">Region</span>{" "}
            <span>{focused}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="uppercase text-foreground-neutral-weaker">Location</span>{" "}
            <span>{REGIONS[focused].city}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase text-foreground-neutral-weaker">Zone</span>{" "}
            <span>{REGIONS[focused].zone}</span>
          </div>
        </div>
      </div>

      {/* Region selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t">
        {REGION_KEYS.map((key, i) => {
          const active = focused === key;
          return (
            <button
              key={key}
              onClick={() => handleFocus(key)}
              className={cn(
                "group flex items-center gap-2 px-3 py-4 text-left border max-sm:border-stroke-neutral-strong! ",
                "cursor-pointer transition-colors duration-150 bg-background-neutral",
                i < REGION_KEYS.length - 1 ? "border-r border-stroke-neutral" : "",
                active ? "bg-background-neutral-weak" : "hover:bg-background-neutral-weak",
              )}
            >
              <i
                className={cn(
                  "fa-regular relative fa-location-dot text-md transition-all duration-150",
                  active
                    ? "text-foreground-ppg-strong"
                    : "text-foreground-neutral-weaker group-hover:text-foreground-ppg group-hover:-translate-y-1",
                )}
              />
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "font-mono text-xs transition-colors duration-150",
                    active
                      ? "text-foreground-ppg-strong"
                      : "text-foreground-neutral-weak group-hover:text-foreground-ppg",
                  )}
                >
                  {key}
                </span>
                <span className="text-xs leading-none text-foreground-neutral">
                  {REGIONS[key].city}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
