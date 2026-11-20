"use client";

import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Atom for the current prompt/input text
export const chatPromptAtom = atom<string>("");

// Reads and clears the pending prompt in one step. The chat mounts once for
// the desktop panel and once for the mobile drawer; taking the prompt through
// the store means only the first of them submits a question handed over from
// search.
export const takeChatPromptAtom = atom(null, (get, set) => {
  const prompt = get(chatPromptAtom);
  if (prompt) set(chatPromptAtom, "");
  return prompt;
});

// Atom for sidebar open/closed state (persisted to localStorage)
export const chatOpenAtom = atomWithStorage<boolean>("prisma-docs:chat-open", false);

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
