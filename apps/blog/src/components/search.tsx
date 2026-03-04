"use client";
import { withBlogBasePath } from "@/lib/url";
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



export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    api: withBlogBasePath('/api/search'),
    delayMs: 500,
  });



  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter className="border-t border-fd-border p-2">
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
