import { SERVERLESS_DIAGRAM_LABEL } from "./_content";

// How apps reach Prisma Postgres: the pooled host, the serverless driver and
// the direct host, as the docs describe them (postgres/database/
// connection-pooling.mdx and serverless-driver.mdx). Inline SVG so it uses the
// page's Sora and Inter faces. Brand values: light ground, #3A3B3C ink, Prism
// Cyan #01D7E4 for the pooled path. Two layouts from the same rows: a wide one
// from md up and a stacked one for phones, so text never drops below ~12px.

const INK = "#3A3B3C";
const MUTED = "#6B6C6D";
const CYAN = "#01D7E4";
const CYAN_TINT = "#E6FBFC";
const LINE = "#D9DADB";
const HEADING = "var(--font-sora), Sora, system-ui, sans-serif";
const BODY = "var(--font-inter), Inter, system-ui, sans-serif";
const MONO = 'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace';

type Row = {
  left: { title: string[]; lines: string[] };
  mid: { title: string; mono: boolean; lines: string[] };
  pooled: boolean;
};

const ROWS: Row[] = [
  {
    left: { title: ["Serverless functions"], lines: ["Node.js and Bun", "Prisma Compute apps"] },
    mid: {
      title: "pooled.db.prisma.io",
      mono: true,
      lines: ["PgBouncer pool", "Transaction mode", "TCP, port 5432"],
    },
    pooled: true,
  },
  {
    left: { title: ["Edge runtimes"], lines: ["No TCP support"] },
    mid: { title: "Serverless driver", mono: false, lines: ["HTTP and WebSockets"] },
    pooled: false,
  },
  {
    left: { title: ["Admin tools"], lines: ["Migrations, Studio", "pg_dump"] },
    mid: { title: "db.prisma.io", mono: true, lines: ["Direct connection", "Session state kept"] },
    pooled: false,
  },
];

function Box({
  x,
  y,
  w,
  h,
  title,
  lines,
  mono = false,
  accent = false,
  titleSize,
  lineSize,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string[];
  lines: string[];
  mono?: boolean;
  accent?: boolean;
  titleSize: number;
  lineSize: number;
}) {
  const pad = 14;
  const titleGap = titleSize + 6;
  const lineGap = lineSize + 7;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={accent ? CYAN_TINT : "#FFFFFF"}
        stroke={accent ? CYAN : LINE}
        strokeWidth={accent ? 2 : 1}
      />
      {title.map((t, i) => (
        <text
          key={t}
          x={x + pad}
          y={y + pad + titleSize + i * titleGap}
          fill={INK}
          fontFamily={mono ? MONO : HEADING}
          fontSize={mono ? titleSize - 1 : titleSize}
          fontWeight={600}
        >
          {t}
        </text>
      ))}
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + pad}
          y={y + pad + titleSize + (title.length - 1) * titleGap + 10 + (i + 1) * lineGap - 6}
          fill={MUTED}
          fontFamily={BODY}
          fontSize={lineSize}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Database({
  x,
  y,
  w,
  h,
  size,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  size: number;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={1.5}
      />
      <g transform={`translate(${cx - 16} ${y + 18})`} aria-hidden>
        <ellipse cx={16} cy={6} rx={16} ry={6} fill={CYAN_TINT} stroke={INK} strokeWidth={1.5} />
        <path
          d="M0 6v22c0 3.3 7.2 6 16 6s16-2.7 16-6V6"
          fill="none"
          stroke={INK}
          strokeWidth={1.5}
        />
        <path d="M0 17c0 3.3 7.2 6 16 6s16-2.7 16-6" fill="none" stroke={INK} strokeWidth={1.5} />
      </g>
      <text
        x={cx}
        y={y + 76}
        textAnchor="middle"
        fill={INK}
        fontFamily={HEADING}
        fontSize={size}
        fontWeight={600}
      >
        Prisma Postgres
      </text>
      <text
        x={cx}
        y={y + 76 + size + 6}
        textAnchor="middle"
        fill={MUTED}
        fontFamily={BODY}
        fontSize={size - 2}
      >
        PostgreSQL 17
      </text>
      <text
        x={cx}
        y={y + 76 + 2 * (size + 6)}
        textAnchor="middle"
        fill={MUTED}
        fontFamily={BODY}
        fontSize={size - 2}
      >
        One region
      </text>
    </g>
  );
}

function Legend({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g>
      <line
        x1={x}
        y1={y - 4}
        x2={x + 22}
        y2={y - 4}
        stroke={CYAN}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <text x={x + 30} y={y} fill={MUTED} fontFamily={BODY} fontSize={size}>
        App traffic shares a few pooled database connections
      </text>
    </g>
  );
}

/** Desktop layout, 600 by 500. */
function WideDiagram() {
  const rowsY = [72, 206, 320];
  const heights = [110, 90, 110];
  const leftX = 24;
  const leftW = 170;
  const midX = 236;
  const midW = 190;
  const dbX = 456;
  const dbW = 124;
  const dbY = 72;
  const dbH = 358;
  return (
    <svg
      viewBox="0 0 600 500"
      width={600}
      height={500}
      role="img"
      aria-labelledby="serverless-diagram-title serverless-diagram-desc"
      className="hidden h-auto w-full md:block"
    >
      <title id="serverless-diagram-title">How apps reach Prisma Postgres</title>
      <desc id="serverless-diagram-desc">{SERVERLESS_DIAGRAM_LABEL}</desc>
      <rect width={600} height={500} rx={20} fill="#FAFAFA" />
      <text x={24} y={44} fill={INK} fontFamily={HEADING} fontSize={18} fontWeight={600}>
        How apps reach Prisma Postgres
      </text>
      {ROWS.map((row, i) => {
        const y = rowsY[i];
        const h = heights[i];
        const cy = y + h / 2;
        const color = row.pooled ? CYAN : LINE;
        const width = row.pooled ? 2.5 : 1.5;
        return (
          <g key={row.mid.title}>
            {row.pooled ? (
              // Many function instances converge on the pooler.
              [-30, -10, 10, 30].map((dy) => (
                <line
                  key={dy}
                  x1={leftX + leftW}
                  y1={cy + dy}
                  x2={midX}
                  y2={cy}
                  stroke={color}
                  strokeWidth={1.5}
                />
              ))
            ) : (
              <line
                x1={leftX + leftW}
                y1={cy}
                x2={midX}
                y2={cy}
                stroke={color}
                strokeWidth={width}
              />
            )}
            {row.pooled ? (
              // ...and leave it as a small number of real connections.
              [-12, 12].map((dy) => (
                <line
                  key={dy}
                  x1={midX + midW}
                  y1={cy + dy}
                  x2={dbX}
                  y2={cy + dy}
                  stroke={color}
                  strokeWidth={width}
                />
              ))
            ) : (
              <line x1={midX + midW} y1={cy} x2={dbX} y2={cy} stroke={color} strokeWidth={width} />
            )}
            <Box
              x={leftX}
              y={y}
              w={leftW}
              h={h}
              title={row.left.title}
              lines={row.left.lines}
              titleSize={15}
              lineSize={13}
            />
            <Box
              x={midX}
              y={y}
              w={midW}
              h={h}
              title={[row.mid.title]}
              lines={row.mid.lines}
              mono={row.mid.mono}
              accent={row.pooled}
              titleSize={15}
              lineSize={13}
            />
          </g>
        );
      })}
      <Database x={dbX} y={dbY} w={dbW} h={dbH} size={13} />
      <Legend x={24} y={472} size={13} />
    </svg>
  );
}

/** Phone layout, 360 by 600: the three paths stacked, the database below. */
function NarrowDiagram() {
  const rowsY = [56, 184, 294];
  const heights = [110, 92, 110];
  const leftX = 12;
  const leftW = 140;
  const midX = 172;
  const midW = 164;
  const busXs = [355, 349, 343];
  const dbY = 436;
  const dbH = 120;
  const narrowTitles = [["Serverless", "functions"], ["Edge", "runtimes"], ["Admin tools"]];
  return (
    <svg
      viewBox="0 0 360 600"
      width={360}
      height={600}
      role="img"
      aria-labelledby="serverless-diagram-title-sm serverless-diagram-desc-sm"
      className="block h-auto w-full md:hidden"
    >
      <title id="serverless-diagram-title-sm">How apps reach Prisma Postgres</title>
      <desc id="serverless-diagram-desc-sm">{SERVERLESS_DIAGRAM_LABEL}</desc>
      <rect width={360} height={600} rx={18} fill="#FAFAFA" />
      <text x={12} y={34} fill={INK} fontFamily={HEADING} fontSize={16} fontWeight={600}>
        How apps reach Prisma Postgres
      </text>
      {ROWS.map((row, i) => {
        const y = rowsY[i];
        const h = heights[i];
        const cy = y + h / 2;
        const color = row.pooled ? CYAN : LINE;
        const width = row.pooled ? 2.5 : 1.5;
        return (
          <g key={row.mid.title}>
            <line x1={leftX + leftW} y1={cy} x2={midX} y2={cy} stroke={color} strokeWidth={width} />
            <polyline
              points={`${midX + midW},${cy} ${busXs[i]},${cy} ${busXs[i]},${dbY + 24 + (2 - i) * 34} ${340},${dbY + 24 + (2 - i) * 34}`}
              fill="none"
              stroke={color}
              strokeWidth={width}
            />
            <Box
              x={leftX}
              y={y}
              w={leftW}
              h={h}
              title={narrowTitles[i]}
              lines={row.left.lines.slice(0, narrowTitles[i].length > 1 ? 1 : 2)}
              titleSize={14}
              lineSize={12}
            />
            <Box
              x={midX}
              y={y}
              w={midW}
              h={h}
              title={[row.mid.title]}
              lines={row.mid.lines}
              mono={row.mid.mono}
              accent={row.pooled}
              titleSize={13}
              lineSize={12}
            />
          </g>
        );
      })}
      <Database x={12} y={dbY} w={328} h={dbH} size={14} />
      <Legend x={12} y={584} size={11.5} />
    </svg>
  );
}

export function ServerlessDiagram() {
  return (
    <figure className="m-0 overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-[#FAFAFA]">
      <WideDiagram />
      <NarrowDiagram />
    </figure>
  );
}
