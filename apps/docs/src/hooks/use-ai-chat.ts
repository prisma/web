"use client";

import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";


export const chatPromptAtom = atom<string>("");


export const chatOpenAtom = atomWithStorage<boolean>("prisma-docs:chat-open", false);


export const pendingMessageAtom = atom<string>("");

export const useAIChatContext = () => {
  const [prompt, setPrompt] = useAtom(chatPromptAtom);
  const [isOpen, setIsOpen] = useAtom(chatOpenAtom);
  const [pendingMessage, setPendingMessage] = useAtom(pendingMessageAtom);

  return {
    prompt,
    setPrompt,
    isOpen,
    setIsOpen,
    pendingMessage,
    setPendingMessage,
  };
};
