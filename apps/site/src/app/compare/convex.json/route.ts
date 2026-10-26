import { NextResponse } from "next/server";
import { getConvexFacts } from "../convex/facts";

/** Machine-readable comparison facts, each value with a source URL and dateChecked. */
export function GET() {
  return NextResponse.json(getConvexFacts(), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
