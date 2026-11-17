import { NextResponse } from "next/server";
import { getKyselyFacts } from "../kysely/facts";

/** Machine-readable comparison facts, each value with a source URL and dateChecked. */
export function GET() {
  return NextResponse.json(getKyselyFacts(), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
