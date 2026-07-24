export const deployTerminalLines = [
  "Deploying my-app / remove-legacy-name / web",
  "◇ Creating branch database…",
  "✔ Created branch database",
  "✔ Added branch env: DATABASE_URL",
  "Building locally…  Built",
  "Uploading…  Uploaded",
  "Deploying…  Deployed",
  "✔ Live in 4.2s",
  "  https://remove-legacy-name.my-app.prisma.build",
];

export const expandContractBefore = `model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String

  @@map("user")
}`;

export const expandContractAfter = `model User {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  // !mark
  displayName String? // new, nullable so old code keeps working
  name        String  // old, production still reads this

  @@map("user")
}`;

export const expandTerminalLines = [
  "✔ Planned 1 operation(s)",
  "│",
  '└─ Add column "displayName" to "user"',
  "",
  "DDL preview",
  "",
  'ALTER TABLE "public"."user" ADD COLUMN "displayName" text;',
];

export const contractContractBefore = `model User {
  id          Int    @id @default(autoincrement())
  email       String @unique
  displayName String
  name        String // no code reads this anymore

  @@map("user")
}`;

export const contractContractAfter = `model User {
  id          Int    @id @default(autoincrement())
  email       String @unique
  // !mark
  displayName String

  @@map("user")
}`;

export const contractTerminalLines = [
  "✔ Planned 1 operation(s)",
  "│",
  '└─ Drop column "name" from "user" (destructive)',
  "",
  "⚠ This migration contains destructive operations that may cause data loss.",
  "",
  "DDL preview",
  "",
  'ALTER TABLE "public"."user" DROP COLUMN "name";',
];
