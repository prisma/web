import { Code, Console, Rocket } from "@/components/icons/forma";
import { Texture } from "@/components/brand/texture";
import { Reveal } from "@/components/motion/reveal";

// Step tiles sit 1.5rem in from each column's left edge (half of size-12), and
// the columns are (100% - 2.5rem)/3 wide with gap-5 between them — so the track
// runs from the first tile's center to the last tile's center exactly.
const TRACK_INSET_RIGHT = "calc((100% - 2.5rem) / 3 - 1.5rem)";

const STEPS = [
  {
    icon: Code,
    title: "Build",
    body: "Model your data and write type-safe queries with Prisma ORM.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    body: "Provision a Prisma Postgres database and deploy to Prisma Compute, co-located on the same host.",
  },
  {
    icon: Console,
    title: "Debug",
    body: "Read your logs, update your schema, migrate, and redeploy, without switching tools.",
  },
];

// A node on the track: the white tile idiom (see stack-bento's ToolIcon) turned
// round, so it reads as something the wire passes through.
function StepNode({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-8px_rgba(21,21,21,0.1)]"
    >
      <span
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(80% 55% at 20% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 45%, transparent), transparent 70%)",
            "radial-gradient(70% 50% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 40%, transparent), transparent 68%)",
            "radial-gradient(75% 52% at 84% 100%, color-mix(in srgb, var(--color-prism-red-300) 42%, transparent), transparent 70%)",
          ].join(","),
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

// The happy path, before the page breaks into the three products: build, deploy,
// debug as three nodes on one continuous wire, with the same spectral pulse the
// platform diagram uses running through them. Wrapped panel, so it separates the
// "why" above from the product detail below.
export function PlatformFlow() {
  return (
    <section className="bg-white px-3 py-3 sm:px-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        {/* the panel's spectral wash, quieter than the hero's — the track has to
            stay the most legible thing in the frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[26rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(60% 46% at 18% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 22%, transparent), transparent 72%)",
                "radial-gradient(52% 40% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 18%, transparent), transparent 70%)",
                "radial-gradient(56% 44% at 84% 100%, color-mix(in srgb, var(--color-prism-red-400) 20%, transparent), transparent 72%)",
              ].join(","),
            }}
          />
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-t from-transparent via-white/70 to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="max-w-[22ch] text-balance text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
                From building to shipping, in one flow
              </h2>
            </Reveal>

            <div className="relative mt-16 grid gap-5 md:grid-cols-3">
              {/* the one wire every step hangs off, level with the tile centers */}
              <div
                aria-hidden
                className="absolute top-6 hidden h-px overflow-hidden md:block"
                style={{ left: "1.5rem", right: TRACK_INSET_RIGHT }}
              >
                <span className="absolute inset-0 bg-border" />
                <span className="absolute inset-y-0 w-1/4 animate-schema-flow bg-gradient-to-r from-transparent via-prism-cyan-400 to-transparent motion-reduce:hidden" />
              </div>

              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 0.1} className="relative flex flex-col items-start">
                  <StepNode>
                    <Icon className="size-6 text-foreground" />
                  </StepNode>
                  <h3 className="mt-6 text-xl">{title}</h3>
                  <p className="mt-2 max-w-[34ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
