import { NextResponse } from "next/server";
import {
  NewsletterServiceError,
  isValidNewsletterEmail,
  subscribeToPrismaNewsletter,
  type NewsletterSource,
} from "./newsletter-subscription";

type NewsletterRouteOptions = {
  allowedOrigins: readonly string[];
  source: NewsletterSource;
};

function getCorsHeaders(request: Request, allowedOrigins: readonly string[]) {
  const origin = request.headers.get("origin") ?? "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export function createNewsletterRoute({ allowedOrigins, source }: NewsletterRouteOptions) {
  if (allowedOrigins.length === 0) {
    throw new Error("At least one newsletter CORS origin is required");
  }

  return {
    OPTIONS(request: Request) {
      return NextResponse.json(
        {},
        { headers: getCorsHeaders(request, allowedOrigins), status: 200 },
      );
    },

    async POST(request: Request) {
      const corsHeaders = getCorsHeaders(request, allowedOrigins);

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "A valid JSON body is required" },
          { status: 400, headers: corsHeaders },
        );
      }

      const email =
        typeof body === "object" && body !== null && "email" in body ? body.email : undefined;

      if (typeof email !== "string" || !isValidNewsletterEmail(email.trim())) {
        return NextResponse.json(
          { error: "A valid email address is required" },
          { status: 400, headers: corsHeaders },
        );
      }

      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        console.error("Newsletter service is missing its Brevo API key");
        return NextResponse.json(
          { error: "Newsletter service is not configured" },
          { status: 500, headers: corsHeaders },
        );
      }

      try {
        const result = await subscribeToPrismaNewsletter({ apiKey, email, source });

        if (!result.welcomeSent && result.status === "subscribed") {
          console.warn("Newsletter subscription completed without welcome email", {
            source,
            ...result.welcomeFailure,
          });
        }

        if (result.status === "already_subscribed") {
          return NextResponse.json(
            { message: "Already subscribed", alreadySubscribed: true },
            { status: 200, headers: corsHeaders },
          );
        }

        return NextResponse.json(
          { message: "Subscribed to the Prisma newsletter" },
          { status: 200, headers: corsHeaders },
        );
      } catch (error) {
        const details =
          error instanceof NewsletterServiceError
            ? { code: error.code, status: error.status, providerCode: error.providerCode, source }
            : { code: "unexpected_error", source };
        console.error("Newsletter subscription failed", details);

        return NextResponse.json(
          { error: "Failed to subscribe. Please try again later." },
          { status: 500, headers: corsHeaders },
        );
      }
    },

    GET(request: Request) {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        {
          status: 405,
          headers: { ...getCorsHeaders(request, allowedOrigins), Allow: "POST, OPTIONS" },
        },
      );
    },
  };
}
