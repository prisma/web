import { Action, Card } from "@prisma/eclipse";
import { cn } from "../../lib/cn";

type SupportCardProps = {
  title?: string;
  description?: string;
  icon?: string;
  color?: "orm" | "ppg" | "neutral" | "success";
  links: Array<{
    label: string;
    url: string;
    icon: string;
  }>;
};

export function SupportCard({
  title,
  description,
  icon,
  color = "neutral",
  links,
}: SupportCardProps) {
  const colorMap = {
    orm: "orm",
    ppg: "ppg",
    neutral: "neutral",
    success: "success",
  } as const;

  return (
    <Card className="bg-background-neutral-weaker p-8 rounded-lg">
      <div className="grid grid-rows-[auto_auto_1fr] gap-4 h-full">
        {icon && (
          <Action size="4xl" color={colorMap[color]}>
            <i className={cn("text-xl", icon)} />
          </Action>
        )}
        {title && (
          <h3 className="stretch-display text-xl font-bold font-sans-display text-foreground-neutral">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-foreground-neutral-weak text-base">
            {description}
          </p>
        )}
        <div className="flex flex-col gap-3 mt-auto">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              className="text-sm font-medium flex items-center gap-2 text-foreground-ppg hover:text-foreground-ppg-strong transition-colors"
            >
              {link.icon && <i className={link.icon} />}
              <span>{link.label}</span>
              <i className="fa-regular fa-arrow-right ml-auto" />
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
