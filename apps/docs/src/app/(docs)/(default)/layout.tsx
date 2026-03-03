import type { ComponentProps } from "react";
import { source } from "@/lib/source";
import { baseOptions, links } from "@/lib/layout.shared";
import { VersionSwitcher } from "@/components/version-switcher";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { DocsLayout } from "@/components/layout/notebook";
import { LATEST_VERSION } from "@/lib/version";
import { SidebarBannerCarousel } from "@/components/sidebar-banner";
import { cn } from "@prisma-docs/ui/lib/cn";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { nav, ...base } = baseOptions();

  const navbarLinks: LinkItemType[] = [
    ...links,
    {
      type: "custom",
      children: <VersionSwitcher currentVersion={LATEST_VERSION} />,
    },
  ];

  return (
    <DocsLayout
      {...base}
      links={navbarLinks}
      nav={{ ...nav }}
      sidebar={{
        collapsible: false,
        footer: ({ className, ...props }: ComponentProps<"div">) => (
          <div className={cn("flex flex-col p-4 pt-2 gap-3", className)} {...props}>
            <SidebarBannerCarousel
              slides={[
                {
                  title: "Prisma 7 is here",
                  description: "Check out the latest release with new features and improvements.",
                  href: "/docs/v7/release-notes",
                  gradient: "orm",
                  badge: "New",
                },
                {
                  title: "We're hiring",
                  description: "Join the Prisma team and help shape the future of databases.",
                  href: "https://www.prisma.io/careers",
                  gradient: "ppg",
                  image: "/img/docs-social.png",
                },
              ]}
            />
            {props.children}
          </div>
        ),
      }}
      tree={source.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
