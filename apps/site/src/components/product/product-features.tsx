import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { LearnMore } from "@/components/brand/learn-more";
import { Texture } from "@/components/brand/texture";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { PRODUCT_ILLUSTRATIONS } from "./illustrations";
import type { ProductPageContent } from "./types";

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM = "var(--color-prism-cyan-400)";

// Feature ray photos cycled across the cards — same backdrops (and crops) as
// the homepage illustrations, saturation boosted on their own layer.
const PHOTOS = [
  "bg-[url('/brand/feature-orm.jpg')] bg-[position:0%_65%]",
  "bg-[url('/brand/feature-postgres.jpg')] bg-[position:50%_55%]",
  "bg-[url('/brand/feature-compute.jpg')] bg-[position:20%_90%]",
];

// Column count per feature count. V4 ships an uneven number per product, and a
// row of three reads better than two-plus-an-orphan; four stays as two rows of
// two so the cards keep their portrait proportion. Five gets six tracks — see
// centreLastPair.
const COLUMNS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2",
  5: "md:grid-cols-6",
};

// Five is the count with no tidy answer: three-then-two leaves the last row
// hanging left, and two-two-one leaves a lone card. Six tracks with every card
// spanning two gives three per row, and starting the fourth card at track two
// centres the remaining pair under them. Card widths stay identical throughout.
function centreLastPair(count: number, i: number) {
  if (count !== 5) return undefined;
  return cn("md:col-span-2", i === 3 && "md:col-start-2");
}

// Feature cards in the three-steps idiom, kept still and grown to portrait
// (~2:3): the prism-tinted illustration block fills the card above the
// content, the feature's abstraction filling the block, inside the homepage
// stack's wrapped panel.
export function ProductFeatures({ features }: Pick<ProductPageContent, "features">) {
  return (
    <section className="bg-card px-3 py-3 sm:px-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-foreground/[0.06] bg-card">
        {/* the wrapped panels' spectral bottom — wash + beam fan dispersing
            to white above, same values as hero-home.tsx */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: "var(--paper)",
            }}
          />

          <div className="absolute inset-x-0 top-0 h-64 bg-transparent" />
        </div>
        {/* the glass prism rising out of the corner where the red
            concentrates behind it (stack-bento idiom) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute bottom-[-12rem] right-[-8rem] h-[30rem] w-[46rem] rounded-full opacity-30 blur-[90px]"
            style={{ background: SPECTRUM }}
          />
          <GlassPrismSpin
            shape="triangle"
            className="bottom-[-3rem] right-[-7rem] w-[28rem] max-md:bottom-[-1.5rem] max-md:right-[-4rem] max-md:w-[15rem]"
          />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative mx-auto max-w-site px-4 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl text-center max-md:text-left">
            <Reveal>
              <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
                {features.headline}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                {features.bridge}
              </p>
            </Reveal>
          </div>
          <div
            className={cn("mt-14 grid gap-5", COLUMNS[features.items.length] ?? "md:grid-cols-2")}
          >
            {features.items.map(({ name, description, href, illustration }, i) => {
              const Illustration = illustration ? PRODUCT_ILLUSTRATIONS[illustration] : null;
              return (
                <Reveal
                  key={i}
                  delay={(i % 3) * 0.1}
                  className={cn("h-full", centreLastPair(features.items.length, i))}
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card">
                    {/* illustration and content split the card roughly in half */}
                    <div className="relative flex h-64 select-none items-center justify-center overflow-hidden p-5">
                      <div
                        aria-hidden
                        className={cn(
                          "absolute inset-0 bg-cover [filter:saturate(1.45)_contrast(1.04)]",
                          PHOTOS[i % PHOTOS.length],
                        )}
                      />
                      {Illustration ? (
                        <div className="relative size-full">
                          <Illustration />
                        </div>
                      ) : (
                        <div
                          aria-hidden
                          className="relative flex h-full w-full items-center justify-center rounded-xl border border-dashed border-foreground/20 bg-card/70 backdrop-blur-sm"
                        >
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            [Feature abstraction]
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex grow flex-col p-7">
                      <h3 className="text-xl">{name}</h3>
                      <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                      {href ? (
                        <LearnMore href={href} product={name} className="mt-auto pt-4" />
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
