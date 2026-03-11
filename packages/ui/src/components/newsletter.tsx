"use client";
import React from "react";

import { Button, Input } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";
import { useNewsletter } from "../hooks/use-newsletter";

const icon = (name: string) => (
  <i color="currentColor" className={cn("text-[1.125rem]", name)} />
);

type ColorType = "indigo" | "teal" | "white" | undefined;

type FooterNewsletterFormProps = {
  theme?: any;
  color?: ColorType;
  blog?: boolean;
  apiUrl?: string;
};

export const FooterNewsletterForm = ({
  blog = false,
  apiUrl,
}: FooterNewsletterFormProps) => {
  const {
    email,
    setEmail,
    isSubmitting,
    isSubmitted,
    isAlreadySubscribed,
    error,
    subscribe,
  } = useNewsletter({ apiUrl });

  const buttonText = blog ? "Sign up" : "Subscribe";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await subscribe();
  };

  const getButtonText = () => {
    if (isSubmitting) return "Submitting...";
    if (isSubmitted) return "Thank you!";
    if (isAlreadySubscribed) return "Already subscribed!";
    return buttonText;
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex gap-6 sm:gap-2 items-center justify-between w-full flex-col sm:flex-row "
      >
        <h5 className="font-family-display font-[650] text-white text-base">
          Subscribe to our newsletter
        </h5>
        <div>
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <label htmlFor="MERGE0" aria-label="Email" className="flex-grow">
              <Input
                type="email"
                name="EMAIL"
                id="MERGE0"
                size="2xl"
                value={email}
                placeholder="Your email..."
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="off"
                autoCorrect="off"
                disabled={isSubmitting || isSubmitted || isAlreadySubscribed}
              />
            </label>
            <Button
              variant="ppg"
              size="xl"
              disabled={isSubmitting || isSubmitted || isAlreadySubscribed}
            >
              <input
                type="submit"
                value={getButtonText()}
                name="subscribe"
                id="mc-embedded-subscribe"
              />
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 self-start sm:absolute">
              {error}
            </p>
          )}
          {isSubmitted && (
            <p className="text-green-500 text-sm mt-2 self-start sm:absolute">
              Please check your email to confirm your subscription!
            </p>
          )}
          {isAlreadySubscribed && (
            <p className="text-blue-500 text-sm mt-2 self-start sm:absolute">
              You're already subscribed to our newsletter!
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
