"use client";

import { cn } from "@prisma-docs/ui/lib/cn";
import { ArrowUpIcon, BrainIcon, SquareIcon } from "lucide-react";
import type { ComponentProps, FormEvent, KeyboardEvent } from "react";
import { forwardRef, useRef, useCallback, useImperativeHandle } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@prisma-docs/ui/components/tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export type PromptInputProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  deepThinking?: {
    active: boolean;
    toggle: () => void;
  };
  onStop?: () => void;
};

export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(
  (
    {
      value,
      onValueChange,
      onSubmit,
      placeholder = "Ask a question...",
      disabled = false,
      loading = false,
      deepThinking,
      onStop,
      className,
      ...props
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current!);

    const handleSubmit = useCallback(
      (e: FormEvent) => {
        e.preventDefault();
        if (value.trim() && !disabled && !loading) {
          onSubmit(value.trim());
        }
      },
      [value, disabled, loading, onSubmit],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (value.trim() && !disabled && !loading) {
            onSubmit(value.trim());
          }
        }
      },
      [value, disabled, loading, onSubmit],
    );

    const handleInput = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      }
    }, []);

    const maxLength = 10000;

    return (
      <form
        onSubmit={handleSubmit}
        className={cn("relative", className)}
        {...props}
      >
        <InputGroup className="bg-fd-card">
          <InputGroupTextarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to know?"
            disabled={disabled || loading}
            maxLength={maxLength}
            className="min-h-[72px] max-h-[200px] resize-none"
          />
          <InputGroupAddon align="block-end" className="justify-between">
            <div className="flex items-center gap-1">
              {deepThinking && (
                <Tooltip>
                  <TooltipTrigger
                    render={(triggerProps) => (
                      <button
                        {...triggerProps}
                        type="button"
                        onClick={deepThinking.toggle}
                        disabled={loading}
                        className={cn(
                          buttonVariants({
                            variant: deepThinking.active ? "primary" : "ghost",
                            size: "icon-sm",
                          }),
                          "h-8 w-8 rounded-full",
                          loading && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <BrainIcon className="size-4" />
                        <span className="sr-only">
                          {deepThinking.active
                            ? "Disable deep thinking"
                            : "Enable deep thinking"}
                        </span>
                      </button>
                    )}
                  />
                  <TooltipContent>
                    {deepThinking.active
                      ? "Disable deep thinking mode"
                      : "Enable deep thinking for thorough answers"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger
                render={(triggerProps) => (
                  <InputGroupButton
                    {...triggerProps}
                    type={loading && onStop ? "button" : "submit"}
                    onClick={loading && onStop ? onStop : undefined}
                    size="icon-sm"
                    variant="primary"
                    disabled={
                      loading && onStop
                        ? false
                        : !value.trim() || disabled || loading
                    }
                    className="h-8 w-8 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading && onStop ? (
                      <>
                        <SquareIcon className="size-3.5 fill-current" />
                        <span className="sr-only">Stop generating</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpIcon className="size-5" />
                        <span className="sr-only">Send message</span>
                      </>
                    )}
                  </InputGroupButton>
                )}
              />
              <TooltipContent>
                {loading && onStop ? "Stop generating" : "Send message"}
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </form>
    );
  },
);

PromptInput.displayName = "PromptInput";

export type PromptInputFooterProps = ComponentProps<"div"> & {
  attribution?: string;
  attributionUrl?: string;
};

export const PromptInputFooter = ({
  attribution = "kapa.ai",
  attributionUrl = "https://kapa.ai",
  className,
  ...props
}: PromptInputFooterProps) => (
  <div
    className={cn(
      "text-xs text-center text-fd-muted-foreground pt-2",
      className,
    )}
    {...props}
  >
    Powered by{" "}
    <a
      href={attributionUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-fd-foreground transition-colors"
    >
      {attribution}
    </a>
  </div>
);
