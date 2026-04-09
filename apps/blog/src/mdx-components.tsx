import Link from "next/link";
import Image from "next/image";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Quotes } from "@/components/Quote";
import { Hex } from "@/components/Hex";
import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import * as icons from "lucide-react";
import {
  Accordion,
  Accordions,
  Alert,
  Button,
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
  Steps,
  Step,
} from "@prisma/eclipse";
import { Youtube } from "@prisma-docs/ui/components/youtube";
import { TweetEmbedComp } from "@/components/TweetEmbed";
import { Meetup, MeetupList } from "@/components/Meetup";
import { Employee } from "@/components/Employee";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const mdxComponents = {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Button,
    Image,
    Link,
    Quotes,
    Hex,
    // Fumadocs tabs for manual usage (with items prop)
    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ...components,
    // Eclipse CodeBlock tab components - globally available for code blocks
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    CodeBlockTab,
    TweetEmbedComp,
    Youtube,
    Meetup,
    MeetupList,
    Employee,
    Steps,
    Step,
    img: (props: any) => (
      <ImageZoom
        {...(props as any)}
        src={withBlogBasePathForImageSrc((props as any).src)}
      />
    ),
  };

  return {
    ...mdxComponents,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    // Override Fumadocs Callout components with Eclipse Alert for alerts (:::ppg, :::error, :::success, :::warning)
    CalloutTitle: ({ children }: any) => <>{children}</>,
    CalloutDescription: ({ children }: any) => <>{children}</>,
    CalloutContainer: ({ type, children, icon, ...props }: any) => {
      const variantMap: Record<
        string,
        "ppg" | "error" | "success" | "warning"
      > = {
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
        <Alert variant={variantMap[type] || "ppg"} icon={icon} {...props}>
          {children}
        </Alert>
      );
    },
  };
}
