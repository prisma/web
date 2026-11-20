import assert from "node:assert/strict";
import test from "node:test";
import { buildSiteRef } from "@prisma-docs/ui/lib/utm";
import { UtmPersistence } from "./utm-persistence";

// Docs is served under `/docs`, so the pathname the click handler passes in
// already carries the prefix and the ref names the full prisma.io page.
test("docs opts in to the page ref on Console links", () => {
  const { props } = UtmPersistence();

  assert.equal(props.basePath, "/docs");
  assert.equal(props.consolePageRef, buildSiteRef);
  assert.equal(
    props.consolePageRef("/docs/postgres/import-from-existing-database"),
    "prisma.io/docs/postgres/import-from-existing-database",
  );
});
