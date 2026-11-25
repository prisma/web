import { SITE_FOOTER_LINKS, SITE_SOCIAL_LINKS } from "@prisma-docs/ui/data/site-footer";

export const siteConfig = {
  name: "Prisma",
  description:
    "Prisma makes Prisma ORM, Prisma Postgres and Prisma Compute: a type-safe ORM for TypeScript, managed Postgres, and hosting for TypeScript apps next to their database in one project.",
  url: "https://www.prisma.io",
  ogImage: "/og.png",
  // The hero proof line, shared by the homepage and /contact so the numbers
  // can't drift apart — the star count in particular dates fast. The first
  // entry is rendered as "Trusted by <stat> <label>".
  proof: [
    { stat: "500,000+", label: "developers" },
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
  // The footer's links live in the shared UI package so the blog's footer
  // uses the same ones (@prisma-docs/ui/data/site-footer).
  footer: SITE_FOOTER_LINKS,
  social: SITE_SOCIAL_LINKS,
};
