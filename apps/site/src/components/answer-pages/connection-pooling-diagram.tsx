// Architecture of Prisma Postgres pooling, as docs/postgres/database/
// connection-pooling.mdx describes it: function instances connect to
// pooled.db.prisma.io, where PgBouncer in transaction mode shares a few
// database connections. Counts are illustrative.
//
// Same architecture language as the serverless guide's diagram: a dashed
// "Your app" boundary, a solid Prisma Postgres boundary, ink component boxes,
// labelled edges. Brand-kit colours only: Ink #121212, Paper and Prism Cyan.

const INK = "#121212";
const MUTED = "#5F6063";
const CYAN = "#01D7E4";
const HEADING = "var(--font-sora), Sora, system-ui, sans-serif";
const BODY = "var(--font-inter), Inter, system-ui, sans-serif";
const MONO = 'var(--font-code), ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/** Text alternative for screen readers. */
const POOLING_DIAGRAM_LABEL =
  "Five function instances in your app each open a connection to the pooled host, pooled.db.prisma.io. Inside Prisma Postgres, PgBouncer in transaction mode receives those five client connections and shares two database connections to PostgreSQL between them. The numbers are an illustration.";

const FUNCTIONS = 5;

function Arrowhead({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path d="M0,0 L10,5 L0,10 z" fill={CYAN} />
      </marker>
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

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  small = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  small?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={small ? 6 : 8}
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={1.25}
      />
      {small ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 4}
          textAnchor="middle"
          fill={INK}
          fontFamily={BODY}
          fontSize={12}
        >
          {title}
        </text>
      ) : (
        <>
          <text
            x={x + 12}
            y={y + 24}
            fill={INK}
            fontFamily={HEADING}
            fontSize={13}
            fontWeight={600}
          >
            {title}
          </text>
          {sub ? (
            <text x={x + 12} y={y + 42} fill={MUTED} fontFamily={BODY} fontSize={11.5}>
              {sub}
            </text>
          ) : null}
        </>
      )}
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
        y={top + height / 2 + 6}
        textAnchor="middle"
        fill={INK}
        fontFamily={HEADING}
        fontSize={13}
        fontWeight={600}
      >
        PostgreSQL
      </text>
      <text
        x={cx}
        y={top + height / 2 + 23}
        textAnchor="middle"
        fill={MUTED}
        fontFamily={BODY}
        fontSize={11.5}
      >
        version 17
      </text>
    </g>
  );
}

/** Desktop and tablet: left to right. */
function WideDiagram() {
  const W = 720;
  const H = 296;
  const id = "pool-arrow";
  const appX = 16;
  const appW = 172;
  const pgX = 352;
  const fnX = appX + 16;
  const fnW = 140;
  const fnH = 30;
  const fnGap = 10;
  const fnTop = 62;
  const fnRight = fnX + fnW;
  const centers = Array.from({ length: FUNCTIONS }, (_, i) => fnTop + i * (fnH + fnGap) + fnH / 2);
  const mid = fnTop + (FUNCTIONS * fnH + (FUNCTIONS - 1) * fnGap) / 2;
  const pool = { x: pgX + 24, w: 132, h: 64 };
  const db = { cx: 644, rx: 46, top: mid - 52, height: 100 };
  const dbLeft = db.cx - db.rx;
  const poolRight = pool.x + pool.w;
  const gapMid = (fnRight + pool.x) / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="pooling-diagram-title pooling-diagram-desc"
      className="hidden h-auto w-full sm:block"
    >
      <title id="pooling-diagram-title">How Prisma Postgres pools connections</title>
      <desc id="pooling-diagram-desc">{POOLING_DIAGRAM_LABEL}</desc>
      <Arrowhead id={id} />

      <Zone x={appX} y={16} w={appW} h={H - 32} title="Your app" dashed />
      <Zone
        x={pgX}
        y={16}
        w={W - pgX - 16}
        h={H - 32}
        title="Prisma Postgres"
        note="One region"
        dashed={false}
      />

      {centers.map((cy) => {
        const bend = (pool.x - fnRight) / 2;
        return (
          <path
            key={cy}
            d={`M${fnRight},${cy} C${fnRight + bend},${cy} ${pool.x - bend},${mid} ${pool.x - 2},${mid}`}
            fill="none"
            stroke={CYAN}
            strokeWidth={1.5}
          />
        );
      })}
      <path
        d={`M${pool.x - 12},${mid} H${pool.x - 2}`}
        stroke={CYAN}
        strokeWidth={1.5}
        markerEnd={`url(#${id})`}
      />
      <text x={gapMid} y={fnTop - 8} textAnchor="middle" fill={INK} fontFamily={MONO} fontSize={11}>
        pooled.db.prisma.io
      </text>
      <text
        x={gapMid}
        y={centers[FUNCTIONS - 1] + 34}
        textAnchor="middle"
        fill={MUTED}
        fontFamily={BODY}
        fontSize={11}
      >
        5 client connections
      </text>

      {[mid - 10, mid + 10].map((cy) => (
        <path
          key={cy}
          d={`M${poolRight},${cy} H${dbLeft - 2}`}
          stroke={CYAN}
          strokeWidth={2.5}
          markerEnd={`url(#${id})`}
        />
      ))}
      <text
        x={(poolRight + dbLeft) / 2}
        y={mid - 38}
        textAnchor="middle"
        fill={MUTED}
        fontFamily={BODY}
        fontSize={11}
      >
        2 database
      </text>
      <text
        x={(poolRight + dbLeft) / 2}
        y={mid - 24}
        textAnchor="middle"
        fill={MUTED}
        fontFamily={BODY}
        fontSize={11}
      >
        connections
      </text>

      {centers.map((cy, i) => (
        <Box key={cy} x={fnX} y={cy - fnH / 2} w={fnW} h={fnH} title={`Function ${i + 1}`} small />
      ))}
      <Box
        x={pool.x}
        y={mid - pool.h / 2}
        w={pool.w}
        h={pool.h}
        title="PgBouncer"
        sub="Transaction mode"
      />
      <Database {...db} />
    </svg>
  );
}

/** Phones: top to bottom. */
function NarrowDiagram() {
  const W = 360;
  const id = "pool-arrow-sm";
  const fnW = 58;
  const fnH = 30;
  const fnGap = 8;
  const rowW = FUNCTIONS * fnW + (FUNCTIONS - 1) * fnGap;
  const fnX0 = (W - rowW) / 2;
  const fnY = 50;
  const appH = fnY + fnH + 16 - 12;
  const pgTop = 170;
  const pool = { w: 180, h: 60, y: pgTop + 26 };
  const poolX = (W - pool.w) / 2;
  const db = { cx: W / 2, rx: 120, top: pool.y + pool.h + 52, height: 62 };
  const H = db.top + db.height + 10 + 44;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="pooling-diagram-title-sm pooling-diagram-desc-sm"
      className="block h-auto w-full sm:hidden"
    >
      <title id="pooling-diagram-title-sm">How Prisma Postgres pools connections</title>
      <desc id="pooling-diagram-desc-sm">{POOLING_DIAGRAM_LABEL}</desc>
      <Arrowhead id={id} />

      <Zone x={6} y={12} w={W - 12} h={appH} title="Your app" dashed />
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

      {Array.from({ length: FUNCTIONS }, (_, i) => {
        const cx = fnX0 + i * (fnW + fnGap) + fnW / 2;
        const start = fnY + fnH;
        const end = pool.y;
        const bend = (end - start) / 2;
        return (
          <path
            key={i}
            d={`M${cx},${start} C${cx},${start + bend} ${W / 2},${end - bend} ${W / 2},${end - 2}`}
            fill="none"
            stroke={CYAN}
            strokeWidth={1.5}
          />
        );
      })}
      <text x={W / 2 + 10} y={pgTop - 18} fill={INK} fontFamily={MONO} fontSize={10.5}>
        pooled.db.prisma.io
      </text>

      {[W / 2 - 12, W / 2 + 12].map((cx) => (
        <path
          key={cx}
          d={`M${cx},${pool.y + pool.h} V${db.top - 12}`}
          stroke={CYAN}
          strokeWidth={2.5}
          markerEnd={`url(#${id})`}
        />
      ))}
      <text x={W / 2 + 26} y={pool.y + pool.h + 30} fill={MUTED} fontFamily={BODY} fontSize={11}>
        2 database connections
      </text>

      {Array.from({ length: FUNCTIONS }, (_, i) => (
        <Box
          key={i}
          x={fnX0 + i * (fnW + fnGap)}
          y={fnY}
          w={fnW}
          h={fnH}
          title={`fn ${i + 1}`}
          small
        />
      ))}
      <Box x={poolX} y={pool.y} w={pool.w} h={pool.h} title="PgBouncer" sub="Transaction mode" />
      <Database {...db} />
    </svg>
  );
}

/** How Prisma Postgres pools connections from many function instances. */
export function ConnectionPoolingDiagram() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-[#E5E5E4] bg-white">
      <div className="p-2 sm:p-4">
        <WideDiagram />
        <NarrowDiagram />
      </div>
      <figcaption className="border-t border-[#E5E5E4] px-5 py-3.5 text-sm leading-relaxed text-muted-foreground">
        An illustration: five function instances share two database connections. Your plan sets the
        pooled connection limit.
      </figcaption>
    </figure>
  );
}
