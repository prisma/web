import { useState } from "react";

interface UseNewsletterOptions {
  apiUrl?: string;
}

interface NewsletterState {
  email: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isAlreadySubscribed: boolean;
  error: string | null;
}

interface UseNewsletterReturn extends NewsletterState {
  setEmail: (email: string) => void;
  subscribe: () => Promise<void>;
  reset: () => void;
}

export const useNewsletter = (
  options: UseNewsletterOptions = {},
): UseNewsletterReturn => {
  const { apiUrl = "/api/newsletter" } = options;

  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setIsSubmitted(false);
    setIsAlreadySubscribed(false);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Check if response has content before parsing JSON
      const contentType = response.headers.get("content-type");
      const hasJson = contentType && contentType.includes("application/json");

      let data: any = {};

      if (hasJson) {
        const text = await response.text();
        if (text && text.length > 0) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error("Failed to parse JSON:", text);
            throw new Error("Invalid response from server. Please try again.");
          }
        }
      }

      if (!response.ok) {
        // Show debug info in development
        if (data.debug) {
          console.error("API Error Debug:", data.debug);
        }
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      // Check if already subscribed (from response data)
      if (data.alreadySubscribed) {
        setIsAlreadySubscribed(true);
        setEmail("");
      } else if (response.status === 200 || response.status === 201) {
        // Successful subscription (200 for Brevo, 201 for Mailchimp)
        setIsSubmitted(true);
        setEmail("");
      } else {
        // Other success status
        setIsSubmitted(true);
        setEmail("");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setEmail("");
    setIsSubmitting(false);
    setIsSubmitted(false);
    setIsAlreadySubscribed(false);
    setError(null);
  };

  return {
    email,
    setEmail,
    isSubmitting,
    isSubmitted,
    isAlreadySubscribed,
    error,
    subscribe,
    reset,
  };
};
