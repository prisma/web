import Link from "next/link";
import type { SeriesContext } from "@/lib/series";

export function SeriesMarker({ series }: { series: SeriesContext }) {
  const seriesUrl = `/series/${series.key}`;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground-neutral-weak">
      <i aria-hidden className="fa-regular fa-layer-group text-foreground-ppg" />
      <span>
        Part{" "}
        <span className="font-medium text-foreground-neutral">
          {series.index} of {series.total}
        </span>{" "}
        in the{" "}
        <Link
          href={seriesUrl}
          className="font-medium text-foreground-neutral hover:text-foreground-ppg hover:underline"
        >
          {series.title}
        </Link>{" "}
        series.
      </span>
      <Link href={seriesUrl} className="text-foreground-ppg hover:underline whitespace-nowrap">
        View full series →
      </Link>
    </div>
  );
}
