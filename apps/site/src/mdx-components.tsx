import Link from "next/link";
import Image from "next/image";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import * as icons from "lucide-react";
import {
  Accordion,
  Accordions,
  Alert,
  Button,
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
  Step,
  Steps,
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@prisma/eclipse";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const mdxComponents = {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Button,
    CodeBlockTab,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    Image,
    Link,
    Step,
    Steps,
    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    img: ({ src, ...props }: ComponentProps<"img">) =>
      typeof src === "string" ? <ImageZoom {...props} src={src} /> : null,
  };

  return {
    ...mdxComponents,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    CalloutTitle: ({ children }: { children: ReactNode }) => <>{children}</>,
    CalloutDescription: ({ children }: { children: ReactNode }) => <>{children}</>,
    CalloutContainer: ({
      type,
      children,
      icon,
      ...props
    }: {
      type?: string;
      children: ReactNode;
      icon?: ReactNode;
    }) => {
      const variantMap: Record<string, "ppg" | "note" | "error" | "success" | "warning"> = {
        ppg: "ppg",
        error: "error",
        success: "success",
        warning: "warning",
        info: "note",
        note: "note",
        tip: "success",
        danger: "error",
      };

      return (
        <Alert variant={variantMap[type ?? ""] || "note"} icon={icon} {...props}>
          {children}
        </Alert>
      );
    },
    ...components,
  };
}
