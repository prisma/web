import type { ComponentProps } from "react";
import { source } from "@/lib/source";
import { authLinks, baseOptions, links } from "@/lib/layout.shared";
import type { LinkItemType } from "@/components/layout/link-item";
import { DocsLayout } from "@/components/layout/notebook";
import { StatusIndicator } from "@/components/status-indicator";
import { SidebarBannerCarousel, type BannerSlide } from "@/components/sidebar-banner";
import { cn } from "@prisma-docs/ui/lib/cn";
import { getPageBadges } from "@/lib/page-badges";
import { BadgeProvider, SidebarBadgeItem } from "@/components/sidebar-badge-provider";
import { getOrmVersions } from "@/lib/version";
import { VersionSwitcher } from "@/components/version-switcher";

// Sidebar announcement slides — set to [] to hide the banner
const SIDEBAR_SLIDES: BannerSlide[] = [
  {
    title: "The Next Evolution of Prisma ORM",
    description:
      "Prisma 8: a full TypeScript rewrite with a new query API, SQL builder, and extensible architecture.",
    href: "https://pris.ly/pn-anouncement",
    gradient: "orm" as const,
    badge: "New",
    cta: "Read the post",
  },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { nav, ...base } = baseOptions();

  const navbarLinks: LinkItemType[] = [...links, ...authLinks];

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
              <SidebarBannerCarousel slides={SIDEBAR_SLIDES} />
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
