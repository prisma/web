import type { Metadata } from "next";
import { Check } from "@/components/icons/forma";
import { GlassPrism } from "@/components/brand/glass-prism";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { Texture } from "@/components/brand/texture";
import { ConsoleIllustration } from "@/components/sections/console-illustration";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Prism Lab",
  robots: { index: false, follow: false },
};

// Spectrum gradient shared with the brand CTA (see prism-button.tsx).
const SPECTRUM =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

const CHECKS = [
  { label: "One platform, one stack, one bill", color: "text-prism-cyan-500" },
  { label: "A CLI and API your agent drives natively", color: "text-prism-yellow-400" },
  { label: "The ORM is free, always", color: "text-prism-red-500" },
];

const PROOF = [
  { stat: "500,000+", label: "developers" },
  { stat: "28%", label: "of the TypeScript ORM market" },
  { stat: "46,500+", label: "GitHub stars" },
];

// The current homepage hero panel, with a slot for the glass-prism motif
// layer. Everything except `motif` matches hero-home.tsx.
function HeroShell({ motif }: { motif?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white sm:rounded-[2.25rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46rem] overflow-hidden"
      >
        <div
          className="absolute -bottom-1/4 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
          style={{
            background: [
              "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
              "radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
              "radial-gradient(48% 38% at 72% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
            ].join(","),
          }}
        />
        <div className="absolute bottom-[-22rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
        <div className="absolute bottom-[-24rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
        <div className="absolute bottom-[-22rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-t from-transparent via-white/60 to-white" />
      </div>

      {motif}

      <Texture />

      <div className="relative px-4 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center pt-32 text-center max-md:pt-28">
          <h1 className="max-w-[20ch] text-balance text-[clamp(2.5rem,4.5vw,3.875rem)] leading-[1.06]">
            Your TypeScript app, from prompt to production
          </h1>
          <p className="mt-6 max-w-[64ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            Give your coding agent a type-safe ORM, managed Postgres, and app hosting that work
            together natively. One shared context across your stack is all your agent needs to
            build, deploy, and iterate without coordinating between vendors.
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {CHECKS.map(({ label, color }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-[15px] font-semibold text-foreground"
              >
                <Check className={cn("size-4 shrink-0", color)} strokeWidth={3} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PrismButton href="https://console.prisma.io">Get started free</PrismButton>
            <PrismButtonOutline href="/pricing">See pricing</PrismButtonOutline>
          </div>
        </div>

        <div className="relative mx-auto mt-14 w-full max-w-4xl pb-16 max-md:mt-10 max-md:pb-10">
          <div
            aria-hidden
            className="absolute -top-8 inset-x-8 h-40 opacity-25 blur-[56px]"
            style={{ backgroundImage: SPECTRUM }}
          />
          <PrismRay className="left-1/2 top-[42%] h-24 w-[120rem] -translate-x-1/2" />
          <ConsoleIllustration />
          <p className="relative mt-10 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm leading-relaxed text-muted-foreground max-md:mt-8">
            {PROOF.map(({ stat, label }, i) => (
              <span key={label} className="contents">
                {i > 0 && (
                  <span aria-hidden className="text-foreground/20 max-sm:hidden">
                    ·
                  </span>
                )}
                <span className="whitespace-nowrap">
                  {i === 0 && "Trusted by "}
                  <span className="font-semibold text-foreground">{stat}</span> {label}
                </span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

// Option 1 — one hexagon catches the ray up top; the spectral wash below
// reads as what the glass dispersed.
function RefractionMotif() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <PrismRay className="right-[-18rem] top-24 h-8 w-[56rem]" intensity="whisper" mask="start" />
      <GlassPrism
        shape="hexagon"
        tint="spectral"
        gradientId="hero-motif-spectrum"
        className="right-[4%] top-10 w-[22rem] -rotate-6 max-lg:w-64 max-md:right-[-4rem] max-md:top-8 max-md:w-44"
      />
    </div>
  );
}

// Option 2 — a field of different shapes at different depths, each one a
// prism. Drifts slowly; hidden below md except the hexagon.
function FieldMotif() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <GlassPrism
        shape="rect"
        tint="ink"
        className="prism-float left-[-2rem] top-[30%] w-[15rem] rotate-12 max-md:hidden"
      />
      <GlassPrism
        shape="hexagon"
        tint="spectral"
        gradientId="field-motif-spectrum-1"
        className="prism-float right-[5%] top-6 w-[16rem] -rotate-6 [animation-delay:-5s] max-md:right-[-3rem] max-md:w-40"
      />
      <GlassPrism
        shape="pentagon"
        tint="spectral"
        gradientId="field-motif-spectrum-2"
        className="prism-float bottom-[3rem] left-[6%] w-[15rem] [animation-delay:-9s] max-md:hidden"
      />
      <GlassPrism
        shape="triangle"
        tint="spectral"
        gradientId="field-motif-spectrum-3"
        className="prism-float bottom-[4rem] right-[10%] w-40 rotate-[9deg] [animation-delay:-12s] max-md:hidden"
      />
    </div>
  );
}

// Option 3 — the brand pentagon at architectural scale, white glass glowing
// out of the spectral bloom behind the console.
function MonumentMotif() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* the prism concentrates the light — local spectrum bloom behind the glass */}
      <div
        className="absolute bottom-[-8rem] right-[-10rem] h-[42rem] w-[52rem] rounded-full opacity-35 blur-[90px]"
        style={{ backgroundImage: SPECTRUM }}
      />
      <GlassPrism
        shape="pentagon"
        tint="white"
        backFace={false}
        className="bottom-[-18rem] right-[-12rem] w-[46rem] max-md:bottom-[-8rem] max-md:right-[-8rem] max-md:w-[24rem]"
      />
    </div>
  );
}

const OPTIONS = [
  {
    n: "01",
    title: "Refraction",
    blurb:
      "One glass hexagon catches a whisper ray beside the headline. The story: light enters the shape up top, and the spectral wash at the bottom is what it dispersed. Single shape, quietest option.",
    motif: <RefractionMotif />,
  },
  {
    n: "02",
    title: "Field",
    blurb:
      "“Any shape can be a Prisma” read literally — a rectangle, hexagon, pentagon, and one small triangle floating at different depths, hairline glass with faces catching the spectrum. Slow drift.",
    motif: <FieldMotif />,
  },
  {
    n: "03",
    title: "Monument",
    blurb:
      "The brand pentagon at architectural scale, rising out of the bottom-right corner where the spectrum concentrates behind it — white glass glowing against the color, mostly submerged. One shape, maximum presence.",
    motif: <MonumentMotif />,
  },
];

export default function PrismLabPage() {
  return (
    <div className="bg-white pb-32 pt-36">
      <style>{`
        @keyframes prism-float { from { translate: 0 0; } to { translate: 0 -14px; } }
        .prism-float { animation: prism-float 14s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .prism-float { animation: none; }
        }
      `}</style>

      <div className="container mx-auto max-w-[96rem] px-4">
        <p className="text-sm text-muted-foreground/60">Brand lab</p>
        <h1 className="mt-2 text-4xl">Any shape is a Prisma</h1>
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
          Three ways to put the extruded-glass prism motif behind the homepage hero. Same hero, same
          backdrop — only the glass layer changes.
        </p>

        {OPTIONS.map(({ n, title, blurb, motif }) => (
          <section key={n} className="mt-20">
            <div className="flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground/60">{n}</span>
              <h2 className="text-2xl">{title}</h2>
            </div>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              {blurb}
            </p>
            <div className="mt-6">
              <HeroShell motif={motif} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
