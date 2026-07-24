"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  VideoIframe,
} from "@relume_io/relume-ui"

const testimonials = [
  {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    name: "Sarah Kim",
    title: "VP of Engineering",
    company: "Streamline",
    quote:
      "We cut our deployment cycle from two weeks to two hours. The automation tools are a game-changer for our engineering velocity.",
  },
  {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    name: "David Okafor",
    title: "Head of Product",
    company: "Atlas",
    quote:
      "The analytics dashboard gives me everything I need in one place. I used to juggle three different tools — now it's just this.",
  },
  {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    name: "Maria Gonzalez",
    title: "CTO",
    company: "Helix",
    quote:
      "Integration was seamless. Our team was up and running in less than a day, and the support team was incredibly responsive.",
  },
]

export function VideoTestimonial() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Hear it from our customers
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Real stories from the teams building with our platform every day.
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-6">
            {testimonials.map((t) => (
              <CarouselItem
                key={t.name}
                className="pl-6 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
                  <div className="aspect-video w-full">
                    <VideoIframe video={t.video} />
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground">
                        {t.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t.title}, {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
