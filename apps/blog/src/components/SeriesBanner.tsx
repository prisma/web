import Link from "next/link";
import type { SeriesContext } from "@/lib/series";

export function SeriesBanner({ series }: { series: SeriesContext }) {
  const seriesUrl = `/series/${series.key}`;
  return (
    <aside
      id="series-overview"
      aria-label={`All posts in the ${series.title} series`}
      className="my-12"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="type-heading-2xs mb-1 text-foreground-neutral-weak">Series</div>
          <Link
            href={seriesUrl}
            className="type-title-lg text-foreground-neutral-strong transition-colors duration-300 hover:text-foreground-ppg motion-reduce:transition-none"
          >
            {series.title}
          </Link>
        </div>
        <Link
          href={seriesUrl}
          className="text-sm font-medium whitespace-nowrap text-foreground-ppg transition-colors duration-300 hover:text-foreground-ppg-strong motion-reduce:transition-none"
        >
          View series page →
        </Link>
      </div>
      {series.description ? (
        <p className="mb-4 text-sm leading-relaxed text-foreground-neutral-weak">
          {series.description}
        </p>
      ) : null}
      {/* Paper surface, hairline ring — a quiet index that sits under the
          article rather than competing with it. */}
      <ol className="divide-y divide-stroke-neutral overflow-hidden rounded-square-high border border-stroke-neutral bg-paper">
        {series.posts.map((post, i) => {
          const isCurrent = i + 1 === series.index;
          const label = (post.seriesIndex ?? i + 1).toString().padStart(2, "0");
          // Hover on non-current rows is the docs sidebar's move: the row
          // washes in `fd-accent` cyan and the title answers in
          // `fd-accent-foreground` via group-hover (the title carries an
          // explicit ink colour, so the wash alone would not recolour it).
          const inner = (
            <span className="flex items-baseline gap-3 px-4 py-3">
              <span className="shrink-0 text-xs tabular-nums text-foreground-neutral-weak">
                {label}
              </span>
              <span
                className={
                  isCurrent
                    ? "font-medium text-foreground-neutral-strong"
                    : "text-foreground-neutral transition-colors duration-300 group-hover:text-fd-accent-foreground motion-reduce:transition-none"
                }
              >
                {post.title}
              </span>
              {isCurrent ? (
                <span className="type-heading-2xs ml-auto shrink-0 rounded-circle bg-background-ppg px-2 py-0.5 text-foreground-ppg">
                  Reading
                </span>
              ) : null}
            </span>
          );
          return (
            <li key={post.slug}>
              {isCurrent ? (
                <span aria-current="true" className="block">
                  {inner}
                </span>
              ) : (
                <Link
                  href={post.url}
                  className="group block transition-colors duration-300 hover:bg-fd-accent motion-reduce:transition-none"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
