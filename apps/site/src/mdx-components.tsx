import Link from "next/link";
import Image from "next/image";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import * as icons from "lucide-react";
import {
  Accordion,
  Accordions,
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
    ...components,
  };
}
