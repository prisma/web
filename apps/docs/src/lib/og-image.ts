/**
 * Fetches the og:image URL from a given page URL.
 * Returns null if the fetch fails or no og:image is found.
 */
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
