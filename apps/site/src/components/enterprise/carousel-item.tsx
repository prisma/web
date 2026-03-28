import { Action, Card } from "@prisma/eclipse";
import { cn } from "@/lib/cn";

export interface EnterpriseCarouselCard {
  title: string;
  description: string;
  icon: string;
}

export const CarouselItem = ({
  card,
  className,
}: {
  card: EnterpriseCarouselCard;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)] relative h-full",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Action color="orm" size="4xl">
            <i className={card.icon} />
          </Action>
          <h3 className="text-foreground-neutral font-sans-display text-md md:text-lg stretch-display mt-0 mb-1 font-bold">
            {card.title}
          </h3>
        </div>
        <p className="text-foreground-neutral-weak text-sm font-normal m-0" dangerouslySetInnerHTML={{ __html: card.description }} />
      </div>
    </Card>
  );
};
