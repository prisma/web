import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getAllContent } from "@/lib/content"

type CaseStudyFrontmatter = {
  title: string
  description: string
  company: string
  industry: string
  metric: string
  metricLabel: string
}

export const metadata: Metadata = {
  title: "Case Studies",
  description: "See how companies use our platform to drive real results.",
}

export default function CaseStudiesPage() {
  const caseStudies = getAllContent<CaseStudyFrontmatter>("case-studies")

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Case Studies
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              See how leading companies use our platform to ship faster,
              convert more, and reduce churn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {caseStudies.map((study) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {study.frontmatter.industry}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {study.frontmatter.company}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-primary">
                      {study.frontmatter.metric}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {study.frontmatter.metricLabel}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {study.frontmatter.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-primary">
                      Read case study &rarr;
                    </p>
                  </CardContent>
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
