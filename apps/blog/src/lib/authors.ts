export function normalizeAuthorName(name: string): string {
  const latinized = name
    .replace(/[øØ]/g, "o")
    .replace(/[æÆ]/g, "ae")
    .replace(/[œŒ]/g, "oe")
    .replace(/[ß]/g, "ss");

  return latinized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function toAuthorSlug(name: string): string {
  return normalizeAuthorName(name).replace(/\s+/g, "-");
}

export function getAuthorImageSrc(name: string): string | null {
  const slug = toAuthorSlug(name);
  if (!slug) return null;
  return `/authors/${slug}.png`;
}

export function getAuthorProfiles(names: string[]): Array<{ name: string; imageSrc: string | null }> {
  const seen = new Set<string>();
  return names
    .filter(Boolean)
    .map((name) => name.trim())
    .filter((name) => {
      const normalized = normalizeAuthorName(name);
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .map((name) => ({
      name,
      imageSrc: getAuthorImageSrc(name),
    }));
}
