import { createPageMetadata } from "@/lib/page-metadata";
import { Button } from "@prisma/eclipse";
import {
  NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME,
  isValidNewsletterUnsubscribeToken,
} from "@prisma-docs/ui/lib/newsletter-subscription";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
  ...createPageMetadata({
    title: "Unsubscribe from the Prisma newsletter",
    description: "Manage your Prisma newsletter subscription.",
    path: "/newsletter/unsubscribe",
  }),
  referrer: "no-referrer",
  robots: { follow: false, index: false },
} satisfies Metadata;

type UnsubscribePageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { status } = await searchParams;
  const token = (await cookies()).get(NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME)?.value ?? "";
  const canConfirm = isValidNewsletterUnsubscribeToken(token);
  const isSuccess = status === "success";
  const isError = status === "error" && canConfirm;
  const isInvalid = !isSuccess && !canConfirm;

  return (
    <main className="flex min-h-[70vh] flex-1 items-center bg-background-default px-4 py-24 text-foreground-neutral">
      <section className="mx-auto flex w-full max-w-[560px] flex-col items-start gap-5">
        <p className="m-0 text-sm font-semibold uppercase text-foreground-ppg">Prisma newsletter</p>
        <h1 className="m-0 text-4xl font-sans-display sm:text-5xl">
          {isSuccess
            ? "You are unsubscribed"
            : isInvalid
              ? "This link is not valid"
              : "Unsubscribe from the newsletter?"}
        </h1>

        {isSuccess ? (
          <p className="m-0 text-lg text-foreground-neutral-weak">
            You will no longer receive the Prisma newsletter. Transactional account and service
            emails are unaffected.
          </p>
        ) : isInvalid ? (
          <p className="m-0 text-lg text-foreground-neutral-weak">
            The unsubscribe link is missing or invalid. You can try the link from your latest Prisma
            newsletter again.
          </p>
        ) : (
          <>
            <p className="m-0 text-lg text-foreground-neutral-weak">
              This stops Prisma newsletter emails only. You will still receive important account and
              service messages.
            </p>
            {isError ? (
              <p className="m-0 text-sm text-foreground-error">
                We could not update your subscription. Please try again.
              </p>
            ) : null}
            <form action="/api/newsletter/unsubscribe" method="post">
              <Button type="submit" variant="default-strong" size="2xl">
                Unsubscribe
              </Button>
            </form>
          </>
        )}

        <Link href="/" className="text-sm text-foreground-ppg underline">
          Return to Prisma
        </Link>
      </section>
    </main>
  );
}
