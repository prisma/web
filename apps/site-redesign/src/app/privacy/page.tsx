import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Privacy Policy",
}

export default function PrivacyPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: January 1, 2025
        </p>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {siteConfig.name} collects information you provide directly, such
              as when you create an account, make a purchase, or contact us. This
              may include your name, email address, billing information, and any
              other information you choose to provide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve
              our services, process transactions, send you technical notices and
              support messages, and respond to your comments and questions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Data Sharing</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share your
              information with third-party service providers who perform services
              on our behalf, such as payment processing, data analysis, email
              delivery, hosting, and customer service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Cookies</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to collect and
              track information about your activity on our service. You can
              instruct your browser to refuse all cookies or to indicate when a
              cookie is being sent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Your Rights</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your personal
              information at any time. You may also opt out of receiving
              promotional communications from us by following the instructions in
              those messages.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact
              us at privacy@example.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
