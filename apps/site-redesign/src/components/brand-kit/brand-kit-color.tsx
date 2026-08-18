import { Reveal } from "@/components/motion/reveal"
import { CopyButton } from "@/components/brand-kit/copy-button"
import { SectionHeader } from "@/components/brand-kit/section-header"
import { BRAND_COLORS, NEUTRAL_COLORS, type Swatch } from "@/components/brand-kit/content"

function SwatchCard({ s, i }: { s: Swatch; i: number }) {
  return (
    <Reveal delay={(i % 3) * 0.08} className="overflow-hidden rounded-2xl border border-black/[0.06]">
      <div className={`aspect-video ${s.className}`} />
      <div className="border-t border-black/[0.06] p-4">
        <p className="font-semibold">{s.name}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-mono text-sm text-muted-foreground">{s.hex}</span>
          <CopyButton value={s.hex} label={`Copy HEX ${s.hex}`} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm text-muted-foreground">rgb({s.rgb})</span>
          <CopyButton value={`rgb(${s.rgb})`} label={`Copy RGB ${s.rgb}`} />
        </div>
      </div>
    </Reveal>
  )
}

export function BrandKitColor() {
  return (
    <section id="colour" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Colour"
          kickerColor="bg-prism-cyan-400"
          title="Three prism colours on ink and paper"
          body="Cyan, yellow, and red are the spectrum the brand disperses. Ink and paper carry everything else. Click any value to copy it."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          {BRAND_COLORS.map((s, i) => (
            <SwatchCard key={s.name} s={s} i={i} />
          ))}
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-6 sm:grid-cols-2">
          {NEUTRAL_COLORS.map((s, i) => (
            <SwatchCard key={s.name} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
