import type { Metadata } from "next";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";

export const metadata: Metadata = {
  alternates: { canonical: "/programs/oss-friends" },
  title: "Our OSS Friends",
  description: "Promoting and supporting the open source community.",
};

// Ported from the old site's /oss-friends page, same community-maintained
// list, fetched from the shared OSS-friends API.
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
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-red-400" className="justify-center">
                Open source
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Our OSS friends
              </h1>
              <p className="mt-6 max-w-[48ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Open-source projects and communities that we love and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 pt-14 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          {friends.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Couldn&apos;t load the list right now, check back soon.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <a
                  key={friend.name}
                  href={friend.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)] sm:p-7"
                >
                  <h2 className="text-lg leading-snug">{friend.name}</h2>
                  <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                    {friend.description}
                  </p>
                  <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground">
                    Visit project
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
