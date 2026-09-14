import { createPageMetadata } from "@/lib/page-metadata";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { createCollectionPageStructuredData } from "@/lib/structured-data";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import {
  meetups,
  pastEvents,
  sponsoredEvents,
  type Meetup,
  type PastEvent,
  type SponsoredEvent,
} from "./events-data";

const PAGE_TITLE = "Prisma Events";
const PAGE_DESCRIPTION =
  "Find upcoming Prisma events and Meetups, see where the team will be speaking, and explore recordings and resources from past events.";

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/events",
  ogKicker: "Events",
});

const eventsStructuredData = createCollectionPageStructuredData({
  path: "/events",
  name: "Prisma Events",
  description: PAGE_DESCRIPTION,
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
    // Retired event pages have no link left to point at.
    ...pastEvents
      .filter((event): event is PastEvent & { link: string } => Boolean(event.link))
      .map((event) => ({
        name: event.name,
        url: event.link,
        description: event.description,
      })),
  ],
});

function MeetupCard({ meetup }: { meetup: Meetup }) {
  return (
    <a
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
  );
}

function SponsoredEventCard({ event }: { event: SponsoredEvent }) {
  return (
    <a
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-card-wash">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <p className="flex flex-1 items-center justify-center p-4 text-center text-sm font-semibold text-foreground">
        {event.name}
      </p>
    </a>
  );
}

const pastEventCardClass =
  "group flex flex-col gap-2 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)]";

function PastEventCard({ event }: { event: PastEvent }) {
  // Events whose page was retired render as a plain card: their old URLs all
  // redirect to the homepage, so a "Read more" that lands there is worse than
  // no link at all.
  const Container = event.link ? "a" : "div";
  const linkProps = event.link
    ? ({ href: event.link, target: "_blank", rel: "noopener noreferrer" } as const)
    : {};

  return (
    <Container {...linkProps} className={pastEventCardClass}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg leading-snug">{event.name}</h3>
        {event.virtual && (
          <span className="mt-0.5 shrink-0 rounded-full bg-prism-red-100 px-2.5 py-0.5 text-xs font-semibold text-prism-red-700">
            Virtual
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{event.date}</p>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {event.description}
      </p>
      {event.link ? (
        <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground">
          Read more
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      ) : null}
    </Container>
  );
}

export default function EventsPage() {
  return (
    <>
      <JsonLd id="events-structured-data" data={eventsStructuredData} />

      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(52% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-red-400) 16%, transparent), transparent 70%)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-red-400" className="justify-center">
                Events
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Prisma events
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Find out when the next event or Meetup is happening, at which conferences you can
                see Prisma folks, and explore the content from previous events.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pt-14 sm:px-8">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Upcoming events</h2>
          <div className="mt-8 rounded-2xl bg-card-wash p-7 sm:p-9">
            <p className="text-sm leading-relaxed text-muted-foreground">
              There are currently no upcoming events. Please check back soon.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pt-16 sm:px-8">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Prisma meetups</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {meetups.map((meetup) => (
              <MeetupCard key={meetup.title} meetup={meetup} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pt-16 sm:px-8">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Sponsored events</h2>
          <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
            Conferences and events we&apos;re proud to support.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {sponsoredEvents.map((event) => (
              <SponsoredEventCard key={event.name} event={event} />
            ))}
          </div>
          <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl bg-card-wash p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <h3 className="text-xl leading-snug">Want to partner on an event?</h3>
              <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                Send us your sponsorship deck.
              </p>
            </div>
            <a
              href="mailto:events@prisma.io"
              className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-red-700"
            >
              Contact us
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Past events</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <PastEventCard key={event.name} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
