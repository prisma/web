"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type AppProfile,
  type Bill,
  type BillLine,
  type Estimate,
  fmtCost,
  fmtGB,
  fmtOps,
  fmtUSD,
  type PlanId,
} from "./calculator-options/calc";

// The calculator's answer — the one card in the calculator. Three layers:
//   1. The total, set large — the answer at a glance.
//   2. A three-line receipt: plan, Compute, Postgres. Each line says what it
//      covers and what it costs, so the total explains itself.
//   3. Each usage line opens inline (native <details>) to its meters: usage
//      against the plan's allowance, or quantity × rate = charge, plus the
//      Compute assumption and a link to the docs.
//
// The card keeps one height while you change inputs (client review,
// 2026-11-21: it kept growing and shrinking). Only opening a line — something
// the visitor chooses — changes it. Everything else holds its slot:
//   - every receipt row is two short lines (label, then description), so
//     descriptions never wrap into a third;
//   - the total sits on a fixed-height line and steps down a size for long
//     amounts instead of wrapping "/month";
//   - "Database only" keeps the Compute row, marked "Not used";
//   - an unavailable plan keeps the CTA slot, offering the recommended plan;
//   - the plan tabs always show all four plans in plan order.
// "Need more than Business covers?" lives under the card (pricing-calculator).
//
// No SpectrumRing: its always-on motion beside the numbers was tiring (client
// review, 2026-11-21). A still hairline and soft shadow; the recommended
// plan has a cyan dot on its tab, explained by the note under the heading.
//
// Rejected passes (2026-11-21): four plan cards each with two terms lines;
// every meter itemized up front; details in popovers; compare prices as boxed
// tiles.

const SIGN_UP = "https://console.prisma.io/sign-up";

export function PricingBill({
  estimates,
  shownId,
  recommendedId,
  onPick,
  bill,
  profile,
  ops,
  gb,
  requests,
}: {
  /** Every plan, in plan order. */
  estimates: Estimate[];
  shownId: PlanId;
  recommendedId: PlanId | undefined;
  onPick: (id: PlanId) => void;
  bill: Bill;
  profile: AppProfile;
  ops: number;
  gb: number;
  requests: number;
}) {
  const shown = estimates.find((e) => e.plan.id === shownId) ?? estimates[0];
  const recommended = estimates.find((e) => e.plan.id === recommendedId);
  const hasApp = profile.id !== "none";
  const free = !shown.plan.computeBilled;
  const postgresUsage = shown.opsOverage + shown.storageOverage;
  // Always to the cent, like every line below it: cents that came and went
  // with the amount read as inconsistent (client, 2026-11-22).
  const total = fmtUSD(shown.total);

  // Screen readers hear the result once you pause, not on every slider step:
  // a polite live region updated 700ms after the last change. It starts with
  // the current summary, so nothing is announced on page load.
  const summary = shown.eligible
    ? `${shown.plan.name} plan${shown.plan.id === recommendedId ? ", recommended" : ""}: ${total} a month`
    : `${shown.plan.name} plan is over its limits for this usage`;
  const [announced, setAnnounced] = useState(summary);
  useEffect(() => {
    const id = setTimeout(() => setAnnounced(summary), 700);
    return () => clearTimeout(id);
  }, [summary]);

  // "Show Business instead" swaps itself for the sign-up link, so the focused
  // element disappears. Put focus on the replacement instead of losing it to
  // the page (audit, 2026-11-21).
  const ctaRef = useRef<HTMLDivElement>(null);
  const refocusCta = useRef(false);
  useEffect(() => {
    if (!refocusCta.current) return;
    refocusCta.current = false;
    ctaRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [shown.plan.id]);

  return (
    <div className="relative flex flex-col rounded-2xl border border-black/[0.08] bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-24px_rgba(21,21,21,0.18)] sm:p-8">
      {/* The plans as plain-text tabs: the top of the bill and its title in
          one. The plan on show is ink with an underline; the rest are grey.
          Switching moves the underline where the eye already is. No boxes —
          a segmented control here read as cards inside cards (client review,
          2026-11-21), and it replaced an "Other plans" row that reshuffled on
          every switch. Fixed columns in plan order, so nothing moves.
          The recommended plan (the cheapest one that covers the usage, see
          priceAllPlans) has a cyan dot after its name, which moves with the
          recommendation. The note under the step-4 heading is its legend
          ("● Recommended: the cheapest plan…" — pricing-calculator.tsx).
          A plan the usage is over shows "Over limits" in place of a price.
          Clicking that tab is the way back to it. */}
      <div
        role="group"
        aria-label="Plan"
        className="-mx-1 grid grid-cols-4 border-b border-black/[0.08]"
      >
        {estimates.map((e) => {
          const on = e.plan.id === shown.plan.id;
          return (
            <button
              key={e.plan.id}
              type="button"
              onClick={() => onPick(e.plan.id)}
              aria-pressed={on}
              aria-label={`${e.plan.name} plan, ${
                e.eligible ? `${fmtUSD(e.total)} a month` : "over its limits"
              }${e.plan.id === recommendedId ? ", recommended" : ""}`}
              className="group/tab relative min-w-0 rounded-t-md px-1 pb-4 text-left tabular-nums outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 max-md:min-h-11"
            >
              <span
                className={cn(
                  "flex items-center gap-1 text-[13px] font-medium transition-colors sm:text-sm",
                  on ? "text-foreground" : "text-muted-foreground group-hover/tab:text-foreground",
                )}
              >
                <span className="truncate">{e.plan.name}</span>
                {e.plan.id === recommendedId && (
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-prism-cyan-400" />
                )}
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {/* Whole dollars, always: the tabs compare plans at a glance; the
                    total below gives the cents. */}
                {e.eligible ? fmtUSD(Math.round(e.total), false) : "Over limits"}
              </span>
              {on && (
                <span
                  aria-hidden
                  className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-foreground"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Fixed-height line at one size per screen width: the total never
          changes size with its own length (it used to step down past 8
          characters, which read as the text shrinking), and it no longer
          fades in when the plan changes (client, 2026-11-22: "the flicker
          ... remove it"). */}
      <div className="mt-7 flex h-12 items-baseline gap-2 whitespace-nowrap">
        {shown.eligible ? (
          <>
            <p className="font-heading text-4xl font-medium leading-none tracking-tight tabular-nums text-foreground sm:text-5xl">
              {total}
            </p>
            <span className="text-base text-muted-foreground">/month</span>
          </>
        ) : (
          <p className="font-heading text-4xl font-medium leading-none tracking-tight text-muted-foreground">
            Not available
          </p>
        )}
      </div>

      <div className="mt-7 border-t border-black/[0.06]">
        <SummaryRow
          label="Plan"
          hint={free ? "Free forever" : "Monthly fee"}
          amount={fmtUSD(shown.plan.base)}
        />

        {hasApp ? (
          <DetailRow
            label="Compute"
            hint={`${fmtOps(requests)} requests`}
            amount={groupAmount(bill.compute, shown.compute.total, free)}
            warn={hasOver(bill.compute)}
          >
            {bill.compute.map((l) => (
              <MeterRow key={l.label} line={l} free={free} />
            ))}
            <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
              Assumes each request {profile.perRequest}, from the {profile.source} example in the{" "}
              <Link
                href="/docs/compute/pricing"
                className="rounded-sm underline decoration-black/20 underline-offset-2 outline-none hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Compute pricing docs
              </Link>
              .
            </p>
          </DetailRow>
        ) : (
          <SummaryRow label="Compute" hint="Not used" amount="—" muted />
        )}

        <DetailRow
          label="Postgres"
          hint={`${fmtOps(ops)} operations · ${fmtGB(gb)}`}
          amount={groupAmount(bill.postgres, postgresUsage, free)}
          warn={hasOver(bill.postgres)}
        >
          {bill.postgres.map((l) => (
            <MeterRow key={l.label} line={l} free={free} />
          ))}
          <MeterRow
            line={{ label: "Data transfer", detail: "Unlimited", amount: 0, status: "included" }}
            free={false}
          />
        </DetailRow>
      </div>

      {/* Same slot either way, so the card doesn't jump when a plan is out of
          reach: the CTA, or a way back to the plan that fits. */}
      <div ref={ctaRef} className="mt-8">
        {shown.eligible ? (
          <PrismButton href={SIGN_UP} fullWidth ctaLocation="pricing_calculator">
            {free ? "Start for free" : `Start on ${shown.plan.name}`}
          </PrismButton>
        ) : (
          <PrismButtonOutline
            onClick={() => {
              if (!recommended) return;
              refocusCta.current = true;
              onPick(recommended.plan.id);
            }}
            className="w-full"
          >
            {recommended ? `Show ${recommended.plan.name} instead` : "Show the plans that fit"}
          </PrismButtonOutline>
        )}
      </div>
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announced}
      </p>
    </div>
  );
}

function hasOver(lines: BillLine[]) {
  return lines.some((l) => l.status === "over-limit");
}

function groupAmount(lines: BillLine[], total: number, free: boolean) {
  if (hasOver(lines)) return "Over limit";
  if (free) return "Within limits";
  return total === 0 ? "Included" : fmtCost(total);
}

// Chevron slot, label over description, amount. Always two lines, so the row
// height never depends on how long the description is. The chevron leads the
// row, where reading starts, and is drawn to be seen: Lucide's single-stroke
// ChevronRight at 16px, stroke 2.25, in full ink. (Client review, 2026-11-21:
// Forma's outlined double-stroke chevron read as heavy; a small grey one at
// the row's end was too easy to miss.)
const ROW = "grid grid-cols-[1rem_minmax(0,1fr)_auto] items-start gap-x-2.5 py-3.5 text-sm";

function RowText({ label, hint }: { label: string; hint: string }) {
  return (
    <span className="min-w-0">
      <span className="block text-foreground">{label}</span>
      <span className="block truncate text-xs tabular-nums text-muted-foreground">{hint}</span>
    </span>
  );
}

function SummaryRow({
  label,
  hint,
  amount,
  muted,
}: {
  label: string;
  hint: string;
  amount: string;
  muted?: boolean;
}) {
  return (
    <div className={cn(ROW, "border-b border-black/[0.06]")}>
      <span aria-hidden />
      <RowText label={label} hint={hint} />
      <span
        className={cn("pl-2 tabular-nums", muted ? "text-muted-foreground" : "text-foreground")}
      >
        {amount}
      </span>
    </div>
  );
}

function DetailRow({
  label,
  hint,
  amount,
  warn,
  children,
}: {
  label: string;
  hint: string;
  amount: string;
  warn?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-black/[0.06]">
      <summary
        className={cn(
          ROW,
          "cursor-pointer list-none rounded-md outline-none transition-colors hover:bg-black/[0.015] focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden",
        )}
      >
        <ChevronRight
          strokeWidth={2.25}
          className="mt-0.5 size-4 text-foreground transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
          aria-hidden
        />
        <RowText label={label} hint={hint} />
        <span
          className={cn(
            "pl-2 tabular-nums",
            warn ? "font-medium text-prism-red-600" : amountTone(amount),
          )}
        >
          {amount}
        </span>
      </summary>
      <div className="space-y-2.5 pb-5 pl-[26px]">{children}</div>
    </details>
  );
}

function amountTone(amount: string) {
  return amount.startsWith("$") ? "text-foreground" : "text-muted-foreground";
}

function MeterRow({ line, free }: { line: BillLine; free: boolean }) {
  const amount =
    line.status === "over-limit"
      ? "Over limit"
      : line.status === "included"
        ? free
          ? "Within limit"
          : "Included"
        : fmtCost(line.amount);
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_auto] items-baseline gap-x-2 text-xs">
      <span className="text-foreground/75">{line.label}</span>
      <span className="tabular-nums text-muted-foreground">{line.detail}</span>
      <span
        className={cn(
          "pl-2 tabular-nums",
          line.status === "over-limit"
            ? "font-medium text-prism-red-600"
            : line.status === "charged"
              ? "text-foreground"
              : "text-muted-foreground",
        )}
      >
        {amount}
      </span>
    </div>
  );
}
