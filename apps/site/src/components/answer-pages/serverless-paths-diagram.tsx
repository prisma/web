// Architecture of how serverless functions, edge runtimes and admin tools reach
// Prisma Postgres, as docs/postgres/database/connection-pooling.mdx ("Application
// → Connection Proxy → PgBouncer → Database") and serverless-driver.mdx describe
// it. Brand-kit colours only: Ink #121212, Paper, and the three prism colours,
// one per path. Inline SVG so it uses the page's Sora and Inter faces;
// monospace only for hostnames and package names, which are code.

const INK = "#121212";
const MUTED = "#5F6063";
const CYAN = "#01D7E4";
const YELLOW = "#F3C306";
const RED = "#F34A60";
const HEADING = "var(--font-sora), Sora, system-ui, sans-serif";
const BODY = "var(--font-inter), Inter, system-ui, sans-serif";
const MONO = 'var(--font-code), ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/** Text alternative, also used for the guide's Markdown rendition. */
export const SERVERLESS_PATHS_DIAGRAM_TEXT =
  "How apps reach Prisma Postgres. Serverless functions and Prisma Compute apps connect over TCP to the pooled host, pooled.db.prisma.io, where PgBouncer in transaction mode shares a few database connections. Edge runtimes use the serverless driver over HTTP and WebSockets. Migrations, Prisma Studio and pg_dump use the direct host, db.prisma.io. All three paths reach one PostgreSQL database in the region you chose.";

function Markers({ id }: { id: string }) {
  return (
    <defs>
      {[
        ["cyan", CYAN],
        ["yellow", YELLOW],
        ["red", RED],
      ].map(([name, color]) => (
        <marker
          key={name}
          id={`${id}-${name}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      ))}
    </defs>
  );
}

function Zone({
  x,
  y,
  w,
  h,
  title,
  note,
  dashed,
  labelAtBottom = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  note?: string;
  dashed: boolean;
  /** Put the label along the bottom edge, clear of arrows entering from the top. */
  labelAtBottom?: boolean;
}) {
  const labelY = labelAtBottom ? y + h - 14 : y + 26;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill={dashed ? "#FFFFFF" : "#F7F8F8"}
        stroke={dashed ? "#BDBDBD" : INK}
        strokeWidth={dashed ? 1.25 : 1.5}
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <text x={x + 16} y={labelY} fill={INK} fontFamily={HEADING} fontSize={13} fontWeight={600}>
        {title}
      </text>
      {note ? (
        <text
          x={x + w - 16}
          y={labelY}
          textAnchor="end"
          fill={MUTED}
          fontFamily={BODY}
          fontSize={11.5}
        >
          {note}
        </text>
      ) : null}
    </g>
  );
}

function Component({
  x,
  y,
  w,
  h,
  title,
  sub,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  color?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={1.25}
      />
      {color ? <rect x={x + 12} y={y + 15} width={8} height={8} rx={2} fill={color} /> : null}
      <text
        x={x + (color ? 27 : 12)}
        y={y + 23}
        fill={INK}
        fontFamily={HEADING}
        fontSize={13}
        fontWeight={600}
      >
        {title}
      </text>
      <text x={x + 12} y={y + 41} fill={MUTED} fontFamily={BODY} fontSize={11.5}>
        {sub}
      </text>
    </g>
  );
}

function Database({
  cx,
  top,
  rx,
  height,
}: {
  cx: number;
  top: number;
  rx: number;
  height: number;
}) {
  const ry = 10;
  const bottom = top + height;
  return (
    <g>
      <path
        d={`M${cx - rx},${top} V${bottom} A${rx},${ry} 0 0 0 ${cx + rx},${bottom} V${top}`}
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={1.5}
      />
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
      <text
        x={cx}
        y={top + height / 2 + 12}
        textAnchor="middle"
        fill={INK}
        fontFamily={HEADING}
        fontSize={13}
        fontWeight={600}
      >
        PostgreSQL
      </text>
    </g>
  );
}

/** A label pair on a connector: code on top, protocol under it. */
function EdgeLabel({
  x,
  y,
  code,
  protocol,
}: {
  x: number;
  y: number;
  code: string;
  protocol: string;
}) {
  return (
    <g>
      <text x={x} y={y - 8} textAnchor="middle" fill={INK} fontFamily={MONO} fontSize={11}>
        {code}
      </text>
      <text x={x} y={y + 16} textAnchor="middle" fill={MUTED} fontFamily={BODY} fontSize={11}>
        {protocol}
      </text>
    </g>
  );
}

/** Desktop and tablet. */
function WideDiagram() {
  const W = 720;
  const H = 318;
  const id = "sp";
  const appX = 16;
  const appW = 172;
  const pgX = 344;
  const pgW = W - pgX - 16;
  const rows = [98, 182, 266];
  const boxW = 140;
  const boxH = 52;
  const boxX = appX + 16;
  const boxRight = boxX + boxW;
  const proxyX = pgX + 16;
  const bouncerX = proxyX + 118;
  const db = { cx: 646, rx: 46, top: 146, height: 100 };
  const dbLeft = db.cx - db.rx;
  const gapMid = (boxRight + pgX) / 2 + 8;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="serverless-paths-title serverless-paths-desc"
      className="hidden h-auto w-full sm:block"
    >
      <title id="serverless-paths-title">How apps reach Prisma Postgres</title>
      <desc id="serverless-paths-desc">{SERVERLESS_PATHS_DIAGRAM_TEXT}</desc>
      <Markers id={id} />

      <Zone x={appX} y={16} w={appW} h={H - 32} title="Your app" dashed />
      <Zone
        x={pgX}
        y={16}
        w={pgW}
        h={H - 32}
        title="Prisma Postgres"
        note="One region"
        dashed={false}
      />

      {/* Pooled path: app → pooled host → proxy → PgBouncer → PostgreSQL */}
      <path
        d={`M${boxRight},${rows[0]} H${proxyX - 2}`}
        stroke={CYAN}
        strokeWidth={2}
        markerEnd={`url(#${id}-cyan)`}
      />
      <path
        d={`M${proxyX + 102},${rows[0]} H${bouncerX - 2}`}
        stroke={CYAN}
        strokeWidth={2}
        markerEnd={`url(#${id}-cyan)`}
      />
      <path
        d={`M${bouncerX + 58},${rows[0] + boxH / 2} V${db.top + 6} Q${bouncerX + 58},${db.top + 18} ${bouncerX + 70},${db.top + 18} H${dbLeft - 2}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={2}
        markerEnd={`url(#${id}-cyan)`}
      />
      <EdgeLabel x={gapMid} y={rows[0]} code="pooled.db.prisma.io" protocol="TCP 5432" />

      {/* Serverless driver */}
      <path
        d={`M${boxRight},${rows[1]} H${dbLeft - 2}`}
        stroke={YELLOW}
        strokeWidth={2}
        markerEnd={`url(#${id}-yellow)`}
      />
      <EdgeLabel x={gapMid} y={rows[1]} code="@prisma/ppg" protocol="HTTPS, WebSocket" />

      {/* Direct path */}
      <path
        d={`M${boxRight},${rows[2]} H${dbLeft - 60} C${dbLeft - 20},${rows[2]} ${dbLeft - 24},${db.top + db.height - 22} ${dbLeft - 2},${db.top + db.height - 22}`}
        fill="none"
        stroke={RED}
        strokeWidth={2}
        markerEnd={`url(#${id}-red)`}
      />
      <EdgeLabel x={gapMid} y={rows[2]} code="db.prisma.io" protocol="TCP 5432, direct" />

      <Component
        x={boxX}
        y={rows[0] - boxH / 2}
        w={boxW}
        h={boxH}
        title="Functions"
        sub="Node.js, Bun"
        color={CYAN}
      />
      <Component
        x={boxX}
        y={rows[1] - boxH / 2}
        w={boxW}
        h={boxH}
        title="Edge runtime"
        sub="No TCP"
        color={YELLOW}
      />
      <Component
        x={boxX}
        y={rows[2] - boxH / 2}
        w={boxW}
        h={boxH}
        title="Admin tools"
        sub="Migrations, pg_dump"
        color={RED}
      />

      <Component
        x={proxyX}
        y={rows[0] - boxH / 2}
        w={102}
        h={boxH}
        title="Proxy"
        sub="Connections"
      />
      <Component
        x={bouncerX}
        y={rows[0] - boxH / 2}
        w={116}
        h={boxH}
        title="PgBouncer"
        sub="Transaction mode"
      />

      <Database {...db} />
    </svg>
  );
}

/** Phones: the same architecture top to bottom. */
function NarrowDiagram() {
  const W = 360;
  const id = "sp-sm";
  const cols = [64, 180, 296];
  const boxW = 100;
  const boxH = 50;
  const appTop = 12;
  const appBoxY = appTop + 38;
  const pgTop = 196;
  const proxyY = pgTop + 20;
  const bouncerY = proxyY + 74;
  const db = { cx: 180, rx: 150, top: bouncerY + boxH + 46, height: 62 };
  const H = db.top + db.height + 10 + 44;
  const lanes = [
    { title: "Functions", sub: "Node.js, Bun", color: CYAN, marker: "cyan", label: "pooled host" },
    { title: "Edge", sub: "@prisma/ppg", color: YELLOW, marker: "yellow", label: "HTTPS" },
    { title: "Admin", sub: "Migrations", color: RED, marker: "red", label: "direct host" },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="serverless-paths-title-sm serverless-paths-desc-sm"
      className="block h-auto w-full sm:hidden"
    >
      <title id="serverless-paths-title-sm">How apps reach Prisma Postgres</title>
      <desc id="serverless-paths-desc-sm">{SERVERLESS_PATHS_DIAGRAM_TEXT}</desc>
      <Markers id={id} />

      <Zone x={6} y={appTop} w={W - 12} h={appBoxY + boxH + 14 - appTop} title="Your app" dashed />
      <Zone
        x={6}
        y={pgTop}
        w={W - 12}
        h={H - pgTop - 6}
        title="Prisma Postgres"
        note="One region"
        dashed={false}
        labelAtBottom
      />

      {lanes.map((lane, i) => {
        const cx = cols[i];
        const start = appBoxY + boxH;
        const end = i === 0 ? proxyY - 2 : db.top - 12;
        return (
          <g key={lane.title}>
            <path
              d={`M${cx},${start} V${end}`}
              stroke={lane.color}
              strokeWidth={2}
              markerEnd={`url(#${id}-${lane.marker})`}
            />
            <text x={cx + 6} y={start + 32} fill={MUTED} fontFamily={BODY} fontSize={11}>
              {lane.label}
            </text>
          </g>
        );
      })}
      <path
        d={`M${cols[0]},${proxyY + boxH} V${bouncerY - 2}`}
        stroke={CYAN}
        strokeWidth={2}
        markerEnd={`url(#${id}-cyan)`}
      />
      <path
        d={`M${cols[0]},${bouncerY + boxH} V${db.top - 12}`}
        stroke={CYAN}
        strokeWidth={2}
        markerEnd={`url(#${id}-cyan)`}
      />

      {lanes.map((lane, i) => (
        <Component
          key={lane.title}
          x={cols[i] - boxW / 2}
          y={appBoxY}
          w={boxW}
          h={boxH}
          title={lane.title}
          sub={lane.sub}
          color={lane.color}
        />
      ))}
      <Component
        x={cols[0] - boxW / 2}
        y={proxyY}
        w={boxW}
        h={boxH}
        title="Proxy"
        sub="Connection"
      />
      <Component
        x={cols[0] - boxW / 2}
        y={bouncerY}
        w={boxW}
        h={boxH}
        title="PgBouncer"
        sub="Transaction"
      />

      <Database {...db} />
    </svg>
  );
}

/** How serverless functions, edge runtimes and admin tools reach Prisma Postgres. */
export function ServerlessPathsDiagram() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-[#E5E5E4] bg-white">
      <div className="p-2 sm:p-4">
        <WideDiagram />
        <NarrowDiagram />
      </div>
      <figcaption className="border-t border-[#E5E5E4] px-5 py-3.5 text-sm leading-relaxed text-muted-foreground">
        App traffic uses the pooled host,{" "}
        <code className="font-mono text-[0.9em] text-foreground">pooled.db.prisma.io</code>. Edge
        runtimes use the serverless driver. Admin tools use the direct host,{" "}
        <code className="font-mono text-[0.9em] text-foreground">db.prisma.io</code>.
      </figcaption>
    </figure>
  );
}
