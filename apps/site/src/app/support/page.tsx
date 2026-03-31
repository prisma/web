import { createPageMetadata } from "@/lib/page-metadata";
import { Action, Card, CardHeader } from "@prisma/eclipse";
import PDPStatus from "@prisma-docs/ui/components/pdp-status";
import * as data from "../../data/support.json";
import { cn } from "../../lib/cn";
import { LargeSearchToggle } from "@/components/support/search-toggle";

const title = "Prisma Support | Get Help, Report Bugs, and Request Features";
const description =
  "Get help with Prisma. Search for answers, report bugs, request features, or contact the Prisma support team.";
const ogImage = "/og/og-support.png";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/support",
  ogImage,
});

type SupportLink = {
  label: string;
  url: string;
  icon: string;
};

type SupportCardData = {
  title?: string;
  description?: string;
  icon?: string;
  color?: "orm" | "ppg" | "neutral" | "success";
  links: SupportLink[];
};

export default function Support() {
  const cards = data.cards as SupportCardData[];

  return (
    <main className="flex-1 w-screen bg-background-default">
      <div className="hero relative w-full -mt-33 pt-45 block pb-12 flex flex-col gap-8">
        <div className="bg-[linear-gradient(180deg,var(--color-foreground-orm-strong)_0%,var(--color-background-default)_100%)] absolute inset-0 z-1 overflow-hidden" />
        <h1 className="stretch-display text-6xl font-bold mb-4 text-center mt-9 font-sans-display z-2 relative">
          {data.title}
        </h1>
        <LargeSearchToggle className="h-full z-2 max-w-141 mx-auto w-full" />
        <PDPStatus className="gap-2 [&_b]:text-foreground-neutral! [&_*]:text-xs! [&>span]:text-xs! [&>span]:flex [&>span]:flex-row [&>span]:items-center [&>span]:gap-2 font-mono [&_*]:m-0 items-center z-2 relative" />
      </div>

      <div className="mx-0 lg:mt-0 lg:mb-40 mt-10 mb-20 ">
        <div className="mx-auto w-full relative px-2.5 md:px-6 md:max-w-[1248px]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Cards 1-3: Regular support cards */}
            {cards.slice(0, 3).map((card, idx) => (
              <Card
                key={idx}
                className={cn(
                  "justify-between rounded-square-high",
                  card.color === "orm"
                    ? "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)]"
                    : "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]",
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <Action size="4xl" color={card.color}>
                      <i className={card.icon} />
                    </Action>
                    <h3 className="font-bold text-xl font-bold font-sans-display text-foreground-neutral mb-0">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-foreground-neutral-weak">
                    {card.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {card.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className={cn(
                        "text-foreground-neutral-weak underline underline-offset-3 text-sm font-semibold",
                        card.color === "orm"
                          ? "text-background-orm-reverse-strong hover:text-background-orm-reverse"
                          : "text-background-ppg-reverse-strong hover:text-background-ppg-reverse",
                      )}
                    >
                      {link.icon && <i className={cn("mr-2", link.icon)} />}
                      {link.label}
                      <i className="fa-regular fa-arrow-up-right ml-2 text-xs" />
                    </a>
                  ))}
                </div>
              </Card>
            ))}

            {/* Card 4: "Still need help?" - spans 2 columns on large screens */}
            {cards[3] && (
              <Card
                className={cn(
                  "justify-between lg:col-span-2 rounded-square-high",
                  cards[3].color === "orm"
                    ? "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)]"
                    : "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]",
                )}
              >
                <div className="grid grid-rows-[auto_auto_1fr] gap-4 h-full lg:grid-rows-1 lg:grid-cols-[1fr_auto]">
                  <div>
                    <h3 className="text-xl font-bold font-sans-display text-foreground-neutral mb-4">
                      {cards[3].title}
                    </h3>
                    <p className="text-foreground-neutral-weak text-base lg:max-w-[48ch]">
                      {cards[3].description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 lg:ml-auto">
                    {cards[3].links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        className="text-sm font-semibold flex items-center gap-2 text-foreground-ppg-strong hover:text-foreground-ppg transition-colors whitespace-nowrap"
                      >
                        <span className="underline underline-offset-3">
                          {link.label}
                        </span>
                        <i className="fa-regular fa-arrow-up-right ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Card 5: Additional links - spans 2 cols on md, 1 on lg */}
            {cards[4] && (
              <Card
                className={cn(
                  "md:col-span-2 lg:col-span-1 justify-between rounded-square-high",
                  cards[3].color === "orm"
                    ? "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)]"
                    : "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]",
                )}
              >
                <div className="flex flex-col gap-3 md:flex-row justify-center lg:flex-col lg:h-full">
                  {cards[4].links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className="text-sm font-semibold flex items-center gap-2 text-foreground-ppg-strong hover:text-foreground-ppg transition-colors w-fit"
                    >
                      {link.icon && <i className={link.icon} />}
                      <span className="underline underline-offset-3">
                        {link.label}
                      </span>
                      <i className="fa-regular fa-arrow-up-right ml-auto" />
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Card 6: Enterprise banner - full width */}
            {cards[5] && (
              <Card
                className={cn(
                  "col-start-1 md:col-end-3 lg:col-end-4 justify-between rounded-square-high",
                  cards[5].color === "orm"
                    ? "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)]"
                    : "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]",
                )}
              >
                <div className="flex flex-row items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl font-bold font-sans-display text-foreground-neutral">
                    {cards[5].title}
                  </h3>
                  <a
                    href={cards[5].links[0].url}
                    className="text-sm font-semibold flex items-center gap-2 text-background-orm-reverse-strong hover:text-background-orm-reverse transition-colors"
                  >
                    <span className="underline underline-offset-3">
                      {cards[5].links[0].label}
                    </span>
                    <i className={cards[5].links[0].icon} />
                  </a>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
