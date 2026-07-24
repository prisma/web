// @ts-nocheck
"use client"

import React, { useState } from "react";
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxCross2 } from "react-icons/rx";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  logo: ImageProps;
  button: ButtonProps;
};

export type Banner7Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner7 = (props: Banner7Props) => {
  const { heading, description, logo, button } = {
    ...Banner7Defaults,
    ...props,
  };

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      id="relume"
      className="relative border-b border-border-primary bg-neutral-white px-[5%]"
    >
      <div className="flex flex-col justify-start py-4 md:flex-row md:items-center md:justify-center md:py-3">
        <div className="mr-7 flex flex-col items-start md:ml-12 md:mr-0 md:flex-1 md:flex-row md:items-center md:justify-center">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} className="mr-4 hidden size-8 lg:block" />
          </a>
          <div className="mb-4 md:mb-0 md:mr-6">
            <h2 className="font-semibold">{heading}</h2>
            <p className="text-sm">{description}</p>
          </div>
          <div>
            <Button {...button}>{button.title}</Button>
          </div>
        </div>
        <button className="absolute right-2 top-2 md:static md:ml-4 md:size-8">
          <RxCross2 className="size-8 p-1" onClick={() => setIsVisible(false)} />
        </button>
      </div>
    </section>
  );
};

export const Banner7Defaults: Props = {
  heading: "Medium length banner heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
    alt: "Relume logo",
  },
  button: {
    title: "Button",
    size: "sm",
  },
};
