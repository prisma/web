import Image from "next/image"
import { cn } from "@/lib/utils"

type TextureProps = {
  className?: string
  opacity?: number
  blend?: "hard-light" | "multiply"
}

// Brand grain texture overlay. Drop inside any `relative` container —
// the stylescape applies it at 0.02–0.03 opacity with hard-light blending.
// On mostly-white surfaces hard-light is nearly invisible; use multiply there.
export function Texture({ className, opacity = 0.03, blend = "hard-light" }: TextureProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <Image
        src="/brand/texture.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ opacity, mixBlendMode: blend }}
      />
    </div>
  )
}
