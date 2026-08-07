import { type ComponentProps, type FC, type HTMLAttributes, type ReactNode, useMemo } from "react";
import { type BaseLayoutProps, renderTitleNav, resolveLinkItems } from "../shared";
import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarDrawer,
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
  NavbarMorphContainer,
  SidebarEnabledFromPageProvider,
  SidebarEnabledGate,
} from "./client";
import { LargeSearchToggle, SearchToggle } from "../search-toggle";
import { isLinkItemVisibleOn } from "../link-item-visibility";
import { LinkItem, type ButtonItemType, type LinkItemType } from "../link-item";
import type { SidebarPageTreeComponents } from "../sidebar/page-tree";
import { getSidebarTabs } from "../sidebar/tabs";
import { SidebarTabsDropdown, type SidebarTabWithProps } from "../sidebar/tabs/dropdown";
import { AIChatSidebar } from "@/components/ai-chat-sidebar";
import { PaperGround } from "@/components/chrome/paper-ground";

/**
 * The eclipse `ink` button, spelled out in classes because the navbar's links go
 * through `LinkItem` (active state + UTM propagation) rather than a `<Button>`.
 * Values are the eclipse variant verbatim:
 * `packages/eclipse/src/components/button.tsx`.
 */
const inkPill =
  "inline-flex h-8 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap shadow-box-low transition-transform duration-300 hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100";

/** Pill hit area for the navbar's icon-sized controls. */
const navIconPill = "rounded-full text-fd-muted-foreground hover:text-fd-foreground";

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

  /**
   * Show or hide the sidebar entirely. When false, the sidebar column is hidden
   * and no sidebar toggle is shown in the navbar.
   *
   * @defaultValue true
   */
  enabled?: boolean;
}

export function DocsLayout(props: DocsLayoutProps) {
  const {
    nav = {},
    sidebar: {
      tabs: tabOptions,
      defaultOpenLevel,
      prefetch,
      enabled: sidebarEnabled = true,
      ...sidebarProps
    } = {},
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

    const menuLinks = links.filter(
      (item) => item.type !== "icon" && item.type !== "button" && isLinkItemVisibleOn(item, "menu"),
    );
    const iconLinks = links.filter(
      (item): item is Extract<LinkItemType, { type: "icon" }> =>
        item.type === "icon" && isLinkItemVisibleOn(item, "nav"),
    );
    const navButtons = links.filter(
      (item): item is ButtonItemType => item.type === "button" && isLinkItemVisibleOn(item, "nav"),
    );
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
            <SidebarTabsDropdown links={menuLinks} className={cn("lg:hidden")} />
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
                  }),
                  navIconPill,
                  "lg:hidden",
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
                }),
                navIconPill,
                "ms-auto",
              )}
            >
              <X />
            </SidebarTrigger>
            {menuLinks.length > 0 && <SidebarTabsDropdown links={menuLinks} />}
          </Header>
          {navButtons.length > 0 && (
            <div className="flex flex-col gap-2 px-4 pb-3">
              {navButtons.map((item, i) => (
                <LinkItem
                  key={i}
                  item={item}
                  className={cn(
                    inkPill,
                    "w-full",
                    item.secondary
                      ? "bg-background-neutral-reverse-strong text-foreground-neutral-reverse"
                      : "bg-fd-primary text-fd-primary-foreground",
                  )}
                >
                  {item.text}
                </LinkItem>
              ))}
            </div>
          )}
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
                  navIconPill,
                  "lg:hidden",
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
          <SidebarEnabledFromPageProvider layoutEnabled={sidebarEnabled}>
            <LayoutBody {...props.containerProps}>
              {/* brand ground: grain over the paper + the prism ray crossing
                  behind the reading sheet. First child so every painted grid
                  surface (sheet, header, sidebar pills) stacks above it. */}
              <PaperGround />
              <SidebarEnabledGate>{sidebarEnabled ? sidebar() : null}</SidebarEnabledGate>
              <DocsNavbar {...props} links={links} tabs={tabs} />
              {props.children}
            </LayoutBody>
          </SidebarEnabledFromPageProvider>
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
  const menuLinks = links.filter(
    (item) =>
      item.type !== "icon" &&
      item.type !== "custom" &&
      item.type !== "button" &&
      isLinkItemVisibleOn(item, "menu"),
  );
  const customLinks = links.filter(
    (item) => item.type === "custom" && isLinkItemVisibleOn(item, "nav"),
  );
  const iconLinks = links
    .filter(
      (item): item is Extract<LinkItemType, { type: "icon" }> =>
        item.type === "icon" && isLinkItemVisibleOn(item, "nav"),
    )
    .reverse();
  const navButtons = links.filter(
    (item): item is ButtonItemType => item.type === "button" && isLinkItemVisibleOn(item, "nav"),
  );
  const showLayoutTabs = menuLinks.length > 0;

  return (
    <LayoutHeader
      id="nd-subnav"
      className={cn(
        "sticky [grid-area:header] flex flex-col top-(--fd-docs-row-1) z-10 border-b transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        // Docked: the strip itself is the bar — translucent paper-white with a
        // hairline bottom edge, content blurring underneath it.
        "data-[floating=false]:border-stroke-neutral data-[floating=false]:backdrop-blur-sm data-[floating=false]:data-[transparent=false]:bg-fd-background/80",
        // Floating: the strip gets out of the way (visually and for the pointer)
        // and the container inside becomes the glass panel.
        "data-[floating=true]:border-transparent data-[floating=true]:bg-transparent data-[floating=true]:backdrop-blur-none data-[floating=true]:pointer-events-none",
        // `--fd-header-height` stays authoritative — it feeds --fd-docs-row-2/3,
        // i.e. the sidebar and TOC sticky offsets. It is the strip's real height:
        // 8px (my-2) + 1px border + 56px body row + 1px border + 8px + 1px
        // strip border-b = 75px, plus the 40px tabs row where it renders.
        "layout:[--fd-header-height:75px]",
        showLayoutTabs && "lg:layout:[--fd-header-height:115px]",
      )}
    >
      <NavbarMorphContainer twoRows={showLayoutTabs}>
        <div data-header-body="" className="flex px-4 gap-4 h-14 md:px-6 justify-between">
          <div className="items-center flex flex-1">
            {renderTitleNav(nav, {
              href: nav?.url ?? "/",
              className: cn("inline-flex items-center gap-2.5 font-semibold"),
            })}
            {nav.children}
          </div>
          {searchToggle.enabled !== false &&
            (searchToggle.components?.lg ? (
              <div className={cn("w-full my-auto max-md:hidden", "rounded-full max-w-sm")}>
                {searchToggle.components.lg}
              </div>
            ) : (
              <LargeSearchToggle
                hideIfDisabled
                className={cn("flex-1 mx-1 my-auto max-md:hidden", "max-w-sm ps-3.5")}
              />
            ))}
          <div className="flex flex-1 items-center justify-end gap-2">
            {/* `display: contents`, so the trigger stays a flex item of this row —
              this only reaches into a component another owner maintains to give
              its trigger the navbar's pill hit area. The chat panel itself is
              portalled to <body> and is untouched by this. */}
            <div className="contents [&_button]:rounded-full">
              <AIChatSidebar />
            </div>
            <div className="flex items-center gap-2 max-md:hidden">
              {customLinks.map((item, i) => (
                <NavbarLinkItem key={i} item={item} />
              ))}
              {/* {i18n && ( */}
              {/*   <LanguageToggle> */}
              {/*     <Languages className="size-4.5 text-fd-muted-foreground" /> */}
              {/*   </LanguageToggle> */}
              {/* )} */}
              <div className="flex items-center gap-2 max-md:hidden">
                {iconLinks.map((item, i) => (
                  <LinkItem
                    key={i}
                    item={item}
                    className={cn(
                      buttonVariants({ size: "icon-sm", variant: "ghost" }),
                      navIconPill,
                    )}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </LinkItem>
                ))}
                {navButtons.map((item, i) => (
                  <LinkItem
                    key={`button-${i}`}
                    item={item}
                    className={cn(
                      inkPill,
                      item.secondary
                        ? "bg-background-neutral-reverse-strong text-foreground-neutral-reverse"
                        : "bg-fd-primary text-fd-primary-foreground",
                    )}
                  >
                    {item.text}
                  </LinkItem>
                ))}
              </div>

              {themeSwitch.enabled !== false && (
                <ThemeToggle mode={themeSwitch.mode ?? "light-dark-system"} />
              )}
              <SidebarEnabledGate>
                {sidebarCollapsible && (
                  <SidebarCollapseTrigger
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        size: "icon-sm",
                      }),
                      navIconPill,
                      "border-stroke-neutral -me-1.5",
                    )}
                  >
                    <SidebarIcon />
                  </SidebarCollapseTrigger>
                )}
              </SidebarEnabledGate>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              {searchToggle.enabled !== false &&
                (searchToggle.components?.sm ?? (
                  <SearchToggle hideIfDisabled className={cn("p-2", navIconPill)} />
                ))}
              <SidebarTrigger
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "icon-sm",
                  }),
                  navIconPill,
                  "p-2 -me-1.5",
                )}
              >
                <SidebarIcon />
              </SidebarTrigger>
            </div>
          </div>
        </div>
        {showLayoutTabs && (
          <LayoutHeaderTabs
            data-header-tabs=""
            className="overflow-x-auto px-6 h-10 max-lg:hidden"
            links={menuLinks}
          />
        )}
      </NavbarMorphContainer>
    </LayoutHeader>
  );
}
