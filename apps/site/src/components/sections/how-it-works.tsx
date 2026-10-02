import { PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { SectionKicker } from "@/components/brand/section-kicker";
import { DefineMock, DeployMock, IterateMock } from "@/components/brand/step-mocks";
import { Reveal } from "@/components/motion/reveal";
import { HowItWorksStepper } from "@/components/sections/how-it-works-stepper";

// One ray crossing the whole card row in a single continuous movement: every
// card embeds the same full-row track (offset by its column, width spanning
// all three cards + the grid's gap-5 gutters), and the beam animates
// identically in each — so the card edges just clip slices of one traveling
// ray. The beam is 1/4 of the track wide, matching the keyframe travel.
function RayBeam({ index }: { index: number }) {
  return (
    <span
      aria-hidden
      className="absolute inset-y-0 z-10 motion-reduce:hidden"
      style={{
        left: `calc(${index} * (-100% - 1.25rem))`,
        width: "calc(300% + 2.5rem)",
      }}
    >
      <span className="absolute left-0 top-[calc(50%-1rem)] h-8 w-1/4 animate-ray-sweep">
        <PrismRay angle={0} className="inset-0" />
      </span>
    </span>
  );
}

function DefineIllustration() {
  return (
    <div
      aria-hidden
      className="relative flex h-44 select-none items-center justify-center bg-gradient-to-br from-prism-cyan-50 to-prism-cyan-100 px-6 sm:h-52"
    >
      <RayBeam index={0} />
      <DefineMock className="relative z-20" />
    </div>
  );
}

function DeployIllustration() {
  return (
    <div
      aria-hidden
      className="relative flex h-44 select-none items-center justify-center bg-gradient-to-br from-prism-yellow-50 to-prism-yellow-100 px-6 sm:h-52"
    >
      <RayBeam index={1} />
      <DeployMock className="relative z-20" />
    </div>
  );
}

function IterateIllustration() {
  return (
    <div
      aria-hidden
      className="relative flex h-44 select-none items-center justify-center bg-gradient-to-br from-prism-red-50 to-prism-red-100 px-6 sm:h-52"
    >
      <RayBeam index={2} />
      <IterateMock className="relative z-20" />
    </div>
  );
}

const STEPS = [
  {
    number: "1",
    title: "Define",
    borderAnim: "animate-step-border-1",
    illustration: DefineIllustration,
    body: (
      <>
        Write your data model once in{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8125em]">
          contract.prisma
        </code>
        , or have your agent write it for you. It&apos;s the shared contract your ORM, migrations,
        and data layer are all built around.
      </>
    ),
  },
  {
    number: "2",
    title: "Deploy",
    borderAnim: "animate-step-border-2",
    illustration: DeployIllustration,
    body: (
      <>
        Add Prisma Postgres and Compute when you&apos;re ready to ship. Your app and database deploy
        together on the same host, co-located by default.
      </>
    ),
  },
  {
    number: "3",
    title: "Iterate",
    borderAnim: "animate-step-border-3",
    illustration: IterateIllustration,
    body: (
      <>
        Your agent reads logs, fixes what broke, and redeploys through one CLI. The loop runs for as
        long as you need it to.
      </>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white px-4 py-14 sm:px-8 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-site">
        {/* the CTA joins the header row on desktop, where the stepper would
            otherwise push it a screen below the heading it answers */}
        <Reveal className="flex items-end justify-between gap-10">
          <div>
            <SectionKicker>How it works</SectionKicker>
            <h2 className="mt-4 max-w-[24ch] text-balance text-[clamp(2rem,3.5vw,3rem)] leading-[1.1]">
              Ship a production TypeScript app in three steps
            </h2>
          </div>
          <PrismButtonOutline
            href="https://console.prisma.io/sign-up"
            className="mb-1 shrink-0 max-lg:hidden"
          >
            Get started free
          </PrismButtonOutline>
        </Reveal>

        {/* Below md the steps become a swipeable row — the next card peeks in
            from the edge — instead of three full-height cards stacked. The row
            keeps the grid's gap-5, so each card's slice of the shared ray
            (RayBeam) still lines up. One Reveal wraps the row: a per-card
            reveal would make cards still clipped off to the side rise in as
            they're swiped. */}
        <Reveal className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:mt-12 sm:scroll-px-8 sm:px-8 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:hidden [&::-webkit-scrollbar]:hidden">
          {STEPS.map(({ number, title, illustration: Illustration, body, borderAnim }) => (
            <div
              key={number}
              className={`w-[84%] shrink-0 snap-start overflow-hidden rounded-2xl border border-black/[0.06] bg-card motion-reduce:animate-none sm:w-[60%] md:w-auto ${borderAnim}`}
            >
              <Illustration />
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-card-wash text-[0.8125rem] font-semibold text-foreground">
                    {number}
                  </span>
                  <h3 className="text-xl">{title}</h3>
                </div>
                <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </Reveal>

        {/* From lg the three cards become a stepper: the list drives a stage
            where the step's card steps forward (see how-it-works-stepper). */}
        <Reveal className="mt-14 max-lg:hidden">
          <HowItWorksStepper
            steps={STEPS.map(({ number, title, body }) => ({ number, title, body }))}
          />
        </Reveal>

        <Reveal className="mt-8 flex sm:mt-14 lg:hidden">
          <PrismButtonOutline href="https://console.prisma.io/sign-up">
            Get started free
          </PrismButtonOutline>
        </Reveal>
      </div>
    </section>
  );
}
