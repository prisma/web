import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/brand-kit/section-header";

// Symbol minimum (16px) is André's call; the lockup/print figures are still
// sensible defaults derived from the mark — confirm the rest with the client.
const MIN_SIZES = [
  { label: "Primary lockup", value: "24px tall on screen · 12mm in print" },
  { label: "Symbol", value: "16px tall on screen · 8mm in print" },
];

export function BrandKitClearspace() {
  return (
    <section id="clear-space" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Clear space & sizing"
          kickerColor="bg-prism-red-500"
          title="Give the mark room to breathe"
          body="Keep clear space around the logo equal to the height of the prism symbol (1×). Nothing — type, edges, other logos — enters that zone."
        />

        <div className="mx-auto mt-16 grid max-w-4xl items-stretch gap-6 lg:grid-cols-2">
          {/* Clear-space diagram: the lockup boxed, with a 1× padded guide. */}
          <Reveal className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <div className="flex h-full items-center justify-center bg-white p-10">
              {/* The keep-out zone IS one prism symbol wide. `p-12` (48px) equals
                  the symbol size, and a ghosted symbol fills each strip, so the
                  breathing room is literally measured by the icon. */}
              <div className="relative rounded-lg border border-dashed border-prism-cyan-400/60 p-12">
                {[
                  "left-1/2 top-0 -translate-x-1/2",
                  "left-1/2 bottom-0 -translate-x-1/2",
                  "left-0 top-1/2 -translate-y-1/2",
                  "right-0 top-1/2 -translate-y-1/2",
                ].map((pos) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={pos}
                    src="/brand-kit/logo-mark/logo-mark.svg"
                    alt=""
                    aria-hidden
                    className={`pointer-events-none absolute size-12 p-2 opacity-25 ${pos}`}
                  />
                ))}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand-kit/full-color/full-color.svg"
                  alt="Prisma lockup with clear space"
                  className="h-10 w-auto"
                />
              </div>
            </div>
          </Reveal>

          {/* Minimum sizes. */}
          <Reveal className="flex flex-col justify-center gap-6 rounded-2xl border border-black/[0.06] p-8">
            <div>
              <p className="text-sm font-semibold">Minimum size</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The prism symbol is the reference for the margin — always leave at least one symbol
                of clear space around the logo, and never render the symbol below{" "}
                <span className="font-semibold text-foreground">16px</span>.
              </p>
            </div>
            <ul className="divide-y divide-black/[0.06]">
              {MIN_SIZES.map((m) => (
                <li key={m.label} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-right text-sm text-muted-foreground">{m.value}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
