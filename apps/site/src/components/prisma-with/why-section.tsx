import parse from "html-react-parser";
import { cn } from "../../lib/cn";
import { Card, Action } from "@prisma/eclipse";

type WhySectionData = {
  title: string;
  cards: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
};

export function WhySection({ data }: { data: WhySectionData }) {
  return (
    <div className="my-12">
      <div className="px-4 md:px-8 py-12">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
          <h2 className="stretch-display text-4xl font-bold text-center font-sans-display">
            {data.title}
          </h2>
          <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3! gap-6">
            {data.cards.map((card) => (
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
  );
}
