"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useRef } from "react";
import { db, type StoredMessage, type StoredSource } from "@/lib/db";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: StoredSource[];
};

export type { StoredSource };

export const useChatPersistence = () => {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load messages from Dexie with live query
  const storedMessages = useLiveQuery(() => db.messages.orderBy("sequence").toArray());

  const initialMessages: ChatMessage[] =
    storedMessages?.map(({ timestamp: _timestamp, sequence: _sequence, ...message }) => message) ??
    [];

  const isLoading = storedMessages === undefined;

  // Save messages to Dexie with debouncing
  const saveMessages = useCallback((messages: ChatMessage[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const baseTimestamp = Date.now();
        const messagesToStore: StoredMessage[] = messages.map((message, index) => ({
          ...message,
          timestamp: baseTimestamp + index * 1000,
          sequence: index,
        }));

        await db.transaction("rw", db.messages, async () => {
          await db.messages.clear();
          await db.messages.bulkAdd(messagesToStore);
        });
      } catch (error) {
        console.error("Failed to save messages:", error);
      }
    }, 300);
  }, []);

  // Clear all messages from Dexie
  const clearMessages = useCallback(async () => {
    try {
      await db.messages.clear();
    } catch (error) {
      console.error("Failed to clear messages:", error);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    },
    [],
  );

  return {
    initialMessages,
    isLoading,
    saveMessages,
    clearMessages,
  };
};
