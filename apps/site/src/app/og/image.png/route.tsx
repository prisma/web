import { createOGImageResponse } from "@/lib/og-image";

export const revalidate = false;

export async function GET() {
  return createOGImageResponse({
    badge: "Blog",
    title: "Prisma Blog",
    description:
      "Guides, announcements, and articles about Prisma, ORMs, databases, and the data access layer.",
    footer: "prisma.io/blog",
  });
}
