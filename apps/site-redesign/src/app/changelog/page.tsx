import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Changelog",
  description: "See what's new and improved.",
}

const entries = [
  {
    date: "2025-02-01",
    version: "1.2.0",
    title: "Dark Mode & Blog",
    changes: [
      "Added dark mode with system preference detection",
      "Launched MDX-powered blog",
      "Added sitemap and robots.txt for SEO",
      "New privacy policy and terms of service pages",
    ],
  },
  {
    date: "2025-01-15",
    version: "1.1.0",
    title: "Component Library",
    changes: [
      "Added 24 reusable section components",
      "Built component showcase page",
      "Improved responsive design across all sections",
      "Added integration logos section",
    ],
  },
  {
    date: "2025-01-01",
    version: "1.0.0",
    title: "Initial Release",
    changes: [
      "Core SaaS starter with Next.js 16 and Tailwind CSS",
      "Landing page with hero, features, and pricing sections",
      "Authentication pages (login, signup)",
      "Contact page with form",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Changelog
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            See what&apos;s new and improved.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {entries.map((entry) => (
              <div key={entry.version} className="relative pl-12 md:pl-0">
                <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1.5" />

                <div className="md:ml-[calc(50%+2rem)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{entry.version}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold">{entry.title}</h2>
                  <ul className="mt-3 space-y-1.5">
                    {entry.changes.map((change) => (
                      <li
                        key={change}
                        className="text-muted-foreground text-sm flex gap-2"
                      >
                        <span className="text-primary mt-0.5">-</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
