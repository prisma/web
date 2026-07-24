import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Terms of Service",
}

export default function TermsPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: January 1, 2025
        </p>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              By accessing or using {siteConfig.name}, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, do not
              use our service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Description of Service</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {siteConfig.name} provides a software-as-a-service platform as
              described on our website. We reserve the right to modify, suspend,
              or discontinue any part of the service at any time.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">User Accounts</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must notify us immediately of any unauthorized use.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Acceptable Use</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You agree not to use the service for any unlawful purpose or in any
              way that could damage, disable, or impair the service. You may not
              attempt to gain unauthorized access to any part of the service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The service and its original content, features, and functionality
              are owned by {siteConfig.name} and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              In no event shall {siteConfig.name} be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting
              from your use of or inability to use the service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Termination</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and access to the service
              immediately, without prior notice, for conduct that we determine
              violates these terms or is harmful to other users or us.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Governing Law</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which {siteConfig.name} operates,
              without regard to conflict of law provisions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us at legal@example.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
