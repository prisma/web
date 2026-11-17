import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={source.pageTree}
      sidebar={{
        collapsible: false,
        // Parts are folders; keep every Part open so the whole table of
        // contents is scannable. A book you have to unfold is annoying.
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
