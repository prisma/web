// A Prisma Postgres connection string, labelled part by part, from the format
// in docs/postgres/database/connecting-to-your-database.mdx.
//
// Same visual language as the serverless and pooling guides' diagrams: tinted
// chips in the prism hues (cyan for the host, red for the secret, yellow for
// names), plain-text labels. On wide screens the string reads on one line with
// labels above and below; on phones each part is a row. Inline SVG so it uses
// the page's Sora and Inter faces; monospace only for the URL itself.

const INK = "#121212";
const MUTED = "#5F6063";
const PUNCT = "#9A9B9E";
const HEADING = "var(--font-sora), Sora, system-ui, sans-serif";
const BODY = "var(--font-inter), Inter, system-ui, sans-serif";
const MONO = 'var(--font-code), ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/** Approximate advance of the monospace face at 1px, for chip widths. */
const MONO_ADVANCE = 0.64;

/** Text alternative for screen readers. */
const CONNSTRING_DIAGRAM_LABEL =
  "An annotated Prisma Postgres connection string: postgres://USER:PASSWORD@pooled.db.prisma.io:5432/postgres?sslmode=require. The scheme postgres:// marks it as PostgreSQL. USER is the database user. PASSWORD follows a colon and must be percent-encoded. The host after the @ is pooled.db.prisma.io, or db.prisma.io for a direct connection. The port is 5432, the database is postgres, and the parameter sslmode=require follows a question mark.";

type Tone = { fill: string; edge: string };

const TONES = {
  // Brand-kit colours: Ink, Paper and the three prism colours.
  neutral: { fill: "#FFFFFF", edge: "#121212" },
  cyan: { fill: "#E6FBFC", edge: "#01D7E4" },
  yellow: { fill: "#FEF6D6", edge: "#F3C306" },
  red: { fill: "#FEEBEE", edge: "#F34A60" },
} satisfies Record<string, Tone>;

type Part = {
  name: string;
  note: string;
  value: string;
  /** The separator printed before this part in the URL. */
  before: string;
  tone: Tone;
};

const PARTS: Part[] = [
  {
    name: "Scheme",
    note: "postgresql:// works too",
    value: "postgres://",
    before: "",
    tone: TONES.neutral,
  },
  { name: "User", note: "The database user", value: "USER", before: "", tone: TONES.yellow },
  { name: "Password", note: "Percent-encode it", value: "PASSWORD", before: ":", tone: TONES.red },
  {
    name: "Host",
    note: "Pooled, or db.prisma.io",
    value: "pooled.db.prisma.io",
    before: "@",
    tone: TONES.cyan,
  },
  { name: "Port", note: "PostgreSQL default", value: "5432", before: ":", tone: TONES.neutral },
  {
    name: "Database",
    note: "The database name",
    value: "postgres",
    before: "/",
    tone: TONES.yellow,
  },
  {
    name: "Parameters",
    note: "After ?, joined with &",
    value: "sslmode=require",
    before: "?",
    tone: TONES.neutral,
  },
];

/** Desktop and tablet: the URL on one line, labels alternating above and below. */
function WideDiagram() {
  const W = 720;
  const size = 11.5;
  const pad = 8;
  const sepW = 12;
  const chipH = 30;
  const chipY = 78;
  const H = 172;

  const widths = PARTS.map((p) => p.value.length * size * MONO_ADVANCE + pad * 2);
  const total = widths.reduce((sum, w) => sum + w, 0) + PARTS.filter((p) => p.before).length * sepW;
  let cursor = (W - total) / 2;
  const placed = PARTS.map((part, i) => {
    if (part.before) cursor += sepW;
    const x = cursor;
    cursor += widths[i];
    return { part, x, w: widths[i], up: i % 2 === 0 };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="connstring-diagram-title connstring-diagram-desc"
      className="hidden h-auto w-full sm:block"
    >
      <title id="connstring-diagram-title">The parts of a Postgres connection string</title>
      <desc id="connstring-diagram-desc">{CONNSTRING_DIAGRAM_LABEL}</desc>

      {placed.map(({ part, x, w, up }, i) => {
        const cx = x + w / 2;
        const anchor = i === 0 ? "start" : i === placed.length - 1 ? "end" : "middle";
        const labelX = anchor === "start" ? x : anchor === "end" ? x + w : cx;
        const nameY = up ? 36 : chipY + chipH + 36;
        const leaderTop = up ? 60 : chipY + chipH;
        const leaderBottom = up ? chipY : chipY + chipH + 14;
        return (
          <g key={part.name}>
            {part.before ? (
              <text
                x={x - sepW / 2}
                y={chipY + chipH / 2 + 5}
                textAnchor="middle"
                fill={PUNCT}
                fontFamily={MONO}
                fontSize={size + 1}
                fontWeight={600}
              >
                {part.before}
              </text>
            ) : null}
            <line
              x1={cx}
              x2={cx}
              y1={leaderTop}
              y2={leaderBottom}
              stroke={part.tone.edge}
              strokeWidth={1.25}
            />
            <rect
              x={x}
              y={chipY}
              width={w}
              height={chipH}
              rx={8}
              fill={part.tone.fill}
              stroke={part.tone.edge}
              strokeWidth={1.25}
            />
            <text
              x={cx}
              y={chipY + chipH / 2 + 4.5}
              textAnchor="middle"
              fill={INK}
              fontFamily={MONO}
              fontSize={size}
              fontWeight={600}
            >
              {part.value}
            </text>
            <text
              x={labelX}
              y={nameY}
              textAnchor={anchor}
              fill={INK}
              fontFamily={HEADING}
              fontSize={13}
              fontWeight={600}
            >
              {part.name}
            </text>
            <text
              x={labelX}
              y={nameY + 17}
              textAnchor={anchor}
              fill={MUTED}
              fontFamily={BODY}
              fontSize={11.5}
            >
              {part.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Phones: one row per part, read top to bottom it spells the URL. */
function NarrowDiagram() {
  const W = 360;
  const size = 12;
  const rowH = 46;
  const top = 8;
  const chipH = 28;
  const textX = 206;
  const H = top + PARTS.length * rowH + 4;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="connstring-diagram-title-sm connstring-diagram-desc-sm"
      className="block h-auto w-full sm:hidden"
    >
      <title id="connstring-diagram-title-sm">The parts of a Postgres connection string</title>
      <desc id="connstring-diagram-desc-sm">{CONNSTRING_DIAGRAM_LABEL}</desc>

      {PARTS.map((part, i) => {
        const y = top + i * rowH;
        const value = `${part.before}${part.value}`;
        const w = value.length * size * MONO_ADVANCE + 18;
        const cy = y + rowH / 2;
        return (
          <g key={part.name}>
            {i > 0 ? <line x1={16} x2={W - 16} y1={y} y2={y} stroke="#F0F1F2" /> : null}
            <rect
              x={16}
              y={cy - chipH / 2}
              width={w}
              height={chipH}
              rx={8}
              fill={part.tone.fill}
              stroke={part.tone.edge}
              strokeWidth={1.25}
            />
            <text x={25} y={cy + 4} fill={INK} fontFamily={MONO} fontSize={size} fontWeight={600}>
              {value}
            </text>
            <text
              x={textX}
              y={cy - 3}
              fill={INK}
              fontFamily={HEADING}
              fontSize={13}
              fontWeight={600}
            >
              {part.name}
            </text>
            <text x={textX} y={cy + 13} fill={MUTED} fontFamily={BODY} fontSize={11.5}>
              {part.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** The parts of a Prisma Postgres connection string, labelled. */
export function ConnectionStringDiagram() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-[#E5E5E4] bg-white">
      <div className="px-3 pt-5 pb-3 sm:px-6 sm:pt-6">
        <WideDiagram />
        <NarrowDiagram />
      </div>
      <figcaption className="border-t border-[#E5E5E4] px-5 py-3.5 text-sm leading-relaxed text-muted-foreground">
        A pooled Prisma Postgres connection string. The direct string is the same with the host{" "}
        <code className="font-mono text-[0.9em] text-foreground">db.prisma.io</code>.
      </figcaption>
    </figure>
  );
}
