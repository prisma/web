import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

/**
 * `ImageZoom` (used for every MDX image in docs and in the blog) wraps
 * `react-medium-image-zoom`, which used to server-render
 * `aria-owns="rmiz-modal-"` — an IDREF with an empty suffix, because the id was
 * only assigned on mount, pointing at a dialog that does not exist until the
 * image is zoomed. The copy this repo resolves (react-medium-image-zoom 5.4.9,
 * bundled inside @fumadocs/base-ui) no longer emits it. This test keeps it that
 * way across dependency bumps instead of trusting a changelog.
 */
function render() {
  return renderToStaticMarkup(
    <ImageZoom src="/docs-static/example.png" alt="An example" width={640} height={480} />,
  );
}

test("ImageZoom's server markup carries no aria-owns", () => {
  assert.doesNotMatch(render(), /aria-owns/);
});

test("every IDREF in ImageZoom's server markup resolves to a rendered element", () => {
  const html = render();
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));

  for (const [, attribute, value] of html.matchAll(
    /\b(aria-owns|aria-controls|aria-labelledby|aria-describedby)="([^"]*)"/g,
  )) {
    for (const idref of value.split(/\s+/).filter(Boolean)) {
      assert.ok(ids.has(idref), `${attribute} references "${idref}", which is not rendered`);
    }
  }
});
