import { COMPARISON_CTA } from "./_content";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { createCollectionPageStructuredData } from "@/lib/structured-data";
import { COMPARISONS, COMPARISON_INDEX } from "./comparisons";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CtaBurst } from "@/components/sections/cta-burst";
import { createPageMetadata } from "@/lib/page-metadata";
import { CompareRows, CompareState } from "./compare-list";

export const metadata = createPageMetadata(COMPARISON_INDEX);

/** Render the comparison directory with its complete, unfiltered collection schema. */
export default function ComparePage() {
  return (
    <>
      <JsonLd
        id="comparison-directory"
        data={createCollectionPageStructuredData({
          ...COMPARISON_INDEX,
          name: COMPARISON_INDEX.title,
          items: COMPARISONS.map((entry) => ({
            name: entry.title,
            description: entry.description,
            url: `/compare/${entry.slug}`,
          })),
        })}
      />
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background: [
                  "radial-gradient(42% 60% at 28% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 14%, transparent), transparent 70%)",
                  "radial-gradient(42% 60% at 50% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 12%, transparent), transparent 70%)",
                  "radial-gradient(42% 60% at 72% 100%, color-mix(in srgb, var(--color-prism-red-400) 14%, transparent), transparent 70%)",
                ].join(","),
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />

          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-10 pt-24 text-center md:pb-12 md:pt-28">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Compare
              </RoleKicker>
              <h1 className="isolate mt-3 max-w-[20ch] text-balance text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.08]">
                Prisma comparisons
              </h1>
              <p className="mt-4 max-w-[76ch] text-pretty leading-relaxed text-muted-foreground md:text-lg">
                Prisma ORM and Prisma Postgres set beside the tools people weigh them against, with
                every figure sourced and dated.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CompareState>
        <section
          className="bg-white px-4 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-14"
          aria-label="Comparisons"
        >
          <div className="mx-auto max-w-site">
            <CompareRows />
          </div>
        </section>
      </CompareState>

      <CtaBurst {...COMPARISON_CTA} />
    </>
  );
}
