import defaultMdxComponents from "fumadocs-ui/mdx";
import { APIPage } from "@/components/api-page";
import { withDocsBasePath } from "@/lib/urls";

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
} from "@prisma-docs/eclipse";

function withDocsBasePathForImageSrc(src: unknown): unknown {
  if (typeof src !== "string") return src;
  if (!src.startsWith("/")) return src;
  if (src.startsWith("/_next/")) return src;
  return withDocsBasePath(src);
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const mdxComponents = {
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
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    CodeBlockTab,
    Accordion,
    Accordions,
    APIPage,
    img: (props: any) => (
      <ImageZoom
        {...(props as any)}
        src={withDocsBasePathForImageSrc((props as any).src)}
      />
    ),
    input: (props: any) => <Input {...props} />,
  };

  const pageContext = (components as any)?._pageContext;

  return {
    ...mdxComponents,
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
  };
}
