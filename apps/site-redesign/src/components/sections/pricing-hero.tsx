import { GlassGlide } from "@/components/brand/glass-glide";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";

// Pricing hero: headline plus the plan cards, which it takes as children so the
// plan data stays in pricing-plans.tsx.
//
// Shane (2026-07-30): "Could we try a version where the hero and pricing table
// are visible above the fold? Right now there's a bit too much introductory text
// before you actually get to the pricing… I'd love the experience to be more
// like Vercel's pricing page, where you land and immediately see the plans."
//
// So the hero is a title band. What came out, and where it went — nothing is
// simply lost except the plan blurbs (see pricing-plans.tsx):
//  - The Pearly Plan testimonial and its prism ray. André approved removing it;
//    its avatar was a placeholder anyway and TestimonialsReveal already carries
//    testimonials further down the page.
//  - The subhead, which defined an operation. PricingHowItWorks opens with the
//    same definition ("Every query your app runs… counts as one operation"), so
//    the explanation still lands, just after the prices rather than before them.
//    That inversion is the point of the ask.
//  - The three checkmarks. "Free tier, no credit card required" is on the Free
//    card, "One bill, one platform" and the 5x claim are both in
//    PricingComparison.
//  - The two CTAs. Every plan card has its own, and CtaBurst closes the page.
//
// UNWRAPPED, unlike every other section on the site: no rounded panel, no
// border, full-bleed. André (2026-07-30) compared the page to Vercel's and asked
// for the wrapper off and more room throughout. The panel was containing the
// layout and making it read tighter than the reference. The spectral wash and
// grain stay — they carry the brand here now that the panel doesn't — but they
// run edge to edge and the section clips them.
export function PricingHero({ children }: { children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-white px-4 sm:px-8">
      {/* Spectral wash pooling behind the cards. Unlike everywhere else on the
          site there's no panel clipping this, so both the wash and the grain have
          to dissolve into white on their own — anchored hard to bottom-0 they cut
          off at the section boundary and drew a visible seam straight across the
          page. The wash therefore stops 8rem short of the bottom, the grain is
          masked, and a white fade covers the remainder. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-32 h-[30rem] overflow-hidden"
      >
        <div
          className="absolute -bottom-1/3 left-1/2 h-[120%] w-[150%] -translate-x-1/2"
          style={{
            background: [
              "radial-gradient(50% 38% at 28% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 30%, transparent), transparent 70%)",
              "radial-gradient(44% 34% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 24%, transparent), transparent 68%)",
              "radial-gradient(46% 32% at 76% 100%, color-mix(in srgb, var(--color-prism-red-400) 26%, transparent), transparent 70%)",
            ].join(","),
          }}
        />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-t from-transparent via-white/70 to-white" />
      </div>
      <Texture className="[mask-image:linear-gradient(to_bottom,black_55%,transparent_92%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
      />

      {/* Generous top padding: the fixed header is 100px, and the rest is
          deliberate air above the headline — the reference page leads with space
          rather than getting straight into content. */}
      {/* 84rem, wider than the site's max-w-6xl which the rest of the page keeps.
          The cramped feeling was column width, not just spacing: four cards of
          dense feature text at 1152px left each one 270px wide and wrapped
          "1,000,000 operations / month, then $0.0080 per 1,000" onto three lines.
          At 84rem the cards are 318px and two feature lines unwrap, so they come
          out both roomier AND 46px shorter — which is the only reason the extra
          padding here still leaves the CTAs above the fold at 1440x800.
          Measured: 6xl/270px/528px tall -> 84rem/318px/482px tall. */}
      <div className="relative mx-auto max-w-[84rem] pb-20 pt-32 sm:pb-24 md:pt-36">
        <div className="flex min-w-0 flex-col items-start">
          <RoleKicker color="bg-prism-cyan-400">Pricing</RoleKicker>
          <h1 className="isolate mt-5 max-w-[34ch] text-balance text-[clamp(2.25rem,3.4vw,3.125rem)] leading-[1.06]">
            Usage-based pricing that bills you for{" "}
            <GlassGlide className="md:whitespace-normal">what your app actually does</GlassGlide>
          </h1>
        </div>

        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}
