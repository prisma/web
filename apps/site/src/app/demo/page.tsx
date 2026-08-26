import type { Metadata } from "next";
import { DemoForm } from "./demo-form";

export const metadata: Metadata = {
  alternates: { canonical: "/demo" },
  title: "Request a Demo",
  description: "See how we can help your team ship faster. Book a personalized walkthrough.",
};

export default function DemoPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Request a Demo</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            See how we can help your team ship faster.
          </p>
        </div>

        <DemoForm />
      </div>
    </section>
  );
}
