"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database, Search } from "@/components/icons/forma";
import {
  getDatabaseLabel,
  getListedDatabases,
  type ExtensionEntry,
  type ExtensionSource,
} from "@prisma-docs/ui/data/extensions";
import { cn } from "@/lib/utils";
import { ExtensionRow } from "./extension-row";

type SourceFilter = ExtensionSource | "all";

const SOURCE_TABS: { value: SourceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "official", label: "By Prisma" },
  { value: "community", label: "Community" },
];

function matchesQuery(entry: ExtensionEntry, query: string) {
  if (!query) return true;
  const haystack = [
    entry.name,
    entry.package,
    entry.tldr,
    entry.description,
    entry.author.name,
    ...entry.tags,
    ...entry.databases,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors [&_svg]:size-3.5",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-black/[0.25] bg-white text-primary hover:border-primary",
      )}
    >
      {children}
    </button>
  );
}

export function ExtensionsDirectory({ entries }: { entries: ExtensionEntry[] }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [database, setDatabase] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const databases = useMemo(() => getListedDatabases(entries), [entries]);

  const filtered = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (source === "all" || entry.source === source) &&
          (database === null || entry.databases.includes(database)) &&
          matchesQuery(entry, deferredQuery),
      ),
    [entries, source, database, deferredQuery],
  );

  const counts = {
    all: entries.length,
    official: entries.filter((entry) => entry.source === "official").length,
    community: entries.filter((entry) => entry.source === "community").length,
  };
  const hasActiveFilter = source !== "all" || database !== null || query !== "";
  const clear = () => {
    setQuery("");
    setSource("all");
    setDatabase(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search extensions"
          aria-label="Search extensions"
          className="h-12 rounded-xl border-black/[0.25] bg-white pl-11 pr-4 text-base text-primary placeholder:text-muted-foreground focus-visible:border-primary md:text-base"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-3 border-b border-primary md:flex-row md:items-end md:justify-between">
        <div role="group" aria-label="Filter by maintainer" className="flex gap-6">
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={source === tab.value}
              onClick={() => setSource(tab.value)}
              className={cn(
                "-mb-px inline-flex h-10 cursor-pointer items-center gap-2 border-b-2 text-[15px] font-medium transition-colors",
                source === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary",
              )}
            >
              {tab.label}
              <span className="text-[13px] tabular-nums">({counts[tab.value]})</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 pb-2" aria-label="Filter by database">
          {databases.map((value) => (
            <Chip
              key={value}
              active={database === value}
              onClick={() => setDatabase(database === value ? null : value)}
            >
              <Database aria-hidden />
              {getDatabaseLabel(value)}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/[0.25] px-6 py-14 text-center">
          <p className="text-primary">No extensions match.</p>
          <div className="flex gap-3">
            {hasActiveFilter ? (
              <Button variant="outline" onClick={clear}>
                Clear filters
              </Button>
            ) : null}
            <Button asChild>
              <a href="/extensions/submit">Submit an extension</a>
            </Button>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col">
          {filtered.map((entry) => (
            <ExtensionRow key={entry.slug} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}
