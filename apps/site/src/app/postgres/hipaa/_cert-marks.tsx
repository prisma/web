import { cn } from "@/lib/utils";

// Grey monochrome certification marks for the HIPAA hero compliance card.
// Visual language matches Martin's official HIPAA COMPLIANT mark and the
// SOC 2 / ISO 27001 / GDPR style refs (caduceus, shield, globe, EU stars).
// Store PNG uploads were ~46px thumbnails; these SVGs redraw that artwork
// at crisp resolution in the same grey-on-dark palette. Source PNGs live
// under /public/postgres/hipaa/certs/ for provenance.

// Mid grey that reads on the light card surface (assets were grey-on-dark;
// darkened slightly so the marks stay elegant without a charcoal plaque).
const MARK_GREY = "#6E6E6E";

type MarkProps = {
  className?: string;
};

export function HipaaCompliantMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 148 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-auto", className)}
      aria-hidden
    >
      {/* Caduceus — winged staff with twin serpents */}
      <g stroke={MARK_GREY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M18 8.5 C14 6.5 10.5 7.5 9 10.5 C10.5 9 14 9.2 16.5 11" />
        <path d="M18 8.5 C22 6.5 25.5 7.5 27 10.5 C25.5 9 22 9.2 19.5 11" />
        <path d="M18 7.5 V36" />
        <path d="M18 12 C12.5 14.5 12.5 20 18 22.5 C23.5 25 23.5 30.5 18 33" />
        <path d="M18 12 C23.5 14.5 23.5 20 18 22.5 C12.5 25 12.5 30.5 18 33" />
        <circle cx="18" cy="6.2" r="1.5" fill={MARK_GREY} stroke="none" />
      </g>
      <text
        x="38"
        y="20"
        fill={MARK_GREY}
        fontSize="16"
        fontWeight="700"
        letterSpacing="0.08em"
        style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
      >
        HIPAA
      </text>
      <text
        x="38"
        y="34"
        fill={MARK_GREY}
        fontSize="9"
        fontWeight="600"
        letterSpacing="0.22em"
        style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
      >
        COMPLIANT
      </text>
    </svg>
  );
}

export function Soc2TypeIiMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 92 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-auto", className)}
      aria-hidden
    >
      <path
        d="M12 6.5 L20 4 L28 6.5 V16.5 C28 22.2 24.4 27.2 20 29.5 C15.6 27.2 12 22.2 12 16.5 V6.5 Z"
        stroke={MARK_GREY}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16.2 16.2 L18.8 18.8 L24.2 13.2"
        stroke={MARK_GREY}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="36"
        y="14"
        fill={MARK_GREY}
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.06em"
        style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
      >
        SOC 2
      </text>
      <text
        x="36"
        y="25"
        fill={MARK_GREY}
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="0.1em"
        style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
      >
        TYPE II
      </text>
      <text
        x="36"
        y="35"
        fill={MARK_GREY}
        fontSize="6.5"
        fontWeight="600"
        letterSpacing="0.14em"
        style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
      >
        CERTIFIED
      </text>
    </svg>
  );
}

export function Iso27001Mark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 118 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-auto", className)}
      aria-hidden
    >
      {/* ISO-style globe mark */}
      <circle cx="16" cy="22" r="10" stroke={MARK_GREY} strokeWidth="1.4" />
      <ellipse cx="16" cy="22" rx="4.5" ry="10" stroke={MARK_GREY} strokeWidth="1.2" />
      <path d="M6.5 22 H25.5" stroke={MARK_GREY} strokeWidth="1.2" />
      <path d="M7.8 16.5 H24.2" stroke={MARK_GREY} strokeWidth="1" />
      <path d="M7.8 27.5 H24.2" stroke={MARK_GREY} strokeWidth="1" />
      <text
        x="34"
        y="26"
        fill={MARK_GREY}
        fontSize="12"
        fontWeight="700"
        letterSpacing="0.04em"
        style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
      >
        ISO 27001
      </text>
    </svg>
  );
}

export function GdprMark({ className }: MarkProps) {
  // Twelve EU-style stars around GDPR — matches the style ref.
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = ((i * 30 - 90) * Math.PI) / 180;
    const cx = 22 + Math.cos(angle) * 16;
    const cy = 22 + Math.sin(angle) * 16;
    return { cx, cy, key: i };
  });

  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-auto", className)}
      aria-hidden
    >
      {stars.map(({ cx, cy, key }) => (
        <path
          key={key}
          d={starPath(cx, cy, 2.1)}
          fill={MARK_GREY}
        />
      ))}
      <text
        x="22"
        y="25.5"
        textAnchor="middle"
        fill={MARK_GREY}
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.06em"
        style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
      >
        GDPR
      </text>
    </svg>
  );
}

function starPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = ((i * 72 - 90) * Math.PI) / 180;
    const b = (((i * 72 + 36) - 90) * Math.PI) / 180;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(b) * (r * 0.4);
    const y2 = cy + Math.sin(b) * (r * 0.4);
    pts.push(`${i === 0 ? "M" : "L"}${x1.toFixed(2)} ${y1.toFixed(2)}`);
    pts.push(`L${x2.toFixed(2)} ${y2.toFixed(2)}`);
  }
  return `${pts.join(" ")} Z`;
}

// Official mark PNGs (provenance from Martin's upload). Prefer the SVG marks
// above for sharpness; keep paths exported for any future raster swap.
export const CERT_MARK_ASSETS = {
  hipaa: "/postgres/hipaa/certs/hipaa-compliant.png",
  soc2: "/postgres/hipaa/certs/soc2-type-ii.png",
  iso: "/postgres/hipaa/certs/iso-27001.png",
  gdpr: "/postgres/hipaa/certs/gdpr.png",
} as const;
