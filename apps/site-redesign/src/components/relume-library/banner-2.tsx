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

export type Banner2Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner2 = (props: Banner2Props) => {
  const { heading, description, logo, button } = {
    ...Banner2Defaults,
    ...props,
  };

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section id="relume" className="px-[5%]">
      <div className="container relative flex flex-col justify-start border border-border-primary bg-neutral-white p-4 md:flex-row md:items-center md:px-4 md:py-3">
        <div className="mb-4 mr-7 flex flex-1 items-start md:mb-0 md:mr-8 md:items-center">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} className="mr-4 hidden size-8 lg:block" />
          </a>
          <div>
            <h2 className="font-semibold">{heading}</h2>
            <p className="text-sm">{description}</p>
          </div>
        </div>
        <div>
          <Button {...button}>{button.title}</Button>
        </div>
        <button className="absolute right-2 top-2 ml-4 md:static">
          <RxCross2 className="size-8 p-1" onClick={() => setIsVisible(false)} />
        </button>
      </div>
    </section>
  );
};

export const Banner2Defaults: Props = {
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
