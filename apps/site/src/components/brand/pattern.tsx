"use client";

import { useEffect, useRef } from "react";

const PATTERN = "/brand/pattern.svg";
const RADIUS = 120; // cursor influence radius (viewBox units)
const STRENGTH = 17; // max cube push
const EASE = 0.15; // displacement smoothing

const TILE_W = 446;
const TILE_H = 217;

// Inline the isometric-cube pattern and make the cubes bulge away from the
// cursor (with a soft glow trailing it) — the cube grid reacts on hover.
// Ported from the approved stylescape.
// Default: one tile cover-cropped to the container. With `scale`, the tile
// repeats at that fixed scale until it covers the container instead.
export function Pattern({ className = "", scale }: { className?: string; scale?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const host = hostRef.current;
    const glow = glowRef.current;
    if (!container || !host) return;
    let cancelled = false;
    let raf = 0;
    let removeMove = () => {};

    fetch(PATTERN)
      .then((r) => r.text())
      .then((svg) => {
        if (cancelled || !host) return;
        if (scale) {
          const rect = container.getBoundingClientRect();
          const cols = Math.max(1, Math.ceil(rect.width / (TILE_W * scale)));
          const rows = Math.max(1, Math.ceil(rect.height / (TILE_H * scale)));
          const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
          const tiles: string[] = [];
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              tiles.push(
                `<g data-ox="${c * TILE_W}" data-oy="${r * TILE_H}" transform="translate(${c * TILE_W} ${r * TILE_H})">${inner}</g>`,
              );
            }
          }
          host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_W * cols} ${TILE_H * rows}" width="${TILE_W * cols * scale}" height="${TILE_H * rows * scale}" style="display:block">${tiles.join("")}</svg>`;
        } else {
          host.innerHTML = svg;
        }
        const svgEl = host.querySelector("svg") as SVGSVGElement | null;
        if (!svgEl) return;
        if (!scale) {
          svgEl.setAttribute("viewBox", "0 12 446 176");
          svgEl.setAttribute("preserveAspectRatio", "xMidYMid slice");
          svgEl.setAttribute("width", "100%");
          svgEl.setAttribute("height", "100%");
          svgEl.style.display = "block";
        }

        const paths = Array.from(host.querySelectorAll("path")) as SVGGraphicsElement[];
        const n = paths.length;
        const cx = new Float32Array(n);
        const cy = new Float32Array(n);
        const dx = new Float32Array(n);
        const dy = new Float32Array(n);
        paths.forEach((p, i) => {
          const b = p.getBBox();
          const tile = p.closest("g[data-ox]");
          const ox = tile ? Number(tile.getAttribute("data-ox")) : 0;
          const oy = tile ? Number(tile.getAttribute("data-oy")) : 0;
          cx[i] = b.x + b.width / 2 + ox;
          cy[i] = b.y + b.height / 2 + oy;
          p.style.transformBox = "fill-box";
          p.style.transformOrigin = "center";
        });

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const mouse = { x: -9999, y: -9999 };

        const onMove = (e: MouseEvent) => {
          const m = svgEl.getScreenCTM();
          if (!m) return;
          const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
          mouse.x = pt.x;
          mouse.y = pt.y;

          const rect = container.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          if (glow) {
            glow.style.opacity = inside ? "1" : "0";
            if (inside) {
              glow.style.left = `${((e.clientX - rect.left) / rect.width) * 100}%`;
              glow.style.top = `${((e.clientY - rect.top) / rect.height) * 100}%`;
            }
          }
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        removeMove = () => window.removeEventListener("mousemove", onMove);

        const r2 = RADIUS * RADIUS;
        const tick = () => {
          for (let i = 0; i < n; i++) {
            const vx = cx[i] - mouse.x;
            const vy = cy[i] - mouse.y;
            const d2 = vx * vx + vy * vy;
            let tx = 0;
            let ty = 0;
            if (d2 < r2) {
              const dist = Math.sqrt(d2) || 0.0001;
              const f = 1 - dist / RADIUS;
              const push = f * f * STRENGTH;
              tx = (vx / dist) * push;
              ty = (vy / dist) * push;
            }
            const ndx = dx[i] + (tx - dx[i]) * EASE;
            const ndy = dy[i] + (ty - dy[i]) * EASE;
            const moved = Math.abs(ndx - dx[i]) > 0.01 || Math.abs(ndy - dy[i]) > 0.01;
            dx[i] = ndx;
            dy[i] = ndy;
            if (moved) {
              paths[i].style.transform =
                Math.abs(ndx) < 0.02 && Math.abs(ndy) < 0.02
                  ? ""
                  : `translate(${ndx.toFixed(2)}px, ${ndy.toFixed(2)}px)`;
            }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      removeMove();
    };
  }, [scale]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-card ${className}`}>
      <div ref={hostRef} className="absolute inset-0" />
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: "transparent",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
