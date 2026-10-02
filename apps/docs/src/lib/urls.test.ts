import assert from "node:assert/strict";
import test from "node:test";
import { withMarkdownPath } from "./urls";

test("nested pages get the docs base path and an .mdx extension", () => {
  assert.equal(withMarkdownPath("/orm/prisma-client"), "/docs/orm/prisma-client.mdx");
  assert.equal(withMarkdownPath("/docs/orm/prisma-client"), "/docs/orm/prisma-client.mdx");
});

test("the root page is /docs/index.mdx, because /docs.mdx is outside the app's basePath", () => {
  assert.equal(withMarkdownPath("/"), "/docs/index.mdx");
  assert.equal(withMarkdownPath("/docs"), "/docs/index.mdx");
  assert.equal(withMarkdownPath("/", "md"), "/docs/index.md");
});
