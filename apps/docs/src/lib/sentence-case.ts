// Product names keep their capitals ("Query Insights").
const PRODUCT_NAMES = new Set(["Query Insights"]);

/**
 * "Getting Started" → "Getting started": the brand's sentence case for
 * navigation labels. Acronyms ("REST API", "ORM") and product names keep
 * their capitals. Used by the header and in-page breadcrumbs, so the page
 * tree's own titles (and the sidebar) are unchanged.
 */
export function sentenceCase(title: string) {
  if (PRODUCT_NAMES.has(title)) return title;
  return title
    .split(" ")
    .map((word, i) => (i === 0 || word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(" ");
}
