import type { ComponentProps } from "react";
import { source } from "@/lib/source";
import { baseOptions, links } from "@/lib/layout.shared";
import { VersionSwitcher } from "@/components/version-switcher";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { DocsLayout } from "@/components/layout/notebook";
import { LATEST_VERSION } from "@/lib/version";
import { StatusIndicator } from "@/components/status-indicator";
import { SidebarBannerCarousel } from "@/components/sidebar-banner";
import { fetchOgImage } from "@/lib/og-image";
import { cn } from "@prisma-docs/ui/lib/cn";

// Sidebar announcement slides — set to [] to hide the banner
const SIDEBAR_SLIDES = [
  {
    title: "The Next Evolution of Prisma ORM",
    description: "Prisma Next: a full TypeScript rewrite with a new query API, SQL builder, and extensible architecture.",
    href: "https://pris.ly/pn-anouncement",
    gradient: "orm" as const,
    badge: "New",
  },
];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { nav, ...base } = baseOptions();

  const navbarLinks: LinkItemType[] = [
    ...links,
    {
      type: "custom",
      children: <VersionSwitcher currentVersion={LATEST_VERSION} />,
    },
  ];

  // Resolve OG images server-side for slides that don't have a hardcoded image
  const slides = await Promise.all(
    SIDEBAR_SLIDES.map(async (slide) => {
      if (slide.href.startsWith("http")) {
        const ogImage = await fetchOgImage(slide.href);
        if (ogImage) return { ...slide, image: ogImage };
      }
      return slide;
    }),
  );

  return (
    <DocsLayout
      {...base}
      links={navbarLinks}
      nav={{ ...nav }}
      sidebar={{
        collapsible: false,
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
  );
}
