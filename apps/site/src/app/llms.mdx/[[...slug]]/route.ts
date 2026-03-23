import { notFound } from "next/navigation";

export async function GET() {
  notFound();
}

export function generateStaticParams() {
  return [];
}
