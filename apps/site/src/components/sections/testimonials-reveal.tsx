import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { TESTIMONIALS, type Testimonial } from "./testimonials-data";

// Drift: two slow marquee rows of quote cards moving in opposite directions,
// sharing the motion vocabulary (and keyframes) of the logo carousel above —
// the page reads as one system. Hovering anywhere on the strip pauses both
// rows; reduced-motion swaps the drift for plain scrollable rows.
// Quotes sourced verbatim (trimmed) from prisma.io customer case studies
// (Bucket, Solin, Grover, Invisible, Poppy, Pearly Plan) and the showcase's
// community quotes (Cal.com, Gamma, Stellate, Trunk, Memberstack, Instatus).
// Client logos are the real brand marks (/logos/customers/*.png) where a
// square mark exists; the rest use letter chips.

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
