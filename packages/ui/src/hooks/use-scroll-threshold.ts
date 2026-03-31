import { useSyncExternalStore } from "react";

type Listener = () => void;
type ScrollStore = {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => boolean;
};

const thresholdStores = new Map<number, ScrollStore>();

const createStore = (threshold: number): ScrollStore => {
  const listeners = new Set<Listener>();
  let isScrolled = false;
  let rafId: number | null = null;

  const update = () => {
    rafId = null;
    const next = window.scrollY >= threshold;

    if (next === isScrolled) {
      return;
    }

    isScrolled = next;
    listeners.forEach((listener) => listener());
  };

  const onScroll = () => {
    if (rafId !== null) {
      return;
    }

    rafId = window.requestAnimationFrame(update);
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    if (listeners.size === 1) {
      isScrolled = window.scrollY >= threshold;
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        window.removeEventListener("scroll", onScroll);

        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }

        thresholdStores.delete(threshold);
      }
    };
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") {
      return false;
    }

    // Keep first paint in sync even before the first subscription cycle runs.
    if (listeners.size === 0) {
      return window.scrollY >= threshold;
    }

    return isScrolled;
  };

  return { subscribe, getSnapshot };
};

const getOrCreateStore = (threshold: number): ScrollStore => {
  const existingStore = thresholdStores.get(threshold);

  if (existingStore) {
    return existingStore;
  }

  const nextStore = createStore(threshold);
  thresholdStores.set(threshold, nextStore);
  return nextStore;
};

export const useScrollThreshold = (threshold: number = 64) => {
  const store = getOrCreateStore(threshold);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
};
