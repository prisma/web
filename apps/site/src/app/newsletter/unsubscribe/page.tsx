import {
  NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME,
  isValidNewsletterUnsubscribeToken,
} from "@prisma-docs/ui/lib/newsletter-subscription";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/page-metadata";
import { cookies } from "next/headers";
import Link from "next/link";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Unsubscribe from the Prisma newsletter",
    description: "Manage your Prisma newsletter subscription.",
    path: "/newsletter/unsubscribe",
    ogKicker: "Newsletter",
  }),
  referrer: "no-referrer",
  robots: { follow: false, index: false },
};

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
    <main className="flex min-h-[70vh] items-center bg-white px-4 py-32 sm:px-8">
      <section className="mx-auto flex w-full max-w-xl flex-col items-start gap-5">
        <RoleKicker color="bg-prism-yellow-300">Prisma newsletter</RoleKicker>
        <h1 className="text-balance text-3xl leading-[1.1] sm:text-4xl">
          {isSuccess
            ? "You are unsubscribed"
            : isInvalid
              ? "This link is not valid"
              : "Unsubscribe from the newsletter?"}
        </h1>

        {isSuccess ? (
          <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            You will no longer receive the Prisma newsletter. Transactional account and service
            emails are unaffected.
          </p>
        ) : isInvalid ? (
          <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            The unsubscribe link is missing or invalid. You can try the link from your latest Prisma
            newsletter again.
          </p>
        ) : (
          <>
            <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              This stops Prisma newsletter emails only. You will still receive important account and
              service messages.
            </p>
            {isError ? (
              <p className="text-sm text-prism-red-600">
                We could not update your subscription. Please try again.
              </p>
            ) : null}
            <form action="/api/newsletter/unsubscribe" method="post">
              <Button type="submit">Unsubscribe</Button>
            </form>
          </>
        )}

        <Link
          href="/"
          className="text-sm font-semibold text-prism-cyan-700 transition-colors hover:text-prism-cyan-600"
        >
          Return to Prisma
        </Link>
      </section>
    </main>
  );
}
