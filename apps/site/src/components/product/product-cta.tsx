import { CtaBurst } from "@/components/sections/cta-burst";
import type { ProductPageContent } from "./types";

// Rotates through the brand's three hues, in the order the homepage uses.
const CHECK_COLORS = ["text-prism-cyan-500", "text-prism-yellow-400", "text-prism-red-500"];

// The product page's closer. Every string comes from the page's own content:
// review feedback flagged all three product pages ending on an identical
// paragraph as reading templated, so nothing here is defaulted or appended.
export function ProductCta({ cta }: Pick<ProductPageContent, "cta">) {
  return (
    <CtaBurst
      headline={cta.headline}
      headlineMaxWidth="max-w-[30ch]"
      body={cta.body}
      bodyMaxWidth="max-w-[78ch]"
      checks={cta.benefits.map((label, i) => ({
        label,
        color: CHECK_COLORS[i % CHECK_COLORS.length],
      }))}
      primaryCta={cta.primaryCta}
      secondaryCta={cta.secondaryCta}
    />
  );
}
