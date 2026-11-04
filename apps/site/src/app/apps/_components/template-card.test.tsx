import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { GalleryTemplate } from "../_lib/catalog";
import { PRISMA_AUTHOR } from "../_lib/catalog";
import { TemplateCard } from "./template-card";

function template(overrides: Partial<GalleryTemplate>): GalleryTemplate {
  return {
    id: "room-booking",
    name: "Room Booking",
    description: "Book a room.",
    path: "compute/room-booking",
    sourceUrl: "https://github.com/prisma/prisma-examples/tree/latest/compute/room-booking",
    deployUrl:
      "https://console.prisma.io/apps/room-booking?utm_source=website&utm_medium=templates",
    pagePath: "/apps/room-booking",
    framework: { id: "nextjs", label: "Next.js" },
    author: {
      name: "Mohammed Obaid",
      href: "https://github.com/mdobaid311",
      logo: null,
    },
    category: "app",
    useCase: "Booking",
    stack: [],
    publishedAt: null,
    isNew: false,
    featuredRank: 1,
    popularRank: null,
    preview: null,
    manifestIndex: 0,
    ...overrides,
  };
}

test("a community byline uses the GitHub profile photo and leaves View source alone", () => {
  const html = renderToStaticMarkup(<TemplateCard template={template({})} />);

  assert.match(html, /src="https:\/\/github\.com\/mdobaid311\.png"/);
  assert.match(html, /href="https:\/\/github\.com\/mdobaid311"/);
  assert.match(html, /Mohammed Obaid/);
  assert.match(html, />by</);
  assert.doesNotMatch(html, /logo-mark\.svg/);
  assert.match(html, /View source/);
  assert.match(
    html,
    /href="https:\/\/github\.com\/prisma\/prisma-examples\/tree\/latest\/compute\/room-booking"/,
  );
  assert.match(html, /class="[^"]*size-3\.5[^"]*"/);
});

test("a Prisma byline keeps the Prisma mark", () => {
  const html = renderToStaticMarkup(
    <TemplateCard template={template({ id: "hono", name: "Hono API", author: PRISMA_AUTHOR })} />,
  );

  assert.match(html, /src="\/brand-kit\/logo-mark\/logo-mark\.svg"/);
  assert.doesNotMatch(html, /github\.com\/prisma\.png/);
  assert.match(html, /href="https:\/\/github\.com\/prisma"/);
  assert.match(html, />Prisma</);
  assert.match(html, /View source/);
});

test("a community author with no GitHub profile gets the GitHub mark, not Prisma", () => {
  const html = renderToStaticMarkup(
    <TemplateCard
      template={template({
        author: { name: "Acme", href: "https://acme.example", logo: null },
      })}
    />,
  );

  assert.doesNotMatch(html, /logo-mark\.svg/);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /<svg/);
  assert.match(html, />Acme</);
});

test("the preview and the name open the template's page, the button deploys", () => {
  const html = renderToStaticMarkup(<TemplateCard template={template({})} />);

  assert.equal(html.match(/href="\/apps\/room-booking"/g)?.length, 2);
  assert.match(
    html,
    /href="https:\/\/console\.prisma\.io\/apps\/room-booking[^"]*"[^>]*>(?:<span[^>]*>)?Use this app/,
  );
});
