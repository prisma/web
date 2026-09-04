import { createNewsletterRoute } from "@prisma-docs/ui/lib/newsletter-route";

export const dynamic = "force-dynamic";

const route = createNewsletterRoute({
  allowedOrigins: ["https://prisma.io", "https://www.prisma.io"],
  source: "docs",
});

export const { GET, OPTIONS, POST } = route;
