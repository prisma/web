import { NextResponse } from "next/server";
import { getVercelNeonDrizzleFacts } from "../vercel-neon-drizzle/facts";

/** Machine-readable comparison facts, each value with a source URL and dateChecked. */
export function GET() {
  return NextResponse.json(getVercelNeonDrizzleFacts(), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
