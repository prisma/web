import { createPageMetadata } from "@/lib/page-metadata";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton } from "@/components/brand/prism-button";

export const metadata = createPageMetadata({
  title: "Community",
  description:
    "Have a question, idea, or contribution for Prisma ORM? You are not alone. Join hundreds of thousands of Prisma developers.",
  path: "/community",
  ogKicker: "Community",
});

// Ported from the old site's /community page (apps/site).

const CHANNELS = [
  {
    name: "GitHub",
    description: "Browse the source code, open issues, and contribute to Prisma and its ecosystem.",
    link: "https://github.com/prisma",
    cta: "View on GitHub",
  },
  {
    name: "X (Twitter)",
    description: "Follow @prisma for the latest updates, releases, and community highlights.",
    link: "https://twitter.com/prisma",
    cta: "Follow us",
  },
  {
    name: "YouTube",
    description:
      "Watch tutorials, conference talks, and live streams on the official Prisma channel.",
    link: "https://www.youtube.com/c/PrismaData",
    cta: "Watch videos",
  },
];

const STARTER_KIT = [
  {
    title: "Read the docs",
    description: "Get started with Prisma ORM, Prisma Postgres, and all other Prisma products.",
    link: "/docs",
    cta: "Open docs",
  },
  {
    title: "Browse examples",
    description:
      "Explore ready-to-run example projects for REST, GraphQL, fullstack apps, and more.",
    link: "https://github.com/prisma/prisma-examples",
    cta: "See examples",
  },
  {
    title: "Watch & learn",
    description:
      "Livestreams, tutorials, and tech talks covering TypeScript, Node.js, and databases.",
    link: "https://www.youtube.com/c/PrismaData",
    cta: "Visit channel",
  },
];

const CONTRIBUTING = [
  {
    title: "Open an issue",
    description:
      "Found a bug or have a feature request? Open an issue on the Prisma GitHub repository.",
    link: "https://github.com/prisma/prisma/issues",
    cta: "Open issue",
  },
  {
    title: "Join the discussion",
    description:
      "Ask questions, share ideas, and connect with the Prisma team on GitHub Discussions.",
    link: "https://github.com/prisma/prisma/discussions",
    cta: "Start discussion",
  },
  {
    title: "Contributing guide",
    description: "Learn how to contribute code, docs, and improvements to the Prisma project.",
    link: "https://github.com/prisma/prisma/blob/main/CONTRIBUTING.md",
    cta: "Read guide",
  },
];

const MEETUPS = [
  {
    title: "Berlin Prisma Meetup",
    description:
      "Join with other local engineers to discuss the latest database and API developments and learn more about Prisma best practices.",
    image: "https://secure.meetupstatic.com/photos/event/9/9/b/2/clean_498279346.jpeg",
    link: "https://www.meetup.com/Berlin-Prisma-Meetup/",
  },
  {
    title: "TypeScript Berlin Meetup",
    description:
      "For anyone interested in JavaScript frameworks and TypeScript in particular. A Meetup to share knowledge, use cases and solve real problems using technology.",
    image: "https://secure.meetupstatic.com/photos/event/8/6/8/b/600_498214443.jpeg",
    link: "https://www.meetup.com/TypeScript-Berlin/",
  },
  {
    title: "GraphQL Berlin Meetup",
    description:
      "A regular meetup of people interested in GraphQL and its ecosystem, with speakers from all around the globe on the latest developments in the GraphQL world.",
    image: "https://secure.meetupstatic.com/photos/event/d/4/5/c/clean_498234364.jpeg",
    link: "https://www.meetup.com/graphql-berlin/",
  },
];

function LinkCardGrid({
  items,
}: {
  items: { title: string; description: string; link: string; cta: string }[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item) => (
        <a
          key={item.title}
          href={item.link}
          className="group flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)] sm:p-7"
        >
          <h3 className="text-lg leading-snug">{item.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground">
            {item.cta}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
          </span>
        </a>
      ))}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-yellow-300" className="justify-center">
                Community
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Join the Prisma community
              </h1>
              <p className="mt-6 max-w-[48ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Connect with thousands of developers building with Prisma. Ask questions, share your
                work, and help shape the future of the project.
              </p>
              <div className="mt-8">
                <PrismButton href="https://pris.ly/discord">Join us on Discord</PrismButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pt-14 sm:px-8">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Connect with Prisma</h2>
          <div className="mt-8">
            <LinkCardGrid
              items={CHANNELS.map((c) => ({
                title: c.name,
                description: c.description,
                link: c.link,
                cta: c.cta,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pt-16 sm:px-8">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">New here? Start with</h2>
          <div className="mt-8">
            <LinkCardGrid items={STARTER_KIT} />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pt-16 sm:px-8">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Meetups and events</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MEETUPS.map((meetup) => (
              <a
                key={meetup.title}
                href={meetup.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)]"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-card-wash">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meetup.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="text-lg leading-snug">{meetup.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {meetup.description}
                  </p>
                  <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground">
                    Join meetup
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Contribute to Prisma</h2>
          <div className="mt-8">
            <LinkCardGrid items={CONTRIBUTING} />
          </div>
        </div>
      </section>
    </>
  );
}
