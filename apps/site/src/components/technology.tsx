"use client";

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@prisma/eclipse";
import { cn } from "@/lib/cn";
export const Technology = ({
  children,
  text,
  url,
  className,
}: {
  children: React.ReactNode;
  text: string;
  url?: string;
  className?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="default-strong" className={cn("font-mono! font-normal! text-base! w-[75px]! h-[75px]!", className)}>
            <a href={url}>
              {children}
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
