import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { NewsletterSignup } from "./newsletter-signup";

export const metadata: Metadata = {
  alternates: { canonical: "/newsletter" },
  title: "Sign up for Prisma's monthly newsletter",
  description:
    "The Prisma newsletter is packed with all the latest releases, updates, blogs, and more. Sign up today to stay up-to-date with Prisma.",
};

type RssItem = {
  title: string;
  link: string;
  date: string;
  description: string;
  image: string | null;
};

async function getLatestBlogPosts(count = 3): Promise<RssItem[]> {
  try {
    const res = await fetch("https://www.prisma.io/blog/rss.xml", {
      next: { revalidate: 3600 },
    });
    const xml = await res.text();

    const items: RssItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xml)) !== null && items.length < count) {
      const block = match[1];
      const get = (tag: string) => {
        const m = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
        if (m) return m[1].trim();
        const m2 = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
        return m2 ? m2[1].trim() : "";
      };

      const imageFromRss = (() => {
        const enc = block.match(/<enclosure\b([^>]*)\/?>/i);
        if (!enc) return null;
        const attrs = enc[1];
        const typeM = attrs.match(/\btype="([^"]*)"/i);
        if (typeM && typeM[1] && !typeM[1].toLowerCase().startsWith("image/")) {
          return null;
        }
        const urlM = attrs.match(/\burl="([^"]+)"/i);
        return urlM?.[1] ?? null;
      })();
      const imageLegacy = block.match(/<image\s+href="([^"]+)"/)?.[1] ?? null;
      const image = imageFromRss ?? imageLegacy;

      items.push({
        title: get("title"),
        link: get("link"),
        date: get("pubDate"),
        description: get("description").replace(/<|>/g, "").slice(0, 200),
        image,
      });
    }

    return items;
  } catch {
    return [];
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function NewsletterPage() {
  const posts = await getLatestBlogPosts(3);

  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-yellow-300" className="justify-center">
                Newsletter
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Get our monthly newsletter
              </h1>
              <p className="mt-6 max-w-[48ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Release updates, tutorials, and more content delivered to your inbox monthly.
              </p>
              <div className="mt-8 w-full max-w-md text-left">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="bg-white px-4 pb-24 pt-16 sm:px-8 sm:pb-32">
          <div className="mx-auto max-w-site">
            <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              Latest from the blog
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.link}
                  href={post.link}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)]"
                >
                  {post.image && (
                    <div className="relative aspect-video w-full overflow-hidden bg-[#eef4f3]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h3 className="text-lg leading-snug">{post.title}</h3>
                    {post.description ? (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.description}
                      </p>
                    ) : null}
                    <span className="mt-auto flex items-center justify-between pt-2 text-sm text-muted-foreground">
                      {formatDate(post.date)}
                      <ArrowRight
                        className="size-4 text-foreground transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
