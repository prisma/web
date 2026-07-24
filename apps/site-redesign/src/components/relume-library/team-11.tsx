// @ts-nocheck
import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiLogoDribbble, BiLogoLinkedinSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

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

export type Team11Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Team11 = (props: Team11Props) => {
  const { tagline, heading, description, teamMembers, footer } = {
    ...Team11Defaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h2>
            <p className="md:text-md">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-16">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} member={member} />
          ))}
        </div>
        <div className="mt-14 md:mt-20 lg:mt-24">
          <div className="mx-auto flex max-w-md flex-col items-center">
            <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
              {footer.heading}
            </h4>
            <p className="md:text-md">{footer.description}</p>
            <div className="mt-6 md:mt-8">
              <Button {...footer.button}>{footer.button.title}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamMember = ({ member }: { member: TeamMember }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 md:mb-6">
        <img
          src={member.image.src}
          alt={member.image.alt}
          className="size-20 min-h-20 min-w-20 rounded-full object-cover"
        />
      </div>
      <div className="mb-3 md:mb-4">
        <h5 className="text-md font-semibold md:text-lg">{member.name}</h5>
        <h6 className="md:text-md">{member.jobTitle}</h6>
      </div>
      <p>{member.description}</p>
      <div className="mt-6 flex gap-3.5">
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

export const Team11Defaults: Props = {
  tagline: "Tagline",
  heading: "Our team",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  teamMembers: [teamMember, teamMember, teamMember, teamMember],
  footer: {
    heading: "We're hiring!",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    button: { title: "Open positions", variant: "secondary" },
  },
};
