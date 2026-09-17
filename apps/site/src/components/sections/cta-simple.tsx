import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSimple() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-site">
        <div className="rounded-2xl bg-muted px-6 py-16 sm:px-12 lg:px-16">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ready to start building?
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Join thousands of founders who ship faster with a proven foundation. No setup
              headaches, no wasted weekends.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 rounded-full px-8">
                Get started free
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full px-8">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
