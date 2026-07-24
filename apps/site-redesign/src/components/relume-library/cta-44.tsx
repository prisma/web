// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";

type Props = {
  heading: string;
  description: string;
  video: string;
  videoType: string;
  inputPlaceholder?: string;
  button: ButtonProps;
  termsAndConditions: string;
};

export type Cta44Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta44 = (props: Cta44Props) => {
  const { heading, description, inputPlaceholder, button, termsAndConditions, video, videoType } = {
    ...Cta44Defaults,
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
      <div className="container relative">
        <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-lg">
            <h2 className="mb-5 text-5xl font-bold text-text-alternative md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="text-text-alternative md:text-md">{description}</p>
          </div>
          <div className="mr-auto mt-6 max-w-sm md:mt-8">
            <form
              className="rb-4 mb-4 grid grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"
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
          <video
            className="absolute inset-0 aspect-video size-full object-cover"
            autoPlay
            loop
            muted
          >
            <source src={video} type={videoType} />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>
    </section>
  );
};

export const Cta44Defaults: Props = {
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
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
