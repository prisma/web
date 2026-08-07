import {
  NewsletterServiceError,
  NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME,
  isValidNewsletterUnsubscribeToken,
  unsubscribeFromPrismaNewsletter,
} from "@prisma-docs/ui/lib/newsletter-subscription";
import { type NextRequest, NextResponse } from "next/server";

const unsubscribeCookieOptions = {
  httpOnly: true,
  maxAge: 10 * 60,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

function unsubscribePageUrl(request: Request, status: "error" | "invalid" | "success") {
  const url = new URL("/newsletter/unsubscribe", request.url);
  url.searchParams.set("status", status);
  return url;
}

function clearUnsubscribeCookie(response: NextResponse) {
  response.cookies.set(NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME, "", {
    ...unsubscribeCookieOptions,
    maxAge: 0,
  });
  return response;
}

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!isValidNewsletterUnsubscribeToken(token)) {
    return clearUnsubscribeCookie(
      NextResponse.redirect(unsubscribePageUrl(request, "invalid"), 303),
    );
  }

  const response = NextResponse.redirect(new URL("/newsletter/unsubscribe", request.url), 303);
  response.cookies.set(NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME, token, unsubscribeCookieOptions);
  return response;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME)?.value ?? "";
  if (!isValidNewsletterUnsubscribeToken(token)) {
    return clearUnsubscribeCookie(
      NextResponse.redirect(unsubscribePageUrl(request, "invalid"), 303),
    );
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("Newsletter unsubscribe service is missing its Brevo API key");
    return NextResponse.redirect(unsubscribePageUrl(request, "error"), 303);
  }

  try {
    const result = await unsubscribeFromPrismaNewsletter({ apiKey, token });
    const status = result.status === "invalid_token" ? "invalid" : "success";
    return clearUnsubscribeCookie(NextResponse.redirect(unsubscribePageUrl(request, status), 303));
  } catch (error) {
    const details =
      error instanceof NewsletterServiceError
        ? { code: error.code, status: error.status, providerCode: error.providerCode }
        : { code: "unexpected_error" };
    console.error("Newsletter unsubscribe failed", details);
    return NextResponse.redirect(unsubscribePageUrl(request, "error"), 303);
  }
}
