import type { Metadata } from "next";
import { Button } from "@prisma/eclipse";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { VideoSection } from "@/components/typedsql/video-section";
import { ExpandCapabilities } from "@/components/typedsql/expand-capabilities";

const twoCol = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          End-to-end <br /> type-safety
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          All TypedSQL queries have typed inputs and outputs preventing errors related to incorrect
          types and improving DX. Any type mismatches can be caught right away, while type-safety
          significantly improves ergonomics while developing.
        </p>
        <div className="mt-4">
          <Button
            variant="link"
            href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql"
            className="w-full justify-center lg:justify-start text-center lg:text-left text-foreground-orm! p-0!"
          >
            <span>Learn more about type-safety with TypedSQL</span>
            <i className="fa-regular fa-arrow-right ml-2" />
          </Button>
        </div>
      </>
    ),
    imageUrl: "/illustrations/typedsql/end-to-end-type-safety",
    imageAlt: "End-to-end type-safety",
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Full control <br /> of SQL
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          When you need the full control of the SQL engine, write and execute raw SQL queries
          directly. This gives you the flexibility to use advanced SQL-specific features and
          optimizations that are not available in the Prisma Client API, while maintaining type
          safety.
        </p>
        <div className="mt-4">
          <Button
            variant="link"
            href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql"
            className="w-full justify-center lg:justify-start text-center lg:text-left text-foreground-orm! p-0!"
          >
            <span>Write queries using TypedSQL</span>
            <i className="fa-regular fa-arrow-right ml-2" />
          </Button>
        </div>
      </>
    ),
    imageUrl: "/illustrations/typedsql/full-controll-sql",
    imageAlt: "Full control of SQL",
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Great DX
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          TypedSQL combines the productivity of a higher-level abstraction with type-safety for
          crafting SQL directly. Use familiar SQL tools in your editor, complete with syntax
          highlighting, error checking, and autocompletion.
        </p>
      </>
    ),
    imageUrl: "/illustrations/typedsql/great-dx",
    imageAlt: "Great DX",
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
];

export const metadata: Metadata = {
  title: "TypedSQL - Fully Type-Safe Raw SQL | Prisma ORM",
  description:
    "TypedSQL is the best way to express the full power of SQL in queries. Fully type-safe, with auto-completion, and a fantastic DX for using raw SQL with Prisma.",
};

export default function TypedSQLPage() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 flex items-center md:items-end justify-center px-4 relative overflow-hidden pt-36 pb-16 md:pt-0 md:pb-0 md:h-123">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-background-orm-strong)_0%,var(--color-background-default)_70%)]" />
        <div className="content relative z-2 md:my-12 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-foreground-orm font-sans-display text-sm font-bold tracking-widest uppercase">
              TypedSQL
            </span>
            <h1 className="text-4xl md:text-6xl [font-variation-settings:'wght'_900,'wdth'_125] mb-0 text-center mt-0 font-sans-display text-foreground-neutral">
              Fully type-safe <br />
              raw SQL
            </h1>
            <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
              TypedSQL is the best way to express the full power of SQL in queries. Fully type-safe,
              with auto-completion, and a fantastic DX for using raw SQL with Prisma.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="orm"
              href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Get started with TypedSQL</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
            <Button
              variant="default-stronger"
              href="https://www.prisma.io/blog/announcing-typedsql-make-your-raw-sql-queries-type-safe-with-prisma-orm"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Read the announcement</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-screen">
        <CardSection cardSection={twoCol} />
      </div>
      <div className="bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_50%,var(--color-background-default)_100%)]">
        <VideoSection />
      </div>
      <ExpandCapabilities />
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-indigo-400 before:blur-[100px]">
        <div className="my-8 p-6 md:my-12 md:p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Raw SQL with type-safety and autocompletion
              </h2>
              <p className="text-foreground-neutral-weak max-w-xl">
                TypedSQL gives you even more flexibility and control in your database queries. Start
                using TypedSQL in any new or existing Prisma project.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button
                variant="orm"
                size="2xl"
                href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql"
              >
                <span>Try TypedSQL</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
              <Button
                variant="default-stronger"
                size="2xl"
                href="https://github.com/prisma/prisma-examples/tree/latest/orm/typedsql"
              >
                <span>See an example</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
