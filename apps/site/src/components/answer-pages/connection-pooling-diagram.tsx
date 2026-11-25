// Five functions, two connections: how PgBouncer in Prisma Postgres shares a
// few database connections between many function instances. Rebuilt from the
// "Five functions, two connections" design mockup in the same language as the
// serverless guide's diagram: HTML and CSS boxes that size to their text, with
// SVG only for connectors and logos. The connector SVGs sit in fixed-width
// columns, so they are never stretched and the moving connection dots keep
// their shape. Below 760px of figure width the diagram stacks. Counts are an
// illustration; paths follow docs/postgres/database/connection-pooling.mdx.
// PostgreSQL carries no version.

const CYAN = "#01D7E4";
const LINE = "#CFCFCF";
const LABEL = "text-[10.5px] font-medium tracking-[0.1em] text-[#6B6B6B] uppercase";
const NOTE = "text-[11px] leading-4 text-[#6B6B6B]";

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
  className,
}: {
  logo: { viewBox: string; markup: string };
  className: string;
}) {
  return (
    <svg
      viewBox={logo.viewBox}
      aria-hidden
      className={`flex-none ${className}`}
      dangerouslySetInnerHTML={{ __html: logo.markup }}
    />
  );
}

const FUNCTIONS = [1, 2, 3, 4, 5];

// Wide layout geometry, in px. Both panels share it so their contents line up:
// 1px border + 20px padding, a 20px header row, a 16px gap, then the stack.
const INSET = 21;
const STACK_TOP = INSET + 20 + 16;
const ROW_H = 48;
const ROW_GAP = 12;
const STACK_H = FUNCTIONS.length * ROW_H + (FUNCTIONS.length - 1) * ROW_GAP;
const MID = STACK_H / 2;
const rowY = (i: number) => i * (ROW_H + ROW_GAP) + ROW_H / 2;

// The fan-in connector spans the gap column plus each panel's inset, so its
// rings start on the function boxes' edges and its arrowhead meets PgBouncer.
const GAP_W = 168;
const FAN_W = GAP_W + 2 * INSET;
const BUS_X = FAN_W / 2;
const TIP = 7;

const DB_OFFSETS = [-16, 16];

const PACKET_DUR = 7;

function Arrow({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - TIP} ${y - 3.5} L${x} ${y} L${x - TIP} ${y + 3.5} Z`} fill={CYAN} />;
}

/** A connection travelling from a function, down the bus and into PgBouncer. */
function Packet({ i }: { i: number }) {
  const y = rowY(i);
  const end = FAN_W - TIP;
  const a = BUS_X;
  const b = Math.abs(MID - y);
  const total = a + b + (end - BUS_X);
  return (
    <circle r="3" fill={CYAN} opacity="0">
      <animateMotion
        dur={`${PACKET_DUR}s`}
        begin={`${-i * (PACKET_DUR / FUNCTIONS.length)}s`}
        repeatCount="indefinite"
        calcMode="linear"
        keyTimes="0;0.28;0.52;0.88;1"
        keyPoints={`0;${(a / total).toFixed(4)};${((a + b) / total).toFixed(4)};1;1`}
        path={`M0 ${y} H${BUS_X} V${MID} H${end}`}
      />
      <animate
        attributeName="opacity"
        dur={`${PACKET_DUR}s`}
        begin={`${-i * (PACKET_DUR / FUNCTIONS.length)}s`}
        repeatCount="indefinite"
        keyTimes="0;0.04;0.88;0.96;1"
        values="0;1;1;0;0"
      />
    </circle>
  );
}

function FanIn() {
  return (
    <svg
      aria-hidden
      width={FAN_W}
      height={STACK_H}
      viewBox={`0 0 ${FAN_W} ${STACK_H}`}
      className="relative z-10 overflow-visible"
      style={{ marginLeft: -INSET, marginRight: -INSET }}
    >
      <g fill="none" stroke={LINE} strokeWidth="1.5" strokeLinecap="round">
        {FUNCTIONS.map((_, i) => (
          <path key={i} d={`M0 ${rowY(i)} H${BUS_X}`} />
        ))}
        <path d={`M${BUS_X} ${rowY(0)} V${rowY(FUNCTIONS.length - 1)}`} />
        <path d={`M${BUS_X} ${MID} H${FAN_W - TIP}`} />
      </g>
      <Arrow x={FAN_W} y={MID} />
      {FUNCTIONS.map((_, i) => (
        <circle key={i} cx="0" cy={rowY(i)} r="4" fill="#FFFFFF" stroke={CYAN} strokeWidth="2" />
      ))}
      <g className="motion-reduce:hidden">
        {FUNCTIONS.map((_, i) => (
          <Packet key={i} i={i} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The two database connections between PgBouncer and PostgreSQL. HTML rather
 * than SVG so the lines can take whatever width is left; the dots move by a
 * percentage of that width.
 */
function DbConnections({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative self-stretch ${className}`}>
      <p className={`absolute inset-x-0 px-2 text-center ${NOTE}`} style={{ bottom: MID + 26 }}>
        2 database connections
      </p>
      {DB_OFFSETS.map((dy, i) => (
        <div key={dy} className="absolute inset-x-0" style={{ top: MID + dy }}>
          <div className="mr-[7px] h-[1.5px] -translate-y-1/2" style={{ background: LINE }} />
          <svg viewBox="0 0 7 7" className="absolute top-0 right-0 size-[7px] -translate-y-1/2">
            <path d="M0 0 L7 3.5 L0 7 Z" fill={CYAN} />
          </svg>
          <span
            className="absolute top-0 left-0 size-1.5 -translate-y-1/2 rounded-full opacity-0 animate-[pool-db_3.5s_linear_infinite] motion-reduce:hidden"
            style={{ background: CYAN, animationDelay: `${-i * 1.75}s` }}
          />
        </div>
      ))}
    </div>
  );
}

function FunctionBox({ n, className = "" }: { n: number; className?: string }) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-xl border border-[#E4E4E4] bg-white px-4 text-[12.5px] font-medium tracking-[-0.01em] text-[#121212] ${className}`}
    >
      <span aria-hidden className="size-2 flex-none rounded-[2px]" style={{ background: CYAN }} />
      <span className="truncate">Function {n}</span>
    </div>
  );
}

function PgBouncer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2.5 rounded-xl border border-[#E4E4E4] bg-white px-3.5 animate-[pool-pulse_7s_ease-in-out_infinite] motion-reduce:animate-none ${className}`}
    >
      <Logo logo={PGBOUNCER_LOGO} className="h-4 w-[18px]" />
      <div className="min-w-0 leading-tight">
        <div className="text-[12.5px] font-semibold tracking-[-0.01em] text-[#121212]">
          PgBouncer
        </div>
        <div className="mt-1 text-[11px] whitespace-nowrap text-[#6B6B6B]">Transaction mode</div>
      </div>
    </div>
  );
}

function PrismaHeader() {
  return (
    <div className="flex h-5 items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.1em] text-[#121212] uppercase">
        <Logo logo={PRISMA_LOGO} className="size-3.5" />
        Prisma Postgres
      </span>
      <span className="rounded-full border border-[#E4E4E4] bg-white px-2.5 py-0.5 text-[10.5px] font-medium text-[#6B6B6B]">
        One region
      </span>
    </div>
  );
}

function HostPill() {
  return (
    <span className="rounded-full border border-[#E4E4E4] bg-white px-2.5 py-1 font-[family-name:var(--font-code)] text-[10.5px] leading-none whitespace-nowrap text-[#121212]">
      pooled.db.prisma.io
    </span>
  );
}

function WideDiagram() {
  return (
    <div className="hidden grid-cols-[minmax(150px,180fr)_168px_minmax(0,416fr)] @min-[760px]:grid">
      <div className="rounded-2xl border border-dashed border-[#D4D4D4] bg-white p-5">
        <div className={`flex h-5 items-center ${LABEL}`}>Your app</div>
        <div className="mt-4 grid gap-3" style={{ height: STACK_H }}>
          {FUNCTIONS.map((n) => (
            <FunctionBox key={n} n={n} className="h-12" />
          ))}
        </div>
      </div>

      <div className="relative" style={{ paddingTop: STACK_TOP }}>
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: INSET - 1 }}>
          <HostPill />
        </div>
        <FanIn />
        <p
          className={`absolute inset-x-0 text-center ${NOTE}`}
          style={{ top: STACK_TOP + rowY(FUNCTIONS.length - 1) + 12 }}
        >
          5 client connections
        </p>
      </div>

      <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-5">
        <PrismaHeader />
        <div className="mt-4 flex items-center" style={{ height: STACK_H }}>
          <PgBouncer className="h-24 min-w-0 flex-[0_1_210px]" />
          <DbConnections className="min-w-[96px] flex-1" />
          <div className="flex h-[216px] w-[120px] flex-none flex-col items-center justify-center gap-3 rounded-xl border border-[#E4E4E4] bg-white">
            <Logo logo={POSTGRES_LOGO} className="h-8 w-[31px]" />
            <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#121212]">
              PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownArrow({ double = false }: { double?: boolean }) {
  const xs = double ? [3, 15] : [9];
  return (
    <svg aria-hidden viewBox="0 0 18 26" className="h-6 w-[18px] flex-none">
      {xs.map((x) => (
        <g key={x}>
          <path d={`M${x} 0 V19`} stroke={LINE} strokeWidth="1.5" />
          <path d={`M${x - 3.5} 19 L${x} 26 L${x + 3.5} 19 Z`} fill={CYAN} />
        </g>
      ))}
    </svg>
  );
}

function NarrowDiagram() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 @min-[760px]:hidden">
      <div className="rounded-2xl border border-dashed border-[#D4D4D4] bg-white p-4">
        <span className={LABEL}>Your app</span>
        <div className="mt-3 grid gap-2">
          {FUNCTIONS.map((n) => (
            <FunctionBox key={n} n={n} className="h-10" />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className={NOTE}>5 client connections</span>
        <DownArrow />
        <HostPill />
      </div>
      <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-4">
        <PrismaHeader />
        <PgBouncer className="mt-3 py-3.5" />
        <div className="flex items-center justify-center gap-2 py-2">
          <DownArrow double />
          <span className={NOTE}>2 database connections</span>
        </div>
        <div className="flex items-center justify-center gap-3 rounded-xl border border-[#E4E4E4] bg-white px-3 py-4">
          <Logo logo={POSTGRES_LOGO} className="h-7 w-[27px]" />
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#121212]">
            PostgreSQL
          </span>
        </div>
      </div>
    </div>
  );
}

/** Five function instances sharing two database connections through PgBouncer. */
export function ConnectionPoolingDiagram() {
  return (
    <figure
      className="not-prose @container my-12 xl:-mr-[140px]"
      aria-label="Five function instances connect to PgBouncer at pooled.db.prisma.io, which shares two database connections to PostgreSQL between them."
    >
      <WideDiagram />
      <NarrowDiagram />
      <figcaption className="mx-auto mt-6 max-w-xl border-t border-[#EDEDED] pt-5 text-[12.5px] leading-5 text-[#6B6B6B] @min-[760px]:max-w-none">
        <b className="font-semibold text-foreground">Five functions, two connections.</b> PgBouncer
        lends each transaction a free database connection, then takes it back. The numbers are an
        illustration: your plan sets the pooled connection limit.
      </figcaption>
    </figure>
  );
}
