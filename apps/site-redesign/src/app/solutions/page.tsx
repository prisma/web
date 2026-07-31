import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getAllContent } from "@/lib/content"

type SolutionFrontmatter = {
  title: string
  description: string
  persona: string
  painPoints: string[]
  benefits: string[]
}

export const metadata: Metadata = {
  title: "Solutions",
  description: "Purpose-built solutions for startups, enterprises, and marketing teams.",
}

export default function SolutionsPage() {
  const solutions = getAllContent<SolutionFrontmatter>("solutions")

  return (
    <>
      <section className="py-20">
        <div className="mx-auto max-w-site px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Solutions for Every Team
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re a two-person startup or a global enterprise, we have
              the tools and infrastructure to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-site mx-auto">
            {solutions.map((solution) => (
              <Link key={solution.slug} href={`/solutions/${solution.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="mb-2">
                      <Badge variant="secondary">
                        {solution.frontmatter.persona}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {solution.frontmatter.title}
                    </CardTitle>
                    <CardDescription>
                      {solution.frontmatter.description}
                    </CardDescription>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
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
