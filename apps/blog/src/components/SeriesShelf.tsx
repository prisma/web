import Link from "next/link";
import { cn } from "@prisma-docs/ui/lib/cn";

export type SeriesShelfItem = {
  key: string;
  title: string;
  description?: string;
  count: number;
  featured?: boolean;
};

// Total chips shown in the home shelf (featured + popular non-featured).
const CHIP_LIMIT = 2;

function SeriesCard({ item, variant }: { item: SeriesShelfItem; variant: "compact" | "full" }) {
  const featured = item.featured;
  return (
    <Link
      href={`/series/${item.key}`}
      className={cn(
        "group relative flex h-full flex-col rounded-square border p-4 transition-colors",
        featured
          ? "border-stroke-ppg bg-background-ppg/5 hover:bg-background-ppg/10"
          : "border-stroke-neutral-strong hover:border-stroke-ppg hover:bg-background-ppg/5",
      )}
    >
      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide font-semibold">
        {featured ? <span className="text-foreground-ppg">Featured</span> : null}
        <span className="text-foreground-neutral-weak">
          {item.count} {item.count === 1 ? "part" : "parts"}
        </span>
      </div>
      <div
        className={cn(
          "font-semibold text-foreground-neutral group-hover:text-foreground-ppg",
          variant === "compact" ? "line-clamp-2" : null,
        )}
      >
        {item.title}
      </div>
      {item.description && variant === "full" ? (
        <p className="mt-1 text-sm text-foreground-neutral-weak line-clamp-3">{item.description}</p>
      ) : null}
    </Link>
  );
}

function SeriesChip({ item }: { item: SeriesShelfItem }) {
  const featured = item.featured;
  return (
    <Link
      href={`/series/${item.key}`}
      className={cn(
        "group inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        featured
          ? "border-stroke-ppg bg-background-ppg/5 text-foreground-neutral hover:bg-background-ppg/15"
          : "border-stroke-neutral-strong text-foreground-neutral-weak hover:border-stroke-ppg hover:text-foreground-neutral",
      )}
    >
      {featured ? (
        <span
          aria-hidden
          className="inline-block size-1.5 shrink-0 rounded-full bg-foreground-ppg"
        />
      ) : null}
      <span className="truncate">{item.title}</span>
      <span className="shrink-0 text-foreground-neutral-weak tabular-nums">{item.count}</span>
    </Link>
  );
}

function FeaturedHighlight({ item }: { item: SeriesShelfItem }) {
  return (
    <Link
      href={`/series/${item.key}`}
      className="group mt-3 flex flex-col gap-2 rounded-square border border-stroke-ppg bg-gradient-to-br from-background-ppg/10 to-background-ppg/0 p-4 transition-colors hover:from-background-ppg/15 sm:p-5"
      aria-label={`Featured series: ${item.title}`}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide font-semibold">
        <span className="text-foreground-ppg">Featured series</span>
        <span aria-hidden className="text-foreground-neutral-weak">
          ·
        </span>
        <span className="text-foreground-neutral-weak">
          {item.count} {item.count === 1 ? "part" : "parts"}
        </span>
      </div>
      <div className="type-title-lg font-semibold text-foreground-neutral group-hover:text-foreground-ppg">
        {item.title}
      </div>
      {item.description ? (
        <p className="text-sm text-foreground-neutral-weak">{item.description}</p>
      ) : null}
      <div className="mt-1 text-sm font-medium text-foreground-ppg">Explore the series →</div>
    </Link>
  );
}

/**
 * Home page series surface: a small chip row plus a prominent highlight
 * card for the single most important series. Built to sit between the
 * tag filter row and the post grid.
 */
export function FeaturedSeriesShelf({ series }: { series: SeriesShelfItem[] }) {
  if (series.length === 0) return null;

  const featured = series.filter((s) => s.featured);
  const nonFeatured = series.filter((s) => !s.featured);

  const chips: SeriesShelfItem[] = [...featured, ...nonFeatured].slice(0, CHIP_LIMIT);

  const highlight = featured[0] ?? null;

  return (
    <section aria-label="Featured blog series" className="mt-6 mb-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="shrink-0 text-xs uppercase tracking-wide font-semibold text-foreground-neutral-weak">
          Series
        </span>
        <ul className="flex flex-wrap items-center gap-2">
          {chips.map((item) => (
            <li key={item.key} className="min-w-0">
              <SeriesChip item={item} />
            </li>
          ))}
        </ul>
        <Link
          href="/series"
          className="shrink-0 text-xs text-foreground-ppg hover:underline"
        >
          View all series →
        </Link>
      </div>
      {highlight ? <FeaturedHighlight item={highlight} /> : null}
    </section>
  );
}

/**
 * Full index of every series, used on /blog/series. Featured items render
 * first with a brand-accented border.
 */
export function SeriesIndexGrid({ series }: { series: SeriesShelfItem[] }) {
  if (series.length === 0) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {series.map((item) => (
        <li key={item.key}>
          <SeriesCard item={item} variant="full" />
        </li>
      ))}
    </ul>
  );
}
