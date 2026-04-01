import type { Metadata } from "next";
import Image from "next/image";
import { Action, Button, Card } from "@prisma/eclipse";
import { meetups, type Meetup } from "../events/events-data";

export const metadata: Metadata = {
  title: "Community | Prisma",
  description:
    "Join thousands of developers building with Prisma. Connect on Discord, get help on GitHub, watch tutorials on YouTube, and attend meetups around the world.",
  alternates: {
    canonical: "https://www.prisma.io/community",
  },
};

const channels = [
  {
    icon: "fa-brands fa-github",
    name: "GitHub",
    description: "Browse the source code, open issues, and contribute to Prisma and its ecosystem.",
    link: "https://github.com/prisma",
    cta: "View on GitHub",
  },
  {
    icon: "fa-brands fa-x-twitter",
    name: "X (Twitter)",
    description: "Follow @prisma for the latest updates, releases, and community highlights.",
    link: "https://twitter.com/prisma",
    cta: "Follow us",
  },
  {
    icon: "fa-brands fa-youtube",
    name: "YouTube",
    description:
      "Watch tutorials, conference talks, and live streams on the official Prisma channel.",
    link: "https://www.youtube.com/c/PrismaData",
    cta: "Watch videos",
  },
] as const;

const starterKit = [
  {
    icon: "fa-regular fa-book-open",
    title: "Read the docs",
    description: "Get started with Prisma ORM, Prisma Postgres, and all other Prisma products.",
    link: "/docs",
    cta: "Open docs",
    external: false,
  },
  {
    icon: "fa-brands fa-github",
    title: "Browse examples",
    description:
      "Explore ready-to-run example projects for REST, GraphQL, fullstack apps, and more.",
    link: "https://github.com/prisma/prisma-examples",
    cta: "See examples",
    external: true,
  },
  {
    icon: "fa-brands fa-youtube",
    title: "Watch & learn",
    description:
      "Livestreams, tutorials, and tech talks covering TypeScript, Node.js, and databases.",
    link: "https://www.youtube.com/c/PrismaData",
    cta: "Visit channel",
    external: true,
  },
] as const;

const contributingLinks = [
  {
    icon: "fa-brands fa-github",
    title: "Open an issue",
    description:
      "Found a bug or have a feature request? Open an issue on the Prisma GitHub repository.",
    link: "https://github.com/prisma/prisma/issues",
    cta: "Open issue",
  },
  {
    icon: "fa-regular fa-messages",
    title: "Join the discussion",
    description:
      "Ask questions, share ideas, and connect with the Prisma team on GitHub Discussions.",
    link: "https://github.com/prisma/prisma/discussions",
    cta: "Start discussion",
  },
  {
    icon: "fa-regular fa-code-branch",
    title: "Contributing guide",
    description: "Learn how to contribute code, docs, and improvements to the Prisma project.",
    link: "https://github.com/prisma/prisma/blob/main/CONTRIBUTING.md",
    cta: "Read guide",
  },
] as const;

export default function CommunityPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-background-default text-foreground-neutral">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-36 pb-12 md:pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="relative z-1 mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 text-center">
          <p className="m-0 flex items-center justify-center gap-2 text-base font-semibold uppercase tracking-[1.6px] text-foreground-orm-strong font-sans">
            <i className="fa-regular fa-users" aria-hidden />
            Community
          </p>
          <h1 className="m-0 text-foreground-neutral text-4xl md:text-5xl font-sans-display [font-variation-settings:'wght'_900]">
            Join the Prisma Community
          </h1>
          <p className="m-0 text-lg text-foreground-neutral-weak max-w-[560px]">
            Connect with thousands of developers building with Prisma. Ask questions, share your
            work, and help shape the future of the project.
          </p>
        </div>
      </section>

      {/* Connect with Prisma */}
      <section className="px-4 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1024px]">
          <h2 className="text-3xl font-sans-display [font-variation-settings:'wght'_900] text-foreground-neutral mb-6 mt-0">
            Connect with Prisma
          </h2>

          {/* Discord — featured */}
          <div className="group mb-4">
            <Card className="flex flex-col items-center text-center gap-4 p-6 transition-colors bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)] sm:flex-row sm:items-center sm:text-left sm:justify-between">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Action color="orm" size="4xl" className="shrink-0">
                  <i className="fa-brands fa-discord text-xl" aria-hidden />
                </Action>
                <div>
                  <h3 className="m-0 text-lg font-semibold text-foreground-neutral">Discord</h3>
                  <p className="m-0 mt-1 text-sm text-foreground-neutral-weak max-w-[540px]">
                    The heart of the Prisma community. Get help, share your projects, and connect
                    with thousands of developers.
                  </p>
                </div>
              </div>
              <Button
                variant="orm"
                size="lg"
                className="shrink-0 w-fit"
                href="https://pris.ly/discord"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord
                <i className="fa-regular fa-arrow-up-right ml-2" aria-hidden />
              </Button>
            </Card>
          </div>

          {/* Other channels */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {channels.map((channel) => (
              <a
                key={channel.name}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex h-full flex-col items-center text-center p-5 transition-colors bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)] hover:border-stroke-neutral-strong sm:items-start sm:text-left">
                  <div className="flex items-center gap-3">
                    <Action color="orm" size="4xl">
                      <i className={`${channel.icon} text-xl`} aria-hidden />
                    </Action>
                    <h3 className="m-0 text-base font-semibold text-foreground-neutral">
                      {channel.name}
                    </h3>
                  </div>
                  <p className="m-0 mt-3 text-sm leading-relaxed text-foreground-neutral-weak flex-1">
                    {channel.description}
                  </p>
                  <span className="mt-3 flex items-center gap-1 text-sm font-medium text-foreground-orm-strong">
                    {channel.cta}
                    <i
                      className="fa-regular fa-arrow-right text-xs ml-1 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Starter kit */}
      <section className="px-4 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1024px]">
          <div className="mb-6">
            <p className="m-0 text-sm font-semibold uppercase tracking-[1.6px] text-foreground-neutral-weaker font-sans">
              New to Prisma?
            </p>
            <h2 className="text-3xl font-sans-display [font-variation-settings:'wght'_900] text-foreground-neutral mt-1 mb-0">
              Here&apos;s a starter kit
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {starterKit.map((item) => (
              <a
                key={item.title}
                href={item.link}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group"
              >
                <Card className="flex h-full flex-col items-center text-center p-5 transition-colors bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)] hover:border-stroke-neutral-strong sm:items-start sm:text-left">
                  <div className="flex items-center gap-3">
                    <Action color="orm" size="4xl">
                      <i className={`${item.icon} text-xl`} aria-hidden />
                    </Action>
                    <h3 className="m-0 text-base font-semibold text-foreground-neutral">
                      {item.title}
                    </h3>
                  </div>
                  <p className="m-0 mt-3 text-sm leading-relaxed text-foreground-neutral-weak flex-1">
                    {item.description}
                  </p>
                  <span className="mt-3 flex items-center gap-1 text-sm font-medium text-foreground-orm-strong">
                    {item.cta}
                    <i
                      className="fa-regular fa-arrow-right text-xs ml-1 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Meetups */}
      <section className="px-4 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1024px]">
          <h2 className="text-3xl font-sans-display [font-variation-settings:'wght'_900] text-foreground-neutral mb-6 mt-0">
            Join us for regular meetups and events
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meetups.map((meetup: Meetup) => (
              <a
                key={meetup.title}
                href={meetup.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors hover:border-stroke-neutral-strong">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={meetup.image}
                      alt={meetup.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-base font-semibold text-foreground-neutral mt-0 mb-0">
                      {meetup.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground-neutral-weak line-clamp-3">
                      {meetup.description}
                    </p>
                    <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-foreground-orm-strong">
                      Join Meetup
                      <i
                        className="fa-regular fa-arrow-right text-xs ml-1 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="orm" size="lg" href="/events">
              See all events
              <i className="fa-regular fa-arrow-right ml-2" aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      {/* Contributing */}
      <section className="px-4 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1024px]">
          <div className="mb-6">
            <h2 className="text-3xl font-sans-display [font-variation-settings:'wght'_900] text-foreground-neutral mt-0 mb-2">
              Contributing to Prisma
            </h2>
            <p className="m-0 text-base text-foreground-neutral-weak max-w-[600px]">
              We welcome contributions of all forms from experienced developers and beginners alike.
              Showcase your projects, share your ideas, or help us improve Prisma with your
              feedback.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {contributingLinks.map((item) => (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex h-full flex-col items-center text-center p-5 transition-colors bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)] hover:border-stroke-neutral-strong sm:items-start sm:text-left">
                  <div className="flex items-center gap-3">
                    <Action color="orm" size="4xl">
                      <i className={`${item.icon} text-xl`} aria-hidden />
                    </Action>
                    <h3 className="m-0 text-base font-semibold text-foreground-neutral">
                      {item.title}
                    </h3>
                  </div>
                  <p className="m-0 mt-3 text-sm leading-relaxed text-foreground-neutral-weak flex-1">
                    {item.description}
                  </p>
                  <span className="mt-3 flex items-center gap-1 text-sm font-medium text-foreground-orm-strong">
                    {item.cta}
                    <i
                      className="fa-regular fa-arrow-right text-xs ml-1 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-indigo-400 before:blur-[100px]">
        <div className="my-8 p-6 md:my-12 md:p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                Be part of the community
              </h2>
              <p className="text-foreground-neutral-weak max-w-xl">
                Whether you&apos;re just getting started or have been building with Prisma for
                years, there&apos;s a place for you.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button
                variant="orm"
                size="2xl"
                href="https://pris.ly/discord"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Join Discord</span>
                <i className="fa-brands fa-discord ml-2" aria-hidden />
              </Button>
              <Button variant="default-stronger" size="2xl" href="/newsletter">
                <span>Subscribe to newsletter</span>
                <i className="fa-regular fa-arrow-right ml-2" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
