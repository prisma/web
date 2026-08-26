import type { Metadata } from "next";
import { Fragment } from "react";
import { ArrowRight, Check, X } from "@/components/icons/forma";
import { prismBands } from "@/components/brand/prism-ray";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Brand lab - Before & after",
  robots: { index: false },
};

const TONES = {
  cyan: "bg-prism-cyan-400/15 text-prism-cyan-500",
  yellow: "bg-prism-yellow-300/25 text-prism-yellow-400",
  red: "bg-prism-red-500/12 text-prism-red-500",
} as const;

// brighter check chips for the dark surface
const TONES_DARK = {
  cyan: "bg-prism-cyan-400/20 text-prism-cyan-400",
  yellow: "bg-prism-yellow-300/20 text-prism-yellow-300",
  red: "bg-prism-red-500/25 text-prism-red-400",
} as const;

const PAIRS = [
  {
    before: "Your agent writes the code, you wire it up",
    after: "Your agent runs the full loop: build, deploy, debug, fix, redeploy",
    tone: "cyan",
  },
  {
    before:
      "Context-switching between a database dashboard, ORM CLI, hosting console, and data browser",
    after: "One platform: hosting, database, and ORM built to work together natively",
    tone: "yellow",
  },
  {
    before: "Per-branch databases that don't connect to your hosting previews",
    after: "Per-branch databases wired to your hosting previews automatically",
    tone: "red",
  },
  {
    before: "A database from Neon, an ORM from Drizzle, hosting from Vercel",
    after: "App and database co-located on the same host, at latency no two-vendor setup can match",
    tone: "cyan",
  },
  {
    before: "Bandwidth bills that scale faster than your traffic",
    after: "Spend limits on every paid tier, so your bill stops where you tell it to",
    tone: "yellow",
  },
] as const;

type Tone = keyof typeof TONES;

function Heading() {
  return (
    <h2 className="max-w-[24ch] text-balance text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
      The stack your agent has been waiting for
    </h2>
  );
}

function XDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.05] text-foreground/30",
        className,
      )}
    >
      <X className="size-3" aria-hidden />
    </span>
  );
}

function CheckDot({
  tone,
  dark = false,
  className,
}: {
  tone: Tone;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full",
        dark ? TONES_DARK[tone] : TONES[tone],
        className,
      )}
    >
      <Check className="size-3" aria-hidden />
    </span>
  );
}

function BeforeCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-8 py-5 text-pretty text-[15px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <XDot className="mt-0.5" />
      {children}
    </div>
  );
}

function AfterCell({
  children,
  tone,
  dark = false,
  className,
}: {
  children: React.ReactNode;
  tone: Tone;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-8 py-5 text-pretty text-[15px] font-semibold leading-relaxed",
        dark ? "text-white" : "text-foreground",
        className,
      )}
    >
      <CheckDot tone={tone} dark={dark} className="mt-0.5" />
      {children}
    </div>
  );
}

// ── 01 The divide (baseline) ────────────────────────────────────────────────
function DivideBaseline() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Heading />
        <div className="relative mt-12 overflow-hidden rounded-[1.5rem] border border-black/[0.06]">
          <div className="grid lg:grid-cols-2">
            <p className="bg-muted/60 px-8 pt-8 text-sm text-muted-foreground max-lg:hidden">
              Before
            </p>
            <p className="bg-white px-8 pt-8 text-sm font-semibold text-foreground max-lg:hidden">
              After
            </p>
            {PAIRS.map(({ before, after, tone }) => (
              <Fragment key={after}>
                <BeforeCell className="bg-muted/60">{before}</BeforeCell>
                <AfterCell tone={tone} className="bg-white">
                  {after}
                </AfterCell>
              </Fragment>
            ))}
            <div aria-hidden className="bg-muted/60 pb-4 max-lg:hidden" />
            <div aria-hidden className="bg-white pb-4 max-lg:hidden" />
          </div>
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-[3px] -translate-x-1/2 lg:block"
            style={{ background: prismBands() }}
          />
        </div>
      </div>
    </section>
  );
}

// ── 02 Dark exit ────────────────────────────────────────────────────────────
// Same structure, but the after half flips to the brand's near-black surface.
// The checks glow against it; the gray past stays pale.
function DivideDark() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Heading />
        <div className="relative mt-12 overflow-hidden rounded-[1.5rem] border border-black/[0.06]">
          <div className="grid lg:grid-cols-2">
            <p className="bg-muted/60 px-8 pt-8 text-sm text-muted-foreground max-lg:hidden">
              Before
            </p>
            <p className="bg-foreground px-8 pt-8 text-sm font-semibold text-white max-lg:hidden">
              After
            </p>
            {PAIRS.map(({ before, after, tone }) => (
              <Fragment key={after}>
                <BeforeCell className="bg-muted/60">{before}</BeforeCell>
                <AfterCell tone={tone} dark className="bg-foreground">
                  {after}
                </AfterCell>
              </Fragment>
            ))}
            <div aria-hidden className="bg-muted/60 pb-4 max-lg:hidden" />
            <div aria-hidden className="bg-foreground pb-4 max-lg:hidden" />
          </div>
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-[3px] -translate-x-1/2 lg:block"
            style={{ background: prismBands() }}
          />
        </div>
      </div>
    </section>
  );
}

// ── 03 Refraction ───────────────────────────────────────────────────────────
// The seam tilts like light through glass: the gray surface is clipped at an
// angle and the band leans with it.
function DivideAngled() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Heading />
        <div className="relative mt-12 overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="absolute inset-0 bg-muted/60 max-lg:hidden"
            style={{ clipPath: "polygon(0 0, 52.5% 0, 47.5% 100%, 0 100%)" }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 hidden h-[120%] w-[3px] -translate-x-1/2 -translate-y-1/2 rotate-[6deg] lg:block"
            style={{ background: prismBands() }}
          />
          <div className="relative grid lg:grid-cols-2">
            <p className="px-8 pt-8 text-sm text-muted-foreground max-lg:hidden">Before</p>
            <p className="px-8 pt-8 text-sm font-semibold text-foreground max-lg:hidden">After</p>
            {PAIRS.map(({ before, after, tone }) => (
              <Fragment key={after}>
                <BeforeCell className="max-lg:bg-muted/60 lg:pr-16">{before}</BeforeCell>
                <AfterCell tone={tone} className="lg:pl-16">
                  {after}
                </AfterCell>
              </Fragment>
            ))}
            <div aria-hidden className="pb-4 max-lg:hidden" />
            <div aria-hidden className="pb-4 max-lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 04 Dispersion ───────────────────────────────────────────────────────────
// The hard band becomes light: a soft spectrum glow bleeds from the seam into
// the after half, brightest where the transformation happens.
function DivideGlow() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Heading />
        <div className="relative mt-12 overflow-hidden rounded-[1.5rem] border border-black/[0.06]">
          <div className="grid lg:grid-cols-2">
            <p className="bg-muted/60 px-8 pt-8 text-sm text-muted-foreground max-lg:hidden">
              Before
            </p>
            <p className="bg-white px-8 pt-8 text-sm font-semibold text-foreground max-lg:hidden">
              After
            </p>
            {PAIRS.map(({ before, after, tone }) => (
              <Fragment key={after}>
                <BeforeCell className="bg-muted/60">{before}</BeforeCell>
                <AfterCell tone={tone} className="bg-white">
                  {after}
                </AfterCell>
              </Fragment>
            ))}
            <div aria-hidden className="bg-muted/60 pb-4 max-lg:hidden" />
            <div aria-hidden className="bg-white pb-4 max-lg:hidden" />
          </div>
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-40 -translate-x-1/2 lg:block"
          >
            <div
              className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 opacity-25 blur-2xl"
              style={{ background: prismBands() }}
            />
            <div
              className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 opacity-90 blur-[0.5px]"
              style={{ background: prismBands() }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 05 The crossing ─────────────────────────────────────────────────────────
// Each pair gets its own crossing point: a small arrow chip sitting on the
// seam, marking the row's transformation.
function DivideChips() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Heading />
        <div className="relative mt-12 overflow-hidden rounded-[1.5rem] border border-black/[0.06]">
          <div aria-hidden className="absolute inset-y-0 left-0 w-1/2 bg-muted/60 max-lg:hidden" />
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-[3px] -translate-x-1/2 lg:block"
            style={{ background: prismBands() }}
          />
          <div className="relative grid lg:grid-cols-[1fr_0rem_1fr]">
            <p className="px-8 pt-8 text-sm text-muted-foreground max-lg:hidden">Before</p>
            <span className="max-lg:hidden" />
            <p className="px-8 pt-8 text-sm font-semibold text-foreground max-lg:hidden">After</p>
            {PAIRS.map(({ before, after, tone }) => (
              <Fragment key={after}>
                <BeforeCell className="max-lg:bg-muted/60">{before}</BeforeCell>
                <span aria-hidden className="relative self-center max-lg:hidden">
                  <span className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.06),0_4px_12px_-4px_rgba(21,21,21,0.10)]">
                    <ArrowRight className="size-3 text-foreground/50" />
                  </span>
                </span>
                <AfterCell tone={tone}>{after}</AfterCell>
              </Fragment>
            ))}
            <div aria-hidden className="pb-4 max-lg:hidden" />
            <span className="max-lg:hidden" />
            <div aria-hidden className="pb-4 max-lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 06 The waterfall ────────────────────────────────────────────────────────
// The divide turned horizontal: the old stack sits above the band, the new
// one below it. Items flow down through the prism plane.
function DivideWaterfall() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Heading />
        <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-black/[0.06]">
          <div className="bg-muted/60 p-8 sm:p-10">
            <p className="text-sm text-muted-foreground">Before</p>
            <ul className="mt-6 grid gap-x-12 gap-y-4 sm:grid-cols-2">
              {PAIRS.map(({ before }) => (
                <li
                  key={before}
                  className="flex items-start gap-3 text-pretty text-[15px] leading-relaxed text-muted-foreground"
                >
                  <XDot className="mt-0.5" />
                  {before}
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden className="h-1.5" style={{ background: prismBands("to right") }} />
          <div className="bg-white p-8 sm:p-10">
            <p className="text-sm font-semibold text-foreground">After</p>
            <ul className="mt-6 grid gap-x-12 gap-y-4 sm:grid-cols-2">
              {PAIRS.map(({ after, tone }) => (
                <li
                  key={after}
                  className="flex items-start gap-3 text-pretty text-[15px] font-semibold leading-relaxed text-foreground"
                >
                  <CheckDot tone={tone} className="mt-0.5" />
                  {after}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const OPTIONS = [
  {
    n: "01",
    title: "The divide",
    blurb: "The baseline you picked: gray before, white after, band on the seam.",
    variant: <DivideBaseline />,
  },
  {
    n: "02",
    title: "Dark exit",
    blurb:
      "The after half flips to the brand's near-black surface. Highest contrast between the two worlds; the colored checks glow.",
    variant: <DivideDark />,
  },
  {
    n: "03",
    title: "Refraction",
    blurb:
      "The seam tilts like light through glass: the gray surface is clipped at an angle and the band leans with it.",
    variant: <DivideAngled />,
  },
  {
    n: "04",
    title: "Dispersion",
    blurb:
      "The hard band becomes light: a soft spectrum glow bleeds out of the seam, brightest where the transformation happens.",
    variant: <DivideGlow />,
  },
  {
    n: "05",
    title: "The crossing",
    blurb:
      "Every pair gets its own crossing point: a small arrow chip sits on the seam, marking each row's transformation.",
    variant: <DivideChips />,
  },
  {
    n: "06",
    title: "The waterfall",
    blurb:
      "The divide turned horizontal: the old stack above the band, the new one below. Trades row-pairing for a calmer two-block rhythm.",
    variant: <DivideWaterfall />,
  },
];

export default function ComparisonLabPage() {
  return (
    <div className="bg-white pb-32 pt-36">
      <div className="container mx-auto max-w-[96rem] px-4">
        <p className="text-sm text-muted-foreground/60">Brand lab</p>
        <h1 className="mt-2 text-4xl">Before &amp; after</h1>
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
          Six takes on the divide: one wrapped panel, two surfaces, the triple band on the seam. 01
          is the baseline; 02 to 06 each change one thing.
        </p>

        {OPTIONS.map(({ n, title, blurb, variant }) => (
          <section key={n} className="mt-20">
            <div className="flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground/60">{n}</span>
              <h2 className="text-2xl">{title}</h2>
            </div>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              {blurb}
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.06]">
              {variant}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
