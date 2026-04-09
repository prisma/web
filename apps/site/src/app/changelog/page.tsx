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
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <section className="pt-20 pb-12 mt-10">
        <p className="m-0 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[1.8px] text-foreground-ppg">
          <i className="fa-regular fa-sparkles" aria-hidden />
          Changelog
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
          The Latest News from Prisma
        </h1>
        <p className="m-0 max-w-[640px] mx-auto text-center text-base text-foreground-neutral-weak md:text-lg">
          Here you’ll find all improvements and updates we’ve made to our
          products.
        </p>
      </section>

      <section>
        <div className="grid gap-6 mt-12 grid-cols-1">
          {entriesWithPreview.map(({ entry, summary }) => {
            const tags = entry.data.tags ?? [];

            return (
              <Link
                key={entry.url}
                href={entry.url}
                className="group grid overflow-hidden border-b pb-4 sm:pb-6 border-stroke-neutral gap-8"
              >
                <div className="order-1 flex flex-col justify-between">
                  <div>
                    <div className="eyebrow flex gap-2 items-center flex-wrap">
                      <Badge
                        color="neutral"
                        label={entry.data.version}
                        className="w-fit"
                      />
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
