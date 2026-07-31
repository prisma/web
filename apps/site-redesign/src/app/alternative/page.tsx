import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getAllContent } from "@/lib/content"

type AlternativeFrontmatter = {
  title: string
  description: string
  competitor: string
  reasons: string[]
}

export const metadata: Metadata = {
  title: "Alternatives",
  description: "Explore alternatives to popular tools and see how we compare.",
}

export default function AlternativesPage() {
  const alternatives = getAllContent<AlternativeFrontmatter>("alternatives")

  return (
    <>
      <section className="py-20">
        <div className="mx-auto max-w-site px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Explore Alternatives
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Looking for a better solution? See how we stack up against the
              competition and why teams are making the switch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {alternatives.map((alt) => (
              <Link key={alt.slug} href={`/alternative/${alt.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {alt.frontmatter.competitor}
                    </CardTitle>
                    <CardDescription>
                      {alt.frontmatter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">
                      {alt.frontmatter.reasons.length} reasons to switch
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                      Learn more
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
