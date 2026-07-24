// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, Input } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  headers: string[];
  description: string;
  inputPlaceholder: string;
  button: ButtonProps;
  termsAndConditions: string;
};

export type Cta58Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Cta58 = (props: Cta58Props) => {
  const { headers, description, inputPlaceholder, button, termsAndConditions } = {
    ...Cta58Defaults,
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
        <div className="mx-auto max-w-lg text-center">
          <h1>
            {headers.map((heading, index) => (
              <motion.span
                key={index}
                initial={{ x: index % 2 === 0 ? "-50%" : "50%" }}
                animate={{ x: "0%" }}
                transition={{ type: "spring", bounce: 0 }}
                className={clsx("block text-6xl font-bold md:text-9xl lg:text-10xl", {
                  "mb-5 md:mb-6": index !== 0,
                })}
              >
                {heading}
              </motion.span>
            ))}
          </h1>
          <p className="md:text-md">{description}</p>
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
              <Button {...button}>{button.title}</Button>
            </form>
            <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Cta58Defaults: Props = {
  headers: ["Medium length CTA", "heading goes here"],
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  inputPlaceholder: "Enter your email",
  button: { title: "Sign Up" },
  termsAndConditions: `
  <p class='text-xs'>
    By clicking Sign Up you're confirming that you agree with our
    <a href='#' class='underline'>Terms and Conditions</a>.
  </p>
  `,
};
