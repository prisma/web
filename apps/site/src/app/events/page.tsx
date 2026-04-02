import { createPageMetadata } from "@/lib/page-metadata";
import { JsonLd } from "@/components/json-ld";
import { createCollectionPageStructuredData } from "@/lib/structured-data";
import { Badge, Button, Card, CardContent } from "@prisma/eclipse";
import Image from "next/image";
import {
  meetups,
  pastEvents,
  sponsoredEvents,
  type Meetup,
  type PastEvent,
  type SponsoredEvent,
} from "./events-data";

export const metadata = createPageMetadata({
  title: "Prisma Events",
  description:
    "Upcoming events or meetups, conferences and and explore the content from previous events.",
  path: "/events",
  ogImage: "/og/og-events.png",
});

const eventsStructuredData = createCollectionPageStructuredData({
  path: "/events",
  name: "Prisma Events",
  description:
    "Find upcoming Prisma events and Meetups, see where the team will be speaking, and explore recordings and resources from past events.",
  items: [
    ...meetups.map((meetup) => ({
      name: meetup.title,
      url: meetup.link,
      description: meetup.description,
    })),
    ...sponsoredEvents.map((event) => ({
      name: event.name,
      url: event.link,
      description: "Sponsored event supported by Prisma.",
    })),
    ...pastEvents.map((event) => ({
      name: event.name,
      url: event.link,
      description: event.description,
    })),
  ],
});

export default function EventsPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-background-default text-foreground-neutral">
      <JsonLd id="events-structured-data" data={eventsStructuredData} />
      {/* Hero */}
      <section className="px-4 pt-50 pb-12 md:pb-16">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center">
          <p className="flex items-center gap-2 text-sm stretch-display font-semibold uppercase tracking-[1.6px] text-foreground-ppg font-sans">
            <i className="fa-regular fa-calendar" aria-hidden />
            Events
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
            Prisma Events
          </h1>
          <p className="text-lg text-foreground-neutral-weak max-w-[600px]">
            Find out when the next event or Meetup is happening, at which
            conferences you can see Prisma folks, and explore the content from
            previous events.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="px-4 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1024px]">
          <h2 className="text-3xl font-black! font-sans-display text-foreground-neutral mb-6 mt-0">
            Upcoming Events
          </h2>
          <Card className="p-8">
            <p className="text-foreground-neutral-weak">
              There are currently no upcoming events. Please check back soon.
            </p>
          </Card>
        </div>
      </section>

      {/* Meetups */}
      <section className="px-4 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1024px]">
          <h2 className="text-3xl font-black! font-sans-display text-foreground-neutral mb-6 mt-0">
            Prisma Meetups
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
                    <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-foreground-ppg">
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
        </div>
      </section>

      {/* Sponsored Events */}
      <section className="px-4 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1024px]">
          <h2 className="text-3xl font-black! font-sans-display text-foreground-neutral mb-4 mt-0">
            Sponsored Events
          </h2>
          <p className="mb-6 text-foreground-neutral-weak">
            Conferences and events we&apos;re proud to support.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sponsoredEvents.map((event: SponsoredEvent) => (
              <a
                key={event.name}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex flex-col overflow-hidden p-0 h-full transition-colors hover:border-stroke-neutral-strong">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex flex-1 items-center justify-center pb-3">
                    <p className="text-center text-sm font-semibold text-foreground-neutral mt-0 mb-0">
                      {event.name}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm text-foreground-neutral-weak text-center sm:text-left">
              Want to partner on an event? Send us your sponsorship deck.
            </p>
            <Button
              variant="ppg"
              size="lg"
              href="mailto:events@prisma.io"
              className="w-fit"
            >
              <i className="fa-regular fa-envelope mr-2" aria-hidden />
              Contact us
            </Button>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="px-4 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1024px]">
          <h2 className="text-3xl font-black! font-sans-display text-foreground-neutral mb-6 mt-0">
            Past Events
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event: PastEvent) => (
              <a
                key={event.name}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex h-full flex-col gap-3 p-5 transition-colors hover:border-stroke-neutral-strong">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground-neutral mt-0 mb-0">
                      {event.name}
                    </h3>
                    {event.virtual && <Badge color="neutral" label="Virtual" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground-neutral-weaker">
                    <i className="fa-regular fa-calendar" aria-hidden />
                    {event.date}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground-neutral-weak line-clamp-3">
                    {event.description}
                  </p>
                  <span className="mt-auto flex items-center gap-1 pt-1 text-sm font-medium text-foreground-ppg">
                    Read more
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
    </main>
  );
}
