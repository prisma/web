"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Search, Sparkles } from "lucide-react";
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
/**
 * Opt-in hand-off from search to an AI assistant. With it, the dialog offers
 * "Ask AI" for whatever is typed: a row above the results, and Tab from the
 * input (hinted beside it while there is a query). `onAsk` receives the query;
 * the dialog closes itself afterwards.
 */
export interface UnifiedSearchAskAI {
  onAsk: (query: string) => void;
  label?: string;
  /**
   * The assistant's own shortcut from anywhere on the site (for example
   * "⌘I"). Shown on the Ask AI row, so the dialog teaches it: Tab asks from
   * here, this opens the assistant from any page.
   */
  shortcut?: string;
}

export function UnifiedSearchDialog({
  open,
  onOpenChange,
  dialogHandle,
  api = "/api/search",
  onStableQuery,
  placeholder = "Search all of Prisma…",
  askAI,
}: SharedProps & {
  api?: string;
  onStableQuery?: (query: string) => void;
  placeholder?: string;
  askAI?: UnifiedSearchAskAI;
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

  const askQuery = search.trim();
  const canAsk = Boolean(askAI && askQuery);
  const askLabel = askAI?.label ?? "Ask AI";
  const ask = () => {
    if (!askAI || !askQuery) return;
    askAI.onAsk(askQuery);
    onOpenChange(false);
  };
  // Tab from the input hands the query to the assistant. Shift+Tab and Tab on
  // an empty input keep normal focus movement.
  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab" && !event.shiftKey && canAsk) {
      event.preventDefault();
      ask();
    }
  };

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
            <SearchDialogInput placeholder={placeholder} onKeyDown={onInputKeyDown} />
            {canAsk && (
              // The hint appears only once there is something to ask, so the
              // resting dialog stays a plain search box.
              <span
                className="hidden shrink-0 items-center gap-2 text-[0.8125rem] text-fd-muted-foreground sm:inline-flex"
                aria-hidden="true"
              >
                <kbd className="inline-flex h-6 items-center rounded-md bg-fd-foreground/[0.06] px-2 font-sans text-xs font-medium text-fd-foreground/70">
                  Tab
                </kbd>
                {askLabel}
              </span>
            )}
            <SearchDialogClose />
          </SearchDialogHeader>
          {canAsk && (
            <button
              type="button"
              onClick={ask}
              className="mx-1 mt-1 flex w-[calc(100%-0.5rem)] items-center gap-3 self-stretch rounded-lg px-3 py-2.5 text-start text-sm transition-colors hover:bg-fd-accent focus-visible:bg-fd-accent focus-visible:outline-none"
            >
              <Sparkles className="size-4 shrink-0 text-fd-foreground/70" aria-hidden="true" />
              <span className="min-w-0 grow truncate">
                <span className="font-medium text-fd-foreground">{askLabel}: </span>
                <span className="text-fd-muted-foreground">“{askQuery}”</span>
              </span>
              {/* Tab is already hinted beside the input; the row teaches the
                  assistant's own shortcut instead. */}
              {askAI?.shortcut && (
                <span
                  className="hidden shrink-0 items-center gap-2 text-[0.8125rem] text-fd-muted-foreground sm:inline-flex"
                  aria-hidden="true"
                >
                  <kbd className="inline-flex h-6 items-center rounded-md bg-fd-foreground/[0.06] px-2 font-sans text-xs font-medium text-fd-foreground/70">
                    {askAI.shortcut}
                  </kbd>
                  anywhere
                </span>
              )}
            </button>
          )}
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
