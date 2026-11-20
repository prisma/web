import assert from "node:assert/strict";
import { test } from "node:test";
import { assertIndexable } from "./indexability.ts";

test("public-host verification still rejects ingress robots exclusions", () => {
  for (const value of [
    "noindex",
    "NoNe",
    "googlebot: noindex, nofollow",
    "googlebot: none",
    "googlebot : none",
    "index, bingbot: none",
    "max-image-preview: none, noindex",
    "googlebot: max-image-preview: none, none",
  ])
    assert.throws(
      () => assertIndexable(new Headers({ "x-robots-tag": value }), "<html></html>", "/"),
      /indexable/,
    );
});

test("clean headers cannot hide robots meta exclusions", () => {
  for (const meta of [
    '<meta name="robots" content="noindex, nofollow">',
    "<META CONTENT='NONE' NAME='ROBOTS' />",
    '<meta content="no&#105;ndex" name="robots">',
    "<meta name=robots content=noindex>",
    '<meta name="googlebot" content="noindex">',
    '<meta name="googlebot-news" content="none">',
    '<meta name="bingbot" content="none">',
  ])
    assert.throws(
      () => assertIndexable(new Headers(), `<html><head>${meta}</head></html>`, "/docs/composer"),
      /robots metadata/,
    );
});

test("all actual meta tags are checked, including restrictive duplicates and streamed body metadata", () => {
  const html =
    '<html><head><meta name="robots" content="index, follow"></head><body><meta name="robots" content="noindex"></body></html>';
  assert.throws(() => assertIndexable(new Headers(), html, "/blog"), /robots metadata/);
});

test("indexable pages, preview-image restrictions and literal examples remain allowed", () => {
  const html = `<html><head>
    <meta name="robots" content="index, follow, max-image-preview: none">
    <meta name="googlebot" content="noimageindex, nosnippet">
    <meta name="description" content="noindex or none">
    <!-- <meta name="robots" content="noindex"> -->
    <script>const example = '<meta name="robots" content="noindex">';</script>
  </head><body>&lt;meta name="robots" content="noindex"&gt;</body></html>`;
  assert.doesNotThrow(() =>
    assertIndexable(new Headers({ "x-robots-tag": "index, follow" }), html, "/"),
  );
  assert.doesNotThrow(() => assertIndexable(new Headers(), "<html><head></head></html>", "/"));
  for (const value of [
    "max-image-preview: none",
    " max-image-preview : none ",
    "index, max-image-preview: none",
    "MAX-IMAGE-PREVIEW: NONE, noimageindex",
    "googlebot: max-image-preview: none",
  ])
    assert.doesNotThrow(() => assertIndexable(new Headers({ "x-robots-tag": value }), html, "/"));
});
