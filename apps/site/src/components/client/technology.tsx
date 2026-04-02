"use client";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@prisma/eclipse";
import { useState } from "react";

export const Technology = ({
  children,
  text,
  url,
}: {
  children: React.ReactNode;
  text: string;
  url?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default-stronger"
            href={url}
            className="font-sans-display! font-normal! text-base! font-mono! w-[75px]! h-[75px]!"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
