import { CheckBold } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { GlassGlide } from "@/components/brand/glass-glide";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { Texture } from "@/components/brand/texture";
import { cn } from "@/lib/utils";

// Hand-drawn double quote — Sora's glyph ink is too small to carry the card,
// so the mark is an SVG: two comma-bowls with curved stems, fill currentColor.
function QuoteMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 150 100" fill="currentColor" aria-hidden className={className} style={style}>
      <path d="M50 4 C22 10 4 30 4 58 L4 78 C4 88 12 96 22 96 L48 96 C58 96 66 88 66 78 L66 54 C66 44 58 36 48 36 L30 36 C33 22 40 14 54 10 Z" />
      <path d="M130 4 C102 10 84 30 84 58 L84 78 C84 88 92 96 102 96 L128 96 C138 96 146 88 146 78 L146 54 C146 44 138 36 128 36 L110 36 C113 22 120 14 134 10 Z" />
    </svg>
  );
}

const CHECKS = [
  { label: "Free tier, no credit card required", color: "text-prism-cyan-500" },
  { label: "Up to 5x cheaper than Neon + Vercel at scale", color: "text-prism-yellow-400" },
  { label: "One bill, one platform", color: "text-prism-red-500" },
];

// Quote sourced verbatim from the prisma.io Pearly Plan case study (same pool
// as testimonials-strip.tsx); light pattern-card idiom, logo from the
// company's own site.
// TODO: avatar is still a placeholder (picsum seed); swap when the client
// supplies pricing-page testimonials for the [testimonials] copy slot.
const TESTIMONIAL = {
  logo: "/logos/customers/pearly.png",
  quote:
    "This is the fastest I've ever developed in my life, by far. The tooling has dramatically cut down on the amount of time I've had to spend.",
  name: "Sean Emmer",
  role: "CTO & Co-Founder",
  company: "Pearly Plan",
};

// Pricing hero: the wrapped prismatic panel in the split idiom — V2 copy on
// the left, social proof on the right with the crisp triple-band ray crossing
// behind the testimonial card (light passing through, product-hero idiom).
export function PricingHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — wash + beam fan dispersing to white above,
            same values as product-hero.tsx */}
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
        <Texture />

        <div className="relative px-4 sm:px-8">
          {/* top padding = bottom padding + the fixed header's footprint,
              so the gap under the navbar matches the wrapper's bottom */}
          <div className="mx-auto grid max-w-6xl items-center gap-12 pb-20 pt-36 md:grid-cols-2 md:pb-28 md:pt-48 lg:gap-16">
            {/* copy — min-w-0 so the grid track can't be forced past the
                panel's padding box by a child's min-content width */}
            <div className="flex min-w-0 flex-col items-start">
              <RoleKicker color="bg-prism-cyan-400">Pricing</RoleKicker>
              <h1 className="isolate mt-4 max-w-[24ch] text-balance text-[clamp(2.25rem,3.4vw,3.125rem)] leading-[1.06]">
                Usage-based pricing that bills you for{" "}
                <GlassGlide className="md:whitespace-normal">
                  what your app actually does
                </GlassGlide>
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Usage-based pricing by operation — an operation is one query your app runs, and
                that&apos;s what you pay for. Not seats, not deploys, not branches. Every paid plan
                sets a hard spend limit by default, so your bill stays predictable.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {CHECKS.map(({ label, color }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-[15px] font-semibold text-foreground"
                  >
                    <CheckBold className={cn("size-4 shrink-0", color)} aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <PrismButton href="https://console.prisma.io">Get started free</PrismButton>
                <PrismButtonOutline href="/contact">Talk to us</PrismButtonOutline>
              </div>
            </div>

            {/* social proof: the ray crosses the panel behind the testimonial —
                light passing through the proof */}
            <div className="relative min-w-0 max-md:mt-4 md:self-stretch">
              <PrismRay
                className="left-[70%] top-1/2 h-12 w-[32rem] -translate-x-1/2 -translate-y-1/2 max-md:hidden md:h-24 md:w-[64rem]"
                angle={-50}
                intensity="hero"
              />
              <figure className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_24px_48px_-24px_rgba(21,21,21,0.3)]">
                {/* faded cube pattern, same treatment as the strip's light cards */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.03] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_40%)]"
                  style={{
                    backgroundImage: "url(/brand/pattern.svg)",
                    backgroundSize: "892px 434px",
                  }}
                />
                {/* oversized opening quote with a continuous slice glitch
                    (React Bits GlitchText idiom): the ink mark underneath,
                    colored offset copies above on card-colored layers, each
                    clipped to a jumping horizontal band — slices of the glyph
                    read as displaced through the prism trio */}
                <span aria-hidden className="relative block h-14 select-none md:h-[4.5rem]">
                  {/* resting glitch shadow — static chromatic dispersion under
                      the ink mark, always present between flickers */}
                  <QuoteMark className="absolute left-0 top-0 h-full w-auto -translate-x-[4px] text-prism-cyan-400 mix-blend-multiply" />
                  <QuoteMark className="absolute left-0 top-0 h-full w-auto translate-y-[4px] text-prism-yellow-300 mix-blend-multiply" />
                  <QuoteMark className="absolute left-0 top-0 h-full w-auto translate-x-[4px] text-prism-red-500 mix-blend-multiply" />
                  <QuoteMark className="relative h-full w-auto text-foreground" />
                  <span className="absolute inset-0 animate-quote-slice-cyan bg-card motion-reduce:hidden">
                    <QuoteMark
                      className="h-full w-auto -translate-x-[3px] text-foreground"
                      style={{ filter: "drop-shadow(-3px 0 var(--color-prism-cyan-400))" }}
                    />
                  </span>
                  <span className="absolute inset-0 animate-quote-slice-red bg-card motion-reduce:hidden">
                    <QuoteMark
                      className="h-full w-auto translate-x-[3px] text-foreground"
                      style={{ filter: "drop-shadow(3px 0 var(--color-prism-red-500))" }}
                    />
                  </span>
                  <span className="absolute inset-0 animate-quote-slice-yellow bg-card motion-reduce:hidden">
                    <QuoteMark
                      className="h-full w-auto translate-y-[2px] text-foreground"
                      style={{ filter: "drop-shadow(0 3px var(--color-prism-yellow-300))" }}
                    />
                  </span>
                </span>
                <blockquote className="relative mt-7 text-pretty text-[clamp(1.5rem,1.8vw,1.875rem)] font-semibold leading-snug tracking-[-0.01em] text-foreground">
                  {TESTIMONIAL.quote}
                </blockquote>
                <figcaption className="relative mt-auto flex items-center gap-4 pt-8">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-foreground">{TESTIMONIAL.name}</p>
                    <p className="text-base text-muted-foreground md:truncate">
                      {TESTIMONIAL.role}, {TESTIMONIAL.company}
                    </p>
                  </div>
                  <div aria-hidden className="h-10 w-px shrink-0 bg-black/[0.08]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={TESTIMONIAL.logo}
                    alt={`${TESTIMONIAL.company} logo`}
                    className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-black/[0.06]"
                    draggable={false}
                  />
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
