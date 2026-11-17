import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { observeAnimationActivity } from "./animation-activity";

function setup(t: TestContext) {
  const media = Object.assign(new EventTarget(), { matches: true });
  const document = Object.assign(new EventTarget(), { hidden: false });
  let intersection: IntersectionObserverCallback;
  let disconnected = false;
  class Observer {
    constructor(callback: IntersectionObserverCallback) {
      intersection = callback;
    }
    observe() {}
    disconnect() {
      disconnected = true;
    }
  }
  for (const [name, value] of Object.entries({
    window: { matchMedia: () => media },
    document,
    IntersectionObserver: Observer,
  })) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, value });
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    });
  }
  const changes: boolean[] = [];
  const cleanup = observeAnimationActivity({} as Element, (active) => changes.push(active));
  return {
    changes,
    cleanup,
    intersect: (isIntersecting: boolean) =>
      intersection([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver),
    visibility: (hidden: boolean) => {
      document.hidden = hidden;
      document.dispatchEvent(new Event("visibilitychange"));
    },
    motion: (matches: boolean) => {
      media.matches = matches;
      media.dispatchEvent(new Event("change"));
    },
    disconnected: () => disconnected,
  };
}

test("animations run only while visible and allowed by the motion preference", (t) => {
  const activity = setup(t);
  assert.deepEqual(activity.changes, [], "wait for intersection before starting work");
  activity.intersect(true);
  activity.intersect(true);
  activity.visibility(true);
  activity.visibility(false);
  activity.motion(false);
  activity.motion(true);
  activity.intersect(false);
  assert.deepEqual(activity.changes, [true, false, true, false, true, false]);
  activity.cleanup();
});

test("returning to a tab does not restart offscreen or reduced-motion animations", (t) => {
  const activity = setup(t);
  activity.visibility(true);
  activity.intersect(true);
  activity.motion(false);
  activity.visibility(false);
  assert.deepEqual(activity.changes, []);
  activity.motion(true);
  activity.visibility(true);
  activity.intersect(false);
  activity.visibility(false);
  assert.deepEqual(activity.changes, [true, false]);
  activity.cleanup();
});

test("cleanup stops active work and removes preference and visibility listeners", (t) => {
  const activity = setup(t);
  activity.intersect(true);
  activity.cleanup();
  assert.equal(activity.disconnected(), true);
  assert.deepEqual(activity.changes, [true, false]);
  activity.visibility(true);
  activity.visibility(false);
  activity.motion(false);
  activity.motion(true);
  assert.deepEqual(activity.changes, [true, false]);
});
