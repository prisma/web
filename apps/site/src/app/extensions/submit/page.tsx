import Link from "next/link";
import { ArrowRight } from "@/components/icons/forma";
import { PanelHero } from "@/components/extensions/panel-hero";
import { SubmitExtensionForm } from "@/components/extensions/submit-form";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "Submit a Prisma 8 extension",
  description:
    "List your Prisma ORM 8 extension or middleware in the directory. The form validates your entry and opens a pull request for you.",
  path: "/extensions/submit",
  ogKicker: "Prisma 8 Extensions",
});

const LINK = "font-semibold text-primary underline underline-offset-4 hover:text-prism-cyan-700";

export default function SubmitExtensionPage() {
  return (
    <>
      <PanelHero
        kicker="Prisma ORM 8"
        title="Submit an extension"
        lead="Publish the package to npm, fill in six fields, and the form opens a pull request against prisma/web. A maintainer reviews it and the listing goes live on the next deploy."
        breadcrumb={
          <Link
            href="/extensions"
            className="group flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-prism-cyan-700"
          >
            <ArrowRight
              className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
            All extensions
          </Link>
        }
      />

      <section className="bg-white px-4 py-10 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <SubmitExtensionForm />
          <p className="text-sm leading-relaxed text-foreground">
            Prefer git? Add an entry to{" "}
            <a
              href="https://github.com/prisma/web/blob/main/packages/ui/src/data/extensions/community.json"
              className={LINK}
              rel="noopener noreferrer"
            >
              community.json
            </a>{" "}
            and open the pull request yourself. New to writing extensions? Start with the{" "}
            <a
              href="https://www.prisma.io/blog/prisma-next-call-for-extension-authors"
              className={LINK}
            >
              author guide
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
