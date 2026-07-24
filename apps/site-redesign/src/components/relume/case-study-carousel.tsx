"use client"

import { ArrowRight } from "lucide-react"
import {
  Badge,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@relume_io/relume-ui"

const caseStudies = [
  {
    company: "Cloverleaf",
    industry: "EdTech",
    logo: "CL",
    metric: "40%",
    metricLabel: "increase in activation",
    summary:
      "Cloverleaf rebuilt their onboarding flow with our platform and saw activation rates jump from 22% to 62% in just six weeks.",
    tags: ["Onboarding", "Analytics"],
  },
  {
    company: "Baseform",
    industry: "FinTech",
    logo: "BF",
    metric: "20 hrs",
    metricLabel: "saved per week",
    summary:
      "By automating support ticket routing and follow-ups, Baseform freed their operations team to focus on strategic initiatives.",
    tags: ["Automation", "Support"],
  },
  {
    company: "Luminary",
    industry: "HealthTech",
    logo: "LM",
    metric: "3x",
    metricLabel: "faster integrations",
    summary:
      "Luminary's product managers now connect third-party tools in minutes instead of filing engineering tickets that took weeks to resolve.",
    tags: ["Integrations", "Productivity"],
  },
  {
    company: "NovaBridge",
    industry: "E-commerce",
    logo: "NB",
    metric: "100x",
    metricLabel: "user growth handled",
    summary:
      "NovaBridge scaled from 100 to 10,000 users with zero configuration changes and no downtime during peak traffic events.",
    tags: ["Scalability", "Infrastructure"],
  },
]

export function CaseStudyCarousel() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Customer stories
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                See how teams across industries use our platform to ship faster
                and grow smarter.
              </p>
            </div>
            <div className="flex gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>

          <CarouselContent className="-ml-6">
            {caseStudies.map((cs) => (
              <CarouselItem
                key={cs.company}
                className="pl-6 md:basis-1/2"
              >
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                      {cs.logo}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {cs.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cs.industry}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-4xl font-bold tracking-tight text-foreground">
                      {cs.metric}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {cs.metricLabel}
                    </p>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {cs.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {cs.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="link"
                      size="link"
                      iconRight={<ArrowRight className="size-3.5" />}
                    >
                      Read case study
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
