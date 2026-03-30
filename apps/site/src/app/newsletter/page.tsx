import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@prisma/eclipse";
import { NewsletterSignup } from "./newsletter-signup";

export const metadata: Metadata = {
  title: "Newsletter | Prisma",
  description:
    "Get release updates, tutorials, and more content delivered to your inbox monthly.",
  alternates: {
    canonical: "https://www.prisma.io/newsletter",
  },
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
        const m = block.match(
          new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`),
        );
        if (m) return m[1].trim();
        const m2 = block.match(
          new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`),
        );
        return m2 ? m2[1].trim() : "";
      };

      const imageFromRss = (() => {
        const enc = block.match(/<enclosure\b([^>]*)\/?>/i);
        if (!enc) return null;
        const attrs = enc[1];
        const typeM = attrs.match(/\btype="([^"]*)"/i);
        if (
          typeM &&
          typeM[1] &&
          !typeM[1].toLowerCase().startsWith("image/")
        ) {
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
    <main className="flex-1 w-full -mt-24 bg-background-default text-foreground-neutral">
      <section className="px-4 pt-36 pb-16">
        <div className="max-w-[720px] mx-auto flex flex-col items-center gap-6 text-center">
          <p className="m-0 flex items-center justify-center gap-2 text-base font-semibold uppercase tracking-[1.6px] text-foreground-ppg font-sans">
            <i className="fa-regular fa-bell" aria-hidden />
            Stay Updated
          </p>
          <h1 className="m-0 text-foreground-neutral text-5xl font-sans-display [font-variation-settings:'wght'_900]">
            Get our monthly newsletter
          </h1>
        </div>

        <Card className="mx-auto mt-10 max-w-[520px]">
          <CardHeader>
            <CardTitle className="text-lg font-sans-display">
              Sign up for the Prisma newsletter today
            </CardTitle>
            <CardDescription>
              Get release updates, tutorials, and more content delivered to your
              inbox monthly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewsletterSignup />
          </CardContent>
        </Card>
      </section>

      {posts.length > 0 && (
        <section className="px-4 pb-16 md:pb-20">
          <div className="mx-auto max-w-[1024px]">
            <h2 className="m-0 mb-8 text-center text-3xl font-sans-display [font-variation-settings:'wght'_900] text-foreground-neutral">
              Latest from the Blog
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.link} href={post.link}>
                  <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors hover:border-stroke-neutral-strong">
                    {post.image && (
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                    )}
                    <CardContent className="flex flex-1 flex-col gap-2 px-3 pb-3">
                      <CardTitle className="text-base font-semibold">
                        {post.title}
                      </CardTitle>
                      {post.description ? (
                        <CardDescription className="line-clamp-2">
                          {post.description}
                        </CardDescription>
                      ) : null}
                      <p className="m-0 flex items-center gap-1.5 text-xs text-foreground-neutral-weak">
                        <i className="fa-regular fa-calendar" aria-hidden />
                        {formatDate(post.date)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
