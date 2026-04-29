import { createPageMetadata } from "@/lib/page-metadata";
import { Card } from "@prisma/eclipse";

export const metadata = createPageMetadata({
  title: "Prisma | Our OSS Friends",
  description: "Promoting and supporting the open source community.",
  path: "/oss-friends",
  ogImage: "/og/og-oss-friends.png",
});

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
      <section className="px-4 pt-50 pb-12 md:pb-16">
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 text-center">
          <p className="m-0 flex items-center justify-center gap-2 text-base font-semibold uppercase tracking-[1.6px] text-foreground-ppg font-sans">
            <i className="fa-regular fa-heart" aria-hidden />
            Community
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
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
              <Card className="flex h-full flex-col justify-between gap-5 p-6 transition-colors hover:border-stroke-neutral-strong hover:bg-surface-elevated">
                <div className="flex flex-col gap-2">
                  <h3 className="m-0 text-base font-semibold text-foreground-neutral">
                    {friend.name}
                  </h3>
                  <p className="m-0 text-sm leading-relaxed text-foreground-neutral-weak line-clamp-3">
                    {friend.description}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-foreground-ppg">
                  Learn more
                  <i
                    className="fa-regular fa-arrow-right text-xs ml-1 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
