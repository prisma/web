import { createPageMetadata } from "@/lib/page-metadata";
import { FREE_POSTGRES_DESCRIPTION, FREE_POSTGRES_PATH, FREE_POSTGRES_TITLE } from "./_content";
import { FreePostgresPage } from "./_sections";

export const metadata = createPageMetadata({
  title: FREE_POSTGRES_TITLE,
  description: FREE_POSTGRES_DESCRIPTION,
  path: FREE_POSTGRES_PATH,
  ogKicker: "Prisma Postgres",
  ogAccent: "yellow",
});

export default function FreePostgresqlDatabasePage() {
  return <FreePostgresPage />;
}
