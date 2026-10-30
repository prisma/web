export const deployTerminalLines = [
  "my-app",
  "├─ db    postgres-database db_def456",
  "└─ web   compute-service cps_abc123",
  "         https://xyz.ewr.prisma.build",
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
  "",
  "migrations/app/20260724T1000_add_display_name",
  '└─ Add column "displayName" to "user"',
  "",
  "ℹ DDL preview",
  "",
  'ALTER TABLE "public"."user" ADD COLUMN "displayName" text;',
];

export const contractContractBefore = `model User {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  displayName String
  name        String? // no query reads or writes this since step 4

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
  "",
  "migrations/app/20260724T1200_drop_legacy_name",
  '└─ ⚠ Drop column "name" from "user"',
  "",
  "⚠ This migration contains destructive operations that may cause data loss.",
  "",
  "ℹ DDL preview",
  "",
  'ALTER TABLE "public"."user" DROP COLUMN "name";',
];
