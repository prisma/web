import Link from "next/link";
import { Badge } from "@prisma/eclipse";
import {
  getReleaseNotePreview,
  getSortedReleaseNotes,
} from "@/lib/changelog-source";
import { createPageMetadata } from "@/lib/page-metadata";
import { formatDate, formatTag } from "@/lib/format";

export const metadata = createPageMetadata({
  title: "Release Notes | Prisma",
  description:
    "Track Prisma release notes, product improvements, and rollout details in one markdown-driven changelog.",
  path: "/changelog",
  ogImage: "/og/og-changelog.png",
});

export default async function ChangelogPage() {
  const entries = getSortedReleaseNotes();
  const entriesWithPreview = await Promise.all(
    entries.map(async (entry) => ({
      entry,
      summary:
        entry.data.summary ??
        entry.data.description ??
        (entry.slugs[0] ? await getReleaseNotePreview(entry.slugs[0]) : null),
    })),
  );

  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 pt-40 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <section className="max-w-249 mx-auto px-4 relative z-2 flex flex-col gap-4 pb-8">
          <div className="flex items-center gap-2 text-foreground-ppg-strong type-title-sm">
            <i className="fa-regular fa-sparkles" aria-hidden />
            <span>Changelog</span>
          </div>
          <h1 className="type-title-3xl md:type-title-4xl lg:type-title-5xl m-0 font-sans-display text-foreground-neutral">
            The Latest News from Prisma
          </h1>
          <p className="m-0 max-w-[640px] text-base text-foreground-neutral md:text-lg">
            Here you’ll find all improvements and updates we’ve made to our
            products.
          </p>
        </section>
      </div>

      <section className="max-w-249 mx-auto px-4 py-8">
        <div className="grid gap-6 mt-12 grid-cols-1">
          {entriesWithPreview.map(({ entry, summary }) => {
            const tags = entry.data.tags ?? [];
            // Date-labeled entries set version to the date; showing both repeats it
            const versionLabel =
              entry.data.date &&
              entry.data.version ===
                new Date(entry.data.date).toISOString().slice(0, 10)
                ? null
                : entry.data.version;

            return (
              <Link
                key={entry.url}
                href={entry.url}
                className="group grid overflow-hidden border-b pb-4 sm:pb-6 border-stroke-neutral gap-8"
              >
                <div className="order-1 flex flex-col justify-between">
                  <div>
                    <div className="eyebrow flex gap-2 items-center flex-wrap">
                      {versionLabel ? (
                        <Badge
                          color="neutral"
                          label={versionLabel}
                          className="w-fit"
                        />
                      ) : null}
                      {tags.length > 0 ? (
                        <Badge
                          color="success"
                          label={formatTag(tags[0])}
                          className="w-fit"
                        />
                      ) : null}
                      <span className="text-xs text-foreground-neutral-weak">
                        {formatDate(new Date(entry.data.date).toISOString())}
                      </span>
                    </div>
                    <h2 className="text-foreground-neutral font-mona-sans mt-4 mb-2 text-md md:text-lg font-[650] sm:font-bold">
                      {entry.data.title}
                    </h2>
                    {summary ? (
                      <p className="text-sm text-foreground-neutral-weak line-clamp-2">
                        {summary}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
