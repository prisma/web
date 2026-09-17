import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { Texture } from "@/components/brand/texture";
import { MASTER_ZIP, PRIMARY_LOCKUP } from "@/components/brand-kit/content";

// Brand-kit hero: the site's wrapped prismatic panel (same shell, spectral
// bottom, and grain as the homepage and contact heroes), carrying the primary
// lockup on a white card with the triple-band ray passing behind it — light
// through the thing the page is about.
export function BrandKitHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
                "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
              ].join(","),
            }}
          />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto grid max-w-site items-center gap-12 pb-20 pt-32 md:pb-28 md:pt-44 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex animate-hero-rise flex-col items-start motion-reduce:animate-none">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                <span aria-hidden className="size-2 rounded-full bg-prism-cyan-400" />
                Brand &amp; press kit
              </p>
              <h1 className="mt-4 isolate max-w-[16ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Everything you need to show Prisma.
              </h1>
              <p className="mt-6 max-w-[48ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Logos, colours, the mascot, and the rules that keep them consistent — for partners,
                integrations, event and podcast banners, and anyone writing about us. Grab the whole
                pack or a single file.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <PrismButton href={MASTER_ZIP} size="lg">
                  Download the kit
                </PrismButton>
                <PrismButtonOutline href="#downloads" size="lg">
                  Browse the assets
                </PrismButtonOutline>
              </div>
            </div>

            <div className="relative animate-hero-rise-late motion-reduce:animate-none">
              <PrismRay
                className="left-1/2 top-1/2 h-12 w-[32rem] -translate-x-1/2 -translate-y-1/2 md:h-24 md:w-[64rem]"
                angle={-16}
                intensity="hero"
              />
              <div className="relative mx-auto flex aspect-[16/10] max-w-lg items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PRIMARY_LOCKUP} alt="Prisma primary logo lockup" className="w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
