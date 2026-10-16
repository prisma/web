import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAnswerPages } from "@/lib/answer-pages";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Prisma Postgres guides",
  description:
    "Practical answers to choosing, hosting and running Postgres for your TypeScript app.",
  path: "/postgres/guides",
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

/** List the Postgres guide collection so new articles have an index linked from the footer. */
export default function PostgresGuidesPage() {
  return (
    <section className="mx-auto max-w-site px-6 pb-24 pt-36 sm:px-8 sm:pt-44">
      <Link href="/postgres" className="text-sm text-muted-foreground hover:text-foreground">
        Prisma Postgres
      </Link>
      <h1 className="mt-6 font-heading text-4xl font-medium tracking-tight sm:text-5xl">
        Prisma Postgres guides
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Practical answers to choosing, hosting and running Postgres for your TypeScript app.
      </p>
      <ul className="mt-14 max-w-4xl divide-y divide-border border-y border-border">
        {getAnswerPages("postgres").map((page) => (
          <li key={page.url}>
            <Link href={page.url} className="group flex items-start justify-between gap-6 py-8">
              <div>
                <h2 className="text-balance font-heading text-xl font-medium group-hover:text-prism-cyan-700 sm:text-2xl">
                  {page.data.title}
                </h2>
                <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                  {page.data.description}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">{page.data.readingTime}</p>
              </div>
              <ArrowRight
                className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
