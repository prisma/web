import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Drift: two slow marquee rows of quote cards moving in opposite directions,
// sharing the motion vocabulary (and keyframes) of the logo carousel above —
// the page reads as one system. Hovering anywhere on the strip pauses both
// rows; reduced-motion swaps the drift for plain scrollable rows.
// Quotes sourced verbatim (trimmed) from prisma.io customer case studies
// (Bucket, Solin, Grover, Invisible, Poppy, Pearly Plan) and the showcase's
// community quotes (Cal.com, Gamma, Stellate, Trunk, Memberstack, Instatus).
// Client logos are the real brand marks (/logos/customers/*.png) where a
// square mark exists; the rest use letter chips.

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Prisma makes database management incredibly easy. Prisma's built-in type safety helps us avoid mistakes that happen with manual setups.",
    name: "Ron Cohen",
    role: "Co-founder & CTO",
    company: "Bucket",
  },
  {
    quote:
      "We are able to take advantage of caching to speed up queries and reduce latency, making them lightning fast.",
    name: "Blake Carroll",
    role: "CTO",
    company: "Solin",
    logo: "/logos/customers/solin.png",
  },
  {
    quote:
      "Prisma has a low learning curve. Productivity becomes higher because it gets combined with end-to-end type-safety using TypeScript.",
    name: "Ricardo Almeida",
    role: "Software Engineer",
    company: "Grover",
    logo: "/logos/customers/grover.png",
  },
  {
    quote:
      "Prisma's approach to type-safe ORM is next-level. It provides full type-safety without any codegen or messy types and interfaces to write and maintain.",
    name: "Pieter Venter",
    role: "Sr. Software Engineer",
    company: "Invisible",
    logo: "/logos/customers/invisible.png",
  },
  {
    quote:
      "The combination of Prisma, TypeScript and our pretty thorough coverage with integration tests gives us the confidence to refactor critical parts of our code.",
    name: "Thibaut Nguyen",
    role: "CTO",
    company: "Poppy",
    logo: "/logos/customers/poppy.png",
  },
  {
    quote:
      "This is the fastest I've ever developed in my life, by far. The tooling has dramatically cut down on the amount of time I've had to spend.",
    name: "Sean Emmer",
    role: "CTO & Co-Founder",
    company: "Pearly Plan",
    logo: "/logos/customers/pearly.png",
  },
  {
    quote:
      "We chose Prisma because it provides us with type safety directly from the database. It has helped us tremendously to catch possible errors early on.",
    name: "Omar López",
    role: "Sr. Software Engineer",
    company: "Cal.com",
  },
  {
    quote:
      "We've proudly built the core of our APIs on top of Prisma, and we are very happy that we did. It doesn't make us jump through unnecessary hoops to get normal work done and generally just works.",
    name: "James Fox",
    role: "Co-Founder",
    company: "Gamma",
  },
  {
    quote:
      "Prisma is the best ORM I have ever used, I never want to use anything else again. The excellent developer experience with its incredible TypeScript support sold me at first.",
    name: "Max Stoiber",
    role: "Founder",
    company: "Stellate",
  },
  {
    quote:
      "Prisma is a professional enterprise-ready tool that is easy to start using, ramp up and scale. It is the type of tool developed for the software engineers of today.",
    name: "Matt Matheson",
    role: "Co-Founder",
    company: "Trunk",
  },
  {
    quote:
      "Prisma has been an absolute game changer for Memberstack. It has helped us move faster while also improving product stability.",
    name: "Tyler Bell",
    role: "Co-founder",
    company: "Memberstack",
  },
  {
    quote:
      "I chose Prisma because of its clean API, nice developer experience and type safety. It helped me ship v1 of Instatus really fast.",
    name: "Ali Salah",
    role: "Founder",
    company: "Instatus",
  },
];

// Six unique quotes per row, interleaving case-study and showcase voices; a
// half-track is ~2,200px, so a quote only recurs a full loop apart — never
// twice inside a normal viewport. The half-track is still doubled so the
// -50% loop stays seamless on ultrawide screens, and the durations are
// paired to the longer tracks so the drift speed stays calm. Slightly
// different speeds keep the two rows from ever locking into step.
const ROWS: { items: Testimonial[]; reverse?: boolean; durationClass: string }[] = [
  {
    items: [
      TESTIMONIALS[0], // Bucket
      TESTIMONIALS[6], // Cal.com
      TESTIMONIALS[1], // Solin
      TESTIMONIALS[8], // Stellate
      TESTIMONIALS[2], // Grover
      TESTIMONIALS[10], // Memberstack
    ],
    durationClass: "[animation-duration:120s]",
  },
  {
    items: [
      TESTIMONIALS[7], // Gamma
      TESTIMONIALS[3], // Invisible
      TESTIMONIALS[9], // Trunk
      TESTIMONIALS[4], // Poppy
      TESTIMONIALS[11], // Instatus
      TESTIMONIALS[5], // Pearly Plan
    ],
    reverse: true,
    durationClass: "[animation-duration:150s]",
  },
];

function CompanyMark({ t }: { t: Testimonial }) {
  return t.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={t.logo}
      alt=""
      loading="lazy"
      draggable={false}
      className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-black/[0.08]"
    />
  ) : (
    <span
      aria-hidden
      className="grid size-9 shrink-0 place-items-center rounded-lg bg-neutral-900 text-sm font-semibold text-white"
    >
      {t.company[0]}
    </span>
  );
}

function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="spectrum-border flex w-[19rem] shrink-0 flex-col rounded-2xl border border-black/[0.06] bg-white p-6 transition-[border-color] duration-500 hover:border-transparent sm:w-[22rem]">
      <blockquote className="text-pretty text-[15px] font-medium leading-normal text-foreground">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-5">
        <CompanyMark t={t} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">{t.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {t.role}, {t.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function HalfTrack({ items, hidden = false }: { items: Testimonial[]; hidden?: boolean }) {
  return (
    <div className="flex shrink-0 gap-x-4 pr-4" aria-hidden={hidden || undefined}>
      {[0, 1].map((copy) => items.map((t) => <QuoteCard key={`${copy}-${t.company}`} t={t} />))}
    </div>
  );
}

export function TestimonialsReveal({ heading = "Real teams, real builds" }: { heading?: string }) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          {heading}
        </h2>
      </div>

      {/* Full-bleed strip: the rows run edge to edge like the logo carousel,
          dissolving into the page at the margins. Hover pauses both rows. */}
      <Reveal delay={0.1} className="group relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

        <div className="flex flex-col gap-4">
          {ROWS.map((row) => (
            <div key={row.durationClass} className="overflow-hidden motion-reduce:overflow-x-auto">
              <div
                className={cn(
                  "flex w-max items-stretch animate-logo-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none",
                  row.durationClass,
                  row.reverse && "[animation-direction:reverse]",
                )}
              >
                <HalfTrack items={row.items} />
                <HalfTrack items={row.items} hidden />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
