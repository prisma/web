import { DecisionTree, type DecisionTreeData } from "./DecisionTree";

/**
 * The "How to choose" decision tree for the serverless Postgres guide.
 * Outcomes mirror the guide's prose recommendations, including the ones
 * that point at competitors; the prose above the widget remains the
 * canonical version of this guidance.
 */
const tree: DecisionTreeData = {
  startId: "free",
  nodes: [
    {
      id: "free",
      question: "Is this a side project or prototype where a free tier should cover it?",
      options: [
        { label: "Yes", next: "r-free" },
        { label: "No, this is a workload with a budget", next: "backend" },
      ],
    },
    {
      id: "r-free",
      title: "Use a free tier; three are serious options",
      why: "Prisma Postgres gives you 100k operations, 500 MB and 50 databases per month with no card. Neon gives each of up to 100 projects 100 CU-hours and 0.5 GB per month. Supabase gives 2 projects if you accept pausing after a week idle.",
      caveat: "Start with the one whose paid model fits where the project would grow; migrating Postgres is easy early and annoying later.",
    },
    {
      id: "backend",
      question: "Do you want a bundled backend (auth, storage, realtime) with the database?",
      options: [
        { label: "Yes, the whole backend", next: "r-supabase" },
        { label: "No, I need Postgres", next: "shape" },
      ],
    },
    {
      id: "r-supabase",
      title: "Supabase",
      why: "The bundle is the product: auth, storage, realtime and edge functions around Postgres, from $25/month with a Micro instance covered by credits.",
      caveat: "The economics are instance-shaped: paid projects are always-on, and serverless behaviors are not what you are buying.",
    },
    {
      id: "shape",
      question: "Which best describes the workload?",
      options: [
        { label: "Steady and high-throughput, rarely idle", next: "aws" },
        { label: "Real idle periods (nights, weekends, bursts)", next: "latency" },
        { label: "A fleet of many small databases (per-tenant, per-user, per-agent)", next: "r-fleet" },
      ],
    },
    {
      id: "aws",
      question: "Is your infrastructure already committed to AWS?",
      options: [
        { label: "Yes, deep in AWS", next: "r-aurora" },
        { label: "No", next: "r-planetscale" },
      ],
    },
    {
      id: "r-aurora",
      title: "Aurora, sized for the load",
      why: "At sustained throughput you want dedicated capacity inside the ecosystem you already run: IAM, VPC peering, global databases.",
      caveat: "Skip auto-pause for this workload shape; it is built for idle periods you do not have.",
    },
    {
      id: "r-planetscale",
      title: "PlanetScale",
      why: "Always-on dedicated clusters from $5/month (single node) or $50/month on Metal, prorated to the millisecond. At sustained load, paying for every hour beats metering.",
      caveat: "There is no free tier and nothing scales to zero; a quiet month still bills the instance.",
    },
    {
      id: "latency",
      question: "Can the first query after an idle stretch afford to be slow?",
      options: [
        { label: "Yes (cron jobs, internal tools, dev/test)", next: "r-neon" },
        { label: "No, users are waiting on it", next: "volume" },
      ],
    },
    {
      id: "r-neon",
      title: "Neon (or Aurora auto-pause on AWS)",
      why: "Scale-to-zero was built for exactly this: idle time costs storage only, and a few hundred milliseconds of wake-up (about 15 seconds on Aurora) is invisible to a cron job.",
      caveat: "If the workload later becomes user-facing, revisit; cold starts stop being free when someone is watching.",
    },
    {
      id: "volume",
      question: "Roughly how many queries a month?",
      options: [
        { label: "Up to the low tens of millions", next: "r-ppg" },
        { label: "Hundreds of millions and up", next: "r-crossover" },
      ],
    },
    {
      id: "r-ppg",
      title: "Prisma Postgres",
      why: "Operation-based billing fits this shape: the database is always ready (no cold starts, by our own architecture claim), idle time costs nothing extra, and at this volume the per-query math stays cheap; 30M queries a month lands around $89.",
      caveat: "Prisma publishes this guide, so hold this recommendation to the same skepticism as the rest; the crossover math is in the pricing-models section above.",
    },
    {
      id: "r-crossover",
      title: "Do the crossover math",
      why: "At this volume the candidates converge: Neon with auto-suspend disabled (about $77/month per always-on CU), a small PlanetScale instance ($5 to $50/month), or Prisma Postgres on a higher tier ($1 per million operations at the top tier). The cheapest option depends on your exact query count and compute needs.",
      caveat: "The worked example in the pricing-models section above shows how to run this comparison for your numbers.",
    },
    {
      id: "r-fleet",
      title: "Prisma Postgres (metered fleet) or Neon (per-project allowances)",
      why: "Prisma Postgres meters operations account-wide across up to 1,000 databases on one plan, so a fleet of small databases shares one allowance. Neon's per-project free tier also stretches far for fleets of prototypes.",
      caveat: "This is the fastest-growing workload shape; Neon's telemetry had AI agents creating over 80% of new databases as of May 2025.",
    },
  ],
};

export function ServerlessPostgresChooser() {
  return <DecisionTree data={tree} label="Find your provider in five questions or fewer" />;
}
