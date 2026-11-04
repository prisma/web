import assert from "node:assert/strict";
import test from "node:test";
import { categoriesForTags, categoryForTags } from "./changelog-meta";

test("an entry belongs to every product area its tags name", () => {
  assert.deepEqual(categoriesForTags(["Prisma", "Prisma Compute", "Prisma Postgres"]), [
    "compute",
    "postgres",
  ]);
  assert.deepEqual(categoriesForTags(["Prisma ORM", "Prisma Postgres", "Prisma Studio"]), [
    "studio",
    "postgres",
    "orm",
  ]);
});

test("the colouring area is the most specific one", () => {
  assert.equal(categoryForTags(["Prisma ORM", "Prisma Postgres"]), "postgres");
  assert.equal(categoryForTags(["Prisma Postgres", "Prisma Compute"]), "compute");
  assert.equal(categoryForTags(["Accelerate", "Pulse"]), "postgres");
});

test("tags that name no product are platform-wide", () => {
  assert.deepEqual(categoriesForTags(["Prisma", "REST API"]), ["platform"]);
  // "Platform" contains "orm"; it must not read as an ORM tag.
  assert.deepEqual(categoriesForTags(["Prisma Compute", "Platform"]), ["compute"]);
  assert.deepEqual(categoriesForTags(["Platform"]), ["platform"]);
  assert.deepEqual(categoriesForTags(), ["platform"]);
  assert.equal(categoryForTags(["MCP"]), "platform");
});
