"use client";
import * as React from "react";
import { Slider } from "@prisma/eclipse";
import { type Symbol, symbols } from "./pricing-data";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PresetKey = "hobby" | "startup" | "scaleup";
type BillingCycle = "monthly" | "yearly";
type PlanKey = "starter" | "pro" | "business";

const SQL_QUERY_MULTIPLIER = 5;

const PRESETS: Record<
  PresetKey,
  {
    label: string;
    icon: string;
    databaseOperations: number;
    storageGb: number;
    prices: Record<PlanKey, number>;
  }
> = {
  hobby: {
    label: "Hobby",
    icon: "fa-regular fa-rocket-launch",
    databaseOperations: 12_000_000,
    storageGb: 8,
    prices: {
      starter: 248.4,
      pro: 121.6,
      business: 94.8,
    },
  },
  startup: {
    label: "Startup",
    icon: "fa-solid fa-bolt",
    databaseOperations: 36_000_000,
    storageGb: 18,
    prices: {
      starter: 694.1,
      pro: 335.3,
      business: 282.8,
    },
  },
  scaleup: {
    label: "Scaleup",
    icon: "fa-solid fa-buildings",
    databaseOperations: 84_000_000,
    storageGb: 40,
    prices: {
      starter: 1588.2,
      pro: 772.7,
      business: 662.4,
    },
  },
};

const PLAN_COPY: Record<
  PlanKey,
  {
    title: string;
    operationsPrice: number;
    operationsSuffix?: string;
    storageIncludedGb: number;
    storagePrice: number;
    recommended?: boolean;
  }
> = {
  starter: {
    title: "Starter plan",
    operationsPrice: 18,
    operationsSuffix: "/M ops",
    storageIncludedGb: 1,
    storagePrice: 2,
  },
  pro: {
    title: "Pro plan",
    operationsPrice: 8,
    operationsSuffix: "/M ops (tiered on annual)",
    storageIncludedGb: 5,
    storagePrice: 1.5,
  },
  business: {
    title: "Business plan",
    operationsPrice: 6,
    operationsSuffix: "/M ops (tiered on annual)",
    storageIncludedGb: 10,
    storagePrice: 1,
    recommended: true,
  },
};

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

function getPlanDescription(plan: PlanKey, currency: Symbol) {
  const details = PLAN_COPY[plan];

  return `100K ops free, then ${formatCompactCurrency(details.operationsPrice, currency)}${details.operationsSuffix ?? ""} • ${details.storageIncludedGb}GB free, then ${formatCompactCurrency(details.storagePrice, currency)}/GB`;
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
  highlighted = false,
  yearly = false,
}: {
  title: string;
  description: string;
  price: number;
  currency: Symbol;
  highlighted?: boolean;
  yearly?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_234px] sm:items-start">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="m-0 text-[18px] leading-7 font-sans-display [font-variation-settings:'wght'_700] text-foreground-neutral">
            {title}
          </h4>
          {highlighted && (
            <span className="inline-flex items-center rounded-full border border-stroke-ppg bg-background-ppg px-2.5 py-0.5 text-[11px] font-medium text-foreground-ppg-strong">
              Recommended
            </span>
          )}
        </div>
        <p className="m-0 max-w-[277px] text-xs leading-4 text-foreground-neutral-weaker">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "relative flex min-h-[70px] flex-col items-center justify-center rounded-[16px] border px-4 py-3 text-center shadow-box-low",
          highlighted
            ? "border-stroke-ppg bg-background-ppg"
            : "border-stroke-neutral bg-background-neutral-weak",
        )}
      >
        <div className="text-3xl leading-8 font-bold text-foreground-neutral">
          {formatCurrency(price, currency)}
        </div>
        <div className="mt-1 text-sm text-foreground-neutral-weak">
          {yearly ? "per month billed yearly" : "per month"}
        </div>
        <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-xs text-foreground-neutral-weak" />
      </div>
    </div>
  );
}

export function PricingCalculator({ currency }: { currency: Symbol }) {
  const [preset, setPreset] = React.useState<PresetKey>("scaleup");
  const [billingCycle, setBillingCycle] =
    React.useState<BillingCycle>("monthly");
  const [databaseOperations, setDatabaseOperations] = React.useState(
    PRESETS.scaleup.databaseOperations,
  );
  const [storageGb, setStorageGb] = React.useState(PRESETS.scaleup.storageGb);

  const activePreset = PRESETS[preset];

  const applyPreset = React.useCallback((nextPreset: PresetKey) => {
    const values = PRESETS[nextPreset];
    setPreset(nextPreset);
    setDatabaseOperations(values.databaseOperations);
    setStorageGb(values.storageGb);
  }, []);

  const reset = React.useCallback(() => {
    applyPreset(preset);
  }, [applyPreset, preset]);

  const estimatedSqlQueries = databaseOperations * SQL_QUERY_MULTIPLIER;
  const usageFactor = Math.max(
    0.25,
    databaseOperations / activePreset.databaseOperations * 0.85 +
      storageGb / activePreset.storageGb * 0.15,
  );
  const billingMultiplier = billingCycle === "monthly" ? 1 : 0.75;

  return (
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
                  const active = key === preset;

                  return (
                    <button
                      key={key}
                      type="button"
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
                    </button>
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
            <button
              type="button"
              onClick={reset}
              className="ml-auto inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-foreground-neutral-weaker transition-colors hover:bg-background-default-050 hover:text-foreground-neutral"
            >
              <i className="fa-solid fa-rotate-right text-[10px]" />
              <span>Reset</span>
            </button>
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
                max={100_000_000}
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm text-foreground-neutral">Compute Size</div>
                <div className="rounded-[12px] border border-stroke-neutral bg-background-neutral px-3 py-3 text-sm text-foreground-neutral-weaker">
                  Included and auto-scaled by Prisma Postgres
                </div>
                <p className="m-0 text-[10px] leading-4 text-foreground-neutral-weaker">
                  vCPU, RAM, cores, micro, xl, C-3PO... etc.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-foreground-neutral">Data Transfer</div>
                <div className="rounded-[12px] border border-stroke-neutral bg-background-neutral px-3 py-3 text-sm text-foreground-neutral-weaker">
                  Unlimited included for free
                </div>
                <p className="m-0 text-[10px] leading-4 text-foreground-neutral-weaker">
                  Ingress, egress, sidewaysgress, it&apos;s all covered.
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

            <div className="inline-flex rounded-full border-[3px] border-stroke-neutral bg-background-neutral p-1">
              {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => {
                const active = cycle === billingCycle;

                return (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-sans-display [font-variation-settings:'wght'_700] transition-colors",
                      active
                        ? "bg-background-ppg-reverse-strong text-foreground-ppg-reverse"
                        : "text-foreground-neutral-weaker",
                    )}
                  >
                    {cycle === "monthly" ? "Monthly" : "Yearly (25% off)"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {(["starter", "pro", "business"] as PlanKey[]).map((plan) => (
              <SummaryCard
                key={plan}
                title={PLAN_COPY[plan].title}
                description={getPlanDescription(plan, currency)}
                currency={currency}
                highlighted={PLAN_COPY[plan].recommended}
                yearly={billingCycle === "yearly"}
                price={activePreset.prices[plan] * usageFactor * billingMultiplier}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
