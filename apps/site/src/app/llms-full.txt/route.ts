export async function GET() {
  return new Response("", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
