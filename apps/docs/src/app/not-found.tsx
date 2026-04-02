import { source } from "@/lib/source";
import { baseOptions, links } from "@/lib/layout.shared";
import { VersionSwitcher } from "@/components/version-switcher";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { DocsLayout } from "@/components/layout/notebook";
import { DocsBody, DocsPage } from "@/components/layout/notebook/page";
import { LATEST_VERSION } from "@/lib/version";
import { NotFoundTracker } from "@/components/not-found-tracker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  const { nav, ...base } = baseOptions();

  const navbarLinks: LinkItemType[] = [
    ...links,
    {
      type: "custom",
      children: <VersionSwitcher currentVersion={LATEST_VERSION} />,
    },
  ];

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
          <div className="flex flex-col items-center justify-center text-primary overflow-hidden fixed inset-0 bg-[linear-gradient(transparent_90%,rgba(255,255,255,0.03)_100%)] bg-size-[100%_4px]">
            <h1
              className="relative text-[10rem] font-extrabold glitch mb-4 pointer-events-none"
              data-text="404"
            >
              404
            </h1>
            <p className="text-2xl font-semibold text-white">
              We could not find the page you were looking for
            </p>
            <a
              href="https://www.prisma.io/docs"
              className="hover:underline transition-colors"
            >
              Go to docs
            </a>
          </div>
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}
