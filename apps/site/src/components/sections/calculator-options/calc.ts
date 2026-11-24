// Shared pricing math for the calculator design exploration.
// Rates confirmed by Gregory (2026-07-24): overage $8 / $2 / $1 per M ops
// (Starter / Pro / Business). Databases cap 1,000 on all paid plans.
//
// Business's storage overage was never given to us directly, so it is taken
// from the live page (https://www.prisma.io/pricing, read 2026-07-28), which
// publishes $1.00/GB. Nothing here is guessed — if a rate is ever missing,
// leave it null and cap the slider rather than inventing one.

export type PlanId = "free" | "starter" | "pro" | "business";

export type Plan = {
  id: PlanId;
  name: string;
  base: number;
  opsIncluded: number;
  /** $ per 1,000 operations over the included amount. */
  opsOveragePer1K: number | null;
  storageIncludedGB: number;
  storagePerGB: number | null;
  /** Prisma Compute requests included each month. */
  requestsIncluded: number;
  /**
   * Whether Compute usage is billed. Free has no usage billing: it includes
   * fixed amounts of every meter (FREE_COMPUTE_LIMITS) and goes ineligible
   * above them. Paid plans bill memory, CPU, and bandwidth from the first unit.
   */
  computeBilled: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    base: 0,
    opsIncluded: 200_000,
    opsOveragePer1K: null,
    storageIncludedGB: 2,
    storagePerGB: null,
    requestsIncluded: 1_000_000,
    computeBilled: false,
  },
  {
    id: "starter",
    name: "Starter",
    base: 10,
    opsIncluded: 1_000_000,
    opsOveragePer1K: 0.008,
    storageIncludedGB: 10,
    storagePerGB: 2,
    requestsIncluded: 5_000_000,
    computeBilled: true,
  },
  {
    id: "pro",
    name: "Pro",
    base: 49,
    opsIncluded: 10_000_000,
    opsOveragePer1K: 0.002,
    storageIncludedGB: 50,
    storagePerGB: 1.5,
    requestsIncluded: 20_000_000,
    computeBilled: true,
  },
  {
    id: "business",
    name: "Business",
    base: 129,
    opsIncluded: 50_000_000,
    opsOveragePer1K: 0.001,
    storageIncludedGB: 100,
    // $1.00/GB per the live pricing page — not the $1.50 previously copied
    // over from Pro, which overcharged every Business storage estimate.
    storagePerGB: 1,
    requestsIncluded: 100_000_000,
    computeBilled: true,
  },
];

// ---- Prisma Compute ----
// Rates and Free limits from the Compute pricing docs
// (apps/docs/content/docs/compute/pricing.mdx). Keep in sync with those and
// with the Prisma Compute group in pricing-plans.tsx.

export const COMPUTE_RATES = {
  requestsPerMillion: 1,
  memoryPerGBHour: 0.006,
  cpuPerVcpuHour: 0.064,
  bandwidthPerGB: 0.025,
} as const;

export const FREE_COMPUTE_LIMITS = {
  requests: 1_000_000,
  memoryGBHours: 360,
  cpuHours: 4,
  bandwidthGB: 10,
} as const;

export type AppProfileId = "none" | "api" | "agent" | "files";

export type AppProfile = {
  id: AppProfileId;
  label: string;
  /** Memory held per request, in GB-seconds (time running × GB allocated). */
  memoryGBSecondsPerRequest: number;
  /** Active CPU per request, in vCPU-seconds. */
  cpuSecondsPerRequest: number;
  /** Outbound data per request, in GB. */
  bandwidthGBPerRequest: number;
  /** What sets this type's Compute cost apart, under its name in step 1. */
  trait: string;
  /** Plain-language version of the three figures above, for the explainer. */
  perRequest: string;
  /** The worked example in the Compute pricing docs the figures come from. */
  source: string;
};

// Per-request figures are the docs' three worked examples divided by their
// request counts, so nothing here is invented — each traces to a published
// example. They are typical shapes, not measurements of anyone's app; the
// explainer under the calculator says so and shows the arithmetic.
//   Preview:       10,000 req, 3,000 s at 1 GB, 600 vCPU-s, 0.25 GB out
//   Agent:         10,000 req, 300,000 s at 1 GB, 30,000 vCPU-s, 5 GB out
//   High-transfer: 50,000 req, 15,000 s at 1 GB, 1,500 vCPU-s, 200 GB out
export const APP_PROFILES: AppProfile[] = [
  {
    id: "none",
    label: "Database only",
    trait: "Postgres only",
    memoryGBSecondsPerRequest: 0,
    cpuSecondsPerRequest: 0,
    bandwidthGBPerRequest: 0,
    perRequest: "",
    source: "",
  },
  {
    id: "api",
    label: "API or web app",
    trait: "~0.3 s per request",
    memoryGBSecondsPerRequest: 0.3,
    cpuSecondsPerRequest: 0.06,
    bandwidthGBPerRequest: 0.000025,
    perRequest: "runs 0.3 s at 1 GB, uses 60 ms of CPU, and sends 25 KB",
    source: "preview workflow",
  },
  {
    id: "agent",
    label: "Agent or long tasks",
    trait: "~30 s per request",
    memoryGBSecondsPerRequest: 30,
    cpuSecondsPerRequest: 3,
    bandwidthGBPerRequest: 0.0005,
    perRequest: "runs 30 s at 1 GB (mostly waiting on a model), uses 3 s of CPU, and sends 0.5 MB",
    source: "agent workflow",
  },
  {
    id: "files",
    label: "Files or streaming",
    trait: "~4 MB per request",
    memoryGBSecondsPerRequest: 0.3,
    cpuSecondsPerRequest: 0.03,
    bandwidthGBPerRequest: 0.004,
    perRequest: "runs 0.3 s at 1 GB, uses 30 ms of CPU, and sends 4 MB",
    source: "high-transfer workflow",
  },
];

export type ComputeInput = { requests: number; profile: AppProfile };

export type ComputeUsage = {
  requests: number;
  memoryGBHours: number;
  cpuHours: number;
  bandwidthGB: number;
};

export function computeUsage({ requests, profile }: ComputeInput): ComputeUsage {
  if (profile.id === "none") {
    return { requests: 0, memoryGBHours: 0, cpuHours: 0, bandwidthGB: 0 };
  }
  return {
    requests,
    memoryGBHours: (requests * profile.memoryGBSecondsPerRequest) / 3600,
    cpuHours: (requests * profile.cpuSecondsPerRequest) / 3600,
    bandwidthGB: requests * profile.bandwidthGBPerRequest,
  };
}

export type ComputeCost = {
  requests: number;
  memory: number;
  cpu: number;
  bandwidth: number;
  total: number;
};

/** Each meter's charge on a plan. Free is always $0 — eligibility is separate. */
export function computeCost(plan: Plan, usage: ComputeUsage): ComputeCost {
  if (!plan.computeBilled) {
    return { requests: 0, memory: 0, cpu: 0, bandwidth: 0, total: 0 };
  }
  const requests =
    (Math.max(0, usage.requests - plan.requestsIncluded) / 1_000_000) *
    COMPUTE_RATES.requestsPerMillion;
  const memory = usage.memoryGBHours * COMPUTE_RATES.memoryPerGBHour;
  const cpu = usage.cpuHours * COMPUTE_RATES.cpuPerVcpuHour;
  const bandwidth = usage.bandwidthGB * COMPUTE_RATES.bandwidthPerGB;
  return { requests, memory, cpu, bandwidth, total: requests + memory + cpu + bandwidth };
}

function fitsFreeCompute(usage: ComputeUsage) {
  return (
    usage.requests <= FREE_COMPUTE_LIMITS.requests &&
    usage.memoryGBHours <= FREE_COMPUTE_LIMITS.memoryGBHours &&
    usage.cpuHours <= FREE_COMPUTE_LIMITS.cpuHours &&
    usage.bandwidthGB <= FREE_COMPUTE_LIMITS.bandwidthGB
  );
}

const NO_COMPUTE: ComputeUsage = { requests: 0, memoryGBHours: 0, cpuHours: 0, bandwidthGB: 0 };

export type Estimate = {
  plan: Plan;
  eligible: boolean;
  opsOverage: number;
  storageOverage: number;
  /** Plan price plus Postgres overages. */
  postgresTotal: number;
  compute: ComputeCost;
  total: number;
};

// `compute` is optional so the design-exploration variants, which price
// Postgres only, keep working unchanged.
export function estimate(
  plan: Plan,
  ops: number,
  gb: number,
  compute: ComputeUsage = NO_COMPUTE,
): Estimate {
  const opsOver = Math.max(0, ops - plan.opsIncluded);
  const gbOver = Math.max(0, gb - plan.storageIncludedGB);
  const eligible =
    (opsOver === 0 || plan.opsOveragePer1K !== null) &&
    (gbOver === 0 || plan.storagePerGB !== null) &&
    (plan.computeBilled || fitsFreeCompute(compute));
  const opsOverage = plan.opsOveragePer1K ? (opsOver / 1_000) * plan.opsOveragePer1K : 0;
  const storageOverage = plan.storagePerGB ? gbOver * plan.storagePerGB : 0;
  const postgresTotal = plan.base + opsOverage + storageOverage;
  const computeCharges = computeCost(plan, compute);
  return {
    plan,
    eligible,
    opsOverage,
    storageOverage,
    postgresTotal,
    compute: computeCharges,
    total: postgresTotal + computeCharges.total,
  };
}

// ---- itemized bill ----
// One line per meter for the calculator's live bill: what was used, how it
// was priced, and what it costs. On Free there is no usage billing, so each
// line instead reports usage against Free's limit and flags the ones it
// exceeds — that is the reason Free shows as unavailable.

export type BillLineStatus = "charged" | "included" | "over-limit";

export type BillLine = {
  label: string;
  /** "100K of 5M included", "8.3 GB-hours × $0.006", "5 of 4 vCPU-hours". */
  detail: string;
  amount: number;
  status: BillLineStatus;
};

export type Bill = { compute: BillLine[]; postgres: BillLine[] };

function limitLine(label: string, used: number, limit: number, unit: (n: number) => string) {
  return {
    label,
    detail: `${unit(used)} of ${unit(limit)}`,
    amount: 0,
    status: used <= limit ? "included" : "over-limit",
  } satisfies BillLine;
}

function allowanceLine(
  label: string,
  used: number,
  included: number,
  fmt: (n: number) => string,
  overDetail: (over: number) => string,
  amount: number,
): BillLine {
  const over = Math.max(0, used - included);
  return over === 0
    ? { label, detail: `${fmt(used)} of ${fmt(included)} included`, amount: 0, status: "included" }
    : { label, detail: overDetail(over), amount, status: "charged" };
}

export function itemize(plan: Plan, ops: number, gb: number, usage: ComputeUsage): Bill {
  const e = estimate(plan, ops, gb, usage);
  const gbUnit = (n: number) => (n < 1 ? fmtGB(n) : `${fmtQty(n)} GB`);

  const compute: BillLine[] = !plan.computeBilled
    ? [
        limitLine("Requests", usage.requests, FREE_COMPUTE_LIMITS.requests, fmtOps),
        limitLine(
          "Memory",
          usage.memoryGBHours,
          FREE_COMPUTE_LIMITS.memoryGBHours,
          (n) => `${fmtQty(n)} GB-hours`,
        ),
        limitLine(
          "CPU",
          usage.cpuHours,
          FREE_COMPUTE_LIMITS.cpuHours,
          (n) => `${fmtQty(n)} vCPU-hours`,
        ),
        limitLine("Bandwidth", usage.bandwidthGB, FREE_COMPUTE_LIMITS.bandwidthGB, gbUnit),
      ]
    : [
        allowanceLine(
          "Requests",
          usage.requests,
          plan.requestsIncluded,
          fmtOps,
          (over) => `${fmtOps(over)} extra × $${COMPUTE_RATES.requestsPerMillion} per million`,
          e.compute.requests,
        ),
        {
          label: "Memory",
          detail: `${fmtQty(usage.memoryGBHours)} GB-hours × $${COMPUTE_RATES.memoryPerGBHour}`,
          amount: e.compute.memory,
          status: "charged",
        },
        {
          label: "CPU",
          detail: `${fmtQty(usage.cpuHours)} vCPU-hours × $${COMPUTE_RATES.cpuPerVcpuHour}`,
          amount: e.compute.cpu,
          status: "charged",
        },
        {
          label: "Bandwidth",
          detail: `${gbUnit(usage.bandwidthGB)} × $${COMPUTE_RATES.bandwidthPerGB}`,
          amount: e.compute.bandwidth,
          status: "charged",
        },
      ];

  const postgres: BillLine[] =
    plan.opsOveragePer1K === null || plan.storagePerGB === null
      ? [
          limitLine("Operations", ops, plan.opsIncluded, fmtOps),
          limitLine("Storage", gb, plan.storageIncludedGB, gbUnit),
        ]
      : [
          allowanceLine(
            "Operations",
            ops,
            plan.opsIncluded,
            fmtOps,
            (over) =>
              `${fmtOps(over)} extra × $${Math.round(plan.opsOveragePer1K! * 1_000_000) / 1_000} per million`,
            e.opsOverage,
          ),
          allowanceLine(
            "Storage",
            gb,
            plan.storageIncludedGB,
            gbUnit,
            (over) => `${gbUnit(over)} extra × $${plan.storagePerGB!.toFixed(2)} per GB`,
            e.storageOverage,
          ),
        ];

  return { compute, postgres };
}

export type Recommendation = {
  best: Estimate;
  all: Estimate[];
  /** Past what Business comfortably covers — nudge toward custom pricing. */
  custom: boolean;
};

export function recommend(ops: number, gb: number): Recommendation {
  const all = PLANS.map((p) => estimate(p, ops, gb));
  const eligible = all.filter((e) => e.eligible);
  const best = eligible.reduce((a, b) => (b.total < a.total ? b : a));
  return { best, all, custom: ops > 200_000_000 };
}

// ---- input mapping (log-scale sliders, snapped to 2 significant digits) ----

export const OPS_MIN = 50_000;
export const OPS_MAX = 200_000_000;
export const GB_MIN = 0.25;
export const GB_MAX = 500;

function toLog(v: number, min: number, max: number) {
  return (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
}
function fromLog(t: number, min: number, max: number) {
  return 10 ** (Math.log10(min) + t * (Math.log10(max) - Math.log10(min)));
}
function snap2(v: number) {
  const mag = 10 ** Math.floor(Math.log10(v));
  return Math.round((v / mag) * 10) * (mag / 10);
}

/** t in [0,1] -> operations, snapped so the readout looks intentional. */
export function tToOps(t: number) {
  return snap2(fromLog(t, OPS_MIN, OPS_MAX));
}
export function opsToT(ops: number) {
  return toLog(ops, OPS_MIN, OPS_MAX);
}
export function tToGB(t: number) {
  const v = fromLog(t, GB_MIN, GB_MAX);
  return v < 1 ? Math.round(v * 4) / 4 : snap2(v);
}
export function gbToT(gb: number) {
  return toLog(gb, GB_MIN, GB_MAX);
}

// 1,000, not 10,000: below 10,000 requests some app types fit Free's
// Compute limits, and the slider has to be able to show that (review,
// 2026-11-24).
export const REQUESTS_MIN = 1_000;
export const REQUESTS_MAX = 200_000_000;
export function tToRequests(t: number) {
  return snap2(fromLog(t, REQUESTS_MIN, REQUESTS_MAX));
}
export function requestsToT(requests: number) {
  return toLog(requests, REQUESTS_MIN, REQUESTS_MAX);
}

// ---- price-stop sliders ----
// Every slider stop changes the actual price — flat zones collapse to the
// last value they cover (so "1M" reads as "up to 1M included"). Candidates
// are round usage values; the filter keeps one representative per price.

export function lastOfRuns(candidates: number[], total: (v: number) => number) {
  const out: number[] = [];
  for (let i = 0; i < candidates.length; i++) {
    if (i === candidates.length - 1 || total(candidates[i + 1]) !== total(candidates[i])) {
      out.push(candidates[i]);
    }
  }
  return out;
}

export const OPS_CANDIDATES: number[] = [200_000];
for (let v = 250_000; v <= 10_000_000; v += 250_000) OPS_CANDIDATES.push(v);
for (let v = 11_000_000; v <= 50_000_000; v += 1_000_000) OPS_CANDIDATES.push(v);
for (let v = 52_000_000; v <= 200_000_000; v += 2_000_000) OPS_CANDIDATES.push(v);

export const GB_CANDIDATES: number[] = [0.25, 0.5];
for (let v = 1; v <= 100; v += 1) GB_CANDIDATES.push(v);
for (let v = 110; v <= 500; v += 10) GB_CANDIDATES.push(v);

export function nearest(stops: number[], v: number) {
  return stops.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
}

// ---- formatting ----

export function fmtOps(n: number) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m >= 10 || Number.isInteger(m) ? Math.round(m) : m.toFixed(1)}M`;
  }
  return `${Math.round(n / 1_000)}K`;
}

export function fmtGB(gb: number) {
  return gb < 1 ? `${Math.round(gb * 1000)} MB` : `${+gb.toFixed(2)} GB`;
}

export function fmtUSD(n: number, cents = true) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

/** Dollars to the cent, but "<$0.01" rather than "$0.00" for a real charge. */
export function fmtCost(n: number) {
  return n > 0 && n < 0.005 ? "<$0.01" : fmtUSD(n);
}

/** Usage quantities: two decimals below 1, one below 100, whole above. */
export function fmtQty(n: number) {
  const digits = n < 1 ? 2 : n < 100 ? 1 : 0;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

// Quick-start presets ("How big is it?", step 2 of the calculator). Values
// chosen so each preset lands on a different plan — Free, then Starter, then Pro — per Shane (2026-07-29): the live
// calculator's presets (12M / 36M / 84M ops) recommended Pro, Pro, Business,
// so Starter was never recommended and Free never appeared at all.
// `requests` (Compute, added 2026-11-21) is one request per database operation
// on Startup and Scaleup, and half that on the side project so it stays inside
// Free's 4 vCPU-hours with the default app type; with Compute included the
// presets still land on Free, Starter, and Pro.
export const PRESETS = [
  {
    id: "hobby",
    label: "Side project",
    blurb: "Start free while you build, test, and learn your usage patterns.",
    ops: 200_000,
    gb: 0.5,
    requests: 100_000,
  },
  {
    id: "startup",
    label: "Startup",
    blurb: "Estimate production usage before you upgrade, then set a spend limit as traffic grows.",
    ops: 1_000_000,
    gb: 8,
    requests: 1_000_000,
  },
  {
    id: "scaleup",
    label: "Scaleup",
    blurb:
      "Model sustained traffic, compare plan costs, and review your spend limit as usage increases.",
    ops: 20_000_000,
    gb: 40,
    requests: 20_000_000,
  },
] as const;

/**
 * Every plan priced for the given usage — eligible first, then cheapest.
 * Free is included (Shane: it's the natural starting point) but goes
 * ineligible above its caps, since it has no overage rates.
 */
export function priceAllPlans(ops: number, gb: number, compute?: ComputeUsage) {
  return PLANS.map((plan) => estimate(plan, ops, gb, compute)).sort(
    (a, b) => Number(b.eligible) - Number(a.eligible) || a.total - b.total,
  );
}
