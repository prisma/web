// Captured from a real `@prisma/cli@latest app deploy --db` run.
// The agent reads the project and detects the build, wires a branch
// database, applies the schema, builds, uploads, and ships an
// immutable preview, all from one command.
export const deployTerminalLines = [
  "✔ Linked ./guestbook to project compute-guestbook-demo",
  "Deploying compute-guestbook-demo / add-guestbook / guestbook",
  "  Build command   bun run build",
  "  Output          .",
  "◇ Creating branch database…",
  "✔ Created branch database",
  "◇ Applying schema with prisma db push…",
  "✔ Database in sync with prisma/schema.prisma",
  "✔ Added branch env: DATABASE_URL, DIRECT_URL",
  "Building locally…  Built",
  "Uploading…  Uploaded",
  "Deploying…  Deployed",
  "✔ Live in 4.5s",
  "  https://add-guestbook.guestbook.prisma.build",
];
