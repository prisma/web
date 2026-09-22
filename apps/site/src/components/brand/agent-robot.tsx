import { cn } from "@/lib/utils";

// The 3D agent character, introduced at the centre of the homepage's agent-loop
// orbit (agent-loop.tsx). It means one specific thing — "your agent" — so use it
// where the agent is the actor, and only once per page: repeated, it stops
// reading as a character and starts reading as wallpaper.
//
// The animated WebP looks around; the static PNG stands in under reduced motion.
// Both are lazily loaded and belong below the fold — `look` is ~1.9 MB.
//
// Source clips arrive on a white backdrop, not with an alpha channel. The
// character is white chrome, so a colour key eats its own highlights — the
// mattes here were cut per frame with macOS Vision's subject segmentation
// instead. Sized to what they actually render at rather than to the source.
const VARIANTS = {
  /** Looks around. 324x298, 152 frames. */
  look: { animated: "/brand/robot-look.webp", still: "/brand/robot.png" },
  /** Nods, head dipping down. 288x265, 81 frames at 16fps. */
  nod: { animated: "/brand/robot-nod.webp", still: "/brand/robot-nod.png" },
} as const;

export function AgentRobot({
  className,
  variant = "look",
}: {
  className?: string;
  variant?: keyof typeof VARIANTS;
}) {
  const shared = "drop-shadow-[0_10px_16px_rgba(21,21,21,0.18)]";
  const { animated, still } = VARIANTS[variant];
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={animated}
        alt=""
        loading="lazy"
        className={cn(shared, "motion-reduce:hidden", className)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={still}
        alt=""
        loading="lazy"
        className={cn(shared, "hidden motion-reduce:block", className)}
      />
    </>
  );
}
