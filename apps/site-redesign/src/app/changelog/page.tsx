import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import {
  extractPreview,
  formatChangelogDate,
  getChangelogEntries,
} from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "New features, improvements, and fixes across Prisma ORM, Prisma Postgres, and the Prisma platform.",
};

// Ported from the old site's /changelog (apps/site): same MDX entries, listed
// newest first as a single timeline.
export default function ChangelogPage() {
  const entries = getChangelogEntries();

  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Changelog
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                What&apos;s new in Prisma
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                New features, improvements, and fixes across Prisma ORM, Prisma Postgres, and the
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 pt-14 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-3xl">
          <ol className="flex flex-col">
            {entries.map((entry) => {
              const preview = extractPreview(entry.content);
              return (
                <li
                  key={entry.slug}
                  className="group relative border-l border-black/[0.08] pb-12 pl-8 last:pb-0"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[5px] top-[0.4rem] size-[9px] rounded-full bg-prism-cyan-400 ring-4 ring-white"
                  />
                  <time
                    dateTime={entry.frontmatter.date}
                    className="text-sm font-semibold text-foreground/60"
                  >
                    {formatChangelogDate(entry.frontmatter.date)}
                  </time>
                  <h2 className="mt-2 text-xl leading-snug sm:text-2xl">
                    <Link
                      href={`/changelog/${entry.slug}`}
                      className="transition-colors hover:text-prism-cyan-700"
                    >
                      {entry.frontmatter.headline ?? entry.frontmatter.title}
                    </Link>
                  </h2>
                  {preview && (
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {preview}
                    </p>
                  )}
                  <Link
                    href={`/changelog/${entry.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
                  >
                    Read more
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
