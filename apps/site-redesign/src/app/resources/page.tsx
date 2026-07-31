import type { Metadata } from "next"
import type { ComponentType } from "react"
import {
  BookOpen,
  PlayCircle,
  FileText,
  Users,
  Code,
  Rocket,
  Shield,
  Zap,
  Video,
  Presentation,
  Layout,
  Palette,
  MessageCircle,
  Github,
  Globe,
  HelpCircle,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides, videos, templates, and community resources to help you build faster.",
}

type Resource = {
  title: string
  description: string
  link: string
  icon: ComponentType<{ className?: string }>
}

type ResourceSection = {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  items: Resource[]
}

const sections: ResourceSection[] = [
  {
    title: "Documentation",
    description: "In-depth guides and API references to get you started quickly.",
    icon: BookOpen,
    items: [
      {
        title: "Getting Started",
        description: "Set up your project, configure your environment, and deploy your first build.",
        link: "#",
        icon: Rocket,
      },
      {
        title: "API Reference",
        description: "Complete reference for REST endpoints, webhooks, and SDK methods.",
        link: "#",
        icon: Code,
      },
      {
        title: "Authentication Guide",
        description: "Implement SSO, RBAC, and multi-tenant auth with step-by-step examples.",
        link: "#",
        icon: Shield,
      },
      {
        title: "Performance Tuning",
        description: "Optimize load times, reduce bundle size, and improve Core Web Vitals.",
        link: "#",
        icon: Zap,
      },
    ],
  },
  {
    title: "Videos",
    description: "Visual walkthroughs and tutorials for every skill level.",
    icon: PlayCircle,
    items: [
      {
        title: "Quick Start Tutorial",
        description: "A 10-minute video getting you from zero to deployed.",
        link: "#",
        icon: Video,
      },
      {
        title: "Advanced Integrations",
        description: "Connect Stripe, GitHub, and Slack in under 15 minutes.",
        link: "#",
        icon: Zap,
      },
      {
        title: "Live Coding Sessions",
        description: "Watch our engineers build real features in real time.",
        link: "#",
        icon: Presentation,
      },
    ],
  },
  {
    title: "Templates",
    description: "Pre-built starting points so you never start from scratch.",
    icon: FileText,
    items: [
      {
        title: "SaaS Dashboard",
        description: "Full admin dashboard with analytics, user management, and billing.",
        link: "#",
        icon: Layout,
      },
      {
        title: "Marketing Site",
        description: "Landing pages, blog, and SEO-optimized templates ready to customize.",
        link: "#",
        icon: Palette,
      },
      {
        title: "Email Templates",
        description: "Transactional and marketing email templates that work in every client.",
        link: "#",
        icon: MessageCircle,
      },
    ],
  },
  {
    title: "Community",
    description: "Connect with other builders, get help, and share what you ship.",
    icon: Users,
    items: [
      {
        title: "Discord Server",
        description: "Join thousands of developers sharing tips, feedback, and support.",
        link: "#",
        icon: MessageCircle,
      },
      {
        title: "GitHub Discussions",
        description: "Browse feature requests, bug reports, and open-source contributions.",
        link: "#",
        icon: Github,
      },
      {
        title: "Community Showcase",
        description: "See what others have built and get inspired for your next project.",
        link: "#",
        icon: Globe,
      },
      {
        title: "FAQ & Support",
        description: "Answers to common questions and how to reach our support team.",
        link: "#",
        icon: HelpCircle,
      },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <>
      <section className="py-20">
        <div className="mx-auto max-w-site px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Resources
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, launch, and scale your product.
            </p>
          </div>

          <div className="space-y-20 max-w-site mx-auto">
            {sections.map((section) => {
              const SectionIcon = section.icon
              return (
                <div key={section.title}>
                  <div className="flex items-center gap-3 mb-2">
                    <SectionIcon className="size-6 text-primary" />
                    <h2 className="text-2xl font-semibold">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground mb-8">{section.description}</p>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon
                      return (
                        <a key={item.title} href={item.link}>
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader>
                              <ItemIcon className="size-5 text-primary mb-2" />
                              <CardTitle className="text-base">{item.title}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CtaSimple />
    </>
  )
}
