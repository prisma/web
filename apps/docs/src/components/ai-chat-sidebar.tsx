"use client";

import dynamic from "next/dynamic";
import { MessagesSquareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@prisma-docs/ui/components/drawer";
import { useAIChatContext } from "@/hooks/use-ai-chat";
import { useIsMobile } from "@/hooks/use-mobile";

function ChatLoading() {
  const { isOpen } = useAIChatContext();
  return isOpen ? (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 rounded-lg border bg-fd-background p-4"
    >
      Loading AI chat…
    </div>
  ) : null;
}
const AIChatContent = dynamic(() => import("./ai-chat-content"), {
  ssr: false,
  loading: ChatLoading,
});

interface AIChatSidebarProps {
  exampleQuestions?: string[];
}

export const AIChatSidebar = ({
  exampleQuestions = [
    "How do I migrate from Prisma ORM v6 to v7?",
    "How do I use Prisma with Next.js?",
    "How do I deploy Prisma to Railway?",
  ],
}: AIChatSidebarProps) => {
  const { isOpen, setIsOpen } = useAIChatContext();
  const [hasOpened, setHasOpened] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMac(navigator.platform?.toUpperCase().includes("MAC") ?? true);
  }, []);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "i"
      ) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Escape closes the drawer — previously only the chevron or the
      // shortcut could, and the open drawer persisted across navigations.
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  return (
    <Drawer open={isMobile ? isOpen : false} onOpenChange={isMobile ? setIsOpen : undefined}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "hidden shrink-0 shadow-none md:inline-flex items-center gap-2 h-8 group cursor-pointer",
          // Pill hit area, matching the header's other controls.
          "rounded-full border-stroke-neutral px-3",
        )}
      >
        <MessagesSquareIcon className="size-4 text-fd-muted-foreground group-hover:text-fd-accent-foreground" />
        <span>Ask AI</span>
        <div className="ms-auto inline-flex gap-0.5">
          <kbd className="rounded-md border bg-fd-background px-1.5 text-fd-muted-foreground group-hover:text-fd-accent-foreground">
            {isMac ? "⌘" : "Ctrl"}
          </kbd>
          <kbd className="rounded-md border bg-fd-background px-1.5 text-fd-muted-foreground group-hover:text-fd-accent-foreground">
            I
          </kbd>
        </div>
      </button>

      <div className="md:hidden">
        <DrawerTrigger asChild>
          <button
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shadow-none inline-flex items-center gap-1.5 rounded-full border-stroke-neutral px-3",
            )}
          >
            <MessagesSquareIcon className="size-3.5 text-fd-muted-foreground" />
            <span>Ask AI</span>
          </button>
        </DrawerTrigger>
      </div>
      {(isOpen || hasOpened) && (
        <AIChatContent
          exampleQuestions={exampleQuestions}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </Drawer>
  );
};
