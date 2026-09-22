import { Marker } from "@/components/brand/marker";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// The audience use-case comparison table. Design starts from the pricing spec
// table (pricing-spec-table.tsx) — the haloed panel, the lit column with a
// spectrum cap, the mobile pivot — but the shape is different: these tables are
// a three-column prose comparison (the comparison point, an assembled/
// fragmented stack, and Prisma) rather than a four-plan grid, so the cells hold
// sentences and the Prisma column is the one that's lifted. Copy is verbatim.

const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";
const HALO =
  "conic-gradient(var(--color-prism-yellow-300), var(--color-prism-red-500) 32%, var(--color-prism-cyan-400) 64%, var(--color-prism-yellow-300))";

const HEADING = "text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]";

export type ComparisonRow = { point: string; assembled: string; prisma: string };

export type ComparisonContent = {
  headline: string;
  intro: string[];
  /** Header for the first (row-label) column, e.g. "Comparison point". */
  pointHeader: string;
  /** Header for the assembled/fragmented column, e.g. "Assembled SaaS stack". */
  assembledHeader: string;
  rows: ComparisonRow[];
};

export function ComparisonTable({ comparison }: { comparison: ComparisonContent }) {
  const { headline, intro, pointHeader, assembledHeader, rows } = comparison;
  return (
    <section className="overflow-x-clip bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className={cn("max-w-[26ch]", HEADING)}>{headline}</h2>
        </Reveal>
        <div className="mt-5 flex max-w-[70ch] flex-col gap-4">
          {intro.map((para, i) => (
            <Reveal key={i} delay={0.05 + i * 0.05}>
              <p className="text-pretty leading-relaxed text-muted-foreground">{para}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="relative mt-12">
          {/* the pricing table's prismatic halo — inner edge + soft bloom */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-20 blur-[20px]"
            style={{ background: HALO }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 rounded-3xl opacity-10 blur-[56px]"
            style={{ background: HALO }}
          />

          {/* mobile / tablet: pivot each row to a label with the two values
              stacked, the Prisma value lifted */}
          <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white lg:hidden">
            {rows.map((row, i) => (
              <div key={i} className="border-t border-black/[0.06] p-5 first:border-t-0">
                <p className="text-sm font-semibold text-foreground">{row.point}</p>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-lg bg-foreground/[0.03] p-3">
                    <p className="text-[0.6875rem] font-medium text-muted-foreground">
                      {assembledHeader}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {row.assembled}
                    </p>
                  </div>
                  <div className="relative overflow-hidden rounded-lg bg-paper p-3 ring-1 ring-black/[0.08]">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-[3px]"
                      style={{ backgroundImage: SPECTRUM }}
                    />
                    <p className="text-[0.6875rem] font-semibold text-foreground">Prisma</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{row.prisma}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* desktop */}
          <div className="relative hidden overflow-hidden rounded-2xl border border-black/[0.06] bg-white lg:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{headline}</caption>
              <colgroup>
                <col className="w-[22%]" />
                <col />
                <col className="bg-paper" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="px-6 pb-4 pt-5 align-bottom">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {pointHeader}
                    </span>
                  </th>
                  <th scope="col" className="px-6 pb-4 pt-5 align-bottom">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {assembledHeader}
                    </span>
                  </th>
                  <th scope="col" className="relative px-6 pb-4 pt-5 align-bottom">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-[3px]"
                      style={{ backgroundImage: SPECTRUM }}
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">Prisma</span>
                      <Marker>Recommended</Marker>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t border-black/[0.06]">
                    <th
                      scope="row"
                      className="px-6 py-4 align-top text-sm font-semibold text-foreground"
                    >
                      {row.point}
                    </th>
                    <td className="px-6 py-4 align-top text-sm leading-relaxed text-muted-foreground">
                      {row.assembled}
                    </td>
                    <td className="px-6 py-4 align-top text-sm leading-relaxed text-foreground">
                      {row.prisma}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
