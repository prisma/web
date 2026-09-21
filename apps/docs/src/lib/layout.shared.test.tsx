import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { FrameworkProvider } from "fumadocs-core/framework";
import type * as PageTree from "fumadocs-core/page-tree";
import { TreeContextProvider } from "@fumadocs/base-ui/contexts/tree";
import { baseOptions } from "./layout.shared";
import { SidebarViewProvider } from "../components/layout/notebook/sidebar-nav";
import { textContent } from "@prisma-docs/ui/lib/html-text";

/**
 * Every anchor the docs shell renders on every page. An anchor whose only child
 * is an image reads as an empty link to a crawler, which is what the September
 * 2026 audit flagged on ~680 pages, so this walks the rendered markup instead of
 * trusting the JSX by eye.
 */
function anchors(html: string) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attributes, inner]) => ({
    attributes,
    text: textContent(inner),
    ariaLabel: /aria-label="([^"]*)"/.exec(attributes)?.[1] ?? "",
    href: /href="([^"]*)"/.exec(attributes)?.[1] ?? "",
  }));
}

const composerSection: PageTree.Folder = {
  $id: "composer",
  type: "folder",
  name: "Composer",
  root: true,
  index: { $id: "composer/index", type: "page", name: "Composer", url: "/composer" },
  children: [],
};

/**
 * Renders the navbar title the way the docs layout does: inside the fumadocs
 * framework and page-tree providers plus the sidebar view provider that the
 * section breadcrumb reads from.
 */
function renderNavTitle(pathname = "/", sections: PageTree.Folder[] = []) {
  const title = baseOptions().nav?.title;
  assert.ok(title, "the docs navbar should render a title");
  assert.ok(typeof title !== "function", "the docs navbar title should be static markup");
  const tree: PageTree.Root = { $id: "root", name: "Docs", children: sections };

  return renderToStaticMarkup(
    <FrameworkProvider
      usePathname={() => pathname}
      useParams={() => ({})}
      useRouter={() => ({ push() {}, refresh() {} })}
    >
      <TreeContextProvider tree={tree}>
        <SidebarViewProvider>{title}</SidebarViewProvider>
      </TreeContextProvider>
    </FrameworkProvider>,
  );
}

test("every anchor in the docs navbar title has an accessible name", () => {
  const found = anchors(renderNavTitle());

  assert.equal(found.length, 2, "expected the Prisma lockup and the docs wordmark");
  for (const anchor of found) {
    assert.ok(
      anchor.text.length > 0 || anchor.ariaLabel.length > 0,
      `anchor to "${anchor.href}" has neither text content nor an aria-label`,
    );
  }
});

test("the Prisma lockup link is named for both assistive tech and text-only crawlers", () => {
  const lockup = anchors(renderNavTitle()).find((a) => a.href === "https://www.prisma.io");

  assert.ok(lockup, "expected a link to www.prisma.io");
  assert.equal(lockup.ariaLabel, "Prisma home");
  assert.equal(lockup.text, "Prisma home", "expected visually hidden anchor text");
});

test("the docs wordmark link keeps its visible text but is no longer a generic anchor", () => {
  const html = renderNavTitle();
  const wordmark = anchors(html).find((a) => a.href === "/");

  assert.ok(wordmark, "expected a link to the docs root");
  assert.equal(wordmark.ariaLabel, "Prisma documentation home");
  assert.ok(
    wordmark.text.startsWith("docs"),
    `expected the visible "docs" wordmark, got "${wordmark.text}"`,
  );
  assert.ok(
    html.includes('<span class="sr-only">Prisma documentation home</span>'),
    "expected a visually hidden, specific anchor text",
  );
});

test("the lockup images are decorative and keep their alt text", () => {
  const images = [...renderNavTitle().matchAll(/<img\b([^>]*)>/g)].map(
    ([, attributes]) => attributes,
  );

  assert.equal(images.length, 3, "expected the light and dark lockup plus the square mark");
  for (const attributes of images) {
    assert.match(attributes, /alt="Prisma"/);
    assert.match(attributes, /aria-hidden="true"/);
    assert.doesNotMatch(attributes, /aria-label=/, "the link names itself, the image should not");
  }
});

test("the section breadcrumb is a named link to the section", () => {
  const found = anchors(renderNavTitle("/composer/quickstart", [composerSection]));

  assert.equal(found.length, 3, "expected the lockup, the wordmark, and the section crumb");
  assert.deepEqual(found.map((a) => [a.href, a.text]).at(-1), ["/composer", "Composer"]);
});
