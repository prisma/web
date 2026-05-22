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

export const queryBefore = `const books = await db.orm.Book.all();`;

export const queryAfter = `// !mark
const books = await db.orm.Book.where((b) => b.addedAt.gte(oneWeekAgo))
  // !mark
  .include("author", (author) => author)
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
  "→ Loading recipe: prisma-next 0.10 → 0.11",
  "→ Applying codemod: wrap single-object .insert({}) calls as array inserts",
  "✓ Updated 3 files in src/",
  "→ Running: pnpm install prisma-next@0.11.0",
  "✓ Re-emitted contract",
  "✓ Verified: contract still type-checks",
  "✓ Upgraded to prisma-next@0.11.0",
];
