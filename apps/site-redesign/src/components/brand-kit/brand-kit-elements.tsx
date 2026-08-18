import { GlassPrism } from "@/components/brand/glass-prism"
import { Pattern } from "@/components/brand/pattern"
import { PrismRay } from "@/components/brand/prism-ray"
import { Texture } from "@/components/brand/texture"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeader } from "@/components/brand-kit/section-header"

export function BrandKitElements() {
  return (
    <section id="elements" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Brand elements"
          kickerColor="bg-prism-cyan-400"
          title="The pieces that make it feel like Prisma"
          body="Beyond the logo, four recurring elements carry the brand. Use them the way we do so partner-made artwork feels native, not borrowed."
        />

        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2">
          <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-white">
              <PrismRay className="left-1/2 top-1/2 h-9 w-[160%] -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="border-t border-black/[0.06] p-5">
              <p className="font-semibold">The prism ray</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The triple-band ray marks where something is happening or where
                you are — a state, never a static stripe.
              </p>
            </div>
          </Reveal>

          <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-white">
              <GlassPrism
                shape="pentagon"
                tint="spectral"
                gradientId="brand-kit-prism"
                className="left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div className="border-t border-black/[0.06] p-5">
              <p className="font-semibold">Glass prisms</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Any shape can be a Prisma. Translucent glass sits in the
                background, cropped by section edges — never over copy.
              </p>
            </div>
          </Reveal>

          <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <div className="relative aspect-video overflow-hidden bg-white">
              <Texture opacity={1} className="mix-blend-normal" />
            </div>
            <div className="border-t border-black/[0.06] p-5">
              <p className="font-semibold">Grain</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A fine film grain over colour-washed panels — present but never a
                visible image. Keeps flat surfaces from feeling sterile.
              </p>
            </div>
          </Reveal>

          <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <Pattern className="aspect-video" />
            <div className="border-t border-black/[0.06] p-5">
              <p className="font-semibold">The cube grid</p>
              <p className="mt-1 text-sm text-muted-foreground">
                An isometric grid of cubes — the structured, composable feel of
                the data layer. Move your cursor over it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
