import { Reveal } from "@/components/motion/reveal";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { PlatformStack } from "./platform-stack";
import type { ProductPageContent } from "./types";

// The line the section exists to land. Client review: the old diagram read as
// "you must use all of Prisma together", so the openness is stated in words as
// well as demonstrated by the stack below it.
const SWAP_LINE = "Best together. Swappable when needed.";

// The cross-sell. V4 shipped this as a fan of connections into three cards, and
// review found the picture read as lock-in — everything flowing out of Prisma,
// no way out drawn. The cards were then given a "swaps for" row, which said the
// right thing but nobody felt it.
//
// It is now an instrument the visitor operates: PlatformStack lets them rebuild
// the stack layer by layer and watch the golden path dim rather than break. The
// argument for using all of Prisma is made by what they lose on each swap, in
// the stack's own footer, rather than by a diagram insisting on it.
export function ProductPlatform({
  platform,
  points,
}: Pick<ProductPageContent, "platform"> & {
  /** Short named claims under the intro. Not cards: the stack below is the visual. */
  points?: readonly { title: string; body: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              Built to work with the rest of Prisma
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {renderFaqAnswer(platform.body)}
            </p>
          </Reveal>
          {points?.length ? (
            <div className="mt-10 grid gap-8 text-left sm:grid-cols-3">
              {points.map((point) => (
                <div key={point.title}>
                  <h3 className="text-[0.9375rem] font-semibold leading-snug text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {point.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          <Reveal delay={0.16}>
            <p
              className={
                points?.length
                  ? "mt-10 text-pretty font-semibold leading-relaxed text-foreground"
                  : "mt-4 text-pretty font-semibold leading-relaxed text-foreground"
              }
            >
              {SWAP_LINE}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <PlatformStack />
        </Reveal>
      </div>
    </section>
  );
}
