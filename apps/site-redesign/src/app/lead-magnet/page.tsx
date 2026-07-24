import type { Metadata } from "next"
import { CheckCircle } from "lucide-react"
import { LeadMagnetForm } from "./lead-magnet-form"

export const metadata: Metadata = {
  title: "The 2025 SaaS Growth Playbook",
  description: "Download the free playbook with proven strategies to grow your SaaS from $0 to $10K MRR.",
}

export default function LeadMagnetPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The 2025 SaaS Growth Playbook
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Proven strategies to grow your SaaS from $0 to $10K MRR — without
              burning through your runway.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "5 acquisition channels that actually work",
                "The pricing framework used by top SaaS companies",
                "How to reduce churn by 30% in 90 days",
                "Templates for onboarding emails that convert",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted-foreground">
              Join 5,000+ subscribers who get our best insights.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-center">
              Get your free copy
            </h2>
            <LeadMagnetForm />
          </div>
        </div>
      </div>
    </section>
  )
}
