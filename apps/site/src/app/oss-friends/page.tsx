import type { Metadata } from "next";
import { Button, Card } from "@prisma/eclipse";
import { ArrowUpRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "OSS Friends | Prisma",
  description:
    "Discover open-source projects and communities that we love and support.",
  alternates: {
    canonical: "https://www.prisma.io/oss-friends",
  },
};

type OSSFriend = {
  href: string;
  name: string;
  description: string;
};

async function getOSSFriends(): Promise<OSSFriend[]> {
  try {
    const res = await fetch("https://formbricks.com/api/oss-friends", {
      next: { revalidate: 3600 },
    });
    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : (raw.data ?? raw.friends ?? []);
    return list as OSSFriend[];
  } catch {
    return [];
  }
}

export default async function OSSFriendsPage() {
  const friends = await getOSSFriends();

  return (
    <main className="flex-1 w-full -mt-24 bg-background-default text-foreground-neutral">
      <section className="px-4 pt-36 pb-12 md:pb-16">
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 text-center">
          <p className="m-0 flex items-center justify-center gap-2 text-base font-semibold uppercase tracking-[1.6px] text-foreground-ppg font-sans">
            <Heart className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
            Community
          </p>
          <h1 className="m-0 text-foreground-neutral text-5xl font-sans-display [font-variation-settings:'wght'_900]">
            OSS Friends
          </h1>
          <p className="m-0 text-lg text-foreground-neutral-weak max-w-[560px]">
            Open-source projects and communities that we love and support.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1024px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend, idx) => (
            <a
              key={idx}
              href={friend.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="flex h-full flex-col justify-between gap-5 p-6 transition-colors hover:border-stroke-neutral-strong hover:bg-surface-elevated dark:bg-[#0A101D]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="m-0 text-base font-semibold text-foreground-neutral">
                      {friend.name}
                    </h3>
                    <ArrowUpRight className="size-4 shrink-0 text-foreground-neutral-weaker opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="m-0 text-sm leading-relaxed text-foreground-neutral-weak line-clamp-3">
                    {friend.description}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground-ppg">
                  Learn more
                </span>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
