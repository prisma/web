// @ts-nocheck
"use client"

import { useState } from "react";
import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronDown, RxChevronRight } from "react-icons/rx";
import { motion } from "framer-motion";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type MegaMenuLink = {
  url: string;
  image: ImageProps;
  title: string;
  description: string;
  button?: ButtonProps;
};

type CategoryLink = {
  title: string;
  links: MegaMenuLink[];
};

type MegaMenuLinkProps = {
  categoryLinks: CategoryLink[];
  featuredSections: {
    title: string;
    links: MegaMenuLink[];
  };
  button: ButtonProps;
};

type LinkProps = {
  title: string;
  url: string;
  megaMenu?: MegaMenuLinkProps;
};

type Props = {
  logo: ImageProps;
  links: LinkProps[];
  buttons: ButtonProps[];
};

export type Navbar5Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Navbar5 = (props: Navbar5Props) => {
  const { logo, links, buttons } = {
    ...Navbar5Defaults,
    ...props,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");

  return (
    <section
      id="relume"
      className="relative z-[999] flex w-full items-center justify-between border-b border-border-primary bg-background-primary lg:min-h-18 lg:px-[5%]"
    >
      <div className="size-full lg:flex lg:items-center lg:justify-between">
        <div className="lg:flex">
          <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
            <a href={logo.url}>
              <img src={logo.src} alt={logo.alt} />
            </a>
            <button
              className="-mr-2 flex size-12 flex-col items-center justify-center lg:hidden"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                variants={topLineVariants}
              />
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={middleLineVariants}
              />
              <motion.span
                className="my-[3px] h-0.5 w-6 bg-black"
                animate={isMobileMenuOpen ? ["open", "rotatePhase"] : "closed"}
                variants={bottomLineVariants}
              />
            </button>
          </div>
          <motion.div
            variants={{
              open: {
                height: "var(--height-open, 100dvh)",
              },
              close: {
                height: "var(--height-closed, 0)",
              },
            }}
            initial="close"
            exit="close"
            animate={isMobileMenuOpen ? "open" : "close"}
            transition={{ duration: 0.4 }}
            className="overflow-auto px-[5%] lg:ml-6 lg:flex lg:items-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
          >
            {links.map((link, index) =>
              link.megaMenu ? (
                <SubMenu
                  key={index}
                  megaMenu={link.megaMenu}
                  title={link.title}
                  isMobile={isMobile}
                />
              ) : (
                <a
                  key={index}
                  href={link.url}
                  className="block py-3 text-md first:pt-7 lg:px-4 lg:py-6 lg:text-base first:lg:pt-6"
                >
                  {link.title}
                </a>
              ),
            )}
            <div className="mt-6 flex w-full flex-col gap-y-4 pb-24 lg:hidden lg:pb-0">
              {buttons.map((button, index) => (
                <Button key={index} className="w-full" {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="hidden lg:flex lg:gap-4">
          {buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
const SubMenu = ({
  title,
  isMobile,
  megaMenu,
}: {
  title: string;
  isMobile: boolean;
  megaMenu: MegaMenuLinkProps;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
      onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
    >
      <button
        className="flex w-full items-center justify-between gap-x-2 py-3 text-center text-md lg:w-auto lg:flex-none lg:justify-start lg:px-4 lg:py-6 lg:text-base"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <motion.span
          variants={{
            rotated: { rotate: 180 },
            initial: { rotate: 0 },
          }}
          animate={isDropdownOpen ? "rotated" : "initial"}
          transition={{ duration: 0.3 }}
        >
          <RxChevronDown />
        </motion.span>
      </button>
      <motion.div
        variants={{
          open: {
            visibility: "visible",
            opacity: 1,
            height: "var(--height-open, auto)",
          },
          close: {
            visibility: "hidden",
            opacity: "0",
            height: "var(--height-close, 0)",
          },
        }}
        initial="close"
        exit="close"
        animate={isDropdownOpen ? "open" : "close"}
        transition={{ duration: 0.3 }}
        className="bottom-auto left-0 top-full w-full min-w-full max-w-full overflow-hidden bg-background-primary lg:absolute lg:w-[100vw] lg:border-b lg:border-border-primary lg:px-[5%] lg:[--height-close:auto]"
      >
        <div className="mx-auto flex size-full max-w-full items-center justify-between">
          <div className="w-full lg:flex">
            <div className="grid flex-1 gap-x-8 gap-y-6 py-4 pr-8 md:grid-cols-2 md:px-0 md:py-8 lg:py-8 lg:pr-8">
              {megaMenu.categoryLinks.map((group, index) => (
                <div
                  key={index}
                  className="grid auto-rows-max grid-cols-1 grid-rows-[max-content] gap-y-2 md:gap-y-4"
                >
                  <h4 className="text-sm font-semibold leading-[1.3]">{group.title}</h4>
                  {group.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="grid w-full grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                    >
                      <div className="flex size-6 flex-col items-center justify-center">
                        <img src={link.image.src} alt={link.image.alt} />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h5 className="font-semibold">{link.title}</h5>
                        <p className="hidden text-sm md:block">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <div className="max-w-none relative flex flex-1 p-6 md:py-8 md:pl-8 md:pr-0 lg:max-w-md">
              <div className="relative z-10 grid w-full auto-cols-fr auto-rows-max grid-cols-1 grid-rows-[max-content_max-content] gap-4">
                <h4 className="text-sm font-semibold leading-[1.3]">
                  {megaMenu.featuredSections.title}
                </h4>
                <div className="grid auto-cols-fr grid-cols-1 grid-rows-[auto_auto] items-start gap-y-2 lg:grid-rows-[auto]">
                  {megaMenu.featuredSections.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="flex auto-cols-fr grid-cols-[0.6fr_1fr] flex-col gap-x-6 py-2 md:grid"
                    >
                      <div className="relative w-full pt-[66.66%]">
                        <img
                          src={link.image.src}
                          alt={link.image.alt}
                          className="absolute inset-0 size-full object-cover"
                        />
                      </div>
                      <div className="rt-4 mt-4 flex flex-col justify-start md:mt-0">
                        <h5 className="mb-1 font-semibold">{link.title}</h5>
                        <p className="text-sm">{link.description}</p>
                        {link.button && (
                          <div className="mt-1.5">
                            <Button {...link.button} className="text-sm underline">
                              {link.button.title}
                            </Button>
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
                <div className="flex items-center">
                  <Button {...megaMenu.button}>{megaMenu.button.title}</Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-auto top-0 min-w-full bg-background-secondary lg:min-w-[100vw]" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Navbar5Defaults: Props = {
  logo: {
    url: "#",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Logo image",
  },
  links: [
    { title: "Link One", url: "#" },
    { title: "Link Two", url: "#" },
    { title: "Link Three", url: "#" },
    {
      title: "Link Four",
      url: "#",
      megaMenu: {
        categoryLinks: [
          {
            title: "Page group one",
            links: [
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 1",
                },
                title: "Page One",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 2",
                },
                title: "Page Two",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 3",
                },
                title: "Page Three",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 4",
                },
                title: "Page Four",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
            ],
          },
          {
            title: "Page group two",
            links: [
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 5",
                },
                title: "Page Five",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 6",
                },
                title: "Page Six",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 7",
                },
                title: "Page Seven",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
              {
                url: "#",
                image: {
                  src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
                  alt: "Icon 8",
                },
                title: "Page Eight",
                description: "Lorem ipsum dolor sit amet consectetur elit",
              },
            ],
          },
        ],
        featuredSections: {
          title: "Featured from Blog",
          links: [
            {
              url: "#",
              image: {
                src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
                alt: "Relume placeholder image 1",
              },
              title: "Article Title",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              button: { title: "Read more", variant: "link", size: "link" },
            },
            {
              url: "#",
              image: {
                src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
                alt: "Relume placeholder image 2",
              },
              title: "Article Title",
              description: "Lorem ipsum dolor sit amet consectetur elit",
              button: { title: "Read more", variant: "link", size: "link" },
            },
          ],
        },
        button: {
          title: "See all articles",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      },
    },
  ],
  buttons: [
    {
      title: "Button",
      variant: "secondary",
      size: "sm",
    },
    {
      title: "Button",
      size: "sm",
    },
  ],
};

const topLineVariants = {
  open: {
    translateY: 8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: -45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};

const middleLineVariants = {
  open: {
    width: 0,
    transition: { duration: 0.1 },
  },
  closed: {
    width: "1.5rem",
    transition: { delay: 0.3, duration: 0.2 },
  },
};

const bottomLineVariants = {
  open: {
    translateY: -8,
    transition: { delay: 0.1 },
  },
  rotatePhase: {
    rotate: 45,
    transition: { delay: 0.2 },
  },
  closed: {
    translateY: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};
