"use client";
import React from "react";

import { Button, cn, Input } from "@prisma-docs/eclipse";
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

  const buttonText = blog ? "Sign up" : "Subscribe for updates";

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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="MERGE0" aria-label="Email">
          {icon("fa-light fa-envelope")}
          <Input
            type="email"
            name="EMAIL"
            id="MERGE0"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="off"
            autoCorrect="off"
            disabled={isSubmitting || isSubmitted || isAlreadySubscribed}
          />
        </label>
        <Button
          variant="ppg"
          disabled={isSubmitting || isSubmitted || isAlreadySubscribed}
        >
          <input
            type="submit"
            value={getButtonText()}
            name="subscribe"
            id="mc-embedded-subscribe"
          />
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {isSubmitted && (
          <p className="text-green-500 text-sm mt-2">
            Please check your email to confirm your subscription!
          </p>
        )}
        {isAlreadySubscribed && (
          <p className="text-blue-500 text-sm mt-2">
            You're already subscribed to our newsletter!
          </p>
        )}
      </form>
    </div>
  );
};
