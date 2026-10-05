import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { NavTitle } from "@/components/nav-title";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: NavTitle,
      transparentMode: "none",
    },
    githubUrl: "https://github.com/prisma/web",
  };
}
