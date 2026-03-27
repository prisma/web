"use client";

import { Button, Input } from "@prisma/eclipse";
import { useNewsletter } from "@prisma-docs/ui/hooks/use-newsletter";

export function NewsletterSignup() {
  const {
    email,
    setEmail,
    isSubmitting,
    isSubmitted,
    isAlreadySubscribed,
    error,
    subscribe,
  } = useNewsletter({});

  const disabled = isSubmitting || isSubmitted || isAlreadySubscribed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe();
  };

  const statusMessage = error
    ? { text: error, className: "text-foreground-error" }
    : isSubmitted
      ? {
          text: "Please check your email to confirm your subscription!",
          className: "text-foreground-success",
        }
      : isAlreadySubscribed
        ? {
            text: "You're already subscribed to our newsletter!",
            className: "text-foreground-ppg",
          }
        : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email Address
        </label>
        <div className="relative flex-1">
          <i
            className="fa-regular fa-envelope pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-neutral-weaker"
            aria-hidden
          />
          <Input
            id="newsletter-email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            disabled={disabled}
            size="2xl"
            className="pl-9"
          />
        </div>
        <Button variant="ppg" size="2xl" disabled={disabled}>
          <input
            type="submit"
            value={isSubmitting ? "..." : "Sign me up"}
            className="cursor-pointer"
          />
        </Button>
      </div>
      {statusMessage ? (
        <p className={`m-0 text-sm ${statusMessage.className}`}>
          {statusMessage.text}
        </p>
      ) : null}
    </form>
  );
}
