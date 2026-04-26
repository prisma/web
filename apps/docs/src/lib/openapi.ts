import { createOpenAPI } from "fumadocs-openapi/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// In-memory cache to avoid repeated fetches during build
let cachedSpec: any = null;
let fetchPromise: Promise<any> | null = null;

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

async function loadCachedSpec() {
  try {
    const cachePath = join(process.cwd(), "cache", "openapi.json");
    const cached = await readFile(cachePath, "utf-8");
    return JSON.parse(cached);
  } catch (error) {
    return null;
  }
}

async function getOpenAPISpec() {
  // Return cached spec if already loaded
  if (cachedSpec) {
    return cachedSpec;
  }

  // If a fetch is already in progress, wait for it
  if (fetchPromise) {
    return fetchPromise;
  }

  // Start fetching
  fetchPromise = (async () => {
    try {
      // First, try to load from cache file (created by prebuild script)
      const cached = await loadCachedSpec();
      if (cached) {
        console.log("Using cached OpenAPI spec from file");
        cachedSpec = cached;
        return cached;
      }

      // If no cache file, fetch from API
      console.log("Fetching OpenAPI spec from https://api.prisma.io/v1/doc");
      const res = await fetchWithRetry("https://api.prisma.io/v1/doc", 3, 30000);
      const doc = await res.json();
      doc.servers = [{ url: "https://api.prisma.io" }];
      console.log("Successfully fetched OpenAPI spec");

      cachedSpec = doc;
      return doc;
    } catch (error) {
      console.error("Failed to fetch OpenAPI spec:", error);
      throw new Error(
        `Failed to fetch OpenAPI specification: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export const openapi = createOpenAPI({
  input: async () => {
    const doc = await getOpenAPISpec();
    return { "management-api": doc };
  },
  proxyUrl: "/api/proxy",
});
