export function isLinkItemVisibleOn(
  item: { on?: "menu" | "nav" | "all" },
  target: "menu" | "nav",
) {
  return item.on === undefined || item.on === "all" || item.on === target;
}
