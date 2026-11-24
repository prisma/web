// How apps reach Prisma Postgres: an architecture diagram rebuilt from the
// "How apps reach Prisma Postgres" design mockup (1440 px artboard), recomposed
// at the guide's 760 px column so its type stays at the mockup's sizes. Same
// tokens: #E4E4E4 / #EDEDED / #D4D4D4 borders, 12 and 16 px radii, grey
// #CFCFCF connectors with prism-coloured arrowheads and start rings, mono host
// pills, a grey Pooling group and dashed route pills. The mockup's title block
// is left out (the guide's H2 introduces the diagram) and PostgreSQL carries
// no version. Paths follow docs/postgres/database/connection-pooling.mdx and
// serverless-driver.mdx. Logos (PostgreSQL, PgBouncer, Prisma) are the
// mockup's own vector paths.

const INK = "#121212";
const MUTED = "#6B6B6B";
const LINE = "#CFCFCF";
const BOX = "#E4E4E4";
const CYAN = "#01D7E4";
const YELLOW = "#F3C306";
const RED = "#F34A60";
const SANS = "var(--font-inter), Inter, system-ui, sans-serif";
const MONO = 'var(--font-code), "JetBrains Mono", ui-monospace, Menlo, monospace';

/** Text alternative, also used for the guide's Markdown rendition. */
export const SERVERLESS_PATHS_DIAGRAM_TEXT =
  "How apps reach Prisma Postgres. Serverless functions and Prisma Compute apps connect over TCP to the pooled host, pooled.db.prisma.io, where PgBouncer in transaction mode shares a few database connections. Edge runtimes use the serverless driver over HTTP and WebSockets. Migrations, Prisma Studio and pg_dump use the direct host, db.prisma.io. All three paths reach one PostgreSQL database in the region you chose.";

const PGBOUNCER_LOGO = {
  viewBox: "-1 -1 1253.192865 1077.936410",
  markup: `<g transform="translate(-45.203992,1125.964846) scale(0.100000,-0.100000)" fill="none" stroke="#121212" stroke-width="1.1" stroke-linejoin="round"><path vector-effect="non-scaling-stroke" d="M11852 11238 c-23 -13 -83 -59 -133 -103 -121 -106 -358 -354 -366 -382 -9 -36 4 -69 50 -125 193 -240 359 -571 436 -872 40 -156 59 -374 43 -509 -26 -233 -154 -491 -315 -632 -306 -270 -721 -335 -1144 -182 -71 26 -329 159 -523 269 -376 213 -520 282 -720 343 -184 57 -206 60 -465 59 -258 0 -347 -12 -510 -67 -82 -28 -251 -112 -344 -170 -81 -51 -201 -137 -201 -145 0 -3 6 -13 13 -21 8 -9 49 -72 92 -141 92 -147 187 -334 245 -480 78 -194 172 -501 186 -605 3 -22 12 -67 20 -100 26 -115 14 -111 -38 10 -56 130 -249 517 -315 630 -22 39 -84 147 -137 240 -112 196 -182 313 -256 422 -154 227 -356 449 -525 577 -97 73 -308 182 -415 214 -188 57 -424 74 -530 38 -199 -68 -331 -187 -490 -443 -96 -155 -199 -395 -230 -538 -48 -217 -65 -395 -51 -530 31 -284 85 -480 197 -711 117 -241 264 -441 497 -676 405 -410 852 -659 1582 -884 456 -140 689 -260 890 -459 98 -96 160 -183 225 -310 52 -103 118 -293 145 -417 9 -43 18 -78 20 -78 4 0 245 488 245 496 0 2 21 48 46 101 25 53 75 162 110 242 114 256 231 483 306 595 40 61 78 117 83 125 25 39 177 203 259 280 146 136 278 227 473 325 183 91 376 150 908 276 379 90 722 248 970 445 426 340 699 790 767 1270 16 115 16 451 -1 575 -26 194 -90 448 -170 680 -133 387 -395 847 -681 1195 -23 28 -63 77 -90 109 -45 56 -81 85 -106 86 -6 0 -30 -10 -52 -22z m-2284 -3091 c54 -35 86 -102 80 -166 -10 -100 -79 -161 -187 -164 -49 -2 -63 2 -95 27 -69 52 -96 121 -77 194 34 124 174 179 279 109z"></path><path vector-effect="non-scaling-stroke" d="M5140 6997 c-422 -192 -669 -365 -1015 -712 -242 -241 -350 -365 -505 -579 -148 -203 -329 -532 -409 -743 -40 -107 -91 -294 -91 -337 0 -46 -32 -82 -135 -151 -99 -66 -208 -117 -314 -148 -64 -19 -99 -22 -222 -21 -96 1 -170 7 -219 18 -214 49 -494 196 -608 320 -34 37 -47 64 -77 163 -79 256 -124 350 -223 455 -87 94 -236 172 -404 214 -92 23 -118 25 -264 22 -228 -4 -231 -8 -163 -213 58 -175 179 -370 322 -521 49 -52 94 -94 100 -94 6 0 20 -8 31 -19 43 -38 161 -101 239 -127 78 -26 166 -42 253 -47 39 -2 51 -12 188 -144 240 -233 426 -341 706 -411 96 -23 123 -26 310 -26 191 0 213 2 317 28 62 15 116 25 121 22 5 -3 12 -31 16 -63 3 -32 8 -69 9 -83 11 -80 76 -261 142 -396 176 -357 404 -621 835 -969 47 -38 101 -82 121 -99 20 -17 73 -60 119 -96 45 -36 123 -100 174 -143 50 -42 117 -99 149 -125 31 -26 81 -67 110 -91 78 -65 438 -423 526 -523 156 -178 299 -374 356 -488 29 -57 77 -190 69 -190 -2 0 7 -22 20 -48 29 -58 80 -105 132 -122 108 -36 369 32 649 170 263 129 465 269 636 441 119 120 140 161 120 235 -22 83 -150 165 -328 212 l-68 17 -90 175 c-89 171 -228 400 -309 510 -148 199 -269 341 -448 525 -87 88 -158 163 -158 166 0 5 138 130 191 173 13 11 63 54 110 95 47 42 116 101 154 131 37 30 95 78 128 105 97 81 247 195 522 401 186 138 269 189 223 137 -16 -19 -304 -473 -353 -557 l-28 -48 31 -63 c113 -230 494 -591 773 -733 142 -72 217 -94 336 -100 133 -6 186 11 259 82 53 52 84 121 84 187 0 39 -35 183 -60 247 l-20 54 28 36 c120 153 232 365 305 578 83 241 91 289 91 544 1 216 0 230 -28 340 -120 476 -358 736 -853 930 -107 42 -440 133 -568 155 -80 14 -343 84 -450 120 -310 104 -594 248 -810 409 -106 79 -292 261 -369 361 -94 123 -172 248 -238 383 -33 67 -60 122 -61 122 -1 -1 -54 -24 -117 -53z"></path><path vector-effect="non-scaling-stroke" d="M9203 4976 c-111 -221 -259 -460 -368 -593 l-42 -51 -7 -139 c-9 -188 -58 -408 -130 -583 -6 -13 14 -17 131 -28 421 -36 865 -178 1388 -443 365 -184 555 -304 681 -427 95 -93 157 -132 213 -132 36 0 153 57 247 121 80 54 288 254 362 349 106 136 150 199 224 325 93 157 174 360 203 507 17 83 17 91 1 133 -22 56 -69 98 -136 120 -82 27 -252 17 -400 -24 -63 -18 -127 -35 -142 -38 -21 -4 -56 13 -170 85 -542 339 -1165 621 -1846 835 l-173 55 -36 -72z"></path><path vector-effect="non-scaling-stroke" d="M3578 2557 c-88 -179 -180 -296 -521 -660 -127 -136 -141 -164 -118 -245 23 -78 159 -248 307 -384 262 -239 512 -368 713 -368 159 1 249 69 271 206 11 64 -4 137 -59 292 l-29 84 26 56 c14 32 72 147 129 258 57 111 103 206 103 211 0 6 -17 22 -37 36 -345 234 -565 406 -686 536 -27 28 -52 51 -55 51 -4 0 -24 -33 -44 -73z"></path></g>`,
};
const POSTGRES_LOGO = {
  viewBox: "0 0 31 32",
  markup: `<path fill="#121212" d="M30.873 19.169c-.186-.565-.673-.959-1.303-1.053-.298-.045-.638-.026-1.04.058-.703.145-1.224.2-1.604.21 1.435-2.428 2.602-5.198 3.273-7.805 1.086-4.216.506-6.137-.172-7.006C28.232 1.274 25.614.04 22.454.001a13.4 13.4 0 0 0-3.936.553 14.6 14.6 0 0 0-2.302-.211c-1.519-.025-2.862.307-4.009.99A18 18 0 0 0 9.375.62c-2.768-.455-5-.1-6.632 1.056C.767 3.076-.15 5.508.02 8.905c.054 1.078.655 4.36 1.603 7.472.544 1.789 1.125 3.274 1.725 4.415.852 1.618 1.763 2.571 2.787 2.914.573.191 1.615.325 2.71-.59.14.169.325.337.571.492a3.8 3.8 0 0 0 1.076.455c1.374.344 2.662.258 3.76-.225l.017.545c.007.262.014.519.024.76.065 1.625.175 2.889.502 3.773.018.049.042.123.068.201.163.5.435 1.339 1.129 1.995.718.68 1.587.888 2.382.888.4 0 .78-.052 1.114-.124 1.19-.256 2.542-.646 3.52-2.042.925-1.32 1.374-3.308 1.455-6.44l.03-.254.02-.165.217.019.056.004c1.213.055 2.695-.203 3.605-.627.72-.334 3.025-1.555 2.482-3.202"></path><path fill="#FFFFFF" d="M28.8 19.489c-3.605.745-3.852-.478-3.852-.478 3.806-5.663 5.397-12.85 4.024-14.61-3.746-4.799-10.230-2.530-10.338-2.470l-.035.006a13 13 0 0 0-2.405-.251c-1.631-.027-2.869.428-3.807 1.142 0 0-11.567-4.778-11.03 6.01.115 2.294 3.28 17.364 7.057 12.812 1.38-1.665 2.714-3.072 2.714-3.072a3.5 3.5 0 0 0 2.287.586l.064-.055c-.02.206-.01.408.026.648-.973 1.09-.687 1.28-2.632 1.682-1.967.407-.811 1.13-.057 1.32.915.23 3.032.555 4.462-1.453l-.057.229c.381.306.65 1.991.604 3.519-.045 1.527-.074 2.576.226 3.395.3.82.6 2.662 3.156 2.113 2.136-.46 3.243-1.649 3.397-3.633.11-1.41.357-1.202.372-2.463l.199-.597c.228-1.912.036-2.529 1.352-2.242l.32.028c.968.044 2.236-.156 2.98-.503 1.602-.745 2.553-1.990.973-1.663"></path><path fill="#121212" d="M13.065 9.864c-.325-.046-.62-.004-.768.11a.28.28 0 0 0-.117.187c-.018.135.075.283.133.36.163.216.401.365.637.398a1 1 0 0 0 .102.007c.394 0 .751-.307.783-.534.04-.284-.372-.473-.77-.528m10.759.009c-.03-.222-.426-.286-.8-.233s-.738.221-.707.444c.024.174.336.47.706.47a1 1 0 0 0 .095-.007.9.9 0 0 0 .513-.282c.131-.138.207-.292.193-.392"></path><path fill="#121212" d="M30 19.404c-.137-.417-.58-.551-1.315-.399-2.182.452-2.964.139-3.22-.05 1.696-2.592 3.092-5.724 3.844-8.646.357-1.385.554-2.67.57-3.718.018-1.15-.178-1.995-.58-2.512C27.674 2 25.29.882 22.404.851c-1.984-.022-3.66.487-3.985.63a10 10 0 0 0-2.243-.289c-1.49-.024-2.777.334-3.843 1.062a17 17 0 0 0-3.123-.82c-2.53-.41-4.540-.1-5.975.92C1.523 3.570.733 5.744.886 8.814c.052 1.034.639 4.212 1.565 7.256 1.22 4.006 2.546 6.274 3.94 6.74.164.055.352.093.56.093.509 0 1.133-.23 1.782-1.012a64 64 0 0 1 2.455-2.786c.549.295 1.151.46 1.767.476l.005.048q-.184.22-.312.386c-.427.544-.516.657-1.89.94-.39.081-1.429.296-1.444 1.026-.017.797 1.227 1.132 1.369 1.167q.742.185 1.423.185c1.103 0 2.074-.363 2.85-1.067-.024 2.842.095 5.643.435 6.496.279.699.96 2.406 3.11 2.406.316 0 .664-.037 1.046-.119 2.245-.483 3.22-1.477 3.597-3.670.202-1.173.548-3.972.71-5.474.345.108.787.157 1.265.157.998 0 2.150-.212 2.872-.549.81-.377 2.275-1.304 2.01-2.11M24.654 9.258c-.007.443-.068.846-.133 1.266-.07.451-.14.918-.159 1.485-.018.552.051 1.126.118 1.68.134 1.121.272 2.275-.262 3.413a4 4 0 0 1-.236-.487 10 10 0 0 0-.41-.779c-.775-1.394-2.592-4.66-1.662-5.993.277-.397.98-.805 2.744-.585m-2.139-7.51c2.586.058 4.632 1.028 6.08 2.883 1.11 1.424-.112 7.9-3.653 13.487l-.108-.136-.044-.056c.915-1.515.736-3.014.576-4.343-.065-.546-.127-1.06-.111-1.545.016-.513.084-.953.15-1.378.08-.524.161-1.067.139-1.706a.7.7 0 0 0 .015-.24c-.058-.614-.756-2.449-2.18-4.11-.777-.908-1.913-1.925-3.463-2.61a11.7 11.7 0 0 1 2.6-.245m-14.47 19.57c-.714.862-1.208.697-1.37.643-1.059-.354-2.287-2.597-3.37-6.153-.936-3.077-1.483-6.17-1.527-7.039-.136-2.743.527-4.656 1.972-5.684 2.352-1.672 6.219-.671 7.773-.163l-.068.065c-2.550 2.582-2.490 6.993-2.483 7.263 0 .104.009.251.02.454.044.742.126 2.122-.092 3.686-.203 1.454.244 2.876 1.226 3.903q.152.159.317.3a66 66 0 0 0-2.397 2.725m2.725-3.645c-.79-.828-1.15-1.979-.985-3.159.23-1.652.145-3.09.1-3.863q-.011-.164-.016-.278c.372-.331 2.098-1.259 3.330-.976.561.13.903.513 1.046 1.173.736 3.415.097 4.839-.416 5.982a11 11 0 0 0-.291.69l-.067.178c-.167.45-.323.869-.42 1.266-.84-.002-1.659-.362-2.280-1.013m.13 4.606a2 2 0 0 1-.597-.257c.109-.05.301-.12.635-.19 1.617-.333 1.867-.569 2.412-1.263.125-.159.267-.34.463-.559.292-.328.426-.273.668-.172.197.082.388.329.466.6.037.129.078.372-.057.562-1.14 1.599-2.799 1.578-3.990 1.28m8.46 7.894c-1.978.425-2.678-.587-3.14-1.743-.297-.747-.444-4.114-.34-7.833a.4.4 0 0 0-.02-.142 2 2 0 0 0-.054-.263c-.155-.541-.531-.994-.983-1.181-.179-.075-.508-.212-.904-.11.084-.349.23-.742.39-1.168l.066-.18c.075-.202.169-.411.268-.633.538-1.197 1.273-2.836.475-6.54-.3-1.387-1.298-2.064-2.813-1.907-.908.094-1.738.462-2.152.672a7 7 0 0 0-.247.132c.115-1.398.552-4.01 2.186-5.663 1.03-1.04 2.4-1.554 4.07-1.526 3.289.054 5.398 1.747 6.589 3.157 1.026 1.216 1.581 2.44 1.803 3.1-1.667-.17-2.801.16-3.376.985-1.250 1.792.684 5.270 1.614 6.943.17.306.318.57.364.683.303.736.695 1.227.98 1.586.089.11.174.216.239.31-.506.145-1.413.483-1.33 2.168-.067.846-.54 4.807-.781 6.206-.318 1.849-.997 2.537-2.904 2.947m8.255-9.472c-.517.24-1.38.42-2.202.46-.906.042-1.368-.102-1.476-.191-.052-1.05.339-1.16.751-1.277q.097-.026.19-.057.056.046.125.092c.728.482 2.028.534 3.863.154l.02-.004c-.247.232-.67.544-1.271.823"></path>`,
};
const PRISMA_LOGO = {
  viewBox: "0 0 67 67",
  markup: `<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5772 23.4756L0 38.0528V38.076L14.5772 23.4756Z" fill="#000000"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M66.8662 28.8965V28.9405L39.7771 56.0295L66.8662 28.8965Z" fill="#000000"></path><path d="M14.5772 23.4755L0 38.0527V13.5776L13.5284 0.0264573V0H38.0154L14.5772 23.4755Z" fill="#000000"></path><path d="M66.866 23.2838L23.1498 67H0V43.7095L43.7095 0H66.866V23.2838Z" fill="#000000"></path><path d="M53.3113 67H28.8243L39.7771 56.0295L66.8662 28.9404V53.4224L53.3113 67Z" fill="#000000"></path>`,
};

function Logo({
  logo,
  x,
  y,
  w,
  h,
}: {
  logo: { viewBox: string; markup: string };
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <svg
      x={x}
      y={y}
      width={w}
      height={h}
      viewBox={logo.viewBox}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: logo.markup }}
    />
  );
}

const ROUTES = [
  {
    key: "pooled",
    color: CYAN,
    title: "Functions",
    sub: "Node.js, Bun",
    host: "pooled.db.prisma.io",
  },
  { key: "driver", color: YELLOW, title: "Edge runtime", sub: "No TCP", host: "@prisma/ppg" },
  {
    key: "direct",
    color: RED,
    title: "Admin tools",
    sub: "Migrations, pg_dump",
    host: "db.prisma.io",
  },
] as const;

function Markers({ id }: { id: string }) {
  return (
    <defs>
      {ROUTES.map((r) => (
        <marker
          key={r.key}
          id={`${id}-${r.key}`}
          orient="auto"
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3"
          overflow="visible"
        >
          <path d="M0 0 L6 3 L0 6 Z" fill={r.color} />
        </marker>
      ))}
    </defs>
  );
}

function ZoneLabel({
  x,
  y,
  text,
  weight = 500,
  color = MUTED,
}: {
  x: number;
  y: number;
  text: string;
  weight?: number;
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontFamily={SANS}
      fontSize={11}
      fontWeight={weight}
      letterSpacing={1.1}
    >
      {text.toUpperCase()}
    </text>
  );
}

function Card({
  x,
  y,
  w,
  h,
  title,
  sub,
  dot,
  titleSize = 15,
  subSize = 12.5,
  titleX,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  dot?: string;
  titleSize?: number;
  subSize?: number;
  titleX?: number;
}) {
  const tx = titleX ?? (dot ? x + 38 : x + 16);
  const mid = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#FFFFFF" stroke={BOX} />
      {dot ? <rect x={x + 16} y={mid - 5} width={10} height={10} rx={2.5} fill={dot} /> : null}
      <text
        x={tx}
        y={mid - 3}
        fill={INK}
        fontFamily={SANS}
        fontSize={titleSize}
        fontWeight={600}
        letterSpacing={-0.15}
      >
        {title}
      </text>
      <text x={tx} y={mid + 15} fill={MUTED} fontFamily={SANS} fontSize={subSize}>
        {sub}
      </text>
    </g>
  );
}

function HostPill({
  cx,
  cy,
  text,
  size = 11,
}: {
  cx: number;
  cy: number;
  text: string;
  size?: number;
}) {
  const w = text.length * size * 0.62 + 18;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - 12} width={w} height={24} rx={12} fill="#FFFFFF" stroke={BOX} />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill={INK}
        fontFamily={MONO}
        fontSize={size}
        fontWeight={500}
      >
        {text}
      </text>
    </g>
  );
}

function RoutePill({
  x,
  cy,
  w,
  color,
  text,
}: {
  x: number;
  cy: number;
  w: number;
  color: string;
  text: string;
}) {
  const textW = text.length * 6.3;
  const start = x + (w - (textW + 13)) / 2;
  return (
    <g>
      <rect
        x={x}
        y={cy - 12}
        width={w}
        height={24}
        rx={12}
        fill="#FAFAFA"
        stroke="#D4D4D4"
        strokeDasharray="3 3"
      />
      <circle cx={start + 3} cy={cy} r={3} fill={color} />
      <text x={start + 13} y={cy + 4} fill={INK} fontFamily={SANS} fontSize={12} fontWeight={500}>
        {text}
      </text>
    </g>
  );
}

function StartRing({ x, y, color }: { x: number; y: number; color: string }) {
  return <circle cx={x} cy={y} r={4} fill="#FFFFFF" stroke={color} strokeWidth={2} />;
}

function PrismaZoneLabel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Logo logo={PRISMA_LOGO} x={x} y={y - 12} w={15} h={15} />
      <ZoneLabel x={x + 23} y={y} text="Prisma Postgres" weight={600} color={INK} />
    </g>
  );
}

function RegionPill({ right, y }: { right: number; y: number }) {
  return (
    <g>
      <rect x={right - 88} y={y - 16} width={88} height={22} rx={11} fill="#FFFFFF" stroke={BOX} />
      <text
        x={right - 44}
        y={y - 1}
        textAnchor="middle"
        fill={MUTED}
        fontFamily={SANS}
        fontSize={11.5}
        fontWeight={500}
      >
        One region
      </text>
    </g>
  );
}

/** Desktop and tablet, at the article column's width. */
function WideDiagram() {
  const W = 760;
  const H = 344;
  const id = "apps-reach";
  const rows = [112, 208, 304];
  const appRight = 186;
  const pg = { x: 352, w: W - 352 };
  const group = { x: 364, y: 50, w: 272, h: 108 };
  const proxy = { x: 376, w: 94 };
  const bouncer = { x: 486, w: 138 };
  const cardH = 60;
  const db = { x: 648, y: 64, w: 100, h: 272 };
  const gapMid = (200 + pg.x) / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="apps-reach-title apps-reach-desc"
      className="hidden h-auto w-full sm:block"
    >
      <title id="apps-reach-title">How apps reach Prisma Postgres</title>
      <desc id="apps-reach-desc">{SERVERLESS_PATHS_DIAGRAM_TEXT}</desc>
      <Markers id={id} />

      <rect
        x={0.5}
        y={0.5}
        width={200}
        height={H - 1}
        rx={16}
        fill="#FFFFFF"
        stroke="#D4D4D4"
        strokeDasharray="4 4"
      />
      <rect
        x={pg.x + 0.5}
        y={0.5}
        width={pg.w - 1}
        height={H - 1}
        rx={16}
        fill="#FAFAFA"
        stroke="#EDEDED"
      />
      <rect
        x={group.x}
        y={group.y}
        width={group.w}
        height={group.h}
        rx={14}
        fill="#F2F2F2"
        stroke="#E6E6E6"
      />

      <g fill="none" stroke={LINE} strokeWidth={1.5} strokeLinecap="round">
        <path d={`M${appRight} ${rows[0]} H${proxy.x - 6}`} markerEnd={`url(#${id}-pooled)`} />
        <path
          d={`M${proxy.x + proxy.w} ${rows[0]} H${bouncer.x - 6}`}
          markerEnd={`url(#${id}-pooled)`}
        />
        <path
          d={`M${bouncer.x + bouncer.w} ${rows[0]} H${db.x - 6}`}
          markerEnd={`url(#${id}-pooled)`}
        />
        <path d={`M${appRight} ${rows[1]} H${db.x - 6}`} markerEnd={`url(#${id}-driver)`} />
        <path d={`M${appRight} ${rows[2]} H${db.x - 6}`} markerEnd={`url(#${id}-direct)`} />
      </g>

      <ZoneLabel x={20} y={30} text="Your app" />
      <PrismaZoneLabel x={pg.x + 16} y={30} />
      <RegionPill right={W - 14} y={30} />
      <ZoneLabel x={group.x + 14} y={group.y + 18} text="Pooling" />

      {ROUTES.map((r, i) => (
        <g key={r.key}>
          <Card x={14} y={rows[i] - 32} w={172} h={64} title={r.title} sub={r.sub} dot={r.color} />
          <StartRing x={appRight} y={rows[i]} color={r.color} />
          <HostPill cx={gapMid} cy={rows[i]} text={r.host} />
        </g>
      ))}

      <Card
        x={proxy.x}
        y={rows[0] - cardH / 2 + 8}
        w={proxy.w}
        h={cardH - 8}
        title="Proxy"
        sub="Connections"
        titleSize={14.5}
        subSize={12}
      />
      <g>
        <Card
          x={bouncer.x}
          y={rows[0] - cardH / 2 + 8}
          w={bouncer.w}
          h={cardH - 8}
          title="PgBouncer"
          sub="Transaction mode"
          titleSize={14.5}
          subSize={11.5}
          titleX={bouncer.x + 38}
        />
        <Logo logo={PGBOUNCER_LOGO} x={bouncer.x + 12} y={rows[0] - 6} w={20} h={17} />
      </g>

      <RoutePill x={group.x} cy={rows[1]} w={group.w} color={YELLOW} text="Serverless driver" />
      <RoutePill x={group.x} cy={rows[2]} w={group.w} color={RED} text="Bypasses the pooler" />

      <rect x={db.x} y={db.y} width={db.w} height={db.h} rx={12} fill="#FFFFFF" stroke={INK} />
      <Logo logo={POSTGRES_LOGO} x={db.x + db.w / 2 - 17} y={db.y + db.h / 2 - 40} w={34} h={35} />
      <text
        x={db.x + db.w / 2}
        y={db.y + db.h / 2 + 22}
        textAnchor="middle"
        fill={INK}
        fontFamily={SANS}
        fontSize={15}
        fontWeight={600}
        letterSpacing={-0.15}
      >
        PostgreSQL
      </text>
    </svg>
  );
}

/** Phones: three lanes running down into Prisma Postgres. */
function NarrowDiagram() {
  const W = 360;
  const id = "apps-reach-sm";
  const lanes = [64, 180, 296];
  const appBox = { y: 40, w: 108, h: 60 };
  const pgTop = 176;
  const group = { x: 8, y: 192, w: 112, h: 174 };
  const proxyY = 208;
  const bouncerY = 276;
  const boxH = 50;
  const db = { x: 10, y: 392, w: 340, h: 64 };
  const H = db.y + db.h + 44;
  const shortTitles = ["Functions", "Edge", "Admin tools"];
  const shortSubs = ["Node.js, Bun", "No TCP", "pg_dump"];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-labelledby="apps-reach-title-sm apps-reach-desc-sm"
      className="block h-auto w-full sm:hidden"
    >
      <title id="apps-reach-title-sm">How apps reach Prisma Postgres</title>
      <desc id="apps-reach-desc-sm">{SERVERLESS_PATHS_DIAGRAM_TEXT}</desc>
      <Markers id={id} />

      <rect
        x={0.5}
        y={0.5}
        width={W - 1}
        height={pgTop - 56}
        rx={16}
        fill="#FFFFFF"
        stroke="#D4D4D4"
        strokeDasharray="4 4"
      />
      <rect
        x={0.5}
        y={pgTop + 0.5}
        width={W - 1}
        height={H - pgTop - 1}
        rx={16}
        fill="#FAFAFA"
        stroke="#EDEDED"
      />
      <rect
        x={group.x}
        y={group.y}
        width={group.w}
        height={group.h}
        rx={14}
        fill="#F2F2F2"
        stroke="#E6E6E6"
      />

      <g fill="none" stroke={LINE} strokeWidth={1.5} strokeLinecap="round">
        <path
          d={`M${lanes[0]} ${appBox.y + appBox.h} V${proxyY - 6}`}
          markerEnd={`url(#${id}-pooled)`}
        />
        <path
          d={`M${lanes[0]} ${proxyY + boxH} V${bouncerY - 6}`}
          markerEnd={`url(#${id}-pooled)`}
        />
        <path d={`M${lanes[0]} ${bouncerY + boxH} V${db.y - 6}`} markerEnd={`url(#${id}-pooled)`} />
        <path
          d={`M${lanes[1]} ${appBox.y + appBox.h} V${db.y - 6}`}
          markerEnd={`url(#${id}-driver)`}
        />
        <path
          d={`M${lanes[2]} ${appBox.y + appBox.h} V${db.y - 6}`}
          markerEnd={`url(#${id}-direct)`}
        />
      </g>

      <ZoneLabel x={14} y={26} text="Your app" />
      <rect x={group.x + 8} y={group.y + group.h - 24} width={68} height={18} fill="#F2F2F2" />
      <ZoneLabel x={group.x + 12} y={group.y + group.h - 10} text="Pooling" />

      {ROUTES.map((r, i) => (
        <g key={r.key}>
          <Card
            x={lanes[i] - appBox.w / 2}
            y={appBox.y}
            w={appBox.w}
            h={appBox.h}
            title={shortTitles[i]}
            sub={shortSubs[i]}
            dot={r.color}
            titleSize={13}
            subSize={11}
            titleX={lanes[i] - appBox.w / 2 + 30}
          />
          <StartRing x={lanes[i]} y={appBox.y + appBox.h} color={r.color} />
          <HostPill cx={lanes[i]} cy={146} text={r.host} size={i === 0 ? 9.5 : 10.5} />
        </g>
      ))}

      <Card
        x={group.x + 8}
        y={proxyY}
        w={group.w - 16}
        h={boxH}
        title="Proxy"
        sub="Connections"
        titleSize={13}
        subSize={11}
      />
      <Card
        x={group.x + 8}
        y={bouncerY}
        w={group.w - 16}
        h={boxH}
        title="PgBouncer"
        sub="Transaction"
        titleSize={13}
        subSize={11}
        titleX={group.x + 36}
      />
      <Logo logo={PGBOUNCER_LOGO} x={group.x + 14} y={bouncerY + boxH / 2 - 14} w={16} h={14} />

      <RoutePill x={lanes[1] - 58} cy={250} w={116} color={YELLOW} text="Serverless driver" />
      <RoutePill x={lanes[2] - 56} cy={300} w={112} color={RED} text="Bypasses pooler" />

      <rect x={db.x} y={db.y} width={db.w} height={db.h} rx={12} fill="#FFFFFF" stroke={INK} />
      <Logo logo={POSTGRES_LOGO} x={db.x + db.w / 2 - 66} y={db.y + db.h / 2 - 14} w={27} h={28} />
      <text
        x={db.x + db.w / 2 + 14}
        y={db.y + db.h / 2 + 5}
        textAnchor="middle"
        fill={INK}
        fontFamily={SANS}
        fontSize={15}
        fontWeight={600}
      >
        PostgreSQL
      </text>

      <PrismaZoneLabel x={14} y={H - 16} />
      <RegionPill right={W - 12} y={H - 16} />
    </svg>
  );
}

function LegendItem({ color, name, detail }: { color: string; name: string; detail: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg aria-hidden width="28" height="10" viewBox="0 0 28 10" className="flex-none">
        <path d="M5 5 H27" stroke={LINE} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="5" cy="5" r="4" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      </svg>
      <span>
        <b className="font-semibold text-foreground">{name}</b>{" "}
        <span className="text-[#6B6B6B]">{detail}</span>
      </span>
    </span>
  );
}

/** How serverless functions, edge runtimes and admin tools reach Prisma Postgres. */
export function ServerlessPathsDiagram() {
  return (
    <figure className="not-prose my-10">
      <WideDiagram />
      <NarrowDiagram />
      <figcaption className="mt-5 flex flex-wrap gap-x-7 gap-y-2 border-t border-[#EDEDED] pt-4 text-[13px] leading-6">
        <LegendItem color={CYAN} name="Pooled" detail="App traffic, TCP 5432" />
        <LegendItem color={YELLOW} name="Serverless" detail="Edge runtimes, HTTPS and WebSocket" />
        <LegendItem color={RED} name="Direct" detail="Admin tools, TCP 5432" />
      </figcaption>
    </figure>
  );
}
