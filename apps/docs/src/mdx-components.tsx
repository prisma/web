import defaultMdxComponents from "fumadocs-ui/mdx";
import { Youtube } from "@prisma-docs/ui/components/youtube";
import { APIPage } from "@/components/api-page";
import { ConceptAnimation } from "@/components/concept-animation";
import {
  AgentPrompt,
  GetStartedTabs,
  HeroGrid,
  HeroPitch,
  IconGrid,
  IconLink,
  ModalRow,
  SectionRow,
  StackDiagram,
  StackLayer,
} from "@/components/getting-started";
import { withDocsBasePath } from "@/lib/urls";
import { cn } from "@prisma-docs/ui/lib/cn";

import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import * as icons from "lucide-react";
import {
  CodeBlock,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTab,
  Pre,
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  Accordions,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Input,
  Alert,
  Button,
} from "@prisma/eclipse";

function withDocsBasePathForImageSrc(src: unknown): unknown {
  if (typeof src !== "string") return src;
  if (!src.startsWith("/")) return src;
  if (src.startsWith("/_next/")) return src;
  return withDocsBasePath(src);
}

/**
 * Small technology logo for use inside Card icons and link grids.
 * Renders a plain img (no zoom) at a consistent size. Pass `darkSrc` for a
 * dedicated dark-mode asset, or `invertDark` for monochrome logos that only
 * need inverting.
 */
function TechIcon({
  src,
  alt,
  darkSrc,
  invertDark,
}: {
  src: string;
  alt: string;
  darkSrc?: string;
  invertDark?: boolean;
}) {
  const base = "size-6 max-w-6 object-contain";
  if (darkSrc) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withDocsBasePath(src)} alt={alt} className={`${base} dark:hidden`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withDocsBasePath(darkSrc)}
          alt={alt}
          className={`${base} hidden dark:block`}
          aria-hidden="true"
        />
      </>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withDocsBasePath(src)}
      alt={alt}
      className={`${base}${invertDark ? " dark:invert" : ""}`}
    />
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const pageContext = (components as any)?._pageContext;

  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    // Fumadocs tabs for manual usage (with items prop)
    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ...components,
    // Eclipse CodeBlock tab components - globally available for code blocks
    Button,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    CodeBlockTab,
    Accordion,
    Accordions,
    APIPage,
    AgentPrompt,
    ConceptAnimation,
    GetStartedTabs,
    HeroGrid,
    HeroPitch,
    IconGrid,
    IconLink,
    ModalRow,
    SectionRow,
    StackDiagram,
    StackLayer,
    TechIcon,
    Youtube,
    img: (props: any) => (
      <ImageZoom {...(props as any)} src={withDocsBasePathForImageSrc((props as any).src)} />
    ),
    input: (props: any) => <Input {...props} />,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    table: ({ ref: _ref, ...props }) => <Table {...props} />,
    thead: ({ ref: _ref, ...props }) => <TableHeader {...props} />,
    tbody: ({ ref: _ref, ...props }) => <TableBody {...props} />,
    tfoot: ({ ref: _ref, ...props }) => <TableFooter {...props} />,
    tr: ({ ref: _ref, ...props }) => <TableRow {...props} />,
    th: ({ ref: _ref, ...props }) => <TableHead {...props} />,
    td: ({ ref: _ref, ...props }) => <TableCell {...props} />,
    caption: ({ ref: _ref, ...props }) => <TableCaption {...props} />,
    // Override Fumadocs Callout components with Eclipse Alert for alerts (:::ppg, :::error, :::success, :::warning)
    CalloutTitle: ({ children }: any) => <div className="mb-3 font-semibold">{children}</div>,
    CalloutDescription: ({ children }: any) => <>{children}</>,
    CalloutContainer: ({ type, children, icon, className, ...props }: any) => {
      const variantMap: Record<string, "ppg" | "error" | "success" | "warning"> = {
        ppg: "ppg",
        error: "error",
        success: "success",
        warning: "warning",
        info: "ppg",
        note: "ppg",
        tip: "success",
        danger: "error",
      };

      return (
        <Alert
          variant={variantMap[type] || "ppg"}
          icon={icon}
          // Roomier vertical rhythm: admonition prose was rendering cramped
          // against the compact type-text-sm default.
          className={cn(
            "gap-x-3.5 px-5 py-4 [&_li]:my-1.5 [&_ol]:my-3 [&_p]:my-3 [&_p]:leading-7 [&_ul]:my-3",
            className,
          )}
          {...props}
        >
          {children}
        </Alert>
      );
    },
  };
}
