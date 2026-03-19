export async function GET() {
  return Response.json(
    {
      error: "Search is not configured in the site host zone.",
    },
    { status: 404 },
  );
}
