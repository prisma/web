import { source } from "@/lib/source";
import { authLinks, baseOptions, links } from "@/lib/layout.shared";
import type { LinkItemType } from "@/components/layout/link-item";
import { DocsLayout } from "@/components/layout/notebook";
import { DocsBody, DocsPage } from "@/components/layout/notebook/page";
import { NotFoundTracker } from "@/components/not-found-tracker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  const { nav, ...base } = baseOptions();

  const navbarLinks: LinkItemType[] = [...links, ...authLinks];

  return (
    <DocsLayout
      {...base}
      links={navbarLinks}
      nav={{ ...nav }}
      sidebar={{ collapsible: false }}
      tree={source.pageTree}
    >
      <NotFoundTracker />
      <DocsPage
        footer={{ enabled: false }}
        full={true}
        sidebar={{ enabled: false }}
        tableOfContent={{ enabled: false }}
        tableOfContentPopover={{ enabled: false }}
      >
        <DocsBody className="max-w-full">
          {/* The scanline wash was authored for an always-dark page; it is now
              ink-on-light and white-on-dark so it stays a faint texture in
              either theme instead of vanishing. */}
          <div className="text-fd-foreground fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(transparent_90%,rgba(21,21,21,0.03)_100%)] bg-size-[100%_4px] dark:bg-[linear-gradient(transparent_90%,rgba(255,255,255,0.03)_100%)]">
            {/* `font-medium` rather than `font-extrabold`: the global heading
                rule is unlayered and pins every h1 to Sora 500, so the class
                is written to agree with what actually renders. */}
            <h1
              className="glitch pointer-events-none relative mb-4 text-[10rem] font-medium"
              data-text="404"
            >
              404
            </h1>
            <p className="text-fd-foreground text-2xl font-semibold">
              We could not find the page you were looking for
            </p>
            <a
              href="https://www.prisma.io/docs"
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors hover:underline motion-reduce:transition-none"
            >
              Go to docs
            </a>
          </div>
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}
