import { cn } from "@/lib/utils";

// The 3D agent character, introduced at the centre of the homepage's agent-loop
// orbit (agent-loop.tsx). It means one specific thing — "your agent" — so use it
// where the agent is the actor, and only once per page: repeated, it stops
// reading as a character and starts reading as wallpaper.
//
// The animated WebP looks around; the static PNG stands in under reduced motion.
// The WebP is ~1.9 MB, so it must stay below the fold and lazily loaded.
export function AgentRobot({ className }: { className?: string }) {
  const shared = "drop-shadow-[0_10px_16px_rgba(21,21,21,0.18)]";
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/robot-look.webp"
        alt=""
        loading="lazy"
        className={cn(shared, "motion-reduce:hidden", className)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/robot.png"
        alt=""
        loading="lazy"
        className={cn(shared, "hidden motion-reduce:block", className)}
      />
    </>
  );
}
