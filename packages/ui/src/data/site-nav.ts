/**
 * The prisma.io header's links, shared by the marketing site
 * (apps/site/src/components/header.tsx, via siteConfig) and the blog
 * (apps/blog/src/app/(blog)/layout.tsx), so the two navbars show the same
 * items in the same order and can't drift apart. Hrefs are root-relative on
 * prisma.io; both apps are zones of the same domain.
 */

export type SitePlatformLink = { label: string; href: string; description: string };
export type SiteNavLink = { label: string; href: string };

/** The "Platform" menu, in the site header's order. */
export const SITE_PLATFORM = [
  { label: "Postgres", href: "/postgres", description: "Managed Postgres, provisioned in seconds" },
  { label: "Compute", href: "/compute", description: "Run and scale your app next to your data" },
  { label: "ORM", href: "/orm", description: "The type-safe ORM for TypeScript" },
] as const satisfies readonly SitePlatformLink[];

/** The row under the Platform menu's products. */
export const SITE_STACK_LINK = { label: "Explore the stack", href: "/stack" } as const;

/** The plain links after the Platform menu. */
export const SITE_NAV = [
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/customers" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
] as const satisfies readonly SiteNavLink[];
