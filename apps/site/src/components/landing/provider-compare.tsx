import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Prisma Starter and Pro against the two setups the ad names, on list
// prices: what each one charges for, what the database costs, where the
// app runs, what data transfer costs, and what caps the bill. Every figure
// was read from the live pricing pages on CHECKED_ON:
//  - prisma.io/pricing: Starter $10 and Pro $49 a month; 1M / 10M operations
//    included then $8 / $2 per million; 10 GB / 50 GB storage then $2.00 /
//    $1.50 per GB; 1,000 databases; 5M / 20M Compute requests then $1 per
//    million; unlimited Prisma Postgres data transfer; a spend limit you
//    set on paid plans (none until set, docs /console/more/billing); daily
//    backups.
//  - neon.com/pricing: Launch has no monthly fee, $0.106 per CU-hour,
//    $0.35 per GB-month of storage, 500 GB of data transfer per project then
//    $0.10 per GB, extra branches $1.50 per branch-month, spending
//    notifications at 80% and 100%.
//  - vercel.com/pricing (Pro): $20 a month per developer seat with a $20
//    usage credit, invocations from $0.60 per million, Fluid active CPU from
//    $0.128 per hour, memory from $0.0106 per GB-hour, 1 TB of Fast Data
//    Transfer then from $0.15 per GB, spend management with a budget and an
//    optional pause.
//  - supabase.com/pricing (Pro): from $25 a month per organization with $10
//    of compute credits, Micro compute $10 a month per project, 8 GB disk per
//    project then $0.125 per GB, 250 GB of egress then $0.09 per GB,
//    branching compute $0.01344 per branch-hour, Spend Cap on by default and
//    not covering compute.
// The 50K MAU figures in the hero are the pricing page's own and are not
// repeated here; this table is the list prices a visitor can check.
const CHECKED_ON = "October 21, 2026";

type Row = {
  label: string;
  prisma: string;
  neonVercel: string;
  supabase: string;
};

const ROWS: Row[] = [
  {
    label: "Plan price",
    prisma: "Starter $10 or Pro $49 a month, covering the app and the database",
    neonVercel:
      "Neon Launch has no monthly fee, usage only. Vercel Pro is $20 a month per developer seat with $20 of usage credit",
    supabase: "From $25 a month per organization, plus compute billed per project",
  },
  {
    label: "Database",
    prisma:
      "1M (Starter) or 10M (Pro) operations a month included, then $8 or $2 per million. 10 GB or 50 GB of storage included, then $2.00 or $1.50 per GB",
    neonVercel: "Neon: $0.106 per CU-hour of compute on Launch, plus $0.35 per GB-month of storage",
    supabase:
      "Micro compute from $10 a month per project ($10 of credit included on Pro). 8 GB of disk per project, then $0.125 per GB",
  },
  {
    label: "App hosting",
    prisma:
      "Included on the same plan: 5M or 20M requests a month, then $1 per million, with memory, CPU and bandwidth metered",
    neonVercel:
      "Vercel: invocations from $0.60 per million, active CPU from $0.128 an hour, memory from $0.0106 per GB-hour",
    supabase: "Edge Functions for backend logic. The frontend is hosted elsewhere",
  },
  {
    label: "Database data transfer",
    prisma: "Unlimited, included on every plan",
    neonVercel: "Neon: 500 GB per project included, then $0.10 per GB",
    supabase: "250 GB of egress included, then $0.09 per GB",
  },
  {
    label: "Databases and previews",
    prisma:
      "1,000 databases on Starter and Pro. A preview branch gets its own database, with no surcharge",
    neonVercel: "Neon: extra branches $1.50 per branch-month above the plan allowance",
    supabase: "Branching compute $0.01344 per branch per hour",
  },
  {
    label: "Spend limits",
    prisma: "A hard spend limit you set, on every paid plan",
    neonVercel:
      "Neon: spending notifications at 80% and 100%. Vercel: a spend budget with an optional pause",
    supabase: "Spend Cap on by default on Pro; database compute is not covered",
  },
];

export function ProviderCompare({
  headline = "The list prices, side by side",
  body = "The hero figures are an estimate for one shape of app. These are the published rates behind them, so you can price your own.",
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
            <table className="w-full min-w-[52rem] border-collapse text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-black/[0.08] bg-muted/40 text-sm">
                  <th scope="col" className="px-5 py-3.5 font-semibold text-muted-foreground">
                    &nbsp;
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="size-2 rounded-full bg-prism-cyan-400" />
                      Prisma Starter and Pro
                    </span>
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-muted-foreground">
                    Neon + Vercel
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-muted-foreground">
                    Supabase Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-black/[0.06] last:border-b-0">
                    <th
                      scope="row"
                      className="px-5 py-4 align-top text-sm font-semibold text-foreground/80"
                    >
                      {row.label}
                    </th>
                    <td className={cn("px-5 py-4 align-top font-medium text-foreground")}>
                      {row.prisma}
                    </td>
                    <td className="px-5 py-4 align-top text-muted-foreground">{row.neonVercel}</td>
                    <td className="px-5 py-4 align-top text-muted-foreground">{row.supabase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mt-5 max-w-[80ch] text-sm leading-relaxed text-muted-foreground">
          Rates as listed on prisma.io/pricing, neon.com/pricing, vercel.com/pricing and
          supabase.com/pricing on {CHECKED_ON}. Neon and Vercel rates are their Launch and Pro
          plans&rsquo; &ldquo;starting at&rdquo; prices. The 50K MAU figures above are
          Prisma&rsquo;s published scenario on prisma.io/pricing.
        </p>
      </div>
    </section>
  );
}
