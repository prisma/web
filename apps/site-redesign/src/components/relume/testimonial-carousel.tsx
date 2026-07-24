"use client"

import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui"

const testimonials = [
  {
    quote:
      "We switched our entire onboarding pipeline and saw a 40% increase in activation within the first month. The analytics alone paid for the subscription.",
    name: "Priya Sharma",
    initials: "PS",
    title: "VP of Growth",
    company: "Cloverleaf",
    rating: 5,
  },
  {
    quote:
      "The automation workflows saved our support team 20 hours per week. What used to require three tools now lives in one dashboard.",
    name: "Marcus Chen",
    initials: "MC",
    title: "Head of Operations",
    company: "Baseform",
    rating: 5,
  },
  {
    quote:
      "Setting up integrations used to take our dev team weeks. Now our product managers can connect tools themselves in minutes.",
    name: "Elena Rodriguez",
    initials: "ER",
    title: "CTO",
    company: "Luminary",
    rating: 5,
  },
  {
    quote:
      "Finally a platform that scales with us. We went from 100 to 10,000 users without changing a single line of configuration.",
    name: "James Okoro",
    initials: "JO",
    title: "Founder & CEO",
    company: "NovaBridge",
    rating: 5,
  },
  {
    quote:
      "The team collaboration features are best-in-class. Threaded comments and role-based access made our security review a breeze.",
    name: "Sophie Leclerc",
    initials: "SL",
    title: "Engineering Lead",
    company: "Meridian",
    rating: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-4 fill-primary text-primary" />
      ))}
    </div>
  )
}

export function TestimonialCarousel() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Loved by teams everywhere
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Hear from the people who use our platform every day to build,
            launch, and grow.
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {testimonials.map((t) => (
              <CarouselItem
                key={t.name}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
                  <StarRating count={t.rating} />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                      {t.initials}
                    </div>
                    <div>
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
