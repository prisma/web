import { Reveal } from "@/components/motion/reveal"
import { SectionHeader } from "@/components/brand-kit/section-header"

// Anatomy of the mark: the symbol and the wordmark that compose the primary
// lockup, then the lockup itself shown on the two surfaces it has to survive.
const PARTS = [
  {
    label: "The symbol",
    caption: "The prism. Use alone for avatars, favicons, and square crops.",
    src: "/brand-kit/logo-mark/logo-mark.svg",
    surface: "light" as const,
    imgClass: "h-20 w-auto",
  },
  {
    label: "The wordmark",
    caption: "Prisma set in the brand letterforms.",
    src: "/brand-kit/logotype/logotype.svg",
    surface: "light" as const,
    imgClass: "h-9 w-auto",
  },
]

const SURFACES = [
  {
    label: "On light",
    src: "/brand-kit/full-color/full-color.svg",
    className: "bg-white",
    labelClass: "text-muted-foreground",
  },
  {
    label: "On dark",
    src: "/brand-kit/white/white.svg",
    className: "bg-[#121212]",
    labelClass: "text-muted-foreground",
  },
]

export function BrandKitLogo() {
  return (
    <section id="logo" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="The logo"
          kickerColor="bg-prism-cyan-400"
          title="One mark, built from two parts"
          body="The primary lockup pairs the prism symbol with the Prisma wordmark. Reach for the full-colour lockup first; the pieces stand alone only where space or context demands it."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          {PARTS.map((part) => (
            <Reveal key={part.label} className="overflow-hidden rounded-2xl border border-black/[0.06]">
              <div className="flex h-44 items-center justify-center bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={part.src} alt={part.label} className={part.imgClass} />
              </div>
              <div className="border-t border-black/[0.06] p-5">
                <p className="font-semibold">{part.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{part.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-6 sm:grid-cols-2">
          {SURFACES.map((s) => (
            <Reveal key={s.label} className="overflow-hidden rounded-2xl border border-black/[0.06]">
              <div className={`flex h-44 items-center justify-center ${s.className}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={`Prisma logo ${s.label}`} className="h-11 w-auto" />
              </div>
              <div className="border-t border-black/[0.06] p-5">
                <p className={`text-sm font-medium ${s.labelClass}`}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
