import { ThemeProvider } from "@prisma-docs/ui/components/theme-provider";
import { Footer } from "@/components/chrome/Footer";
import { NavigationWrapper } from "@/components/navigation-wrapper";
import { UtmPersistence } from "@/components/utm-persistence";
import type { NavLink } from "@/components/chrome/Header";
import { SITE_NAV, SITE_PLATFORM, SITE_STACK_LINK } from "@prisma-docs/ui/data/site-nav";

const toSiteUrl = (href: string) => `https://www.prisma.io${href}`;

export function baseOptions() {
  return {
    nav: {
      title: "My App",
    },
    // The homepage's navbar items, in its order, from the data the site
    // header uses (client, 2026-11-25: the nav items should "align
    // perfectly with the home page"). Absolute, because the blog runs under
    // /blog and these pages live on the site.
    links: [
      {
        text: "Platform",
        sub: SITE_PLATFORM.map(({ label, href, description }) => ({
          text: label,
          url: toSiteUrl(href),
          desc: description,
          // The site navbar's own product glyphs, shared so both match.
          glyph: href,
        })),
        footer: { text: SITE_STACK_LINK.label, url: toSiteUrl(SITE_STACK_LINK.href) },
      },
      ...SITE_NAV.map((item) =>
        "items" in item
          ? {
              text: item.label,
              col: 2,
              sub: item.items.map((link) => ({
                text: link.label,
                url: link.href.startsWith("http") ? link.href : toSiteUrl(link.href),
                glyph: link.href,
                external: "external" in link ? link.external : undefined,
              })),
            }
          : { text: item.label, url: toSiteUrl(item.href) },
      ),
    ] satisfies NavLink[],
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <UtmPersistence />
      <NavigationWrapper links={baseOptions().links} />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
