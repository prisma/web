// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
  image: ImageProps;
};

export type Cta28Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta28 = (props: Cta28Props) => {
  const { heading, description, inputPlaceholder, button, termsAndConditions, image } = {
    ...Cta28Defaults,
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
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10 max-w-lg text-center">
        <h2 className="rb-5 mb-5 text-5xl font-bold text-text-alternative md:mb-6 md:text-7xl lg:text-8xl">
          {heading}
        </h2>
        <p className="text-text-alternative md:text-md">{description}</p>
        <div className="mx-auto mt-6 w-full max-w-sm md:mt-8">
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
            <Button {...button} className="items-center justify-center px-6 py-3">
              {button.title}
            </Button>
          </form>
          <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img src={image.src} className="size-full object-cover" alt={image.alt} />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
};

export const Cta28Defaults: Props = {
  heading: "Medium length heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  inputPlaceholder: "Enter your email",
  button: {
    title: "Sign up",
    variant: "primary",
    size: "sm",
  },
  termsAndConditions: `
    <p class='text-xs text-text-alternative'>
      By clicking Sign Up you're confirming that you agree with our
      <a href='#' class='underline'>Terms and Conditions</a>.
    </p>
    `,
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
};
