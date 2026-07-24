// @ts-nocheck
"use client"

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Input,
  Label,
  Checkbox,
  Textarea,
  Button,
} from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiEnvelope, BiMap, BiPhone } from "react-icons/bi";

type Props = {
  tagline: string;
  heading: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  button: ButtonProps;
};

export type Contact6Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Contact6 = (props: Contact6Props) => {
  const { tagline, heading, description, email, phone, address, button } = {
    ...Contact6Defaults,
    ...props,
  };

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const [selectedItem, setSelectedItem] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");

  const [messageInput, setMessageInput] = useState("");
  const [acceptTerms, setAcceptTerms] = useState<boolean | "indeterminate">(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      firstNameInput,
      lastNameInput,
      emailInput,
      phoneInput,
      selectedItem,
      selectedRadio,
      messageInput,
      acceptTerms,
    });
  };

  const selectItems = [
    { value: "first-choice", label: "First Choice" },
    { value: "second-choice", label: "Second Choice" },
    { value: "third-choice", label: "Third Choice" },
  ];

  const radioItems = [
    { value: "first-choice", label: "First choice" },
    { value: "second-choice", label: "Second choice" },
    { value: "third-choice", label: "Third choice" },
    { value: "fourth-choice", label: "Fourth choice" },
    { value: "fifth-choice", label: "Fifth choice" },
    { value: "other", label: "Other" },
  ];

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container grid grid-cols-1 items-start gap-y-12 md:grid-flow-row md:grid-cols-2 md:gap-x-12 lg:grid-flow-col lg:gap-x-20 lg:gap-y-16">
        <div>
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <div className="rb-6 mb-6 md:mb-8">
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <p className="md:text-md">{description}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="flex items-center gap-4">
              <BiEnvelope className="size-6 flex-none" />
              <p>{email}</p>
            </div>
            <div className="flex items-center gap-4">
              <BiPhone className="size-6 flex-none" />
              <p>{phone}</p>
            </div>
            <div className="flex items-center gap-4">
              <BiMap className="size-6 flex-none" />
              <p>{address}</p>
            </div>
          </div>
        </div>

        <form className="grid grid-cols-1 grid-rows-[auto_auto] gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid w-full items-center">
              <Label htmlFor="firstName" className="mb-2">
                First name
              </Label>
              <Input
                type="text"
                id="firstName"
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
              />
            </div>

            <div className="grid w-full items-center">
              <Label htmlFor="lastName" className="mb-2">
                Last name
              </Label>
              <Input
                type="text"
                id="lastName"
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <Label htmlFor="phone" className="mb-2">
                Phone number
              </Label>
              <Input
                type="text"
                id="phone"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
            </div>
          </div>

          <div className="grid w-full items-center">
            <Label className="mb-2">Choose a topic</Label>
            <Select onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="Select one..." />
              </SelectTrigger>
              <SelectContent>
                {selectItems.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center py-3 md:py-4">
            <Label className="mb-3 md:mb-4">Which best describes you?</Label>
            <RadioGroup
              className="grid grid-cols-2 gap-x-6 gap-y-3.5"
              onValueChange={setSelectedRadio}
            >
              {radioItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.value} id={item.value} />
                  <Label htmlFor={item.value}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
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

export const Contact6Defaults: Props = {
  tagline: "Tagline",
  heading: "Contact us",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  email: "hello@relume.io",
  phone: "+1 (555) 000-0000",
  address: "123 Sample St, Sydney NSW 2000 AU",
  button: { title: "Submit" },
};
