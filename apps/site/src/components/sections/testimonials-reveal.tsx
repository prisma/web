import { Reveal } from "@/components/motion/reveal";

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
    <figure className="spectrum-border flex w-[min(19rem,85vw)] snap-start shrink-0 flex-col rounded-2xl border border-foreground/[0.06] bg-card p-6 transition-[border-color] duration-150 hover:border-foreground/25 sm:w-[22rem]">
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

export function TestimonialsReveal({ heading = "Real teams, real builds" }: { heading?: string }) {
  return (
    <section className="bg-background px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-site">
        <h2 className="text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          {heading}
        </h2>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          From first launch to production at scale.
        </p>
        <Reveal className="mt-10">
          <div
            role="region"
            aria-label="Customer testimonials"
            tabIndex={0}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-2xl pb-5"
          >
            {TESTIMONIALS.map((t) => (
              <QuoteCard key={t.company} t={t} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
