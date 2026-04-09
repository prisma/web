'use client';
import { createContext, use, type FC, type ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";
import { SidebarItem } from "@/components/layout/notebook/sidebar";
import { Badge } from "@prisma/eclipse";

export type BadgeType = "early-access" | "deprecated" | "preview";

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
  preview: "Preview",
  deprecated: "Deprecated",
};

const BADGE_COLOR: Record<BadgeType, "ppg" | "warning" | "neutral"> = {
  "early-access": "ppg",
  preview: "neutral",
  deprecated: "warning",
};

export const SidebarBadgeItem: FC<{ item: PageTree.Item }> = ({ item }) => {
  const badges = use(BadgeContext);
  const badge = badges[item.url] as BadgeType | undefined;

  return (
    <SidebarItem href={item.url} external={item.external} icon={item.icon}>
      <span className="flex items-center w-full gap-2">
        {item.name}
        {badge && (
          <Badge
            color={BADGE_COLOR[badge]}
            label={BADGE_LABEL[badge]}
            size="md"
            className="ml-auto shrink-0"
          />
        )}
      </span>
    </SidebarItem>
  );
};
