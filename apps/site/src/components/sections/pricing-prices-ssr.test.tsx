import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { textContent } from "@prisma-docs/ui/lib/html-text";
import { CountUp, countUpStep, countUpTokens } from "@/components/motion/count-up";

// Outside the Next.js bundler, `import Image from "next/image"` resolves to the
// CommonJS exports object rather than the component, so the decorative
// <Texture> layer on /pricing cannot render here. Swap in a stub that renders
// nothing; it carries no text.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/image") {
      return {
        url: "data:text/javascript,export default function Image() { return null; }",
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});
const { PricingComparison } = await import("./pricing-comparison");
const { PricingScale } = await import("./pricing-scale");

// The home page scenario cards and the /pricing comparison cards show their
// monthly prices through <CountUp>. Crawlers and no-JS readers only get the
// server-rendered HTML, so that HTML has to carry the real figures, not the
// zero the count-up animation starts from.

// Matches a zero range with a hyphen or an en dash (U+2013): "$0-0".
const ZERO_RANGE = /\$0\s*[-\u2013]\s*0(?![\d,])/;

function priceText(html: string): string {
  return textContent(html).replace(/\s+/g, " ");
}

test("CountUp server-renders its final value", () => {
  for (const value of ["$0", "$19-39", "$385-450", "$72\u201390", "$2,800-3,400"]) {
    const text = priceText(renderToStaticMarkup(<CountUp value={value} />));
    assert.equal(text, value);
    const inactive = priceText(renderToStaticMarkup(<CountUp value={value} active={false} />));
    assert.equal(inactive, value);
  }
});

test("countUpTokens scales digit runs and keeps separators", () => {
  assert.equal(countUpTokens("$2,800-3,400", 1).join(""), "$2,800-3,400");
  assert.equal(countUpTokens("$2,800-3,400", 0).join(""), "$0-0");
  assert.equal(countUpTokens("$385\u2013450", 0.5).join(""), "$193\u2013225");
});

test("countUpStep: inactive figures keep their final value", () => {
  const base = { reduceMotion: false, active: true, inView: true as boolean | null, progress: 1 };
  // Hidden carousel slides, and a slide sliding out of view, show the real price.
  assert.equal(countUpStep({ ...base, active: false, progress: 0.4 }), "final");
  assert.equal(countUpStep({ ...base, active: false, inView: false }), "final");
  // Active but off screen: reset so it counts when it scrolls or slides in.
  assert.equal(countUpStep({ ...base, inView: false }), "reset");
  assert.equal(countUpStep({ ...base, progress: 0 }), "animate");
  // Re-picked before it left view: no flash to zero on a visible figure.
  assert.equal(countUpStep(base), "keep");
  // Unknown position or reduced motion: final value, never zero.
  assert.equal(countUpStep({ ...base, inView: null, progress: 0 }), "final");
  assert.equal(countUpStep({ ...base, reduceMotion: true, progress: 0 }), "final");
});

test("home pricing scenarios ship real prices in the HTML", () => {
  const text = priceText(renderToStaticMarkup(<PricingScale />));
  for (const price of ["$20-35", "$0-22", "$110-270", "$72-90"]) {
    assert.ok(text.includes(price), `missing ${price}`);
  }
  assert.doesNotMatch(text, ZERO_RANGE);
});

test("/pricing comparison cards ship real prices in the HTML", () => {
  const text = priceText(renderToStaticMarkup(<PricingComparison />));
  for (const price of ["$110\u2013270", "$95\u2013145", "$72\u201390"]) {
    assert.ok(text.includes(price), `missing ${price}`);
  }
  assert.doesNotMatch(text, ZERO_RANGE);
});
