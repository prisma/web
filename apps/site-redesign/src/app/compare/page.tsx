import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CtaSimple } from "@/components/sections/cta-simple"
import { getAllContent } from "@/lib/content"
import { siteConfig } from "@/lib/config"

type CompareFrontmatter = {
  title: string
  description: string
  competitor: string
}

export const metadata: Metadata = {
  title: "Compare",
  description: `See how ${siteConfig.name} compares to the alternatives.`,
}

export default function ComparePage() {
  const comparisons = getAllContent<CompareFrontmatter>("compare")

  return (
    <>
      <section className="py-20">
        <div className="mx-auto max-w-site px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              How We Compare
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Not all starter kits are created equal. See how {siteConfig.name}{" "}
              stacks up against the competition across the features that matter
              most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-site mx-auto">
            {comparisons.map((item) => (
              <Link key={item.slug} href={`/compare/${item.slug}`}>
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
