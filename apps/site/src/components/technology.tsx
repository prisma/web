"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@prisma/eclipse";
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
          <Button
            variant="default-stronger"
            href={url}
            className={cn(
              "font-mono! font-normal! text-base! w-[75px]! h-[75px]!",
              className,
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
