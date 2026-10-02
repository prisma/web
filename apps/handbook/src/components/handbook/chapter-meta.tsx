import { Badge } from "@prisma/eclipse";
import type { ChapterStatus as Status } from "@/lib/chapter-status";

const STATUS_LABEL: Record<Status, string> = {
  stub: "Stub",
  dictated: "Dictated, not yet structured",
  structured: "Structured, awaiting review",
  reviewed: "Reviewed",
};

// The line under the title: reading time, workflow status, last edit. All
// optional; renders nothing when there is nothing to say.
export function ChapterMeta({
  status,
  readingTime,
  lastModified,
}: {
  status?: Status;
  readingTime?: number;
  lastModified?: Date;
}) {
  if (!status && !readingTime && !lastModified) return null;

  return (
    <div
      className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fd-muted-foreground"
      data-markdown-ignore
    >
      {readingTime && <span>{readingTime} min read</span>}
      {lastModified && (
        <time dateTime={lastModified.toISOString()}>
          Updated{" "}
          {lastModified.toLocaleDateString("en", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      )}
      {status && (
        <Badge
          color={status === "reviewed" ? "ppg" : "neutral"}
          label={STATUS_LABEL[status]}
          size="md"
          className="rounded-full!"
        />
      )}
    </div>
  );
}
