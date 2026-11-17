import { getRSS } from "@/lib/rss";

export const revalidate = false;

export async function GET() {
  return new Response(await getRSS());
}
