"use client";
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
  SearchDialogListItem,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import Image from "next/image";
import { withSiteBasePathForImageSrc } from "@/lib/url";
import { ComponentProps, type ReactNode } from "react";
import { SearchIcon } from "lucide-react";
import { Spinner } from "@prisma/eclipse";
import { SiteSearchResult } from "./search-types";

export function CustomSearchDialogIcon({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading ? (
        <Spinner className="size-5 text-fd-muted-foreground" />
      ) : (
        <SearchIcon className="size-5 text-fd-muted-foreground" />
      )}
    </>
  );
}

type SearchResultItemProps = Parameters<
  NonNullable<ComponentProps<typeof SearchDialogList>["Item"]>
>[0];

function isSiteSearchResult(value: unknown): value is SiteSearchResult {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SiteSearchResult>;
  return (
    typeof candidate.url === "string" &&
    typeof candidate.content === "string" &&
    (candidate.source === "blog" || candidate.source === "docs")
  );
}

function SearchResultItem({ item, onClick }: SearchResultItemProps): ReactNode {
  if (!isSiteSearchResult(item)) return null;
  const post = item;

  return (
    <SearchDialogListItem
      item={item}
      onClick={onClick}
      className="group grid grid-cols-[128px_1fr] sm:grid-cols-[160px_1fr] gap-4 items-center p-2! rounded-square border border-transparent aria-selected:border-stroke-neutral aria-selected:bg-background-muted/60"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-square bg-background-neutral">
        {post.heroImagePath ? (
          <Image
            src={withSiteBasePathForImageSrc(post.heroImagePath)}
            alt={post.content}
            fill
            sizes="(min-width: 640px) 160px, 128px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex flex-col gap-2 justify-center">
        <span className="text-xs font-medium uppercase tracking-wide text-foreground-neutral-weaker">
          {post.source}
        </span>
        <h3 className="text-sm sm:text-base text-foreground-neutral font-[650] sm:font-bold font-mona-sans line-clamp-2">
          {post.content}
        </h3>
        {post.description ? (
          <p className="text-xs sm:text-sm text-foreground-neutral-weak line-clamp-2">
            {post.description}
          </p>
        ) : null}
      </div>
    </SearchDialogListItem>
  );
}

export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    api: "/api/search",
    delayMs: 500,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <CustomSearchDialogIcon isLoading={query.isLoading} />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== "empty" ? query.data : null}
          Item={SearchResultItem}
        />
        <SearchDialogFooter className="border-t border-fd-border p-2"></SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
