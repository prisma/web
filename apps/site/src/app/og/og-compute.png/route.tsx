import { createOGImageResponse } from "@/lib/og-image";

export const revalidate = false;

export async function GET() {
  return createOGImageResponse({
    badge: "Prisma Compute",
    title: "Deploy TypeScript apps on Bun",
    description:
      "Push code, it runs. APIs and AI agents run as long-lived Bun processes next to Prisma Postgres, with long-running requests and streaming.",
    footer: "prisma.io/compute",
  });
}
