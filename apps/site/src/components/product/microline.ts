/**
 * Split a product-hero microline so `linkText` can sit anywhere inside it.
 * Falls back to linking the whole line when the anchor is missing.
 */
export function splitMicroline(microline: string, linkText?: string) {
  if (!linkText) {
    return { before: "", link: microline, after: "" };
  }

  const index = microline.indexOf(linkText);
  if (index === -1) {
    return { before: "", link: microline, after: "" };
  }

  return {
    before: microline.slice(0, index),
    link: linkText,
    after: microline.slice(index + linkText.length),
  };
}
