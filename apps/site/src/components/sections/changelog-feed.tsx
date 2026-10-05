"use client";

import { useMemo, useState } from "react";
import { ArrowRightBold } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type ChangelogCategory,
  type ChangelogEntry,
} from "@/lib/changelog-meta";
import { cn } from "@/lib/utils";

// The feed: a sticky category filter over a colour-coded release timeline.
// One client component because the tabs and the list share a single piece of
// filter state — the same call data/blog-browser makes. Twelve entries is far
// too few to debounce or round-trip, so filtering is a plain array filter in
// the client and the state stays out of the URL (no deep links to share yet).
//
// The timeline is the redesign's answer to the live changelog's flat numbered
// list: a vertical spine on desktop with a category-coloured node per entry,
// the date on a rail to its left, and the content in a card whose accent is the
// entry's product area. You can scan the colours down the spine and tell a
// Compute launch from an ORM fix without reading a word.

const FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type Filter = ChangelogCategory | "all";

export function ChangelogFeed({ entries: allEntries }: { entries: ChangelogEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  // Counts per category — totals over the whole feed that never change with the
  // active filter.
  const COUNTS = useMemo(
    () =>
      CATEGORY_ORDER.reduce<Record<string, number>>((acc, id) => {
        acc[id] = allEntries.filter((e) => e.category === id).length;
        return acc;
      }, {}),
    [allEntries],
  );

  const entries = useMemo(
    () => (filter === "all" ? allEntries : allEntries.filter((e) => e.category === filter)),
    [filter, allEntries],
  );

  return (
    <section className="bg-white px-4 pb-24 pt-12 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-4xl">
        {/* Sticky filter bar. Sits below the fixed header (top-16) with a
            frosted backer so entries scroll cleanly under it. */}
        <div className="sticky top-16 z-20 -mx-4 mb-14 px-4 py-3 sm:-mx-8 sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-white/80 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
          <div className="relative flex flex-wrap items-center justify-center gap-2">
            <FilterPill
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="All updates"
              count={allEntries.length}
            />
            {/* Only categories that actually have entries — a zero-count tab
                dead-ends to a blank timeline. Same rule blog-browser applies to
                its topic chips. */}
            {CATEGORY_ORDER.filter((id) => (COUNTS[id] ?? 0) > 0).map((id) => (
              <FilterPill
                key={id}
                active={filter === id}
                onClick={() => setFilter(id)}
                label={CATEGORY_META[id].label}
                count={COUNTS[id] ?? 0}
                dot={CATEGORY_META[id].dot}
                glow={CATEGORY_META[id].glow}
              />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <ol className="relative">
          {entries.map((entry, i) => (
            <TimelineRow
              key={entry.date + entry.title}
              entry={entry}
              isLast={i === entries.length - 1}
              delay={Math.min(i, 4) * 0.05}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  dot,
  glow,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dot?: string;
  glow?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-transparent bg-foreground text-primary-foreground"
          : "border-black/[0.09] bg-white text-foreground hover:border-foreground/30",
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn("size-2 shrink-0 rounded-full", dot)}
          style={active && glow ? { boxShadow: `0 0 8px ${glow}` } : undefined}
        />
      )}
      {label}
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

function TimelineRow({
  entry,
  isLast,
  delay,
}: {
  entry: ChangelogEntry;
  isLast: boolean;
  delay: number;
}) {
  const meta = CATEGORY_META[entry.category];
  return (
    // The li stays a direct child of the ol so the timeline reads as a list to
    // assistive tech; Reveal sits inside it and carries the row's grid.
    <li>
      <Reveal
        delay={delay}
        className="relative grid grid-cols-1 gap-x-8 md:grid-cols-[8.5rem_minmax(0,1fr)]"
      >
        {/* Date rail — desktop only, right-aligned onto the spine */}
        <div className="hidden md:flex md:flex-col md:items-end md:pt-1.5 md:text-right">
          <time dateTime={entry.date} className="text-sm font-semibold text-foreground">
            {FMT.format(new Date(entry.date))}
          </time>
          <span className={cn("mt-1.5 text-xs font-semibold", meta.text)}>{meta.label}</span>
        </div>

        {/* Content column — the spine is this column's left border; consecutive
            rows stack their borders into one continuous line. The node sits on
            it, punched through with a background-colored ring. */}
        <div
          className={cn(
            "relative md:border-l md:border-border md:pl-10",
            isLast ? "pb-0" : "pb-14 sm:pb-16",
          )}
        >
          {/* node */}
          <span
            aria-hidden
            className="absolute -left-[7px] top-1.5 hidden size-3.5 items-center justify-center md:flex"
          >
            {entry.highlight && (
              <span
                className="absolute size-6 rounded-full opacity-30 blur-md"
                style={{ background: meta.glow }}
              />
            )}
            <span
              className={cn("relative size-3.5 rounded-full ring-4 ring-background", meta.dot)}
            />
          </span>

          <EntryCard entry={entry} meta={meta} />
        </div>
      </Reveal>
    </li>
  );
}

function EntryCard({
  entry,
  meta,
}: {
  entry: ChangelogEntry;
  meta: (typeof CATEGORY_META)[ChangelogCategory];
}) {
  return (
    <a
      href={entry.href}
      className={cn(
        "group/card relative block overflow-hidden rounded-2xl border bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_10px_24px_-16px_rgba(21,21,21,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(21,21,21,0.05),0_18px_40px_-18px_rgba(21,21,21,0.22)] sm:p-7",
        entry.highlight
          ? "spectrum-border border-black/[0.08]"
          : "border-black/[0.08] hover:border-foreground/20",
      )}
    >
      {/* Every card blooms a wash of its category colour up from the bottom on
          hover — the panel idiom in miniature. Fades in only on hover so the
          resting feed stays clean and the colour reads as a reward for
          reaching for the card. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background: `radial-gradient(120% 100% at 20% 100%, color-mix(in srgb, ${meta.glow} 24%, transparent), transparent 70%)`,
        }}
      />

      <div className="relative">
        {/* meta row: category chip + date (date shows here on mobile, where the
            rail is hidden) */}
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.09] bg-white px-2 py-1 text-xs font-semibold leading-none text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.05)]">
            <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} />
            {meta.label}
          </span>
          {entry.highlight && (
            <span className={cn("text-xs font-semibold", meta.text)}>Highlight</span>
          )}
          <time
            dateTime={entry.date}
            className="text-xs font-medium text-muted-foreground md:hidden"
          >
            {FMT.format(new Date(entry.date))}
          </time>
        </div>

        <h2
          className={cn(
            "text-balance font-heading leading-snug text-foreground",
            entry.highlight ? "text-2xl" : "text-xl",
          )}
        >
          {entry.title}
        </h2>

        <p className="mt-2.5 text-pretty leading-relaxed text-muted-foreground">
          {entry.description}
        </p>

        {/* tags */}
        {entry.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <span className="spectrum-underline mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
          Read more
          <ArrowRightBold
            className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </a>
  );
}
