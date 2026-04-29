"use client";
import { Button } from "@base-ui/react";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  SearchDialogFooter,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useEffect } from "react";

// Extend Window interface to include Kapa
declare global {
  interface Window {
    Kapa?: {
      open: (options?: { query?: string; submit?: boolean }) => void;
    };
  }
}

export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: "static",
  });

  useEffect(() => {}, [search, query]);
  const handleAskAI = () => {
    // Close the search dialog first
    props.onOpenChange?.(false);
    // Open Kapa with the current search query
    if (window.Kapa) {
      window.Kapa.open({ query: search, submit: search.length > 0 });
    }
  };

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay suppressHydrationWarning />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter className="border-t border-fd-border p-2">
          <Button
            onClick={handleAskAI}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fd-ring focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
            Ask AI
          </Button>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
