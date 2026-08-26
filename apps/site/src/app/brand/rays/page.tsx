import type { Metadata } from "next";
import { Check, Database, Rocket, Search, Server } from "@/components/icons/forma";
import { PrismRay, prismBands } from "@/components/brand/prism-ray";

export const metadata: Metadata = {
  title: "Ray Lab",
  robots: { index: false, follow: false },
};

// Spectrum gradient shared with the brand CTA (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

const PRISM_CONIC =
  "conic-gradient(var(--color-prism-cyan-400) 0 120deg, var(--color-prism-yellow-300) 120deg 240deg, var(--color-prism-red-500) 240deg 360deg)";

const FAKE_LOGOS = ["Acme", "Globex", "Initech", "Hooli", "Umbrella", "Stark"];

function Demo({
  n,
  title,
  blurb,
  children,
}: {
  n: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 first:mt-0">
      <div className="flex items-baseline gap-3">
        <span className="text-sm text-muted-foreground/60">{n}</span>
        <h2 className="text-2xl">{title}</h2>
      </div>
      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{blurb}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function GrayBar({ className }: { className?: string }) {
  return <span className={`h-1.5 rounded-full bg-foreground/10 ${className ?? ""}`} />;
}

export default function RayLabPage() {
  return (
    <div className="bg-white pb-32 pt-36">
      {/* lab-only animations */}
      <style>{`
        @keyframes ray-scan { from { translate: -70% 0; } to { translate: 170% 0; } }
        .ray-scan { animation: ray-scan 7s linear infinite; }
        @keyframes ray-countdown { from { width: 100%; } to { width: 0%; } }
        .ray-countdown { animation: ray-countdown 5s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ray-scan, .ray-countdown { animation: none; }
        }
      `}</style>

      <div className="container mx-auto max-w-5xl px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Internal — brand exploration
        </p>
        <h1 className="mt-2 text-4xl">Ray Lab</h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          Round three. The pattern in everything approved so far: the ray is a state, not a
          decoration — it scans, loads, activates, progresses. These options push further into that
          territory.
        </p>

        <h2 className="mt-14 border-b border-border/70 pb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Approved
        </h2>

        <Demo
          n="01"
          title="Logo cloud scan"
          blurb="The ray as a scanner — sweeping the customer logos, tinting each as it passes."
        >
          <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card px-8 py-10">
            <div className="ray-scan absolute inset-y-0 left-0 w-1/3">
              <PrismRay intensity="whisper" angle={-90} mask="none" className="inset-0" />
            </div>
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              {FAKE_LOGOS.map((name) => (
                <span key={name} className="font-heading text-xl text-muted-foreground/50">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Demo>

        <Demo
          n="02"
          title="Prismatic skeleton"
          blurb="The ray as a loading state — skeleton lines shimmer in the spectrum instead of gray."
        >
          <div className="max-w-sm rounded-xl border border-border/70 bg-card p-6">
            <div className="flex flex-col gap-2.5">
              {["w-3/4", "w-full", "w-5/6", "w-1/2"].map((w, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full ${w}`}
                  style={{
                    backgroundImage: SPECTRUM,
                    backgroundSize: "200% 100%",
                    animation: "spectrum-slide 2.5s linear infinite",
                    opacity: 0.25,
                  }}
                />
              ))}
            </div>
          </div>
        </Demo>

        <Demo
          n="03"
          title="Refracted tab"
          blurb="The ray as the active state — the selected tab carries the three bands."
        >
          <div className="max-w-sm rounded-xl border border-border/70 bg-card p-5">
            <div className="flex gap-5 border-b border-border/70 text-sm">
              <span className="pb-2 text-muted-foreground">Overview</span>
              <span className="relative pb-2 font-semibold">
                Usage
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full"
                  style={{ background: prismBands() }}
                />
              </span>
              <span className="pb-2 text-muted-foreground">Billing</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Active tab, refracted.</p>
          </div>
        </Demo>

        <Demo
          n="04"
          title="Progress & spinner"
          blurb="The ray as feedback — progress fills and spinners built from the three bands."
        >
          <div className="flex flex-wrap items-center gap-10 rounded-xl border border-border/70 bg-card p-8">
            <div className="w-64">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Deploying storefront…</span>
                <span>65%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full w-[65%] rounded-full"
                  style={{ background: prismBands() }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="size-7 animate-spin rounded-full"
                style={{
                  background: PRISM_CONIC,
                  maskImage:
                    "radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 5px))",
                }}
              />
              <span className="text-sm text-muted-foreground">Provisioning database…</span>
            </div>
          </div>
        </Demo>

        <h2 className="mt-20 border-b border-border/70 pb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Round three — the ray as state
        </h2>

        <Demo
          n="05"
          title="Reading progress"
          blurb="Blog posts and docs get a page-top progress bar in the bands — the ray tracks how far you've read."
        >
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <div className="flex items-center border-b border-border/70 px-4 py-2.5">
              <div className="flex w-16 gap-1.5">
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
              </div>
              <span className="mx-auto rounded-full border border-border/70 px-3 py-1 text-[0.625rem] leading-none text-muted-foreground">
                prisma.io/blog/one-context
              </span>
              <span className="w-16" />
            </div>
            <span
              aria-hidden
              className="block h-[4.5px] w-[38%]"
              style={{ background: prismBands() }}
            />
            <div className="flex flex-col gap-2.5 p-6">
              <span className="font-heading text-lg">Why your agent wants one vendor</span>
              <GrayBar className="w-full" />
              <GrayBar className="w-11/12" />
              <GrayBar className="w-full" />
              <GrayBar className="w-2/3" />
            </div>
          </div>
        </Demo>

        <Demo
          n="06"
          title="Form controls"
          blurb="Switches, sliders, and checkboxes wear the bands in their on/active state — off is neutral, on refracts."
        >
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 rounded-xl border border-border/70 bg-card p-8">
            <label className="flex items-center gap-3 text-sm">
              <span
                className="flex h-6 w-10 items-center rounded-full p-0.5"
                style={{ background: prismBands("to right") }}
              >
                <span className="ml-auto size-5 rounded-full bg-card shadow-[0_1px_3px_rgba(21,21,21,0.25)]" />
              </span>
              Auto-deploy on push
            </label>
            <div className="flex w-56 items-center gap-3 text-sm">
              <div className="relative h-1.5 flex-1 rounded-full bg-muted">
                <span
                  className="absolute inset-y-0 left-0 w-[60%] rounded-full"
                  style={{ background: prismBands() }}
                />
                <span className="absolute left-[60%] top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card shadow-[0_1px_3px_rgba(21,21,21,0.25)]" />
              </div>
              <span className="text-xs text-muted-foreground">6 GB</span>
            </div>
            <label className="flex items-center gap-2.5 text-sm">
              <span
                className="flex size-5 items-center justify-center rounded-[6px]"
                style={{ background: prismBands() }}
              >
                <Check className="size-3 text-white" strokeWidth={3.5} />
              </span>
              Type-safe mode
            </label>
          </div>
        </Demo>

        <Demo
          n="07"
          title="Status rings"
          blurb="Presence and activity signals: a spinning prism ring means deploying, a solid ring means live. The story-ring pattern, refracted."
        >
          <div className="flex flex-wrap items-center gap-10 rounded-xl border border-border/70 bg-card p-8">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex">
                <span
                  aria-hidden
                  className="absolute -inset-1 animate-spin rounded-full [animation-duration:1.6s]"
                  style={{
                    background: PRISM_CONIC,
                    maskImage:
                      "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
                  }}
                />
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  SF
                </span>
              </span>
              <span className="text-sm">
                <span className="font-semibold">storefront</span>
                <span className="block text-xs text-muted-foreground">Deploying…</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="relative inline-flex rounded-full p-[2.5px]"
                style={{ background: PRISM_CONIC }}
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-card">
                  <Database className="size-4 text-muted-foreground" />
                </span>
              </span>
              <span className="text-sm">
                <span className="font-semibold">Primary database</span>
                <span className="block text-xs text-muted-foreground">Live in us-west-1</span>
              </span>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold">
              <span className="relative flex size-2">
                <span
                  className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                  style={{ background: PRISM_CONIC }}
                />
                <span
                  className="relative inline-flex size-2 rounded-full"
                  style={{ background: PRISM_CONIC }}
                />
              </span>
              Live
            </span>
          </div>
        </Demo>

        <Demo
          n="08"
          title="Selection indicator"
          blurb="Command palettes, sidebars, and menus mark the selected row with a short band — the ray points at where you are."
        >
          <div className="max-w-sm overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_12px_32px_-12px_rgba(21,21,21,0.16)]">
            <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3 text-sm text-muted-foreground">
              <Search className="size-3.5" />
              Search…
              <span className="ml-auto rounded border border-border/70 px-1.5 py-0.5 text-[0.625rem]">
                ⌘K
              </span>
            </div>
            <ul className="p-1.5 text-sm">
              <li className="flex items-center gap-2.5 rounded-md px-3 py-2 text-muted-foreground">
                <Database className="size-3.5" /> Create database
              </li>
              <li className="relative flex items-center gap-2.5 rounded-md bg-muted px-3 py-2 font-medium">
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full"
                  style={{ background: prismBands() }}
                />
                <Server className="size-3.5" /> Open storefront
              </li>
              <li className="flex items-center gap-2.5 rounded-md px-3 py-2 text-muted-foreground">
                <Rocket className="size-3.5" /> View deploys
              </li>
            </ul>
          </div>
        </Demo>

        <Demo
          n="09"
          title="Toast countdown"
          blurb="Success toasts drain a band along the bottom edge before auto-dismissing — the ray as a timer."
        >
          <div className="max-w-sm overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_12px_32px_-12px_rgba(21,21,21,0.16)]">
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-prism-cyan-100">
                <Check className="size-3 text-prism-cyan-800" strokeWidth={3} />
              </span>
              <div className="text-sm">
                <p className="font-semibold">Deployed to production</p>
                <p className="mt-0.5 text-muted-foreground">storefront · 12s build</p>
              </div>
            </div>
            <span
              aria-hidden
              className="ray-countdown block h-[3px]"
              style={{ background: prismBands() }}
            />
          </div>
        </Demo>

        <Demo
          n="10"
          title="Working button"
          blurb="While the agent runs, the button's border becomes a rotating ray — the CTA itself tells you something is happening."
        >
          <div className="flex items-center gap-8 rounded-xl border border-border/70 bg-card p-8">
            <span className="relative inline-flex overflow-hidden rounded-full p-px">
              <span
                aria-hidden
                className="absolute -inset-10 animate-spin [animation-duration:2s]"
                style={{ background: PRISM_CONIC }}
              />
              <span className="relative flex items-center gap-2.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                <span
                  aria-hidden
                  className="size-3.5 animate-spin rounded-full [animation-duration:1.2s]"
                  style={{
                    background: PRISM_CONIC,
                    maskImage:
                      "radial-gradient(farthest-side, transparent calc(100% - 2.5px), black calc(100% - 2.5px))",
                  }}
                />
                Agent deploying…
              </span>
            </span>
            <p className="max-w-[30ch] text-sm text-muted-foreground">
              Busy state for PrismButton — the glow becomes a working ring.
            </p>
          </div>
        </Demo>

        <Demo
          n="11"
          title="Usage charts"
          blurb="Dashboards speak the motif: sparklines stroked in the spectrum, and today's bar refracts while history stays neutral."
        >
          <div className="flex flex-wrap gap-4">
            <div className="w-64 rounded-xl border border-border/70 bg-card p-5">
              <p className="text-xs text-muted-foreground">Queries this week</p>
              <p className="mt-1 font-heading text-2xl">1.4M</p>
              <svg viewBox="0 0 220 48" className="mt-3 w-full" aria-hidden>
                <defs>
                  <linearGradient id="spectrum-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="var(--color-prism-cyan-400)" />
                    <stop offset="0.5" stopColor="var(--color-prism-yellow-300)" />
                    <stop offset="1" stopColor="var(--color-prism-red-500)" />
                  </linearGradient>
                </defs>
                <polyline
                  points="0,40 28,34 56,36 84,26 112,30 140,18 168,22 196,10 220,14"
                  fill="none"
                  stroke="url(#spectrum-line)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-64 rounded-xl border border-border/70 bg-card p-5">
              <p className="text-xs text-muted-foreground">Deploys per day</p>
              <p className="mt-1 font-heading text-2xl">23</p>
              <div className="mt-3 flex h-12 items-end gap-1.5">
                {[35, 55, 40, 70, 50, 80].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-foreground/10"
                    style={{ height: `${h}%` }}
                  />
                ))}
                <span
                  className="flex-1 rounded-t"
                  style={{ height: "95%", background: prismBands() }}
                />
              </div>
            </div>
          </div>
        </Demo>
      </div>
    </div>
  );
}
