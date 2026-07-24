// @ts-nocheck
"use client"

import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useState } from "react";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  image: ImageProps;
  button: ButtonProps;
  inputPlaceholder: string;
  termsAndConditions: string;
};

export type Cta24Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta24 = (props: Cta24Props) => {
  const { heading, description, image, inputPlaceholder, button, termsAndConditions } = {
    ...Cta24Defaults,
    ...props,
  };

  const [emailInput, setEmailInput] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      emailInput,
    });
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 w-full max-w-sm md:mt-8">
              <form
                className="rb-4 mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"
                onSubmit={handleSubmit}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder={inputPlaceholder}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <Button {...button}>{button.title}</Button>
              </form>
              <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
            </div>
          </div>
        </div>
        <div>
          <img src={image.src} className="size-full object-cover" alt={image.alt} />
        </div>
      </div>
    </section>
  );
};

export const Cta24Defaults: Props = {
  heading: "Long heading is what you see here in this call to action section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
    alt: "Relume placeholder image",
  },
  inputPlaceholder: "Enter your email",
  button: { title: "Sign up" },
  termsAndConditions: `
        <p class='text-xs'>
          By clicking Sign Up you're confirming that you agree with our
          <a href='#' class='underline'>Terms and Conditions</a>.
        </p>
        `,
};
