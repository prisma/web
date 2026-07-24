// @ts-nocheck
"use client"

import { Button, Checkbox, Input, Label, Textarea } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useState } from "react";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  image: ImageProps;
  tagline: string;
  heading: string;
  description: string;
  button: ButtonProps;
};

export type Contact10Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Contact10 = (props: Contact10Props) => {
  const { image, tagline, heading, description, button } = {
    ...Contact10Defaults,
    ...props,
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState<boolean | "indeterminate">(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ name, email, message, acceptTerms });
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container grid grid-cols-1 gap-y-12 md:grid-flow-row md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
        <div>
          <img src={image.src} alt={image.alt} className="size-full object-cover" />
        </div>
        <div>
          <div className="mb-6 md:mb-8">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
          </div>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div className="grid w-full items-center">
              <Label htmlFor="name" className="mb-2">
                Name
              </Label>
              <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="message" className="mb-2">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message..."
                className="min-h-[11.25rem] overflow-auto"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="mb-3 flex items-center space-x-2 text-sm md:mb-4">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
              <Label htmlFor="terms" className="cursor-pointer">
                I accept the{" "}
                <a className="text-link-primary underline" href="#">
                  Terms
                </a>
              </Label>
            </div>
            <div>
              <Button {...button}>{button.title}</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export const Contact10Defaults: Props = {
  image: {
    src: "https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-map-image.svg",
    alt: "Relume placeholder image",
  },
  tagline: "Tagline",
  heading: "Contact us",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "Submit" },
};
