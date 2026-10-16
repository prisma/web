export const COMPARISON_CTA = {
  headline: "Ready to build with Prisma?",
  headlineMaxWidth: "max-w-[22ch]",
  body: "Free to start, no credit card required.",
  bodyMaxWidth: "max-w-[44ch]",
  checks: [
    { label: "Create a database and start building in minutes", color: "text-prism-cyan-500" },
    { label: "Read the docs for guides and API reference", color: "text-prism-yellow-400" },
    { label: "Trusted by 500K+ developers globally", color: "text-prism-red-500" },
  ],
  primaryCta: { label: "Get started free", href: "https://console.prisma.io" },
  secondaryCta: { label: "Talk to us", href: "/contact" },
} as const;
