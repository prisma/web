import { IconTile } from "@/components/brand/icon-tile";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { Star } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { CtaBurst } from "@/components/sections/cta-burst";
import { PRODUCT_ICONS } from "@/components/product/icons";
import { PRODUCT_ILLUSTRATIONS } from "@/components/product/illustrations";
import type { CustomerStoryDetail } from "@/data/customer-stories";
import { cn } from "@/lib/utils";

// /customers/[slug] — the customer story detail template.
//
// Built entirely out of the redesign's existing vocabulary: the wrapped
// prismatic panel (hero-home / product-hero / cta-burst), the split hero with a
// PrismRay crossing behind the visual, IconTile cards (product-problem), a
// product illustration for the "how they use it" visual (product-features), and
// CtaBurst for the closer. Surfaces alternate white ↔ wrapped panel — there is
// deliberately no bg-muted band. Section order follows the approved copy.

const CHECK_COLORS = ["text-prism-cyan-500", "text-prism-yellow-400", "text-prism-red-500"];

export function CustomerStory({ story }: { story: CustomerStoryDetail }) {
  return (
    <>
      <StoryHero story={story} />
      <StoryAbout story={story} />
      <StoryChallenge story={story} />
      <StoryReasons story={story} />
      {story.quote && <StoryQuote quote={story.quote} story={story} />}
      <StoryUsage story={story} />
      <StoryResults story={story} />
      <CtaBurst
        headline={story.cta.heading}
        headlineMaxWidth="max-w-[26ch]"
        body={story.cta.body}
        checks={story.cta.checks.map((label, i) => ({
          label,
          color: CHECK_COLORS[i % CHECK_COLORS.length],
        }))}
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io" }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}

// The wrapped prismatic panel used across the site (hero-home, product-hero,
// product-features): a rounded white card with the spectral wash collecting
// along the bottom and dispersing to white above. Extracted here so the hero,
// quote and results panels share one source instead of three copies.
function PrismPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
      >
        <div
          className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
          style={{
            background: [
              "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
              "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
              "radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
            ].join(","),
          }}
        />
        <div className="absolute bottom-[-24rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
        <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
        <div className="absolute bottom-[-28rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
      </div>
      <Texture opacity={0.06} blend="multiply" />
      <div className="relative">{children}</div>
    </div>
  );
}

// The customer mark on a light surface — flattened to solid black (no chip, no
// background). brightness-0 alone forces black while keeping the alpha, so both
// the white marks (logoAsIs) and the dark-ink originals read as one flat mark.
function LogoMark({ story, className }: { story: CustomerStoryDetail; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={story.logo}
      alt={story.name}
      className={cn("h-6 w-auto max-w-[8rem] object-contain brightness-0", className)}
      draggable={false}
    />
  );
}

// Opening quote glyph. Its slice-glitch classes (animate-quote-slice-*) live in
// globals.css — added for the original pricing-hero testimonial, kept when that
// hero was reworked, reused here.
function QuoteGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 150 100" fill="currentColor" aria-hidden className={className} style={style}>
      <path d="M50 4 C22 10 4 30 4 58 L4 78 C4 88 12 96 22 96 L48 96 C58 96 66 88 66 78 L66 54 C66 44 58 36 48 36 L30 36 C33 22 40 14 54 10 Z" />
      <path d="M130 4 C102 10 84 30 84 58 L84 78 C84 88 92 96 102 96 L128 96 C138 96 146 88 146 78 L146 54 C146 44 138 36 128 36 L110 36 C113 22 120 14 134 10 Z" />
    </svg>
  );
}

// The testimonial quote-mark with a continuous slice glitch (React Bits
// GlitchText idiom): the ink mark, static chromatic offsets under it, and three
// card-colored layers clipped to a jumping band so slices read as displaced
// through the prism trio. Sits on an OPAQUE card surface — the layers mask with
// bg-card between flickers.
function GlitchQuote({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative block select-none", className)}>
      <QuoteGlyph className="absolute left-0 top-0 h-full w-auto -translate-x-[4px] text-prism-cyan-400 mix-blend-multiply" />
      <QuoteGlyph className="absolute left-0 top-0 h-full w-auto translate-y-[4px] text-prism-yellow-300 mix-blend-multiply" />
      <QuoteGlyph className="absolute left-0 top-0 h-full w-auto translate-x-[4px] text-prism-red-500 mix-blend-multiply" />
      <QuoteGlyph className="relative h-full w-auto text-foreground" />
      <span className="absolute inset-0 animate-quote-slice-cyan bg-card motion-reduce:hidden">
        <QuoteGlyph
          className="h-full w-auto -translate-x-[3px] text-foreground"
          style={{ filter: "drop-shadow(-3px 0 var(--color-prism-cyan-400))" }}
        />
      </span>
      <span className="absolute inset-0 animate-quote-slice-red bg-card motion-reduce:hidden">
        <QuoteGlyph
          className="h-full w-auto translate-x-[3px] text-foreground"
          style={{ filter: "drop-shadow(3px 0 var(--color-prism-red-500))" }}
        />
      </span>
      <span className="absolute inset-0 animate-quote-slice-yellow bg-card motion-reduce:hidden">
        <QuoteGlyph
          className="h-full w-auto translate-y-[2px] text-foreground"
          style={{ filter: "drop-shadow(0 3px var(--color-prism-yellow-300))" }}
        />
      </span>
    </span>
  );
}

// Comma-separated Stack fact → a short list, for the hero plate's footer. Capped
// so a long stack (Amplication runs eight) stays a clean one-or-two-line summary;
// the full stack still shows in the About fact sheet.
function stackFrom(story: CustomerStoryDetail): string[] {
  const fact = story.about.facts.find((f) => f.label.toLowerCase() === "stack");
  if (!fact) return [];
  return fact.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

// The hero visual: a black "built with" plate that fills its column — the Prisma
// mark up top, the customer's mark large and centred, the stack along the
// bottom — with the brand's prismatic light leaking in at the corners and the
// triple-band ray crossing behind it (story-art.tsx idiom, given room to breathe).
function HeroVisual({ story }: { story: CustomerStoryDetail }) {
  const stack = stackFrom(story);
  return (
    <div className="relative w-full max-md:mt-2">
      <PrismRay
        className="left-1/2 top-1/2 h-16 w-[34rem] -translate-x-1/2 -translate-y-1/2 md:h-28 md:w-[62rem]"
        angle={-50}
        intensity="hero"
      />
      <div className="relative mx-auto flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#08090b] p-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)] sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: [
              "radial-gradient(56% 78% at -4% -8%, color-mix(in srgb, var(--color-prism-cyan-400) 90%, transparent), transparent 72%)",
              "radial-gradient(56% 78% at 104% 108%, color-mix(in srgb, var(--color-prism-red-500) 86%, transparent), transparent 72%)",
            ].join(","),
          }}
        />
        <Texture opacity={0.08} blend="hard-light" />

        {/* Prisma, hosting the story */}
        <div className="relative flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/full-color-white.svg"
            alt="Prisma"
            className="h-6 w-auto object-contain sm:h-7"
            draggable={false}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Customer
          </span>
        </div>

        {/* the customer, given the room */}
        <div className="relative flex flex-1 items-center justify-center py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.logo}
            alt={story.name}
            className={cn(
              "h-12 w-auto max-w-[16rem] object-contain sm:h-14",
              !story.logoAsIs && "brightness-0 invert",
            )}
            draggable={false}
          />
        </div>

        {/* the stack, filling the base */}
        {stack.length > 0 && (
          <div className="relative flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-white/10 pt-5 text-sm text-white/60">
            {stack.map((tech, i) => (
              <span key={tech} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden className="size-1 rounded-full bg-white/25" />}
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Hero — product-hero's wrapped panel in a split: copy left, the "built with"
// plate on the right with the ray crossing behind it.
function StoryHero({ story }: { story: CustomerStoryDetail }) {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <PrismPanel>
        <div className="px-4 sm:px-8">
          <div className="mx-auto grid max-w-site items-center gap-12 pb-20 pt-36 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] md:pb-28 md:pt-40 lg:gap-16">
            {/* copy */}
            <div className="flex flex-col items-start">
              <RoleKicker color="bg-prism-cyan-400">Customer story</RoleKicker>
              <h1 className="mt-4 max-w-[min(18ch,100%)] text-balance text-[clamp(2.25rem,3.6vw,3.25rem)] leading-[1.06]">
                {story.hero.title}
              </h1>
              <div className="mt-6 flex max-w-[50ch] flex-col gap-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                <p>{story.hero.lead}</p>
                {story.hero.support && <p>{story.hero.support}</p>}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrismButton href="https://console.prisma.io" size="lg">
                  Get started free
                </PrismButton>
                <PrismButtonOutline href="/contact" size="lg">
                  Talk to us
                </PrismButtonOutline>
              </div>
            </div>

            <HeroVisual story={story} />
          </div>
        </div>
      </PrismPanel>
    </section>
  );
}

// About — narrative on the left, the fact sheet on the right as a card where
// every row carries its own IconTile.
function StoryAbout({ story }: { story: CustomerStoryDetail }) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-site gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <Reveal>
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            {story.about.heading}
          </h2>
          <p className="mt-6 max-w-[58ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            {story.about.body}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="divide-y divide-black/[0.07] rounded-2xl border border-black/[0.08] bg-card p-4 sm:p-6">
            {story.about.facts.map((fact) => {
              const Icon = PRODUCT_ICONS[fact.icon];
              return (
                <li key={fact.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <IconTile className="size-11">
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </IconTile>
                  <div>
                    <p className="text-sm font-semibold text-foreground/55">{fact.label}</p>
                    <p className="mt-0.5 text-pretty font-medium text-foreground">{fact.value}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// Challenge — a wrapped panel: framing on the left, the constraints as IconTile
// cards on the right, the closing line beneath.
function StoryChallenge({ story }: { story: CustomerStoryDetail }) {
  return (
    <section className="bg-white px-3 py-10 sm:px-4 sm:py-14">
      <PrismPanel>
        <div className="mx-auto max-w-site px-6 py-20 sm:px-12 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <Reveal>
              <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
                {story.challenge.heading}
              </h2>
              <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {story.challenge.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {story.challenge.quote && (
                <figure className="mt-8 border-l-2 border-prism-cyan-400 pl-5">
                  <blockquote className="text-pretty text-lg font-medium leading-relaxed text-foreground">
                    &ldquo;{story.challenge.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {story.challenge.quote.author}
                    </span>
                    {", "}
                    {story.challenge.quote.role}
                    {story.challenge.quote.company && <>, {story.challenge.quote.company}</>}
                  </figcaption>
                </figure>
              )}
            </Reveal>

            <div className="flex flex-col gap-4">
              {story.challenge.points.map((point, i) => {
                const Icon = PRODUCT_ICONS[point.icon];
                return (
                  <Reveal key={point.title} delay={i * 0.1}>
                    <div className="flex items-start gap-4 rounded-2xl border border-black/[0.06] bg-white/70 p-6 backdrop-blur-sm">
                      <IconTile className="size-11">
                        <Icon className="size-5 text-foreground" aria-hidden />
                      </IconTile>
                      <p className="text-pretty leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">{point.title}</span>{" "}
                        {point.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {story.challenge.outro && (
            <Reveal delay={0.15}>
              <p className="mx-auto mt-10 max-w-[70ch] text-pretty text-center text-lg font-medium leading-relaxed text-foreground">
                {story.challenge.outro}
              </p>
            </Reveal>
          )}
        </div>
      </PrismPanel>
    </section>
  );
}

// Why Prisma — the three-up IconTile card row (product-problem idiom).
function StoryReasons({ story }: { story: CustomerStoryDetail }) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              {story.reasons.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {story.reasons.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {story.reasons.cards.map((card, i) => {
            const Icon = PRODUCT_ICONS[card.icon];
            return (
              <Reveal key={card.title} delay={i * 0.1} className="h-full">
                <div className="flex h-full flex-col items-start gap-4 rounded-xl border border-black/[0.06] bg-white p-7">
                  <IconTile>
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </IconTile>
                  <h3 className="text-lg font-semibold leading-snug text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Pull quote — the Relume "Testimonial4" shape the review asked for, on a
// wrapped panel: rating, a bold centred quote, then an attribution row of
// monogram · name/role · divider · logo.
function StoryQuote({
  quote,
  story,
}: {
  quote: NonNullable<CustomerStoryDetail["quote"]>;
  story: CustomerStoryDetail;
}) {
  const initials = quote.author
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <section className="bg-white px-3 py-10 sm:px-4 sm:py-14">
      <PrismPanel>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 sm:py-24">
          <Reveal>
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 text-prism-yellow-400" aria-hidden />
              ))}
            </div>

            <blockquote className="mt-8 text-balance text-2xl font-semibold leading-snug text-foreground sm:text-[1.875rem]">
              &ldquo;{quote.text}&rdquo;
            </blockquote>

            <figcaption className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <span
                aria-hidden
                className="grid size-12 shrink-0 place-items-center rounded-full bg-card-wash text-sm font-semibold text-foreground ring-1 ring-black/[0.06]"
              >
                {initials}
              </span>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-foreground">{quote.author}</p>
                <p className="text-sm text-muted-foreground">
                  {quote.role}
                  {quote.company && <>, {quote.company}</>}
                </p>
              </div>
              <span aria-hidden className="hidden h-10 w-px bg-black/10 sm:block" />
              {quote.companyHref ? (
                <a href={quote.companyHref} target="_blank" rel="noopener noreferrer">
                  <LogoMark story={story} />
                </a>
              ) : (
                <LogoMark story={story} />
              )}
            </figcaption>
          </Reveal>
        </div>
      </PrismPanel>
    </section>
  );
}

// How they use Prisma — the argument on the left (vertically centred against the
// visual), a schema.prisma abstraction on the right. Reuses the product pages'
// SchemaFile illustration so the visual is real and never repeats the hero plate.
function StoryUsage({ story }: { story: CustomerStoryDetail }) {
  const SchemaFile = PRODUCT_ILLUSTRATIONS.schemaFile;
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-site items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            {story.usage.heading}
          </h2>
          <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {story.usage.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="min-w-0 max-lg:order-first">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.08] shadow-[0_20px_48px_-24px_rgba(21,21,21,0.28)] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
            <SchemaFile />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Results — a wrapped panel split two ways: the outcome heading and the three
// IconTile result cards on the left, the closing quote as a tall card on the
// right (per the review wireframe). Falls back to a single column when a story
// carries no closing quote.
function StoryResults({ story }: { story: CustomerStoryDetail }) {
  const quote = story.closingQuote;
  return (
    <section className="bg-white px-3 py-10 sm:px-4 sm:py-14">
      <PrismPanel>
        <div className="mx-auto max-w-site px-6 py-20 sm:px-12 sm:py-24">
          <div className={cn("grid gap-10", quote && "lg:grid-cols-2 lg:items-stretch lg:gap-12")}>
            {/* left: heading, intro, the outcomes */}
            <div className="flex flex-col">
              <Reveal>
                <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
                  {story.results.heading}
                </h2>
                <p className="mt-5 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                  {story.results.intro}
                </p>
              </Reveal>

              <div className="mt-8 flex flex-col gap-4">
                {story.results.items.map((item, i) => {
                  const Icon = PRODUCT_ICONS[item.icon];
                  return (
                    <Reveal key={item.stat} delay={i * 0.08}>
                      <div className="flex items-start gap-4 rounded-2xl border border-black/[0.06] bg-white/70 p-6 backdrop-blur-sm">
                        <IconTile className="size-11">
                          <Icon className="size-5 text-foreground" aria-hidden />
                        </IconTile>
                        <div>
                          <p className="text-pretty font-semibold leading-snug text-foreground">
                            {item.stat}
                          </p>
                          <p className="mt-1 text-pretty leading-relaxed text-muted-foreground">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            {/* right: the closing quote as a tall card */}
            {quote && (
              <Reveal delay={0.12} className="lg:h-full">
                <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card p-8 shadow-[0_20px_48px_-24px_rgba(21,21,21,0.22)] sm:p-10">
                  <GlitchQuote className="h-11 md:h-14" />
                  <blockquote
                    className={cn(
                      "mt-7 text-pretty font-medium leading-snug text-foreground",
                      quote.compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl",
                    )}
                  >
                    {quote.text}
                  </blockquote>
                  <figcaption className="mt-auto flex flex-col items-start gap-4 pt-10 sm:flex-row sm:items-center">
                    <LogoMark story={story} />
                    <span aria-hidden className="hidden h-9 w-px bg-black/10 sm:block" />
                    <p className="text-pretty text-muted-foreground">
                      <span className="font-semibold text-foreground">{quote.author}</span>
                      {", "}
                      {quote.role}
                      {quote.company && <> at {quote.company}</>}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </div>
      </PrismPanel>
    </section>
  );
}
