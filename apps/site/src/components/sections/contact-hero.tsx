import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismRay } from "@/components/brand/prism-ray";
import { Texture } from "@/components/brand/texture";
import { CheckBold } from "@/components/icons/forma";
import { ContactMessageForm } from "@/components/sections/contact-message-form";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

// Same three brand colours, in the same order, as the hero checkmarks on the
// homepage and the product pages.
const CHECK_COLORS = ["text-prism-cyan-500", "text-prism-yellow-400", "text-prism-red-500"];

// Contact hero: the homepage hero's wrapped prismatic panel — same wrapper,
// same spectral bottom, same grain, the crisp triple-band ray crossing behind
// the card on the right (light passing through the thing you came for) — in the
// split layout the product pages use.
//
// The wash is the product hero's calibration, not the homepage's, and that is
// deliberate. The homepage panel is 1222px tall, so its 40rem wash sits in the
// bottom third and the headline is on white. This panel is ~875px like the
// product heroes, and at that height the homepage's stronger values (cyan 58%,
// yellow 46%, red 50%, 40rem) bloom all the way up behind the copy and the
// subhead loses contrast — measured on the first pass. Same treatment, softer,
// shorter, with the white fade pulled down over it.
export function ContactHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — wash + beam fan dispersing to white above, same
            values as product-hero.tsx */}
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
          <div className="absolute bottom-[-24rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
          <div className="absolute bottom-[-28rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>
        {/* brand grain across the whole panel */}
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          {/* top padding = bottom padding + the fixed header's footprint. The
              copy centres against the form (André, 2026-08-12), the same as the
              product heroes. */}
          {/* Splits at lg, not md like the product heroes: their left column is
              a headline, subhead, two CTAs and three benefit lines, so it stands
              beside a tall visual at 768. This one is a headline and a
              paragraph, and against a five-field card it left ~700px of empty
              column between 768 and 1024. Stacked through the tablet range
              instead. */}
          <div className="mx-auto grid max-w-site items-center gap-12 pb-20 pt-32 md:pb-28 md:pt-44 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex animate-hero-rise flex-col items-start motion-reduce:animate-none">
              <h1 className="isolate max-w-[min(16ch,100%)] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Talk to <GlassGlide>the team</GlassGlide>
              </h1>
              <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Evaluating Prisma, planning a migration, or exploring a partnership? Tell us what
                you&apos;re working on and we&apos;ll route your message to the right person.
                Already building and need help? We&apos;ll point you to the fastest support channel.
              </p>
              {/* The homepage hero's proof stats, verbatim (siteConfig.proof) —
                  approved copy reused rather than new words, and it fills the
                  column beside the form.
                  Carried in the hero's coloured-checkmark bullet styling, but
                  stacked, which is exactly what product-hero.tsx does with its
                  benefits. Stacking is also what this column needs: run inline
                  with the homepage's · separators, the line needs that hero's
                  centred max-w-4xl to fit, and at 453-633px it wrapped mid-list
                  and left a separator dangling at the end of line one.
                  No divider above (André, 2026-08-12), unlike product-hero's
                  benefits — mt-8 alone, the same gap the homepage hero puts
                  between its subhead and its checkmarks. */}
              <ul className="mt-8 flex flex-col gap-2.5">
                {siteConfig.proof.map(({ stat, label }, i) => (
                  <li
                    key={label}
                    className="flex items-start gap-2 text-[15px] font-semibold text-foreground"
                  >
                    <CheckBold
                      className={cn("mt-0.5 size-4 shrink-0", CHECK_COLORS[i % 3])}
                      aria-hidden
                    />
                    <span>
                      {i === 0 && "Trusted by "}
                      {stat} {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* the ray crosses the panel behind the card — its tails are the
                only part that shows, the card itself stays opaque white */}
            <div className="relative animate-hero-rise-late motion-reduce:animate-none">
              <PrismRay
                className="left-[75%] top-1/2 h-12 w-[32rem] -translate-x-1/2 -translate-y-1/2 md:h-24 md:w-[64rem]"
                angle={-50}
                intensity="hero"
              />
              <ContactMessageForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
