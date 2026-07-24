"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@relume_io/relume-ui"

const logos = [
  { name: "Acme Corp", width: "w-24" },
  { name: "Globex", width: "w-20" },
  { name: "Initech", width: "w-24" },
  { name: "Hooli", width: "w-16" },
  { name: "Massive Dynamic", width: "w-28" },
  { name: "Soylent", width: "w-20" },
  { name: "Umbrella", width: "w-24" },
  { name: "Wonka", width: "w-16" },
  { name: "Stark Industries", width: "w-28" },
  { name: "Wayne Enterprises", width: "w-28" },
]

export function LogoCarousel() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by innovative companies worldwide
        </p>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-8">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.name}
                  className="basis-1/3 pl-8 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="flex h-16 items-center justify-center">
                    <div
                      className={`${logo.width} flex h-8 items-center justify-center rounded bg-muted px-3`}
                    >
                      <span className="truncate text-xs font-medium text-muted-foreground">
                        {logo.name}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
