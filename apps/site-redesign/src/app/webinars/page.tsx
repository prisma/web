import type { Metadata } from "next"
import { Video } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "Webinars",
  description: "Live and recorded sessions on building, scaling, and shipping SaaS products.",
}

type Webinar = {
  title: string
  description: string
  date: string
  speaker: string
  status: "upcoming" | "past"
}

const webinars: Webinar[] = [
  {
    title: "From Idea to Launch in 30 Days",
    description: "A step-by-step walkthrough of taking a SaaS concept from napkin sketch to paying customers.",
    date: "2025-03-20",
    speaker: "Sarah Chen, CEO",
    status: "upcoming",
  },
  {
    title: "Advanced Authentication Patterns",
    description: "Deep dive into SSO, RBAC, and multi-tenant auth strategies for B2B SaaS applications.",
    date: "2025-03-06",
    speaker: "Marcus Rivera, Lead Engineer",
    status: "upcoming",
  },
  {
    title: "Mastering Stripe Billing",
    description: "Trials, upgrades, downgrades, and dunning flows that maximize revenue retention.",
    date: "2025-02-27",
    speaker: "Emily Tran, Product Lead",
    status: "upcoming",
  },
  {
    title: "Performance Optimization Workshop",
    description: "Practical techniques for reducing bundle size, improving Core Web Vitals, and shipping fast pages.",
    date: "2025-02-01",
    speaker: "Alex Kim, Staff Engineer",
    status: "past",
  },
  {
    title: "Building a Design System from Scratch",
    description: "How to create reusable components, establish tokens, and ship a consistent UI across your product.",
    date: "2025-01-15",
    speaker: "Jordan Blake, Design Lead",
    status: "past",
  },
  {
    title: "SEO for SaaS Startups",
    description: "Content strategy, technical SEO, and programmatic pages that drive organic signups.",
    date: "2024-12-18",
    speaker: "Nina Patel, Growth Lead",
    status: "past",
  },
  {
    title: "Shipping Your First Integration",
    description: "Webhooks, OAuth, and API design patterns for a great third-party developer experience.",
    date: "2024-12-04",
    speaker: "Marcus Rivera, Lead Engineer",
    status: "past",
  },
]

export default function WebinarsPage() {
  const upcoming = webinars.filter((w) => w.status === "upcoming")
  const past = webinars.filter((w) => w.status === "past")

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Video className="size-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Webinars
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Live and recorded sessions on building, scaling, and shipping SaaS products.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Upcoming</h2>
            <div className="space-y-4 mb-16">
              {upcoming.map((webinar) => (
                <Card key={webinar.title}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge>Live</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(webinar.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{webinar.title}</CardTitle>
                    <CardDescription>{webinar.description}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">
                      {webinar.speaker}
                    </p>
                    <div className="mt-4">
                      <Button size="sm">Register</Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-6">Past Webinars</h2>
            <div className="space-y-4">
              {past.map((webinar) => (
                <Card key={webinar.title}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="secondary">Recording</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(webinar.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{webinar.title}</CardTitle>
                    <CardDescription>{webinar.description}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">
                      {webinar.speaker}
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Watch recording
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaSimple />
    </>
  )
}
