import { AgentRobot } from "@/components/brand/agent-robot";
import { Pattern } from "@/components/brand/pattern";

// The hero stage for the agent character: a frosted disc — cube grid faint
// inside it, prismatic halo behind it, a spectrum comet running its rim — with
// the robot floating in front. The comet is the agent-loop ring (agent-loop.tsx)
// reduced to a single orbit, so the character reads as at work without a
// diagram spelling out what the work is.
//
// This replaces the fabricated console panels the use-case heroes used to carry
// (client feedback, 2026-09-04: the abstraction went, the character stays). The
// disc, not a card, is what holds it: a rectangle here would read as one more
// piece of product UI, which is the thing that got cut.
//
// One gradient id, so one stage per page. That matches AgentRobot's rule
// anyway — the character means "your agent", and repeating it turns it into
// wallpaper.
const ARC = "robot-stage-arc";

// The halo: the brand's three hues bled around the disc, cyan high-left
// through yellow to red low-right — the same order and roughly the same
// weight as the hero panel's own spectral wash.
const HALO = [
  "radial-gradient(44% 44% at 24% 20%, color-mix(in srgb, var(--color-prism-cyan-400) 58%, transparent), transparent 70%)",
  "radial-gradient(48% 48% at 60% 90%, color-mix(in srgb, var(--color-prism-yellow-300) 55%, transparent), transparent 72%)",
  "radial-gradient(42% 42% at 88% 64%, color-mix(in srgb, var(--color-prism-red-400) 50%, transparent), transparent 70%)",
].join(",");

export function RobotStage() {
  return (
    <div
      role="img"
      aria-label="The Prisma agent"
      className="flex w-full items-center justify-center"
    >
      <div className="relative aspect-square w-full max-w-[28rem]">
        {/* prismatic halo, bled well past the rim */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-6%] rounded-full opacity-80 blur-2xl"
          style={{ background: HALO }}
        />

        {/* the disc */}
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-full border border-black/[0.08] bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_28px_56px_-28px_rgba(21,21,21,0.18)] backdrop-blur-[2px]"
        >
          <div className="absolute inset-0 opacity-[0.055] grayscale [mask-image:radial-gradient(closest-side,black,transparent_78%)]">
            <Pattern className="size-full" scale={2.2} />
          </div>
        </div>

        {/* inner ring, so the disc has a floor for the character to stand on */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[15%] rounded-full border border-black/[0.05]"
        />

        {/* the comet on the rim. r=192 in a 400 box puts it on the disc's edge;
            the dash spans 11% of the circle clockwise from 3 o'clock, so its
            head lands at ~40° and the gradient runs that chord, cyan tail to
            red head. */}
        <svg aria-hidden viewBox="0 0 400 400" fill="none" className="absolute inset-0 size-full">
          <defs>
            <linearGradient
              id={ARC}
              gradientUnits="userSpaceOnUse"
              x1="392"
              y1="200"
              x2="347"
              y2="323"
            >
              <stop offset="0%" stopColor="#01d7e4" />
              <stop offset="50%" stopColor="#f3c306" />
              <stop offset="100%" stopColor="#f34a60" />
            </linearGradient>
          </defs>
          <g className="origin-center animate-[spin_18s_linear_infinite] motion-reduce:animate-none">
            <circle
              className="blur-[6px]"
              cx="200"
              cy="200"
              r="192"
              pathLength="100"
              strokeDasharray="11 89"
              strokeLinecap="round"
              stroke={`url(#${ARC})`}
              strokeWidth="8"
              opacity="0.5"
            />
            <circle
              cx="200"
              cy="200"
              r="192"
              pathLength="100"
              strokeDasharray="11 89"
              strokeLinecap="round"
              stroke={`url(#${ARC})`}
              strokeWidth="2.5"
            />
          </g>
        </svg>

        {/* the character, sized to the inner ring and nudged up so its mass —
            not its bounding box — sits on the disc's optical centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AgentRobot variant="look" className="w-[56%] -translate-y-[4%]" />
        </div>
      </div>
    </div>
  );
}
