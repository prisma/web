import type { CSSProperties } from "react"
import { XCircle } from "@/components/icons/forma"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeader } from "@/components/brand-kit/section-header"

const LOCKUP = "/brand-kit/full-color/full-color.svg"

// Each don't ships with a visual of the exact mistake, applied to the real
// lockup with CSS so the wrong version is unmistakable.
type Misuse = {
  title: string
  detail: string
  imgStyle?: CSSProperties
  imgClass?: string
  tileClass?: string
  crowd?: boolean
}

const MISUSES: Misuse[] = [
  {
    title: "Don't recolour",
    detail: "Keep the brand colours. Never swap the palette or tint the mark.",
    imgStyle: { filter: "hue-rotate(190deg) saturate(1.6)" },
  },
  {
    title: "Don't distort",
    detail: "Scale proportionally. Never stretch, squash, or skew.",
    imgClass: "scale-x-150",
  },
  {
    title: "Don't rotate",
    detail: "The lockup is always level. Never tilt or set it on an angle.",
    imgClass: "rotate-[14deg]",
  },
  {
    title: "Don't add effects",
    detail: "No shadows, glows, gradients, or outlines on the logo.",
    imgStyle: { filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.5))" },
  },
  {
    title: "Don't crowd it",
    detail: "Respect the clear space. Keep type, edges, and other marks out.",
    crowd: true,
  },
  {
    title: "Don't use low contrast",
    detail: "Pick a treatment with enough contrast for the background.",
    tileClass: "bg-neutral-200",
    imgStyle: { opacity: 0.5 },
  },
]

export function BrandKitMisuse() {
  return (
    <section id="misuse" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Misuse"
          kickerColor="bg-prism-red-500"
          title="Please don't do these"
          body="The logo stays recognisable only if it stays consistent. Six ways to get it wrong — avoid all of them."
        />

        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MISUSES.map((m, i) => (
            <Reveal
              key={m.title}
              delay={(i % 3) * 0.08}
              className="overflow-hidden rounded-2xl border border-black/[0.06]"
            >
              <div
                className={`relative flex h-40 items-center justify-center overflow-hidden px-6 ${
                  m.tileClass ?? "bg-white"
                }`}
              >
                <span className="absolute left-3 top-3 text-prism-red-500">
                  <XCircle className="size-5" aria-hidden />
                </span>
                {m.crowd ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                    <span>Build</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={LOCKUP} alt="" aria-hidden className="h-6 w-auto" />
                    <span>faster</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={LOCKUP}
                    alt=""
                    aria-hidden
                    className={`h-8 w-auto ${m.imgClass ?? ""}`}
                    style={m.imgStyle}
                  />
                )}
              </div>
              <div className="border-t border-black/[0.06] p-5">
                <p className="font-semibold">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
