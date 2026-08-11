import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// A section that argues one point at length: headline plus a few paragraphs on
// the left, its graphic on the right. V4 gives /orm two top-level sections in
// this shape that the standard template has no slot for — the migrations
// argument uses this one.
export function ProductNarrative({
  headline,
  paragraphs,
  illustration,
}: {
  headline: string;
  paragraphs: string[];
  illustration: React.ReactNode;
}) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      {/* columns stretch rather than centre, so the graphic reads as a panel
          the height of the argument beside it instead of a card floating in it */}
      <div className="mx-auto grid max-w-site gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start">
          <Reveal>
            <h2 className="max-w-[24ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              {headline}
            </h2>
          </Reveal>
          <div className="mt-5 flex flex-col gap-4">
            {paragraphs.map((copy, i) => (
              <Reveal key={i} delay={0.1 + i * 0.06}>
                {/* the opening paragraph carries the claim, so it leads */}
                <p
                  className={cn(
                    "max-w-[62ch] text-pretty leading-relaxed text-muted-foreground",
                    i === 0 && "text-lg",
                  )}
                >
                  {copy}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* min-w-0: grid items default to min-width:auto, so without it the
            illustration's min-content width widens the whole track — and with
            one column on mobile that pushes the copy off-screen too */}
        <Reveal delay={0.12} className="min-w-0 max-lg:order-first lg:min-h-full">
          {illustration}
        </Reveal>
      </div>
    </section>
  );
}
