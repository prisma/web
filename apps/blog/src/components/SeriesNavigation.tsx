import Link from "next/link";
import type { SeriesContext } from "@/lib/series";

export function SeriesNavigation({ series }: { series: SeriesContext }) {
  if (!series.prev && !series.next) return null;

  return (
    <nav aria-label="Series navigation" className="grid gap-4 sm:grid-cols-2 my-12">
      {series.prev ? (
        <Link
          href={series.prev.url}
          className="group block rounded-square border border-stroke-neutral-strong p-5 transition-colors hover:border-stroke-ppg hover:bg-background-ppg/5"
        >
          <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak mb-1">
            ← Previous in series
          </div>
          <div className="font-semibold text-foreground-neutral group-hover:text-foreground-ppg">
            {series.prev.title}
          </div>
        </Link>
      ) : (
        <div />
      )}
      {series.next ? (
        <Link
          href={series.next.url}
          className="group block rounded-square border border-stroke-neutral-strong p-5 transition-colors hover:border-stroke-ppg hover:bg-background-ppg/5 sm:text-right"
        >
          <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak mb-1">
            Next in series →
          </div>
          <div className="font-semibold text-foreground-neutral group-hover:text-foreground-ppg">
            {series.next.title}
          </div>
        </Link>
      ) : null}
    </nav>
  );
}
