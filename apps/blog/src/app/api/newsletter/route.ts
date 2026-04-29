import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedOrigins = new Set(["https://prisma.io", "https://www.prisma.io"]);

function getCorsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowOrigin = allowedOrigins.has(origin) ? origin : "https://prisma.io";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: getCorsHeaders(request), status: 200 });
}

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request);

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Check for required environment variable
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error("Missing Brevo API key");
      return NextResponse.json(
        { error: "Newsletter service is not configured" },
        { status: 500, headers: corsHeaders },
      );
    }

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          EMAIL: email,
          SOURCE: "website",
        },
        includeListIds: [15],
        templateId: 36,
        redirectionUrl: "https://prisma.io",
      }),
    };

    const response = await fetch(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
      options,
    );

    // Get response text first to check if it's empty
    const responseText = await response.text();

    let data: any = null;

    // Only try to parse JSON if there's actual content
    if (responseText && responseText.length > 0) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse Brevo response:", {
          text: responseText,
          status: response.status,
          parseError,
        });

        // If response was successful but JSON parse failed, treat as success
        if (response.ok) {
          return NextResponse.json(
            { message: "Please check your email to confirm subscription" },
            { status: 200, headers: corsHeaders },
          );
        }

        return NextResponse.json(
          { error: "Invalid response from newsletter service" },
          { status: 500, headers: corsHeaders },
        );
      }
    }

    // Handle error responses
    if (!response.ok) {
      console.error("Brevo error:", {
        status: response.status,
        statusText: response.statusText,
        data,
        email,
      });

      // Handle specific Brevo errors
      if (data?.code === "duplicate_parameter" || data?.message?.includes("already exists")) {
        return NextResponse.json(
          { message: "Already subscribed", alreadySubscribed: true },
          { status: 200, headers: corsHeaders },
        );
      }

      return NextResponse.json(
        {
          error: data?.message || "Failed to subscribe. Please try again later.",
          debug:
            process.env.NODE_ENV === "development"
              ? {
                  status: response.status,
                  statusText: response.statusText,
                  brevoError: data,
                  responseText,
                }
              : undefined,
        },
        { status: 500, headers: corsHeaders },
      );
    }

    // Success - Brevo may return empty body on success
    return NextResponse.json(
      { message: "Please check your email to confirm subscription" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: errorMessage,
        debug:
          process.env.NODE_ENV === "development"
            ? {
                errorType: error instanceof Error ? error.constructor.name : typeof error,
                stack: error instanceof Error ? error.stack : undefined,
              }
            : undefined,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { ...getCorsHeaders(request), Allow: "POST, OPTIONS" } },
  );
}
