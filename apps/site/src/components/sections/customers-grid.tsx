import Link from "next/link";
import { Marker } from "@/components/brand/marker";
import { ArrowRightBold } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { StoryArt } from "@/components/sections/story-art";
import { STORY_DETAIL_SLUGS } from "@/data/customer-stories";
import { CUSTOMER_STORIES, type CustomerStory } from "@/data/customers";
import { cn } from "@/lib/utils";

// Display names for the stack ids carried on each story. Anything unmapped
// falls through to the raw id rather than being dropped, so a new technology
// appearing in the data shows up (slightly wrong) instead of silently vanishing.
const STACK_LABELS: Record<string, string> = {
  apollo: "Apollo",
  aws: "AWS",
  cloudflare: "Cloudflare",
  cockroach: "CockroachDB",
  cognito: "Cognito",
  docker: "Docker",
  gcp: "Google Cloud",
  graphql: "GraphQL",
  kafka: "Kafka",
  kubernetes: "Kubernetes",
  mongodb: "MongoDB",
  mysql: "MySQL",
  nest: "NestJS",
  next: "Next.js",
  nexus: "Nexus",
  node: "Node.js",
  postgres: "Postgres",
  prisma: "Prisma",
  react: "React",
  redis: "Redis",
  trpc: "tRPC",
  ts: "TypeScript",
  vercel: "Vercel",
};

// The three brand colours in the site's standard order, cycled across a story's
// chips so the row carries the spectrum without any one chip claiming meaning.
const DOT_COLORS = ["bg-prism-cyan-400", "bg-prism-yellow-400", "bg-prism-red-400"];

// Chips are capped at three. Five is the longest stack in the data, and at card
// width a five-chip row wraps to two lines and starts competing with the title
// for weight — the reference layout runs three.
const MAX_CHIPS = 3;

// /customers story grid — all thirteen customer stories.
//
// Thirteen doesn't divide into three columns, so the first story runs
// full-width as a lead card and the remaining twelve fill exactly four rows of
// three. That gives the reference layout's featured-card moment without asking
// anyone for new copy: the lead card renders the same fields as every other
// card, just larger and horizontal.
//
// Three columns rather than the reference's two: at max-w-site (1400px) a
// two-column card is ~690px, far wider than a logo plate wants. Three lands at
// ~455px, close to the reference's own ~500px.
//
// Cards link inward to /customers/[slug] where a detail page has been built
// (STORY_DETAIL_SLUGS), and fall back to the live prisma.io blog post for the
// rest until their pages land.
export function CustomersGrid() {
  const [lead, ...rest] = CUSTOMER_STORIES;

  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <StoryCard story={lead} lead />
        </Reveal>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((story, i) => (
            <Reveal key={story.slug} delay={(i % 3) * 0.1} className="h-full">
              <StoryCard story={story} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCard({ story, lead = false }: { story: CustomerStory; lead?: boolean }) {
  const internal = STORY_DETAIL_SLUGS.has(story.slug);
  const href = internal ? `/customers/${story.slug}` : story.href;
  // Detail pages are this app's own routes, so they get client-side routing;
  // the fallback to a live blog post is another zone and hard-navigates.
  const Card = internal ? Link : "a";

  return (
    <Card
      href={href}
      target={internal ? undefined : "_blank"}
      rel={internal ? undefined : "noopener noreferrer"}
      className={cn(
        // `group` drives nothing but the spectrum underline on "Read the story"
        // — the card itself deliberately has no hover state (André).
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-card",
        // Lead card runs taller than its copy needs (André, 2026-08-17) — at
        // content height the plate came out shorter than the three cards below
        // it and the row read as a wide card rather than the lead.
        lead && "md:min-h-[27rem] md:flex-row md:items-stretch",
      )}
    >
      {/* 16:9 (André, 2026-08-17). The grid plate was a fixed h-36, which at
          card width is roughly 3.2:1 — enough for the lockup but letterboxed
          enough that the art read as a banner strip rather than an image. The
          lead card keeps h-auto so its plate stretches to whatever the copy
          column needs; it sits beside the text, not above it, so it isn't
          bound to the same ratio. */}
      <StoryArt
        story={story}
        size={lead ? "lead" : "card"}
        className={cn(
          "shrink-0",
          lead ? "aspect-video md:aspect-auto md:h-auto md:w-2/5" : "aspect-video w-full",
        )}
      />

      <div className={cn("flex grow flex-col p-7", lead && "md:justify-center md:p-10")}>
        <h3
          className={cn(
            "text-pretty text-xl leading-snug",
            lead && "md:max-w-[24ch] md:text-[clamp(1.5rem,2.2vw,2rem)] md:leading-[1.15]",
          )}
        >
          {story.title}
        </h3>

        {story.stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {story.stack.slice(0, MAX_CHIPS).map((tech, i) => (
              <li key={tech}>
                <Marker color={DOT_COLORS[i % DOT_COLORS.length]}>
                  {STACK_LABELS[tech] ?? tech}
                </Marker>
              </li>
            ))}
          </ul>
        )}

        {/* No `grow` on the clamped paragraph: line-clamp needs
            display:-webkit-box, and letting flex stretch that box makes it tall
            enough to paint a fourth line which then gets sliced through the
            middle by the clamp. The link takes mt-auto instead, so cards still
            bottom-align without the paragraph having to absorb the slack. */}
        <p
          className={cn(
            "mt-4 line-clamp-3 text-pretty leading-relaxed text-muted-foreground",
            lead && "md:max-w-[62ch] md:text-lg",
          )}
        >
          {story.excerpt}
        </p>

        {/* Grid cards push the link to the bottom edge so it lines up across a
            row whatever the excerpt length. The lead card must not: its column
            is vertically centred, so mt-auto strands the link at the bottom
            with a gap above it — visible as soon as the card was made taller. */}
        {/* The underline needs its own box to sit under, so it goes on an inner
            span — putting it on the outer one would draw the rule 3px below the
            card's bottom padding instead of under the words. */}
        <span className={cn("inline-flex pt-6", !lead && "mt-auto")}>
          <span className="spectrum-underline inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            Read the story
            <ArrowRightBold className="size-3.5" aria-hidden />
          </span>
        </span>
      </div>
    </Card>
  );
}
