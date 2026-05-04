import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

async function fetchWithRetry(url: string, retries = 3, timeout = 30000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Prisma-Docs-Build",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      if (isLastAttempt) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      console.warn(`Fetch attempt ${i + 1} failed, retrying in ${delay}ms...`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to fetch after retries");
}

async function main() {
  try {
    console.log("Fetching OpenAPI spec from https://api.prisma.io/v1/doc");

    const res = await fetchWithRetry("https://api.prisma.io/v1/doc", 5, 60000);
    const doc = await res.json();

    doc.servers = [{ url: "https://api.prisma.io" }];

    const cacheDir = join(process.cwd(), "cache");
    await mkdir(cacheDir, { recursive: true });

    const cachePath = join(cacheDir, "openapi.json");
    await writeFile(cachePath, JSON.stringify(doc, null, 2), "utf-8");

    console.log(`Successfully cached OpenAPI spec to ${cachePath}`);
    console.log(`Spec contains ${Object.keys(doc.paths || {}).length} paths`);
  } catch (error) {
    console.error("Failed to fetch and cache OpenAPI spec:", error);
    process.exit(1);
  }
}

main();
