"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useState } from "react"
import { BurstFill } from "@/components/brand/burst-fill"
import { cn } from "@/lib/utils"

const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)"

type PrismButtonProps = {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  type?: "button" | "submit"
}

// The brand's primary CTA, ported from the approved stylescape: a living
// spectrum glow that drifts at rest, and a prismatic burst that fills the
// button on hover. Reduced-motion safe.
export function PrismButton({ children, className, href, onClick, type = "button" }: PrismButtonProps) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const burstOn = hover && !reduce
  const MotionComp = href ? motion.a : motion.button

  return (
    <span
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* spectrum glow */}
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-full blur-[3.2px]"
      >
        <motion.span
          className="absolute inset-y-0 block w-[240%]"
          style={{ backgroundImage: SPECTRUM }}
          animate={
            reduce
              ? { x: "0%", scaleY: 1 }
              : { x: ["0%", "-58%", "0%"], scaleY: hover ? 1.18 : 1 }
          }
          transition={{
            x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: 0.35, ease: "easeOut" },
          }}
        />
      </span>
      {/* hover bloom */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full blur-[10px]"
        style={{ backgroundImage: SPECTRUM }}
        initial={{ opacity: 0 }}
        animate={{ opacity: burstOn ? 0.7 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* button */}
      <MotionComp
        href={href}
        type={href ? undefined : type}
        onClick={onClick}
        className="relative flex items-center justify-center overflow-hidden rounded-full bg-black px-6 py-3 cursor-pointer"
        animate={{ scale: burstOn ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        {/* prismatic burst — erupts from the centre via an expanding radial reveal */}
        <BurstFill on={burstOn} />

        <span className="relative z-10 whitespace-nowrap text-[16px] font-semibold leading-[1.5] text-white">
          {children}
        </span>
      </MotionComp>
    </span>
  )
}

// Secondary pill from the stylescape: thin neutral border that reveals the
// moving spectrum gradient on hover.
export function PrismButtonOutline({
  children,
  className,
  href,
  onClick,
  type = "button",
}: PrismButtonProps) {
  const Comp = href ? "a" : "button"
  return (
    <Comp
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      className={cn(
        "spectrum-border flex items-center justify-center rounded-full border border-[#646567] px-[22px] py-[11px] cursor-pointer transition-colors duration-500 hover:border-transparent",
        className
      )}
    >
      <span className="whitespace-nowrap text-[16px] font-semibold leading-[1.5] text-foreground">
        {children}
      </span>
    </Comp>
  )
}
