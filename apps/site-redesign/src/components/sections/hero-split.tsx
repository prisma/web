import { ArrowRight, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function HeroSplit() {
  return (
    <section className="px-6 pt-24 pb-16 lg:px-8 lg:pt-32 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex flex-col">
            <Badge variant="secondary" className="mb-6 w-fit px-3 py-1 text-sm">
              Launching soon
            </Badge>

            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The smarter way to grow your business
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Automate your workflows, understand your customers, and scale your
              revenue with a platform built for modern SaaS teams. No more
              duct-taping tools together.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 rounded-full px-8">
                Start your free trial
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full px-8"
              >
                <Play className="size-4" />
                Watch the demo
              </Button>
            </div>
          </div>

          {/* Right: Product image placeholder */}
          <div className="relative">
            <div className="rounded-2xl border border-border/50 bg-muted/30 p-2 shadow-xl">
              <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-muted lg:h-[480px]">
                <p className="text-sm text-muted-foreground">
                  Product screenshot
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
