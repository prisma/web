"use client"

import { ArrowRight } from "lucide-react"
import { Button, Countdown } from "@relume_io/relume-ui"

const launchDate = new Date()
launchDate.setDate(launchDate.getDate() + 30)
const LAUNCH_ISO = launchDate.toISOString()

export function CountdownCta() {
  return (
    <section className="bg-muted/50 px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Coming soon
          </span>

          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Version 3.0 launches in
          </h2>

          <div className="mt-10">
            <Countdown
              countdownIsoDate={LAUNCH_ISO}
              className="flex gap-4 text-foreground"
              cellClassName="flex flex-col items-center rounded-xl border border-border bg-card px-5 py-4 shadow-sm min-w-[80px]"
              dividerClassName="text-2xl font-bold text-muted-foreground self-center"
            />
          </div>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Be the first to access AI-powered workflows, a redesigned dashboard,
            and 50+ new integrations. Early access members get 30% off for life.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button variant="primary" size="primary" iconRight={<ArrowRight className="size-4" />}>
              Join the waitlist
            </Button>
            <Button variant="secondary" size="primary">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
