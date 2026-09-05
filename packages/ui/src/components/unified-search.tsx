"use client";
import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { FrameworkProvider } from "fumadocs-core/framework";
import { usePathname, useParams } from "next/navigation";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogOverlay,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogClose,
  SearchDialogList,
  SearchDialogFooter,
  TagsList,
  TagsListItem,
} from "fumadocs-ui/components/dialog/search";

export function UnifiedSearchProvider({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }} search={{ SearchDialog: UnifiedSearchDialog }}>
      {children}
    </RootProvider>
  );
}
export function UnifiedSearchTrigger() {
  const { setOpenSearch } = useSearchContext();
  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="prisma-search-trigger"
      aria-label="Search Prisma"
      title="Search Prisma (⌘K / Ctrl+K)"
    >
      <Search size={18} />
    </button>
  );
}
// Search crosses independent Next.js zones, so selection must load the destination document.
function useSearchRouter() {
  return {
    push: (url: string) => window.location.assign(url),
    refresh: () => window.location.reload(),
  };
}
export function UnifiedSearchDialog({
  open,
  onOpenChange,
  api = "/api/search",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  api?: string;
}) {
  const [tag, setTag] = useState<string | undefined>("all");
  const { search, setSearch, query } = useDocsSearch({ type: "fetch", api, tag, delayMs: 180 });
  return (
    <FrameworkProvider useRouter={useSearchRouter} usePathname={usePathname} useParams={useParams}>
      <SearchDialog
        open={open}
        onOpenChange={onOpenChange}
        search={search}
        onSearchChange={setSearch}
        isLoading={query.isLoading}
      >
        <SearchDialogOverlay />
        <SearchDialogContent className="prisma-unified-search">
          <SearchDialogHeader>
            <SearchDialogIcon />
            <SearchDialogInput placeholder="Search all of Prisma…" />
            <SearchDialogClose />
          </SearchDialogHeader>
          <SearchDialogList items={query.data !== "empty" ? query.data : null} />
          <SearchDialogFooter>
            <TagsList tag={tag} onTagChange={setTag}>
              {Object.entries({ all: "All", website: "Website", docs: "Docs", blog: "Blog" }).map(
                ([value, label]) => (
                  <TagsListItem key={value} value={value}>
                    {label}
                  </TagsListItem>
                ),
              )}
            </TagsList>
          </SearchDialogFooter>
        </SearchDialogContent>
      </SearchDialog>
    </FrameworkProvider>
  );
}
