"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { useAIChatContext } from "@/hooks/use-ai-chat";

export function FloatingAsk() {
  const { isOpen, setIsOpen, setPendingMessage } = useAIChatContext();
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const checkScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    if (scrollHeight - viewportHeight < 200) {
      setVisible(false);
      return;
    }

    const distanceFromBottom = scrollHeight - window.scrollY - viewportHeight;
    setVisible(distanceFromBottom > 200);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const handleSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    setPendingMessage(val);
    setIsOpen(true);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-full max-w-lg px-4 transition-opacity duration-500 ease-in-out max-md:hidden",
        visible && !isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={cn(
          "group flex flex-col gap-2 rounded-2xl border border-fd-foreground/20 bg-fd-background/80 px-4 pt-3 pb-3 shadow-lg backdrop-blur-xl transition-[scale,border-color,box-shadow] duration-700 ease-in-out cursor-text hover:scale-x-[1.06] hover:scale-y-[1.02] hover:border-fd-primary/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]",
          inputValue &&
            "scale-x-[1.06] scale-y-[1.02] border-fd-primary/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="w-full bg-transparent text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none"
        />
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Submit question"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fd-primary text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
