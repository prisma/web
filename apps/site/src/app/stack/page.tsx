import { createPageMetadata } from "@/lib/page-metadata";
import { prisma_highlighter } from "@/lib/shiki_prisma";
import { Action, Button, Card, CodeBlock } from "@prisma/eclipse";
import type { ReactNode } from "react";
import { FrameworkCarousel } from "./framework-carousel";
import { PrismaMark } from "./prisma-mark";
import { Reveal } from "./reveal";
import { StackDiagram } from "./stack-diagram";
import { bunApis, postgresExtensions } from "./stack-data";
import styles from "./stack.module.css";

const title = "Prisma Stack: a complete and flexible tech stack";
const description =
  "Prisma Compute, Prisma Postgres, Bun, TypeScript with room for your frontend framework.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/stack",
  ogImage: "/og/og-stack.png",
});

const ORM_CODE = `const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true }, // fully typed
})`;

const EXT_CODE = `-- semantic search, no extra service
CREATE EXTENSION vector;

SELECT id, content
FROM docs
ORDER BY embedding <-> $query
LIMIT 5;`;

async function Code({ code, lang }: { code: string; lang: "typescript" | "sql" }) {
  const html = await (await prisma_highlighter()).codeToHtml(code, { lang, theme: "prisma-dark" });
  return (
    <div className="mt-6 overflow-hidden rounded-[8px] border border-stroke-neutral bg-background-neutral-weaker px-5 py-4 [&>figure]:my-0 [&>figure>div]:bg-transparent [&>figure>div]:py-0">
      <CodeBlock keepBackground className="border-none [&_pre]:bg-transparent">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </CodeBlock>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      {eyebrow ? <span className="type-title-sm text-foreground-ppg">{eyebrow}</span> : null}
      <h2 className="type-title-4xl m-0 text-balance text-foreground-neutral">{title}</h2>
      {children ? <p className="m-0 text-lg text-foreground-neutral-weak">{children}</p> : null}
    </Reveal>
  );
}

export default function StackPage() {
  return (
    <main className={`${styles.page} flex-1 bg-background-default text-foreground-neutral`}>
      {/* ===== HERO ===== */}
      <div className="hero relative -mt-24 flex items-end justify-center px-4 pt-40">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/illustrations/homepage/footer_grid.svg')] opacity-60" />
        <div className="content relative z-2 flex max-w-3xl flex-col items-center gap-5 text-center">
          <h1 className="stretch-display m-0 max-w-224 font-sans-display text-4xl text-foreground-neutral sm:text-5xl md:text-6xl">
            Prisma Stack
          </h1>
          <h2 className="type-title-2xl m-0 text-foreground-neutral-weak">
            Stop configuring. Start shipping.
          </h2>
          <p className="m-0 max-w-2xl text-lg text-foreground-neutral-weak">
            Most apps have the same recurring problems. Prisma Stack solves them with the fewest
            dependencies running on one platform. Great performance without learning and configuring
            multiple frameworks or providers.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {/* ===== THE STACK, SIMPLIFIED + DIAGRAM ===== */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <StackDiagram />
            <SectionHead eyebrow="How opinionated is it?" title="Every layer is replaceable.">
              You can still deploy your app or database wherever you&apos;d like. Use any dependency
              you&apos;re familiar with. Prisma Stack still works.
            </SectionHead>
          </div>
        </section>

        {/* ===== FRONTEND CAROUSEL ===== */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead
              eyebrow="Bring your own frontend"
              title="We have no opinion here. On purpose."
            >
              Prisma Compute runs every major frontend framework. Same database, same runtime, same
              deploy. Your call on the view layer.
            </SectionHead>
            <Reveal>
              <FrameworkCarousel />
            </Reveal>
          </div>
        </section>

        {/* ===== BUN ===== */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead title="Batteries included.">Bun simplifies your dependencies.</SectionHead>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bunApis.map((b) => (
                <Reveal key={b.api}>
                  <Card className="h-full gap-2 bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]">
                    <code className="font-mono text-sm font-medium text-foreground-ppg-strong">
                      {b.api}
                    </code>
                    <p className="m-0 text-sm text-foreground-neutral-weak">{b.role}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DATA ===== */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead eyebrow="Data layer" title="Prisma Postgres, done properly.">
              A real Postgres database with a type-safe ORM on top and the extensions you actually
              use, one line away.
            </SectionHead>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Reveal>
                <Card className="h-full gap-4 p-8">
                  <div className="flex items-center gap-3">
                    <Action color="ppg" size="4xl">
                      <PrismaMark className="size-6" />
                    </Action>
                    <h3 className="type-title-lg m-0 text-foreground-neutral">Prisma ORM</h3>
                  </div>
                  <p className="m-0 text-foreground-neutral-weak">
                    Model your schema once. Get autocompletion, compile-time safety and migrations
                    for free.
                  </p>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0 text-foreground-neutral">
                    <li className="flex gap-3">
                      <i className="fa-regular fa-check mt-1 text-foreground-ppg" aria-hidden />
                      Type-safe queries, end to end
                    </li>
                    <li className="flex gap-3">
                      <i className="fa-regular fa-check mt-1 text-foreground-ppg" aria-hidden />
                      Declarative schema and versioned migrations
                    </li>
                    <li className="flex gap-3">
                      <i className="fa-regular fa-check mt-1 text-foreground-ppg" aria-hidden />
                      Agent guardrails against unsafe writes
                    </li>
                  </ul>
                  <Code code={ORM_CODE} lang="typescript" />
                </Card>
              </Reveal>
              <Reveal>
                <Card className="h-full gap-4 p-8">
                  <div className="flex items-center gap-3">
                    <Action color="ppg" size="4xl">
                      <i className="fa-regular fa-cubes-stacked text-2xl" aria-hidden />
                    </Action>
                    <h3 className="type-title-lg m-0 text-foreground-neutral">
                      Postgres extensions
                    </h3>
                  </div>
                  <p className="m-0 text-foreground-neutral-weak">
                    Opinionated defaults you can swap. Turn on vector search, full-text and cron
                    without leaving Postgres.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {postgresExtensions.map((ext) => (
                      <span
                        key={ext}
                        className="rounded-square border border-stroke-ppg/30 bg-background-ppg px-3 py-1.5 font-mono text-xs text-foreground-ppg-strong"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>
                  <Code code={EXT_CODE} lang="sql" />
                </Card>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <div className="relative rounded-full bg-[url('/illustrations/homepage/footer_grid.svg')] bg-center before:pointer-events-none before:absolute before:inset-x-30 before:inset-y-[40%] before:-z-1 before:rounded-full before:bg-teal-400 before:blur-[100px] before:content-['']">
          <section id="start" className="scroll-mt-24 px-4 py-16">
            <div className="mx-auto flex w-fit flex-col items-center justify-center gap-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <h2 className="type-title-2xl m-0 text-foreground-neutral">
                  Stop configuring. Start shipping.
                </h2>
                <p className="m-0 max-w-lg text-foreground-neutral-weak">
                  The database, the runtime and the compute layer are decided and connected. You
                  write features.
                </p>
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
                <Button asChild variant="ppg" size="2xl">
                  <a href="https://console.prisma.io" className="flex items-center gap-2">
                    Start building
                    <i className="fa-regular fa-arrow-right" aria-hidden />
                  </a>
                </Button>
                <Button asChild variant="default-strong" size="2xl">
                  <a href="https://www.prisma.io/docs" className="flex items-center gap-2">
                    Read the docs
                    <i className="fa-regular fa-book-open" aria-hidden />
                  </a>
                </Button>
              </div>
              <p className="m-0 text-sm text-foreground-neutral-weaker">
                <code className="font-mono text-foreground-ppg-strong">npx create-prisma</code>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
