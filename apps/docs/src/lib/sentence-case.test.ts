import assert from "node:assert/strict";
import { test } from "node:test";

import { sentenceCase } from "./sentence-case";

test("lowercases ordinary words after the first", () => {
  assert.equal(sentenceCase("Getting Started"), "Getting started");
  assert.equal(sentenceCase("Data Modeling"), "Data modeling");
});

test("keeps acronyms and mixed-case names", () => {
  assert.equal(sentenceCase("REST API Reference"), "REST API reference");
  assert.equal(sentenceCase("New App With PostgreSQL"), "New app with PostgreSQL");
  assert.equal(sentenceCase("Use MongoDB From GitHub"), "Use MongoDB from GitHub");
  assert.equal(sentenceCase("ORM 6 to 8 (MongoDB)"), "ORM 6 to 8 (MongoDB)");
});

test("keeps product phrases whole", () => {
  assert.equal(sentenceCase("Prisma Postgres"), "Prisma Postgres");
  assert.equal(sentenceCase("Query Insights"), "Query Insights");
  assert.equal(sentenceCase("Deploy To Cloudflare Workers"), "Deploy to Cloudflare Workers");
  assert.equal(sentenceCase("Using Prisma Client Extensions"), "Using Prisma Client extensions");
});

test("keeps proper nouns, ignoring punctuation", () => {
  assert.equal(sentenceCase("Deploy To Vercel"), "Deploy to Vercel");
  assert.equal(sentenceCase("Connect (Postgres), Next.js"), "Connect (Postgres), Next.js");
});
