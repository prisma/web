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

// Semantic triads, all of them soft washes so the badges sit quietly in the
// sidebar: cyan for the forward-looking states, the ORM amber for preview, red
// for deprecated. `beta` is left neutral — it is not a brand signal.
const BADGE_COLOR: Record<BadgeType, "ppg" | "orm-reverse" | "error" | "neutral"> = {
  "early-access": "ppg",
  "release-candidate": "ppg",
  beta: "neutral",
  preview: "orm-reverse",
  deprecated: "error",
};

export const SidebarBadgeItem: FC<{ item: PageTree.Item }> = ({ item }) => {
  const badges = use(BadgeContext);
  const badge = badges[item.url] as BadgeType | undefined;
  const visibleBadge = badge;

  return (
    <SidebarItem href={item.url} external={item.external} icon={item.icon}>
      <span className="flex items-center w-full gap-2">
        {item.name}
        {visibleBadge && (
          <Badge
            color={BADGE_COLOR[visibleBadge]}
            label={BADGE_LABEL[visibleBadge]}
            size="md"
            // `rounded-full!`: the eclipse badge ships `rounded-square`, which
            // tailwind-merge does not recognise as a radius class and therefore
            // will not collapse — the important flag is what makes the pill win.
            className="ml-auto shrink-0 rounded-full!"
          />
        )}
      </span>
    </SidebarItem>
  );
};
