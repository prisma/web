import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { Pattern } from "@/components/brand/pattern";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CheckBold, X } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

// V2 copy verbatim, with "No connection limits" removed — Gregory confirmed
// pooled limits do exist (10/100/500/1000).
//
// ⚠️ The $385–450 / $70–90 figures and the "up to 5x less" claim are NOT
// verified. Only the ~50K MAU column came from the client, and the pricing
// thread flagged it as never confirmed with us. The blog post offered as
// backing (prisma-compute-vs-vercel-pricing) compares Prisma Compute vs Vercel
// at 20M requests — ~$98 vs ~$236, about 2.4x — a different product
// comparison. Do not treat these as approved.
// Placeholder marker. Anything using PENDING is awaiting figures from the
// client — never fill these in with estimates.
const PENDING = "—";

const ALTERNATIVES = [
  {
    id: "neon-vercel",
    name: "Typical stack (Neon + Vercel)",
    cost: "$385–450",
    pending: false,
    rows: [
      { label: "Billing", value: "Separate database + hosting bills" },
      { label: "Database data transfer", value: "Pay per GB" },
      { label: "Spend limits", value: "Not standard" },
    ],
  },
  {
    // Shane (2026-07-29) asked to compare against Supabase as well. We have no
    // Supabase pricing, so this column is a placeholder until they supply it.
    id: "supabase",
    name: "Supabase",
    cost: PENDING,
    pending: true,
    rows: [
      { label: "Billing", value: PENDING },
      { label: "Database data transfer", value: PENDING },
      { label: "Spend limits", value: PENDING },
    ],
  },
];

const PRISMA = {
  name: "Prisma Pro",
  cost: "$70–90",
  rows: [
    { label: "Billing", value: "One bill, one platform" },
    { label: "Database data transfer", value: "Included" },
    { label: "Spend limits", value: "On by default" },
  ],
};

// "See how Prisma compares at scale" — wrapped prismatic panel (hero idiom:
// beam fan and a turning glass prism cropped by the bottom edge).
//
// The comparison itself follows the site's established before/after language
// from comparison.tsx: the alternative sits plain and muted with X marks, the
// Prisma side is lifted on white with the always-on spectrum ring, the brand
// cube pattern greyscaled behind it, and CheckBold in prism cyan. The monthly
// cost leads each side at display size — the figure is the argument, so it
// gets the emphasis rather than sitting in a table cell.
export function PricingComparison() {
  return (
    <section className="bg-white px-3 py-16 sm:px-4 sm:py-24">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* spectral bottom — wash plus the three brand beams */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 30%, transparent), transparent 68%)",
                "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 24%, transparent), transparent 66%)",
                "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 26%, transparent), transparent 68%)",
              ].join(","),
            }}
          />
          <div className="absolute bottom-[-24rem] left-[12%] h-[60rem] w-40 origin-bottom rotate-[-26deg] bg-prism-cyan-300/45 blur-[80px]" />
          <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[4deg] bg-prism-yellow-200/50 blur-[72px]" />
          <div className="absolute bottom-[-28rem] right-[12%] h-[60rem] w-40 origin-bottom rotate-[26deg] bg-prism-red-300/45 blur-[80px]" />
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-t from-transparent via-white/60 to-white" />
        </div>

        {/* glass prism turning at the bottom edge, light concentrating behind it */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] h-[16rem] w-[24rem] rounded-full opacity-25 blur-[70px]"
          style={{ backgroundImage: SPECTRUM }}
        />
        <GlassPrismSpin
          shape="pentagon"
          period={24}
          initialAngle={0.7}
          className="bottom-[-4.5rem] right-[-3.5rem] w-[14rem] max-md:bottom-[-3rem] max-md:right-[-2rem] max-md:w-[9rem]"
        />
        <Texture />

        <div className="relative px-4 pb-12 pt-16 sm:px-8 sm:pb-14 sm:pt-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
                See how Prisma compares at scale
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-3xl text-pretty text-center text-base leading-relaxed text-muted-foreground">
                Prisma charges per operation: each query your app runs against your database counts
                as one. No seats. No egress fees. And every paid plan includes a hard spend limit so
                there are no surprises.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-3xl text-pretty text-center text-base leading-relaxed text-muted-foreground">
                At around 50K monthly active users,{" "}
                <strong className="font-semibold text-foreground">
                  Prisma Pro can cost up to 5x less than a typical Neon + Vercel setup
                </strong>
                , with one bill, included data transfer, and spend limits on by default.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-8">
              {/* the alternatives — plain and muted, no card treatment */}
              {ALTERNATIVES.map((alt, i) => (
                <Reveal
                  key={alt.id}
                  delay={0.2 + i * 0.05}
                  className="flex flex-col px-0 py-4 sm:p-6"
                >
                  <RoleKicker color="bg-foreground/20">{alt.name}</RoleKicker>
                  <p className="mt-5 font-heading text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-tight text-muted-foreground">
                    {alt.cost}
                    {!alt.pending && (
                      <span className="ml-1.5 align-baseline text-base font-normal">/month</span>
                    )}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {alt.pending ? "Awaiting figures" : "at ~50K MAU"}
                  </p>

                  <dl className="mt-9 flex flex-col gap-5 border-t border-black/[0.06] pt-7">
                    {alt.rows.map((r) => (
                      <div key={r.label}>
                        <dt className="text-sm font-semibold text-foreground/70">{r.label}</dt>
                        <dd className="mt-1.5 flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                          {alt.pending ? (
                            <span className="text-muted-foreground/60">{r.value}</span>
                          ) : (
                            <>
                              <X
                                className="mt-1 size-4 shrink-0 text-foreground/35"
                                strokeWidth={3}
                                aria-hidden
                              />
                              {r.value}
                            </>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ))}

              {/* Prisma — lifted on white with the always-on spectrum ring and
                  the brand cube pattern greyscaled behind it */}
              <Reveal
                delay={0.3}
                className="spectrum-border spectrum-border-on relative flex flex-col overflow-hidden rounded-[1.25rem] border border-transparent bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.25)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.04] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
                >
                  <Pattern className="h-full w-full" scale={2.5} />
                </div>

                <RoleKicker color="bg-prism-cyan-400" className="relative">
                  {PRISMA.name}
                </RoleKicker>
                <p className="relative mt-5 font-heading text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-tight text-foreground">
                  {PRISMA.cost}
                  <span className="ml-1.5 align-baseline text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <p className="relative mt-2 text-sm text-muted-foreground">at ~50K MAU</p>

                <dl className="relative mt-9 flex flex-col gap-5 border-t border-black/[0.06] pt-7">
                  {PRISMA.rows.map((r) => (
                    <div key={r.label}>
                      <dt className="text-sm font-semibold text-foreground/70">{r.label}</dt>
                      <dd className="mt-1.5 flex items-start gap-3 text-pretty text-[0.9375rem] font-semibold leading-relaxed text-foreground">
                        <CheckBold
                          className="mt-1 size-4 shrink-0 text-prism-cyan-500"
                          aria-hidden
                        />
                        {r.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
