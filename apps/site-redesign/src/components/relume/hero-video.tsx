"use client"

import { ArrowRight, Play } from "lucide-react"
import {
  Button,
  VideoIframe,
} from "@relume_io/relume-ui"

export function HeroVideo() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            See it in action
          </span>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The fastest way to build your SaaS product
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Watch how teams go from idea to production in minutes, not months.
            Our platform handles the infrastructure so you can focus on what
            matters.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button variant="primary" size="primary" iconRight={<ArrowRight className="size-4" />}>
              Start free trial
            </Button>
            <Button variant="secondary" size="primary" iconLeft={<Play className="size-4" />}>
              Watch demo
            </Button>
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-border/50 shadow-xl lg:mt-20">
          <VideoIframe video="https://www.youtube.com/embed/dQw4w9WgXcQ" />
        </div>
      </div>
    </section>
  )
}
