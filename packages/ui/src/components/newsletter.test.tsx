import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { FooterNewsletterForm } from "./newsletter";

// This form ships in the footer of every blog page, so anything wrong with it is
// wrong ~137 times over. It used to render <button><input type="submit"></button>:
// a nested interactive control whose outer button had no accessible name.
function render(props: Parameters<typeof FooterNewsletterForm>[0] = {}) {
  return renderToStaticMarkup(<FooterNewsletterForm {...props} />);
}

function buttons(html: string) {
  return [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map(
    ([, attributes, inner]) => ({
      attributes,
      inner,
      text: inner
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    }),
  );
}

test("the submit control is a single button with text, not a nested input", () => {
  for (const html of [render(), render({ stacked: true }), render({ blog: true })]) {
    const found = buttons(html);

    assert.equal(found.length, 1, "expected exactly one button in the form");
    assert.doesNotMatch(found[0].inner, /<input/, "a button must not contain an input");
    assert.ok(found[0].text.length > 0, "the submit button needs an accessible name");
    assert.doesNotMatch(html, /<input[^>]*type="submit"/, "the submit input is gone entirely");
  }
});

test("the submit button keeps the field names the newsletter markup posts", () => {
  const [button] = buttons(render());

  assert.match(button.attributes, /type="submit"/);
  assert.match(button.attributes, /name="subscribe"/);
  assert.match(button.attributes, /id="mc-embedded-subscribe"/);
});

test("the button text tracks the submission state wording", () => {
  assert.equal(buttons(render())[0].text, "Subscribe");
  assert.equal(buttons(render({ blog: true }))[0].text, "Sign up");
});

test("the email input is named by its label rather than by an aria-label on the label", () => {
  const html = render();

  const label = /<label\b([^>]*)>([\s\S]*?)<\/label>/.exec(html);
  assert.ok(label, "expected a label around the email input");
  assert.match(label[1], /for="MERGE0"/);
  assert.doesNotMatch(label[1], /aria-label=/, "an aria-label on a <label> names nothing");
  assert.match(label[2], /<span class="sr-only">Email address<\/span>/);

  const input = /<input\b[^>]*id="MERGE0"[^>]*>/.exec(html)?.[0] ?? "";
  assert.match(input, /name="EMAIL"/);
  assert.match(input, /type="email"/);
});
