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
  buttonSize = "3xl",
  buttonClassName = "font-sans-display! font-normal! text-base! font-mono!",
}: {
  children: React.ReactNode;
  text: string;
  buttonSize?: React.ComponentProps<typeof Button>["size"];
  buttonClassName?: string;
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
            size={buttonSize}
            onClick={() => copyText()}
            onMouseEnter={() => setTooltip("Copy")}
            className={buttonClassName}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
