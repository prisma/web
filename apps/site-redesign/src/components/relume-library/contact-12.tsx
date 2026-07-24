// @ts-nocheck
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
import React from "react";
import { BiEnvelope, BiMap, BiPhone } from "react-icons/bi";
import { RxChevronRight } from "react-icons/rx";
import { useState } from "react";

type LinkProps = {
  label: string;
  url: string;
};

type Contact = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: LinkProps;
  button?: ButtonProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  contacts: Contact[];
  button: ButtonProps;
};

export type Contact12Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Contact12 = (props: Contact12Props) => {
  const { tagline, heading, description, contacts, button } = {
    ...Contact12Defaults,
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

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-8 max-w-lg md:mb-12">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            {heading}
          </h2>
          <p className="md:text-md">{description}</p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-[1fr_1fr] md:gap-y-16 lg:gap-x-20">
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
          <div className="mb-auto grid gap-x-4 gap-y-10 py-2 sm:grid-cols-2">
            {contacts.map((contact, index) => (
              <div key={index}>
                <div className="mb-3 md:mb-4">{contact.icon}</div>
                <h3 className="mb-2 text-md font-bold leading-[1.4] md:text-xl">{contact.title}</h3>
                <p className="mb-2">{contact.description}</p>
                {contact.title === "Office" && contact.button ? (
                  <div className="mt-5 md:mt-6">
                    <Button {...contact.button}>{contact.button.title}</Button>
                  </div>
                ) : (
                  contact.link && (
                    <a className="underline" href={contact.link.url}>
                      {contact.link.label}
                    </a>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Contact12Defaults: Props = {
  tagline: "Tagline",
  heading: "Contact us",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  contacts: [
    {
      icon: <BiEnvelope className="size-8" />,
      title: "Email",
      description: "Lorem ipsum dolor sit amet.",
      link: {
        label: "hello@relume.io",
        url: "#",
      },
    },
    {
      icon: <BiPhone className="size-8" />,
      title: "Phone",
      description: "Lorem ipsum dolor sit amet.",
      link: {
        label: "+1 (555) 000-0000",
        url: "#",
      },
    },
    {
      icon: <BiMap className="size-8" />,
      title: "Office",
      description: "123 Sample St, Sydney NSW 2000 AU",
      button: {
        title: "Get Directions",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
  ],
  button: { title: "Submit" },
};
