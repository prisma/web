"use client";
import { useMemo } from "react";
import { usePathname } from "fumadocs-core/framework";
import { useTreeContext } from "@fumadocs/base-ui/contexts/tree";
import type * as PageTree from "fumadocs-core/page-tree";
import { getSidebarTabs, isTabActive, type SidebarTab } from "./sidebar/tabs";
import { sidebarSectionGroups } from "../../lib/sidebar-sections";
import { isActive } from "../../lib/urls";

/** Top-level sections from the page tree, keyed by their index URL. */
export function useSectionTabs(): Map<string, SidebarTab> {
  const { full } = useTreeContext();

  return useMemo(() => {
    const tabs = getSidebarTabs(full as PageTree.Root);
    return new Map(tabs.map((tab) => [tab.url, tab]));
  }, [full]);
}

/**
 * The current top-level section of `pathname`, resolved against the config.
 * Only configured top-level sections are candidates, so nested roots
 * (orm/v7, cli/v7) still resolve to their parent section.
 *
 * Shared by the sidebar's section header and the navbar breadcrumb so both
 * name the same section for a given URL.
 */
export function useCurrentSection(): SidebarTab | null {
  const pathname = usePathname();
  const tabsByUrl = useSectionTabs();

  return useMemo(() => {
    const sectionTabs = sidebarSectionGroups
      .flatMap((group) => group.sections)
      .map(({ url }) => ({ url, tab: tabsByUrl.get(url) }))
      .filter((entry): entry is { url: string; tab: SidebarTab } => entry.tab !== undefined);

    for (const { tab } of sectionTabs) {
      if (isTabActive(tab, pathname)) return tab;
    }

    // Fallback for nested version trees a section's meta.json leaves out of
    // its `pages` (ORM's does not list `v7`, so /orm/v7 is absent from the ORM
    // tab's URL set). Prefix matching still places those pages in their
    // section; `isActive` never nested-matches the docs root, so `/` cannot
    // swallow everything here.
    for (const { url, tab } of sectionTabs) {
      if (isActive(url, pathname, true)) return tab;
    }

    return null;
  }, [tabsByUrl, pathname]);
}
