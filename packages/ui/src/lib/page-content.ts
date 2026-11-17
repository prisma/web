type Content<T> = T extends { load: () => Promise<infer Loaded> } ? T & Loaded : T;

// Fumadocs exposes frontmatter immediately in async mode; the body, toc and
// processed text arrive through load(). Support both modes so Vercel's eager
// collections and Composer's lazy collections share the same consumers.
export async function pageContent<T extends object>(data: T): Promise<Content<T>> {
  if ("load" in data && typeof data.load === "function") {
    return { ...data, ...(await data.load()) } as Content<T>;
  }
  return data as Content<T>;
}
