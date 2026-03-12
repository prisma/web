"use client";

import {
  useChat,
  useDeepThinking,
  type Reaction,
  type Source,
} from "@kapaai/react-sdk";
import {
  AlertCircleIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MessagesSquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@prisma-docs/ui/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@prisma-docs/ui/components/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@prisma-docs/ui/components/drawer";
import { useAIChatContext } from "@/hooks/use-ai-chat";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useChatPersistence,
  type ChatMessage,
  type StoredSource,
} from "@/hooks/use-chat-persistence";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponseMarkdown,
} from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Spinner } from "@/components/ai-elements/spinner";
import {
  PromptInput,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { CopyChat } from "@/components/ai-elements/copy-chat";

interface AIChatSidebarProps {
  exampleQuestions?: string[];
}

const SourcesDisplay = ({
  sources,
}: {
  sources: (Source | StoredSource)[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSources = showAll ? sources : sources.slice(0, 3);
  const hasMore = sources.length > 3;

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-fd-border">
      <p className="text-xs text-fd-muted-foreground mb-2">
        Based on {sources.length} source{sources.length !== 1 ? "s" : ""}:
      </p>
      <div className="flex flex-wrap gap-2">
        {displayedSources.map((source, idx) => (
          <a
            key={idx}
            href={source.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md bg-fd-muted hover:bg-fd-accent transition-colors max-w-[200px] group"
          >
            <FileTextIcon className="size-3 shrink-0 text-fd-muted-foreground" />
            <span className="truncate">{source.title || source.subtitle}</span>
            <ExternalLinkIcon className="size-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="px-2 py-1 text-xs rounded-md bg-fd-muted hover:bg-fd-accent transition-colors text-fd-muted-foreground"
          >
            +{sources.length - 3} more
          </button>
        )}
      </div>
    </div>
  );
};

const FeedbackButtons = ({
  qaId,
  currentReaction,
  onFeedback,
  disabled,
}: {
  qaId: string;
  currentReaction: Reaction | null;
  onFeedback: (id: string, reaction: Reaction) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger
          render={(props) => (
            <button
              {...props}
              type="button"
              onClick={() => onFeedback(qaId, "upvote")}
              disabled={disabled || currentReaction === "upvote"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "h-7 w-7",
                currentReaction === "upvote" &&
                  "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <ThumbsUpIcon
                className={cn(
                  "size-3.5",
                  currentReaction === "upvote" && "fill-current"
                )}
              />
            </button>
          )}
        />
        <TooltipContent>Helpful</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={(props) => (
            <button
              {...props}
              type="button"
              onClick={() => onFeedback(qaId, "downvote")}
              disabled={disabled || currentReaction === "downvote"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "h-7 w-7",
                currentReaction === "downvote" &&
                  "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <ThumbsDownIcon
                className={cn(
                  "size-3.5",
                  currentReaction === "downvote" && "fill-current"
                )}
              />
            </button>
          )}
        />
        <TooltipContent>Not helpful</TooltipContent>
      </Tooltip>
    </div>
  );
};

const ChatInner = ({
  exampleQuestions,
  onClose,
}: {
  exampleQuestions: string[];
  onClose: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const {
    initialMessages,
    isLoading: isPersistenceLoading,
    saveMessages,
    clearMessages,
  } = useChatPersistence();

  const {
    conversation,
    submitQuery,
    isGeneratingAnswer,
    isPreparingAnswer,
    resetConversation,
    stopGeneration,
    addFeedback,
    error,
  } = useChat();

  const deepThinking = useDeepThinking();

  useEffect(() => {
    if (conversation.length === 0) return;

    const messages: ChatMessage[] = conversation.flatMap((qa) => {
      const msgs: ChatMessage[] = [
        {
          id: `${qa.id}-user`,
          role: "user",
          content: qa.question,
        },
      ];
      if (qa.answer) {
        msgs.push({
          id: `${qa.id}-assistant`,
          role: "assistant",
          content: qa.answer,
          sources: qa.sources,
        });
      }
      return msgs;
    });

    saveMessages(messages);
  }, [conversation, saveMessages]);

  const handleSubmit = (value: string) => {
    if (!isGeneratingAnswer) {
      submitQuery(value);
      setInputValue("");
    }
  };

  const handleSuggestionClick = (question: string) => {
    if (!isGeneratingAnswer) {
      submitQuery(question);
    }
  };

  const handleClearChat = async () => {
    resetConversation();
    await clearMessages();
  };

  const handleFeedback = (qaId: string, reaction: Reaction) => {
    try {
      addFeedback(qaId, reaction);
    } catch (err) {
      // Feedback submission may fail in development due to captcha restrictions
      console.warn("Feedback submission failed:", err);
    }
  };

  const messagesForCopy: ChatMessage[] = conversation.flatMap((qa) => {
    const msgs: ChatMessage[] = [
      { id: `${qa.id}-user`, role: "user", content: qa.question },
    ];
    if (qa.answer) {
      msgs.push({
        id: `${qa.id}-assistant`,
        role: "assistant",
        content: qa.answer,
      });
    }
    return msgs;
  });

  const hasActiveConversation = conversation.length > 0;
  const hasPersistedMessages = initialMessages.length > 0;
  const showEmptyState =
    !hasActiveConversation && !hasPersistedMessages && !isPersistenceLoading;

  return (
    <div className="flex size-full w-full flex-col overflow-hidden bg-fd-background">
      <div className="flex items-center justify-between px-4 py-2.5 border-b shrink-0">
        <h2 className="font-semibold text-sm">Chat</h2>
        <div className="flex items-center gap-1">
          <CopyChat
            messages={hasActiveConversation ? messagesForCopy : initialMessages}
          />
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <button
                  {...props}
                  onClick={handleClearChat}
                  disabled={
                    (!hasActiveConversation && !hasPersistedMessages) ||
                    isGeneratingAnswer
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    "disabled:opacity-50"
                  )}
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            />
            <TooltipContent>Clear chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <button
                  {...props}
                  onClick={onClose}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" })
                  )}
                >
                  <ChevronRightIcon className="size-3.5" />
                </button>
              )}
            />
            <TooltipContent>Close chat</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Conversation>
        <ConversationContent>
          {showEmptyState ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-fd-primary/10">
                  <MessagesSquareIcon className="size-6 text-fd-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-fd-foreground">
                    How can I help?
                  </h3>
                  <p className="text-sm text-fd-muted-foreground mt-1">
                    Ask me anything about Prisma
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-sm">
                {exampleQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-left px-4 py-3 rounded-xl border border-fd-border bg-fd-card hover:bg-fd-accent hover:border-fd-accent transition-colors text-sm text-fd-foreground"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <p className="text-fd-muted-foreground text-xs">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-fd-muted text-fd-muted-foreground font-mono text-xs">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-fd-muted text-fd-muted-foreground font-mono text-xs ml-0.5">
                  I
                </kbd>{" "}
                to toggle
              </p>
            </div>
          ) : isPersistenceLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : hasActiveConversation ? (
            <>
              {conversation.map((qa, index) => {
                const isLastItem = index === conversation.length - 1;
                const isLoading =
                  isLastItem && (isGeneratingAnswer || isPreparingAnswer);
                const hasAnswer = !!qa.answer;
                const isComplete = qa.id && !isLoading;

                return (
                  <div key={qa.id || `qa-${index}`} className="space-y-3">
                    <Message from="user">
                      <MessageContent>{qa.question}</MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent>
                        {hasAnswer ? (
                          <MessageResponseMarkdown>
                            {qa.answer}
                          </MessageResponseMarkdown>
                        ) : isLoading ? (
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Spinner />
                            <Shimmer>
                              {isPreparingAnswer
                                ? deepThinking.active
                                  ? `Deep thinking... ${deepThinking.seconds}s`
                                  : "Gathering sources..."
                                : "Generating response..."}
                            </Shimmer>
                          </div>
                        ) : null}
                      </MessageContent>

                      {isComplete && qa.sources && qa.sources.length > 0 && (
                        <SourcesDisplay sources={qa.sources} />
                      )}

                      {isComplete && qa.id && (
                        <div className="mt-2">
                          <FeedbackButtons
                            qaId={qa.id}
                            currentReaction={qa.reaction}
                            onFeedback={handleFeedback}
                            disabled={isGeneratingAnswer}
                          />
                        </div>
                      )}
                    </Message>
                  </div>
                );
              })}

              {error && (
                <Message from="assistant">
                  <MessageContent>
                    <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                      <AlertCircleIcon className="size-4 mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">Something went wrong</span>
                        <span className="text-xs opacity-80">{error}</span>
                      </div>
                    </div>
                  </MessageContent>
                </Message>
              )}
            </>
          ) : (
            <>
              {initialMessages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === "assistant" ? (
                      <MessageResponseMarkdown>
                        {message.content}
                      </MessageResponseMarkdown>
                    ) : (
                      message.content
                    )}
                  </MessageContent>
                  {message.role === "assistant" &&
                    message.sources &&
                    message.sources.length > 0 && (
                      <SourcesDisplay sources={message.sources} />
                    )}
                </Message>
              ))}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="relative grid w-auto shrink-0 gap-2 p-4 border-t">
        <PromptInput
          value={inputValue}
          onValueChange={setInputValue}
          onSubmit={handleSubmit}
          placeholder="Ask a question..."
          disabled={isGeneratingAnswer}
          loading={isGeneratingAnswer}
          deepThinking={{
            active: deepThinking.active,
            toggle: deepThinking.toggle,
          }}
          onStop={stopGeneration}
        />
        <PromptInputFooter />
      </div>
    </div>
  );
};

export const AIChatSidebar = ({
  exampleQuestions = [
    "How do I migrate from Prisma ORM v6 to v7?",
    "How do I use Prisma with Next.js?",
    "How do I deploy Prisma to Railway?",
  ],
}: AIChatSidebarProps) => {
  const { isOpen, setIsOpen } = useAIChatContext();
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    setIsMac(navigator.platform?.toUpperCase().includes("MAC") ?? true);
  }, []);

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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "hidden shrink-0 shadow-none md:inline-flex items-center gap-2 h-8 group cursor-pointer"
        )}
      >
        <MessagesSquareIcon className="size-4 text-fd-muted-foreground group-hover:text-fd-accent-foreground" />
        <span>Ask AI</span>
        <div className="ms-auto inline-flex gap-0.5">
          <kbd className="rounded-md border bg-fd-background px-1.5 text-fd-muted-foreground group-hover:text-fd-accent-foreground">{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd className="rounded-md border bg-fd-background px-1.5 text-fd-muted-foreground group-hover:text-fd-accent-foreground">I</kbd>
        </div>
      </button>

      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed z-50 flex flex-col bg-fd-background transition-transform duration-200",
              "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-[500px]",
              "translate-x-full data-[state=open]:translate-x-0",
              "pointer-events-none data-[state=open]:pointer-events-auto",
              "hidden md:flex"
            )}
            data-state={isOpen ? "open" : "closed"}
          >
            <ChatInner
              exampleQuestions={exampleQuestions}
              onClose={() => setIsOpen(false)}
            />
          </div>,
          document.body
        )}

      <div className="md:hidden">
        <Drawer
          open={isMobile ? isOpen : false}
          onOpenChange={isMobile ? setIsOpen : undefined}
        >
          <DrawerTrigger asChild>
            <button
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "shadow-none inline-flex items-center gap-1.5"
              )}
            >
              <MessagesSquareIcon className="size-3.5 text-fd-muted-foreground" />
              <span>Ask AI</span>
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-[80dvh]">
            <DrawerHeader className="sr-only">
              <DrawerTitle>AI Chat</DrawerTitle>
              <DrawerDescription>Ask questions about Prisma</DrawerDescription>
            </DrawerHeader>
            <ChatInner
              exampleQuestions={exampleQuestions}
              onClose={() => setIsOpen(false)}
            />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};
