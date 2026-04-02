import { createPageMetadata } from "@/lib/page-metadata";
import { Card } from "@prisma/eclipse";
import { Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  stackCategories,
  type StackCategory,
  type StackLinkItem,
} from "./stack-data";

const title = "Prisma in your stack | Prisma";
const description =
  "Prisma is a Node.js and TypeScript ORM that integrates easily with popular databases, and frameworks.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/stack",
  ogImage: "/og/og-stack.png",
});

export default function StackPage() {
  return (
    <main className="flex-1 w-full -mt-24 bg-[linear-gradient(to_bottom,var(--color-background-ppg),var(--color-background-default)_50%)] text-foreground-neutral">
      <div className="hero -mt-24 pt-64 pb-12 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 my-12 py-12 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-ppg-weak uppercase tracking-widest text-sm font-sans-display font-black">
              <i className="fa-regular fa-layer-group" />
              <span>Prisma Stack</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
              Build with
              <br /> your favorite tools
            </h1>
          </div>
        </div>
      </div>

      <section className="px-4 pb-16 md:pb-20">
        <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-12">
          {stackCategories.map((category: StackCategory) => (
            <div key={category.id} className="flex flex-col gap-4">
              <h3 className="m-0 text-foreground-neutral text-3xl font-sans-display [font-variation-settings:'wght'_900]">
                {category.title}
              </h3>
              <p className="m-0 text-foreground-neutral-weak">
                {category.description}
              </p>
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
