import { PostCard } from "./PostCard";
import type { SeriesContext } from "@/lib/series";

export function SeriesNavigation({ series }: { series: SeriesContext }) {
  if (!series.prev && !series.next) return null;

  return (
    <nav aria-label="Series navigation" className="grid gap-6 sm:grid-cols-2 my-12">
      {series.prev ? (
        <div>
          <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak mb-2">
            ← Previous in series
          </div>
          <PostCard post={series.prev} currentCategory="show-all" vertical />
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}
      {series.next ? (
        <div>
          <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak mb-2 sm:text-right">
            Next in series →
          </div>
          <PostCard post={series.next} currentCategory="show-all" vertical />
        </div>
      ) : null}
    </nav>
  );
}
