import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaSimple } from "@/components/sections/cta-simple";

export const metadata: Metadata = {
  title: "Thanks for Requesting a Demo",
  description: "We'll be in touch shortly to schedule your personalized walkthrough.",
  robots: { index: false, follow: false },
};

export default function DemoThankYouPage() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto max-w-xl px-4">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="size-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Thanks for requesting a demo!
            </h1>
            <p className="text-lg text-muted-foreground">
              We&apos;ll be in touch shortly to schedule your personalized walkthrough.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/contact">Schedule a call</Link>
              </Button>
            </div>
            <div className="flex justify-center gap-6 pt-2">
              <Link
                href="/orm"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Explore Prisma ORM
              </Link>
              <Link
                href="/customers"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Read customer stories
              </Link>
            </div>
          </div>
        </div>
      </section>
      <CtaSimple />
    </>
  );
}
