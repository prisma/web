"use client";

import Link from "next/link";
import { Check, ChevronDown, Link2 } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import {
  APP_PROFILES,
  type AppProfileId,
  computeUsage,
  estimate,
  fmtGB,
  fmtOps,
  fmtUSD,
  gbToT,
  itemize,
  opsToT,
  type PlanId,
  PLANS,
  PRESETS,
  priceAllPlans,
  requestsToT,
  tToGB,
  tToOps,
  tToRequests,
} from "./calculator-options/calc";
import { RangeInput } from "./calculator-options/controls";
import { PricingBill } from "./pricing-bill";

// The calculator reads as a short sequence, hinted rather than enforced
// (client direction, 2026-11-21): 1 what are you building, 2 how big is it,
// 3 adjust the usage, 4 see the bill. Each step is a question heading with a
// quiet step number — no wizard chrome, no progress bar, and every step stays
// editable at once. On lg the bill (step 4) is sticky on the right so every
// choice on the left updates an answer you can see; below lg the steps stack,
// the bill comes last, and a compact total follows you while you're in the
// inputs (see StickyTotal).
//
// One card only — the bill. Inputs sit on the page, and the choices in steps 1
// and 2 are single segmented controls, not rows of boxes ("too many cards").
//
// Corrections from Shane (2026-07-29), all of which the live prisma.io
// calculator still gets wrong: there is no annual billing, the "5x SQL
// queries per operation" readout is a stale technical detail that is no
// longer true, and Free is included because it is the natural starting
// point (it goes ineligible above its caps rather than being hidden).
//
// Prisma Compute (2026-11-21, pricing-page audit P0): the calculator priced
// Postgres only, so every total understated the bill for anyone running an
// app. Visitors rarely know their GB-hours or vCPU-hours, so Compute is asked
// as an app type plus requests per month; each type carries per-request
// figures taken from the worked examples in the Compute pricing docs (see
// APP_PROFILES in calc.ts). "Database only" restores the Postgres-only
// estimate. The defaults (API app, Side project) stay inside Free's limits,
// so the calculator opens on Free.
//
// Audit fixes (2026-11-21): sliders speak their values, the bill announces
// changes, steps 1 and 2 are radio groups, a sticky total below lg, and the
// estimate lives in the URL so it can be shared.

const DEFAULT_APP: AppProfileId = "api";
const clampT = (t: number) => Math.min(1, Math.max(0, t));

// URL keys for a shared estimate: ?app=agent&requests=2000000&ops=5000000&storage=8&plan=pro
// Values are snapped to what the sliders can show, so a hand-edited link
// still lands on a reachable state.
const Q = { app: "app", requests: "requests", ops: "ops", gb: "storage", plan: "plan" } as const;

// The calculator is its own page, /pricing/calculator (client, 2026-11-24:
// "an entirely new page for the calculator"). Its heading is the page's h1,
// under a "Pricing" link back, with room for the fixed header. /pricing keeps
// a short "Estimate your bill" section that links here
// (pricing-calculator-link.tsx).
export function PricingCalculator() {
  const [profileId, setProfileId] = useState<AppProfileId>(DEFAULT_APP);
  const [requests, setRequests] = useState<number>(PRESETS[0].requests);
  const [ops, setOps] = useState<number>(PRESETS[0].ops);
  const [gb, setGb] = useState<number>(PRESETS[0].gb);
  // null follows the recommendation; a click on a plan pins that plan.
  const [pickedId, setPickedId] = useState<PlanId | null>(null);

  const profile = APP_PROFILES.find((p) => p.id === profileId) ?? APP_PROFILES[0];
  const hasApp = profile.id !== "none";
  const usage = computeUsage({ requests, profile });
  const recommendedId = priceAllPlans(ops, gb, usage).find((e) => e.eligible)?.plan.id;
  const estimates = PLANS.map((plan) => estimate(plan, ops, gb, usage));
  const shownId = pickedId ?? recommendedId ?? "business";
  const shownPlan = PLANS.find((p) => p.id === shownId) ?? PLANS[0];
  const shown = estimates.find((e) => e.plan.id === shownId) ?? estimates[0];
  // Where the recommended plan changes along each slider, holding the other
  // inputs where they are — drawn as ticks so you can see the next plan
  // coming before you drag into it (client request, 2026-11-21). Recomputed
  // when any input changes, because each slider's breakpoints depend on the
  // other two. 240 samples per slider is ~3,000 cheap estimates (~0.3 ms).
  const marks = useMemo(() => {
    const recAt = (o: number, g: number, r: number) =>
      priceAllPlans(o, g, computeUsage({ requests: r, profile })).find((e) => e.eligible)?.plan.id;
    const scan = (at: (t: number) => PlanId | undefined) => {
      const out: SliderMark[] = [];
      const N = 240;
      let prev = at(0);
      for (let i = 1; i <= N; i++) {
        const cur = at(i / N);
        if (cur && cur !== prev) out.push({ t: (i - 0.5) / N, plan: cur });
        prev = cur;
      }
      return out;
    };
    return {
      requests: hasApp ? scan((t) => recAt(ops, gb, tToRequests(t))) : [],
      ops: scan((t) => recAt(tToOps(t), gb, requests)),
      gb: scan((t) => recAt(ops, tToGB(t), requests)),
    };
  }, [ops, gb, requests, profile, hasApp]);

  const activePreset = PRESETS.find(
    (p) => p.ops === ops && p.gb === gb && (!hasApp || p.requests === requests),
  )?.id;
  // With custom numbers, the preset they're closest to (on a log scale, the
  // sliders' own), outlined so step 2 never looks unanswered.
  const nearestPreset = useMemo(() => {
    if (activePreset) return undefined;
    const d = (a: number, b: number) => Math.abs(Math.log10(a + 1) - Math.log10(b + 1));
    return PRESETS.reduce((best, p) => {
      const score = (q: (typeof PRESETS)[number]) =>
        d(q.ops, ops) + d(q.gb, gb) + (hasApp ? d(q.requests, requests) : 0);
      return score(p) < score(best) ? p : best;
    });
  }, [activePreset, ops, gb, requests, hasApp]);

  // ---- Shareable estimate: state <-> URL -----------------------------------
  // Writes are defined before the read so that, on mount, the write effect
  // runs first (and skips), then the read applies the URL; the next render
  // writes back the snapped values. replaceState: no history entry per drag.
  const urlReady = useRef(false);
  useEffect(() => {
    if (!urlReady.current) return;
    const url = new URL(window.location.href);
    const set = (k: string, v: string | null) =>
      v === null ? url.searchParams.delete(k) : url.searchParams.set(k, v);
    const isDefault =
      profileId === DEFAULT_APP && activePreset === PRESETS[0].id && pickedId === null;
    set(Q.app, isDefault ? null : profileId);
    set(Q.requests, isDefault || !hasApp ? null : String(requests));
    set(Q.ops, isDefault ? null : String(ops));
    set(Q.gb, isDefault ? null : String(gb));
    set(Q.plan, pickedId);
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [profileId, requests, ops, gb, pickedId, hasApp, activePreset]);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const num = (k: string) => {
      const v = Number(q.get(k));
      return q.has(k) && Number.isFinite(v) && v > 0 ? v : undefined;
    };
    const app = q.get(Q.app);
    if (APP_PROFILES.some((p) => p.id === app)) setProfileId(app as AppProfileId);
    const r = num(Q.requests);
    if (r) setRequests(tToRequests(clampT(requestsToT(r))));
    const o = num(Q.ops);
    if (o) setOps(tToOps(clampT(opsToT(o))));
    const g = num(Q.gb);
    if (g) setGb(tToGB(clampT(gbToT(g))));
    const plan = q.get(Q.plan);
    if (PLANS.some((p) => p.id === plan)) setPickedId(plan as PlanId);
    urlReady.current = true;
  }, []);

  // ---- Sticky total below lg ----------------------------------------------
  // Shown while the inputs are on screen and the bill isn't, so on phones a
  // change is never made out of sight of its effect (audit, 2026-11-21).
  const inputsRef = useRef<HTMLDivElement>(null);
  const billRef = useRef<HTMLDivElement>(null);
  const [inputsInView, setInputsInView] = useState(false);
  const [billInView, setBillInView] = useState(false);
  useEffect(() => {
    const inputs = inputsRef.current;
    const bill = billRef.current;
    if (!inputs || !bill) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === inputs) setInputsInView(e.isIntersecting);
          // "In view" once the plan tabs and total are visible.
          if (e.target === bill) setBillInView(e.intersectionRatio >= 0.3);
        }
      },
      { threshold: [0, 0.3] },
    );
    io.observe(inputs);
    io.observe(bill);
    return () => io.disconnect();
  }, []);

  return (
    <section id="estimate" className="scroll-mt-24 bg-white px-4 sm:px-8">
      <div className="mx-auto max-w-site pb-16 pt-32 sm:pb-24 sm:pt-40">
        <Reveal>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span aria-hidden>←</span> Pricing
          </Link>
          <h1 className="mt-5 max-w-[24ch] text-balance text-[clamp(2.25rem,3.4vw,3.125rem)] leading-[1.06]">
            Estimate your bill
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          {/* Says how to use it, not the heading again (audit, 2026-11-21). */}
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            Tell us what you&apos;re building and roughly how big it is, then fine-tune the numbers.
            You&apos;ll see the monthly bill on the cheapest plan that covers it, and you can set a
            spend limit on any paid plan.
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          <div ref={inputsRef} className="flex flex-col gap-10 lg:col-span-3">
            <Reveal delay={0.15}>
              <Step n={1} title="What are you building?">
                {/* Four across only where each cell fits "Agent or long
                    tasks" on one line; 2 × 2 otherwise (phones, and the
                    narrower two-column desktop between lg and xl). */}
                <Segmented
                  label="What are you building?"
                  cols="grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
                >
                  {APP_PROFILES.map((p) => (
                    <SegmentButton
                      key={p.id}
                      active={profileId === p.id}
                      tabbable={profileId === p.id}
                      onClick={() => setProfileId(p.id)}
                    >
                      <span>{p.label}</span>
                      {/* What sets this app type's Compute cost apart, so
                          the choice isn't a guess. */}
                      <span className="mt-0.5 text-xs font-normal leading-normal text-muted-foreground tabular-nums">
                        {p.trait}
                      </span>
                    </SegmentButton>
                  ))}
                </Segmented>
              </Step>
            </Reveal>

            <Reveal delay={0.2}>
              {/* The hint always takes one line, and says "Custom" once the
                  sliders leave a preset, so step 2 never looks unanswered. */}
              <Step
                n={2}
                title="How big is it?"
                hint={
                  activePreset
                    ? "A starting point. Fine-tune it below."
                    : `Custom numbers, closest to ${nearestPreset?.label}.`
                }
              >
                <Segmented label="How big is it?" cols="grid-cols-1 sm:grid-cols-3">
                  {PRESETS.map((p, i) => (
                    <SegmentButton
                      key={p.id}
                      active={activePreset === p.id}
                      // With no preset selected (custom numbers), the first
                      // one takes the group's tab stop.
                      tabbable={activePreset ? activePreset === p.id : i === 0}
                      onClick={() => {
                        setRequests(p.requests);
                        setOps(p.ops);
                        setGb(p.gb);
                      }}
                      // Phones: one column, name left and figures right.
                      className="max-sm:flex-row max-sm:items-baseline max-sm:justify-between max-sm:gap-3"
                    >
                      <span className="whitespace-nowrap">{p.label}</span>
                      {/* Always two lines, Compute then Postgres, so a figure
                          never breaks mid-value ("500 / MB") and all three
                          presets are the same height at every width. */}
                      <span className="mt-0.5 text-xs font-normal leading-normal text-muted-foreground tabular-nums max-sm:text-right">
                        {/* Kept, faded, for "Database only" so the presets
                            don't change height and push the sliders. */}
                        <span
                          className={cn(
                            "block whitespace-nowrap transition-opacity",
                            !hasApp && "opacity-40",
                          )}
                        >
                          {fmtOps(p.requests)} requests
                        </span>
                        <span className="block whitespace-nowrap">
                          {fmtOps(p.ops)} operations · {fmtGB(p.gb)}
                        </span>
                      </span>
                    </SegmentButton>
                  ))}
                </Segmented>
              </Step>
            </Reveal>

            <Reveal delay={0.25}>
              <Step
                n={3}
                title="Adjust your usage"
                hint="Rough numbers are fine. Ticks mark where the recommended plan changes."
              >
                <div className="flex flex-col gap-6">
                  {/* Always rendered, faded and inert for "Database only",
                      so switching app type never adds or removes a slider and
                      the ones below it don't jump (client review 2026-11-21).
                      Values use the same short form as the presets and the
                      bill ("1.5M"); the full figure is what screen readers
                      hear. */}
                  <Slider
                    label="Requests per month"
                    value={fmtOps(requests)}
                    valueText={`${requests.toLocaleString("en-US")} requests a month`}
                    t={requestsToT(requests)}
                    onT={(t) => setRequests(tToRequests(t))}
                    fillClassName="bg-prism-red-400"
                    disabled={!hasApp}
                    marks={marks.requests}
                  />
                  <Slider
                    label="Database operations per month"
                    hint="1 query = 1 operation"
                    value={fmtOps(ops)}
                    valueText={`${ops.toLocaleString("en-US")} operations a month`}
                    t={opsToT(ops)}
                    onT={(t) => setOps(tToOps(t))}
                    fillClassName="bg-prism-cyan-400"
                    marks={marks.ops}
                  />
                  <Slider
                    label="Database storage"
                    value={fmtGB(gb)}
                    valueText={fmtGB(gb).replace("GB", "gigabytes").replace("MB", "megabytes")}
                    t={gbToT(gb)}
                    onT={(t) => setGb(tToGB(t))}
                    fillClassName="bg-prism-yellow-300"
                    marks={marks.gb}
                  />
                </div>
              </Step>
            </Reveal>

            <StickyTotal
              visible={inputsInView && !billInView}
              planName={shownPlan.name}
              recommended={shownId === recommendedId}
              total={shown.eligible ? fmtUSD(shown.total, shown.total % 1 !== 0) : "Not available"}
              onShow={() =>
                billRef.current?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                  block: "start",
                })
              }
            />
          </div>

          <Reveal delay={0.3} className="lg:sticky lg:top-24 lg:col-span-2">
            <div ref={billRef} className="scroll-mt-24">
              {/* The note is the legend for the cyan dot on the bill's tabs, and
                  says what "recommended" means: the cheapest plan that covers the
                  usage (priceAllPlans). Dot first, like a key. (Client review,
                  2026-11-21: "Starts on the recommended plan, marked ●" was
                  vague.) */}
              <StepHeading
                n={4}
                title="Your estimated bill"
                hint={
                  <>
                    {/* Inline, not flex: when the note wraps on phones the dot
                        stays on the first line instead of floating between. */}
                    <span
                      aria-hidden
                      className="mr-1.5 inline-block size-1.5 rounded-full bg-prism-cyan-400 align-middle"
                    />
                    Recommended: the cheapest plan that covers your usage
                  </>
                }
              />
              <div className="mt-4">
                <PricingBill
                  estimates={estimates}
                  shownId={shownId}
                  recommendedId={recommendedId}
                  onPick={(id) => setPickedId(id === recommendedId ? null : id)}
                  bill={itemize(shownPlan, ops, gb, usage)}
                  profile={profile}
                  ops={ops}
                  gb={gb}
                  requests={requests}
                />
              </div>
              <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                {/* A check, not a red ⊗: this line is reassurance, not a warning.
                    Wording follows the billing docs (console/more/billing.mdx): the
                    limit is optional, you set it, it caps usage charges only (not
                    the plan fee), and at 100% queries to the databases stop. */}
                <CheckCircle className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                <span>
                  Set a hard spend limit on any paid plan in the Console. It caps usage charges, not
                  the plan fee, and database queries stop when it&apos;s reached.
                </span>
              </p>
              {/* Always shown, under the card, so it never appears or disappears
                  inside it. Same wording as the FAQ and the "Need more?" strip. */}
              <p className="mt-2 pl-[26px] text-sm text-muted-foreground">
                Need more than Business covers?{" "}
                <Link
                  href="/contact"
                  className="whitespace-nowrap rounded-sm text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  Contact us
                </Link>
              </p>
              <CopyLink />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// The step hint: a quiet number before a question. Enough to suggest an order
// without turning the calculator into a wizard.
function StepHeading({ n, title, hint }: { n: number; title: string; hint?: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-baseline gap-3 text-base font-semibold text-foreground">
        <span aria-hidden className="w-3 font-mono text-xs font-normal text-muted-foreground">
          {n}
        </span>
        {title}
      </h3>
      {hint && <p className="mt-1 pl-6 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <StepHeading n={n} title={title} hint={hint} />
      <div className="mt-4 pl-6">{children}</div>
    </section>
  );
}

// A radio group: one tab stop, arrow keys move and select (WAI-ARIA radio
// pattern), so screen readers hear "1 of 4, selected" instead of a row of
// unrelated toggle buttons.
function Segmented({
  label,
  cols = "grid-cols-2 sm:grid-cols-4",
  children,
}: {
  label: string;
  cols?: string;
  children: React.ReactNode;
}) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    const radios = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
    const i = radios.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const next = radios[(i + step + radios.length) % radios.length];
    next.focus();
    next.click();
  };
  return (
    // LayoutGroup scopes the sliding underline's layoutId to this group, so
    // the two steps' underlines don't fly between each other.
    <LayoutGroup id={label}>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        // No track or card (client, 2026-11-22). No column gap either, so
        // each row's hairlines join into one continuous rule; the options
        // are spaced by their own right padding instead.
        className={cn("grid gap-y-3", cols)}
      >
        {children}
      </div>
    </LayoutGroup>
  );
}

// Tabs on one rule: unselected options are muted, the selected one is full
// strength with a 2px underline that slides to it on a firm spring (client,
// 2026-11-22, after a black pill ("too heavy"), a white pill, a radio list,
// and a first pass at these tabs ("too messy"), which had a broken hairline
// under each option and a second, faint underline for custom numbers; the
// step 2 hint now names the closest preset instead).
function SegmentButton({
  active,
  tabbable,
  onClick,
  className,
  children,
}: {
  active: boolean;
  /** The group's single tab stop. */
  tabbable: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      tabIndex={tabbable ? 0 : -1}
      onClick={onClick}
      className={cn(
        // flex-col + justify-start: a <button> centres its content
        // vertically, so a taller neighbour knocked the names out of line.
        // pr-5 spaces the options (the grid has no column gap, so the rules
        // join); the underline stops short of it, under the text.
        "relative flex flex-col justify-start border-b border-black/[0.08] pb-3 pr-5 text-left text-[15px] font-medium leading-snug outline-none transition-colors duration-150 ease-out active:opacity-70 active:duration-75 focus-visible:ring-[3px] focus-visible:ring-ring/50 max-md:min-h-11",
        // Same weight either way: bold is wider, and on phones it pushed
        // "Agent or long tasks" onto two lines and moved everything below.
        active ? "text-foreground" : "text-foreground/50 hover:text-foreground/80",
        className,
      )}
    >
      {active && (
        <motion.span
          aria-hidden
          layoutId="segment-underline"
          className="absolute -bottom-px left-0 right-5 h-0.5 rounded-full bg-foreground"
          transition={
            reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40, mass: 0.8 }
          }
        />
      )}
      {children}
    </button>
  );
}

// Below lg the bill is under the inputs, so this keeps the answer in sight
// while you change them: plan and total, pinned to the bottom of the screen,
// one tap from the full bill. Only while the inputs are on screen and the
// bill isn't. It's `invisible` when hidden, so it leaves the tab order and the
// accessibility tree too. Changes are announced by the bill's own live region,
// so this isn't one.
function StickyTotal({
  visible,
  planName,
  recommended,
  total,
  onShow,
}: {
  visible: boolean;
  planName: string;
  recommended: boolean;
  total: string;
  onShow: () => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none lg:hidden",
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={onShow}
        aria-label={`Estimated bill: ${planName} plan, ${total}${
          total.startsWith("$") ? " a month" : ""
        }. Go to the bill.`}
        className="pointer-events-auto flex min-h-12 w-full items-center gap-3 rounded-xl border border-black/[0.08] bg-card/95 px-4 py-2.5 text-left text-sm shadow-[0_1px_2px_rgba(21,21,21,0.04),0_12px_32px_-12px_rgba(21,21,21,0.25)] outline-none backdrop-blur focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
          <span className="truncate">{planName}</span>
          {recommended && (
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-prism-cyan-400" />
          )}
        </span>
        <span className="ml-auto whitespace-nowrap font-medium tabular-nums text-foreground">
          {total}
          {total.startsWith("$") && (
            <span className="font-normal text-muted-foreground"> /month</span>
          )}
        </span>
        <ChevronDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </button>
    </div>
  );
}

// The URL already holds the estimate (see the effects above); this copies it.
function CopyLink() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const id = setTimeout(() => setState("idle"), 2500);
    return () => clearTimeout(id);
  }, [state]);
  const copy = async () => {
    const href = window.location.href;
    try {
      await navigator.clipboard.writeText(href);
      setState("copied");
    } catch {
      // The async clipboard is blocked in some embedded browsers and older
      // Safari; fall back to the legacy copy command before giving up.
      const field = document.createElement("textarea");
      field.value = href;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      const ok = document.execCommand("copy");
      field.remove();
      setState(ok ? "copied" : "failed");
    }
  };
  return (
    <p className="mt-2 flex items-start gap-2.5 text-sm text-muted-foreground">
      {state === "copied" ? (
        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" />
      ) : (
        <Link2 aria-hidden className="mt-0.5 size-4 shrink-0" />
      )}
      <button
        type="button"
        onClick={copy}
        className="rounded-sm text-left text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        Copy a link to this estimate
      </button>
      <span role="status" className="text-muted-foreground">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy the address bar instead" : ""}
      </span>
    </p>
  );
}

type SliderMark = { t: number; plan: PlanId };

const PLAN_NAME = Object.fromEntries(PLANS.map((p) => [p.id, p.name])) as Record<PlanId, string>;

// Lighter than the first pass (client review, 2026-11-21): a 3px track and
// fill, a white puck with a soft shadow, and the value in the body face at
// body size. Plan-change ticks cross the track and their plan names sit in a
// reserved row under it, so the slider's height never changes as ticks come
// and go.
function Slider({
  label,
  hint,
  value,
  valueText,
  t,
  onT,
  fillClassName,
  disabled = false,
  marks = [],
}: {
  /** Visible label, and the slider's accessible name (WCAG 2.5.3). */
  label: string;
  hint?: string;
  value: string;
  /** What screen readers announce for the value. */
  valueText: string;
  t: number;
  onT: (t: number) => void;
  fillClassName: string;
  disabled?: boolean;
  marks?: SliderMark[];
}) {
  // Label a tick only when it isn't crowding the last labelled one.
  let lastLabelled = -1;
  const labelled = marks.filter((m) => {
    if (m.t - lastLabelled < 0.12) return false;
    lastLabelled = m.t;
    return true;
  });
  // The last tick the thumb has passed is the zone it's in: that tick and
  // its plan name go ink, so the row reads "you are on Pro's side of here"
  // and the highlight steps along as you drag across a boundary.
  const current = marks.findLast((m) => m.t <= t);
  return (
    <div>
      {/* Muted label, ink value: the number is what you read. Same size, so
          the row stays quiet. */}
      <div
        className={cn(
          "flex items-baseline justify-between gap-4 text-sm transition-opacity",
          disabled && "opacity-40",
        )}
      >
        <p className="text-muted-foreground">{label}</p>
        <p className="tabular-nums text-foreground">{value}</p>
      </div>
      <RangeInput
        t={t}
        onT={onT}
        label={label}
        valueText={current ? `${valueText}, ${PLAN_NAME[current.plan]} range` : valueText}
        className="mt-2"
        trackClassName="h-[3px] bg-black/[0.05]"
        fillClassName={cn("h-[3px]", fillClassName)}
        // A white puck on a hairline: a soft halo on hover, a slight lift
        // while dragging.
        thumbClassName={cn(
          "size-4 border-black/[0.06] bg-card shadow-[0_0_0_0.5px_rgba(21,21,21,0.06),0_1px_3px_rgba(21,21,21,0.14)] transition-[transform,box-shadow] duration-150 ease-out motion-reduce:transition-none",
          !disabled &&
            "group-hover:shadow-[0_0_0_6px_rgba(21,21,21,0.04),0_1px_3px_rgba(21,21,21,0.16)] group-active:scale-105 group-active:shadow-[0_0_0_8px_rgba(21,21,21,0.05),0_3px_8px_rgba(21,21,21,0.18)]",
        )}
        disabled={disabled}
        marks={marks.map((m) => (
          <span
            key={m.t}
            aria-hidden
            className={cn(
              "absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 transition-colors",
              m.t === current?.t ? "bg-foreground/60" : "bg-foreground/20",
            )}
            style={{ left: `${m.t * 100}%` }}
          />
        ))}
      />
      <div aria-hidden className="relative h-4 text-xs leading-4">
        {labelled.map((m) => (
          <span
            key={m.t}
            className={cn(
              "absolute top-0 whitespace-nowrap transition-colors",
              m.t === current?.t ? "text-foreground" : "text-muted-foreground",
              m.t < 0.06 ? "translate-x-0" : m.t > 0.94 ? "-translate-x-full" : "-translate-x-1/2",
            )}
            style={{ left: `${m.t * 100}%` }}
          >
            {PLAN_NAME[m.plan]}
          </span>
        ))}
      </div>
      {hint && <p className="mt-1 font-mono text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
