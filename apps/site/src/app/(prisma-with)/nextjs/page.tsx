import { PostCard } from "@prisma-docs/ui/components/post-card";
import { Quote } from "@prisma-docs/ui/components/quote";

import type { Metadata } from "next";
import parse from "html-react-parser";
import { prisma_highlighter } from "../../../lib/shiki_prisma";
import * as data from "../../../data/prisma-with/nextjs.json";
import { cn } from "../../../lib/cn";
import { Button, Card, Action } from "@prisma/eclipse";
import {
  CodeBlock,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@prisma/eclipse";

const code_obj: Record<string, string> = {
  "static-data": `// app/blog/[slug]/page.tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Return a list of 'params' to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await prisma.post.findMany()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Multiple versions of this page will be statically generated
// using the 'params' returned by 'generateStaticParams'
export default async function Page({ params }: { params: { slug: string } }) {
  // Fetch the post based on slug
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  // Simple demo rendering
  return (
    <div>
      <h1>{post?.title || 'Post not found'}</h1>
      <p>{post?.content || 'No content available'}</p>
    </div>
  )
}`,
};

export const metadata: Metadata = {
  title: "Next.js Database with Prisma | Next-Generation ORM for SQL Databases",
  description:
    "Prisma is a next-generation ORM for Node.js & TypeScript. It's the easiest way to build Next.js apps with MySQL, PostgreSQL & SQL Server databases.",
  alternates: {
    canonical: "https://www.prisma.io/nextjs",
  },
};

const Hero = () => {
  return (
    <div className="hero dark:bg-[linear-gradient(180deg,var(--color-foreground-ppg-weaker)_0%,var(--color-background-default)_100%)] bg-[linear-gradient(180deg,var(--color-background-ppg)_0%,var(--color-background-default)_100%)] relative before:absolute">
      <div className="max-w-300 mx-auto py-12 grid md:grid-cols-[1fr_320px] lg:grid-cols-[736px_1fr] gap-11 relative z-1">
        <div className="content flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h5 className="uppercase text-foreground-ppg-weak my-0!">
              <i className={cn("mr-2", data.hero.icon)} />
              <span className="stretch-display font-sans-display">
                {data.hero.eyebrow}
              </span>
            </h5>
            <h1 className="stretch-display text-[40px] lg:text-[60px] font-bold my-0! font-sans-display max-w-184 leading-16">
              {parse(data.hero.title)}
            </h1>
          </div>
          <p className="text-left text-foreground-neutral-weak max-w-2xl font-sans-display [font-variation-settings:'wght'_400,'wdth'_115]">
            {data.hero.description}
          </p>
          <div className="flex gap-4">
            <Button variant="ppg" size="3xl" href={data.hero.btns[0].url}>
              <span>{data.hero.btns[0].label}</span>
              {data.hero.btns[0].icon && (
                <i className={cn("ml-2", data.hero.btns[0].icon)} />
              )}
            </Button>
            <Button
              variant="default-stronger"
              size="3xl"
              href={data.hero.btns[1].url}
            >
              <span>{data.hero.btns[1].label}</span>
              {data.hero.btns[1].icon && (
                <i className={cn("ml-2", data.hero.btns[1].icon)} />
              )}
            </Button>
          </div>
        </div>
        <div className="logos relative max-h-78">
          <div className="absolute left-0 top-0 w-57 h-44 object-cover bg-background-default flex items-center justify-center p-9 border border-stroke-ppg-weak rounded-2xl">
            <img
              src={data.hero.imageUrl}
              className="w-full block dark:hidden"
              alt={`Prisma with ${data.hero.tech}`}
            />
            {data.hero.imageUrlLight && (
              <img
                src={data.hero.imageUrlLight}
                className="w-full hidden dark:block"
                alt={`Prisma with ${data.hero.tech}`}
              />
            )}
          </div>
          <div className="absolute right-0 bottom-0 w-57 h-44 object-cover bg-background-default flex items-center justify-center p-9 border border-stroke-ppg-weak rounded-2xl">
            <img
              src="/icons/technologies/prisma.svg"
              className="dark:block hidden h-full contain"
              alt="Prisma"
            />
            <img
              src="/icons/technologies/prisma_light.svg"
              className="dark:hidden h-full contain"
              alt="Prisma"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default async function SiteHome() {
  return (
    <main className="w-screen overflow-hidden">
      <Hero />
      <div className="my-12">
        <div className="p-12">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
            <h2 className="stretch-display text-4xl font-bold text-center font-sans-display">
              {data.why.title}
            </h2>
            <div className="cards grid grid-cols-3 gap-6">
              {data.why.cards.map((card) => (
                <Card
                  key={card.title}
                  className="bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]"
                >
                  <Action size="4xl" color="ppg">
                    <i className={cn("text-xl", card.icon)} />
                  </Action>
                  <h3 className="stretch-display text-xl font-bold font-sans-display">
                    {parse(card.title)}
                  </h3>
                  <p className="text-foreground-neutral-weak text-base">
                    {parse(card.description)}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="my-12">
        <div className="p-12 flex flex-col gap-12">
          <h2 className="stretch-display text-foreground-neutral text-4xl font-bold text-center font-sans-display max-w-106 mx-auto">
            {data.how.title}
          </h2>
          <p className="max-w-211 mx-auto text-foreground-neutral-weak">
            {data.how.description}
          </p>
          <div className="max-w-249 mx-auto rounded-xl w-full overflow-hidden border border-stroke-neutral">
            <Tabs defaultValue={data.how.tabs.defaultValue} className="my-0">
              <TabsList>
                {data.how.tabs.head.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    className="py-3 text-foreground-neutral-weak data-[state=active]:text-foreground-ppg data-[state=active]:border-stroke-ppg data-[state=inactive]:font-normal!"
                    value={tab.value}
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {await Promise.all(
                data.how.tabs.body.map(async (body) => {
                  return (
                    <TabsContent key={body.value} value={body.value}>
                      <div className="bg-[linear-gradient(0deg,var(--color-background-success)_0%,var(--color-background-default)_100%)] tabs-content p-4 border-t border-stroke-neutral [&>h4]:font-sans-display [&>h4]:text-foreground-neutral [&>h4]:text-xl [&>h4]:font-bold text-foreground-neutral-weak flex flex-col gap-6 pt-8">
                        {parse(body.content)}
                        <div className="py-6 px-7 bg-background-neutral-weaker border rounded-[8px] overflow-hidden border-stroke-neutral [&>figure]:my-0 [&>figure>div]:py-0 [&>figure>div]:bg-transparent">
                          {Object.keys(code_obj).includes(body.value) && (
                            <CodeBlock
                              keepBackground={true}
                              className="border-none [&_pre]:bg-transparent"
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: await prisma_highlighter.codeToHtml(
                                    code_obj[body.value],
                                    {
                                      lang: "typescript",
                                      theme: "prisma-dark",
                                    },
                                  ),
                                }}
                              />
                            </CodeBlock>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  );
                }),
              )}
            </Tabs>
          </div>
        </div>
      </div>
      <div className="my-12">
        <div className="p-12 flex flex-col gap-12 max-w-344 w-full mx-auto">
          <h2 className="stretch-display text-foreground-neutral text-4xl font-bold text-center font-sans-display mx-auto">
            {data.why_prisma.title}
          </h2>
          <div className="cards grid grid-cols-3 gap-6">
            {data.why_prisma.cards.map((card, idx: number) => (
              <div
                key={idx}
                className="border rounded-square border-stroke-neutral"
              >
                <PostCard
                  vertical
                  featured
                  post={{
                    url: card.url,
                    title: card.title,
                    date: card.date,
                    excerpt: card.description,
                    author: {
                      name: card.author.name,
                      imageSrc: card.author.avatar,
                    },
                    imageSrc: card.image,
                    imageAlt: "Post image",
                    badge: card.badge,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-12">
        <div className="p-12 flex flex-col gap-12 mx-auto w-fit">
          <Quote author={data.quote.author} className="max-w-173">
            <p>{data.quote.text}</p>
          </Quote>
        </div>
      </div>
      <div className="my-12">
        <div className="p-12 flex flex-col gap-12">
          <h2 className="stretch-display text-foreground-neutral text-4xl font-bold text-center font-sans-display mx-auto">
            {data.community.title}
          </h2>
          <div className="cards grid grid-cols-[repeat(6,1fr)] gap-6 mx-auto max-w-[1200px]">
            {data.community.cards.map((card, idx: number) => (
              <Card
                key={idx}
                className={cn(
                  "col-span-2 bg-background-neutral-weaker",
                  idx >= 3 && idx === 3 && "col-start-2",
                  idx >= 3 && idx === 4 && "col-start-4",
                )}
              >
                <div className={"flex gap-2 items-center"}>
                  <Action
                    size="4xl"
                    color="neutral"
                    className={idx === 1 ? "mt-1 self-start" : ""}
                  >
                    <i className={cn("text-xl", card.icon)} />
                  </Action>
                  <h3 className="stretch-display text-foreground-neutral text-xl font-bold font-sans-display">
                    {parse(card.title)}
                  </h3>
                </div>
                <p className="text-foreground-neutral-weak text-base">
                  {parse(card.description)}
                </p>
                <a
                  href={card.btn.url}
                  className="text-foreground-neutral text-sm font-medium underline underline-offset-2 text-foreground-ppg hover:text-foreground-ppg-strong w-fit mt-auto"
                >
                  {card.btn.label}
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
