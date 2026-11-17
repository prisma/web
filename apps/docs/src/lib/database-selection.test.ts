import assert from "node:assert/strict";
import test from "node:test";
import { escapeTabValue } from "@prisma/eclipse";
import {
  databaseFromTabValue,
  getDatabaseSelection,
  getDatabaseTabValue,
  getDatabaseUrl,
  normalizeDatabase,
} from "./database-selection";

test("explicit links override saved preferences, including invalid saved values", () => {
  assert.equal(getDatabaseSelection("?db=postgresql", "mongodb"), "postgresql");
  assert.equal(getDatabaseSelection("?db=mongodb", "invalid"), "mongodb");
  assert.equal(getDatabaseSelection("?db=invalid", "mongodb"), "mongodb");
  assert.equal(getDatabaseSelection("?utm_source=data-guide", "mysql"), "mysql");
  assert.equal(getDatabaseSelection("", null), null);
});

test("database IDs accept common tab labels and link aliases", () => {
  for (const [label, id] of [
    ["PostgreSQL", "postgresql"],
    [" Postgres ", "postgresql"],
    ["MongoDB", "mongodb"],
    ["MySQL", "mysql"],
    ["SQLite", "sqlite"],
    ["SQL Server", "sqlserver"],
    ["mssql", "sqlserver"],
    ["CockroachDB", "cockroachdb"],
  ]) {
    assert.equal(normalizeDatabase(label), id);
  }
  assert.equal(normalizeDatabase("TypeScript"), null);
  assert.equal(normalizeDatabase("npm"), null);
});

test("available examples follow the preference regardless of tab order", () => {
  assert.equal(getDatabaseTabValue(["MongoDB", "PostgreSQL"], "postgresql"), "PostgreSQL");
  assert.equal(
    getDatabaseTabValue(["PostgreSQL", "MongoDB", "MySQL", "SQLite", "SQL Server"], "sqlite"),
    "SQLite",
  );
});

test("missing database examples fall back to the authored default", () => {
  const values = ["PostgreSQL", "MongoDB"];
  assert.equal(getDatabaseTabValue(values, "mysql", "MongoDB"), "MongoDB");
  assert.equal(getDatabaseTabValue(values, "mysql", "missing"), "PostgreSQL");
  assert.equal(getDatabaseTabValue([], "mongodb"), undefined);
});

test("Radix's escaped tab IDs map back to stable preference values", () => {
  const values = ["PostgreSQL", "MongoDB", "SQL Server"];
  for (const value of values) {
    assert.equal(databaseFromTabValue(escapeTabValue(value), values), normalizeDatabase(value));
  }
  assert.equal(databaseFromTabValue("npm", values), null);
});

test("changing the database preserves anchors and other query parameters", () => {
  assert.equal(
    getDatabaseUrl(
      "https://www.prisma.io/docs/orm/fundamentals/reading-data?utm_source=data-guide&db=mongodb#example-schema",
      "postgresql",
    ),
    "/docs/orm/fundamentals/reading-data?utm_source=data-guide&db=postgresql#example-schema",
  );
});
