import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Page not found
      </p>
      <p className="mt-2 text-muted-foreground max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go home</Link>
      </Button>
    </section>
  )
}
