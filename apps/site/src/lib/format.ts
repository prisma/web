export const formatDate = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTag = (tag: string) => {
  return tag === "orm"
    ? "ORM"
    : tag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
