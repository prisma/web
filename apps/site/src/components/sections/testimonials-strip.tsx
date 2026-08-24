import { cn } from "@/lib/utils";

// Quotes sourced verbatim (trimmed) from prisma.io customer case studies:
// Bucket, Solin, Grover, Invisible, Poppy, Pearly Plan.
// Photo cards use the abstract macro set (/brand/testimonial-1..4.jpg;
// testimonial-4 is spare).
// Client logos are the real brand marks, pulled from each company's own site
// (/logos/customers/*.png). TODO: avatars are still placeholders (picsum seeds).

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
} & (
  | { kind: "photo"; photo: string }
  | { kind: "pattern"; tint: "cyan" | "yellow" | "red"; logo: string }
);

const TESTIMONIALS: Testimonial[] = [
  {
    kind: "photo",
    photo: "/brand/testimonial-1.jpg",
    quote:
      "Prisma makes database management incredibly easy. Prisma's built-in type safety helps us avoid mistakes that happen with manual setups.",
    name: "Ron Cohen",
    role: "Co-founder & CTO",
    company: "Bucket",
  },
  {
    kind: "pattern",
    tint: "cyan",
    logo: "/logos/customers/solin.png",
    quote:
      "We are able to take advantage of caching to speed up queries and reduce latency, making them lightning fast.",
    name: "Blake Carroll",
    role: "CTO",
    company: "Solin",
  },
  {
    kind: "photo",
    photo: "/brand/testimonial-2.jpg",
    quote:
      "Prisma has a low learning curve. Productivity becomes higher because it gets combined with end-to-end type-safety using TypeScript.",
    name: "Ricardo Almeida",
    role: "Software Engineer",
    company: "Grover",
  },
  {
    kind: "pattern",
    tint: "yellow",
    logo: "/logos/customers/invisible.png",
    quote:
      "Prisma's approach to type-safe ORM is next-level. It provides full type-safety without any codegen or messy types and interfaces to write and maintain.",
    name: "Pieter Venter",
    role: "Sr. Software Engineer",
    company: "Invisible",
  },
  {
    kind: "photo",
    photo: "/brand/testimonial-3.jpg",
    quote:
      "The combination of Prisma, TypeScript and our pretty thorough coverage with integration tests gives us the confidence to refactor critical parts of our code.",
    name: "Thibaut Nguyen",
    role: "CTO",
    company: "Poppy",
  },
  {
    kind: "pattern",
    tint: "red",
    logo: "/logos/customers/pearly.png",
    quote:
      "This is the fastest I've ever developed in my life, by far. The tooling has dramatically cut down on the amount of time I've had to spend.",
    name: "Sean Emmer",
    role: "CTO & Co-Founder",
    company: "Pearly Plan",
  },
];

const TINTS = {
  cyan: "bg-prism-cyan-50",
  yellow: "bg-prism-yellow-50",
  red: "bg-prism-red-50",
} as const;

function avatarUrl(name: string) {
  return `https://picsum.photos/seed/${name.toLowerCase().replace(/[^a-z]+/g, "-")}-avatar/96/96`;
}

function Attribution({ t, onPhoto = false }: { t: Testimonial; onPhoto?: boolean }) {
  return (
    <figcaption className="mt-4 flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl(t.name)}
        alt=""
        className={cn(
          "size-9 shrink-0 rounded-full border object-cover",
          onPhoto ? "border-white/30" : "border-black/[0.06]",
        )}
      />
      <div>
        <p className={cn("text-sm font-semibold", onPhoto ? "text-white" : "text-foreground")}>
          {t.name}
        </p>
        <p className={cn("text-sm", onPhoto ? "text-white/70" : "text-muted-foreground")}>
          {t.role}
        </p>
      </div>
    </figcaption>
  );
}

function PhotoCard({ t }: { t: Extract<Testimonial, { kind: "photo" }> }) {
  return (
    <figure
      className="relative flex h-[28rem] w-[22rem] shrink-0 flex-col justify-end overflow-hidden rounded-lg border border-black/[0.06] bg-cover bg-center"
      style={{ backgroundImage: `url(${t.photo})` }}
    >
      <div className="relative bg-gradient-to-t from-black/95 via-black/60 to-transparent px-6 pb-6 pt-28">
        <blockquote className="text-pretty text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-white">
          {t.quote}
        </blockquote>
        <Attribution t={t} onPhoto />
      </div>
    </figure>
  );
}

function PatternCard({ t }: { t: Extract<Testimonial, { kind: "pattern" }> }) {
  return (
    <figure
      className={cn(
        "relative flex h-[28rem] w-[22rem] shrink-0 flex-col overflow-hidden rounded-lg border border-black/[0.06] p-6",
        TINTS[t.tint],
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
        style={{ backgroundImage: "url(/brand/pattern.svg)", backgroundSize: "892px 434px" }}
      />

      {/* client logo — real brand mark (from the company's own site), centered */}
      <div className="relative mt-12 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.logo}
          alt={`${t.company} logo`}
          className="size-14 shrink-0 rounded-xl object-cover shadow-[0_8px_20px_-6px_rgba(21,21,21,0.28)] ring-1 ring-black/[0.06]"
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="relative mt-auto">
        <blockquote className="text-pretty text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {t.quote}
        </blockquote>
        <Attribution t={t} />
      </div>
    </figure>
  );
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 gap-3 pr-3">
      {TESTIMONIALS.map((t, i) => (
        <div key={t.name} className={cn(i % 2 === 1 && "translate-y-7")}>
          {t.kind === "photo" ? <PhotoCard t={t} /> : <PatternCard t={t} />}
        </div>
      ))}
    </div>
  );
}

export function TestimonialsStrip() {
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          Real teams, real builds
        </h2>
      </div>

      <div className="mt-14 overflow-hidden pb-7 motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-testimonials-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
