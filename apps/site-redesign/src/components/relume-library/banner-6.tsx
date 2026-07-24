// @ts-nocheck
"use client"

import React, { useState } from "react";
import { Button, Input } from "@relume_io/relume-ui";
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
  inputPlaceholder: string;
  button: ButtonProps;
};

export type Banner6Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Banner6 = (props: Banner6Props) => {
  const { heading, description, logo, inputPlaceholder, button } = {
    ...Banner6Defaults,
    ...props,
  };

  const [isVisible, setIsVisible] = useState(true);
  const [emailInput, setEmailInput] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      emailInput,
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section id="relume">
      <div className="relative flex flex-col justify-start border-b border-border-primary bg-neutral-white px-[5%] py-4 md:flex-row md:items-center md:py-3">
        <div className="mb-4 mr-7 flex flex-1 items-start md:mb-0 md:mr-8 md:items-center">
          <a href={logo.url} className="flex-none">
            <img src={logo.src} alt={logo.alt} className="mr-4 hidden size-8 lg:block" />
          </a>
          <div>
            <h2 className="font-semibold">{heading}</h2>
            <p className="text-sm">{description}</p>
          </div>
        </div>
        <form
          className="grid w-full flex-1 gap-3 sm:grid-cols-[1fr_max-content] sm:gap-4 md:max-w-xs lg:flex-none"
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
        <button className="absolute right-2 top-2 ml-4 md:static">
          <RxCross2 className="size-8 p-1" onClick={() => setIsVisible(false)} />
        </button>
      </div>
    </section>
  );
};

export const Banner6Defaults: Props = {
  heading: "Medium length banner heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
    alt: "Relume logo",
  },
  inputPlaceholder: "Enter your email",
  button: {
    title: "Sign up",
    size: "sm",
  },
};
