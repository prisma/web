export const siteConfig = {
  name: "Prisma",
  description:
    "Prisma is the data platform for modern applications — ORM, Postgres, and the tools to build with data.",
  url: "https://www.prisma.io",
  ogImage: "/og.png",
  // The hero proof line, shared by the homepage and /contact so the numbers
  // can't drift apart — the star count in particular dates fast. The first
  // entry is rendered as "Trusted by <stat> <label>".
  proof: [
    { stat: "500,000+", label: "developers" },
    { stat: "28%", label: "of the TypeScript ORM market" },
    { stat: "46,500+", label: "GitHub stars" },
  ],
  // Routes per design-ref/sitemap.md (Phase 1)
  platform: [
    {
      label: "Postgres",
      href: "/postgres",
      description: "Managed Postgres, provisioned in seconds",
    },
    {
      label: "Compute",
      href: "/compute",
      description: "Run and scale your app next to your data",
    },
    {
      label: "ORM",
      href: "/orm",
      description: "The type-safe ORM for TypeScript",
    },
  ],
  stack: { label: "Explore the stack", href: "/stack" },
  nav: [
    { label: "Pricing", href: "/pricing" },
    { label: "Customers", href: "/customers" },
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
  ],
  footer: {
    product: [
      { label: "Postgres", href: "/postgres" },
      { label: "Compute", href: "/compute" },
      { label: "ORM", href: "/orm" },
      { label: "Stack", href: "/stack" },
      { label: "Pricing", href: "/pricing" },
      { label: "Demo", href: "/demo" },
      { label: "Changelog", href: "/changelog" },
    ],
    company: [
      { label: "About", href: "/company" },
      { label: "Careers", href: "/company/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Customers", href: "/customers" },
      { label: "Programs", href: "/programs" },
    ],
    resources: [
      { label: "Docs", href: "/docs" },
      { label: "Data Guide", href: "/dataguide" },
      { label: "Support", href: "/support" },
      { label: "Community", href: "/community" },
      { label: "Status", href: "/prisma-status" },
      { label: "Trust Center", href: "/trust-center" },
    ],
    legal: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "SLA", href: "/legal/sla" },
      { label: "Security & Compliance", href: "/legal/security-and-compliance" },
    ],
  },
  social: {
    twitter: "https://twitter.com/prisma",
    linkedin: "https://linkedin.com/company/prisma-io",
    github: "https://github.com/prisma",
  },
}
