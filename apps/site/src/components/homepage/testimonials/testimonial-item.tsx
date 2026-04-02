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
      "text-foreground-neutral p-3 my-2 font-[family-name:var(--barlow)] font-normal text-lg bg-surface-primary border border-border-primary rounded-[10px] leading-[25.2px]",
      startups && "grid m-0",
    )}
  >
    <div className="text-foreground-neutral italic text-md font-[375]">
      {typeof text === "string" ? parse(text) : text}
    </div>
    <div className="flex gap-4 items-center font-bold leading-[19.8px] tracking-[0.02em] mt-8">
      <Avatar
        format="image"
        size="lg"
        src={
          imageUrl || "https://avatar.vercel.sh/" + encodeURIComponent(author)
        }
        alt={imageAlt || `Profile photo of ${author}`}
      ></Avatar>
      <div
        className={cn(
          "font-[family-name:var(--inter)] text-base font-normal leading-[22px] mt-1",
          startups && "font-[family-name:var(--barlow)]",
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
          <span className="max-w-[185px] overflow-hidden">
            {startups ? author : title}
          </span>
          <Separator orientation="vertical" className="bg-current h-3 mt-0.5" />
          {startups ? (
            <span className="relative text-foreground-neutral-weak leading-[22px]">
              {title}
            </span>
          ) : (
            company && (
              <span
                className={cn(
                  "text-xs [text-transform:none]",
                  color === "orm"
                    ? "text-foreground-orm"
                    : "text-foreground-ppg",
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
