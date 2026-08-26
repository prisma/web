"use client";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";

import { cn } from "../lib/cn";
import { ChevronDownIcon } from "lucide-react";
import { useScrollThreshold } from "../hooks/use-scroll-threshold";
import { StarCount } from "./star-count";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { Action, Button } from "@prisma/eclipse";
import { trackCTA } from "../lib/analytics";

export interface WebNavigationLink {
  text: string;
  external?: boolean;
  url?: string;
  icon?: string;
  desc?: string;
  col?: number;
  sub?: Array<{
    text: string;
    external?: boolean;
    url: string;
    icon?: string;
    desc?: string;
  }>;
  buttonVariant?: "ppg" | "orm" | undefined;
}

function NavigationMenu({
  align = "start",
  mobileOpen,
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align"> & {
    mobileOpen?: boolean;
  }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useLayoutEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const updateStuckState = () => {
      setIsStuck(sentinel.getBoundingClientRect().top < 0);
    };

    updateStuckState();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: [0, 1] },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Fragment>
      <div aria-hidden="true" ref={sentinelRef} className="pointer-events-none h-px -mb-px" />
      <NavigationMenuPrimitive.Root
        data-slot="navigation-menu"
        data-stuck={isStuck ? "true" : "false"}
        className={cn(
          "z-10 top-0 sticky group/navigation-menu flex max-w-full mx-auto w-full p-4 flex-1 items-center justify-center px-4",
          mobileOpen && "p-0 md:p-4! md-px-4!",
          className,
        )}
        {...props}
      >
        {children}
        <NavigationMenuPositioner align={align} />
      </NavigationMenuPrimitive.Root>
    </Fragment>
  );
}

function NavigationWrapper({
  className,
  mobileOpen,
  ...props
}: React.ComponentPropsWithRef<"div"> & { mobileOpen?: boolean }) {
  return (
    <div
      data-slot="navigation-wrapper"
      className={cn(
        "max-w-7xl w-full mx-auto py-3 px-6 shadow-box-high bg-background-default/50 [backdrop-filter:blur(3)] rounded-square-high flex justify-between align-center transition-[max-width] duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)] group-data-[stuck=true]/navigation-menu:max-w-235",
        mobileOpen && "py-7 px-10 rounded-none md:py-3! md:px-6! md:rounded-square-high",
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("gap-4 group flex flex-1 list-none items-center last:justify-end", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative font-semibold", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "bg-transparent rounded-none! px-2.5 py-1.5 text-base font-semibold transition-all focus-visible:ring-1 focus-visible:outline-1 disabled:opacity-50 group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center disabled:pointer-events-none outline-none md:rounded-square! md:overflow-hidden cursor-pointer focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        ppg: "hover:bg-background-ppg-strong data-open:hover:bg-background-ppg-strong data-open:focus:bg-background-ppg-strong data-open:bg-background-ppg-strong data-popup-open:bg-background-ppg-strong data-popup-open:hover:bg-background-ppg-strong",
        orm: "hover:bg-background-orm-strong data-open:hover:bg-background-orm-strong data-open:focus:bg-background-orm-strong data-open:bg-background-orm-strong data-popup-open:bg-background-orm-strong data-popup-open:hover:bg-background-orm-strong",
      },
    },
    defaultVariants: {
      variant: "ppg",
    },
  },
);

function NavigationMenuTrigger({
  className,
  children,
  variant = "ppg",
  ...props
}: NavigationMenuPrimitive.Trigger.Props & {
  variant?: "ppg" | "orm";
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger text-foreground-neutral"
      className={cn(navigationMenuTriggerStyle({ variant }), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 group-data-[viewport=false]/navigation-menu:bg-background-default group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:ring-foreground/10 p-2 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:rounded-none group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:duration-300 data-ending-style:data-activation-direction=left:translate-x-[50%] data-ending-style:data-activation-direction=right:translate-x-[-50%] data-starting-style:data-activation-direction=left:translate-x-[-50%] data-starting-style:data-activation-direction=right:translate-x-[50%] h-full w-auto transition-[opacity,transform,translate] duration-[0.35s] data-ending-style:opacity-0 data-starting-style:opacity-0 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none rounded-square",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "ease-[cubic-bezier(0.22,1,0.36,1)] data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] data-instant:transition-none",
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="bg-background-default text-popover-foreground ring-foreground/10 rounded-square shadow shadow-box-high outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0 data-[ending-style]:easing-[ease] xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({
  className,
  variant = "ppg",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  variant?: "ppg" | "orm";
}) {
  const variantClasses =
    variant === "orm"
      ? "data-active:focus:bg-background-orm-strong data-active:hover:bg-background-orm-strong data-active:bg-background-orm-strong hover:bg-background-orm-strong"
      : "data-active:focus:bg-background-ppg-strong data-active:hover:bg-background-ppg-strong data-active:bg-background-ppg-strong hover:bg-background-ppg-strong";

  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "focus-visible:ring-ring/50 flex items-center gap-2 rounded-none p-2 text-base transition-all outline-none focus-visible:ring-1 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-none [&_svg:not([class*='size-'])]:size-4 md:rounded-square",
        variantClasses,
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="bg-border rounded-none shadow-md relative top-[60%] h-2 w-2 rotate-45" />
    </NavigationMenuPrimitive.Icon>
  );
}

function Socials({
  className,
  include,
}: {
  className?: string;
  include?: Array<string> | "all" | undefined;
}) {
  const scroll = useScrollThreshold(64);

  return (
    <div
      className={cn(
        "gap-4 align-center lg:flex! sm:flex md:hidden! hidden",
        scroll && "md:hidden! lg:hidden!",
        className,
      )}
    >
      <NavigationMenuItem>
        <NavigationMenuLink
          href="https://pris.ly/github"
          className="font-family-mono p-0 leading-5.5 hover:bg-revert cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path
              fill="currentColor"
              d="M16 .396c-8.839 0-16 7.167-16 16c0 7.073 4.584 13.068 10.937 15.183c.803.151 1.093-.344 1.093-.772c0-.38-.009-1.385-.015-2.719c-4.453.964-5.391-2.151-5.391-2.151c-.729-1.844-1.781-2.339-1.781-2.339c-1.448-.989.115-.968.115-.968c1.604.109 2.448 1.645 2.448 1.645c1.427 2.448 3.744 1.74 4.661 1.328c.14-1.031.557-1.74 1.011-2.135c-3.552-.401-7.287-1.776-7.287-7.907c0-1.751.62-3.177 1.645-4.297c-.177-.401-.719-2.031.141-4.235c0 0 1.339-.427 4.4 1.641a15.436 15.436 0 0 1 4-.541c1.36.009 2.719.187 4 .541c3.043-2.068 4.381-1.641 4.381-1.641c.859 2.204.317 3.833.161 4.235c1.015 1.12 1.635 2.547 1.635 4.297c0 6.145-3.74 7.5-7.296 7.891c.556.479 1.077 1.464 1.077 2.959c0 2.14-.02 3.864-.02 4.385c0 .416.28.916 1.104.755c6.4-2.093 10.979-8.093 10.979-15.156c0-8.833-7.161-16-16-16z"
            />
          </svg>

          <StarCount />
        </NavigationMenuLink>
      </NavigationMenuItem>
      {(include === "all" || include?.includes("discord")) && (
        <NavigationMenuItem className="align-center flex">
          <NavigationMenuLink
            className="p-0 hover:bg-revert cursor-pointer"
            href="https://pris.ly/discord"
            aria-label="Discord"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )}
      {(include === "all" || include?.includes("twitter")) && (
        <NavigationMenuItem className="align-center flex">
          <NavigationMenuLink className="p-0" href="https://pris.ly/x">
            <i className="fa-brands fa-x-twitter"></i>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )}
      {(include === "all" || include?.includes("youtube")) && (
        <NavigationMenuItem className="align-center flex">
          <NavigationMenuLink className="p-0" href="https://pris.ly/youtube">
            <i className="fa-brands fa-youtube"></i>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )}
      {(include === "all" || include?.includes("linkedin")) && (
        <NavigationMenuItem className="align-center flex">
          <NavigationMenuLink className="p-0" href="https://pris.ly/linkedin">
            <i className="fa-brands fa-square-linkedin"></i>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )}
    </div>
  );
}

function MenuNavigationItem({
  link,
  variant = "ppg",
}: {
  link: NonNullable<WebNavigationLink["sub"]>[number];
  variant?: "ppg" | "orm";
}) {
  const hoverClass =
    variant === "orm" ? "hover:bg-background-orm-strong" : "hover:bg-background-ppg-strong";
  const iconColor =
    variant === "orm" ? "text-background-orm-reverse" : "text-background-ppg-reverse";

  return (
    <NavigationMenuLink
      key={link.url}
      href={link.url}
      target={link.external ? "_blank" : "_self"}
      rel={link.external ? "noopener noreferrer" : undefined}
      variant={variant}
      className={cn(
        "flex gap-2 items-center justify-start w-full rounded-square! overflow-hidden",
        hoverClass,
      )}
    >
      {link.icon ? (
        <Action color={variant} size="3xl">
          <i className={cn(iconColor, link.icon)} />
        </Action>
      ) : null}
      <div className="flex flex-col gap-0">
        <span className="text-md font-semibold text-foreground-neutral">
          {link.text}
          {link.external && (
            <i className=" ml-1 fa-regular fa-arrow-up-right text-foreground-neutral text-sm" />
          )}
        </span>
        {link.desc ? <p className="text-xs text-foreground-neutral-weaker">{link.desc}</p> : null}
      </div>
    </NavigationMenuLink>
  );
}

// Add this new component before NavigationMobileMenu
function MobileMenuItemWithSubmenu({
  link,
  variant = "ppg",
}: {
  link: WebNavigationLink;
  variant?: "ppg" | "orm";
}) {
  const [isOpen, setOpen] = useState(false);

  const hoverClass =
    variant === "orm"
      ? "hover:bg-background-orm-strong! data-open:hover:bg-background-orm-strong! data-open:bg-background-orm-strong! data-popup-open:bg-background-orm-strong! data-popup-open:hover:bg-background-orm-strong!"
      : "hover:bg-background-ppg-strong! data-open:hover:bg-background-ppg-strong! data-open:bg-background-ppg-strong! data-popup-open:bg-background-ppg-strong! data-popup-open:hover:bg-background-ppg-strong!";
  const openClass = variant === "orm" ? "bg-background-orm-strong!" : "bg-background-ppg-strong!";

  return (
    <NavigationMenuItem key={link.text}>
      <NavigationMenuTrigger
        variant={variant}
        className={cn(
          "px-6 py-4 h-auto! rounded-square overflow-hidden w-full justify-start border-b border-stroke-neutral",
          hoverClass,
          isOpen && openClass,
        )}
        onClick={() => setOpen(!isOpen)}
      >
        {link.text}
      </NavigationMenuTrigger>
      {isOpen && link.sub && (
        <NavigationMenuList className="flex-col items-start bg-background-neutral-weaker p-2 gap-0 border-b border-stroke-neutral">
          {link.sub.map((sublink) => (
            <MenuNavigationItem link={sublink} key={sublink.url} variant={variant} />
          ))}
        </NavigationMenuList>
      )}
    </NavigationMenuItem>
  );
}

function NavigationMobileMenu({
  links,
  loginHref,
  signupHref,
  buttonVariant = "ppg",
}: {
  links: WebNavigationLink[];
  loginHref: string;
  signupHref: string;
  buttonVariant?: "ppg" | "orm";
}) {
  return (
    <div className="fixed px-0 md:hidden w-screen h-dvh pt-22 top-0 left-0 -z-1 bg-background-default flex flex-col justify-between">
      <div className="list pb-[130px] overflow-scroll">
        {links.map((link) =>
          link.url ? (
            <NavigationMenuItem key={link.url}>
              <NavigationMenuLink
                className="px-6 py-4  h-auto! hover:bg-background-neutral-weak border-b border-stroke-neutral"
                href={link.url}
              >
                {link.text}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : link.sub?.length ? (
            <MobileMenuItemWithSubmenu key={link.text} link={link} variant={buttonVariant} />
          ) : null,
        )}
      </div>
      <div className="h-min-content mx-auto w-full absolute bottom-0 left-0 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] px-4 bg-background-default justify-center items-center gap-6 flex flex-col">
        <Socials className="flex items-center justify-center" include="all" />
        <div className="grid gap-2 grid-cols-2 w-full">
          <NavigationMenuItem className="w-full">
            <Button asChild size="xl" variant="default-strong" className="w-full">
              <a
                href={loginHref}
                onClick={() =>
                  trackCTA({
                    cta_text: "Login",
                    cta_location: "navbar_mobile",
                    cta_destination: loginHref,
                  })
                }
              >
                Login
              </a>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Button asChild size="xl" variant={buttonVariant} className="whitespace-nowrap w-full">
              <a
                href={signupHref}
                onClick={() =>
                  trackCTA({
                    cta_text: "Get started",
                    cta_location: "navbar_mobile",
                    cta_destination: signupHref,
                  })
                }
              >
                Get started
              </a>
            </Button>
          </NavigationMenuItem>
        </div>
      </div>
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationWrapper,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
  NavigationMobileMenu,
  MenuNavigationItem,
  MobileMenuItemWithSubmenu,
  Socials,
};
