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
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    base: 0,
    opsIncluded: 100_000,
    opsOveragePer1K: null,
    storageIncludedGB: 0.5,
    storagePerGB: null,
  },
  {
    id: "starter",
    name: "Starter",
    base: 10,
    opsIncluded: 1_000_000,
    opsOveragePer1K: 0.008,
    storageIncludedGB: 10,
    storagePerGB: 2,
  },
  {
    id: "pro",
    name: "Pro",
    base: 49,
    opsIncluded: 10_000_000,
    opsOveragePer1K: 0.002,
    storageIncludedGB: 50,
    storagePerGB: 1.5,
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
  },
];

export type Estimate = {
  plan: Plan;
  eligible: boolean;
  opsOverage: number;
  storageOverage: number;
  total: number;
};

export function estimate(plan: Plan, ops: number, gb: number): Estimate {
  const opsOver = Math.max(0, ops - plan.opsIncluded);
  const gbOver = Math.max(0, gb - plan.storageIncludedGB);
  const eligible =
    (opsOver === 0 || plan.opsOveragePer1K !== null) &&
    (gbOver === 0 || plan.storagePerGB !== null);
  const opsOverage = plan.opsOveragePer1K ? (opsOver / 1_000) * plan.opsOveragePer1K : 0;
  const storageOverage = plan.storagePerGB ? gbOver * plan.storagePerGB : 0;
  return {
    plan,
    eligible,
    opsOverage,
    storageOverage,
    total: plan.base + opsOverage + storageOverage,
  };
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

export const OPS_CANDIDATES: number[] = [100_000];
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
  return gb < 1 ? `${Math.round(gb * 1000)} MB` : `${Math.round(gb)} GB`;
}

export function fmtUSD(n: number, cents = true) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

// Quick-start presets. Values chosen so each preset lands on a different plan
// — Free, then Starter, then Pro — per Shane (2026-07-29): the live
// calculator's presets (12M / 36M / 84M ops) recommended Pro, Pro, Business,
// so Starter was never recommended and Free never appeared at all.
export const PRESETS = [
  {
    id: "hobby",
    label: "Hobby",
    blurb: "Start free while you build, test, and learn your usage patterns.",
    ops: 100_000,
    gb: 0.5,
  },
  {
    id: "startup",
    label: "Startup",
    blurb: "Estimate production usage before you upgrade, then set a spend limit as traffic grows.",
    ops: 1_000_000,
    gb: 8,
  },
  {
    id: "scaleup",
    label: "Scaleup",
    blurb: "Model sustained traffic, compare plan costs, and keep spend capped as usage increases.",
    ops: 20_000_000,
    gb: 40,
  },
] as const;

/** Terms line under each plan, phrased as the live calculator phrases it. */
export function planTerms(plan: Plan) {
  if (plan.opsOveragePer1K === null || plan.storagePerGB === null) {
    return `${plan.opsIncluded.toLocaleString("en-US")} ops \u2022 ${plan.storageIncludedGB}GB storage \u2022 free forever`;
  }
  const ops = `${plan.opsIncluded.toLocaleString("en-US")} ops included, then $${plan.opsOveragePer1K} per 1,000`;
  const gb = `${plan.storageIncludedGB}GB included, then $${plan.storagePerGB}/GB`;
  return `${ops} \u2022 ${gb}`;
}

/**
 * Every plan priced for the given usage — eligible first, then cheapest.
 * Free is included (Shane: it's the natural starting point) but goes
 * ineligible above its caps, since it has no overage rates.
 */
export function priceAllPlans(ops: number, gb: number) {
  return PLANS.map((plan) => estimate(plan, ops, gb)).sort(
    (a, b) => Number(b.eligible) - Number(a.eligible) || a.total - b.total,
  );
}
