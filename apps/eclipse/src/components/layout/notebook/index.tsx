import { type ComponentProps, type FC, type HTMLAttributes, type ReactNode, useMemo } from "react";
import { type BaseLayoutProps, renderTitleNav, resolveLinkItems } from "../shared";
import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarDrawer,
  SidebarLinkItem,
  SidebarPageTree,
  SidebarTrigger,
  SidebarViewport,
} from "./sidebar";
import { TreeContextProvider } from "@fumadocs/base-ui/contexts/tree";
import { cn } from "@prisma-docs/ui/lib/cn";
import { buttonVariants } from "../../ui/button";
import { Languages, Sidebar as SidebarIcon, X } from "lucide-react";
import { LanguageToggle } from "../language-toggle";
import { ThemeToggle } from "../theme-toggle";
import type * as PageTree from "fumadocs-core/page-tree";
import {
  LayoutBody,
  LayoutContextProvider,
  LayoutHeader,
  LayoutHeaderTabs,
  NavbarLinkItem,
} from "./client";
import { LargeSearchToggle, SearchToggle } from "../search-toggle";
import { LinkItem, type LinkItemType } from "../link-item";
import type { SidebarPageTreeComponents } from "../sidebar/page-tree";
import { getSidebarTabs } from "../sidebar/tabs";
import { SidebarTabsDropdown, type SidebarTabWithProps } from "../sidebar/tabs/dropdown";

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  nav?: BaseLayoutProps["nav"];

  sidebar?: SidebarOptions;

  containerProps?: HTMLAttributes<HTMLDivElement>;
}

interface SidebarOptions
  extends
    ComponentProps<"aside">,
    Pick<ComponentProps<typeof Sidebar>, "defaultOpenLevel" | "prefetch"> {
  components?: Partial<SidebarPageTreeComponents>;

  /**
   * Root Toggle options
   */
  tabs?: SidebarTabWithProps[] | false;

  banner?: ReactNode | FC<ComponentProps<"div">>;
  footer?: ReactNode | FC<ComponentProps<"div">>;

  /**
   * Support collapsing the sidebar on desktop mode
   *
   * @defaultValue true
   */
  collapsible?: boolean;
}

export function DocsLayout(props: DocsLayoutProps) {
  const {
    nav = {},
    sidebar: { tabs: tabOptions, defaultOpenLevel, prefetch, ...sidebarProps } = {},
    i18n = false,
    themeSwitch = {},
    tree,
  } = props;

  const links = resolveLinkItems(props);
  const tabs = useMemo(() => {
    return getSidebarTabs(tree);
  }, [tabOptions, tree]);

  function sidebar() {
    const { banner, footer, components, collapsible = true, ...rest } = sidebarProps;

    const iconLinks = links.filter((item) => item.type === "icon");
    const Header =
      typeof banner === "function"
        ? banner
        : ({ className, ...props }: ComponentProps<"div">) => (
            <div className={cn("flex flex-col gap-3 p-4 pb-2 empty:hidden", className)} {...props}>
              {props.children}
              {banner}
            </div>
          );
    const Footer =
      typeof footer === "function"
        ? footer
        : ({ className, ...props }: ComponentProps<"div">) => (
            <div
              className={cn(
                "hidden flex-row text-fd-muted-foreground items-center border-t p-4 pt-2",
                iconLinks.length > 0 && "max-lg:flex",
                className,
              )}
              {...props}
            >
              {props.children}
              {footer}
            </div>
          );
    const viewport = (
      <SidebarViewport>
        <SidebarPageTree {...components} />
      </SidebarViewport>
    );

    return (
      <>
        <SidebarContent {...rest}>
          <Header>
            {links.length > 0 && (
              <SidebarTabsDropdown
                links={links.filter((item) => item.type !== "icon")}
                className={cn("lg:hidden")}
              />
            )}
          </Header>
          {viewport}
          <Footer>
            {iconLinks.map((item, i) => (
              <LinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({
                    size: "icon-sm",
                    variant: "ghost",
                    className: "lg:hidden",
                  }),
                )}
                aria-label={item.label}
              >
                {item.icon}
              </LinkItem>
            ))}
          </Footer>
        </SidebarContent>
        <SidebarDrawer {...rest}>
          <Header>
            <SidebarTrigger
              className={cn(
                buttonVariants({
                  size: "icon-sm",
                  variant: "ghost",
                  className: "ms-auto text-fd-muted-foreground",
                }),
              )}
            >
              <X />
            </SidebarTrigger>
            {links.length > 0 && (
              <SidebarTabsDropdown links={links.filter((item) => item.type !== "icon")} />
            )}
          </Header>
          {viewport}
          <Footer
            className={cn(
              "hidden flex-row items-center justify-end",
              (i18n || themeSwitch.enabled !== false) && "flex",
              iconLinks.length > 0 && "max-lg:flex",
            )}
          >
            {iconLinks.map((item, i) => (
              <LinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({
                    size: "icon-sm",
                    variant: "ghost",
                  }),
                  "text-fd-muted-foreground lg:hidden",
                  i === iconLinks.length - 1 && "me-auto",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </LinkItem>
            ))}
            {i18n && (
              <LanguageToggle>
                <Languages className="size-4.5 text-fd-muted-foreground" />
              </LanguageToggle>
            )}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle mode={themeSwitch.mode ?? "light-dark-system"} />
              ))}
          </Footer>
        </SidebarDrawer>
      </>
    );
  }

  return (
    <TreeContextProvider tree={tree}>
      <LayoutContextProvider navTransparentMode={nav.transparentMode}>
        <Sidebar defaultOpenLevel={defaultOpenLevel} prefetch={prefetch}>
          <LayoutBody {...props.containerProps}>
            {sidebar()}
            <DocsNavbar {...props} links={links} tabs={tabs} />
            {props.children}
          </LayoutBody>
        </Sidebar>
      </LayoutContextProvider>
    </TreeContextProvider>
  );
}

function DocsNavbar({
  links,
  tabs,
  sidebar: { collapsible: sidebarCollapsible = true } = {},
  searchToggle = {},
  themeSwitch = {},
  nav = {},
  i18n,
}: DocsLayoutProps & {
  links: LinkItemType[];
  tabs: SidebarTabWithProps[];
}) {
  const showLayoutTabs = links.some((item) => item.type !== "icon");

  return (
    <LayoutHeader
      id="nd-subnav"
      className={cn(
        "sticky border-b [grid-area:header] flex flex-col top-(--fd-docs-row-1) z-10 backdrop-blur-sm transition-colors data-[transparent=false]:bg-fd-background/80 layout:[--fd-header-height:--spacing(14)]",
        showLayoutTabs && "lg:layout:[--fd-header-height:--spacing(24)]",
      )}
    >
      <div data-header-body="" className="flex border-b px-4 gap-2 h-14 md:px-6">
        <div className={cn("items-center", "flex flex-1")}>
          {renderTitleNav(nav, {
            className: cn("inline-flex items-center gap-2.5 font-semibold"),
          })}
          {nav.children}
        </div>
        {searchToggle.enabled !== false &&
          (searchToggle.components?.lg ? (
            <div className={cn("w-full my-auto max-md:hidden", "rounded-xl max-w-sm")}>
              {searchToggle.components.lg}
            </div>
          ) : (
            <LargeSearchToggle
              hideIfDisabled
              className={cn("w-full my-auto max-md:hidden", "rounded-xl max-w-sm ps-2.5")}
            />
          ))}
        <div className="flex flex-1 items-center justify-end md:gap-2">
          <div className="flex items-center gap-6 empty:hidden max-lg:hidden">
            {links
              .filter((item) => item.type === "custom")
              .map((item, i) => (
                <NavbarLinkItem key={i} item={item} />
              ))}
          </div>
          {links
            .filter((item) => item.type === "icon")
            .map((item, i) => (
              <LinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({ size: "icon-sm", variant: "ghost" }),
                  "text-fd-muted-foreground max-lg:hidden",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </LinkItem>
            ))}

          <div className="flex items-center md:hidden">
            {searchToggle.enabled !== false &&
              (searchToggle.components?.sm ?? <SearchToggle hideIfDisabled className="p-2" />)}
            <SidebarTrigger
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon-sm",
                  className: "p-2 -me-1.5",
                }),
              )}
            >
              <SidebarIcon />
            </SidebarTrigger>
          </div>

          <div className="flex items-center gap-2 max-md:hidden">
            {i18n && (
              <LanguageToggle>
                <Languages className="size-4.5 text-fd-muted-foreground" />
              </LanguageToggle>
            )}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle mode={themeSwitch.mode ?? "light-dark-system"} />
              ))}
            {sidebarCollapsible && (
              <SidebarCollapseTrigger
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "icon-sm",
                  }),
                  "text-fd-muted-foreground rounded-full -me-1.5",
                )}
              >
                <SidebarIcon />
              </SidebarCollapseTrigger>
            )}
          </div>
        </div>
      </div>
      {showLayoutTabs && (
        <LayoutHeaderTabs
          data-header-tabs=""
          className="overflow-x-auto border-b px-6 h-10 max-lg:hidden"
          links={links}
        />
      )}
    </LayoutHeader>
  );
}
