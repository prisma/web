import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const HEADING = "text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]";

// One hue per audience, in the brand's order, then ink. Tints the image frame
// (so a transparent Prismo cut-out sits on colour) and the dot beside the name.
const HUES = [
  { dot: "bg-prism-cyan-400", wash: "from-prism-cyan-50 to-prism-cyan-100/70" },
  { dot: "bg-prism-yellow-400", wash: "from-prism-yellow-50 to-prism-yellow-100/70" },
  { dot: "bg-prism-red-500", wash: "from-prism-red-50 to-prism-red-100/70" },
  { dot: "bg-foreground/70", wash: "from-muted/60 to-muted" },
];

export type BestForContent = {
  headline: string;
  intro: string;
  /** `image` is a path under /public — a transparent Prismo cut-out, fitted to the frame. */
  items: {
    title: string;
    body: string;
    image?: string;
    /** Zoom past the cut-out's transparent padding. Defaults to 1.2. */
    imageScale?: number;
  }[];
};

// "Who the Prisma Stack is best for" — a split list rather than another card
// grid, so it doesn't repeat the "When to use" cards directly above it. The
// heading and intro hold the left column; the four audiences run down the
// right as ruled rows, each led by its Prismo image.
export function BestFor({ bestFor }: { bestFor: BestForContent }) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-site gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <h2 className={cn("max-w-[18ch]", HEADING)}>{bestFor.headline}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              {bestFor.intro}
            </p>
          </Reveal>
        </div>

        <div role="list" className="border-b border-black/[0.08]">
          {bestFor.items.map(({ title, body, image, imageScale = 1.2 }, i) => {
            const hue = HUES[i % HUES.length];
            return (
              <Reveal key={title} delay={i * 0.06}>
                <div
                  role="listitem"
                  className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4 border-t border-black/[0.08] py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8"
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden rounded-xl border border-black/[0.06] bg-gradient-to-br",
                      hue.wash,
                    )}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 13rem, 6.5rem"
                        className="object-contain"
                        style={{ transform: `scale(${imageScale})` }}
                      />
                    ) : (
                      <span className="absolute inset-2 flex items-center justify-center rounded-lg border border-dashed border-black/15 text-center text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[0.6875rem]">
                        [Prismo image]
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="flex items-baseline gap-3 text-balance text-lg leading-snug sm:text-xl">
                      <span
                        aria-hidden
                        className={cn("size-2 shrink-0 translate-y-[-0.1em] rounded-full max-sm:hidden", hue.dot)}
                      />
                      {title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                      {body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
