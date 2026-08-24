"use client";
import { Spinner } from "@prisma/eclipse";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { SearchIcon, X } from "lucide-react";
import { ComponentProps, useEffect, useRef } from "react";
import posthog from "posthog-js";
import { withDocsBasePath } from "@/lib/urls";

export function CustomSearchDialogIcon(props: ComponentProps<"svg"> & { isLoading: boolean }) {
  return (
    <>
      {props.isLoading ? (
        <Spinner className="size-5 text-fd-muted-foreground" />
      ) : (
        <SearchIcon className="size-5 text-fd-muted-foreground" />
      )}
    </>
  );
}

export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    api: withDocsBasePath("/api/search"),
    delayMs: 500,
  });

  const lastCapturedQueryRef = useRef<string | null>(null);
  const stabilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (
      search.length > 0 &&
      !query.isLoading &&
      query.data !== undefined &&
      query.data !== "empty"
    ) {
      if (stabilityTimerRef.current) clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = setTimeout(() => {
        stabilityTimerRef.current = null;
        if (lastCapturedQueryRef.current !== search) {
          lastCapturedQueryRef.current = search;
          posthog.capture("docs:search", {
            query: search,
          });
        }
      }, 1500);
    }
    return () => {
      if (stabilityTimerRef.current) clearTimeout(stabilityTimerRef.current);
    };
  }, [query.data, query.isLoading, search]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay suppressHydrationWarning />
      {/* Brand shell only — every fumadocs mechanic (RootContext, keyboard
          navigation, the `*:border-b` divider rule on direct children) is
          untouched. `rounded-(--radius-square-high)` rather than
          `rounded-square-high` because tailwind-merge only collapses radius
          classes it recognises, and the panel default is `rounded-xl`. */}
      <SearchDialogContent className="rounded-(--radius-square-high) border-stroke-neutral">
        <SearchDialogHeader className="p-3">
          {/* The pill is a wrapper, not a restyle of SearchDialogInput —
              that component hardcodes its className and drops any passed in. */}
          <div className="flex w-full flex-row items-center gap-2 rounded-full border border-stroke-neutral bg-fd-secondary/50 px-4 py-2 transition-colors duration-300 focus-within:border-fd-ring motion-reduce:transition-none">
            <CustomSearchDialogIcon isLoading={query.isLoading} />
            <SearchDialogInput />
            <SearchDialogClose
              aria-label="Close search"
              className="rounded-full border-stroke-neutral"
            >
              <X className="size-4" aria-hidden="true" />
            </SearchDialogClose>
          </div>
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
