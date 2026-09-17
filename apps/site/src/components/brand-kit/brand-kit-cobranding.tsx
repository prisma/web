import { Check } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/brand-kit/section-header";
import { COBRAND_NOTES } from "@/components/brand-kit/content";

const MARK = "/brand-kit/logo-mark/logo-mark.svg";
const LOCKUP = "/brand-kit/full-color/full-color.svg";

export function BrandKitCobranding() {
  return (
    <section id="co-branding" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Co-branding"
          kickerColor="bg-prism-yellow-300"
          title="Putting Prisma next to your logo"
          body="For integration pages, partner banners, and podcast art, pair the marks with equal weight and honest spacing."
        />

        <div className="mx-auto mt-16 grid max-w-4xl items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            {/* Partner lockup demo */}
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-black/[0.06] p-8">
              <div className="flex items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOCKUP} alt="Prisma" className="h-8 w-auto" />
                <span aria-hidden className="h-10 w-px bg-black/15" />
                <span className="flex h-10 w-28 items-center justify-center rounded-md border border-dashed border-black/20 text-xs font-medium text-muted-foreground">
                  Your logo
                </span>
              </div>
            </div>
            {/* "Works with Prisma" badge */}
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#121212] p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MARK} alt="" aria-hidden className="size-4" />
                Works with Prisma
              </span>
            </div>
          </Reveal>

          <Reveal className="flex flex-col justify-center gap-4 rounded-2xl border border-black/[0.06] p-8">
            <p className="text-sm font-semibold">Three rules for a clean pairing</p>
            <ul className="space-y-4">
              {COBRAND_NOTES.map((note) => (
                <li key={note} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  <span className="text-sm leading-relaxed text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
