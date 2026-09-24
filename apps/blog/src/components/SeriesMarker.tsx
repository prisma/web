import Link from "next/link";
import type { SeriesContext } from "@/lib/series";

export function SeriesMarker({ series }: { series: SeriesContext }) {
  const seriesUrl = `/series/${series.key}`;
  return (
    <div className="mt-6 flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-square border border-stroke-neutral bg-paper px-3 py-2 text-sm text-foreground-neutral-weak">
      <i aria-hidden className="fa-regular fa-layer-group text-foreground-ppg" />
      <span>
        Part{" "}
        <span className="font-medium text-foreground-neutral-strong">
          {series.index} of {series.total}
        </span>{" "}
        in the{" "}
        <Link
          href={seriesUrl}
          className="font-medium text-foreground-neutral-strong underline decoration-prism-cyan-400/50 underline-offset-4 transition-colors duration-300 hover:decoration-prism-cyan-500 motion-reduce:transition-none"
        >
          {series.title}
        </Link>{" "}
        series.
      </span>
      <Link
        href={seriesUrl}
        className="font-medium whitespace-nowrap text-foreground-ppg transition-colors duration-300 hover:text-foreground-ppg-strong motion-reduce:transition-none"
      >
        View full series →
      </Link>
    </div>
  );
}
