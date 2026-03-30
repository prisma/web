import type { Metadata } from "next";
import { Card } from "@prisma/eclipse";
import { Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getBaseUrl } from "@/lib/url";
import {
  stackCategories,
  type StackCategory,
  type StackLinkItem,
} from "./stack-data";

const title = "Prisma Stack";
const description =
  "Prisma works with every major TypeScript stack. Explore how Prisma fits Next.js, NestJS, GraphQL, your database, and more.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${getBaseUrl()}/stack`,
    siteName: "Prisma",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function StackPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-[linear-gradient(to_bottom,var(--color-background-ppg),var(--color-background-default)_50%)] text-foreground-neutral">
      <section className="px-4 pt-36 pb-12 md:px-0 md:pb-16">
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 text-center">
          <p className="flex items-center justify-center gap-2 font-sans text-base font-semibold uppercase tracking-[1.6px] text-foreground-ppg">
            <Layers className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
            Prisma Stack
          </p>
          <h1 className="m-0 text-foreground-neutral text-5xl font-sans-display [font-variation-settings:'wght'_900]">
            Build with your favorite tools
          </h1>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-0 md:pb-20">
        <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-12">
          {stackCategories.map((category: StackCategory) => (
            <div key={category.id} className="flex flex-col gap-4">
              <h3 className="m-0 text-foreground-neutral text-3xl font-sans-display [font-variation-settings:'wght'_900]">
                {category.title}
              </h3>
              <p className="m-0 text-foreground-neutral-weak">{category.description}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {category.items.map((item: StackLinkItem) => (
                  <Link key={item.id} href={item.href} className="group">
                    <Card className="flex h-full flex-row items-center gap-3 p-4 transition-colors hover:border-stroke-neutral-strong hover:bg-surface-elevated dark:bg-[#0A101D]">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className={cn(
                          "size-6 shrink-0 object-contain",
                          item.invertInDark && "dark:invert",
                        )}
                      />
                      <span className="font-sans text-lg font-semibold text-foreground-neutral">
                        {item.name}
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
