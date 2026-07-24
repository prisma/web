import type { Metadata } from "next"
import { Headphones, Play } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "Podcasts",
  description: "Listen to conversations with founders, engineers, and product leaders.",
}

const episodes = [
  {
    title: "Scaling from Zero to One",
    description: "How early-stage founders find product-market fit and build their first engineering teams.",
    date: "2025-02-10",
    duration: "42 min",
    episodeNumber: 8,
    audioUrl: "#",
  },
  {
    title: "The Art of Developer Experience",
    description: "Why great DX is a competitive advantage and how to measure it across your platform.",
    date: "2025-01-27",
    duration: "38 min",
    episodeNumber: 7,
    audioUrl: "#",
  },
  {
    title: "Pricing Strategies for SaaS",
    description: "Breaking down usage-based, seat-based, and hybrid pricing models with real examples.",
    date: "2025-01-13",
    duration: "51 min",
    episodeNumber: 6,
    audioUrl: "#",
  },
  {
    title: "Building in Public",
    description: "The benefits and risks of sharing your journey openly, from revenue numbers to roadmaps.",
    date: "2024-12-30",
    duration: "35 min",
    episodeNumber: 5,
    audioUrl: "#",
  },
  {
    title: "Hiring Your First Ten",
    description: "What to look for, how to structure interviews, and common mistakes founders make early on.",
    date: "2024-12-16",
    duration: "44 min",
    episodeNumber: 4,
    audioUrl: "#",
  },
  {
    title: "Infrastructure as a Product",
    description: "Lessons from teams that turned internal tools into standalone products.",
    date: "2024-12-02",
    duration: "39 min",
    episodeNumber: 3,
    audioUrl: "#",
  },
  {
    title: "Design Systems at Scale",
    description: "How growing companies maintain consistency without slowing down their shipping velocity.",
    date: "2024-11-18",
    duration: "46 min",
    episodeNumber: 2,
    audioUrl: "#",
  },
  {
    title: "Welcome to the Show",
    description: "Introducing our new podcast and what you can expect from upcoming episodes.",
    date: "2024-11-04",
    duration: "22 min",
    episodeNumber: 1,
    audioUrl: "#",
  },
]

export default function PodcastsPage() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Headphones className="size-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Podcast
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Conversations with founders, engineers, and product leaders building the future of SaaS.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {episodes.map((episode) => (
              <Card key={episode.episodeNumber} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <a
                      href={episode.audioUrl}
                      className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Play className="size-4 ml-0.5" />
                    </a>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="outline">Ep. {episode.episodeNumber}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(episode.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "UTC",
                          })}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          &middot; {episode.duration}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{episode.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {episode.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaSimple />
    </>
  )
}
