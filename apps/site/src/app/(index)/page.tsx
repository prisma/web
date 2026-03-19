import type { Metadata } from "next";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "../../lib/blog-metadata";

export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

export default function SiteHome() {
  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-12 z-1">
      <h1 className="stretch-display text-4xl font-bold mb-4 text-center mt-9 font-sans-display">
        Prisma Site
      </h1>
      <p className="text-center text-foreground-neutral-weak max-w-2xl mx-auto">
        This app is the primary host zone. Content sections are served by their
        own zones via routing rules.
      </p>
    </main>
  );
}
