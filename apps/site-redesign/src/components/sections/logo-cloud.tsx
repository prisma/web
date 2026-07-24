import { Reveal } from "@/components/motion/reveal"

type Logo = {
  name: string
  /** File in /public/logos. Omit to render a text wordmark fallback. */
  src?: string
  /** Where the tile links out to. */
  href: string
  /** Visual size correction so every mark reads at the same optical weight:
      "sm" reins in dense/wide marks, "lg" boosts small-drawn icons. */
  fit?: "sm" | "lg"
}

// Logos pulled from the "Prisma ORM" section on prisma.io, in the same order.
// Next.js and Vercel use icon-only marks so they sit square in the tiles.
const logos: Logo[] = [
  { name: "Cloudflare D1", src: "/logos/cloudflare-d1.svg", href: "https://developers.cloudflare.com/d1/" },
  { name: "Cloudflare", src: "/logos/cloudflare-icon-only.svg", href: "https://www.cloudflare.com", fit: "sm" },
  { name: "Astro", src: "/logos/astro.svg", href: "https://astro.build" },
  { name: "Better Auth", href: "https://www.better-auth.com" },
  { name: "Bun", src: "/logos/bun.svg", href: "https://bun.sh" },
  { name: "Clerk", src: "/logos/clerk.jpeg", href: "https://clerk.com" },
  { name: "Datadog", src: "/logos/datadog.svg", href: "https://www.datadoghq.com" },
  { name: "Docker", src: "/logos/docker-blue.svg", href: "https://www.docker.com", fit: "sm" },
  { name: "Deno", src: "/logos/deno-deploy.svg", href: "https://deno.com/deploy" },
  { name: "Vercel", src: "/logos/vercel-icon.svg", href: "https://vercel.com" },
  { name: "Next.js", src: "/logos/nextjs-icon.svg", href: "https://nextjs.org" },
  { name: "Hono", src: "/logos/hono.svg", href: "https://hono.dev" },
  { name: "GitHub", src: "/logos/github.svg", href: "https://github.com" },
  { name: "Railway", src: "/logos/railway.svg", href: "https://railway.com" },
  { name: "React Router", src: "/logos/rr7.svg", href: "https://reactrouter.com" },
  { name: "Solid Start", src: "/logos/solid-start.svg", href: "https://start.solidjs.com", fit: "lg" },
  { name: "SvelteKit", src: "/logos/svelte.svg", href: "https://svelte.dev", fit: "lg" },
  { name: "TanStack", src: "/logos/tanstack.svg", href: "https://tanstack.com" },
  { name: "Turborepo", src: "/logos/turborepo-icon-only.svg", href: "https://turborepo.com" },
  { name: "Nuxt", src: "/logos/nuxt.svg", href: "https://nuxt.com" },
  { name: "Shopify", src: "/logos/shopify.svg", href: "https://www.shopify.com", fit: "sm" },
]

const FIT_CLASS = {
  sm: "max-h-8 w-auto max-w-[3.25rem] object-contain",
  md: "max-h-10 w-auto max-w-12 object-contain",
  lg: "max-h-12 w-auto max-w-14 object-contain",
}

function LogoTile({ logo }: { logo: Logo }) {
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={logo.name}
      className="spectrum-border flex size-24 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4 transition-[transform,border-color] duration-500 ease-out hover:scale-[0.97] hover:border-transparent motion-reduce:hover:scale-100"
    >
      {logo.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.src}
          alt={logo.name}
          className={FIT_CLASS[logo.fit ?? "md"]}
          loading="lazy"
          draggable={false}
        />
      ) : (
        <span className="select-none text-center text-[0.7rem] font-semibold leading-tight tracking-tight text-foreground">
          {logo.name}
        </span>
      )}
    </a>
  )
}

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-x-5 pr-5"
      aria-hidden={hidden || undefined}
    >
      {logos.map((logo) => (
        <LogoTile key={logo.name} logo={logo} />
      ))}
    </div>
  )
}

export function LogoCloud() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by leading companies
          </p>
        </Reveal>

        <Reveal delay={0.1} className="group relative mt-10 overflow-hidden motion-reduce:overflow-x-auto">
          {/* Edge fades so tiles dissolve rather than clip at the margins */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <div className="flex w-max animate-logo-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            <Track />
            <Track hidden />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
