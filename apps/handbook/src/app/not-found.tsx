import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-sm text-fd-muted-foreground">404</p>
      <h1 className="text-3xl">That page is not in the handbook.</h1>
      <Link href="/" className="text-fd-primary underline underline-offset-4">
        Back to the table of contents
      </Link>
    </main>
  );
}
