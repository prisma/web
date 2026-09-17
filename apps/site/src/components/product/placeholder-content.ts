import type { ProductPageContent } from "./types";

// Placeholder instance mirroring the Notion outline's bracketed copy slots.
// Replace every [bracketed] string when instantiating a real product page.
// TODO: feature "Learn more" hrefs point at /docs until per-feature
// destinations are decided.
export const placeholderContent: ProductPageContent = {
  name: "[Product name]",
  accent: "orm",
  hero: {
    headline: "[Hero headline — outcome-focused, 6–10 words]",
    headlineEmphasis: "6–10 words",
    subheadline:
      "[Subheadline — 1–2 sentences. Name what this product does and who it's for. Ground it in the end-to-end TypeScript/agentic workflow where applicable.]",
    benefits: ["[Specific benefit]", "[Specific benefit]", "[Specific benefit]"],
    primaryCta: { label: "[Primary CTA]", href: "https://console.prisma.io" },
    secondaryCta: { label: "[Secondary CTA]", href: "/pricing" },
  },
  problem: {
    headline: "[Problem headline — name the friction]",
    body: [
      "[2–3 sentences. Describe the pain state before this product. Be specific and name exactly what developers have to do manually, stitch together, or go without.]",
      "[Product name] exists to change that.",
    ],
    outcomes: [
      { icon: "rocket", label: "[Outcome label — e.g. “Ship without the setup overhead”]" },
      { icon: "layers", label: "[Outcome label]" },
      { icon: "repeat", label: "[Outcome label]" },
      { icon: "bot", label: "[Outcome label]" },
    ],
  },
  features: {
    headline: "[H2 — state the outcome]",
    bridge: "[1–2 sentence bridge connecting to the Prisma platform.]",
    items: [
      { name: "[Feature name]", description: "[Description]", href: "/docs" },
      { name: "[Feature name]", description: "[Description]", href: "/docs" },
      { name: "[Feature name]", description: "[Description]", href: "/docs" },
      { name: "[Feature name]", description: "[Description]", href: "/docs" },
    ],
  },
  platform: {
    body: "[1–2 sentences. Explain how this product shares a common layer with the other Prisma products. The value is that adopting this product makes the rest of the platform more useful.]",
  },
  cta: {
    headline: "[Closing headline — specific to this product, not shared]",
    body: "[1–2 sentences. How this product sits in the wider stack, in this product's own words.]",
    benefits: [
      "[Product-specific benefit]",
      "[Product-specific benefit]",
      "[Trust line — spell it out, it is not appended for you]",
    ],
    primaryCta: { label: "[Primary CTA]", href: "https://console.prisma.io" },
    secondaryCta: { label: "[Secondary CTA]", href: "/pricing" },
  },
};
