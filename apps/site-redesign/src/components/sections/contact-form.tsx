"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 000-0000",
    href: "tel:+15550000000",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "123 Market Street, San Francisco, CA 94105",
    href: null,
  },
]

export function ContactForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-site">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Have a question or want to see a demo? We would love to hear from
            you. Fill out the form and we will get back to you within 24 hours.
          </p>
        </div>

        {/* Split layout */}
        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          {/* Left: contact info */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-foreground">
              Contact information
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Prefer to reach out directly? Use any of the channels below and
              our team will respond promptly.
            </p>

            <ul className="mt-8 space-y-6">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {item.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Jane Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jane@company.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Inc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your project or ask us anything..."
                className="min-h-32"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Send message
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
