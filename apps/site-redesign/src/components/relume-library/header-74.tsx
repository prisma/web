// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Input, Dialog, DialogContent, DialogTrigger } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import clsx from "clsx";
import { FaCirclePlay } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";

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
  video: string;
};

export type Header74Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header74 = (props: Header74Props) => {
  const { heading, description, inputPlaceholder, button, termsAndConditions, image, video } = {
    ...Header74Defaults,
    ...props,
  };

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
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
        <div className="flex flex-col">
          <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                {heading}
              </h1>
              <p className="md:text-md">{description}</p>
              <div className="mt-6 w-full max-w-sm md:mt-8">
                <form
                  className="rb-4 mb-4 grid w-full max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"
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
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex size-full items-center justify-center">
                  <img src={image.src} alt={image.alt} className="size-full object-cover" />
                  <span className="absolute inset-0 z-10 bg-black/50" />
                  <FaCirclePlay className="absolute z-20 size-16 text-white" />
                </button>
              </DialogTrigger>
              <DialogContent>
                {!isIframeLoaded && (
                  <CgSpinner className="mx-auto size-16 animate-spin text-white" />
                )}
                <iframe
                  className={clsx("z-0 mx-auto aspect-video size-full md:w-[738px] lg:w-[940px]", {
                    visible: isIframeLoaded,
                    hidden: !isIframeLoaded,
                  })}
                  src={video}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsIframeLoaded(true)}
                ></iframe>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header74Defaults: Props = {
  heading: "Long heading is what you see here in this header section",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  inputPlaceholder: "Enter your email",
  button: {
    title: "Sign up",
  },
  termsAndConditions: `
      <p class='text-xs'>
        By clicking Sign Up you're confirming that you agree with our
        <a href='#' class='underline'>Terms and Conditions</a>.
      </p>
      `,
  video: "https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg",
    alt: "Relume placeholder image",
  },
};
