import Image from "next/image";
import { Check, Download } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { Texture } from "@/components/brand/texture";
import { SectionHeader } from "@/components/brand-kit/section-header";
import {
  expressionHref,
  MASCOT_EXPRESSIONS,
  MASCOT_NAME,
  MASCOT_RULES,
} from "@/components/brand-kit/content";

const LEAD = "/brand-kit/mascot/happy.png";

// The mascot section. He already lives on the site as the agent at the centre
// of the homepage orbit (see brand/agent-robot.tsx) — here he's handed over as
// a set, with the rules that keep him a character rather than a second logo.
export function BrandKitMascot() {
  return (
    <section id="mascot" className="scroll-mt-24 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <SectionHeader
          kicker="Mascot"
          kickerColor="bg-prism-red-500"
          title={`Meet ${MASCOT_NAME}`}
          body={`${MASCOT_NAME} is the face of the agent — the chrome head with the prism visor you'll meet on the homepage. Reach for him where the product should feel human, and leave the logo to do the branding.`}
        />

        <div className="mx-auto mt-16 grid max-w-4xl items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8">
            {/* The spectral wash the hero uses, scoped to the panel: colour
                pooled along the bottom edge, faded back to paper above so the
                grain reads as film rather than dirt. */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3">
              <div
                className="absolute inset-0"
                style={{
                  background: [
                    "radial-gradient(58% 78% at 22% 108%, color-mix(in srgb, var(--color-prism-cyan-400) 52%, transparent), transparent 70%)",
                    "radial-gradient(52% 70% at 54% 116%, color-mix(in srgb, var(--color-prism-yellow-300) 44%, transparent), transparent 68%)",
                    "radial-gradient(52% 72% at 86% 108%, color-mix(in srgb, var(--color-prism-red-400) 46%, transparent), transparent 70%)",
                  ].join(","),
                }}
              />
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-t from-transparent to-white" />
            </div>
            {/* Grain spans the whole panel — scoped to the wash box it would
                show its own hard top edge. */}
            <Texture opacity={0.06} blend="multiply" />
            <Image
              src={LEAD}
              alt={`The Prisma mascot, ${MASCOT_NAME}, smiling`}
              width={1254}
              height={1254}
              sizes="16rem"
              className="relative w-56 max-w-full drop-shadow-[0_10px_16px_rgba(21,21,21,0.18)] sm:w-64"
            />
          </Reveal>

          <Reveal
            delay={0.08}
            className="flex flex-col justify-center gap-4 rounded-2xl border border-black/[0.06] p-8"
          >
            <p className="text-sm font-semibold">Four rules for using him</p>
            <ul className="space-y-4">
              {MASCOT_RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-prism-cyan-500" aria-hidden />
                  <span className="text-sm leading-relaxed text-muted-foreground">{rule}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-16 max-w-3xl text-left md:text-center">
          <h3 className="text-xl font-semibold">Nine expressions</h3>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            One face per moment. Every expression is a transparent PNG, and all nine ship inside the
            master download.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MASCOT_EXPRESSIONS.map((e, i) => (
            <Reveal
              key={e.file}
              delay={(i % 3) * 0.08}
              className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.06]"
            >
              <div className="flex h-44 items-center justify-center bg-white">
                <Image
                  src={expressionHref(e)}
                  alt={`${MASCOT_NAME} — ${e.name.toLowerCase()}`}
                  width={1254}
                  height={1254}
                  sizes="8rem"
                  className="h-32 w-32 object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col border-t border-black/[0.06] p-5">
                <p className="font-semibold">{e.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.usage}</p>
                <div className="mt-auto pt-4">
                  <a
                    href={expressionHref(e)}
                    download
                    // Nine cards each with a link reading only "PNG": without
                    // this the whole set is indistinguishable in a screen
                    // reader's link list.
                    aria-label={`Download the ${e.name.toLowerCase()} PNG`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.08] px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-black/20 hover:bg-black/[0.03]"
                  >
                    <Download className="size-3.5" aria-hidden />
                    PNG
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
