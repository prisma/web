// @ts-nocheck
"use client"

import { Button, Checkbox, Input, Label, Textarea } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { useState } from "react";

type Props = {
  tagline: string;
  heading: string;
  description: string;
  button: ButtonProps;
};

export type Contact3Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Contact3 = (props: Contact3Props) => {
  const { tagline, heading, description, button } = {
    ...Contact3Defaults,
    ...props,
  };

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [messageInput, setMessageInput] = useState("");
  const [acceptTerms, setAcceptTerms] = useState<boolean | "indeterminate">(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ nameInput, emailInput, messageInput, acceptTerms });
  };

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-8 w-full max-w-lg md:mb-10 lg:mb-12">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <form className="grid w-full max-w-md grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <div className="grid w-full items-center">
            <Label htmlFor="name" className="mb-2">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
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
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
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
    </section>
  );
};

export const Contact3Defaults: Props = {
  tagline: "Tagline",
  heading: "Contact us",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  button: { title: "Submit" },
};
