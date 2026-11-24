import { POOLING_DIAGRAM_LABEL } from "./_content";

// Many short-lived function instances with and without a pooler, as
// docs/postgres/database/connection-pooling.mdx describes Prisma Postgres:
// clients connect to pooled.db.prisma.io, where PgBouncer in transaction mode
// shares a few database connections. Counts are illustrative.
//
// Inline SVG so it uses the page's Sora and Inter faces. Brand values: light
// ground, #3A3B3C ink, Prism Cyan #01D7E4 for the pooled path. Two layouts
// from one panel function: wide from md up, narrow for phones.

const INK = "#3A3B3C";
const MUTED = "#6B6C6D";
const CYAN = "#01D7E4";
const CYAN_TINT = "#E6FBFC";
const LINE = "#C9CACB";
const WARN = "#F25C5C";
const HEADING = "var(--font-sora), Sora, system-ui, sans-serif";
const BODY = "var(--font-inter), Inter, system-ui, sans-serif";
const MONO = 'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace';

const FUNCTIONS = 5;

type PanelProps = {
  x: number;
  y: number;
  w: number;
  pooled: boolean;
  narrow: boolean;
};

function Panel({ x, y, w, pooled, narrow }: PanelProps) {
  const title = pooled ? "With Prisma Postgres pooling" : "Without a pooler";
  const fnW = narrow ? 62 : 96;
  const fnH = 24;
  const gap = 8;
  const top = y + 44;
  const fnX = x + 14;
  const dbW = narrow ? 92 : 124;
  const dbH = 112;
  const dbX = x + w - dbW - 14;
  const stackH = FUNCTIONS * fnH + (FUNCTIONS - 1) * gap;
  const dbY = top + (stackH - dbH) / 2;
  const poolW = narrow ? 112 : 168;
  const poolH = 92;
  const poolX = fnX + fnW + (dbX - fnX - fnW - poolW) / 2;
  const poolY = top + (stackH - poolH) / 2;
  const fnRows = Array.from({ length: FUNCTIONS }, (_, i) => top + i * (fnH + gap));
  const dbConnections = pooled ? [dbY + 40, dbY + 72] : fnRows.map((_, i) => dbY + 18 + i * 19);
  const height = stackH + 64;

  return (
    <g>
      <rect x={x} y={y} width={w} height={height} rx={14} fill="#FFFFFF" stroke="#E4E5E6" />
      <text
        x={x + 14}
        y={y + 27}
        fill={INK}
        fontFamily={HEADING}
        fontSize={narrow ? 14 : 15}
        fontWeight={600}
      >
        {title}
      </text>

      {fnRows.map((fy, i) =>
        pooled ? (
          <line
            key={i}
            x1={fnX + fnW}
            y1={fy + fnH / 2}
            x2={poolX}
            y2={poolY + poolH / 2}
            stroke={CYAN}
            strokeWidth={1.5}
          />
        ) : (
          <line
            key={i}
            x1={fnX + fnW}
            y1={fy + fnH / 2}
            x2={dbX}
            y2={dbConnections[i]}
            stroke={LINE}
            strokeWidth={1.5}
          />
        ),
      )}
      {pooled
        ? dbConnections.map((cy) => (
            <line
              key={cy}
              x1={poolX + poolW}
              y1={cy}
              x2={dbX}
              y2={cy}
              stroke={CYAN}
              strokeWidth={2.5}
            />
          ))
        : null}

      {fnRows.map((fy, i) => (
        <g key={fy}>
          <rect x={fnX} y={fy} width={fnW} height={fnH} rx={6} fill="#FAFAFA" stroke="#D9DADB" />
          <text
            x={fnX + fnW / 2}
            y={fy + 16}
            textAnchor="middle"
            fill={INK}
            fontFamily={BODY}
            fontSize={narrow ? 11 : 12}
          >
            {narrow ? `fn ${i + 1}` : `Function ${i + 1}`}
          </text>
        </g>
      ))}

      {pooled ? (
        <g>
          <rect
            x={poolX}
            y={poolY}
            width={poolW}
            height={poolH}
            rx={12}
            fill={CYAN_TINT}
            stroke={CYAN}
            strokeWidth={2}
          />
          <text
            x={poolX + 12}
            y={poolY + 26}
            fill={INK}
            fontFamily={HEADING}
            fontSize={narrow ? 13 : 15}
            fontWeight={600}
          >
            PgBouncer
          </text>
          <text
            x={poolX + 12}
            y={poolY + 48}
            fill={INK}
            fontFamily={MONO}
            fontSize={narrow ? 9.5 : 12}
          >
            pooled.db.prisma.io
          </text>
          <text
            x={poolX + 12}
            y={poolY + 70}
            fill={MUTED}
            fontFamily={BODY}
            fontSize={narrow ? 11 : 12.5}
          >
            Transaction mode
          </text>
        </g>
      ) : null}

      <g>
        <rect
          x={dbX}
          y={dbY}
          width={dbW}
          height={dbH}
          rx={12}
          fill="#FFFFFF"
          stroke={pooled ? INK : WARN}
          strokeWidth={1.5}
        />
        <text
          x={dbX + dbW / 2}
          y={dbY + 34}
          textAnchor="middle"
          fill={INK}
          fontFamily={HEADING}
          fontSize={narrow ? 13 : 14}
          fontWeight={600}
        >
          Postgres
        </text>
        <text
          x={dbX + dbW / 2}
          y={dbY + 62}
          textAnchor="middle"
          fill={pooled ? INK : WARN}
          fontFamily={HEADING}
          fontSize={narrow ? 20 : 22}
          fontWeight={600}
        >
          {pooled ? "2" : "5"}
        </text>
        <text
          x={dbX + dbW / 2}
          y={dbY + 84}
          textAnchor="middle"
          fill={MUTED}
          fontFamily={BODY}
          fontSize={narrow ? 10.5 : 12}
        >
          connections
        </text>
      </g>
    </g>
  );
}

function panelHeight() {
  return FUNCTIONS * 24 + (FUNCTIONS - 1) * 8 + 64;
}

function Diagram({ narrow }: { narrow: boolean }) {
  const W = narrow ? 360 : 600;
  const pad = narrow ? 10 : 20;
  const ph = panelHeight();
  const firstY = narrow ? 50 : 58;
  const secondY = firstY + ph + 16;
  const H = secondY + ph + 44;
  const suffix = narrow ? "-sm" : "";
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`pooling-diagram-title${suffix} pooling-diagram-desc${suffix}`}
      className={narrow ? "block h-auto w-full md:hidden" : "hidden h-auto w-full md:block"}
    >
      <title id={`pooling-diagram-title${suffix}`}>
        Function instances with and without a connection pooler
      </title>
      <desc id={`pooling-diagram-desc${suffix}`}>{POOLING_DIAGRAM_LABEL}</desc>
      <rect width={W} height={H} rx={20} fill="#FAFAFA" />
      <text
        x={pad}
        y={narrow ? 32 : 38}
        fill={INK}
        fontFamily={HEADING}
        fontSize={narrow ? 16 : 18}
        fontWeight={600}
      >
        One connection each, or a shared pool
      </text>
      <Panel x={pad} y={firstY} w={W - 2 * pad} pooled={false} narrow={narrow} />
      <Panel x={pad} y={secondY} w={W - 2 * pad} pooled narrow={narrow} />
      <text x={pad} y={H - 16} fill={MUTED} fontFamily={BODY} fontSize={narrow ? 11 : 12.5}>
        Illustration. Your plan sets how many pooled connections you get.
      </text>
    </svg>
  );
}

export function PoolingDiagram() {
  return (
    <figure className="m-0 overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-[#FAFAFA]">
      <Diagram narrow={false} />
      <Diagram narrow />
    </figure>
  );
}
