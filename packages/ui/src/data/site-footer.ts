/**
 * The prisma.io footer's links, shared by the marketing site
 * (apps/site/src/components/footer.tsx, via siteConfig) and the blog
 * (apps/blog/src/components/chrome/Footer.tsx), so the two footers can't
 * drift apart again. Hrefs are root-relative on prisma.io; both apps are
 * zones of the same domain, so "/postgres" lands on the site from either.
 *
 * The older `./footer` data (columns with a Legal dropdown, Discord and
 * other socials) still backs the docs footer and the blog's share row.
 */

export type SiteFooterLink = { label: string; href: string };

export const SITE_FOOTER_LINKS = {
  product: [
    { label: "Postgres", href: "/postgres" },
    { label: "Compute", href: "/compute" },
    { label: "ORM", href: "/orm" },
    { label: "Stack", href: "/stack" },
    { label: "Pricing", href: "/pricing" },
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
    { label: "Postgres guides", href: "/postgres/guides" },
    { label: "Compute guides", href: "/compute/guides" },
    { label: "Apps", href: "/apps" },
    { label: "Compare", href: "/compare" },
    { label: "Extensions", href: "/extensions" },
    { label: "Data Guide", href: "https://www.prisma.io/dataguide" },
    { label: "Support", href: "/support" },
    { label: "Community", href: "/community" },
  ],
  legalTrust: [
    { label: "All Legal Documents", href: "/legal" },
    { label: "DPA", href: "/legal/dpa" },
    { label: "Security & Compliance", href: "/legal/security-and-compliance" },
    { label: "SLA", href: "/legal/sla" },
    { label: "Status", href: "https://www.prisma-status.com" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Trust Center", href: "https://trust.prisma.io/" },
  ],
} satisfies Record<string, SiteFooterLink[]>;

/** Column order and titles, as the site footer shows them. */
export const SITE_FOOTER_COLUMNS = [
  { title: "Product", items: SITE_FOOTER_LINKS.product },
  { title: "Company", items: SITE_FOOTER_LINKS.company },
  { title: "Resources", items: SITE_FOOTER_LINKS.resources },
  { title: "Legal & Trust", items: SITE_FOOTER_LINKS.legalTrust },
] as const;

export const SITE_SOCIAL_LINKS = {
  twitter: "https://twitter.com/prisma",
  linkedin: "https://linkedin.com/company/prisma-io",
  github: "https://github.com/prisma",
  youtube: "https://www.youtube.com/prismadata",
  bluesky: "https://bsky.app/profile/prisma.io",
} as const;

/** The "Social Media" column, in the site footer's order. */
export const SITE_SOCIALS = [
  { key: "twitter", label: "Twitter", href: SITE_SOCIAL_LINKS.twitter },
  { key: "linkedin", label: "LinkedIn", href: SITE_SOCIAL_LINKS.linkedin },
  { key: "github", label: "GitHub", href: SITE_SOCIAL_LINKS.github },
  { key: "youtube", label: "YouTube", href: SITE_SOCIAL_LINKS.youtube },
  { key: "bluesky", label: "Bluesky", href: SITE_SOCIAL_LINKS.bluesky },
] as const;

export const SITE_CONTACT_EMAIL = "hello@prisma.io";
