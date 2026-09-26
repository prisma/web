import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { getScrollThresholdStore } from "./use-scroll-threshold";

type Listener = () => void;

// A minimal stand-in for the browser globals the store touches. Scroll events
// and animation frames are driven by hand so every assertion reads one settled
// state, the same way the real store settles once per frame.
function installFakeWindow() {
  const scrollListeners = new Set<Listener>();
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrameId = 1;

  const fakeWindow = {
    scrollY: 0,
    addEventListener(type: string, listener: Listener) {
      if (type === "scroll") scrollListeners.add(listener);
    },
    removeEventListener(type: string, listener: Listener) {
      if (type === "scroll") scrollListeners.delete(listener);
    },
    requestAnimationFrame(callback: FrameRequestCallback) {
      const id = nextFrameId++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id: number) {
      frames.delete(id);
    },
  };

  Object.assign(globalThis, { window: fakeWindow });

  return {
    // Emits a scroll event without running the frame, like a burst of events
    // inside one frame.
    emitScroll(y: number) {
      fakeWindow.scrollY = y;
      for (const listener of scrollListeners) listener();
    },
    // Emits a scroll event and runs the frame it scheduled.
    scrollTo(y: number) {
      this.emitScroll(y);
      this.flushFrames();
    },
    flushFrames() {
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(0);
    },
    scrollListenerCount: () => scrollListeners.size,
    pendingFrameCount: () => frames.size,
    uninstall() {
      Reflect.deleteProperty(globalThis, "window");
    },
  };
}

let fake: ReturnType<typeof installFakeWindow>;

beforeEach(() => {
  fake = installFakeWindow();
});

afterEach(() => {
  fake.uninstall();
});

test("numeric threshold floats at the threshold and docks straight below it", () => {
  const store = getScrollThresholdStore(64);
  const unsubscribe = store.subscribe(() => {});

  fake.scrollTo(63);
  assert.equal(store.getSnapshot(), false);
  fake.scrollTo(64);
  assert.equal(store.getSnapshot(), true);
  fake.scrollTo(63);
  assert.equal(store.getSnapshot(), false);

  unsubscribe();
});

test("numeric threshold is stable when repeated scroll events land exactly on it", () => {
  const store = getScrollThresholdStore(64);
  let notifications = 0;
  const unsubscribe = store.subscribe(() => {
    notifications += 1;
  });

  fake.scrollTo(64);
  assert.equal(store.getSnapshot(), true);
  assert.equal(notifications, 1);
  fake.scrollTo(64);
  fake.scrollTo(64);
  assert.equal(store.getSnapshot(), true, "still floating on the boundary");
  assert.equal(notifications, 1, "no flip while scrollY sits on the threshold");

  unsubscribe();
});

test("hysteresis: floats at enter and stays floating until scrollY drops below exit", () => {
  const store = getScrollThresholdStore({ enter: 24, exit: 12 });
  const unsubscribe = store.subscribe(() => {});

  fake.scrollTo(23);
  assert.equal(store.getSnapshot(), false, "below enter while docked");
  fake.scrollTo(24);
  assert.equal(store.getSnapshot(), true, "reaches enter");
  fake.scrollTo(18);
  assert.equal(store.getSnapshot(), true, "inside the deadband while floating");
  fake.scrollTo(12);
  assert.equal(store.getSnapshot(), true, "exactly at exit while floating");
  fake.scrollTo(11);
  assert.equal(store.getSnapshot(), false, "drops below exit");
  fake.scrollTo(18);
  assert.equal(store.getSnapshot(), false, "inside the deadband while docked");
  fake.scrollTo(24);
  assert.equal(store.getSnapshot(), true, "reaches enter again");

  unsubscribe();
});

test("listeners fire only when the state flips, not on every scroll", () => {
  const store = getScrollThresholdStore({ enter: 24, exit: 12 });
  let notifications = 0;
  const unsubscribe = store.subscribe(() => {
    notifications += 1;
  });

  fake.scrollTo(5);
  fake.scrollTo(10);
  assert.equal(notifications, 0);
  fake.scrollTo(30);
  assert.equal(notifications, 1);
  fake.scrollTo(20);
  fake.scrollTo(15);
  assert.equal(notifications, 1, "deadband movement is silent");
  fake.scrollTo(0);
  assert.equal(notifications, 2);

  unsubscribe();
});

test("a burst of scroll events is coalesced into one animation frame", () => {
  const store = getScrollThresholdStore({ enter: 24, exit: 12 });
  const unsubscribe = store.subscribe(() => {});

  fake.emitScroll(30);
  fake.emitScroll(40);
  fake.emitScroll(50);
  assert.equal(fake.pendingFrameCount(), 1);
  assert.equal(store.getSnapshot(), false, "state settles on the frame, not the event");
  fake.flushFrames();
  assert.equal(store.getSnapshot(), true);

  unsubscribe();
});

test("before the first subscriber the snapshot uses the enter threshold", () => {
  const store = getScrollThresholdStore({ enter: 24, exit: 12 });

  fake.scrollTo(18);
  assert.equal(store.getSnapshot(), false);
  fake.scrollTo(24);
  assert.equal(store.getSnapshot(), true);
});

test("subscribing while already past enter starts floating", () => {
  const store = getScrollThresholdStore({ enter: 24, exit: 12 });
  fake.scrollTo(40);

  const unsubscribe = store.subscribe(() => {});
  assert.equal(store.getSnapshot(), true);

  unsubscribe();
});

test("equal configs share a store; numeric and object configs do not", () => {
  const object = getScrollThresholdStore({ enter: 24, exit: 12 });
  assert.equal(getScrollThresholdStore({ enter: 24, exit: 12 }), object);
  assert.notEqual(getScrollThresholdStore(24), object);
  assert.notEqual(getScrollThresholdStore({ enter: 24, exit: 24 }), getScrollThresholdStore(24));
});

test("the last unsubscribe removes the scroll listener, pending frame, and cached store", () => {
  const store = getScrollThresholdStore({ enter: 24, exit: 12 });
  const first = store.subscribe(() => {});
  const second = store.subscribe(() => {});
  assert.equal(fake.scrollListenerCount(), 1, "one window listener for both subscribers");

  first();
  assert.equal(fake.scrollListenerCount(), 1);
  assert.equal(getScrollThresholdStore({ enter: 24, exit: 12 }), store, "still cached");

  fake.emitScroll(30);
  assert.equal(fake.pendingFrameCount(), 1);
  second();
  assert.equal(fake.scrollListenerCount(), 0);
  assert.equal(fake.pendingFrameCount(), 0, "pending frame cancelled");
  assert.notEqual(getScrollThresholdStore({ enter: 24, exit: 12 }), store, "cache cleared");
});

test("without a window the snapshot is false", () => {
  const store = getScrollThresholdStore({ enter: 24, exit: 12 });
  fake.uninstall();
  assert.equal(store.getSnapshot(), false);
  // afterEach uninstalls again; deleting a missing property is a no-op.
});
