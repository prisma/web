"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRightBold, ChevronsUpDown, Search, X } from "@/components/icons/forma";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  COMPARISON_CATEGORIES,
  COMPARISONS,
  type ComparisonCategory,
  type ComparisonEntry,
} from "./comparisons";

type CategoryFilter = ComparisonCategory | "all";
type SortKey = "name-asc" | "name-desc";

const SORT_OPTIONS: readonly { value: SortKey; label: string }[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

type CompareContextValue = {
  query: string;
  setQuery: (value: string) => void;
  filtered: readonly ComparisonEntry[];
};

const CompareContext = createContext<CompareContextValue | null>(null);

function useCompare() {
  const value = useContext(CompareContext);
  if (!value) {
    throw new Error("Compare controls must render inside CompareState");
  }
  return value;
}

export function CompareState({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => COMPARISONS.filter((entry) => matches(entry, query)), [query]);
  return (
    <CompareContext.Provider value={{ query, setQuery, filtered }}>
      {children}
    </CompareContext.Provider>
  );
}

function CompareSearch() {
  const { query, setQuery } = useCompare();

  return (
    <div className="relative w-full">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 z-10 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
      <label htmlFor="compare-search" className="sr-only">
        Search comparisons
      </label>
      <Input
        id="compare-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search comparisons"
        autoComplete="off"
        className="h-9 rounded-lg border-black/[0.09] bg-white pl-9 pr-9 text-sm shadow-none md:text-sm [&::-webkit-search-cancel-button]:appearance-none"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="sr-only">Clear search</span>
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function CompareSort({ value, onChange }: { value: SortKey; onChange: (sort: SortKey) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      Sort by
      <span className="relative">
        <select
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            if (next === "name-asc" || next === "name-desc") onChange(next);
          }}
          className="cursor-pointer appearance-none rounded-full border border-black/[0.09] bg-white py-1.5 pl-3.5 pr-9 text-sm font-semibold text-foreground transition-colors hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-prism-cyan-400"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronsUpDown
          className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </span>
    </label>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  count,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  dot?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        active
          ? "bg-muted font-semibold text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {dot ? <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dot)} /> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
    </button>
  );
}

function CategoryPill({
  active,
  onClick,
  count,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  dot?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-transparent bg-foreground text-primary-foreground"
          : "border-black/[0.09] bg-white text-foreground hover:border-foreground/30",
      )}
    >
      {dot ? <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dot)} /> : null}
      {children}
      <span
        className={cn(
          "text-xs font-medium tabular-nums",
          active ? "text-primary-foreground/60" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function matches(entry: ComparisonEntry, query: string) {
  const haystack = `${entry.competitor} ${entry.title} ${entry.description}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function CompareRows() {
  const { query, filtered } = useCompare();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const counts = useMemo(() => {
    const byCategory = Object.fromEntries(
      COMPARISON_CATEGORIES.map((item) => [
        item.id,
        COMPARISONS.filter((entry) => entry.category === item.id).length,
      ]),
    ) as Record<ComparisonCategory, number>;
    return { all: COMPARISONS.length, ...byCategory };
  }, []);
  const visibleCategories = COMPARISON_CATEGORIES.filter((item) => counts[item.id] > 0);
  const visible = useMemo(() => {
    const inCategory =
      category === "all" ? filtered : filtered.filter((entry) => entry.category === category);
    return [...inCategory].sort((a, b) => {
      const order = a.competitor.localeCompare(b.competitor);
      return sort === "name-desc" ? -order : order;
    });
  }, [filtered, category, sort]);
  const countLabel = visible.length === 1 ? "comparison" : "comparisons";
  const categoryHasEntries = category === "all" ? COMPARISONS.length > 0 : counts[category] > 0;
  const showSearchEmpty = visible.length === 0 && query.trim() !== "" && categoryHasEntries;

  return (
    <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-14">
      <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <FilterGroup label="Category">
          <FilterRow
            active={category === "all"}
            onClick={() => setCategory("all")}
            count={counts.all}
          >
            All
          </FilterRow>
          {visibleCategories.map((item) => (
            <FilterRow
              key={item.id}
              active={category === item.id}
              onClick={() => setCategory(item.id)}
              count={counts[item.id]}
              dot={item.dot}
            >
              {item.label}
            </FilterRow>
          ))}
        </FilterGroup>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          <CategoryPill
            active={category === "all"}
            onClick={() => setCategory("all")}
            count={counts.all}
          >
            All
          </CategoryPill>
          {visibleCategories.map((item) => (
            <CategoryPill
              key={item.id}
              active={category === item.id}
              onClick={() => setCategory(item.id)}
              count={counts[item.id]}
              dot={item.dot}
            >
              {item.label}
            </CategoryPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-black/[0.08] pb-5">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-semibold tabular-nums text-foreground">{visible.length}</span>{" "}
            {countLabel}
          </p>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            <div className="w-full max-w-xs sm:w-64">
              <CompareSearch />
            </div>
            <CompareSort value={sort} onChange={setSort} />
          </div>
        </div>

        {showSearchEmpty ? (
          <p className="pt-6 text-sm text-muted-foreground">No comparisons match that search.</p>
        ) : null}

        {visible.length > 0 ? (
          <ol className="border-t border-black/[0.08]">
            {visible.map((entry) => (
              <li key={entry.slug} className="border-b border-black/[0.08]">
                <Link
                  href={`/compare/${entry.slug}`}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 py-4 outline-none transition-colors hover:bg-black/[0.02] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset md:grid-cols-[12.5rem_minmax(0,1fr)_auto] md:gap-x-12 md:py-5"
                >
                  <h2 className="col-start-1 row-start-1 text-xl leading-snug">
                    {entry.competitor}
                  </h2>
                  <span className="col-start-1 row-start-2 min-w-0 max-w-[68ch] md:col-start-2 md:row-start-1">
                    <span className="block text-pretty text-sm font-semibold leading-5 text-foreground underline-offset-4 group-hover:underline">
                      {entry.title}
                    </span>
                    <span className="mt-1 block text-pretty text-sm leading-5 text-muted-foreground">
                      {entry.description}
                    </span>
                  </span>
                  <ArrowRightBold
                    className="col-start-2 row-span-2 row-start-1 size-4 self-center text-foreground/60 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none md:col-start-3 md:row-span-1"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
