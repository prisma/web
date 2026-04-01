"use client";
import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  Slider,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@prisma/eclipse";
import {
  plans,
  type BillablePricingPlanKey,
  type Symbol,
  symbols,
  usagePricing,
} from "./pricing-data";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PresetKey = "hobby" | "startup" | "scaleup";
type BillingCycle = "monthly" | "yearly";
type RecommendedSelection = BillablePricingPlanKey | "enterprise";
type CostBreakdown = {
  basePlanFee: number;
  billableOperations: number;
  operationsCost: number;
  billableStorageGb: number;
  storageCost: number;
};

const SQL_QUERY_MULTIPLIER = 5;
const ENTERPRISE_OPERATIONS_THRESHOLD = 280_000_000;
const MAX_DATABASE_OPERATIONS = 300_000_000;

const PRESETS: Record<
  PresetKey,
  {
    label: string;
    icon: string;
    databaseOperations: number;
    storageGb: number;
  }
> = {
  hobby: {
    label: "Hobby",
    icon: "fa-regular fa-rocket-launch",
    databaseOperations: 12_000_000,
    storageGb: 8,
  },
  startup: {
    label: "Startup",
    icon: "fa-solid fa-bolt",
    databaseOperations: 36_000_000,
    storageGb: 18,
  },
  scaleup: {
    label: "Scaleup",
    icon: "fa-solid fa-building",
    databaseOperations: 84_000_000,
    storageGb: 40,
  },
};

const CALCULATOR_PLAN_ORDER = Object.keys(
  usagePricing,
) as BillablePricingPlanKey[];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function formatCurrency(value: number, currency: Symbol, digits = 2) {
  return `${symbols[currency]}${value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

function formatCompactCurrency(value: number, currency: Symbol) {
  return `${symbols[currency]}${value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 2,
  })}`;
}

function formatLineItemCost(value: number, currency: Symbol) {
  if (value <= 0) {
    return "Free";
  }

  return formatCurrency(value, currency);
}

function getPlanDescription(plan: BillablePricingPlanKey, currency: Symbol) {
  const details = usagePricing[plan];

  return `${formatNumber(details.includedOperations)} ops included, then ${formatCompactCurrency(details.operationPricePerThousand, currency)} per 1,000 • ${details.includedStorageGb}GB included, then ${formatCompactCurrency(details.storagePricePerGb, currency)}/GB`;
}

function calculateMonthlyPlanCost(
  plan: BillablePricingPlanKey,
  databaseOperations: number,
  storageGb: number,
) {
  const details = usagePricing[plan];
  const extraOperations = Math.max(0, databaseOperations - details.includedOperations);
  const extraStorageGb = Math.max(0, storageGb - details.includedStorageGb);

  return (
    details.baseMonthlyPrice +
    extraOperations / 1_000 * details.operationPricePerThousand +
    extraStorageGb * details.storagePricePerGb
  );
}

function calculateDisplayedPlanCost(
  plan: BillablePricingPlanKey,
  databaseOperations: number,
  storageGb: number,
  billingCycle: BillingCycle,
) {
  const monthlyCost = calculateMonthlyPlanCost(plan, databaseOperations, storageGb);

  if (billingCycle === "monthly") {
    return monthlyCost;
  }

  return monthlyCost * (1 - usagePricing[plan].yearlyDiscount);
}

function calculatePlanBreakdown(
  plan: BillablePricingPlanKey,
  databaseOperations: number,
  storageGb: number,
  billingCycle: BillingCycle,
): CostBreakdown {
  const details = usagePricing[plan];
  const billableOperations = Math.max(
    0,
    databaseOperations - details.includedOperations,
  );
  const billableStorageGb = Math.max(0, storageGb - details.includedStorageGb);
  const operationsCost =
    billableOperations / 1_000 * details.operationPricePerThousand;
  const storageCost = billableStorageGb * details.storagePricePerGb;
  const yearlyMultiplier =
    billingCycle === "yearly" ? 1 - details.yearlyDiscount : 1;

  return {
    basePlanFee: details.baseMonthlyPrice * yearlyMultiplier,
    billableOperations,
    operationsCost: operationsCost * yearlyMultiplier,
    billableStorageGb,
    storageCost: storageCost * yearlyMultiplier,
  };
}

function getRecommendedPlan(
  databaseOperations: number,
  storageGb: number,
  billingCycle: BillingCycle,
): RecommendedSelection {
  if (databaseOperations >= ENTERPRISE_OPERATIONS_THRESHOLD) {
    return "enterprise";
  }

  return CALCULATOR_PLAN_ORDER.reduce((bestPlan, candidatePlan) => {
    const bestCost = calculateDisplayedPlanCost(
      bestPlan,
      databaseOperations,
      storageGb,
      billingCycle,
    );
    const candidateCost = calculateDisplayedPlanCost(
      candidatePlan,
      databaseOperations,
      storageGb,
      billingCycle,
    );

    return candidateCost < bestCost ? candidatePlan : bestPlan;
  });
}

function getMatchingPreset(
  databaseOperations: number,
  storageGb: number,
): PresetKey | null {
  const match = (
    Object.entries(PRESETS) as Array<[PresetKey, (typeof PRESETS)[PresetKey]]>
  ).find(
    ([, preset]) =>
      preset.databaseOperations === databaseOperations &&
      preset.storageGb === storageGb,
  );

  return match?.[0] ?? null;
}

function InputShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-[12px] border border-stroke-neutral bg-background-neutral px-3 text-sm text-foreground-neutral",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SummaryCard({
  title,
  description,
  price,
  currency,
  breakdown,
  plan,
  highlighted = false,
  expanded = false,
  onToggle,
  yearly = false,
}: {
  title: string;
  description: string;
  price: number;
  currency: Symbol;
  breakdown: CostBreakdown;
  plan: BillablePricingPlanKey;
  highlighted?: boolean;
  expanded?: boolean;
  onToggle: () => void;
  yearly?: boolean;
}) {
  const planDetails = usagePricing[plan];

  return (
    <div className="rounded-[18px]  p-4 shadow-box-low">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_234px] sm:items-start">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="m-0 text-[18px] leading-7 font-sans-display [font-variation-settings:'wght'_700] text-foreground-neutral">
              {title}
            </h4>
            {highlighted && (
              <Badge
                color="ppg"
                className="rounded-full border border-stroke-ppg"
                label="Recommended"
              />
            )}
          </div>
          <p className="m-0 max-w-[277px] text-xs leading-4 text-foreground-neutral-weaker" dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(
            "relative flex min-h-[70px] w-full flex-col items-center justify-center rounded-[16px] border px-4 py-3 text-center shadow-box-low transition-colors",
            highlighted
              ? "border-stroke-ppg bg-background-ppg"
              : "border-stroke-neutral bg-background-neutral-weak hover:border-stroke-neutral-strong",
          )}
        >
          <div className="text-3xl leading-8 font-bold text-foreground-neutral">
            {formatCurrency(price, currency)}
          </div>
          <div className="mt-1 text-sm text-foreground-neutral-weak">
            {yearly ? "per month billed yearly" : "per month"}
          </div>
          <i
            className={cn(
              "fa-solid fa-chevron-down absolute right-4 top-4 text-xs text-foreground-neutral-weak transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-stroke-neutral pt-4">
          <div className="space-y-3 text-sm text-foreground-neutral">
            <div className="flex items-center justify-between gap-4">
              <span>Base plan fee</span>
              <span
                className={cn(
                  "text-right",
                  breakdown.basePlanFee <= 0 && "text-foreground-neutral-weaker",
                )}
              >
                {formatLineItemCost(breakdown.basePlanFee, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span>Billable database operations</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-foreground-neutral-weaker transition-colors hover:text-foreground-neutral"
                      aria-label="Explain billable database operations"
                    >
                      <i className="fa-solid fa-circle-info text-xs" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px] text-left">
                    First {formatNumber(planDetails.includedOperations)} operations
                    are included in this plan. Remaining{" "}
                    {formatNumber(breakdown.billableOperations)} operations are
                    billed at{" "}
                    {formatCompactCurrency(
                      planDetails.operationPricePerThousand,
                      currency,
                    )}{" "}
                    per 1,000.
                  </TooltipContent>
                </Tooltip>
              </div>
              <span
                className={cn(
                  "text-right",
                  breakdown.operationsCost <= 0 &&
                    "text-foreground-neutral-weaker",
                )}
              >
                {formatLineItemCost(breakdown.operationsCost, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span>Billable storage</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-foreground-neutral-weaker transition-colors hover:text-foreground-neutral"
                      aria-label="Explain billable storage"
                    >
                      <i className="fa-solid fa-circle-info text-xs" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px] text-left">
                    First {formatNumber(planDetails.includedStorageGb)}GB of
                    storage are included. Remaining{" "}
                    {formatNumber(breakdown.billableStorageGb)}GB are billed at{" "}
                    {formatCompactCurrency(planDetails.storagePricePerGb, currency)}
                    /GB.
                  </TooltipContent>
                </Tooltip>
              </div>
              <span
                className={cn(
                  "text-right",
                  breakdown.storageCost <= 0 && "text-foreground-neutral-weaker",
                )}
              >
                {formatLineItemCost(breakdown.storageCost, currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PricingCalculator({ currency }: { currency: Symbol }) {
  const [lastAppliedPreset, setLastAppliedPreset] =
    React.useState<PresetKey>("scaleup");
  const [billingCycle, setBillingCycle] =
    React.useState<BillingCycle>("monthly");
  const [expandedPlan, setExpandedPlan] =
    React.useState<BillablePricingPlanKey | null>(null);
  const [databaseOperations, setDatabaseOperations] = React.useState(
    PRESETS.scaleup.databaseOperations,
  );
  const [storageGb, setStorageGb] = React.useState(PRESETS.scaleup.storageGb);

  const applyPreset = React.useCallback((nextPreset: PresetKey) => {
    const values = PRESETS[nextPreset];
    setLastAppliedPreset(nextPreset);
    setDatabaseOperations(values.databaseOperations);
    setStorageGb(values.storageGb);
  }, []);

  const reset = React.useCallback(() => {
    applyPreset(lastAppliedPreset);
  }, [applyPreset, lastAppliedPreset]);

  const estimatedSqlQueries = databaseOperations * SQL_QUERY_MULTIPLIER;
  const matchingPreset = React.useMemo(
    () => getMatchingPreset(databaseOperations, storageGb),
    [databaseOperations, storageGb],
  );
  const recommendedPlanForUsage = React.useMemo(
    () => getRecommendedPlan(databaseOperations, storageGb, billingCycle),
    [databaseOperations, storageGb, billingCycle],
  );
  const isEnterpriseRecommendation = recommendedPlanForUsage === "enterprise";

  return (
    <TooltipProvider>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4">
      <div className="rounded-[18px] border border-stroke-neutral bg-background-neutral-weak px-5 py-4 shadow-box-high sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="m-0 text-[28px] uppercase leading-none font-sans-display [font-variation-settings:'wght'_800] text-foreground-neutral sm:text-[42px]">
            Pricing Calculator
          </h2>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="text-base font-semibold text-foreground-neutral">
              Quick Start Presets 
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(PRESETS) as Array<[PresetKey, (typeof PRESETS)[PresetKey]]>).map(
                ([key, item]) => {
                  const active = key === matchingPreset;

                  return (
                    <Button
                      key={key}
                      type="button"
                      variant="default-weaker"
                      size="lg"
                      aria-pressed={active}
                      onClick={() => applyPreset(key)}
                      className={cn(
                        "inline-flex h-9 items-center gap-2 rounded-[12px] border px-4 text-sm font-medium transition-colors",
                        active
                          ? "border-stroke-ppg bg-background-ppg-reverse-strong text-foreground-ppg-reverse shadow-box-low"
                          : "border-stroke-neutral bg-transparent text-foreground-neutral hover:border-stroke-neutral-strong hover:bg-background-default-050",
                      )}
                    >
                      <i className={cn(item.icon, "text-xs")} />
                      <span>{item.label}</span>
                    </Button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[18px] border border-stroke-neutral bg-background-neutral-weak p-5 shadow-box-high sm:p-6">
          <div className="mb-6 flex items-center gap-3 border-b border-stroke-neutral pb-4">
            <i className="fa-solid fa-calculator text-base text-foreground-neutral-weak" />
            <h3 className="m-0 text-[20px] leading-7 font-sans-display [font-variation-settings:'wght'_700] text-foreground-neutral">
              Estimate your monthly usage
            </h3>
            <Button
              type="button"
              variant="default-weaker"
              size="lg"
              onClick={reset}
              className="ml-auto inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-foreground-neutral-weaker transition-colors hover:bg-background-default-050 hover:text-foreground-neutral"
            >
              <i className="fa-solid fa-rotate-right text-[10px]" />
              <span>Reset</span>
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground-neutral">
                <i className="fa-solid fa-bolt text-foreground-ppg" />
                <span>Database Operations</span>
                <i className="fa-solid fa-circle-info text-xs text-foreground-neutral-weaker" />
              </div>
              <InputShell>{formatNumber(databaseOperations)}</InputShell>
              <Slider
                value={[databaseOperations]}
                min={5_000_000}
                max={MAX_DATABASE_OPERATIONS}
                step={1_000_000}
                onValueChange={(value) => setDatabaseOperations(value[0] ?? databaseOperations)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground-neutral">
                <span>Estimated SQL Queries</span>
                <span className="text-xs font-bold text-foreground-neutral-weak">
                  {SQL_QUERY_MULTIPLIER}x
                </span>
                <i className="fa-solid fa-circle-info text-xs text-foreground-neutral-weaker" />
              </div>
              <InputShell>{formatNumber(estimatedSqlQueries)}</InputShell>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground-neutral">
                <i className="fa-solid fa-database text-foreground-ppg" />
                <span>Storage</span>
              </div>
              <InputShell className="justify-between">
                <span>{formatNumber(storageGb)}</span>
                <span className="border-l border-stroke-neutral pl-3 text-foreground-neutral-weak">
                  GB
                </span>
              </InputShell>
              <Slider
                value={[storageGb]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setStorageGb(value[0] ?? storageGb)}
              />
            </div>

            <div className="">
              {/* <div className="space-y-2">
                <div className="text-sm text-foreground-neutral">Compute Size</div>
                <div className="rounded-[12px] border border-stroke-neutral bg-background-neutral px-3 py-3 text-sm text-foreground-neutral-weaker">
                  Included and auto-scaled by Prisma Postgres
                </div>
                <p className="m-0 text-[10px] leading-4 text-foreground-neutral-weaker">
                  vCPU, RAM, cores, micro, xl, C-3PO... etc.
                </p>
              </div> */}

              <div className="space-y-2">
                <div className="text-sm text-foreground-neutral">Data Transfer</div>
                <div className="rounded-[12px] border border-stroke-neutral bg-background-neutral px-3 py-3 text-sm text-foreground-neutral-weaker">
                  Unlimited included for free
                </div>
                <p className="m-0 text-[10px] leading-4 text-foreground-neutral-weaker">
                  Ingress, egress, sidewaysgress, it&apos;s all covered. Just Ship It.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-stroke-neutral bg-background-neutral-weak p-5 shadow-box-high sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-stroke-neutral pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-coins text-base text-foreground-neutral-weak" />
              <h3 className="m-0 text-[20px] leading-7 font-sans-display [font-variation-settings:'wght'_700] text-foreground-neutral">
                Estimated total cost
              </h3>
            </div>

            <div className="inline-flex rounded-square border-[3px] border-stroke-neutral bg-background-neutral p-1">
              {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => {
                const active = cycle === billingCycle;

                return (
                  <Button
                    key={cycle}
                    type="button"
                    variant="default-weaker"
                    onClick={() => setBillingCycle(cycle)}
                    className={cn(
                      "rounded-square px-3 py-1.5 text-xs font-sans-display [font-variation-settings:'wght'_700] transition-colors",
                      active
                        ? "bg-background-ppg-reverse-strong text-foreground-ppg-reverse hover:bg-background-ppg-reverse-strong hover:text-foreground-ppg-reverse"
                        : "text-foreground-neutral-weaker",
                    )}
                  >
                    {cycle === "monthly" ? "Monthly" : "Yearly (save 25%)"}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {isEnterpriseRecommendation && (
              <Alert variant="ppg">
                <p className="m-0">
                  Usage at this scale is best served on an enterprise plan. Reach
                  out to{" "}
                  <a href="mailto:support@prisma.io" className="underline">
                    support@prisma.io
                  </a>{" "}
                  for pricing.
                </p>
              </Alert>
            )}
            {CALCULATOR_PLAN_ORDER.map((plan) => (
              <SummaryCard
                key={plan}
                title={`${plans[plan].title} plan`}
                description={getPlanDescription(plan, currency)}
                currency={currency}
                breakdown={calculatePlanBreakdown(
                  plan,
                  databaseOperations,
                  storageGb,
                  billingCycle,
                )}
                plan={plan}
                highlighted={
                  !isEnterpriseRecommendation && plan === recommendedPlanForUsage
                }
                expanded={expandedPlan === plan}
                onToggle={() =>
                  setExpandedPlan((current) => (current === plan ? null : plan))
                }
                yearly={billingCycle === "yearly"}
                price={calculateDisplayedPlanCost(
                  plan,
                  databaseOperations,
                  storageGb,
                  billingCycle,
                )}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
}
