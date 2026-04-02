"use client";
import { FunctionComponent } from "react";
import AnimatedNumbers from "react-animated-numbers";
import { cn } from "@/lib/cn";
export const InfoStats: FunctionComponent<{
  icon?: any;
  number?: string;
  text?: string;
  link?: string;
}> = ({ icon, number, text, link }) => {
  const match = number?.match(/^(\d+)(\D.*)?$/);

  return (
    match && (
      <div className="relative flex items-center cursor-default text-foreground-orm-strong w-full sm:w-fit sm:mx-auto [&>div]:first:flex [&>div]:first:justify-center [&>div]:first:items-center [&>div]:first:mb-[10px] font-sans-display flex-col justify-center items-center">
        {link && (
          <a
            href={link}
            className="cursor-pointer absolute w-full h-full left-0 top-0 z-20 stretch-display"
            target="_blank"
            rel="noopener noreferrer"
          />
        )}
        <div className="stretch-display flex text-3xl">
          <i
            className={cn("mt-1 mr-4 max-w-8.5 h-9.5", icon)}
            style={{
              marginTop: `4px`,
            }}
          />
          <AnimatedNumbers
            animateToNumber={Number(match[1])}
            fontStyle={{
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "100%",
              letterSpacing: "-0.02em",
            }}
          />
          <span className="-translate-y-1">{match[2]}</span>
        </div>
        <span className="font-mono text-foreground-neutral-weak text-sm">
          {text}
        </span>
      </div>
    )
  );
};
