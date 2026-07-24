// @ts-nocheck
"use client"

import { useState, useEffect } from "react";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type ButtonProps,
  type CarouselApi,
} from "@relume_io/relume-ui";
import { BiLogoDribbble, BiLogoLinkedinSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import clsx from "clsx";

type ImageProps = {
  src: string;
  alt?: string;
};

type Footer = {
  heading: string;
  description: string;
  button: ButtonProps;
};

type SocialLink = {
  href: string;
  icon: React.ReactNode;
};

type TeamMember = {
  image: ImageProps;
  name: string;
  jobTitle: string;
  description: string;
  socialLinks: SocialLink[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  teamMembers: TeamMember[];
  footer: Footer;
};

export type Team10Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Team10 = (props: Team10Props) => {
  const { tagline, heading, description, teamMembers, footer } = {
    ...Team10Defaults,
    ...props,
  };

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section id="relume" className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
          <p className="md:text-md">{description}</p>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="ml-0">
            {teamMembers.map((member, index) => (
              <CarouselItem
                key={index}
                className="basis-[95%] pl-0 pr-6 sm:basis-4/5 md:basis-1/2 md:pr-8 lg:basis-1/3"
              >
                <TeamMember member={member} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-12 flex items-center justify-between">
            <div className="mt-5 flex w-full items-start justify-start">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={clsx("mx-[3px] inline-block size-2 rounded-full", {
                    "bg-neutral-black": current === index + 1,
                    "bg-neutral-light": current !== index + 1,
                  })}
                />
              ))}
            </div>
            <div className="flex items-end justify-end gap-2 md:gap-4">
              <CarouselPrevious className="static right-0 top-0 size-12 -translate-y-0" />
              <CarouselNext className="static right-0 top-0 size-12 -translate-y-0" />
            </div>
          </div>
        </Carousel>
        <div className="mt-14 w-full max-w-md md:mt-20 lg:mt-24">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            {footer.heading}
          </h4>
          <p className="md:text-md">{footer.description}</p>
          <div className="mt-6 md:mt-8">
            <Button {...footer.button}>{footer.button.title}</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamMember = ({ member }: { member: TeamMember }) => {
  return (
    <div className="flex flex-col">
      <div className="relative mb-5 aspect-square size-full overflow-hidden md:mb-6 md:pt-[100%]">
        <img
          src={member.image.src}
          alt={member.image.alt}
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="mb-3 md:mb-4">
        <h5 className="text-md font-semibold md:text-lg">{member.name}</h5>
        <h6 className="md:text-md">{member.jobTitle}</h6>
      </div>
      <p>{member.description}</p>
      <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-start">
        {member.socialLinks.map((link, index) => (
          <a key={index} href={link.href}>
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

const teamMember: TeamMember = {
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Relume placeholder image",
  },
  name: "Full name",
  jobTitle: "Job title",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  socialLinks: [
    { href: "#", icon: <BiLogoLinkedinSquare className="size-6" /> },
    { href: "#", icon: <FaXTwitter className="size-6 p-0.5" /> },
    { href: "#", icon: <BiLogoDribbble className="size-6" /> },
  ],
};

export const Team10Defaults: Props = {
  tagline: "Tagline",
  heading: "Our team",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  teamMembers: [teamMember, teamMember, teamMember, teamMember, teamMember, teamMember],
  footer: {
    heading: "We're hiring!",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    button: { title: "Open positions", variant: "secondary" },
  },
};
