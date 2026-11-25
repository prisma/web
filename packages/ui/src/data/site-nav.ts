/**
 * The prisma.io header's links, shared by the marketing site
 * (apps/site/src/components/header.tsx, via siteConfig) and the blog
 * (apps/blog/src/app/(blog)/layout.tsx), so the two navbars show the same
 * items in the same order and can't drift apart. Hrefs are root-relative on
 * prisma.io; both apps are zones of the same domain.
 */

export type SitePlatformLink = { label: string; href: string; description: string };

/** The "Platform" menu, in the site header's order. */
export const SITE_PLATFORM = [
  { label: "Postgres", href: "/postgres", description: "Managed Postgres, provisioned in seconds" },
  { label: "Compute", href: "/compute", description: "Run and scale your app next to your data" },
  { label: "ORM", href: "/orm", description: "The type-safe ORM for TypeScript" },
] as const satisfies readonly SitePlatformLink[];

/** The row under the Platform menu's products. */
export const SITE_STACK_LINK = { label: "Explore the stack", href: "/stack" } as const;

/** Glyphs: RESOURCE_GLYPHS in ../components/site-nav-glyphs, keyed by href. */
export type SiteResourceLink = { label: string; href: string; external?: boolean };

/**
 * The "Resources" menu, as the blog had it (client, 2026-11-25: "you have
 * removed resources, please add it back to the blog and to the home page",
 * then "make the icons the same"). Same entries, order and glyphs in both
 * headers; the menu lays them out two to a row.
 */
export const SITE_RESOURCES = [
  { label: "MCP", href: "/mcp" },
  { label: "Prisma Partners", href: "/programs/partners" },
  { label: "Tutorials", href: "/docs/guides" },
  {
    label: "Examples",
    href: "https://github.com/prisma/prisma-examples",
    external: true,
  },
  { label: "Stack", href: "/stack" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Customer stories", href: "/customers" },
  {
    label: "Data guide",
    href: "https://www.prisma.io/dataguide",
    external: true,
  },
] as const satisfies readonly SiteResourceLink[];

export type SiteNavItem =
  | { label: string; href: string }
  | { label: string; items: readonly SiteResourceLink[] };

/** Everything after the Platform menu, in order: links, and the Resources menu. */
export const SITE_NAV: readonly SiteNavItem[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", items: SITE_RESOURCES },
  { label: "Customers", href: "/customers" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];
