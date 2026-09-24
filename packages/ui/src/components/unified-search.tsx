"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { FrameworkProvider } from "fumadocs-core/framework";
import { usePathname, useParams } from "next/navigation";
import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
import {
  type SharedProps,
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
  dialogHandle,
  api = "/api/search",
  onStableQuery,
}: SharedProps & {
  api?: string;
  onStableQuery?: (query: string) => void;
}) {
  const [tag, setTag] = useState<string | undefined>("all");
  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({ api, tag }),
    delayMs: 500,
  });
  const lastCapturedQuery = useRef<string | null>(null);
  useEffect(() => {
    if (
      !onStableQuery ||
      !open ||
      !search.trim() ||
      query.isLoading ||
      query.error ||
      query.data === undefined ||
      query.data === "empty"
    )
      return;
    const timer = setTimeout(() => {
      if (lastCapturedQuery.current !== search) {
        lastCapturedQuery.current = search;
        onStableQuery(search);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [onStableQuery, open, search, query.isLoading, query.data, query.error]);
  return (
    <FrameworkProvider useRouter={useSearchRouter} usePathname={usePathname} useParams={useParams}>
      <SearchDialog
        dialogHandle={dialogHandle}
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
          {query.error ? (
            <p role="alert" className="px-4 py-6 text-sm text-fd-muted-foreground">
              Search is temporarily unavailable. Please try again.
            </p>
          ) : (
            <SearchDialogList items={query.data !== "empty" ? query.data : null} />
          )}
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
