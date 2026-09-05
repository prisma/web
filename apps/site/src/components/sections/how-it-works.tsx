import { PrismButtonOutline } from "@/components/brand/prism-button";
import { PrismRay } from "@/components/brand/prism-ray";
import { DefineMock, DeployMock, IterateMock } from "@/components/brand/step-mocks";
import { Reveal } from "@/components/motion/reveal";

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
      className="relative flex h-52 select-none items-center justify-center bg-prism-cyan-50 px-6"
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
      className="relative flex h-52 select-none items-center justify-center bg-prism-yellow-50 px-6"
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
      className="relative flex h-52 select-none items-center justify-center bg-prism-red-50 px-6"
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
    <section className="bg-card px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className="max-w-[24ch] text-balance text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
            Ship a production TypeScript app in three steps
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ number, title, illustration: Illustration, body, borderAnim }, i) => (
            <Reveal
              key={number}
              delay={i * 0.1}
              className={`overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card motion-reduce:animate-none ${borderAnim}`}
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
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex">
          <PrismButtonOutline href="https://console.prisma.io/sign-up">
            Get started free
          </PrismButtonOutline>
        </Reveal>
      </div>
    </section>
  );
}
