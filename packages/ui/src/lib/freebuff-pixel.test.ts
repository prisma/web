import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  FREEBUFF_QUEUE_STUB,
  FREEBUFF_TAG_SRC,
  loadFreebuffPixel,
  rememberBfcid,
  resetSessionBfcid,
  withSessionBfcid,
} from "./freebuff-pixel";
import { securityHeaders } from "../../security-headers.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../../..");

/** Installs a fake browser for loadFreebuffPixel and returns what it did. */
function withFakeBrowser(href: string, run: () => void) {
  const appended: Record<string, unknown>[] = [];
  const replaced: string[] = [];
  const fakeWindow: Record<string, any> = {
    location: new URL(href),
    history: {
      state: { tree: 1 },
      replaceState: (_state: unknown, _title: string, url: string) => {
        replaced.push(url);
        fakeWindow.location = new URL(url);
      },
    },
  };
  const fakeDocument = {
    querySelector: () => (appended.length ? appended[0] : null),
    createElement: () => ({ setAttribute() {} }),
    head: { appendChild: (node: Record<string, unknown>) => appended.push(node) },
  };
  const saved = ["window", "document"].map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ]);
  Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });
  Object.defineProperty(globalThis, "document", { configurable: true, value: fakeDocument });
  try {
    run();
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key as string, descriptor);
      else Reflect.deleteProperty(globalThis, key as string);
    }
  }
  return { appended, replaced, window: fakeWindow };
}

test("the queue stub is Freebuff's snippet and queues calls before the tag loads", () => {
  const fakeWindow: Record<string, any> = {};
  new Function("window", FREEBUFF_QUEUE_STUB)(fakeWindow);
  fakeWindow.freebuff("conversion", "signup_completed", { eventId: "signup_completed:1" });
  assert.deepEqual(Array.from(fakeWindow.freebuff.q[0]), [
    "conversion",
    "signup_completed",
    { eventId: "signup_completed:1" },
  ]);
  assert.equal(
    FREEBUFF_TAG_SRC,
    "https://freebuff.com/freebuff-tag.v2.js?t=fbt_xr5SWt5bTx2J5xzmgUW5uQ",
  );
});

test("loads the async tag once, after creating the queue", () => {
  resetSessionBfcid();
  const run = withFakeBrowser("https://www.prisma.io/lp/postgres", () => {
    assert.equal(loadFreebuffPixel(), true);
    assert.equal(loadFreebuffPixel(), false);
  });
  assert.equal(run.appended.length, 1);
  assert.equal(run.appended[0]?.src, FREEBUFF_TAG_SRC);
  assert.equal(run.appended[0]?.async, true);
  assert.equal(typeof run.window.freebuff, "function");
  assert.deepEqual(run.replaced, []);
});

test("restores the landing bfcid after client-side navigation dropped it", () => {
  resetSessionBfcid();
  rememberBfcid("?utm_source=freebuff&bfcid=signed.click.id");
  rememberBfcid("?other=1");
  const run = withFakeBrowser("https://www.prisma.io/pricing?plan=pro#faq", () => {
    loadFreebuffPixel();
  });
  assert.deepEqual(run.replaced, [
    "https://www.prisma.io/pricing?plan=pro&bfcid=signed.click.id#faq",
  ]);
});

test("leaves a URL that already carries a bfcid alone", () => {
  resetSessionBfcid();
  rememberBfcid("?bfcid=old");
  assert.equal(withSessionBfcid("https://www.prisma.io/?bfcid=new"), null);
  resetSessionBfcid();
  assert.equal(withSessionBfcid("https://www.prisma.io/"), null);
});

test("the shared CSP allows the Freebuff tag and its requests", () => {
  const policy = securityHeaders.find(({ key }) => key === "Content-Security-Policy")?.value ?? "";
  assert.match(policy.match(/script-src[^;]*;/)?.[0] ?? "", /https:\/\/freebuff\.com/);
  assert.match(policy.match(/connect-src[^;]*;/)?.[0] ?? "", /https:\/\/freebuff\.com/);
});

test("the site layout mounts the Freebuff pixel once", () => {
  const source = readFileSync(join(repoRoot, "apps/site/src/app/layout.tsx"), "utf8");
  assert.equal(source.split("<FreebuffPixel />").length - 1, 1);
  assert.doesNotMatch(source, /freebuff-tag/);
});
