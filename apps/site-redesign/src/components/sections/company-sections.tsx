import { ArrowRight } from "@/components/icons/forma"
import { RoleKicker } from "@/components/brand/role-kicker"
import { Texture } from "@/components/brand/texture"
import {
  CARE_ABOUT,
  COMPANY_PILLARS,
  INVESTOR_FIRMS,
  INVESTOR_PEOPLE,
  PRESS_LINKS,
  TEAM_PHOTOS,
} from "@/lib/company"

// Company page sections, ported from the old site's /about page and rebuilt
// in the redesign language: wrapped-panel hero, quiet paper surfaces, ink
// typography, color reserved for the kicker dots and accent details.

export function CompanyHero() {
  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[14rem] overflow-hidden"
        >
          <div
            className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
            style={{
              background: [
                "radial-gradient(46% 60% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 18%, transparent), transparent 70%)",
                "radial-gradient(40% 52% at 56% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 14%, transparent), transparent 68%)",
                "radial-gradient(38% 46% at 78% 100%, color-mix(in srgb, var(--color-prism-red-400) 15%, transparent), transparent 70%)",
              ].join(","),
            }}
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-transparent to-white" />
        </div>
        <Texture opacity={0.06} blend="multiply" />

        <div className="relative px-4 sm:px-8">
          <div className="mx-auto max-w-site pb-16 pt-32 md:pb-20 md:pt-44">
            <div className="flex flex-col items-center text-center">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Company
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[18ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                We make working with databases easy
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Our mission is to make working with databases easy, with a great developer
                experience at the core of every product we build.
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {COMPANY_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white/80 p-6 text-left backdrop-blur-sm sm:p-7"
                >
                  <h2 className="text-lg leading-snug">{pillar.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                  {pillar.href && (
                    <a
                      href={pillar.href}
                      className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
                    >
                      Read more
                      <ArrowRight className="size-4" aria-hidden />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Shared with /company/careers. A grid rather than a bleed strip: every
// photo shows in full at any viewport (the strip clipped whatever fell past
// the right edge), and it keeps well under the old masonry's height.
export function TeamPhotos() {
  return (
    <section className="bg-white px-4 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-site grid-cols-2 gap-4 lg:grid-cols-3">
        {TEAM_PHOTOS.map((photo) => (
          <div
            key={photo.src}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.06]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export function CompanyInvestors() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          Our investors
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {INVESTOR_FIRMS.map((firm) => (
            <a
              key={firm.name}
              href={firm.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={firm.logo}
                alt={firm.name}
                loading="lazy"
                className="h-7 w-auto invert"
              />
            </a>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-black/[0.07] pt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {INVESTOR_PEOPLE.map((person) => (
            <div key={person.name} className="flex items-center gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={person.image}
                alt=""
                loading="lazy"
                className="size-11 shrink-0 rounded-full object-cover ring-1 ring-black/[0.08]"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{person.name}</p>
                <p className="truncate text-sm text-muted-foreground">{person.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-black/[0.07] pt-10">
          {PRESS_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
            >
              {link.label}
              <ArrowRight className="size-4 -rotate-45" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CompanyCares() {
  return (
    <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          What we care about
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CARE_ABOUT.map((item, i) => (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-card-wash p-7 sm:p-9"
            >
              <span
                aria-hidden
                className={
                  "absolute left-0 top-0 h-1 w-full " +
                  (i === 0 ? "bg-prism-cyan-400/70" : "bg-prism-yellow-300")
                }
              />
              <h3 className="text-xl leading-snug">{item.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
