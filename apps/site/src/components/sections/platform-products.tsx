import { ArrowRightBold } from "@/components/icons/forma";
import { OrmIllustration } from "@/components/sections/orm-illustration";
import { PostgresIllustration } from "@/components/sections/postgres-illustration";
import { ComputeIllustration } from "@/components/sections/compute-illustration";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// TODO: /orm, /postgres and /compute are Phase 1 sitemap routes not built yet
// (see design-ref/sitemap.md) — same as the homepage StackBento links.
const PRODUCTS = [
  {
    name: "Prisma ORM",
    role: "Type-safe data layer",
    href: "/orm",
    dot: "bg-prism-cyan-400",
    Illustration: OrmIllustration,
    description:
      "One declarative schema in native TypeScript — the single config your app, your migrations, and your agent all build against.",
    points: [
      "Free and open source, trusted by 500,000+ developers",
      "Schema small and dense enough to hand an LLM as context",
      "Errors structured for agents, not just humans",
    ],
  },
  {
    name: "Prisma Postgres",
    role: "Managed database",
    href: "/postgres",
    dot: "bg-prism-yellow-400",
    Illustration: PostgresIllustration,
    description:
      "Managed Postgres that arrives already wired to your schema, co-located with your hosting on infrastructure built for single-digit ms boot times.",
    points: [
      "Unikernel microVMs on bare metal, single-digit ms boot",
      "Operation-based pricing with spend limits, no bill shock",
      "Free per-branch databases for every preview",
    ],
  },
  {
    name: "Prisma Compute",
    role: "App hosting",
    href: "/compute",
    dot: "bg-prism-red-500",
    badge: "Public Beta",
    Illustration: ComputeIllustration,
    description:
      "TypeScript app hosting on the same host as your database, so your agent can deploy, debug, and redeploy without leaving the loop.",
    points: [
      "Bun runtime on bare metal",
      "Co-located with Postgres for single-digit ms queries",
      "Versioned deploys with preview URLs, by git push or CLI",
    ],
  },
];

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-pretty text-sm font-medium leading-relaxed text-foreground/75">
      <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-foreground/40" />
      <span>{children}</span>
    </li>
  );
}

// Product role kicker — the product's color lives in a small dot, the label
// stays ink (pills are reserved for buttons). Same idiom as StackBento.
function RoleKicker({ dot, children }: { dot: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
      <span aria-hidden className={cn("size-2 rounded-full", dot)} />
      {children}
    </p>
  );
}

// The inline spectrum-ink link that closes each card — same treatment as
// StackBento's LearnMore (see stack-bento.tsx).
function LearnMore({ href, product }: { href: string; product: string }) {
  return (
    <span className="mt-auto inline-flex pt-5">
      <a
        href={href}
        className="spectrum-ink -ml-3.5 inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 has-[>svg]:px-3.5 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
      >
        Learn more
        <span className="sr-only"> about {product}</span>
        <ArrowRightBold className="size-3.5" aria-hidden />
      </a>
    </span>
  );
}

// The platform index: the three products as cards, each card a link into its
// own page. Same card type as the homepage's "The TypeScript stack, integrated
// by design" (see stack-bento.tsx) — rounded-2xl on bg-card, the product's
// animated illustration above the copy, closed by an inline "Learn more" link —
// with the illustrations in `compact` mode to suit the narrower column.
// Unwrapped: the hero above carries the wrapped panel, so this sits on the
// page's own white (see platform/page.tsx for the wrapped/unwrapped rhythm).
export function PlatformProducts() {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(2.125rem,3.5vw,3rem)] leading-[1.1]">
            Start with one, add the rest when you need them
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-5 lg:grid-cols-3">
          {PRODUCTS.map(({ Illustration, ...product }, i) => (
            <li key={product.href} className="flex">
              <Reveal
                delay={i * 0.1}
                className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-card"
              >
                <Illustration compact />
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <RoleKicker dot={product.dot}>{product.role}</RoleKicker>
                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <h3 className="text-2xl">{product.name}</h3>
                    {product.badge && (
                      <span className="flex items-center gap-1.5 rounded-md border border-prism-cyan-200 bg-prism-cyan-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-prism-cyan-800">
                        <span
                          aria-hidden
                          className="size-1.5 animate-pulse rounded-full bg-prism-cyan-400"
                        />
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    {product.points.map((point) => (
                      <Bullet key={point}>{point}</Bullet>
                    ))}
                  </ul>
                  <LearnMore href={product.href} product={product.name} />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
