"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={reset} className="mt-8">
            Try again
          </Button>
        </section>
      </body>
    </html>
  )
}
