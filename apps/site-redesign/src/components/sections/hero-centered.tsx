import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function HeroCentered() {
  return (
    <section className="px-6 pt-24 pb-16 lg:px-8 lg:pt-32 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 px-3 py-1 text-sm">
            Now in public beta
          </Badge>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Ship your SaaS faster than you ever thought possible
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Stop rebuilding the same features from scratch. Get authentication,
            billing, dashboards, and more out of the box so you can focus on what
            makes your product unique.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 rounded-full px-8">
              Get started free
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              See how it works
            </Button>
          </div>
        </div>

        {/* Screenshot placeholder */}
        <div className="mt-16 lg:mt-20">
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-2 shadow-xl">
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-muted lg:h-[560px]">
              <p className="text-sm text-muted-foreground">
                Product screenshot
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
