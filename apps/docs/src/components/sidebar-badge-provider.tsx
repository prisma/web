"use client";
import { createContext, use, type FC, type ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";
import { SidebarItem } from "@/components/layout/notebook/sidebar";
import { Badge } from "@prisma/eclipse";
import type { BadgeType } from "@/lib/badge-types";

export type { BadgeType };

const BadgeContext = createContext<Record<string, BadgeType>>({});

export function BadgeProvider({
  badges,
  children,
}: {
  badges: Record<string, BadgeType>;
  children: ReactNode;
}) {
  return <BadgeContext.Provider value={badges}>{children}</BadgeContext.Provider>;
}

const BADGE_LABEL: Record<BadgeType, string> = {
  "early-access": "Early Access",
  "release-candidate": "Release Candidate",
  beta: "Beta",
  preview: "Preview",
  deprecated: "Deprecated",
};

const BADGE_COLOR: Record<BadgeType, "ppg" | "warning" | "neutral"> = {
  "early-access": "ppg",
  "release-candidate": "ppg",
  beta: "neutral",
  preview: "neutral",
  deprecated: "warning",
};

function shouldHideSidebarBadge(url: string, badge: BadgeType | undefined) {
  if (badge !== "early-access" && badge !== "release-candidate") {
    return false;
  }

  const docsPathname = url.replace(/^\/docs(?=\/|$)/, "") || "/";

  return (
    docsPathname === "/v8" ||
    docsPathname.startsWith("/v8/") ||
    docsPathname === "/orm/v8" ||
    docsPathname.startsWith("/orm/v8/") ||
    docsPathname === "/cli/v8" ||
    docsPathname.startsWith("/cli/v8/")
  );
}

export const SidebarBadgeItem: FC<{ item: PageTree.Item }> = ({ item }) => {
  const badges = use(BadgeContext);
  const badge = badges[item.url] as BadgeType | undefined;
  const visibleBadge = shouldHideSidebarBadge(item.url, badge) ? undefined : badge;

  return (
    <SidebarItem href={item.url} external={item.external} icon={item.icon}>
      <span className="flex items-center w-full gap-2">
        {item.name}
        {visibleBadge && (
          <Badge
            color={BADGE_COLOR[visibleBadge]}
            label={BADGE_LABEL[visibleBadge]}
            size="md"
            className="ml-auto shrink-0"
          />
        )}
      </span>
    </SidebarItem>
  );
};
