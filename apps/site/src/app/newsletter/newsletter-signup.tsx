"use client";

import { useNewsletter } from "@prisma-docs/ui/hooks/use-newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const { email, setEmail, isSubmitting, isSubmitted, isAlreadySubscribed, error, subscribe } =
    useNewsletter({});

  const disabled = isSubmitting || isSubmitted || isAlreadySubscribed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe();
  };

  const statusMessage = error
    ? { text: error, className: "text-prism-red-600" }
    : isSubmitted
      ? {
          text: "You're subscribed. Welcome to the Prisma newsletter!",
          className: "text-prism-cyan-700",
        }
      : isAlreadySubscribed
        ? {
            text: "You're already subscribed to our newsletter!",
            className: "text-prism-cyan-700",
          }
        : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email Address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          disabled={disabled}
          className="h-11 flex-1"
        />
        <Button type="submit" disabled={disabled} className="h-11 shrink-0 px-5">
          {isSubmitting ? "Signing up…" : "Sign me up"}
        </Button>
      </div>
      {statusMessage ? (
        <p className={`text-sm ${statusMessage.className}`}>{statusMessage.text}</p>
      ) : null}
    </form>
  );
}
