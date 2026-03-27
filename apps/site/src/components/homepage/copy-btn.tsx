"use client";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@prisma/eclipse";
import { useState } from "react";

export const CopyCode = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => {
  const [tooltip, setTooltip] = useState<string | undefined>(undefined);
  const copyText = async () => {
    navigator.clipboard.writeText(text);
    setTooltip("copied!");
    setTimeout(() => {
      setTooltip(undefined);
    }, 2000);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default-stronger"
            size="3xl"
            onClick={() => copyText()}
            onMouseEnter={() => setTooltip("Copy")}
            className="font-sans-display! font-normal! text-base! font-mono!"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
