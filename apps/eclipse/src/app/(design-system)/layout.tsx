import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { DocsLayout } from "@/components/layout/notebook";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { nav, ...base } = baseOptions();

  return (
    <DocsLayout {...base} nav={{ ...nav }} sidebar={{ collapsible: false }} tree={source.pageTree}>
      {children}
    </DocsLayout>
  );
}
