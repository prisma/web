import { DecisionTree, type DecisionTreeData } from "./DecisionTree";

/**
 * The "How to choose" decision tree for the serverless Postgres guide.
 * Outcomes mirror the guide's prose recommendations, including the ones
 * that point at competitors; the prose above the widget remains the
 * canonical version of this guidance. An answer can fan out into several
 * candidate cards; options within one question are mutually exclusive.
 */
const tree: DecisionTreeData = {
  startId: "start",
  nodes: [
    {
      id: "start",
      question: "What are you choosing a database for?",
      options: [
        { label: "A side project or prototype", next: ["free-ppg", "free-neon"] },
        { label: "A production workload", next: "backend" },
      ],
    },
    {
      id: "free-ppg",
      accent: true,
      title: "Prisma Postgres",
      why: "100k operations, 500 MB and 50 databases per month free, with no card. Always ready, with no cold starts (our own architecture claim).",
      caveat: "Grows into $10/month for 1M operations. Prisma publishes this guide.",
    },
    {
      id: "free-neon",
      title: "Neon",
      why: "Each of up to 100 projects gets its own free 100 CU-hours and 0.5 GB per month, with scale-to-zero after 5 minutes idle.",
      caveat: "First query after idle takes a few hundred milliseconds. Supabase's free tier also works if week-idle pausing is acceptable.",
    },
    {
      id: "backend",
      question: "Do you want the platform to bundle more than the database?",
      options: [
        { label: "Yes, batteries included", next: ["r-supabase", "ppg-platform"] },
        { label: "No, I need Postgres", next: "shape" },
      ],
    },
    {
      id: "r-supabase",
      title: "Supabase",
      why: "The bundle is auth, storage, realtime and edge functions around Postgres, from $25/month with a Micro instance covered by credits.",
      caveat: "The economics are instance-shaped: paid projects are always-on, and serverless behaviors are not what you are buying.",
    },
    {
      id: "ppg-platform",
      title: "Prisma Postgres + Compute",
      accent: true,
      why: "A different bundle: database, ORM, and TypeScript app hosting designed together, with one schema and one config, and the app deployed next to the database.",
      caveat: "Prisma Compute is in public beta. Auth, storage, and realtime are not part of this bundle; that is Supabase's territory.",
    },
    {
      id: "shape",
      question: "Which best describes the workload?",
      options: [
        { label: "Steady and high-throughput, rarely idle", next: "aws" },
        { label: "Real idle periods (nights, weekends, bursts)", next: "latency" },
        { label: "A fleet of many small databases (per-tenant, per-user, per-agent)", next: ["fleet-ppg", "fleet-neon"] },
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
        { label: "Yes (cron jobs, internal tools, dev/test)", next: ["idle-neon", "idle-aurora"] },
        { label: "No, users are waiting on it", next: "volume" },
      ],
    },
    {
      id: "idle-neon",
      title: "Neon",
      why: "Scale-to-zero was built for exactly this: idle time costs storage only, and a few hundred milliseconds of wake-up is invisible to a cron job.",
      caveat: "If the workload later becomes user-facing, revisit; cold starts stop being free when someone is watching.",
    },
    {
      id: "idle-aurora",
      title: "Aurora auto-pause (on AWS)",
      why: "Set minimum capacity to 0 ACUs and instances pause after a configurable idle interval, with no compute charge while paused.",
      caveat: "Resume takes about 15 seconds, and an attached RDS Proxy prevents pausing entirely.",
    },
    {
      id: "volume",
      question: "Roughly how many queries a month?",
      options: [
        { label: "Up to about 10 million", next: "r-ppg" },
        { label: "More than that", next: ["x-alwayson", "x-ppg"] },
      ],
    },
    {
      id: "r-ppg",
      accent: true,
      title: "Prisma Postgres",
      why: "Operation-based billing fits this shape: the database is always ready (no cold starts, by our own architecture claim), idle time costs nothing extra, and up to about 10M queries a month stays inside the plan allowances ($10 covers 1M, $49 covers 10M).",
      caveat: "Prisma publishes this guide, so hold this recommendation to the same skepticism as the rest. Past roughly 24M queries a month the guide's own worked example shows an always-on Neon compute becomes cheaper.",
    },
    {
      id: "x-alwayson",
      title: "An always-on instance",
      why: "Neon with auto-suspend disabled runs about $77/month per CU ($0.106 × 730 hours); PlanetScale starts at $5/month single node or $50/month Metal; paid Supabase is $25/month with a Micro covered.",
      caveat: "No per-query component. The worked example in the pricing-models section shows the ~24M crossover against the $49 operations plan.",
    },
    {
      id: "x-ppg",
      title: "Prisma Postgres, higher tier",
      accent: true,
      why: "$1 per million operations at the top tier ($129/month with 50M included), always ready with no cold starts (our own claim).",
      caveat: "Compare against the always-on options at your exact query count. Prisma publishes this guide.",
    },
    {
      id: "fleet-ppg",
      accent: true,
      title: "Prisma Postgres",
      why: "Operations are metered account-wide across up to 1,000 databases on one plan, so a fleet of small databases shares one allowance.",
      caveat: "Prisma publishes this guide; the account-wide metering claim is from our pricing page.",
    },
    {
      id: "fleet-neon",
      title: "Neon",
      why: "Per-project allowances stretch far for fleets of prototypes: each of up to 100 projects brings its own free 100 CU-hours a month.",
      caveat: "This pattern is growing: Neon's telemetry had AI agents creating over 80% of databases on its platform as of May 2025.",
    },
  ],
};

export function ServerlessPostgresChooser() {
  return <DecisionTree data={tree} label="Find your provider in five questions or fewer" />;
}
