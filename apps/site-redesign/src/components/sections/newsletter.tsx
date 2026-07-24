import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function Newsletter() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Stay in the loop
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Get product updates, engineering deep dives, and growth tips delivered
          to your inbox. No spam, unsubscribe anytime.
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          action="#"
        >
          <Label htmlFor="newsletter-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@company.com"
            className="sm:max-w-xs"
            required
          />
          <Button type="submit" size="lg">
            Subscribe
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          By subscribing you agree to our{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </a>
          . We will never share your email with third parties.
        </p>
      </div>
    </section>
  )
}
