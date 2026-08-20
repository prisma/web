import { Download } from "@/components/icons/forma"
import { Reveal } from "@/components/motion/reveal"
import { PrismButton } from "@/components/brand/prism-button"
import { SectionHeader } from "@/components/brand-kit/section-header"
import {
  assetHref,
  FORMAT_LABELS,
  LOGO_VARIANTS,
  MASTER_ZIP,
} from "@/components/brand-kit/content"

export function BrandKitVariants() {
  return (
    <section id="downloads" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Downloads"
          kickerColor="bg-prism-yellow-300"
          title="Seven treatments, every format"
          body="Pick the treatment that carries best on your background. Each is available as SVG for screens and print, PNG, transparent PNG, and JPG."
        />

        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOGO_VARIANTS.map((v, i) => (
            <Reveal
              key={v.dir}
              delay={(i % 3) * 0.08}
              className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.06]"
            >
              <div
                className={`flex h-40 items-center justify-center ${
                  v.surface === "dark" ? "bg-[#121212]" : "bg-white"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetHref(v, "svg")}
                  alt={`Prisma logo — ${v.name}`}
                  className={v.dir === "logo-mark" ? "h-24 w-auto" : "h-9 w-auto"}
                />
              </div>
              <div className="flex flex-1 flex-col border-t border-black/[0.06] p-5">
                <p className="font-semibold">{v.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{v.usage}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {v.formats.map((format) => (
                    <a
                      key={format}
                      href={assetHref(v, format)}
                      download
                      // Seven cards × four formats = 28 links whose visible
                      // text is just the format. Name the treatment too, or
                      // they're all identical in a screen reader's link list.
                      aria-label={`Download the ${v.name.toLowerCase()} logo as ${FORMAT_LABELS[format]}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.08] px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-black/20 hover:bg-black/[0.03]"
                    >
                      <Download className="size-3.5" aria-hidden />
                      {FORMAT_LABELS[format]}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <PrismButton href={MASTER_ZIP} size="lg">
            <span className="inline-flex items-center gap-2">
              <Download className="size-5" aria-hidden />
              Download all assets (.zip)
            </span>
          </PrismButton>
        </Reveal>
      </div>
    </section>
  )
}
