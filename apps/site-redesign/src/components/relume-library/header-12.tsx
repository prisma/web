// @ts-nocheck
"use client"

import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useState } from "react";

type Props = {
  heading: string;
  description: string;
  inputPlaceholder: string;
  button: ButtonProps;
  termsAndConditions: string;
  video: string;
  videoType: string;
};

export type Header12Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header12 = (props: Header12Props) => {
  const { heading, description, inputPlaceholder, button, termsAndConditions, video, videoType } = {
    ...Header12Defaults,
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
    <section id="relume" className="flex h-svh min-h-svh flex-col">
      <div className="relative flex-1">
        <video
          className="absolute -inset-full m-auto size-full bg-cover bg-center object-cover"
          autoPlay
          loop
          muted
        >
          <source src={video} type={videoType} />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="px-[5%]">
        <div className="container">
          <div className="grid grid-rows-1 items-start gap-y-5 py-12 md:grid-cols-2 md:gap-x-12 md:gap-y-8 md:py-18 lg:gap-x-20 lg:gap-y-16 lg:py-20">
            <h1 className="text-6xl font-bold text-text-primary md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <div>
              <p className="text-base text-text-primary md:text-md">{description}</p>
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
        </div>
      </div>
    </section>
  );
};

export const Header12Defaults: Props = {
  heading: "Medium length hero heading goes here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
  inputPlaceholder: "Enter your email",
  button: { title: "Sign up" },
  termsAndConditions: `
    <p class='text-xs'>
      By clicking Sign Up you're confirming that you agree with our
      <a href='#' class='underline'>Terms and Conditions</a>.
    </p>
    `,
  video: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video.mp4",
  videoType: "video/mp4",
};
