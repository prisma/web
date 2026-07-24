import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "Everything you need to get started with your first project.",
    features: [
      "Up to 1,000 monthly active users",
      "Basic analytics dashboard",
      "5 team members",
      "Email support",
      "1 GB storage",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description:
      "Advanced features for growing teams who need more power and control.",
    features: [
      "Up to 10,000 monthly active users",
      "Advanced analytics & reports",
      "Unlimited team members",
      "Priority support",
      "25 GB storage",
      "Custom integrations",
      "API access",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description:
      "Dedicated support and infrastructure for large-scale deployments.",
    features: [
      "Unlimited monthly active users",
      "Custom analytics & BI tools",
      "Unlimited team members",
      "Dedicated account manager",
      "Unlimited storage",
      "Custom integrations",
      "API access",
      "SSO & SAML",
      "99.99% SLA",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function PricingCards() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. Upgrade or downgrade at any
            time.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative flex flex-col",
                tier.popular && "border-primary shadow-md"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Most popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                </div>

                <ul className="flex flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={tier.popular ? "default" : "outline"}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
