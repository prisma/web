import assert from "node:assert/strict";
import test from "node:test";
import Link from "next/link";
import { containsLink, extractText, headingAnchorId } from "./heading-anchor";

test("extractText flattens strings, numbers, arrays and elements", () => {
  assert.equal(extractText("Indexes"), "Indexes");
  assert.equal(extractText(42), "42");
  assert.equal(extractText(["Bloom ", <code key="c">indexes</code>]), "Bloom indexes");
  assert.equal(extractText(null), "");
  assert.equal(extractText(undefined), "");
});

test("headingAnchorId slugifies the heading text", () => {
  assert.equal(headingAnchorId("Why Postgres, really?"), "why-postgres-really");
  assert.equal(headingAnchorId(["Bloom ", <code key="c">indexes</code>]), "bloom-indexes");
});

test("containsLink finds a plain anchor anywhere in the heading", () => {
  assert.equal(containsLink("Just text"), false);
  assert.equal(containsLink(<code>prisma.schema</code>), false);
  assert.equal(containsLink(<a href="/blog">Read this</a>), true);
  assert.equal(
    containsLink([
      "Read ",
      <a key="a" href="/blog">
        this
      </a>,
      " first",
    ]),
    true,
  );
  assert.equal(
    containsLink(
      <span>
        <em>
          <a href="/blog">deep</a>
        </em>
      </span>,
    ),
    true,
  );
});

test("containsLink also finds link components that are not literal anchors", () => {
  // MDX links render through fumadocs' `createRelativeLink` override, not as a
  // bare `a`, so anything with an href has to count as a link.
  function RelativeLink(props: { href: string; children?: React.ReactNode }) {
    return <a {...props} />;
  }

  assert.equal(containsLink(<RelativeLink href="/blog/a-post">A post</RelativeLink>), true);
  assert.equal(containsLink(<Link href="/blog/a-post">A post</Link>), true);
});
