import { ThemeProvider } from "@prisma-docs/ui/components/theme-provider";
import { Footer } from "@/components/chrome/Footer";
import { NavigationWrapper } from "@/components/navigation-wrapper";
import { UtmPersistence } from "@/components/utm-persistence";
import type { NavLink } from "@/components/chrome/Header";
import { SITE_NAV, SITE_PLATFORM, SITE_STACK_LINK } from "@prisma-docs/ui/data/site-nav";

const toSiteUrl = (href: string) => `https://www.prisma.io${href}`;

// FontAwesome glyphs for the Platform menu (the site draws its own product
// icons, which live in apps/site).
const PLATFORM_ICON: Record<(typeof SITE_PLATFORM)[number]["href"], string> = {
  "/postgres": "fa-regular fa-chart-pyramid",
  "/compute": "fa-regular fa-microchip",
  "/orm": "fa-regular fa-database",
};

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
          icon: PLATFORM_ICON[href],
        })),
        footer: { text: SITE_STACK_LINK.label, url: toSiteUrl(SITE_STACK_LINK.href) },
      },
      ...SITE_NAV.map(({ label, href }) => ({ text: label, url: toSiteUrl(href) })),
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
