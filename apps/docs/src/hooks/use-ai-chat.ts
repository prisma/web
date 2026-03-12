"use client";

import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Atom for the current prompt/input text
export const chatPromptAtom = atom<string>("");

// Atom for sidebar open/closed state (persisted to localStorage)
export const chatOpenAtom = atomWithStorage<boolean>(
  "prisma-docs:chat-open",
  false
);

export const useAIChatContext = () => {
  const [prompt, setPrompt] = useAtom(chatPromptAtom);
  const [isOpen, setIsOpen] = useAtom(chatOpenAtom);

  return {
    prompt,
    setPrompt,
    isOpen,
    setIsOpen,
  };
};
