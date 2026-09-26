import { useSyncExternalStore } from "react";

type Listener = () => void;
type ScrollStore = {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => boolean;
};

export type ScrollThresholdOptions =
  | number
  | {
      enter: number;
      exit: number;
    };

const thresholdStores = new Map<string, ScrollStore>();

const getThresholdConfig = (threshold: ScrollThresholdOptions) => {
  if (typeof threshold === "number") {
    return { enter: threshold, exit: threshold, key: `${threshold}` };
  }
  return {
    enter: threshold.enter,
    exit: threshold.exit,
    key: `${threshold.enter}:${threshold.exit}`,
  };
};

const createStore = (threshold: ScrollThresholdOptions): ScrollStore => {
  const { enter, exit, key } = getThresholdConfig(threshold);
  const listeners = new Set<Listener>();
  let isScrolled = false;
  let rafId: number | null = null;

  const update = () => {
    rafId = null;
    const next = isScrolled ? window.scrollY > exit : window.scrollY >= enter;

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
      isScrolled = window.scrollY >= enter;
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

        thresholdStores.delete(key);
      }
    };
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") {
      return false;
    }

    // Keep first paint in sync even before the first subscription cycle runs.
    if (listeners.size === 0) {
      return window.scrollY >= enter;
    }

    return isScrolled;
  };

  return { subscribe, getSnapshot };
};

// Exported for tests; apps should use the hook.
export const getScrollThresholdStore = (threshold: ScrollThresholdOptions): ScrollStore => {
  const { key } = getThresholdConfig(threshold);
  const existingStore = thresholdStores.get(key);

  if (existingStore) {
    return existingStore;
  }

  const nextStore = createStore(threshold);
  thresholdStores.set(key, nextStore);
  return nextStore;
};

export const useScrollThreshold = (threshold: ScrollThresholdOptions = 64) => {
  const store = getScrollThresholdStore(threshold);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
};
