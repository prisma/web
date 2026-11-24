import { CONNSTRING_DIAGRAM_LABEL, CONNSTRING_PARTS } from "./_content";

// A Prisma Postgres connection string, labelled part by part, from the
// format in docs/postgres/database/connecting-to-your-database.mdx.
//
// Inline SVG so it uses the page's Sora and Inter faces. Brand values: light
// ground, #3A3B3C ink, Prism Cyan #01D7E4 on the chips. Wide layout from md
// up, narrow for phones.

const INK = "#3A3B3C";
const MUTED = "#6B6C6D";
const CYAN = "#01D7E4";
const CYAN_TINT = "#E6FBFC";
const HEADING = "var(--font-sora), Sora, system-ui, sans-serif";
const BODY = "var(--font-inter), Inter, system-ui, sans-serif";
const MONO = 'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace';

// Approximate advance of the monospace face at 1px, for chip widths.
const MONO_ADVANCE = 0.61;

function StringBox({
  x,
  y,
  w,
  lines,
  size,
}: {
  x: number;
  y: number;
  w: number;
  lines: string[];
  size: number;
}) {
  const lineH = size + 9;
  const h = lines.length * lineH + 22;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#FFFFFF" stroke={CYAN} strokeWidth={2} />
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + 14}
          y={y + 14 + size + i * lineH}
          fill={INK}
          fontFamily={MONO}
          fontSize={size}
          fontWeight={600}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function PartRow({
  x,
  y,
  part,
  value,
  note,
  chipSize,
  labelX,
  stacked,
}: {
  x: number;
  y: number;
  part: string;
  value: string;
  note: string;
  chipSize: number;
  labelX: number;
  stacked: boolean;
}) {
  const chipW = value.length * chipSize * MONO_ADVANCE + 16;
  const chipH = chipSize + 12;
  const labelY = stacked ? y + chipH + 18 : y + 14;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={chipW}
        height={chipH}
        rx={6}
        fill={CYAN_TINT}
        stroke={CYAN}
        strokeWidth={1}
      />
      <text x={x + 8} y={y + chipSize + 4} fill={INK} fontFamily={MONO} fontSize={chipSize}>
        {value}
      </text>
      <text
        x={stacked ? x : labelX}
        y={labelY}
        fill={INK}
        fontFamily={HEADING}
        fontSize={14}
        fontWeight={600}
      >
        {part}
      </text>
      <text
        x={stacked ? x + 100 : labelX}
        y={stacked ? labelY : labelY + 19}
        fill={MUTED}
        fontFamily={BODY}
        fontSize={stacked ? 12 : 12.5}
      >
        {note}
      </text>
    </g>
  );
}

function Diagram({ narrow }: { narrow: boolean }) {
  const W = narrow ? 360 : 600;
  const pad = narrow ? 12 : 24;
  const lines = narrow
    ? ["postgres://USER:PASSWORD", "@pooled.db.prisma.io:5432", "/postgres?sslmode=require"]
    : ["postgres://USER:PASSWORD@pooled.db.prisma.io", ":5432/postgres?sslmode=require"];
  const boxSize = narrow ? 13 : 15;
  const boxY = narrow ? 50 : 60;
  const boxH = lines.length * (boxSize + 9) + 22;
  const rowsTop = boxY + boxH + 24;
  const rowH = narrow ? 58 : 46;
  const H = rowsTop + CONNSTRING_PARTS.length * rowH + 12;
  const suffix = narrow ? "-sm" : "";
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby={`connstring-diagram-title${suffix} connstring-diagram-desc${suffix}`}
      className={narrow ? "block h-auto w-full md:hidden" : "hidden h-auto w-full md:block"}
    >
      <title id={`connstring-diagram-title${suffix}`}>
        The parts of a Postgres connection string
      </title>
      <desc id={`connstring-diagram-desc${suffix}`}>{CONNSTRING_DIAGRAM_LABEL}</desc>
      <rect width={W} height={H} rx={20} fill="#FAFAFA" />
      <text
        x={pad}
        y={narrow ? 32 : 38}
        fill={INK}
        fontFamily={HEADING}
        fontSize={narrow ? 16 : 18}
        fontWeight={600}
      >
        The parts of a connection string
      </text>
      <StringBox x={pad} y={boxY} w={W - 2 * pad} lines={lines} size={boxSize} />
      {CONNSTRING_PARTS.map((p, i) => (
        <PartRow
          key={p.part}
          x={pad}
          y={rowsTop + i * rowH}
          part={p.part}
          value={p.value}
          note={p.note}
          chipSize={narrow ? 12 : 13}
          labelX={pad + 230}
          stacked={narrow}
        />
      ))}
    </svg>
  );
}

export function ConnectionStringDiagram() {
  return (
    <figure className="m-0 overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-[#FAFAFA]">
      <Diagram narrow={false} />
      <Diagram narrow />
    </figure>
  );
}
