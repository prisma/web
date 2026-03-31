"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@prisma/eclipse";

interface TooltipInfoProps {
  text: string;
}

export function TooltipInfo({ text }: TooltipInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <i className="fa-solid fa-circle-info cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-50 w-full">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
