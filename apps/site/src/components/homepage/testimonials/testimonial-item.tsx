import { cn } from "@/lib/cn";
import Image from "next/image";
import parse from "html-react-parser";
import { Avatar, Separator } from "@prisma/eclipse";

export type TestimonialItemType = {
  text: string | React.ReactNode;
  author: string;
  title: string;
  company: string;
  imageUrl?: string;
  startups?: boolean;
  imageAlt?: string;
  key?: string | number;
  color?: string;
};

export const TestimonialItem = ({
  text,
  author,
  title,
  company,
  imageUrl,
  imageAlt,
  startups,
  color,
  ...rest
}: TestimonialItemType) => (
  <div
    {...rest}
    className={cn(
      "text-foreground-neutral my-2 flex h-full w-full flex-col rounded-[10px] border border-border-primary bg-background-default p-3 font-(family-name:--barlow) text-lg font-normal leading-[25.2px]",
      startups && "grid m-0",
    )}
  >
    <div className="min-h-0 flex-1">
      <div className="line-clamp-4 overflow-hidden text-foreground-neutral italic text-md font-[375]">
        {typeof text === "string" ? parse(text) : text}
      </div>
    </div>
    <div className="flex gap-4 items-center font-bold leading-[19.8px] tracking-[0.02em] mt-8">
      <Avatar
        format="image"
        size="lg"
        src={imageUrl || "https://avatar.vercel.sh/" + encodeURIComponent(author)}
        alt={imageAlt || `Profile photo of ${author}`}
        loading="lazy"
      ></Avatar>
      <div
        className={cn(
          "mt-1 font-(family-name:--inter) text-base font-normal leading-[22px]",
          startups && "font-(family-name:--barlow)",
        )}
      >
        <div
          className={cn(
            "text-base text-foreground-neutral-weak",
            startups && "text-surface-brand-darker font-bold text-lg",
          )}
        >
          {startups ? company : author}
        </div>
        <div
          className={cn(
            "relative",
            startups
              ? "text-foreground-neutral"
              : " text-foreground-neutral-weak text-2xs uppercase flex gap-1 items-start",
          )}
        >
          <span className="max-w-[185px] overflow-hidden">{startups ? author : title}</span>
          <Separator orientation="vertical" className="bg-current h-3 mt-0.5" />
          {startups ? (
            <span className="relative text-foreground-neutral-weak leading-[22px]">{title}</span>
          ) : (
            company && (
              <span
                className={cn(
                  "text-xs normal-case",
                  color === "orm" ? "text-foreground-orm" : "text-foreground-ppg",
                )}
              >
                {company}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  </div>
);
