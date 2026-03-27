"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@prisma/eclipse";
import { useState } from "react";
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
              "font-sans-display! font-normal! text-base! font-mono! w-[75px]! h-[75px]!",
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
