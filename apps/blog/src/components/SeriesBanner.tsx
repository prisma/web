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
          <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak font-semibold mb-1">
            Series
          </div>
          <Link
            href={seriesUrl}
            className="type-title-lg font-semibold text-foreground-neutral hover:text-foreground-ppg"
          >
            {series.title}
          </Link>
        </div>
        <Link
          href={seriesUrl}
          className="text-sm text-foreground-ppg hover:underline whitespace-nowrap"
        >
          View series page →
        </Link>
      </div>
      {series.description ? (
        <p className="text-sm text-foreground-neutral-weak mb-4">{series.description}</p>
      ) : null}
      <ol className="divide-y divide-stroke-neutral-strong/40 rounded-square border border-stroke-neutral-strong/60">
        {series.posts.map((post, i) => {
          const isCurrent = i + 1 === series.index;
          const label = (post.seriesIndex ?? i + 1).toString().padStart(2, "0");
          const inner = (
            <span className="flex items-baseline gap-3 px-4 py-2.5">
              <span className="shrink-0 text-xs tabular-nums text-foreground-neutral-weak">
                {label}
              </span>
              <span
                className={
                  isCurrent ? "font-semibold text-foreground-neutral" : "text-foreground-neutral"
                }
              >
                {post.title}
              </span>
              {isCurrent ? (
                <span className="ml-auto text-xs uppercase tracking-wide text-foreground-ppg">
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
                  className="block hover:bg-background-ppg/5 hover:text-foreground-ppg"
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
