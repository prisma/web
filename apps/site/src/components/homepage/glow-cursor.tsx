import { useRef, useCallback } from "react";

interface GlowCursorProps {
  /** Size of the glow circle in px */
  size?: number;
  /** Glow color (any valid CSS color) */
  color?: string;
  /** Blur spread in px */
  blur?: number;
}

interface GlowCursorProps {
  size?: number;
  color?: string;
  blur?: number;
  /** Your icons/content — rendered above the glow */
  children?: React.ReactNode;
}

export default function GlowCursor({
  size = 200,
  color = "rgba(120, 80, 255, 0.35)",
  blur = 60,
  children,
}: GlowCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const glow = glowRef.current;
      const container = containerRef.current;
      if (!glow || !container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      glow.style.opacity = "1";
    },
    [size],
  );

  const onMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative"
    >
      {/* Layer 1 — glow sits at the bottom */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0, // behind everything
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          filter: `blur(${blur}px)`,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.3s ease",
          willChange: "transform",
        }}
      />

      {/* Layer 2 — icons/content sits on top, fully interactive */}
      <div className="relative z-1 w-full h-full">{children}</div>
    </div>
  );
}
