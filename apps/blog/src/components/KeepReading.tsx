import { formatDate, formatTag } from "@/lib/format";
import { versionPublicImage } from "@/lib/public-image-version";
import { withBlogBasePathForImageSrc } from "@/lib/url";
import type { BlogCardItem } from "./BlogGrid";

/**
 * "Keep reading" after a post: two related posts as compact rows, not the
 * feed's full cards (client, 2026-11-25: "this is way too big"). Each row is
 * a small thumbnail beside the tag, date and a title clamped to two lines;
 * no excerpt or byline, since the reader has just finished an article and
 * needs a next step, not another page to scan. Two across from sm up,
 * stacked on phones. The feed and series navigation keep PostCard.
 */
export function KeepReading({ posts }: { posts: BlogCardItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="keep-reading" className="my-14">
      <h2
        id="keep-reading"
        className="m-0 mb-4 text-lg font-semibold leading-snug text-foreground-neutral-strong"
      >
        Keep reading
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
        {posts.map((post) => {
          const imageSrc = post.imageSrc
            ? versionPublicImage(withBlogBasePathForImageSrc(post.imageSrc))
            : null;
          const tag = post.tags?.[0] ? formatTag(post.tags[0]) : null;
          const date = formatDate(post.updatedAt ?? post.date);
          return (
            <li key={post.url} className="m-0 min-w-0">
              <a
                href={post.url}
                className="group flex h-full items-center gap-4 rounded-xl border border-stroke-neutral bg-background-default p-3 no-underline shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[box-shadow,border-color] duration-200 hover:border-foreground-neutral/20 hover:shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_20px_-12px_rgba(21,21,21,0.16)] motion-reduce:transition-none dark:bg-background-neutral-weak"
              >
                {imageSrc ? (
                  <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-background-neutral sm:w-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="m-0 flex flex-wrap items-center gap-x-1.5 text-xs text-foreground-neutral-weak">
                    {tag ? <span className="font-medium text-foreground-ppg">{tag}</span> : null}
                    {tag && date ? <span aria-hidden>·</span> : null}
                    {date ? <span>{date}</span> : null}
                  </p>
                  <h3 className="m-0 mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground-neutral-strong">
                    {post.title}
                  </h3>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
