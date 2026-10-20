"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import { SearchGlass } from "@/components/support/support-icons";

// Hero search box, styled per the approved design, wired to the site-wide
// unified search dialog (the same context the header trigger uses).
export function SupportSearch() {
  const { setOpenSearch } = useSearchContext();
  const open = () => setOpenSearch(true);

  return (
    <div className="mt-10 w-full max-w-xl">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          open();
        }}
        className="spectrum-border-focus spectrum-border flex w-full items-center gap-2 rounded-2xl border border-black/[0.09] bg-white p-2 pl-4 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_16px_40px_-24px_rgba(21,21,21,0.22)] transition-colors"
      >
        <SearchGlass className="size-5 shrink-0 text-muted-foreground" />
        <label htmlFor="support-search" className="sr-only">
          Search the docs
        </label>
        <input
          id="support-search"
          type="search"
          placeholder="Search the docs…"
          name="query"
          readOnly
          // Open on explicit click only. Don't open on focus: the dialog
          // returns focus to this input on close, which would reopen it in a
          // loop. preventDefault on mousedown keeps the input from taking
          // focus at all, so closing the dialog can't bounce back here.
          onMouseDown={(event) => {
            event.preventDefault();
            open();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              open();
            }
          }}
          className="min-w-0 flex-1 cursor-pointer bg-transparent text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground"
        />
        <span className="relative inline-flex shrink-0 items-center">
          <span
            aria-hidden
            className="absolute inset-0 overflow-hidden rounded-full blur-[3.2px]"
          >
            <span
              className="absolute inset-y-0 block w-[240%]"
              style={{
                backgroundImage:
                  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)",
              }}
            />
          </span>
          <button
            type="submit"
            className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black px-6 py-3 text-[16px]"
          >
            <span className="relative z-10 whitespace-nowrap font-semibold leading-[1.5] text-white">
              Search
            </span>
          </button>
        </span>
      </form>
    </div>
  );
}
