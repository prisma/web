import { Reveal } from "@/components/motion/reveal"
import { SectionHeader } from "@/components/brand-kit/section-header"

const FONTS = [
  {
    role: "Display",
    name: "Sora",
    detail: "Headlines and short statements. Weights 400–800.",
    className: "font-heading",
    sample: "Build with data",
    sampleClass: "text-5xl",
    source: "Google Fonts",
    href: "https://fonts.google.com/specimen/Sora",
  },
  {
    role: "Text",
    name: "Inter",
    detail: "Body copy, UI, and everything at reading sizes. Weights 100–900.",
    className: "font-sans",
    sample: "The type-safe data layer for TypeScript.",
    sampleClass: "text-2xl",
    source: "Google Fonts",
    href: "https://fonts.google.com/specimen/Inter",
  },
]

export function BrandKitType() {
  return (
    <section id="typography" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Typography"
          kickerColor="bg-prism-yellow-300"
          title="Sora for statements, Inter for everything else"
          body="Two open-source families do all the work. Both are free on Google Fonts, so partners can match the brand without licensing."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          {FONTS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.08} className="rounded-2xl border border-black/[0.06] p-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-semibold text-foreground/70">{f.role}</p>
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {f.source}
                </a>
              </div>
              <p className={`mt-6 ${f.className} ${f.sampleClass} leading-tight`}>{f.sample}</p>
              <p className={`mt-6 ${f.className} text-sm text-muted-foreground`}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
              <div className="mt-6 border-t border-black/[0.06] pt-4">
                <p className="text-lg font-semibold">{f.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
