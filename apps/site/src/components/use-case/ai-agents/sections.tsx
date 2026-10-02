import { IconTile } from "@/components/brand/icon-tile";
import { Pattern } from "@/components/brand/pattern";
import { Bot, CheckBold, LayoutGrid, Rocket, X } from "@/components/icons/forma";
import { PRODUCT_ICONS } from "@/components/product/icons";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductNarrative } from "@/components/product/product-narrative";
import type { ProductIllustrationName } from "@/components/product/illustrations";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { AgentToolchain } from "./agent-toolchain";
import { PrismaAbstraction, StitchedAbstraction } from "./compare-abstractions";
import { DeployLoopTerminal } from "./deploy-loop-terminal";
import type { AgentUseCaseContent } from "./content";

// The AI & Agents page's own sections — an illustrated narrative, an icon-card
// grid, an asymmetric split, the product feature grid, a running terminal, a
// two-column comparison, a card row. The "When to use" and "What agents
// can build" sections both use the site's icon-tile card, since the copy for
// each names an icon per item and asks to be read as one card per point; the
// layouts between them keep the page from reading as one long card wall. Where a
// section is anchored by a visual, it reuses
// the product pages' own abstractions (the feature cards) or builds a first-
// class one (the toolchain diagram, the deploy-loop terminal). Shared sections
// (hero, logo strip, testimonials, closer) are composed in ai-agents-page.tsx.

const HEADING = "text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]";
const SPECTRUM = "linear-gradient(85deg,#01d7e4,#f3c306 25%,#f37a03 50%,#f43531 74%,#f00e5c)";

// "What Prisma is for AI agents" — the /orm "argue one point with a visual"
// pattern (ProductNarrative): the headline and copy on the left, a purpose-built
// 1:1 abstraction on the right — Prismo at the centre of one connected toolchain
// (schema, database, hosting, CLI), which is exactly what the copy argues. The
// lede leads the paragraphs, so all three lines are kept.
export function AgentIntro({ intro }: Pick<AgentUseCaseContent, "intro">) {
  return (
    <ProductNarrative
      headline={intro.headline}
      paragraphs={[intro.lede, ...intro.body]}
      centerText
      illustration={
        <div className="w-full">
          <AgentToolchain />
        </div>
      }
    />
  );
}

// "When to use Prisma for agent-driven apps" — icon cards. The copy names an
// icon per item (schema→code, database, deploy→rocket, debug→repeat), so the
// section respects them: the /postgres "outcomes" tile (ProductProblem) — an
// icon tile, a heading, a line of copy, a quiet border — in the same four-up row
// that page uses, so the four "Use Prisma when your agent needs…" points each
// read as one card.
export function AgentWhen({ when }: Pick<AgentUseCaseContent, "when">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className={cn("mx-auto max-w-[26ch]", HEADING)}>{when.headline}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {when.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {when.items.map(({ icon, title, body }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            return (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-card p-7">
                  <IconTile>
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </IconTile>
                  <h3 className="mt-5 text-balance text-xl leading-snug">{title}</h3>
                  <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// "Is Prisma the right fit for AI and agents?" — an asymmetric split, not two
// equal boxes. The affirmative is promoted: wider, elevated, spectrum-edged,
// set larger. The honest caveat sits beside it, plain and muted — present, but
// visibly the secondary voice.
export function AgentFit({ fit }: Pick<AgentUseCaseContent, "fit">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className={cn("mx-auto max-w-[26ch] text-center", HEADING)}>{fit.headline}</h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={0.05} className="h-full">
            <div className="spectrum-border spectrum-border-on relative flex h-full flex-col justify-center overflow-hidden rounded-[1.25rem] border border-transparent bg-white p-8 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_20px_40px_-16px_rgba(21,21,21,0.12)] sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.05] grayscale [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
              >
                <Pattern className="h-full w-full" scale={2.5} />
              </div>
              <CheckBold className="relative size-7 text-prism-cyan-500" aria-hidden />
              <p className="relative mt-5 text-pretty text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-snug text-foreground">
                {fit.suited}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="h-full">
            <div className="flex h-full flex-col justify-center rounded-[1.25rem] border border-black/[0.08] bg-muted/40 p-8 sm:p-10">
              <X className="size-6 text-foreground/30" strokeWidth={3} aria-hidden />
              <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{fit.caveat}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// "A stack built for agents to drive end to end" — the four layers as the
// product pages' own feature grid (ProductFeatures): a wrapped prismatic panel
// of ray-photo cards, each carrying the real abstraction that product page
// shows — the schema file, the database panel, the co-located app, the deploy
// log. Reusing the component (not a copy) keeps this page in lockstep with
// /orm, /postgres and /compute.
const STACK_ILLUSTRATIONS: ProductIllustrationName[] = [
  "schemaFile",
  "databasePanel",
  "coLocated",
  "deployLog",
];
export function AgentStack({ stack }: Pick<AgentUseCaseContent, "stack">) {
  return (
    <ProductFeatures
      features={{
        headline: stack.headline,
        bridge: stack.intro,
        items: stack.items.map((item, i) => ({
          name: item.title,
          description: item.body,
          illustration: STACK_ILLUSTRATIONS[i],
        })),
      }}
      // four cards run two-up, where the default block leaves them squat; the
      // hero panels need the extra height so their content isn't clipped
      mediaHeight="h-[26rem]"
      // these are the full-bleed hero panels; float them so they read as one
      // card each instead of hitting the edges (André, 2026-08-26)
      frameIllustration
    />
  );
}

// "Where can I deploy my agent-built TypeScript app?" — the loop, running. The
// terminal cycles build → deploy → debug → redeploy on its own (see
// deploy-loop-terminal.tsx), so the section shows the animation the doc asked
// for rather than describing it. The doc's animation note is carried as the
// terminal's accessible label, so nothing is lost. Intro and body copy frame it.
export function AgentDeploy({ deploy }: Pick<AgentUseCaseContent, "deploy">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      {/* headline sits with its copy on the left; the loop runs on the right in
          a 1:1 frame, matching the intro's square visual */}
      <div className="mx-auto grid max-w-site items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col">
          <Reveal>
            <h2 className={cn("max-w-[20ch]", HEADING)}>{deploy.headline}</h2>
          </Reveal>
          <div className="mt-5 flex flex-col gap-5">
            <Reveal delay={0.05}>
              <p className="max-w-[54ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                {deploy.intro}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-[54ch] text-pretty leading-relaxed text-muted-foreground">
                {deploy.body}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.12} className="lg:min-w-0">
          <div className="relative flex aspect-square w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-card p-5 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_48px_-20px_rgba(21,21,21,0.14)] sm:p-6">
            {/* spectrum bloom low in the card, the deploy glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-1/2 h-56 w-[42rem] max-w-full -translate-x-1/2 rounded-full opacity-20 blur-[80px]"
              style={{ backgroundImage: SPECTRUM }}
            />
            {/* terminal fills the square so the loop reads as the visual, not a
                small card floating in it */}
            <div className="relative flex h-full w-full">
              <DeployLoopTerminal label={deploy.animationLabel} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// "How Prisma compares to stitched-together stacks" — two columns, each an
// abstraction over its paragraph: the five separate tools on the left, the one
// connected Prisma layer on the right (see compare-abstractions.tsx). The
// headline carries the comparison; the copy stays verbatim, one paragraph a
// side, nothing labelled or invented.
export function AgentCompare({ compare }: Pick<AgentUseCaseContent, "compare">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className={cn("mx-auto max-w-[24ch] text-center", HEADING)}>{compare.headline}</h2>
        </Reveal>

        {/* both abstractions are the same fixed height so their panels align
            top and bottom; the paragraphs sit beneath, lengths free to differ */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <div>
              <div className="h-[18rem]">
                <StitchedAbstraction />
              </div>
              <p className="mt-6 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
                {compare.before}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <div className="h-[18rem]">
                <PrismaAbstraction />
              </div>
              <p className="mt-6 max-w-[54ch] text-pretty leading-relaxed text-foreground">
                {compare.after}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// "What agents can build with Prisma" — three build types in the site's own
// card idiom (the /postgres "ships with the rest of your stack" tiles): an icon
// tile, a heading, a line of copy, a quiet border. One distinct icon each —
// internal tools, an AI product, a prototype to launch.
const BUILD_ICONS = [LayoutGrid, Bot, Rocket];
export function AgentBuilds({ builds }: Pick<AgentUseCaseContent, "builds">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className={cn("mx-auto max-w-[24ch] text-center", HEADING)}>{builds.headline}</h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {builds.items.map(({ title, body }, i) => {
            const Icon = BUILD_ICONS[i % BUILD_ICONS.length];
            return (
              <Reveal key={title} delay={i * 0.1} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-card p-7">
                  <IconTile>
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </IconTile>
                  <h3 className="mt-5 text-xl">{title}</h3>
                  <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
