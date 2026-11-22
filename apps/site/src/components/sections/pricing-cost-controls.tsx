import { Users } from "lucide-react";
import Link from "next/link";
import { GlassPrismSpin } from "@/components/brand/glass-prism-spin";
import { Texture } from "@/components/brand/texture";
import { GitBranch, Rocket, Swap } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { COST_CONTROLS, NEVER_BILLED, type NeverBilledItem } from "./pricing-ledger";

const FREE_ICONS: Record<NeverBilledItem["icon"], React.ComponentType<{ className?: string }>> = {
  deploys: Rocket,
  previews: GitBranch,
  seats: Users,
  transfer: Swap,
};

// "Keep your bill in check": three cost-control cards directly under the plan
// cards, where Vercel puts its "No idle, no waste" / "Control your spending"
// pair, so the answer to "what if my bill runs away?" sits next to the prices
// that raise it (client, 2026-11-22). Idle costs nothing, cap your spending,
// free on every plan: the third card replaced the "Free with every plan"
// section.
// Copy and sourcing live in pricing-ledger.ts.
//
// The illustrations are decorative (aria-hidden) and static: one quiet motif
// each, because the earlier timeline charts on this page read as tiring. The
// card text carries the whole message.
//
// Each card carries its own glass prism (client, 2026-11-22: "that background
// is too much. try applying the prism to each card"): a small prism turning in
// the bottom-right corner, cropped by the card edge, over a faint spectrum
// glow so the white glass has colour to refract, with the brand grain masked
// to that corner. The shared backdrop behind both cards was too loud.
// Triangle, hexagon and rectangle, one per card, none the comparison panel's
// pentagon further down.
//
// Hover (client, 2026-11-22: "a delicate highlight when you hover"; the
// animated spectrum ring was "too intense"): the border darkens a touch, a
// faint shadow, the corner glow warms slightly and the arrow nudges. The
// whole card is the docs link (stretched ::after on the link), so the
// highlight promises a click that works.

// Spectrum gradient matching the brand CTA glow (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

export function PricingCostControls() {
  const [idle, limit, never] = COST_CONTROLS;
  return (
    <section aria-labelledby="cost-controls" className="bg-white px-4 sm:px-8">
      <div className="mx-auto max-w-site pb-4 sm:pb-8">
        {/* Literal, not COST_CONTROLS_HEADING: the Markdown parity test reads
            headings from the JSX and checks them against the Markdown. */}
        <h2 id="cost-controls" className="sr-only">
          Keep your bill in check
        </h2>
        {/* Three across on desktop; on tablets the third spans the row under
            the first two; stacked on phones. */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          <Reveal className="h-full">
            <ControlCard
              {...idle}
              illustration={<IdleTimeline />}
              prism={{ shape: "triangle", initialAngle: 0.5 }}
            />
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <ControlCard
              {...limit}
              illustration={<LimitBars />}
              prism={{ shape: "hexagon", initialAngle: 1.4 }}
            />
          </Reveal>
          {/* id="free" keeps old links to /pricing#free landing here. */}
          <Reveal delay={0.16} className="h-full md:col-span-2 lg:col-span-1">
            <div id="free" className="h-full scroll-mt-24">
              <ControlCard
                {...never}
                illustration={<FreeTiles />}
                prism={{ shape: "rect", initialAngle: 2.2 }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ControlCard({
  title,
  body,
  link,
  illustration,
  prism,
}: (typeof COST_CONTROLS)[number] & {
  illustration: React.ReactNode;
  prism: { shape: "triangle" | "hexagon" | "rect"; initialAngle: number };
}) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-5 transition-[border-color,box-shadow] duration-150 ease-out hover:border-black/[0.2] hover:shadow-[0_12px_32px_-18px_rgba(21,21,21,0.2)] sm:p-6">
      {/* The corner prism: glow, glass, grain. Decorative. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -bottom-10 -right-10 h-36 w-56 rounded-full opacity-[0.28] blur-[40px] transition-opacity duration-200 ease-out group-hover:opacity-[0.44] motion-reduce:transition-none"
          style={{ backgroundImage: SPECTRUM }}
        />
        <GlassPrismSpin
          shape={prism.shape}
          period={30}
          initialAngle={prism.initialAngle}
          className="-bottom-8 -right-6 w-[8.5rem] max-sm:w-[6.5rem]"
        />
        <Texture
          opacity={0.08}
          className="[mask-image:radial-gradient(60%_70%_at_100%_100%,black_20%,transparent)]"
        />
      </div>
      <div aria-hidden className="mb-5 h-28 select-none">
        {illustration}
      </div>
      <h3 className="text-lg font-medium leading-snug text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-[44ch] text-pretty text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      <Link
        href={link.href}
        className="mt-auto self-start rounded-sm pt-4 text-sm font-medium text-foreground underline decoration-black/20 underline-offset-4 outline-none transition-colors after:absolute after:inset-0 after:content-[''] group-hover:decoration-black/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {link.label}{" "}
        <span
          aria-hidden
          className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </Link>
    </article>
  );
}

const mono = "font-mono text-[11px] leading-none tracking-tight";

/** A request timeline: short bursts of work, with the gaps between them at $0. */
function IdleTimeline() {
  const segments: Array<{ busy: boolean; label: string; grow: number }> = [
    { busy: true, label: "0.3 s", grow: 2 },
    { busy: false, label: "idle · $0", grow: 4 },
    { busy: true, label: "1.2 s", grow: 3 },
    { busy: false, label: "idle · $0", grow: 5 },
    { busy: true, label: "0.6 s", grow: 2 },
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex items-center gap-1.5">
        {segments.map((s, i) => (
          <div
            key={i}
            style={{ flexGrow: s.grow, flexBasis: 0 }}
            className={cn(
              "flex h-8 min-w-0 items-center justify-center",
              s.busy
                ? "rounded-md border border-black/[0.1] bg-paper text-foreground/70"
                : "relative text-muted-foreground/80",
              i > 2 && "max-lg:hidden",
            )}
          >
            {!s.busy && (
              <span className="absolute inset-x-1 top-1/2 border-t border-dashed border-black/15" />
            )}
            <span className={cn(mono, "relative truncate px-1.5", !s.busy && "bg-white")}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className={cn(mono, "mt-3 flex justify-between text-muted-foreground/70")}>
        <span>Requests</span>
        <span>Scaled to zero</span>
      </div>
    </div>
  );
}

/** Usage climbing month to date, an email at 75% and a hard stop at the limit. */
function LimitBars() {
  // Heights as a share of the limit; the last bar reaches it and stops.
  const bars = [0.18, 0.3, 0.44, 0.58, 0.72, 0.86, 1];
  const LIMIT_AT = 88; // % of the box height the limit line sits at
  return (
    <div className="relative h-full">
      {/* The limit */}
      <div
        className="absolute inset-x-0 border-t border-foreground/60"
        style={{ bottom: `${LIMIT_AT}%` }}
      >
        <span
          className={cn(
            mono,
            "absolute -top-2.5 left-0 rounded border border-foreground/50 bg-white px-1.5 py-1 uppercase text-foreground/80",
          )}
        >
          Limit
        </span>
      </div>
      {/* 75%: everyone in the workspace is emailed */}
      <div
        className="absolute inset-x-0 border-t border-dashed border-black/20"
        style={{ bottom: `${LIMIT_AT * 0.75}%` }}
      >
        <span className={cn(mono, "absolute left-0 top-1.5 text-muted-foreground/80")}>
          75% · email
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 flex w-3/5 items-end gap-1.5 sm:gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            style={{ height: `${h * LIMIT_AT}%` }}
            className={cn(
              "flex-1 rounded-t-md border border-b-0",
              h >= 1 ? "border-foreground/25 bg-foreground/[0.08]" : "border-black/[0.08] bg-paper",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** The four things every plan includes at no cost, each marked Free, so the
 *  card reads at a glance before its text does. A plain ruled list, not
 *  tiles: boxes inside the card read as a card on a card (client,
 *  2026-11-22). */
function FreeTiles() {
  return (
    <ul className="grid h-full grid-rows-4 divide-y divide-black/[0.07] border-y border-black/[0.07]">
      {NEVER_BILLED.map((item) => {
        const Icon = FREE_ICONS[item.icon];
        return (
          <li key={item.short} className="flex min-w-0 items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2 text-sm text-foreground/80">
              <Icon aria-hidden className="size-4 shrink-0 text-foreground/45" />
              <span className="truncate">{item.short}</span>
            </span>
            <span className="shrink-0 text-sm font-medium text-prism-cyan-700">Free</span>
          </li>
        );
      })}
    </ul>
  );
}
