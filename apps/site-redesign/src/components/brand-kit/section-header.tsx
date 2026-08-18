import type { ReactNode } from "react"
import { RoleKicker } from "@/components/brand/role-kicker"
import { Reveal } from "@/components/motion/reveal"

// The standard centred section header for the brand-kit page: the site's
// RoleKicker, the clamp heading, and an optional subhead — the same rhythm as
// stack-bento and the product sections.
export function SectionHeader({
  kicker,
  kickerColor = "bg-prism-cyan-400",
  title,
  body,
}: {
  kicker: string
  kickerColor?: string
  title: ReactNode
  body?: ReactNode
}) {
  return (
    <Reveal className="mx-auto flex max-w-3xl flex-col items-start text-left md:items-center md:text-center">
      <RoleKicker color={kickerColor}>{kicker}</RoleKicker>
      <h2 className="mt-4 max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.1]">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 max-w-[60ch] text-pretty text-lg leading-relaxed text-muted-foreground">
          {body}
        </p>
      ) : null}
    </Reveal>
  )
}
