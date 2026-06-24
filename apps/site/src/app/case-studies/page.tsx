import { createPageMetadata } from "@/lib/page-metadata";
import { createCollectionPageStructuredData } from "@/lib/structured-data";
import { Button } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import data from "@/data/showcase";
import { PostCard } from "@/components/showcase/post-card";

const CASE_STUDIES_TITLE = "Prisma Case Studies | Customer stories in production";
const CASE_STUDIES_DESCRIPTION =
  "See how teams use Prisma ORM, Prisma Postgres, and Prisma Accelerate in production to ship faster, scale reliably, and improve developer workflows.";

export const metadata = createPageMetadata({
  title: CASE_STUDIES_TITLE,
  description: CASE_STUDIES_DESCRIPTION,
  path: "/case-studies",
  ogImage: "/og/og-showcase.png",
});

const caseStudiesStructuredData = createCollectionPageStructuredData({
  path: "/case-studies",
  name: "Prisma Case Studies",
  description: CASE_STUDIES_DESCRIPTION,
  items: data.stories.map((story) => ({
    name: story.title,
    url: story.url,
    description: story.excerpt,
  })),
});

export default function CaseStudiesPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-background-default text-foreground-neutral">
      <JsonLd id="case-studies-structured-data" data={caseStudiesStructuredData} />
      <section className="px-4 pt-36 pb-12 md:pb-16">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 text-center">
          <p className="flex items-center gap-2 text-base font-semibold uppercase tracking-[1.6px] text-foreground-orm font-sans">
            <i className="fa-regular fa-book-open" aria-hidden />
            Customer Stories
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
            Prisma Case Studies
          </h1>
          <p className="text-lg text-foreground-neutral-weak max-w-[640px]">
            Learn how teams use Prisma in production to speed up delivery, simplify database
            workflows, and scale without slowing down engineering.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="orm" size="2xl">
              <a href="/enterprise">
                Talk to the Prisma team
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
            <Button asChild variant="default-strong" size="2xl">
              <a href="/showcase">
                Explore more community stories
                <i className="fa-regular fa-arrow-right" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:pb-24">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[700px]">
              <h2 className="mb-0 mt-0 text-3xl font-black! font-sans-display text-foreground-neutral">
                Production stories from the Prisma ecosystem
              </h2>
              <p className="mb-0 mt-3 text-base text-foreground-neutral-weak">
                These teams span B2B SaaS, developer tooling, AI products, and high-scale platforms.
                Each story shows how Prisma helps teams move faster with less database friction.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.stories.map((story, index) => (
              <PostCard
                key={story.title}
                post={story}
                featured={index === 0}
                className={index === 0 ? "xl:col-span-2" : undefined}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
