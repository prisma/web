import type { Metadata } from "next";
import { VariantBento } from "@/components/sections/calculator-options/variant-bento";
import { VariantCompare } from "@/components/sections/calculator-options/variant-compare";
import { VariantConsole } from "@/components/sections/calculator-options/variant-console";
import { VariantDial } from "@/components/sections/calculator-options/variant-dial";
import { VariantReceipt } from "@/components/sections/calculator-options/variant-receipt";

export const metadata: Metadata = {
  title: "Pricing calculator — design options",
  robots: { index: false, follow: false },
};

const OPTIONS = [
  {
    label: "Option A — The Receipt",
    thesis:
      "The promise is a predictable bill, so the result is a bill: paper slip, total first, spend limit printed on it.",
    Component: VariantReceipt,
  },
  {
    label: "Option B — The Prism Dial",
    thesis:
      "One monumental spectrum slider; plan boundaries marked on the track so dragging tells the whole pricing story.",
    Component: VariantDial,
  },
  {
    label: "Option C — The Console",
    thesis:
      "The estimate as a terminal run — flags in, answer out. Echoes the homepage hero console and the agent story.",
    Component: VariantConsole,
  },
  {
    label: "Option D — The Bento",
    thesis:
      "Calm input tiles, one tall result tile wearing the lit spectrum ring. Editorial and composed.",
    Component: VariantBento,
  },
  {
    label: "Option E — The Compare Row",
    thesis:
      "One set of controls prices every plan at once; the cheapest lights up. Comparison is the interface.",
    Component: VariantCompare,
  },
];

// Internal design exploration — not linked from the site. Compare five
// directions for the V2 "Estimate usage before you upgrade" section.
export default function CalculatorOptionsPage() {
  return (
    <div className="bg-white">
      <header className="border-b border-black/[0.06] px-4 pb-10 pt-28 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Internal · design exploration
        </p>
        <h1 className="mt-2 text-3xl">Pricing calculator — five options</h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Same V2 copy, same confirmed rates ($8 / $2 / $1 per M), same inputs. Only the design
          changes. Drag things.
        </p>
      </header>
      {OPTIONS.map(({ label, thesis, Component }) => (
        <div key={label} className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-8">
            <p className="inline-flex rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-white">
              {label}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{thesis}</p>
          </div>
          <Component />
        </div>
      ))}
    </div>
  );
}
