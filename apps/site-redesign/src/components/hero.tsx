import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6">
            Announcing our latest feature &rarr;
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Headline that describes your product&apos;s value
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            A supporting paragraph that explains what the product does, who it&apos;s for,
            and why they should care. Keep it to 1-2 sentences.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">See How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
