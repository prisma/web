import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getAllContent } from "@/lib/content"

type AlternativesListicleFrontmatter = {
  title: string
  description: string
  competitor: string
  alternatives: { name: string; description: string; pros: string[]; cons: string[] }[]
}

export const metadata: Metadata = {
  title: "Top Alternatives",
  description: "Explore the best alternatives to popular tools and find the right fit for your SaaS.",
}

export default function AlternativesListiclePage() {
  const listicles = getAllContent<AlternativesListicleFrontmatter>("alternatives-listicle")

  return (
    <>
      <section className="py-20">
        <div className="mx-auto max-w-site px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Top Alternatives
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Evaluating your options? Browse our curated lists of the best
              alternatives to popular tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {listicles.map((item) => (
              <Link key={item.slug} href={`/alternatives/${item.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {item.frontmatter.competitor}
                    </CardTitle>
                    <CardDescription>
                      {item.frontmatter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">
                      {item.frontmatter.alternatives.length} alternatives
                      listed
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                      View alternatives
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardFooter>
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
