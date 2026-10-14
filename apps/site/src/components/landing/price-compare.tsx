import { CheckBold } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// The "Deploy for less" creative, as a section: Prisma Compute's metered rates
// beside Vercel Pro's, the two meters where Compute is cheaper flagged, and
// the one where it is not shown as well. Every figure below was read from the
// live pricing pages on the date in CHECKED_ON; update both together.
//
//  - prisma.io/pricing: $0.064 per active vCPU-hour, $0.006 per GB-hour,
//    $1 per million requests over the plan's allowance, no seat fee.
//  - vercel.com/pricing: Fluid Active CPU "starting at $0.128 per hour",
//    Fluid Provisioned Memory "starting at $0.0106 per GB-hr", Function
//    Invocations "starting at $0.60 per 1M", Developer seat $20 per month.
//
// Bandwidth is left out: Vercel's data transfer rate is not on its pricing
// page's compute table, so it is not verified the same way.
const CHECKED_ON = "October 14, 2026";

type Row = {
  meter: string;
  prisma: string;
  vercel: string;
  /** Who is cheaper on this meter. */
  lower: "prisma" | "vercel";
  note?: string;
};

const ROWS: Row[] = [
  { meter: "Active CPU", prisma: "$0.064", vercel: "$0.128", lower: "prisma", note: "per hour" },
  { meter: "Memory", prisma: "$0.006", vercel: "$0.0106", lower: "prisma", note: "per GB-hour" },
  {
    meter: "Requests",
    prisma: "$1.00",
    vercel: "$0.60",
    lower: "vercel",
    note: "per million, after 1M to 100M included on Prisma",
  },
  {
    meter: "Developer seats",
    prisma: "$0",
    vercel: "$20",
    lower: "prisma",
    note: "per seat, per month",
  },
];

function Price({ value, note, muted }: { value: string; note?: string; muted?: boolean }) {
  return (
    <span className="flex flex-col">
      <span
        className={cn(
          "font-heading text-[1.75rem] leading-none sm:text-[2rem]",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {value}
      </span>
      {note ? <span className="mt-1.5 text-xs text-muted-foreground">{note}</span> : null}
    </span>
  );
}

export function PriceCompare({
  headline = "Deploy for less",
  body = "Prisma Compute bills the work your app does, not the workflow around it. On the two meters that dominate a hosting bill, Compute's rate is half of Vercel Pro's or less, and there is no seat fee.",
}: {
  headline?: string;
  body?: string;
}) {
  return (
    <section className="bg-white px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-site">
        <div className="max-w-3xl">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
              {headline}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              {body}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-12">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {/* Prisma Compute: the brand column, outlined in the spectrum */}
            <div className="relative overflow-hidden rounded-2xl border border-prism-cyan-300 bg-white p-6 shadow-[0_0_0_4px_rgba(1,215,228,0.08),0_24px_64px_-32px_rgba(21,21,21,0.2)] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-60"
                style={{
                  background:
                    "radial-gradient(60% 70% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 40%, transparent), transparent 70%)",
                }}
              />
              <div className="relative">
                <p className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <span aria-hidden className="size-2 rounded-full bg-prism-red-500" />
                  Prisma Compute
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7">
                  {ROWS.map((row) => (
                    <div key={row.meter}>
                      <dt className="text-sm font-semibold text-foreground/70">{row.meter}</dt>
                      <dd className="mt-2">
                        <Price value={row.prisma} note={row.note} />
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-prism-cyan-50 px-3 py-1.5 text-sm font-semibold text-prism-cyan-800">
                  <CheckBold className="size-4 text-prism-cyan-600" aria-hidden />
                  Lower than Vercel Pro on CPU, memory and seats
                </p>
              </div>
            </div>

            {/* Vercel Pro: plain, for comparison */}
            <div className="rounded-2xl border border-black/[0.08] bg-muted/30 p-6 sm:p-8">
              <p className="text-base font-semibold text-muted-foreground">Vercel Pro</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7">
                {ROWS.map((row) => (
                  <div key={row.meter}>
                    <dt className="text-sm font-semibold text-foreground/60">{row.meter}</dt>
                    <dd className="mt-2">
                      <Price value={row.vercel} note={row.note} muted />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-7 text-sm text-muted-foreground">
                Vercel is cheaper per request; Prisma includes 1M to 100M requests a month in the
                plan before that meter starts.
              </p>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 max-w-[80ch] text-sm leading-relaxed text-muted-foreground">
          Rates as listed on prisma.io/pricing and vercel.com/pricing on {CHECKED_ON}. Vercel Pro
          rates are its &ldquo;starting at&rdquo; Fluid compute prices; Vercel includes a $20
          monthly credit with each Pro seat. Prisma Compute paid plans start at $10 a month and
          include 5M requests.
        </p>
      </div>
    </section>
  );
}
