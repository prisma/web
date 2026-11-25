import { formatDate, formatTag } from "@/lib/format";
import type { BlogCardItem } from "./BlogGrid";

// The brand spectrum as text colours: a darker step in light mode so each
// clears 4.5:1 on white, a lighter one in dark mode for the dark card.
const BRAND_TEXT = {
  cyan: "text-prism-cyan-700 dark:text-prism-cyan-400",
  red: "text-prism-red-600 dark:text-prism-red-400",
  yellow: "text-prism-yellow-700 dark:text-prism-yellow-300",
} as const;
type BrandColour = keyof typeof BRAND_TEXT;

// Products keep their colour; any other tag gets one of the three from its
// name, so the same tag is always the same colour wherever it appears.
const PRODUCT_COLOUR: Record<string, BrandColour> = {
  "prisma-postgres": "cyan",
  postgres: "cyan",
  compute: "red",
  "prisma-compute": "red",
  orm: "yellow",
  "prisma-orm": "yellow",
};
const ORDER: BrandColour[] = ["cyan", "red", "yellow"];

function tagColour(tag: string): BrandColour {
  const known = PRODUCT_COLOUR[tag.toLowerCase()];
  if (known) return known;
  let hash = 0;
  for (const char of tag) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return ORDER[hash % ORDER.length];
}

/**
 * "Keep reading" after a post: two related posts as plain text links, not
 * the feed's full cards (client, 2026-11-25: "this is way too big", "just do
 * text for these … brand colours", "take these off cards"). Each is the tag
 * in a brand colour, the date, and the title clamped to two lines, which
 * takes the blog's cyan underline on hover. Two across
 * from sm up, stacked on phones. The feed and series navigation keep
 * PostCard.
 */
export function KeepReading({ posts }: { posts: BlogCardItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="keep-reading" className="mt-14">
      <h2
        id="keep-reading"
        className="m-0 mb-4 text-base font-semibold leading-snug text-foreground-neutral-strong"
      >
        Keep reading
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-5 p-0 sm:grid-cols-2">
        {posts.map((post) => {
          const rawTag = post.tags?.[0];
          const tag = rawTag ? formatTag(rawTag) : null;
          const date = formatDate(post.updatedAt ?? post.date);
          return (
            <li key={post.url} className="m-0 min-w-0">
              <a href={post.url} className="group flex flex-col gap-1.5 no-underline">
                <p className="m-0 flex flex-wrap items-center gap-x-1.5 text-xs text-foreground-neutral-weak">
                  {tag && rawTag ? (
                    <span className={`font-semibold ${BRAND_TEXT[tagColour(rawTag)]}`}>{tag}</span>
                  ) : null}
                  {tag && date ? <span aria-hidden>·</span> : null}
                  {date ? <span>{date}</span> : null}
                </p>
                <h3 className="m-0 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground-neutral-strong decoration-prism-cyan-400/60 decoration-[1.5px] underline-offset-[3.5px] group-hover:underline">
                  {post.title}
                </h3>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
