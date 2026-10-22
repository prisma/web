import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Prisma Compute against Vercel Pro, meter by meter, in the shape of the
// "Prisma vs Vercel" comparison post (apps/blog .../prisma-vs-vercel, updated
// 2026-10-13): plan fee, the four usage meters, then the two things Vercel
// meters that Prisma does not. The honest rows stay: Vercel is cheaper per
// request and includes a terabyte of bandwidth.
//
// Every figure was read from the live pricing pages on CHECKED_ON:
//  - prisma.io/pricing: Free, then $10 / $49 / $129 a month with 5M / 20M /
//    100M requests included; $1 per million after; $0.006 per GB-hour;
//    $0.064 per active vCPU-hour; $0.025 per GB; no charge for seats,
//    builds or previews.
//  - vercel.com/pricing (Pro): $20 a month per developer seat with a $20
//    usage credit; invocations from $0.60 per million; Fluid Active CPU from
//    $0.128 per hour; provisioned memory from $0.0106 per GB-hour; Fast Data
//    Transfer 1 TB included then from $0.15 per GB; CDN requests 10M included
//    then $2 per million.
// The worked month is the Compute vs Vercel pricing post's (2026-07-01, rates
// unchanged since): 20M requests, 1,460 GB-hours, 300 vCPU-hours, 2 TB out,
// one seat.
const CHECKED_ON = "October 14, 2026";

type Row = {
  meter: string;
  prisma: string;
  vercel: string;
  /** Which side is lower on this row; omitted when it is not a like-for-like rate. */
  lower?: "prisma" | "vercel";
};

const ROWS: Row[] = [
  {
    meter: "Plan",
    prisma: "Free, or $10, $49 or $129 a month with 5M, 20M or 100M requests included",
    vercel: "$20 a month per developer, including a $20 usage credit",
  },
  {
    meter: "Requests",
    prisma: "$1 per million after the included amount",
    vercel: "$0.60 per million",
    lower: "vercel",
  },
  { meter: "Memory", prisma: "$0.006 per GB-hour", vercel: "$0.0106 per GB-hour", lower: "prisma" },
  {
    meter: "Active CPU",
    prisma: "$0.064 per vCPU-hour",
    vercel: "$0.128 per CPU-hour",
    lower: "prisma",
  },
  {
    meter: "Bandwidth",
    prisma: "$0.025 per GB",
    vercel: "1 TB a month included, then $0.15 per GB",
    lower: "prisma",
  },
  {
    meter: "Edge requests",
    prisma: "Not billed",
    vercel: "10M a month included, then $2 per million",
    lower: "prisma",
  },
  { meter: "Extra seats", prisma: "Not billed", vercel: "$20 a month each", lower: "prisma" },
];

export function PriceCompare({
  headline = "The same app costs less to run here",
  body = "Both platforms bill the work your app does and nothing while it idles. Prisma stops there. Vercel also bills the workflow around the app: seats, edge requests and builds. Here are the rates side by side.",
}: {
  headline?: string;
  body?: string;
}) {
  return (
    <section className="bg-white px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <Reveal className="max-w-3xl">
          <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
            {headline}
          </h2>
          <p className="mt-5 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            {body}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_64px_-32px_rgba(21,21,21,0.16)]">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-black/[0.08] bg-muted/40 text-sm">
                  <th scope="col" className="px-5 py-3.5 font-semibold text-muted-foreground">
                    Meter
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="size-2 rounded-full bg-prism-red-500" />
                      Prisma Compute
                    </span>
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-muted-foreground">
                    Vercel Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.meter} className="border-b border-black/[0.06] last:border-b-0">
                    <th
                      scope="row"
                      className="px-5 py-3.5 align-top text-sm font-semibold text-foreground/80"
                    >
                      {row.meter}
                    </th>
                    <td
                      className={cn(
                        "px-5 py-3.5 align-top",
                        row.lower === "prisma"
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {row.prisma}
                    </td>
                    <td
                      className={cn(
                        "px-5 py-3.5 align-top",
                        row.lower === "vercel"
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {row.vercel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* the proof in one number: the worked month from the pricing post */}
        <Reveal delay={0.15} className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded-2xl border border-prism-cyan-300 bg-prism-cyan-50/40 px-6 py-5">
            <p className="text-sm font-semibold text-foreground/70">
              The same 20M-request month, priced line by line
            </p>
            <p className="font-heading text-[1.75rem] leading-none text-foreground">
              about $98{" "}
              <span className="text-base font-normal text-muted-foreground">on Prisma Compute</span>
            </p>
            <p className="font-heading text-[1.75rem] leading-none text-muted-foreground">
              about $236{" "}
              <span className="text-base font-normal text-muted-foreground">on Vercel Pro</span>
            </p>
          </div>
          <p className="self-center text-sm leading-relaxed text-muted-foreground">
            That month assumes 20M requests, 2 GB held all month, 300 vCPU-hours of work, 2 TB of
            outbound traffic and one developer. At near-zero traffic the two converge; the gap
            widens with traffic, bandwidth and every teammate you add.
          </p>
        </Reveal>

        <p className="mt-5 max-w-[80ch] text-sm leading-relaxed text-muted-foreground">
          Rates as listed on prisma.io/pricing and vercel.com/pricing on {CHECKED_ON}. Vercel Pro
          rates are its &ldquo;starting at&rdquo; prices in its cheapest US regions. The worked
          month is from Prisma&rsquo;s Compute vs Vercel pricing comparison.
        </p>
      </div>
    </section>
  );
}
