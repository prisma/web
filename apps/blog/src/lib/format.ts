export const formatDate = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

const TAG_ACRONYMS: Record<string, string> = {
  orm: "ORM",
  ai: "AI",
};

export const formatTag = (tag: string) => {
  if (Object.prototype.hasOwnProperty.call(TAG_ACRONYMS, tag)) return TAG_ACRONYMS[tag];
  return tag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
