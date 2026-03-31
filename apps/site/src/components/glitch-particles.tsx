"use client";

import { useEffect, useRef } from "react";

const SVG_PATH =
  "M64.7997 131.22V37.8H64.9797L39.2397 75.42H120.96V104.58H-0.000312462V79.2L57.9597 1.44003H101.88V131.22H64.7997ZM190.03 132.84C180.07 132.84 171.31 131.28 163.75 128.16C156.19 124.92 149.95 120.42 145.03 114.66C140.11 108.78 136.39 101.76 133.87 93.6C131.35 85.44 130.09 76.32 130.09 66.24C130.09 51.36 132.55 39.06 137.47 29.34C142.51 19.5 149.53 12.18 158.53 7.38003C167.65 2.46003 178.21 2.59876e-05 190.21 2.59876e-05C200.29 2.59876e-05 209.05 1.62003 216.49 4.86003C223.93 7.98002 230.11 12.42 235.03 18.18C240.07 23.94 243.79 30.9 246.19 39.06C248.71 47.22 249.97 56.34 249.97 66.42C249.97 81.3 247.51 93.66 242.59 103.5C237.67 113.34 230.65 120.72 221.53 125.64C212.53 130.44 202.03 132.84 190.03 132.84ZM190.03 102.6C193.87 102.6 197.17 101.82 199.93 100.26C202.69 98.7 204.97 96.36 206.77 93.24C208.57 90.12 209.89 86.34 210.73 81.9C211.69 77.34 212.17 72.18 212.17 66.42C212.17 59.82 211.63 54.24 210.55 49.68C209.47 45.12 207.97 41.4 206.05 38.52C204.13 35.64 201.79 33.54 199.03 32.22C196.39 30.9 193.45 30.24 190.21 30.24C186.25 30.24 182.89 31.02 180.13 32.58C177.37 34.14 175.09 36.48 173.29 39.6C171.49 42.6 170.17 46.38 169.33 50.94C168.49 55.38 168.07 60.54 168.07 66.42C168.07 73.02 168.55 78.66 169.51 83.34C170.59 87.9 172.09 91.62 174.01 94.5C175.93 97.38 178.27 99.48 181.03 100.8C183.79 102 186.79 102.6 190.03 102.6ZM164.65 96.66V72.9L215.95 36.18V59.94L164.65 96.66ZM323.901 131.22V37.8H324.081L298.341 75.42H380.061V104.58H259.101V79.2L317.061 1.44003H360.981V131.22H323.901Z";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Glitch {
  offsetX1: number;
  offsetX2: number;
  offsetY1: number;
  offsetY2: number;
  slices: number[];
  showGlitch: boolean;
}

interface GlitchParticlesProps {
  /** Width of the content area (canvas = this + padding * 2) */
  contentWidth?: number;
  /** Height of the content area (canvas = this + padding * 2) */
  contentHeight?: number;
  /** Space around the content */
  padding?: number;
}

export default function GlitchParticles({
  contentWidth = 427,
  contentHeight = 178,
  padding = 300,
}: GlitchParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = contentWidth + padding * 2;
    const canvasHeight = contentHeight + padding * 2;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const particles: Particle[] = [];
    const mouse = { x: 0, y: 0 };
    let isPressed = false;
    let glitch: Glitch = {
      offsetX1: 0,
      offsetX2: 0,
      offsetY1: 0,
      offsetY2: 0,
      slices: [0, 0, 0, 0, 0],
      showGlitch: false,
    };
    let rafId: number | undefined;

    // — Init particles from SVG path —
    const offscreen = document.createElement("canvas");
    offscreen.width = contentWidth;
    offscreen.height = contentHeight;
    const offCtx = offscreen.getContext("2d")!;
    const path2d = new Path2D(SVG_PATH);
    offCtx.save();
    offCtx.scale(contentWidth / 381, contentHeight / 133);
    offCtx.fillStyle = "#000";
    offCtx.fill(path2d);
    offCtx.restore();

    const imageData = offCtx.getImageData(0, 0, contentWidth, contentHeight);
    const sampleGap = 4;
    const particleSize = 6;

    for (let y = 0; y < contentHeight; y += sampleGap) {
      for (let x = 0; x < contentWidth; x += sampleGap) {
        const i = (y * contentWidth + x) * 4;
        if (imageData.data[i + 3] > 128) {
          const px = x + padding;
          const py = y + padding;
          particles.push({
            homeX: px,
            homeY: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            size: particleSize,
          });
        }
      }
    }

    let glitchInterval: ReturnType<typeof setInterval> | undefined;
    if (!prefersReducedMotion) {
      // — Glitch updater —
      glitchInterval = setInterval(() => {
        const isHeavy = Math.random() > 0.07;
        glitch = {
          offsetX1: (Math.random() - 0.5) * (isHeavy ? 8 : 4),
          offsetX2: (Math.random() - 0.5) * (isHeavy ? 8 : 4),
          offsetY1: (Math.random() - 0.5) * 2,
          offsetY2: (Math.random() - 0.5) * 2,
          slices: [
            (Math.random() - 0.5) * (isHeavy ? 16 : 6),
            (Math.random() - 0.5) * (isHeavy ? 20 : 8),
            (Math.random() - 0.5) * (isHeavy ? 16 : 6),
            (Math.random() - 0.5) * (isHeavy ? 12 : 6),
            (Math.random() - 0.5) * (isHeavy ? 16 : 5),
          ],
          showGlitch: Math.random() > 0.008,
        };
      }, 50);
    }

    // — Animation loop —
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (!prefersReducedMotion) {
        const repelRadius = isPressed ? 200 : 80;
        const repelStrength = isPressed ? 50 : 15;

        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repelRadius && dist > 0) {
            const force = (repelRadius - dist) / repelRadius;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * repelStrength;
            p.vy += Math.sin(angle) * force * repelStrength;
          }

          if (isPressed) {
            p.vx += (Math.random() - 0.5) * 6;
            p.vy += (Math.random() - 0.5) * 6;
          }

          p.vx += (p.homeX - p.x) * 0.08;
          p.vy += (p.homeY - p.y) * 0.08;
          p.vx *= 0.85;
          p.vy *= 0.85;
          p.x += p.vx;
          p.y += p.vy;
        });
      }

      if (!glitch.showGlitch) {
        ctx.globalAlpha = 0.3;
        particles.forEach((p) => {
          ctx.fillStyle = "#E0E7FF";
          ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        ctx.globalAlpha = 1;
      } else {
        particles.forEach((p) => {
          const sliceIndex = Math.floor((p.homeY - padding) / 27);
          const sliceOffset =
            glitch.slices[Math.min(Math.max(sliceIndex, 0), 4)];

          ctx.globalAlpha = 0.6;
          ctx.fillStyle = "#CCFBF1";
          ctx.fillRect(
            p.x + glitch.offsetX1 + sliceOffset * 0.3,
            p.y + glitch.offsetY1,
            p.size,
            p.size,
          );
          ctx.fillStyle = "#E0E7FF";
          ctx.fillRect(
            p.x + glitch.offsetX2 + sliceOffset * 0.3,
            p.y + glitch.offsetY2,
            p.size,
            p.size,
          );
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(p.x + sliceOffset, p.y, p.size, p.size);
        });
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(animate);
      }
    }

    animate();

    // — Event listeners —
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Scale mouse coords to canvas resolution
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top) * scaleY;
    };
    const onMouseDown = () => {
      isPressed = true;
    };
    const onMouseUp = () => {
      isPressed = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      const touch = e.touches[0];
      mouse.x = (touch.clientX - rect.left) * scaleX;
      mouse.y = (touch.clientY - rect.top) * scaleY;
    };
    const onTouchStart = (e: TouchEvent) => {
      isPressed = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;
      const touch = e.touches[0];
      mouse.x = (touch.clientX - rect.left) * scaleX;
      mouse.y = (touch.clientY - rect.top) * scaleY;
    };
    const onTouchEnd = () => {
      isPressed = false;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      if (rafId !== undefined) {
        cancelAnimationFrame(rafId);
      }
      if (glitchInterval !== undefined) {
        clearInterval(glitchInterval);
      }
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [contentWidth, contentHeight, padding]);

  return (
    <div className="invert dark:filter-none flex items-center justify-center overflow-hidden inset-0">
      <canvas ref={canvasRef} className="block max-w-full max-h-full" />
    </div>
  );
}
