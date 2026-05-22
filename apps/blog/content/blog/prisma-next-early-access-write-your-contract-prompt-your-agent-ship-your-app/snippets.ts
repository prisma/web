export const contractBeforeAuthor = `model Book {
  id       String   @id @default(uuid())
  title    String
  author   String
  addedAt  DateTime @default(now())
}`;

export const contractAfterAuthor = `model Book {
  id        String   @id @default(uuid())
  title     String
  // !mark
  author    Author   @relation(fields: [authorId], references: [id])
  // !mark
  authorId  String
  addedAt   DateTime @default(now())
}

// !mark
model Author {
  // !mark
  id    String  @id @default(uuid())
  // !mark
  name  String
  // !mark
  bio   String?
  // !mark
  books Book[]
  // !mark
}`;

export const queryBefore = `const books = await db.orm.Book
  .where({ addedThisWeek: true })
  .all();`;

export const queryAfter = `// !mark
const books = await db.orm.Book
  // !mark
  .where((b) => b.addedAt.gte(oneWeekAgo))
  // !mark
  .include("author")
  // !mark
  .orderBy((b) => b.addedAt.desc())
  // !mark
  .all();`;

export const contractBeforePublished = `model Book {
  id        String   @id @default(uuid())
  title     String
  author    Author   @relation(fields: [authorId], references: [id])
  authorId  String
  addedAt   DateTime @default(now())
}`;

export const contractAfterPublished = `model Book {
  id           String    @id @default(uuid())
  title        String
  author       Author    @relation(fields: [authorId], references: [id])
  authorId     String
  addedAt      DateTime  @default(now())
  // !mark
  publishedAt  DateTime?
}`;

export const migrationTerminalLines = [
  "→ Comparing emitted contract against latest on-disk migration",
  "→ Planned 1 operation: addColumn book.publishedAt (timestamptz, nullable)",
  "✓ Wrote migrations/app/20260515T0900_add_book_published_at/migration.ts",
];

export const upgradeTerminalLines = [
  "→ Loaded prisma-next-upgrade skill",
  "→ Detected current: 0.10.0    target: 0.11.0",
  "→ Reading upgrades/0.10-to-0.11/instructions.md",
  "→ Plan: wrap single-row .insert({...}) calls in arrays",
  "→ Bumping @prisma-next/* to 0.11.0 in package.json",
  "$ pnpm install",
  "✓ Lockfile updated",
  "→ Applying codemod across src/",
  "✓ Updated 3 files",
  "$ pnpm typecheck && pnpm test",
  "✓ Type check passed, tests green",
  "$ git commit -am 'chore: prisma-next 0.10 → 0.11'",
];
