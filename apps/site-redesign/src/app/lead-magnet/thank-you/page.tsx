import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CtaSimple } from "@/components/sections/cta-simple"

export const metadata: Metadata = {
  title: "Your Download Is Ready",
  description: "Download your free copy of The 2025 SaaS Growth Playbook.",
  robots: { index: false, follow: false },
}

export default function LeadMagnetThankYouPage() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto max-w-xl px-4">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="size-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your download is ready!
            </h1>
            <p className="text-lg text-muted-foreground">
              Click below to download your copy. We also sent a copy to your
              email.
            </p>
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="gap-2 rounded-full px-8">
                <Link href="/downloads/saas-growth-playbook.pdf">
                  <Download className="size-4" />
                  Download Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CtaSimple />
    </>
  )
}
