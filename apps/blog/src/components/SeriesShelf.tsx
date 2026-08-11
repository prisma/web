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

// Same card language as PostCard: hairline at rest, spectrum ring on hover,
// shadow lift. Featured series sit on `card-wash` instead of the page surface.
const seriesSurface =
  "spectrum-border group relative flex h-full flex-col rounded-square-high border border-stroke-neutral p-5 shadow-box-low transition-[box-shadow,border-color] duration-500 hover:border-transparent hover:shadow-box motion-reduce:transition-none";

function SeriesCard({ item, variant }: { item: SeriesShelfItem; variant: "compact" | "full" }) {
  const featured = item.featured;
  return (
    <Link
      href={`/series/${item.key}`}
      // Dark cards take the docs' surface step (#1a1a1a on the #0f0f0f page)
      // so they read as raised panels, matching PostCard.
      className={cn(
        seriesSurface,
        featured ? "bg-card-wash" : "bg-background-default dark:bg-background-neutral-weak",
      )}
    >
      <div className="type-heading-2xs mb-2 flex items-center gap-2">
        {featured ? <span className="text-foreground-ppg">Featured</span> : null}
        <span className="text-foreground-neutral-weak">
          {item.count} {item.count === 1 ? "part" : "parts"}
        </span>
      </div>
      <div
        className={cn(
          "type-heading-lg text-foreground-neutral-strong",
          variant === "compact" ? "line-clamp-2" : null,
        )}
      >
        {item.title}
      </div>
      {item.description && variant === "full" ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground-neutral-weak">
          {item.description}
        </p>
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
        "group inline-flex max-w-full items-center gap-2 rounded-circle border px-3 py-1 text-xs font-medium transition-colors duration-300 motion-reduce:transition-none",
        featured
          ? "border-stroke-ppg bg-background-ppg text-foreground-neutral hover:bg-background-ppg-strong"
          : "border-stroke-neutral text-foreground-neutral-weak hover:border-stroke-ppg-weak hover:bg-fd-accent hover:text-fd-accent-foreground",
      )}
    >
      {featured ? (
        <span
          aria-hidden
          className="inline-block size-1.5 shrink-0 rounded-circle bg-prism-cyan-400"
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
      className="spectrum-border group mt-4 flex flex-col gap-2 rounded-square-high border border-stroke-neutral bg-card-wash p-5 shadow-box-low transition-[box-shadow,border-color] duration-500 hover:border-transparent hover:shadow-box motion-reduce:transition-none sm:p-6"
      aria-label={`Featured series: ${item.title}`}
    >
      <div className="type-heading-2xs flex items-center gap-2">
        <span className="text-foreground-ppg">Featured series</span>
        <span aria-hidden className="text-foreground-neutral-weaker">
          ·
        </span>
        <span className="text-foreground-neutral-weak">
          {item.count} {item.count === 1 ? "part" : "parts"}
        </span>
      </div>
      <div className="type-title-lg text-foreground-neutral-strong">{item.title}</div>
      {item.description ? (
        <p className="text-sm leading-relaxed text-foreground-neutral-weak">{item.description}</p>
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
    <section aria-label="Featured blog series" className="mb-10">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="type-heading-2xs shrink-0 text-foreground-neutral-weak">Series</span>
        <ul className="flex min-w-0 flex-wrap items-center gap-2">
          {chips.map((item) => (
            <li key={item.key} className="min-w-0 max-w-full">
              <SeriesChip item={item} />
            </li>
          ))}
        </ul>
        <Link
          href="/series"
          className="shrink-0 text-xs font-medium text-foreground-ppg transition-colors duration-300 hover:text-foreground-ppg-strong motion-reduce:transition-none"
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
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {series.map((item) => (
        <li key={item.key}>
          <SeriesCard item={item} variant="full" />
        </li>
      ))}
    </ul>
  );
}
