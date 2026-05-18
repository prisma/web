import { isValidElement, type ReactNode } from "react";

export function getPageTitleText(title: ReactNode, fallback = ""): string {
  if (typeof title === "string") return title;
  if (typeof title === "number" || typeof title === "bigint") return String(title);

  if (Array.isArray(title)) {
    const value = title.map((entry) => getPageTitleText(entry, "")).join("").trim();
    return value || fallback;
  }

  if (title == null || typeof title === "boolean") {
    return fallback;
  }

  if (isValidElement(title)) {
    return getPageTitleText((title.props as { children?: ReactNode }).children, fallback);
  }

  return fallback;
}
