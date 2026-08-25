import type { ComponentProps } from "react";
import { source } from "@/lib/source";
import { authLinks, baseOptions, links } from "@/lib/layout.shared";
import type { LinkItemType } from "@/components/layout/link-item";
import { DocsLayout } from "@/components/layout/notebook";
import { StatusIndicator } from "@/components/status-indicator";
import { SidebarBannerCarousel, type BannerSlide } from "@/components/sidebar-banner";
import { fetchOgImage } from "@/lib/og-image";
import { cn } from "@prisma-docs/ui/lib/cn";
import { getPageBadges } from "@/lib/page-badges";
import { BadgeProvider, SidebarBadgeItem } from "@/components/sidebar-badge-provider";
import { getOrmVersions } from "@/lib/version";
import { VersionSwitcher } from "@/components/version-switcher";

// Sidebar announcement slides — set to [] to hide the banner
const SIDEBAR_SLIDES: BannerSlide[] = [
  {
    title: "Building the Stack for the Next Million Products",
    description:
      "Prisma is building a software factory: ORM, Postgres, and Compute connected into one loop for builders and agents.",
    href: "https://www.prisma.io/blog/building-the-stack-for-the-next-million-products?utm_source=docs&utm_medium=sidebar-banner&utm_campaign=prisma-rebrand-2026",
    gradient: "ppg" as const,
    badge: "New",
    image: "/imgs/sidebar-banners/software-factory.png",
    imageAlt: "The shortest path from an idea to working software",
  },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { nav, ...base } = baseOptions();

  const navbarLinks: LinkItemType[] = [...links, ...authLinks];

  // Resolve OG images server-side for slides that don't have a hardcoded image
  const slides = await Promise.all(
    SIDEBAR_SLIDES.map(async (slide) => {
      if (!slide.image && !slide.visual && slide.href.startsWith("http")) {
        const ogImage = await fetchOgImage(slide.href);
        if (ogImage) return { ...slide, image: ogImage };
      }
      return slide;
    }),
  );

  const badges = Object.fromEntries(getPageBadges());
  const ormVersions = getOrmVersions(source.pageTree);
  const pageUrls = source.getPages().map((page) => page.url);

  return (
    <BadgeProvider badges={badges}>
      <DocsLayout
        {...base}
        links={navbarLinks}
        nav={{ ...nav }}
        sidebar={{
          collapsible: false,
          banner: <VersionSwitcher versions={ormVersions} availablePathnames={pageUrls} />,
          components: { Item: SidebarBadgeItem },
          footer: ({ className, ...props }: ComponentProps<"div">) => (
            <div className={cn("flex flex-col p-4 pt-2 gap-3", className)} {...props}>
              <SidebarBannerCarousel slides={slides} />
              <StatusIndicator />
            </div>
          ),
        }}
        tree={source.pageTree}
      >
        {children}
      </DocsLayout>
    </BadgeProvider>
  );
}
