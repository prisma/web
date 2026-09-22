import { IconTile } from "@/components/brand/icon-tile";
import { Pattern } from "@/components/brand/pattern";
import { CheckBold, X } from "@/components/icons/forma";
import { PRODUCT_ICONS } from "@/components/product/icons";
import { ProductNarrative } from "@/components/product/product-narrative";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { SegmentUseCaseContent } from "./types";

// Shared sections for the audience use-case pages — the same idioms as the
// AI-agents page (an illustrated narrative, icon-card grids, an asymmetric fit
// split, card rows), generalised to take per-page content and abstractions.
// The hero is the one every use-case page shares (use-case-hero.tsx) and the
// comparison table is its own file.

const HEADING = "text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]";

// "What Prisma is for … / Why … use Prisma" — the /orm narrative shape: copy on
// the left, a purpose-built 1:1 abstraction on the right, the copy centred to it.
export function SegmentIntro({
  intro,
  visual,
}: Pick<SegmentUseCaseContent, "intro"> & { visual: React.ReactNode }) {
  return (
    <ProductNarrative
      headline={intro.headline}
      paragraphs={[intro.lede, ...intro.body]}
      centerText
      illustration={<div className="w-full">{visual}</div>}
    />
  );
}

// An icon-card grid — the /postgres outcomes tile. Used by "when to use" (four-
// up) and "why choose" (two-up), so the two grids read at different rhythms.
function IconCards({
  headline,
  intro,
  items,
  columns,
}: {
  headline: string;
  intro: string[];
  items: SegmentUseCaseContent["when"]["items"];
  columns: "four" | "two";
}) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
          <Reveal>
            <h2 className={cn("mx-auto max-w-[28ch]", HEADING)}>{headline}</h2>
          </Reveal>
          {intro.map((para, i) => (
            <Reveal key={i} delay={0.05 + i * 0.05}>
              <p
                className={cn(
                  "text-pretty leading-relaxed text-muted-foreground",
                  i === 0 && "text-lg",
                )}
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <div
          className={cn(
            "mt-12 grid grid-cols-1 gap-5",
            columns === "four" ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2",
          )}
        >
          {items.map(({ icon, title, body }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            return (
              <Reveal key={title} delay={(i % 4) * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-card p-7">
                  <IconTile>
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </IconTile>
                  <h3 className="mt-5 text-balance text-xl leading-snug">{title}</h3>
                  <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SegmentWhen({ when }: Pick<SegmentUseCaseContent, "when">) {
  return (
    <IconCards headline={when.headline} intro={[when.intro]} items={when.items} columns="four" />
  );
}

export function SegmentWhyChoose({
  whyChoose,
}: {
  whyChoose: NonNullable<SegmentUseCaseContent["whyChoose"]>;
}) {
  return (
    <IconCards
      headline={whyChoose.headline}
      intro={whyChoose.intro}
      items={whyChoose.items}
      columns="two"
    />
  );
}

// "Is Prisma the right fit …?" — an asymmetric split: the affirmative promoted
// (wider, elevated, spectrum-edged), the honest caveat beside it, plain and muted.
export function SegmentFit({ fit }: Pick<SegmentUseCaseContent, "fit">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className={cn("mx-auto max-w-[26ch] text-center", HEADING)}>{fit.headline}</h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={0.05} className="h-full">
            <div className="spectrum-border spectrum-border-on relative flex h-full flex-col justify-center overflow-hidden rounded-[1.25rem] border border-transparent bg-white p-8 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_20px_40px_-16px_rgba(21,21,21,0.12)] sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.05] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
              >
                <Pattern className="h-full w-full" scale={2.5} />
              </div>
              <CheckBold className="relative size-7 text-prism-cyan-500" aria-hidden />
              <p className="relative mt-5 text-pretty text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-snug text-foreground">
                {fit.suited}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="h-full">
            <div className="flex h-full flex-col justify-center rounded-[1.25rem] border border-black/[0.08] bg-muted/40 p-8 sm:p-10">
              <X className="size-6 text-foreground/30" strokeWidth={3} aria-hidden />
              <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{fit.caveat}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// "What … build with Prisma / Who Prisma is best for" — the site's icon-tile
// card, four-up.
export function SegmentBuilds({ builds }: Pick<SegmentUseCaseContent, "builds">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className={cn("mx-auto max-w-[26ch]", HEADING)}>{builds.headline}</h2>
          </Reveal>
          {builds.intro ? (
            <Reveal delay={0.05}>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                {builds.intro}
              </p>
            </Reveal>
          ) : null}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {builds.items.map(({ icon, title, body }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            return (
              <Reveal key={title} delay={(i % 4) * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-card p-7">
                  <IconTile>
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </IconTile>
                  <h3 className="mt-5 text-balance text-lg leading-snug">{title}</h3>
                  <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
