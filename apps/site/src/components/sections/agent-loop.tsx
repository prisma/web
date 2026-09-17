import { Database, Layers, Repeat } from "@/components/icons/forma";
import { IconTile } from "@/components/brand/icon-tile";
import { Texture } from "@/components/brand/texture";
import { Reveal } from "@/components/motion/reveal";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// One orbit of the comet, in seconds — the flare animation shares this
// duration so each node lights up exactly as the comet passes.
const ORBIT = 14;
// The comet dash spans 14% of the ring from the circle's start point
// (3 o'clock, going clockwise), so its leading edge sits at 50.4° at t=0.
const COMET_HEAD = 50.4;

// Loop nodes on a ring of r=40% around center, clockwise from the top:
// Build → Deploy → Debug → Fix → Redeploy. Angles measured clockwise
// from 3 o'clock (SVG circle path direction).
const STEPS = [
  { label: "Build", x: 50, y: 10, angle: 270 },
  { label: "Deploy", x: 88, y: 37.6, angle: 342 },
  { label: "Debug", x: 73.5, y: 82.4, angle: 54 },
  { label: "Fix", x: 26.5, y: 82.4, angle: 126 },
  { label: "Redeploy", x: 12, y: 37.6, angle: 198 },
];

function passDelay(angle: number) {
  return (((angle - COMET_HEAD + 360) % 360) / 360) * ORBIT;
}

const FEATURES = [
  {
    icon: Repeat,
    title: "Your agent handles the full loop",
    body: "Build, deploy, debug, redeploy. No vendor coordination.",
  },
  {
    icon: Layers,
    title: "One platform, not five glued together",
    body: "Get your app live without wiring together a database, a host, and an ORM from separate vendors.",
  },
  {
    icon: Database,
    title: "Deploy your app, the database is already there",
    body: "App and Postgres co-located on the same host.",
  },
];

// The agent loop: five verb chips on a hairline ring, the agent panel at
// center driving each via spokes, and a spectrum pulse circling the ring
// continuously — the brand ray running the loop instead of sweeping past.
function LoopDiagram() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[22rem] select-none sm:max-w-[26rem] lg:max-w-none"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none">
        <defs>
          {/* The three brand primaries laid along the comet's arc (chord from
              the dash tail at 3 o'clock to its head at 50.4°, in user space so
              it rotates with the group): cyan tail → yellow → red head. */}
          <linearGradient
            id="loop-spectrum"
            gradientUnits="userSpaceOnUse"
            x1="360"
            y1="200"
            x2="302"
            y2="323"
          >
            <stop offset="0%" stopColor="#01d7e4" />
            <stop offset="50%" stopColor="#f3c306" />
            <stop offset="100%" stopColor="#f34a60" />
          </linearGradient>
        </defs>
        <g className="text-foreground/15" stroke="currentColor" strokeWidth="1">
          {STEPS.map(({ label, x, y }) => (
            <line key={label} x1="200" y1="200" x2={x * 4} y2={y * 4} />
          ))}
          <circle cx="200" cy="200" r="160" />
        </g>
        <g
          className="origin-center animate-[spin_14s_linear_infinite] motion-reduce:animate-none"
          style={{ animationDuration: `${ORBIT}s` }}
        >
          <circle
            className="blur-[5px]"
            cx="200"
            cy="200"
            r="160"
            pathLength="100"
            strokeDasharray="14 86"
            strokeLinecap="round"
            stroke="url(#loop-spectrum)"
            strokeWidth="8"
            opacity="0.5"
          />
          <circle
            cx="200"
            cy="200"
            r="160"
            pathLength="100"
            strokeDasharray="14 86"
            strokeLinecap="round"
            stroke="url(#loop-spectrum)"
            strokeWidth="3"
          />
        </g>
      </svg>

      {STEPS.map(({ label, x, y, angle }) => (
        <span
          key={label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <span
            aria-hidden
            className="absolute -inset-1 animate-loop-flare rounded-full opacity-0 blur-[6px] motion-reduce:hidden"
            style={{ backgroundImage: SPECTRUM, animationDelay: `${passDelay(angle)}s` }}
          />
          <span className="relative block rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[0.6875rem] text-foreground shadow-sm sm:px-3.5 sm:py-1.5 sm:text-xs">
            {label}
          </span>
        </span>
      ))}

      {/* nudged below true center so the card + protruding robot head read
          as one visually centered block */}
      <div className="absolute left-1/2 top-[calc(50%+2rem)] -translate-x-1/2 -translate-y-1/2">
        <div
          aria-hidden
          className="absolute -inset-1.5 animate-loop-breathe rounded-[1.25rem] blur-[18px] motion-reduce:animate-none motion-reduce:opacity-20"
          style={{ backgroundImage: SPECTRUM }}
        />
        <div className="relative flex flex-col items-center rounded-2xl border border-border bg-card px-4 pb-4 pt-10 shadow-[0_16px_32px_-12px_rgba(21,21,21,0.12)] sm:px-7 sm:pb-6 sm:pt-14">
          {/* the agent itself — 3D robot head breaking the card's top edge.
              Animated (transparent WebP) looks around; static PNG under
              reduced motion. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/robot-look.webp"
            alt=""
            loading="lazy"
            className="absolute -top-11 left-1/2 w-20 -translate-x-1/2 drop-shadow-[0_10px_16px_rgba(21,21,21,0.18)] motion-reduce:hidden sm:-top-16 sm:w-28"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/robot.png"
            alt=""
            className="absolute -top-11 left-1/2 hidden w-20 -translate-x-1/2 drop-shadow-[0_10px_16px_rgba(21,21,21,0.18)] motion-reduce:block sm:-top-16 sm:w-28"
          />
          <p className="font-heading text-base leading-none text-foreground sm:text-lg">
            Your agent
          </p>
          <code className="mt-2.5 rounded-md border border-border/70 bg-muted/60 px-2 py-1 font-mono text-[0.625rem] leading-none text-muted-foreground">
            one CLI + API
          </code>
        </div>
      </div>
    </div>
  );
}

export function AgentLoop() {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="max-w-[20ch] text-balance text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
                What changes when your stack is built to work together
              </h2>
            </Reveal>

            <div className="mt-12 flex flex-col gap-9">
              {FEATURES.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 0.1} className="flex items-start gap-5">
                  <IconTile>
                    <Icon className="size-6 text-foreground" />
                  </IconTile>
                  <div>
                    <h3 className="text-xl">{title}</h3>
                    <p className="mt-1.5 max-w-[44ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal
            delay={0.15}
            className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-black/[0.06] bg-[url('/brand/agent-loop.jpg')] bg-[length:135%] bg-[position:50%_100%] p-6 sm:p-8"
          >
            <Texture opacity={0.06} blend="multiply" />
            <LoopDiagram />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
