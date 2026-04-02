import parse from "html-react-parser";
import { cn } from "../../lib/cn";
import { Card, Action } from "@prisma/eclipse";

type CommunitySectionData = {
  title: string;
  cards: Array<{
    icon?: string;
    image?: string;
    title: string;
    description: string;
    btn?: {
      label: string;
      url: string;
    };
    btns?: Array<{
      label: string;
      url: string;
    }>;
  }>;
};

export function CommunitySection({ data }: { data: CommunitySectionData }) {
  return (
    <div className="my-12">
      <div className="px-4 md:px-8 py-12 flex flex-col gap-12">
        <h2 className="stretch-display text-foreground-neutral text-4xl font-bold text-center font-sans-display mx-auto">
          {data.title}
        </h2>
        <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(6,1fr)]! gap-6 mx-auto max-w-[1200px]">
          {data.cards.map((card, idx: number) => (
            <Card
              key={idx}
              className={cn(
                "md:col-span-2 bg-background-neutral-weaker",
                idx >= 3 && idx === 3 && "md:col-start-2",
                idx >= 3 && idx === 4 && "md:col-start-4",
              )}
            >
              <div className="flex gap-4 items-start">
                {(card.icon || card.image) && (
                  <Action
                    size="4xl"
                    color="neutral"
                    className="self-start flex-none"
                  >
                    {card.image ? (
                      <img
                        src={card.image}
                        alt=""
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <i className={cn("text-xl", card.icon)} />
                    )}
                  </Action>
                )}
                <h3 className="min-w-0 text-balance stretch-display text-foreground-neutral text-lg leading-tight font-bold font-sans-display">
                  {parse(card.title)}
                </h3>
              </div>
              <p className="text-foreground-neutral-weak text-base">
                {parse(card.description)}
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                {(card.btns ?? (card.btn ? [card.btn] : [])).map((btn) => (
                  <a
                    key={`${card.title}-${btn.label}`}
                    href={btn.url}
                    className="text-foreground-neutral text-sm font-medium underline underline-offset-2 text-foreground-ppg hover:text-foreground-ppg-strong w-fit"
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
