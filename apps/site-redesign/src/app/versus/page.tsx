import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getAllContent } from "@/lib/content"
import { siteConfig } from "@/lib/config"

type VersusFrontmatter = {
  title: string
  description: string
  competitorA: string
  competitorB: string
}

export const metadata: Metadata = {
  title: "Head-to-Head Comparisons",
  description: `See how popular tools compare head-to-head — and discover why ${siteConfig.name} is the better choice.`,
}

export default function VersusPage() {
  const comparisons = getAllContent<VersusFrontmatter>("versus")

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Head-to-Head Comparisons
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              See how popular tools stack up against each other — and why teams
              end up choosing {siteConfig.name} instead.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {comparisons.map((item) => (
              <Link key={item.slug} href={`/versus/${item.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {item.frontmatter.title}
                    </CardTitle>
                    <CardDescription>
                      {item.frontmatter.description}
                    </CardDescription>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2">
                      See comparison <ArrowRight className="size-4" />
                    </span>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSimple />
    </>
  )
}
