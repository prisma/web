import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact-hero";
import { ContactSupport } from "@/components/sections/contact-support";
import { CtaBurst } from "@/components/sections/cta-burst";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us what you're working on and we'll route your message to the right person.",
};

// Built from the approved contact copy, verbatim. Three sections: the wrapped
// hero panel carrying the form, the three support channels, and the site's
// closing CTA — CtaBurst is fully parameterised, so the closer is copy only.
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSupport />
      <CtaBurst
        headline="Don't need to talk to anyone?"
        headlineMaxWidth="max-w-[24ch]"
        body="Prisma is free to start, no credit card required."
        bodyMaxWidth="max-w-[44ch]"
        checks={[
          {
            label: "Create a database and start building in minutes",
            color: "text-prism-cyan-500",
          },
          {
            label: "Read the docs for guides and API reference",
            color: "text-prism-yellow-400",
          },
          { label: "Trusted by 500K+ developers globally", color: "text-prism-red-500" },
        ]}
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io/sign-up" }}
        secondaryCta={{ label: "Read the docs", href: "/docs" }}
      />
    </>
  );
}
