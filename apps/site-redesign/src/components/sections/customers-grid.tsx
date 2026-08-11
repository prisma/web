import Link from "next/link"
import { ArrowRight } from "@/components/icons/forma"
import { CUSTOMER_STORIES } from "@/lib/customers"
import { cn } from "@/lib/utils"

// Case-study grid — the 13 production stories ported from the old site's
// /case-studies page. The lead story spans two columns on desktop; everything
// else sits in the uniform 3-up grid. Story art is full-bleed (the old site
// rendered the same assets object-cover) under a soft card wash.
export function CustomersGrid() {
  const [lead, ...rest] = CUSTOMER_STORIES

  return (
    <section className="bg-white px-4 pb-24 pt-14 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-site">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StoryCard story={lead} className="sm:col-span-2" lead />
          {rest.map((story) => (
            <StoryCard key={story.company} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StoryCard({
  story,
  className,
  lead = false,
}: {
  story: (typeof CUSTOMER_STORIES)[number]
  className?: string
  lead?: boolean
}) {
  return (
    <Link
      href={story.href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_10px_30px_rgba(21,21,21,0.08)] motion-reduce:transition-none",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-card-wash",
          lead ? "aspect-[16/7] sm:aspect-[21/8]" : "aspect-[16/9]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt=""
          loading="lazy"
          draggable={false}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
        <p className="text-sm font-semibold text-foreground/70">{story.company}</p>
        <h2
          className={cn(
            "text-balance leading-snug",
            lead ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
          )}
        >
          {story.title}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {story.excerpt}
        </p>
        <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground">
          Read the story
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  )
}
